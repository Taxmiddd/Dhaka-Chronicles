import { supabaseAdmin } from '@/lib/db/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

/** POST /api/polls/[id]/vote — vote on a poll */
export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params
  const { option_id } = await req.json().catch(() => ({}))

  if (!option_id) {
    return NextResponse.json({ error: 'Option ID is required' }, { status: 400 })
  }

  // Use IP for guest voting control
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown'

  // Check if poll is active
  const { data: poll } = await supabaseAdmin.from('polls').select('is_active, starts_at, ends_at').eq('id', id).single()
  
  if (!poll || !poll.is_active) {
    return NextResponse.json({ error: 'Poll is closed' }, { status: 400 })
  }

  if (poll.starts_at && new Date() < new Date(poll.starts_at)) {
    return NextResponse.json({ error: 'Poll has not started yet' }, { status: 400 })
  }

  if (poll.ends_at && new Date() > new Date(poll.ends_at)) {
    return NextResponse.json({ error: 'Poll has ended' }, { status: 400 })
  }

  // Check if user already voted (by IP)
  const { data: existingVote } = await supabaseAdmin
    .from('poll_votes')
    .select('id')
    .eq('poll_id', id)
    .eq('ip_address', ip)
    .maybeSingle()

  if (existingVote) {
    return NextResponse.json({ error: 'You have already voted on this poll' }, { status: 400 })
  }

  // Record vote
  const { error: voteError } = await supabaseAdmin.from('poll_votes').insert({
    poll_id: id,
    option_id,
    ip_address: ip,
  })

  if (voteError) return NextResponse.json({ error: voteError.message }, { status: 500 })

  // Increment option vote count and poll total vote count (we can do this in a single RPC, but for simplicity we'll do two updates, or just rely on a DB trigger. We'll do direct updates here since we don't have triggers specified for this.)
  try {
    const { error: rpcError } = await supabaseAdmin.rpc('increment_poll_vote', { p_poll_id: id, p_option_id: option_id })
    if (rpcError) throw rpcError
  } catch (err) {
     // Fallback if RPC doesn't exist
     const { data: opt } = await supabaseAdmin.from('poll_options').select('vote_count').eq('id', option_id).single()
     if(opt) await supabaseAdmin.from('poll_options').update({ vote_count: opt.vote_count + 1 }).eq('id', option_id)
     
     const { data: p } = await supabaseAdmin.from('polls').select('total_votes').eq('id', id).single()
     if(p) await supabaseAdmin.from('polls').update({ total_votes: p.total_votes + 1 }).eq('id', id)
  }

  return NextResponse.json({ success: true, message: 'Vote recorded' })
}

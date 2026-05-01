import { supabaseAdmin } from '@/lib/db/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

/** POST /api/comments/[id]/vote  body: { vote: 'up' | 'down' } */
export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const vote = body.vote as 'up' | 'down'

  if (vote !== 'up' && vote !== 'down') {
    return NextResponse.json({ error: 'vote must be "up" or "down"' }, { status: 400 })
  }

  // Fetch current comment
  const { data: comment, error: fetchErr } = await supabaseAdmin
    .from('comments')
    .select('id, upvotes, downvotes')
    .eq('id', id)
    .single()

  if (fetchErr || !comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  }

  const field = vote === 'up' ? 'upvotes' : 'downvotes'
  const current = vote === 'up' ? (comment.upvotes ?? 0) : (comment.downvotes ?? 0)

  const { error: updateErr } = await supabaseAdmin
    .from('comments')
    .update({ [field]: current + 1 })
    .eq('id', id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    upvotes: vote === 'up' ? current + 1 : (comment.upvotes ?? 0),
    downvotes: vote === 'down' ? current + 1 : (comment.downvotes ?? 0),
  })
}

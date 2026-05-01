import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** GET /api/admin/polls — fetch polls for admin dashboard */
export async function GET() {
  const user = await getSession()
  if (!user || !['founder', 'admin', 'publisher'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('polls')
    .select(`
      *,
      options:poll_options(*)
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ polls: data ?? [] })
}

/** POST /api/admin/polls — create a new poll */
export async function POST(req: Request) {
  const user = await getSession()
  if (!user || !['founder', 'admin', 'publisher'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const { question, question_bn, poll_type, is_active, starts_at, ends_at, options } = body

  if (!question || !options || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ error: 'Question and at least 2 options are required' }, { status: 400 })
  }

  // 1. Insert Poll
  const { data: poll, error: pollError } = await supabaseAdmin
    .from('polls')
    .insert({
      question,
      question_bn: question_bn || null,
      poll_type: poll_type || 'single',
      is_active: is_active ?? true,
      starts_at: starts_at || null,
      ends_at: ends_at || null,
      created_by: user.id,
    })
    .select()
    .single()

  if (pollError) return NextResponse.json({ error: pollError.message }, { status: 500 })

  // 2. Insert Options
  const optionInserts = options.map((opt: any, index: number) => ({
    poll_id: poll.id,
    option_text: opt.option_text,
    option_text_bn: opt.option_text_bn || null,
    display_order: index,
  }))

  const { data: pollOptions, error: optError } = await supabaseAdmin
    .from('poll_options')
    .insert(optionInserts)
    .select()

  if (optError) {
    // Attempt rollback if option insert fails
    await supabaseAdmin.from('polls').delete().eq('id', poll.id)
    return NextResponse.json({ error: optError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, poll: { ...poll, options: pollOptions } }, { status: 201 })
}

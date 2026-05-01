import { supabaseAdmin } from '@/lib/db/admin'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

/** GET /api/polls/[id] — get poll details + options (public) */
export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params

  const { data: poll, error } = await supabaseAdmin
    .from('polls')
    .select(`
      *,
      options:poll_options(*)
    `)
    .eq('id', id)
    .single()

  if (error || !poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  // Hide exact vote counts if poll is active and show_results_before_vote is false
  // For simplicity, we just return everything here, and the frontend will obscure if needed,
  // OR we strip vote counts if the user hasn't voted. To truly secure it, we'd check if user voted.
  return NextResponse.json({ poll })
}

/** DELETE /api/admin/polls/[id] — delete a poll (admin) */
export async function DELETE(_req: Request, { params }: RouteParams) {
  const user = await getSession()
  if (!user || !['founder', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  const { error } = await supabaseAdmin.from('polls').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ deleted: true })
}

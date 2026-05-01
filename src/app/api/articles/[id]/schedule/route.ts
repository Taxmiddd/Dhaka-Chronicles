import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/articles/[id]/schedule
 * Body: { scheduledFor: ISO date string }
 * Sets article status to 'scheduled' and stores the scheduled_for timestamp.
 */
export async function POST(req: Request, { params }: RouteParams) {
  const user = await getSession()
  if (!user || !['admin', 'founder', 'publisher'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { scheduledFor } = await req.json().catch(() => ({}))

  if (!scheduledFor) {
    return NextResponse.json({ error: 'scheduledFor (ISO date) is required' }, { status: 400 })
  }

  const date = new Date(scheduledFor)
  if (isNaN(date.getTime()) || date <= new Date()) {
    return NextResponse.json({ error: 'scheduledFor must be a future date' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('articles')
    .update({
      status: 'scheduled',
      scheduled_for: date.toISOString(),
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, title, status, scheduled_for')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

/**
 * DELETE /api/articles/[id]/schedule
 * Cancels a scheduled publish, reverting article to 'draft'.
 */
export async function DELETE(_req: Request, { params }: RouteParams) {
  const user = await getSession()
  if (!user || !['admin', 'founder', 'publisher'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  const { data, error } = await supabaseAdmin
    .from('articles')
    .update({
      status: 'draft',
      scheduled_for: null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, title, status')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

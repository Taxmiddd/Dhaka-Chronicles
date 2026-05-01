import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** GET /api/admin/calendar?from=YYYY-MM-DD&to=YYYY-MM-DD */
export async function GET(req: Request) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let query = supabaseAdmin
    .from('editorial_calendar')
    .select('id, title, event_type, start_date, end_date, color, article_id, assigned_to')
    .order('start_date', { ascending: true })

  if (from) query = query.gte('start_date', from)
  if (to) query = query.lte('start_date', `${to}T23:59:59`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ events: data ?? [] })
}

/** POST /api/admin/calendar — create a calendar event */
export async function POST(req: Request) {
  const user = await getSession()
  if (!user || !['admin', 'founder'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const { title, event_type, start_date, end_date, article_id, color } = body

  if (!title || !event_type || !start_date) {
    return NextResponse.json({ error: 'title, event_type, and start_date are required' }, { status: 400 })
  }

  const validTypes = ['article_deadline', 'scheduled_publish', 'meeting', 'event_coverage']
  if (!validTypes.includes(event_type)) {
    return NextResponse.json({ error: `event_type must be one of: ${validTypes.join(', ')}` }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('editorial_calendar')
    .insert({
      title,
      event_type,
      start_date: new Date(start_date).toISOString(),
      end_date: end_date ? new Date(end_date).toISOString() : null,
      article_id: article_id ?? null,
      color: color ?? null,
      assigned_to: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ event: data }, { status: 201 })
}

/** DELETE /api/admin/calendar?id=... */
export async function DELETE(req: Request) {
  const user = await getSession()
  if (!user || !['admin', 'founder'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabaseAdmin.from('editorial_calendar').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deleted: true })
}

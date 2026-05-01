import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

/** PATCH /api/admin/tips/[id] — update tip status/notes */
export async function PATCH(req: Request, { params }: RouteParams) {
  const user = await getSession()
  if (!user || !['founder', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { status, internal_notes } = body

  const updateData: any = { updated_at: new Date().toISOString() }
  if (status !== undefined) updateData.status = status
  if (internal_notes !== undefined) updateData.internal_notes = internal_notes

  const { data, error } = await supabaseAdmin
    .from('news_tips')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, tip: data })
}

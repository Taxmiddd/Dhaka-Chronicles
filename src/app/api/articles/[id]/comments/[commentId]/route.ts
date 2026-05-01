import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'

type Params = { params: Promise<{ commentId: string }> }

// PATCH — moderate a comment (approve/reject/mark spam)
export async function PATCH(request: Request, { params }: Params) {
  const user = await getSession()
  if (!user || !['admin', 'founder'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { commentId } = await params
  const { status } = await request.json()

  if (!['approved', 'rejected', 'spam'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('comments')
    .update({
      status,
      moderated_by: user.id,
      moderated_at: new Date().toISOString(),
    })
    .eq('id', commentId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If newly approved, bump article comment_count
  if (status === 'approved' && data?.article_id) {
    const { data: art } = await supabaseAdmin
      .from('articles')
      .select('comment_count')
      .eq('id', data.article_id)
      .single()
    if (art) {
      await supabaseAdmin
        .from('articles')
        .update({ comment_count: (art.comment_count || 0) + 1 })
        .eq('id', data.article_id)
    }
  }

  return NextResponse.json({ success: true, data })
}

// DELETE — hard delete a comment (admin only)
export async function DELETE(_req: Request, { params }: Params) {
  const user = await getSession()
  if (!user || !['admin', 'founder'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { commentId } = await params

  const { error } = await supabaseAdmin
    .from('comments')
    .update({ deleted_at: new Date().toISOString(), status: 'rejected' })
    .eq('id', commentId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

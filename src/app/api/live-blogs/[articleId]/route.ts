import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'

// GET all updates for a live blog
export async function GET(request: Request, { params }: { params: Promise<{ articleId: string }> }) {
  try {
    const { articleId } = await params
    const { data, error } = await supabaseAdmin
      .from('live_blog_updates')
      .select(`
        *,
        author:users ( id, full_name, avatar_url )
      `)
      .eq('article_id', articleId)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST a new update to a live blog
export async function POST(request: Request, { params }: { params: Promise<{ articleId: string }> }) {
  const session = await getSession()
  if (!session || !['admin', 'founder', 'publisher'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { articleId } = await params
    const { content, isPinned } = await request.json()
    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('live_blog_updates')
      .insert({
        article_id: articleId,
        content,
        author_id: session.id,
        is_pinned: isPinned || false
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

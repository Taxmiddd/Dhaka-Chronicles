import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** GET /api/reading-list — fetch saved articles for current user */
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('reading_lists')
    .select(`
      id,
      is_read,
      saved_at,
      article:articles(id, title, slug, excerpt, featured_image_url, published_at, category:categories(name))
    `)
    .eq('user_id', session.id)
    .order('saved_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data ?? [] })
}

/** POST /api/reading-list — save an article */
export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { articleId } = await req.json().catch(() => ({}))
  if (!articleId) return NextResponse.json({ error: 'articleId required' }, { status: 400 })

  const { error } = await supabaseAdmin.from('reading_lists').upsert(
    { user_id: session.id, article_id: articleId },
    { onConflict: 'user_id,article_id', ignoreDuplicates: true }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ saved: true }, { status: 201 })
}

/** DELETE /api/reading-list?articleId=... — remove from reading list */
export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const articleId = searchParams.get('articleId')
  if (!articleId) return NextResponse.json({ error: 'articleId required' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('reading_lists')
    .delete()
    .eq('user_id', session.id)
    .eq('article_id', articleId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ removed: true })
}

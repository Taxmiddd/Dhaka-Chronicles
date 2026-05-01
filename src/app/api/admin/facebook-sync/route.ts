import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'
import { slugify } from '@/lib/utils'

// GET all imported posts
export async function GET(request: Request) {
  const session = await getSession()
  if (!session || !['admin', 'founder', 'publisher'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'pending'
  const limit = parseInt(searchParams.get('limit') || '20')

  const { data, error, count } = await supabaseAdmin
    .from('facebook_imported_posts')
    .select('*', { count: 'exact' })
    .eq('import_status', status)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data, count })
}

// POST: Convert an imported post to a draft article
export async function POST(request: Request) {
  const session = await getSession()
  if (!session || !['admin', 'founder', 'publisher'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 })

    // Fetch the post
    const { data: post, error: postErr } = await supabaseAdmin
      .from('facebook_imported_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (postErr || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.import_status !== 'pending') {
      return NextResponse.json({ error: 'Post is already processed' }, { status: 400 })
    }

    // Convert to TipTap JSON
    const contentText = post.message || 'Imported Content'
    const title = contentText.split('\n')[0].substring(0, 80) || 'Facebook Post'
    const slug = slugify(title) + '-' + Math.random().toString(36).substring(2, 6)
    
    // Simple TipTap document structure with paragraph
    const tiptapContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: contentText }]
        }
      ]
    }

    // If there's an image or link, we could append it, but we'll use image as featured_image
    
    // Create draft article
    const { data: article, error: articleErr } = await supabaseAdmin
      .from('articles')
      .insert({
        title,
        slug,
        content: tiptapContent,
        excerpt: contentText.substring(0, 160),
        status: 'draft',
        article_type: 'news',
        featured_image_url: post.image_url || null,
        author_id: session.id,
      })
      .select()
      .single()

    if (articleErr) {
      return NextResponse.json({ error: articleErr.message }, { status: 500 })
    }

    // Update the facebook post status
    await supabaseAdmin
      .from('facebook_imported_posts')
      .update({
        import_status: 'imported',
        article_id: article.id
      })
      .eq('id', id)

    return NextResponse.json({ success: true, articleId: article.id })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH: Skip/Reject a post
export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session || !['admin', 'founder', 'publisher'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, status } = await request.json()
    if (!id || !['skipped', 'failed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('facebook_imported_posts')
      .update({ import_status: status })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

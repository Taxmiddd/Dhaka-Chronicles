import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'
import { ArticleSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = ArticleSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      )
    }

    const data = validated.data

    // If publishing, set published_at
    let published_at = null
    if (data.status === 'published') {
      published_at = new Date().toISOString()
    }

    const { data: newArticle, error } = await supabaseAdmin
      .from('articles')
      .insert({
        ...data,
        author_id: user.id,
        published_at,
        view_count: 0,
        unique_view_count: 0,
        share_count: 0,
        comment_count: 0,
        version: 1,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: newArticle })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

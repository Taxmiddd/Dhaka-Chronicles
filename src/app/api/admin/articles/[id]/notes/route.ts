import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  const { id } = await params
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { data, error } = await supabaseAdmin
      .from('editorial_notes')
      .select('*, author:users(full_name)')
      .eq('article_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { content } = await request.json()
    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('editorial_notes')
      .insert({
        article_id: id,
        author_id: session.id,
        content
      })
      .select('*, author:users(full_name)')
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

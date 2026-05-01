import { supabaseAdmin } from '@/lib/db/admin'
import { getSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** GET /api/admin/portfolio — list all portfolio items */
export async function GET() {
  const user = await getSession()
  if (!user || !['founder', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('portfolio_items')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data ?? [] })
}

/** POST /api/admin/portfolio — create a portfolio item */
export async function POST(req: Request) {
  const user = await getSession()
  if (!user || !['founder', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const { brand_name, project_name, category, description, outcome, logo_url, featured_image_url, external_link, is_published, display_order } = body

  if (!brand_name || !project_name || !category || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('portfolio_items')
    .insert({
      brand_name,
      project_name,
      category,
      description,
      outcome,
      logo_url,
      featured_image_url,
      external_link,
      is_published: is_published ?? true,
      display_order: display_order ?? 0
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}

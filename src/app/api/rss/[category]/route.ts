import { supabaseAdmin } from '@/lib/db/admin'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ category: string }>
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { category } = await params

  // Fetch the category record
  const { data: cat } = await supabaseAdmin
    .from('categories')
    .select('id, name, description')
    .eq('slug', category)
    .single()

  if (!cat) {
    return new Response('Category not found', { status: 404 })
  }

  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('title, slug, excerpt, published_at, featured_image_url')
    .eq('status', 'published')
    .eq('category_id', cat.id)
    .order('published_at', { ascending: false })
    .limit(50)

  const siteUrl = 'https://dhakachronicles.com'
  const now = new Date().toUTCString()
  const esc = (s: string) =>
    s.replace(/[<>&'"]/g, (c) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' } as Record<string, string>)[c] ?? c
    )

  const items = (articles || [])
    .map((a) => {
      const pubDate = a.published_at ? new Date(a.published_at).toUTCString() : now
      const desc = esc(a.excerpt || '')
      const title = esc(a.title || '')
      return `
    <item>
      <title>${title}</title>
      <link>${siteUrl}/news/${a.slug}</link>
      <guid isPermaLink="true">${siteUrl}/news/${a.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>
      <category>${esc(cat.name)}</category>
      ${a.featured_image_url ? `<enclosure url="${a.featured_image_url}" type="image/jpeg" />` : ''}
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Dhaka Chronicles — ${esc(cat.name)}</title>
    <link>${siteUrl}/category/${category}</link>
    <description>${esc(cat.description || `Latest ${cat.name} news from Dhaka Chronicles`)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss/${category}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

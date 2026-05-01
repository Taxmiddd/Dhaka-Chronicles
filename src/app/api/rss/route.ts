import { supabaseAdmin } from '@/lib/db/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('title, slug, excerpt, published_at, featured_image_url')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)

  const siteUrl = 'https://dhakachronicles.com'
  const now = new Date().toUTCString()

  const items = (articles || [])
    .map(a => {
      const pubDate = a.published_at ? new Date(a.published_at).toUTCString() : now
      const desc = (a.excerpt || '').replace(/[<>&'"]/g, (c: string) =>
        (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' } as Record<string, string>)[c] || c)
      )
      const title = (a.title || '').replace(/[<>&'"]/g, (c: string) =>
        (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' } as Record<string, string>)[c] || c)
      )
      return `
    <item>
      <title>${title}</title>
      <link>${siteUrl}/news/${a.slug}</link>
      <guid isPermaLink="true">${siteUrl}/news/${a.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>
      ${a.featured_image_url ? `<enclosure url="${a.featured_image_url}" type="image/jpeg" />` : ''}
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Dhaka Chronicles</title>
    <link>${siteUrl}</link>
    <description>Breaking news, in-depth analysis, and stories shaping Bangladesh.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/og-image.png</url>
      <title>Dhaka Chronicles</title>
      <link>${siteUrl}</link>
    </image>${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

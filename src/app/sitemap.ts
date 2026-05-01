import { supabaseAdmin } from '@/lib/db/admin'
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const siteUrl = 'https://dhakachronicles.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch published articles
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1000)

  // Fetch categories
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('slug, updated_at')

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${siteUrl}/news`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/podcasts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  const articlePages: MetadataRoute.Sitemap = (articles || []).map(a => ({
    url: `${siteUrl}/news/${a.slug}`,
    lastModified: new Date(a.updated_at || a.published_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map(c => ({
    url: `${siteUrl}/category/${c.slug}`,
    lastModified: new Date(c.updated_at || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...articlePages, ...categoryPages]
}

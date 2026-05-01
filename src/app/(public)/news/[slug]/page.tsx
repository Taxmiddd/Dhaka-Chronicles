import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, BookOpen, ChevronRight } from 'lucide-react'
import CommentsSection from '@/components/article/CommentsSection'
import ViewTracker from '@/components/article/ViewTracker'
import ArticleReactions from '@/components/article/ArticleReactions'
import { supabaseAdmin } from '@/lib/db/admin'
import { format } from 'date-fns'
import LiveBlogFeed from '@/components/article/LiveBlogFeed'
import WeatherWidget from '@/components/ui/WeatherWidget'
import AdBanner from '@/components/ui/AdBanner'
import ShareButtons from '@/components/article/ShareButtons'
import JsonLd from '@/components/seo/JsonLd'

const RELATED = [
  { id: 'r1', title: 'Dhaka Stock Exchange Hits All-Time High at 7,800 Points', slug: 'dse-all-time-high', category: 'Business', date: 'Apr 29', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&auto=format&fit=crop' },
  { id: 'r2', title: 'Bangladesh Garment Exports Surge 14% in First Quarter', slug: 'garment-exports-q1', category: 'Business', date: 'Apr 28', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop' },
  { id: 'r3', title: 'Foreign Direct Investment Reaches Record $3.2B in FY2026', slug: 'fdi-record-2026', category: 'Business', date: 'Apr 27', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&auto=format&fit=crop' },
]

async function getArticleBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select(`
      *,
      author:users(full_name, role, avatar_url, bio),
      category:categories(name)
    `)
    .eq('slug', slug)
    .single()
    
  if (error || !data) return null
  return data
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  if (!article) return { title: 'Not Found | Dhaka Chronicles' }
  
  return {
    title: `${article.title} – Dhaka Chronicles`,
    description: article.excerpt || article.title,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) notFound()

  const CAT_COLORS: Record<string, string> = {
    Politics: '#F42A41', Business: '#00A651', Sports: '#F59E0B',
    Culture: '#8B5CF6', Technology: '#06B6D4', Education: '#EC4899',
  }
  const categoryName = article.category?.name || 'News'
  const catColor = CAT_COLORS[categoryName] || '#00A651'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd article={article as any} />
      <ViewTracker articleId={article.id} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Article body */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-dc-text-muted mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/category/${categoryName.toLowerCase()}`} className="hover:text-white transition-colors">{categoryName}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-dc-text truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Category + Title */}
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: catColor }}>{categoryName}</span>
          <h1 className="font-headline font-black text-white text-3xl sm:text-4xl leading-tight mt-2 mb-4">{article.title}</h1>
          <p className="text-dc-text-muted text-lg leading-relaxed mb-6">{article.excerpt}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 py-4 border-y border-dc-border mb-6">
            <div className="flex items-center gap-3">
              {article.author?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.author.avatar_url} alt="Author" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-dc-green flex items-center justify-center font-bold text-white text-sm">
                  {article.author?.full_name?.substring(0, 2).toUpperCase() || 'DC'}
                </div>
              )}
              <div>
                <p className="text-white font-semibold text-sm">{article.author?.full_name || 'Dhaka Chronicles'}</p>
                <p className="text-dc-text-muted text-xs">{article.author?.role || 'Staff Reporter'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-dc-text-muted ml-auto">
              <span>{article.published_at ? format(new Date(article.published_at), 'MMM d, yyyy') : 'Draft'}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />5 min read</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{article.views_count?.toLocaleString() || 0} views</span>
            </div>
          </div>

          <div className="mb-8">
            <AdBanner size="banner" />
          </div>

          {/* Hero image */}
          {article.article_type === 'video' && article.featured_image_url ? (
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 bg-black">
              <iframe 
                src={article.featured_image_url} 
                className="w-full h-full" 
                allowFullScreen 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          ) : article.featured_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.featured_image_url} alt={article.title} className="w-full aspect-video object-cover rounded-xl mb-8" />
          ) : null}

          {/* Content */}
          <div className="prose-dc" dangerouslySetInnerHTML={{ __html: article.content.content ? article.content.content.map((block: any) => `<p>${block.content?.[0]?.text || ''}</p>`).join('') : '' }} />

          {/* Live Blog Feed */}
          {article.article_type === 'live_blog' && (
            <LiveBlogFeed articleId={article.id} />
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-dc-border">
            {/* Real tags need a join query, bypassing for now */}
          </div>

          {/* Share */}
          <ShareButtons slug={slug} title={article.title} />

          {/* Reactions */}
          <div className="mt-6">
            <ArticleReactions articleId={article.id} />
          </div>

          {/* Author bio */}
          <div className="glass p-6 rounded-xl mt-8 flex gap-4">
            {article.author?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.author.avatar_url} alt="Author" className="w-14 h-14 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-dc-green flex items-center justify-center font-bold text-white text-lg shrink-0">
                {article.author?.full_name?.substring(0, 2).toUpperCase() || 'DC'}
              </div>
            )}
            <div>
              <p className="text-white font-bold">{article.author?.full_name || 'Dhaka Chronicles'}</p>
              <p className="text-dc-text-muted text-sm mt-0.5">{article.author?.role || 'Staff Reporter'}</p>
              <p className="text-dc-text-muted text-sm mt-2">{article.author?.bio || "Reporting for Dhaka Chronicles."}</p>
            </div>
          </div>

          {/* Comments */}
          <CommentsSection articleId={article.id} allowComments={true} />
        </article>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <WeatherWidget />
          
          <div className="glass p-6 rounded-xl">
            <h3 className="font-headline font-bold text-white mb-5">Related Stories</h3>
            <div className="space-y-5">
              {RELATED.map((r) => (
                <Link key={r.id} href={`/news/${r.slug}`} className="group flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt={r.title} className="w-20 h-16 object-cover rounded-lg shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-dc-green uppercase">{r.category}</span>
                    <p className="text-white text-sm font-medium leading-snug mt-0.5 group-hover:text-dc-green transition-colors line-clamp-2">{r.title}</p>
                    <p className="text-dc-text-muted text-xs mt-1">{r.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <AdBanner size="sidebar-tall" />

          <div className="glass p-6 rounded-xl">
            <h3 className="font-headline font-bold text-white mb-2">Morning Briefing</h3>
            <p className="text-dc-text-muted text-sm mb-4">Top stories delivered at 7 AM daily.</p>
            <form className="space-y-3">
              <input type="email" placeholder="your@email.com" className="form-input text-sm" />
              <button type="button" className="btn-primary w-full py-2.5 text-sm">Subscribe Free</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  )
}

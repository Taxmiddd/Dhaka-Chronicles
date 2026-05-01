import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, ChevronRight } from 'lucide-react'

// Mock categories for static routing / mock data
const CATEGORIES: Record<string, { name: string, color: string, description: string }> = {
  politics: { name: 'Politics', color: '#F42A41', description: 'National and international political coverage' },
  business: { name: 'Business', color: '#00A651', description: 'Economy, finance, and corporate news' },
  sports: { name: 'Sports', color: '#F59E0B', description: 'Cricket, football, and national sports' },
  culture: { name: 'Culture', color: '#8B5CF6', description: 'Arts, entertainment, and social trends' },
  technology: { name: 'Technology', color: '#06B6D4', description: 'Tech startups, digital innovations' },
  education: { name: 'Education', color: '#EC4899', description: 'Academic news and policy updates' },
}

const MOCK_ARTICLES = [
  { id: '1', title: 'Parliament Approves New Digital Security Amendment Bill', excerpt: 'The amendment aims to address concerns raised by international human rights organisations.', slug: 'digital-security-amendment', date: 'Apr 29, 2026', readTime: '3 min read', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop' },
  { id: '2', title: 'Upcoming Mayoral Elections See Surge in Independent Candidates', excerpt: 'A record number of independent candidates have registered for the upcoming Dhaka North city corporation elections.', slug: 'mayoral-elections-independent', date: 'Apr 28, 2026', readTime: '4 min read', image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=800&auto=format&fit=crop' },
  { id: '3', title: 'Foreign Minister Departs for Crucial UN General Assembly Session', excerpt: 'Climate change and regional security top the agenda for the Bangladesh delegation.', slug: 'foreign-minister-unga', date: 'Apr 26, 2026', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1540747913346-19212a4c1fe5?w=800&auto=format&fit=crop' },
  { id: '4', title: 'Opposition Announces Nationwide Protests Over Fuel Prices', excerpt: 'Rallies are planned in all major cities following the government\'s decision to cut subsidies.', slug: 'opposition-protests-fuel', date: 'Apr 25, 2026', readTime: '3 min read', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop' },
  { id: '5', title: 'New Anti-Corruption Commission Chair Pledges Sweeping Reforms', excerpt: 'The newly appointed ACC chief outlined a 100-day plan to tackle institutional graft.', slug: 'acc-chair-reforms', date: 'Apr 22, 2026', readTime: '6 min read', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop' },
]

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = CATEGORIES[slug.toLowerCase()]
  
  if (!category) return { title: 'Category Not Found' }
  
  return {
    title: `${category.name} News – Dhaka Chronicles`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const categoryKey = slug.toLowerCase()
  const category = CATEGORIES[categoryKey]

  if (!category) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Category Header */}
      <div className="mb-10 text-center py-12 rounded-2xl relative overflow-hidden" style={{ backgroundColor: `${category.color}15` }}>
        <div className="relative z-10">
          <span className="w-16 h-1 mx-auto rounded-full mb-4 block" style={{ backgroundColor: category.color }} />
          <h1 className="font-headline font-black text-white text-4xl sm:text-5xl mb-3">{category.name}</h1>
          <p className="text-dc-text-muted text-lg max-w-2xl mx-auto">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* Article List */}
          <div className="space-y-8">
            {MOCK_ARTICLES.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="group flex flex-col sm:flex-row gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image} alt={article.title} className="w-full sm:w-56 aspect-[4/3] object-cover rounded-xl shrink-0 transition-transform duration-500 group-hover:scale-[1.02]" />
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: category.color }}>{category.name}</span>
                  <h2 className="font-headline font-bold text-white text-xl sm:text-2xl leading-tight mb-2 group-hover:text-dc-green transition-colors">{article.title}</h2>
                  <p className="text-dc-text-muted text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-dc-text-muted mt-auto">
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12 pt-8 border-t border-dc-border">
            <button className="btn-ghost px-4 py-2" disabled>Previous</button>
            <button className="btn-primary px-4 py-2 bg-dc-surface-2 text-white hover:bg-dc-surface">1</button>
            <button className="btn-ghost px-4 py-2">2</button>
            <button className="btn-ghost px-4 py-2">3</button>
            <span className="px-4 py-2 text-dc-text-muted">...</span>
            <button className="btn-ghost px-4 py-2">Next</button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="glass p-6 rounded-xl">
            <h3 className="font-headline font-bold text-white mb-4">Other Categories</h3>
            <div className="space-y-2">
              {Object.values(CATEGORIES).filter(c => c.name !== category.name).map(c => (
                <Link key={c.name} href={`/category/${c.name.toLowerCase()}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-dc-surface-2 transition-colors group">
                  <span className="font-medium text-white group-hover:text-dc-green transition-colors">{c.name}</span>
                  <ChevronRight className="w-4 h-4 text-dc-text-muted group-hover:text-dc-green" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, TrendingUp, ChevronRight, Flame } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dhaka Chronicles – The Pulse of Bangladesh',
  description: 'Breaking news, in-depth analysis, and stories shaping Bangladesh.',
}

const HERO = {
  id: '1', title: 'Bangladesh Achieves Record 8.2% GDP Growth in Q1 2026',
  excerpt: 'The Bangladesh Bureau of Statistics confirmed the country\'s strongest quarterly growth on record, driven by garment exports and a booming digital services sector.',
  category: 'Business', slug: 'bangladesh-gdp-growth-q1-2026',
  image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop',
  author: 'Tahmid Ashfaque', date: 'April 29, 2026', readTime: '6 min read', is_breaking: true,
}

const FEATURED = [
  { id: '2', title: 'Dhaka Metro Line 2 Construction Enters Final Phase, December Launch Confirmed', category: 'Infrastructure', slug: 'dhaka-metro-line-2-launch', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', date: 'April 28, 2026', readTime: '4 min read' },
  { id: '3', title: 'Bangladesh Cricket Board Names New Head Coach Ahead of World Cup', category: 'Sports', slug: 'bcb-new-head-coach', image: 'https://images.unsplash.com/photo-1540747913346-19212a4c1fe5?w=800&auto=format&fit=crop', date: 'April 27, 2026', readTime: '3 min read' },
  { id: '4', title: 'Eid Celebrations Transform Dhaka Into a City of Light', category: 'Culture', slug: 'eid-celebrations-dhaka', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop', date: 'April 26, 2026', readTime: '5 min read' },
]

const LATEST = [
  { id: '5', title: 'Parliament Approves New Digital Security Amendment Bill', category: 'Politics', slug: 'digital-security-amendment', date: 'Apr 29', readTime: '3 min' },
  { id: '6', title: 'Dhaka Stock Exchange Hits All-Time High at 7,800 Points', category: 'Business', slug: 'dse-all-time-high', date: 'Apr 29', readTime: '2 min' },
  { id: '7', title: 'PM Inaugurates 500-MW Solar Power Plant in Mymensingh', category: 'Energy', slug: 'solar-plant-mymensingh', date: 'Apr 28', readTime: '4 min' },
  { id: '8', title: 'University Enrolment Hits Record High With 1.2M New Students', category: 'Education', slug: 'university-enrolment-record', date: 'Apr 28', readTime: '3 min' },
  { id: '9', title: 'Startup Hub Launches Bangladesh\'s First AI Research Centre', category: 'Technology', slug: 'bangladesh-ai-research-centre', date: 'Apr 27', readTime: '5 min' },
]

const TRENDING = [
  { rank: 1, title: 'Bangladesh vs India: Full Test Match Scorecard & Analysis', slug: 'bd-india-test', views: '42K' },
  { rank: 2, title: 'New Visa Policy: Countries That Can Now Visit Bangladesh Visa-Free', slug: 'visa-free-policy', views: '38K' },
  { rank: 3, title: 'Rohingya Crisis: Five Years On – What Has Changed?', slug: 'rohingya-five-years', views: '31K' },
  { rank: 4, title: 'How Bangla is Becoming the Language of Tech Startups', slug: 'bangla-tech', views: '24K' },
  { rank: 5, title: '10 Dhaka Restaurants You Must Try This Year', slug: 'dhaka-restaurants', views: '19K' },
]

const CAT_COLORS: Record<string, string> = {
  Politics: '#F42A41', Business: '#00A651', Sports: '#F59E0B',
  Culture: '#8B5CF6', Technology: '#06B6D4', Education: '#EC4899',
  Infrastructure: '#3B82F6', Energy: '#10B981',
}

function Cat({ name }: { name: string }) {
  return <span className="text-xs font-bold uppercase tracking-widest" style={{ color: CAT_COLORS[name] || '#00A651' }}>{name}</span>
}

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Hero + Featured */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Link href={`/news/${HERO.slug}`} className="lg:col-span-2 group relative overflow-hidden rounded-2xl block">
          <div className="aspect-[16/9] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO.image} alt={HERO.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              {HERO.is_breaking && <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-dc-red"><Flame className="w-3.5 h-3.5" />Breaking</span>}
              <Cat name={HERO.category} />
            </div>
            <h1 className="font-headline font-bold text-white text-2xl sm:text-3xl leading-tight mb-3 group-hover:text-dc-green transition-colors">{HERO.title}</h1>
            <p className="text-dc-text-muted text-sm sm:text-base line-clamp-2 mb-4 hidden sm:block">{HERO.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-dc-text-muted">
              <span className="font-medium text-white">{HERO.author}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{HERO.readTime}</span>
              <span>{HERO.date}</span>
            </div>
          </div>
        </Link>

        <div className="flex flex-col gap-4">
          {FEATURED.map((a) => (
            <Link key={a.id} href={`/news/${a.slug}`} className="group article-card flex gap-4 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.image} alt={a.title} className="w-24 h-20 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0 py-1">
                <Cat name={a.category} />
                <h3 className="font-headline font-bold text-white text-sm leading-tight mt-1 line-clamp-2 group-hover:text-dc-green transition-colors">{a.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-dc-text-muted">
                  <span>{a.date}</span><span>·</span><span>{a.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline font-bold text-white text-xl flex items-center gap-2">
              <span className="w-1 h-6 bg-dc-green rounded-full inline-block" />Latest Stories
            </h2>
            <Link href="/news" className="text-dc-green text-sm font-medium hover:text-white transition-colors flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-dc-border">
            {LATEST.map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`} className="group flex items-start gap-4 py-5">
                <div className="flex-1 min-w-0">
                  <Cat name={a.category} />
                  <h3 className="font-headline font-semibold text-white mt-1 text-base leading-snug group-hover:text-dc-green transition-colors">{a.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-dc-text-muted">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.readTime}</span>
                    <span>{a.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-dc-text-muted group-hover:text-dc-green shrink-0 mt-1 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="glass p-6 rounded-xl">
            <h3 className="font-headline font-bold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-dc-green" />Trending Now
            </h3>
            <ol className="space-y-4">
              {TRENDING.map((item) => (
                <li key={item.rank}>
                  <Link href={`/news/${item.slug}`} className="group flex items-start gap-3">
                    <span className="text-3xl font-headline font-black text-dc-surface-2 leading-none w-8 shrink-0 select-none">{String(item.rank).padStart(2, '0')}</span>
                    <div>
                      <p className="text-white text-sm font-medium leading-snug group-hover:text-dc-green transition-colors line-clamp-2">{item.title}</p>
                      <p className="text-dc-text-muted text-xs mt-1">{item.views} views</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass p-6 rounded-xl">
            <h3 className="font-headline font-bold text-white mb-2">Morning Briefing</h3>
            <p className="text-dc-text-muted text-sm mb-4">Top 5 stories in your inbox at 7 AM daily.</p>
            <form className="space-y-3">
              <input type="email" placeholder="your@email.com" className="form-input text-sm" />
              <button type="button" className="btn-primary w-full py-2.5 text-sm">Subscribe Free</button>
            </form>
          </div>
        </aside>
      </div>

      {/* Category Spotlights */}
      <section className="mb-14">
        <h2 className="font-headline font-bold text-white text-xl mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-dc-green rounded-full inline-block" />Explore by Section
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'Politics', slug: 'politics', color: '#F42A41', articles: 142 },
            { name: 'Business', slug: 'business', color: '#00A651', articles: 98 },
            { name: 'Sports', slug: 'sports', color: '#F59E0B', articles: 211 },
            { name: 'Culture', slug: 'culture', color: '#8B5CF6', articles: 67 },
            { name: 'Technology', slug: 'technology', color: '#06B6D4', articles: 33 },
            { name: 'Education', slug: 'education', color: '#EC4899', articles: 44 },
          ].map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="glass p-5 rounded-xl flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              </div>
              <span className="font-bold text-sm text-white group-hover:text-dc-green transition-colors">{cat.name}</span>
              <span className="text-xs text-dc-text-muted">{cat.articles} stories</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

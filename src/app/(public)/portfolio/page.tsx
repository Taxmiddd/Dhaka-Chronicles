import { supabaseAdmin } from '@/lib/db/admin'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Portfolio & Case Studies',
  description: 'Explore our past brand collaborations and successful campaigns at Dhaka Chronicles.',
}

export default async function PortfolioPage() {
  const { data: items } = await supabaseAdmin
    .from('portfolio_items')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00A651]/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-7xl tracking-tight text-white mb-6">
            Brand <span className="text-[#00A651]">Collaborations</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover how Dhaka Chronicles partners with leading brands to create impactful, data-driven storytelling and native campaigns.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="px-4 pb-24 max-w-7xl mx-auto relative z-10">
        <PortfolioGrid items={items ?? []} />
      </section>
    </main>
  )
}

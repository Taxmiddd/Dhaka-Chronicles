'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface PortfolioItem {
  id: string
  brand_name: string
  project_name: string
  category: string
  description: string
  outcome: string | null
  logo_url: string | null
  featured_image_url: string | null
  external_link: string | null
}

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState('All')

  const categories = useMemo(() => {
    const cats = new Set(items.map((item) => item.category))
    return ['All', ...Array.from(cats).sort()]
  }, [items])

  const filteredItems = useMemo(() => {
    if (filter === 'All') return items
    return items.filter((item) => item.category === filter)
  }, [items, filter])

  return (
    <div className="py-12">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              filter === cat
                ? 'bg-[#00A651] text-white shadow-[0_0_15px_rgba(0,166,81,0.3)]'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              className="group relative bg-[#0a0a0a] border border-white/10 hover:border-[#00A651]/50 rounded-2xl overflow-hidden shadow-xl transition-colors duration-500 flex flex-col h-full"
            >
              {/* Image */}
              <div className="w-full aspect-video overflow-hidden bg-black/50 relative">
                {item.featured_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.featured_image_url}
                    alt={item.project_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 font-headline font-bold text-xl">
                    {item.brand_name}
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                
                {/* Logo */}
                {item.logo_url && (
                  <div className="absolute bottom-4 left-6 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logo_url} alt={item.brand_name} className="h-8 w-auto object-contain" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] tracking-widest font-bold uppercase text-[#00A651]">
                    {item.category}
                  </span>
                </div>
                
                <h3 className="font-headline font-bold text-xl text-white mb-2 leading-tight">
                  {item.project_name}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {item.description}
                </p>

                {item.outcome && (
                  <div className="mt-auto mb-6 bg-[#00A651]/10 border border-[#00A651]/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-[#00A651] uppercase mb-1">Impact</p>
                    <p className="text-sm text-gray-300 font-medium">{item.outcome}</p>
                  </div>
                )}

                {item.external_link ? (
                  <a
                    href={item.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#00A651] transition-colors"
                  >
                    View Case Study <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="mt-auto" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No projects found in this category.
        </div>
      )}
    </div>
  )
}

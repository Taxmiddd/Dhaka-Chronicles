'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search as SearchIcon, Clock, ArrowRight } from 'lucide-react'

// Mock search results
const MOCK_RESULTS = [
  { id: '1', title: 'Bangladesh Achieves Record 8.2% GDP Growth in Q1 2026', category: 'Business', slug: 'bangladesh-gdp-growth-q1-2026', date: 'Apr 29, 2026', readTime: '6 min' },
  { id: '2', title: 'New Education Policy to Modernise Curriculum Across Bangladesh', category: 'Education', slug: 'new-education-policy', date: 'Apr 24, 2026', readTime: '5 min' },
  { id: '3', title: 'Bangladesh Cricket Board Names New Head Coach', category: 'Sports', slug: 'bcb-new-head-coach', date: 'Apr 27, 2026', readTime: '3 min' },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setHasSearched(true)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 min-h-[60vh]">
      <div className="text-center mb-10">
        <h1 className="font-headline font-black text-white text-3xl sm:text-4xl mb-4">Search Dhaka Chronicles</h1>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for news, articles, or topics..."
            className="w-full bg-dc-surface border-2 border-dc-border rounded-xl py-4 pl-12 pr-16 text-lg text-white outline-none focus:border-dc-green transition-colors shadow-lg"
          />
          <SearchIcon className="w-6 h-6 text-dc-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-dc-green text-white rounded-lg hover:bg-dc-green-dark transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {hasSearched && (
        <div className="space-y-6">
          <p className="text-dc-text-muted font-medium mb-4">Showing results for &quot;<span className="text-white">{query}</span>&quot;</p>
          
          <div className="divide-y divide-dc-border glass rounded-xl px-6">
            {MOCK_RESULTS.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="group block py-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-dc-green">{article.category}</span>
                </div>
                <h2 className="font-headline font-bold text-white text-xl leading-tight mb-2 group-hover:text-dc-green transition-colors">{article.title}</h2>
                <div className="flex items-center gap-4 text-xs text-dc-text-muted">
                  <span>{article.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 pt-8">
            <p className="text-dc-text-muted text-sm">End of search results.</p>
          </div>
        </div>
      )}

      {!hasSearched && (
        <div className="text-center mt-16">
          <p className="text-dc-text-muted mb-6">Popular topics right now:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Elections 2026', 'Cricket World Cup', 'Economy', 'Metro Rail', 'Climate Change'].map(topic => (
              <button key={topic} onClick={() => { setQuery(topic); setHasSearched(true) }} className="px-4 py-2 rounded-full border border-dc-border bg-dc-surface text-dc-text-muted hover:text-white hover:border-dc-green transition-colors text-sm">
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X, ChevronDown } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Politics', href: '/category/politics' },
  { label: 'Business', href: '/category/business' },
  { label: 'Sports', href: '/category/sports' },
  { label: 'Culture', href: '/category/culture' },
  { label: 'Technology', href: '/category/technology' },
  { label: 'Education', href: '/category/education' },
]

export function PublicHeader() {
  const now = new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-dc-surface border-b border-dc-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
          <p className="text-xs text-dc-text-muted hidden sm:block">{now}</p>
          <div className="flex items-center gap-4 text-xs text-dc-text-muted">
            <Link href="/login" className="hover:text-white transition-colors">Admin Login</Link>
            <span className="text-dc-border">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-dc-green animate-pulse" />
              Live Updates
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="glass border-b border-dc-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-dc-green flex items-center justify-center font-headline font-black text-white text-lg">
              ঢ
            </div>
            <div className="leading-tight">
              <span className="font-headline font-black text-white text-xl tracking-tight">Dhaka</span>
              <span className="font-headline font-black text-dc-green text-xl tracking-tight"> Chronicles</span>
            </div>
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-dc-text-muted hover:text-white hover:bg-dc-surface-2 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/search" className="p-2 rounded-lg hover:bg-dc-surface-2 text-dc-text-muted hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            {/* Language toggle */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dc-surface-2 text-sm font-medium text-dc-text-muted hover:text-white transition-colors">
              EN <ChevronDown className="w-3 h-3" />
            </button>
            {/* Mobile menu button */}
            <button className="lg:hidden p-2 rounded-lg hover:bg-dc-surface-2 text-dc-text-muted">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category nav (desktop) */}
      <div className="bg-dc-surface border-b border-dc-border hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center gap-6 overflow-x-auto scrollbar-none">
          <span className="text-dc-red text-xs font-bold uppercase tracking-widest shrink-0">● Breaking</span>
          <div className="flex-1 overflow-hidden relative">
            <p className="ticker-animate whitespace-nowrap text-sm text-dc-text-muted">
              Bangladesh registers record GDP growth of 8.2% in Q1 2026 &nbsp;•&nbsp; 
              Dhaka Metro Line 2 to open by December 2026 &nbsp;•&nbsp; 
              Bangladesh cricket team wins Asia Cup final &nbsp;•&nbsp;
              PM inaugurates new Padma Bridge connecting highway &nbsp;•&nbsp;
              Dhaka Stock Exchange reaches all-time high
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

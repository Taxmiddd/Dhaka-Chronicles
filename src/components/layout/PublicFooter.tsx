import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import { Facebook, Twitter, Youtube, Instagram } from '@/components/ui/BrandIcons'

const FOOTER_SECTIONS = [
  {
    title: 'Sections',
    links: [
      { label: 'Politics', href: '/category/politics' },
      { label: 'Business', href: '/category/business' },
      { label: 'Sports', href: '/category/sports' },
      { label: 'Culture & Arts', href: '/category/culture' },
      { label: 'Technology', href: '/category/technology' },
      { label: 'Education', href: '/category/education' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Editorial Policy', href: '/editorial-policy' },
      { label: 'Contact', href: '/contact' },
      { label: 'Advertise', href: '/advertise' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Corrections', href: '/corrections' },
    ],
  },
]

const SOCIALS = [
  { icon: Facebook, href: 'https://facebook.com/dhakachronicles', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/dhakachronicles', label: 'Twitter/X' },
  { icon: Youtube, href: 'https://youtube.com/@dhakachronicles', label: 'YouTube' },
  { icon: Instagram, href: 'https://instagram.com/dhakachronicles', label: 'Instagram' },
]

export function PublicFooter() {
  return (
    <footer className="bg-dc-surface border-t border-dc-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-dc-green flex items-center justify-center font-headline font-black text-white text-lg">
                ঢ
              </div>
              <div className="leading-tight">
                <span className="font-headline font-black text-white text-xl">Dhaka</span>
                <span className="font-headline font-black text-dc-green text-xl"> Chronicles</span>
              </div>
            </Link>
            <p className="text-dc-text-muted text-sm leading-relaxed max-w-xs">
              Bangladesh&apos;s leading independent digital news platform, delivering reliable journalism since 2025.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-white font-medium text-sm mb-3">Get the morning briefing</p>
              <form className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="form-input flex-1 bg-dc-surface-2 border-dc-border text-sm" />
                <button type="button" className="btn-primary px-4 py-2 shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Socials */}
            <div className="flex gap-3 pt-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <Link key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-lg bg-dc-surface-2 flex items-center justify-center text-dc-text-muted hover:text-white hover:bg-dc-green transition-all"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-dc-text-muted text-sm hover:text-dc-green transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dc-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-dc-text-muted">
          <p>© 2026 Dhaka Chronicles. All rights reserved. Built by <a href="https://noeticstudio.net" target="_blank" rel="noopener noreferrer" className="text-dc-green hover:underline">NOÉTIC Studio</a>.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-dc-green animate-pulse" />
            <span>dhaka.live</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

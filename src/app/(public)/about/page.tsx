import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react'
import { Twitter, Facebook } from '@/components/ui/BrandIcons'

export const metadata: Metadata = {
  title: 'About Dhaka Chronicles – The Pulse of Bangladesh',
  description: 'Dhaka Chronicles is Bangladesh\'s premier digital news platform, delivering independent, fact-driven journalism from the heart of Dhaka.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-dc-green">About Us</span>
        <h1 className="font-headline font-black text-white text-4xl mt-2 mb-4">
          The Pulse of Bangladesh
        </h1>
        <p className="text-dc-text-muted text-lg leading-relaxed">
          Dhaka Chronicles is an independent digital news organisation dedicated to delivering
          accurate, timely, and deeply reported journalism from Bangladesh and beyond.
        </p>
      </div>

      {/* Mission */}
      <div className="glass p-8 rounded-2xl mb-8">
        <h2 className="font-headline font-bold text-white text-2xl mb-4">Our Mission</h2>
        <p className="text-dc-text leading-relaxed mb-4">
          We believe that a well-informed citizenry is the cornerstone of a healthy democracy.
          Our mission is to produce journalism that holds power to account, amplifies underrepresented
          voices, and helps Bangladeshis understand the forces shaping their lives.
        </p>
        <p className="text-dc-text leading-relaxed">
          From breaking news and investigative reports to cultural features and data-driven analysis,
          Dhaka Chronicles covers the full spectrum of Bangladesh's dynamic story — in both
          English and Bangla.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { title: 'Independence', desc: 'Editorially independent. We answer only to our readers.' },
          { title: 'Accuracy', desc: 'Every claim is verified. Corrections are published promptly.' },
          { title: 'Inclusivity', desc: 'Bilingual. Mobile-first. Built for all of Bangladesh.' },
        ].map(v => (
          <div key={v.title} className="glass p-6 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-dc-green mb-3" />
            <h3 className="font-headline font-bold text-white mb-2">{v.title}</h3>
            <p className="text-dc-text-muted text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="glass p-8 rounded-2xl mb-8">
        <h2 className="font-headline font-bold text-white text-2xl mb-6">Leadership</h2>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-dc-green/20 border border-dc-green/30 flex items-center justify-center text-dc-green font-bold text-xl shrink-0">
            TA
          </div>
          <div>
            <p className="text-white font-bold text-lg">Tahmid Ashfaque</p>
            <p className="text-dc-green text-sm font-medium">Founder & Lead Architect</p>
            <p className="text-dc-text-muted text-sm mt-2 leading-relaxed">
              Founder of NOÉTIC Studio and creator of Dhaka Chronicles. Tahmid brings together
              technology, design, and editorial vision to build the next generation of
              Bangladeshi digital media.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-dc-text-muted hover:text-dc-green transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-dc-text-muted hover:text-dc-green transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="glass p-8 rounded-2xl border border-dc-green/20">
        <h2 className="font-headline font-bold text-white text-xl mb-2">Get in Touch</h2>
        <p className="text-dc-text-muted text-sm mb-5">
          For press enquiries, partnership opportunities, or editorial feedback.
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-dc-text">
            <Mail className="w-4 h-4 text-dc-green shrink-0" />
            <a href="mailto:hello@dhakachronicles.com" className="hover:text-dc-green transition-colors">
              hello@dhakachronicles.com
            </a>
          </div>
          <div className="flex items-center gap-3 text-dc-text">
            <MapPin className="w-4 h-4 text-dc-green shrink-0" />
            <span>Dhaka, Bangladesh</span>
          </div>
        </div>
        <Link href="/contact" className="btn-primary mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm">
          Contact Us <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

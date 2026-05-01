'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('dc_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('dc_cookie_consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('dc_cookie_consent', 'declined')
    // Disable GA if declined
    if (typeof window !== 'undefined') {
      // @ts-expect-error GA disable flag
      window[`ga-disable-${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`] = true
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0d0d0d] border-t border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 text-sm text-gray-300 leading-relaxed">
          <p>
            <span className="font-semibold text-white">We use cookies</span> to improve your experience,
            analyse traffic, and personalise content. By clicking{' '}
            <strong className="text-white">&ldquo;Accept&rdquo;</strong> you consent to our use of cookies.{' '}
            <Link href="/cookies" className="underline text-[#00A651] hover:text-[#00c462] transition-colors">
              Cookie Policy
            </Link>{' '}
            &middot;{' '}
            <Link href="/privacy" className="underline text-[#00A651] hover:text-[#00c462] transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="cookie-decline-btn"
            onClick={decline}
            className="text-sm px-4 py-2 rounded border border-white/20 text-gray-300 hover:border-white/40 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            id="cookie-accept-btn"
            onClick={accept}
            className="text-sm px-5 py-2 rounded bg-[#00A651] hover:bg-[#009040] text-white font-semibold transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}

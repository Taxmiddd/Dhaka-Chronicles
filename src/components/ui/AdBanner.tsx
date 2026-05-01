'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

type AdSize = 'bite-sized' | 'banner' | 'sidebar-tall'

export default function AdBanner({ size = 'banner' }: { size?: AdSize }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Size configurations mapping to aesthetic "Matte Intelligence" theme
  const sizeConfig = {
    'bite-sized': 'w-full h-[100px] sm:h-[120px]',
    'banner': 'w-full h-[60px] sm:h-[90px]',
    'sidebar-tall': 'w-full h-[300px] sm:h-[600px]',
  }

  return (
    <div className={`relative overflow-hidden rounded-xl bg-dc-surface border border-dc-border flex items-center justify-center group ${sizeConfig[size]}`}>
      {/* Aesthetic shimmer effect representing the ad loading/placeholder */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
      
      {/* Actual AdSense script would go here in production. For now, a sleek placeholder */}
      <div className="flex flex-col items-center text-dc-text-muted/50">
        <Sparkles className="w-5 h-5 mb-1 opacity-50" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Advertisement</span>
      </div>

      {/* 
        // Production AdSense Implementation:
        <ins className="adsbygoogle block"
             data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
             data-ad-slot="YOUR_AD_SLOT_ID"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      */}
    </div>
  )
}

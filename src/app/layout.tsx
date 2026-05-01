import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import CookieConsent from '@/components/common/CookieConsent'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Dhaka Chronicles',
    default: 'Dhaka Chronicles — News from the Heart of Bangladesh',
  },
  description: 'Your trusted bilingual source for news, analysis, and stories from Dhaka and Bangladesh. আপনার বিশ্বস্ত দ্বিভাষিক সংবাদ উৎস।',
  keywords: ['Bangladesh news', 'Dhaka news', 'বাংলাদেশ সংবাদ', 'ঢাকা ক্রনিকেলস'],
  authors: [{ name: 'Dhaka Chronicles', url: 'https://dhakachronicles.com' }],
  creator: 'Noetic Studio',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://dhakachronicles.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'bn_BD',
    siteName: 'Dhaka Chronicles',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@DhakaChronicles',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* Hotjar Tracking Code */}
        <Script
          id="hotjar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID || '1234567'},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />

        {/* OneSignal Push Notifications */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="lazyOnload"
        />
        <Script
          id="onesignal-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(function(OneSignal) {
                OneSignal.init({
                  appId: "${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || ''}",
                });
              });
            `,
          }}
        />

        {children}
        <CookieConsent />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f0f0f0',
            },
          }}
        />
        </ThemeProvider>
      </body>
    </html>
  )
}


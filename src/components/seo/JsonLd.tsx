import { NewsArticle, WithContext } from 'schema-dts'

interface JsonLdProps {
  article: {
    title: string
    excerpt: string | null
    featured_image_url: string | null
    published_at: string | null
    updated_at: string | null
    author: { full_name: string } | null
    category: { name: string } | null
  }
}

export default function JsonLd({ article }: JsonLdProps) {
  const jsonLd: WithContext<NewsArticle> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || article.title,
    image: article.featured_image_url ? [article.featured_image_url] : [],
    datePublished: article.published_at || new Date().toISOString(),
    dateModified: article.updated_at || new Date().toISOString(),
    author: [
      {
        '@type': 'Person',
        name: article.author?.full_name || 'Dhaka Chronicles Staff',
        url: 'https://dhakachronicles.com'
      }
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Dhaka Chronicles',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dhakachronicles.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://dhakachronicles.com'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

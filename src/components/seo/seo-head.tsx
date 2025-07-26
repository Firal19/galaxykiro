import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
  canonicalUrl?: string
}

export function SEOHead({
  title = 'Galaxy Kiro - Personal Development & Transformation',
  description = 'Discover your potential with Galaxy Kiro\'s assessment tools and transformation programs. Join thousands who have unlocked their hidden strengths.',
  keywords = [
    'personal development',
    'potential assessment',
    'leadership development',
    'transformation coaching',
    'success gap analysis',
    'decision making style',
    'Ethiopia coaching',
    '@galaxy-kiro'
  ],
  image = '/og-image.jpg',
  url,
  type = 'website',
  author = 'Galaxy Kiro',
  publishedTime,
  modifiedTime,
  noIndex = false,
  canonicalUrl
}: SEOHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://galaxykiro.com'
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
  
  return (
    <Head>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Galaxy Kiro" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="am_ET" />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@galaxykiro" />
      <meta name="twitter:site" content="@galaxykiro" />
      
      {/* Additional meta tags */}
      <meta name="theme-color" content="#7c3aed" />
      <meta name="msapplication-TileColor" content="#7c3aed" />
      
      {/* Language */}
      <meta httpEquiv="content-language" content="en, am" />
      
      {/* Viewport (if not already set) */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://boqwsckdisxtbrgesopq.supabase.co" />
      
      {/* Favicon and icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Galaxy Kiro',
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
            description: description,
            sameAs: [
              'https://linkedin.com/company/galaxy-kiro',
              'https://twitter.com/galaxykiro',
              'https://facebook.com/galaxykiro'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Customer Service',
              availableLanguage: ['English', 'Amharic']
            },
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'ET',
              addressLocality: 'Addis Ababa'
            }
          })
        }}
      />
    </Head>
  )
}
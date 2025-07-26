// SEO utility functions for dynamic content

export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  noIndex?: boolean
}

// Generate SEO config for assessment tools
export function generateToolSEO(toolName: string, toolDescription: string): SEOConfig {
  return {
    title: `${toolName} - Galaxy Kiro Assessment Tool`,
    description: `${toolDescription} Take our comprehensive ${toolName.toLowerCase()} assessment to unlock your potential and accelerate your transformation journey.`,
    keywords: [
      toolName.toLowerCase(),
      'assessment tool',
      'personal development',
      'self discovery',
      'potential assessment',
      'transformation',
      'galaxy kiro'
    ],
    url: `/tools/${toolName.toLowerCase().replace(/\s+/g, '-')}`,
    type: 'article'
  }
}

// Generate SEO config for blog/content pages
export function generateContentSEO(
  title: string,
  excerpt: string,
  category: string,
  publishedAt?: string
): SEOConfig {
  return {
    title: `${title} - Galaxy Kiro`,
    description: excerpt,
    keywords: [
      category.toLowerCase(),
      'personal development',
      'transformation',
      'success mindset',
      'leadership',
      'galaxy kiro'
    ],
    type: 'article',
    url: `/content/${title.toLowerCase().replace(/\s+/g, '-')}`
  }
}

// Generate SEO config for member profiles
export function generateProfileSEO(memberName: string, bio: string): SEOConfig {
  return {
    title: `${memberName} - Galaxy Kiro Member`,
    description: bio.slice(0, 160),
    keywords: [
      'member profile',
      'success story',
      'transformation journey',
      'galaxy kiro community'
    ],
    type: 'profile',
    url: `/member/${memberName.toLowerCase().replace(/\s+/g, '-')}`
  }
}

// Extract keywords from content
export function extractKeywords(content: string, count: number = 10): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
  ])
  
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
  
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word)
}

// Generate structured data for different content types
export function generateStructuredData(type: string, data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://galaxykiro.com'
  
  switch (type) {
    case 'assessment':
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: data.name,
        description: data.description,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        provider: {
          '@type': 'Organization',
          name: 'Galaxy Kiro'
        }
      }
    
    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Organization',
          name: 'Galaxy Kiro'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Galaxy Kiro',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        },
        datePublished: data.publishedAt,
        dateModified: data.modifiedAt || data.publishedAt,
        image: data.image ? `${baseUrl}${data.image}` : `${baseUrl}/og-image.jpg`
      }
    
    case 'course':
      return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'Organization',
          name: 'Galaxy Kiro'
        },
        courseMode: 'online',
        educationalLevel: 'intermediate',
        about: data.topics || []
      }
    
    default:
      return null
  }
}

// Generate meta tags for social media sharing
export function generateSocialTags(seoConfig: SEOConfig) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://galaxykiro.com'
  const fullUrl = seoConfig.url ? `${baseUrl}${seoConfig.url}` : baseUrl
  const fullImageUrl = seoConfig.image?.startsWith('http') 
    ? seoConfig.image 
    : `${baseUrl}${seoConfig.image || '/og-image.jpg'}`
  
  return {
    // Open Graph
    'og:title': seoConfig.title,
    'og:description': seoConfig.description,
    'og:image': fullImageUrl,
    'og:url': fullUrl,
    'og:type': seoConfig.type || 'website',
    'og:site_name': 'Galaxy Kiro',
    
    // Twitter
    'twitter:card': 'summary_large_image',
    'twitter:title': seoConfig.title,
    'twitter:description': seoConfig.description,
    'twitter:image': fullImageUrl,
    'twitter:creator': '@galaxykiro',
    'twitter:site': '@galaxykiro'
  }
}

// Generate breadcrumb structured data
export function generateBreadcrumbs(items: Array<{ name: string, url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://galaxykiro.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  }
}
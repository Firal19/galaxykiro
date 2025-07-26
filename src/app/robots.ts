import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://galaxykiro.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/soft-member/private/',
          '/_next/',
          '/auth/verify*',
          '/auth/reset*',
          '/member/private/',
          '/member/dashboard/private/',
          '/temp/',
          '*.json',
          '*.xml'
        ],
      },
      // Allow search engines to index assessment results
      {
        userAgent: '*',
        allow: [
          '/tools/',
          '/*/results',
          '/content-library',
          '/webinars',
          '/about'
        ]
      },
      // Prevent indexing of sensitive areas
      {
        userAgent: '*',
        disallow: [
          '/admin/*',
          '/api/*',
          '/member/private/*',
          '/soft-member/private/*'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
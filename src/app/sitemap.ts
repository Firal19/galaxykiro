import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://galaxykiro.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/content-library`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/member`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/webinars`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/membership/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  ]
  
  // Assessment tool pages
  const assessmentTools = [
    'potential-quotient-calculator',
    'decision-door',
    'leadership-lever',
    'success-gap',
    'vision-void',
    'change-paradox'
  ]
  
  const toolPages = assessmentTools.map(tool => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  
  // Results pages for tools
  const resultsPages = assessmentTools.map(tool => ({
    url: `${baseUrl}/${tool}/results`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  // Additional assessment pages
  const additionalAssessments = [
    'revolutionary-pqc',
    'decision-style-assessment',
    'leadership-style-assessment',
    'success-gap-assessment',
    'vision-assessment',
    'change-readiness-assessment'
  ]
  
  const additionalPages = additionalAssessments.map(assessment => ({
    url: `${baseUrl}/${assessment}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  
  // Member area pages (public routes)
  const memberPages = [
    'soft-member/dashboard',
    'soft-member/tools',
    'soft-member/content',
    'soft-member/community',
    'soft-member/achievements'
  ].map(page => ({
    url: `${baseUrl}/${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  
  return [
    ...staticPages,
    ...toolPages,
    ...resultsPages,
    ...additionalPages,
    ...memberPages
  ]
}
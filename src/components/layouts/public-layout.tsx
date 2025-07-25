"use client"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { MainNav } from '@/components/navigation/main-nav'
import { Footer } from '@/components/footer'
import { useLeadService } from '@/components/providers/ServiceProvider'

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const leadService = useLeadService()

  useEffect(() => {
    // Parse URL parameters for lead attribution
    const campaign = searchParams.get('c')
    const medium = searchParams.get('m')
    const partner = searchParams.get('p')

    if (campaign || medium || partner) {
      const referralData = {
        campaign: campaign || undefined,
        medium: medium || undefined,
        partner: partner || undefined,
        landingPage: pathname,
        timestamp: new Date().toISOString()
      }
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('galaxy_kiro_referral', JSON.stringify(referralData))
      }

      // Track with lead scoring service
      leadService.trackEngagement('content_engagement', {
        action: 'referral_landing',
        campaign,
        medium,
        partner,
        landingPage: pathname
      })
    }
  }, [pathname, searchParams, leadService])

  console.log('🔥 PublicLayout rendering with MainNav')
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
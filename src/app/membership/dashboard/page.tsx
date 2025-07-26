"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MembershipDashboardRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the main soft member dashboard
    router.push('/soft-member/dashboard')
  }, [router])

  return null
}
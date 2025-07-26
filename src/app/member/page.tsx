"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MemberRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the new soft member dashboard
    router.push('/soft-member/dashboard')
  }, [router])

  return null
}
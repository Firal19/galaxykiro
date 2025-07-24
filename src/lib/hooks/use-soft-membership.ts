"use client"

import { useState, useEffect } from 'react'
import { useEngagementTracking } from './use-engagement-tracking'

interface SoftMembershipData {
  email: string
  firstName?: string
  interests?: string[]
  source?: string
  membershipLevel: 'soft' | 'full'
  joinedAt: string
  lastActive: string
  engagementScore: number
  toolsAccessed: string[]
  assessmentsCompleted: string[]
  contentViewed: string[]
}

interface SoftMembershipBenefits {
  id: string
  title: string
  description: string
  unlocked: boolean
  category: 'tools' | 'content' | 'community' | 'insights'
  requiredScore?: number
}

const defaultBenefits: SoftMembershipBenefits[] = [
  {
    id: 'tool-access',
    title: 'Free Assessment Tools',
    description: 'Access to 5+ personality and potential assessment tools',
    unlocked: true,
    category: 'tools'
  },
  {
    id: 'progress-tracking',
    title: 'Progress Tracking',
    description: 'Save and track your assessment results over time',
    unlocked: true,
    category: 'insights'
  },
  {
    id: 'personalized-insights',
    title: 'Personalized Insights',
    description: 'Get customized recommendations based on your profile',
    unlocked: false,
    category: 'insights',
    requiredScore: 50
  },
  {
    id: 'exclusive-content',
    title: 'Exclusive Content Library',
    description: 'Access to premium articles, videos, and resources',
    unlocked: false,
    category: 'content',
    requiredScore: 100
  },
  {
    id: 'community-access',
    title: 'Community Forum',
    description: 'Connect with other growth-minded individuals',
    unlocked: false,
    category: 'community',
    requiredScore: 150
  },
  {
    id: 'monthly-challenges',
    title: 'Monthly Growth Challenges',
    description: 'Participate in structured 30-day transformation programs',
    unlocked: false,
    category: 'tools',
    requiredScore: 200
  }
]

export function useSoftMembership() {
  const [membershipData, setMembershipData] = useState<SoftMembershipData | null>(null)
  const [benefits, setBenefits] = useState<SoftMembershipBenefits[]>(defaultBenefits)
  const [isLoading, setIsLoading] = useState(true)
  const [registrationStep, setRegistrationStep] = useState<'email' | 'profile' | 'complete'>('email')
  const { trackEngagement } = useEngagementTracking()

  // Load membership data on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadMembershipData()
    }
  }, [])

  // Update benefits based on engagement score
  useEffect(() => {
    if (membershipData) {
      updateBenefitsAccess(membershipData.engagementScore)
    }
  }, [membershipData])

  const loadMembershipData = async () => {
    try {
      setIsLoading(true)
      
      // Check localStorage first (client-side only)
      if (typeof window !== 'undefined') {
        const localData = localStorage.getItem('soft_membership_data')
        if (localData) {
          const parsedData = JSON.parse(localData)
          setMembershipData(parsedData)
          
          // Sync with backend if user exists
          await syncMembershipData(parsedData.email)
        }
      }
    } catch (error) {
      console.error('Error loading membership data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const syncMembershipData = async (email: string) => {
    try {
      const response = await fetch('/.netlify/functions/get-soft-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const serverData = await response.json()
        if (serverData.membership) {
          setMembershipData(serverData.membership)
          if (typeof window !== 'undefined') {
            localStorage.setItem('soft_membership_data', JSON.stringify(serverData.membership))
          }
        }
      }
    } catch (error) {
      console.error('Error syncing membership data:', error)
    }
  }

  const registerSoftMember = async (data: {
    email: string
    firstName?: string
    interests?: string[]
    source?: string
  }) => {
    try {
      trackEngagement({
        type: 'cta_click',
        section: 'soft-membership-registration',
        metadata: {
          step: registrationStep,
          source: data.source
        }
      })

      const membershipData: SoftMembershipData = {
        email: data.email,
        firstName: data.firstName,
        interests: data.interests || [],
        source: data.source || 'direct',
        membershipLevel: 'soft',
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        engagementScore: 10, // Starting score
        toolsAccessed: [],
        assessmentsCompleted: [],
        contentViewed: []
      }

      // Save to backend
      const response = await fetch('/.netlify/functions/register-soft-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(membershipData),
      })

      if (response.ok) {
        const result = await response.json()
        setMembershipData(result.membership)
        if (typeof window !== 'undefined') {
          localStorage.setItem('soft_membership_data', JSON.stringify(result.membership))
        }
        setRegistrationStep('complete')
        
        // Track successful registration
        trackEngagement({
          type: 'cta_click',
          section: 'soft-membership-registration',
          metadata: {
            action: 'registration-complete',
            source: data.source
          }
        })

        return { success: true, membership: result.membership }
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      console.error('Error registering soft member:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  const updateEngagementScore = async (points: number, activity: string) => {
    if (!membershipData) return

    const updatedData = {
      ...membershipData,
      engagementScore: membershipData.engagementScore + points,
      lastActive: new Date().toISOString()
    }

    // Update activity arrays based on activity type
    if (activity.includes('tool-')) {
      const toolName = activity.replace('tool-', '')
      if (!updatedData.toolsAccessed.includes(toolName)) {
        updatedData.toolsAccessed.push(toolName)
      }
    } else if (activity.includes('assessment-')) {
      const assessmentName = activity.replace('assessment-', '')
      if (!updatedData.assessmentsCompleted.includes(assessmentName)) {
        updatedData.assessmentsCompleted.push(assessmentName)
      }
    } else if (activity.includes('content-')) {
      const contentId = activity.replace('content-', '')
      if (!updatedData.contentViewed.includes(contentId)) {
        updatedData.contentViewed.push(contentId)
      }
    }

    setMembershipData(updatedData)
    if (typeof window !== 'undefined') {
      localStorage.setItem('soft_membership_data', JSON.stringify(updatedData))
    }

    // Sync with backend
    try {
      await fetch('/.netlify/functions/update-engagement-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: membershipData.email,
          points,
          activity,
          membershipData: updatedData
        }),
      })
    } catch (error) {
      console.error('Error updating engagement score:', error)
    }

    // Track engagement
    trackEngagement({
      type: 'benefit_interaction',
      section: 'soft-membership',
      metadata: {
        activity,
        points,
        newScore: updatedData.engagementScore
      }
    })
  }

  const updateBenefitsAccess = (engagementScore: number) => {
    const updatedBenefits = benefits.map(benefit => ({
      ...benefit,
      unlocked: benefit.unlocked || (benefit.requiredScore ? engagementScore >= benefit.requiredScore : false)
    }))
    setBenefits(updatedBenefits)
  }

  const getNextBenefit = () => {
    const lockedBenefits = benefits.filter(b => !b.unlocked && b.requiredScore)
    if (lockedBenefits.length === 0) return null

    return lockedBenefits.reduce((next, current) => 
      (current.requiredScore || 0) < (next.requiredScore || 0) ? current : next
    )
  }

  const getProgressToNextBenefit = () => {
    const nextBenefit = getNextBenefit()
    if (!nextBenefit || !membershipData) return null

    const currentScore = membershipData.engagementScore
    const requiredScore = nextBenefit.requiredScore || 0
    const progress = Math.min((currentScore / requiredScore) * 100, 100)

    return {
      benefit: nextBenefit,
      progress,
      pointsNeeded: Math.max(0, requiredScore - currentScore)
    }
  }

  const isSoftMember = () => {
    return membershipData !== null
  }

  const canAccessTool = (toolName: string) => {
    if (!membershipData) return false
    
    // Basic tools are always accessible to soft members
    const basicTools = ['potential-quotient', 'decision-style', 'leadership-style']
    if (basicTools.includes(toolName)) return true

    // Premium tools require higher engagement scores
    const premiumTools = {
      'future-self': 50,
      'transformation-readiness': 100,
      'success-factors': 150
    }

    const requiredScore = premiumTools[toolName as keyof typeof premiumTools]
    return requiredScore ? membershipData.engagementScore >= requiredScore : false
  }

  const getMembershipStats = () => {
    if (!membershipData) return null

    return {
      memberSince: membershipData.joinedAt,
      engagementScore: membershipData.engagementScore,
      toolsAccessed: membershipData.toolsAccessed.length,
      assessmentsCompleted: membershipData.assessmentsCompleted.length,
      contentViewed: membershipData.contentViewed.length,
      membershipLevel: membershipData.membershipLevel
    }
  }

  return {
    membershipData,
    benefits,
    isLoading,
    registrationStep,
    setRegistrationStep,
    registerSoftMember,
    updateEngagementScore,
    getNextBenefit,
    getProgressToNextBenefit,
    isSoftMember,
    canAccessTool,
    getMembershipStats,
    loadMembershipData
  }
}
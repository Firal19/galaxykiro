/**
 * useHeroBusiness - Business logic hook for hero section
 * 
 * Handles user interactions, lead capture, and assessment flow using services
 */

"use client"

import { useState, useCallback } from "react"
import { useLeadService } from "@/components/providers/ServiceProvider"

export function useHeroBusiness() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const leadService = useLeadService()

  // Handle discover potential click
  const handleDiscoverClick = useCallback(() => {
    setIsModalOpen(true)
    
    // Track engagement
    leadService.trackEngagement('content_engagement', {
      action: 'hero_cta_clicked',
      element: 'discover_button'
    })
  }, [leadService])

  // Handle learn more click
  const handleLearnMoreClick = useCallback(() => {
    // Smooth scroll to features section or open info modal
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }

    // Track engagement
    leadService.trackEngagement('content_engagement', {
      action: 'hero_learn_more_clicked',
      element: 'learn_more_button'
    })
  }, [leadService])

  // Handle email capture from modal
  const handleEmailCapture = useCallback(async (email: string, source: string = 'hero-modal') => {
    setIsLoading(true)
    
    try {
      // Track email capture
      await leadService.trackEngagement('email_captured', {
        email,
        source,
        entryPoint: 'hero-section'
      })

      setUserEmail(email)
      setIsModalOpen(false)
      setIsAssessmentOpen(true)

      console.log('✅ Email captured successfully:', email)
    } catch (error) {
      console.error('❌ Email capture failed:', error)
      // Handle error gracefully
    } finally {
      setIsLoading(false)
    }
  }, [leadService])

  // Handle assessment completion
  const handleAssessmentComplete = useCallback(async (results: any) => {
    try {
      // Track assessment completion
      await leadService.trackEngagement('assessment_completed', {
        email: userEmail,
        results,
        source: 'hero-assessment'
      })

      setIsAssessmentOpen(false)
      
      // Could redirect to results page or show results modal
      console.log('✅ Assessment completed:', results)
    } catch (error) {
      console.error('❌ Assessment completion tracking failed:', error)
    }
  }, [leadService, userEmail])

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    
    // Track modal abandonment
    leadService.trackEngagement('content_engagement', {
      action: 'hero_modal_closed',
      element: 'lead_capture_modal'
    })
  }, [leadService])

  // Handle assessment close
  const handleAssessmentClose = useCallback(() => {
    setIsAssessmentOpen(false)
    
    // Track assessment abandonment
    leadService.trackEngagement('content_engagement', {
      action: 'hero_assessment_closed',
      element: 'potential_assessment'
    })
  }, [leadService])

  return {
    // State
    isModalOpen,
    isAssessmentOpen,
    userEmail,
    isLoading,
    
    // Actions
    handleDiscoverClick,
    handleLearnMoreClick,
    handleEmailCapture,
    handleAssessmentComplete,
    handleModalClose,
    handleAssessmentClose,
    
    // Setters (for external control if needed)
    setIsModalOpen,
    setIsAssessmentOpen,
    setUserEmail
  }
}
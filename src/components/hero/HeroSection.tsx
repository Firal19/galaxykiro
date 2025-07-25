/**
 * HeroSection - Refactored clean architecture
 * 
 * Composed from atomic components with service-driven business logic
 */

"use client"

import { cn } from "@/lib/utils"
import { HeroContent } from "./molecules/HeroContent"
import { HeroVideoSection } from "./molecules/HeroVideoSection"
import { LeadCaptureModal } from "@/components/lead-capture-modal"
import { PotentialAssessment } from "@/components/potential-assessment"
import { useHeroBusiness } from "./hooks/useHeroBusiness"

interface HeroSectionProps {
  className?: string
}

export function HeroSection({ className }: HeroSectionProps) {
  const {
    isModalOpen,
    isAssessmentOpen,
    userEmail,
    isLoading,
    handleDiscoverClick,
    handleLearnMoreClick,
    handleEmailCapture,
    handleAssessmentComplete,
    handleModalClose,
    handleAssessmentClose
  } = useHeroBusiness()

  return (
    <>
      <section className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30",
        "dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20",
        className
      )}>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-gray-100/[0.02]" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Content */}
            <HeroContent 
              onDiscoverClick={handleDiscoverClick}
              onLearnMoreClick={handleLearnMoreClick}
            />

            {/* Right Column - Video */}
            <HeroVideoSection />
            
          </div>
        </div>
      </section>

      {/* Modals */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onEmailCapture={handleEmailCapture}
        isLoading={isLoading}
      />

      <PotentialAssessment
        isOpen={isAssessmentOpen}
        onClose={handleAssessmentClose}
        onComplete={handleAssessmentComplete}
        userEmail={userEmail}
      />
    </>
  )
}
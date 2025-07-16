"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "./lead-capture-modal"
import { ProgressiveForm } from "./progressive-form"
import { ProgressiveCaptureWizard } from "./progressive-capture-wizard"
import { useAppStore } from "@/lib/store"

/**
 * Example component demonstrating the Progressive Information Capture System
 * This shows how to use the different components for various capture scenarios
 */
export function ProgressiveFormExample() {
  const [modalType, setModalType] = useState<string | null>(null)
  const { user, captureUserInfo } = useAppStore()

  // Handle form submission
  const handleFormSubmit = async (data: Record<string, unknown>, level: number) => {
    console.log('Form submitted:', { data, level })
    
    try {
      // This would typically call your API
      await captureUserInfo(level as 1 | 2 | 3, data, 'example-form')
      console.log('User info captured successfully')
    } catch (error) {
      console.error('Error capturing user info:', error)
      throw error
    }
  }

  const handleStartAssessment = (data: Record<string, unknown>) => {
    console.log('Starting assessment with data:', data)
    // Navigate to assessment or trigger assessment modal
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Progressive Information Capture System
        </h1>
        <p className="text-muted-foreground mb-8">
          Demonstration of different capture scenarios and components
        </p>
        
        {user && (
          <div className="bg-muted/50 rounded-lg p-4 mb-8">
            <h3 className="font-semibold mb-2">Current User Status:</h3>
            <p>Email: {user.email || 'Not provided'}</p>
            <p>Phone: {user.phone || 'Not provided'}</p>
            <p>Name: {user.fullName || 'Not provided'}</p>
            <p>City: {user.city || 'Not provided'}</p>
            <p>Capture Level: {user.captureLevel}</p>
            <p>Current Tier: {user.currentTier}</p>
          </div>
        )}
      </div>

      {/* Example Buttons */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Level 1 Capture */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Level 1 - Email Only</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Simple email capture for basic access
          </p>
          <Button 
            onClick={() => setModalType('level1')}
            variant="outline"
            className="w-full"
          >
            Open Level 1 Form
          </Button>
        </div>

        {/* Level 2 Capture */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Level 2 - Email + Phone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Email and phone for enhanced features
          </p>
          <Button 
            onClick={() => setModalType('level2')}
            variant="outline"
            className="w-full"
          >
            Open Level 2 Form
          </Button>
        </div>

        {/* Level 3 Capture */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Level 3 - Full Profile</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete profile for full personalization
          </p>
          <Button 
            onClick={() => setModalType('level3')}
            variant="outline"
            className="w-full"
          >
            Open Level 3 Form
          </Button>
        </div>

        {/* Special Fields - Name + City */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Name + City Capture</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Special field combination for habit analyzer
          </p>
          <Button 
            onClick={() => setModalType('name-city')}
            variant="outline"
            className="w-full"
          >
            Open Name + City Form
          </Button>
        </div>

        {/* Office Location */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Office Location</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Office location selection for leadership assessment
          </p>
          <Button 
            onClick={() => setModalType('office-location')}
            variant="outline"
            className="w-full"
          >
            Open Office Location Form
          </Button>
        </div>

        {/* Progressive Wizard */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Progressive Wizard</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Multi-step wizard with benefits and progress
          </p>
          <Button 
            onClick={() => setModalType('wizard')}
            variant="cta"
            className="w-full"
          >
            Open Progressive Wizard
          </Button>
        </div>
      </div>

      {/* Inline Form Example */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Inline Progressive Form</h3>
        <p className="text-muted-foreground mb-6">
          Example of using the ProgressiveForm component inline (not in a modal)
        </p>
        <ProgressiveForm
          level={1}
          onSubmit={handleFormSubmit}
          title="Get Started Today"
          description="Enter your information to access personalized insights"
          ctaText="Get My Insights"
          allowLevelProgression={true}
          showProgress={true}
          entryPoint="inline-example"
        />
      </div>

      {/* Modals */}
      
      {/* Level 1 Modal */}
      <LeadCaptureModal
        isOpen={modalType === 'level1'}
        onClose={() => setModalType(null)}
        onSubmit={async (data) => await handleFormSubmit(data, 1)}
        onStartAssessment={handleStartAssessment}
        title="Get Your Assessment"
        description="Enter your email to access your personalized potential assessment"
        level={1}
        entryPoint="level1-example"
      />

      {/* Level 2 Modal */}
      <LeadCaptureModal
        isOpen={modalType === 'level2'}
        onClose={() => setModalType(null)}
        onSubmit={async (data) => await handleFormSubmit(data, 2)}
        onStartAssessment={handleStartAssessment}
        title="Unlock More Features"
        description="Add your phone number to receive personalized tips and exclusive content"
        level={2}
        entryPoint="level2-example"
      />

      {/* Level 3 Modal */}
      <LeadCaptureModal
        isOpen={modalType === 'level3'}
        onClose={() => setModalType(null)}
        onSubmit={async (data) => await handleFormSubmit(data, 3)}
        onStartAssessment={handleStartAssessment}
        title="Complete Your Profile"
        description="Complete your profile for the most personalized experience possible"
        level={3}
        entryPoint="level3-example"
      />

      {/* Name + City Modal */}
      <LeadCaptureModal
        isOpen={modalType === 'name-city'}
        onClose={() => setModalType(null)}
        onSubmit={async (data) => await handleFormSubmit(data, 2)}
        onStartAssessment={handleStartAssessment}
        title="Habit Strength Analyzer"
        description="Enter your name and city to get your personalized habit analysis"
        specialFields="name-city"
        entryPoint="habit-analyzer"
      />

      {/* Office Location Modal */}
      <LeadCaptureModal
        isOpen={modalType === 'office-location'}
        onClose={() => setModalType(null)}
        onSubmit={async (data) => await handleFormSubmit(data, 2)}
        onStartAssessment={handleStartAssessment}
        title="Leadership Style Identifier"
        description="Select your preferred office location for personalized leadership insights"
        specialFields="office-location"
        entryPoint="leadership-identifier"
      />

      {/* Progressive Wizard */}
      <ProgressiveCaptureWizard
        isOpen={modalType === 'wizard'}
        onClose={() => setModalType(null)}
        onComplete={handleFormSubmit}
        entryPoint="wizard-example"
        showBenefits={true}
        allowSkip={true}
      />
    </div>
  )
}
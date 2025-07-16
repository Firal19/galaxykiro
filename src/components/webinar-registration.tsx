'use client'

import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Modal } from './ui/modal'
import { WebinarModel } from '../lib/models/webinar'
import { ProgressiveForm } from './progressive-form'
import { useAuth } from '../lib/contexts/auth-context'

interface WebinarRegistrationProps {
  webinar: WebinarModel | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (registrationId: string) => void
}

interface RegistrationFormData {
  // Level 1 - Basic info (required)
  email: string
  
  // Level 2 - Contact info
  phone?: string
  full_name?: string
  
  // Level 3 - Professional info
  company?: string
  role?: string
  
  // Progressive profiling questions
  interests?: string[]
  experience_level?: string
  goals?: string[]
  how_heard?: string
  questions?: string
}

const INTEREST_OPTIONS = [
  'Personal Development',
  'Leadership Skills',
  'Goal Achievement',
  'Habit Formation',
  'Mindset Training',
  'Career Growth',
  'Life Balance',
  'Communication Skills'
]

const EXPERIENCE_LEVELS = [
  'Beginner - New to personal development',
  'Intermediate - Some experience with self-improvement',
  'Advanced - Experienced in personal growth work',
  'Expert - Professional in the field'
]

const GOAL_OPTIONS = [
  'Increase productivity',
  'Build better habits',
  'Improve leadership skills',
  'Achieve work-life balance',
  'Advance my career',
  'Start a business',
  'Improve relationships',
  'Find life purpose'
]

const HOW_HEARD_OPTIONS = [
  'Social media',
  'Google search',
  'Friend referral',
  'Email newsletter',
  'Previous webinar',
  'Blog post',
  'Other'
]

export function WebinarRegistration({ 
  webinar, 
  isOpen, 
  onClose, 
  onSuccess 
}: WebinarRegistrationProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: user?.email || '',
    full_name: user?.fullName || '',
    phone: user?.phone || '',
    interests: [],
    goals: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        full_name: user.fullName || prev.full_name,
        phone: user.phone || prev.phone
      }))
    }
  }, [user])

  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const handleArrayToggle = (field: 'interests' | 'goals', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] || []
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      
      return {
        ...prev,
        [field]: newArray
      }
    })
  }

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!(formData.email && formData.email.includes('@'))
      case 2:
        return !!(formData.phone && formData.full_name)
      case 3:
        return true // Optional step
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3))
    } else {
      setError('Please fill in all required fields')
    }
  }

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1))
    setError(null)
  }

  const handleSubmit = async () => {
    if (!webinar) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/webinars/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webinarId: webinar.id,
          registrationData: formData,
          registrationSource: 'website'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      const result = await response.json()
      onSuccess(result.registrationId)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date)
  }

  if (!webinar) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register for Webinar">
      <div className="max-w-2xl mx-auto">
        {/* Webinar Info Header */}
        <Card className="p-4 mb-6 bg-blue-50">
          <h3 className="font-semibold text-lg mb-2">{webinar.title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {formatDate(new Date(webinar.scheduledAt))}
          </p>
          <p className="text-sm text-gray-600">
            Duration: {webinar.durationMinutes} minutes
          </p>
        </Card>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber <= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  stepNumber < step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {step === 1 && (
            <div>
              <h4 className="text-lg font-medium mb-4">Basic Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What interests you most about this webinar?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <label key={interest} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.interests?.includes(interest) || false}
                          onChange={() => handleArrayToggle('interests', interest)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="text-lg font-medium mb-4">Contact Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={formData.experience_level || ''}
                    onChange={(e) => handleInputChange('experience_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your experience level</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 className="text-lg font-medium mb-4">Professional Background (Optional)</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Position
                  </label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your job title or role"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your main goals?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GOAL_OPTIONS.map((goal) => (
                      <label key={goal} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.goals?.includes(goal) || false}
                          onChange={() => handleArrayToggle('goals', goal)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    value={formData.how_heard || ''}
                    onChange={(e) => handleInputChange('how_heard', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an option</option>
                    {HOW_HEARD_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Questions for the presenter (optional)
                  </label>
                  <textarea
                    value={formData.questions || ''}
                    onChange={(e) => handleInputChange('questions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Any specific questions you'd like addressed during the webinar?"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div>
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            
            {step < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={!validateStep(step) || loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </Button>
            )}
          </div>
        </div>

        {/* Skip Option for Step 3 */}
        {step === 3 && (
          <div className="text-center mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Skip and register with basic info
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}
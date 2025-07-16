'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../../lib/contexts/auth-context'
import { createOrUpdateUser, getAttributionData, getOrCreateSessionId } from '../../../lib/auth'
import { Button } from '../../../components/ui/button'
import Link from 'next/link'

export default function CapturePage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const level = parseInt(searchParams.get('level') || '1') as 1 | 2 | 3
  const returnTo = searchParams.get('returnTo') || '/'

  useEffect(() => {
    // Pre-populate with existing user data if available
    if (user) {
      setEmail(user.email)
      // We'd need to fetch additional user data here if available
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get attribution data for tracking
      const attribution = getAttributionData()
      const sessionId = getOrCreateSessionId()
      
      // Prepare data based on capture level
      const captureData: any = { email }
      
      if (level >= 2) {
        if (!phone.trim()) {
          setError('Phone number is required for this level')
          setLoading(false)
          return
        }
        captureData.phone = phone
      }
      
      if (level >= 3) {
        if (!fullName.trim() || !city.trim()) {
          setError('Full name and city are required for this level')
          setLoading(false)
          return
        }
        captureData.fullName = fullName
        captureData.city = city
      }

      // Add attribution data
      captureData.entryPoint = attribution ? `${attribution.memberId}_${attribution.postId}` : 'direct'
      captureData.language = 'en' // Default to English

      const result = await createOrUpdateUser(level, captureData, sessionId)

      if (result) {
        // Refresh user context
        await refreshUser()
        
        // Show success message and redirect
        router.push(returnTo)
      } else {
        setError('Failed to update your information')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (level) {
      case 1: return 'Get Started'
      case 2: return 'Stay Connected'
      case 3: return 'Complete Your Profile'
      default: return 'Update Information'
    }
  }

  const getStepDescription = () => {
    switch (level) {
      case 1: return 'Enter your email to begin your transformation journey'
      case 2: return 'Add your phone number to receive personalized insights'
      case 3: return 'Complete your profile to unlock premium features'
      default: return 'Update your information'
    }
  }

  const getRequiredFields = () => {
    const fields = ['Email']
    if (level >= 2) fields.push('Phone')
    if (level >= 3) fields.push('Full Name', 'City')
    return fields
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= level
                      ? 'bg-purple-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {getStepTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getStepDescription()}
          </p>
          
          <div className="mt-4 text-xs text-gray-500">
            Step {level} of 3 • Required: {getRequiredFields().join(', ')}
          </div>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Email - Always required */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your email"
              />
            </div>
            
            {/* Phone - Level 2+ */}
            {level >= 2 && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your phone number"
                />
                <p className="mt-1 text-xs text-gray-500">
                  We'll send you personalized insights and updates
                </p>
              </div>
            )}
            
            {/* Full Name - Level 3+ */}
            {level >= 3 && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            {/* City - Level 3+ */}
            {level >= 3 && (
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your city"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Help us connect you with local opportunities
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : level === 3 ? 'Complete Profile' : 'Continue'}
          </Button>

          <div className="text-center space-y-2">
            {level < 3 && (
              <p className="text-sm text-gray-600">
                You can complete this later in your profile
              </p>
            )}
            
            <div className="flex justify-center space-x-4 text-sm">
              <Link 
                href={returnTo}
                className="font-medium text-gray-500 hover:text-gray-700"
              >
                Skip for now
              </Link>
              
              {level > 1 && (
                <Link 
                  href={`/auth/capture?level=${level - 1}&returnTo=${encodeURIComponent(returnTo)}`}
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Previous step
                </Link>
              )}
            </div>
          </div>

          {/* Privacy notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Your information is secure and will only be used to personalize your experience.{' '}
              <Link href="/privacy" className="text-purple-600 hover:text-purple-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from '../../../lib/auth'
import { trackingService } from '../../../lib/tracking'
import { Level1Schema, Level2Schema, Level3Schema, Level1Data, Level2Data, Level3Data } from '../../../lib/validations'

type RegistrationLevel = 1 | 2 | 3
type FormData = Level1Data | Level2Data | Level3Data

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const returnTo = searchParams.get('returnTo') || '/'
  const initialLevel = parseInt(searchParams.get('level') || '1') as RegistrationLevel
  const memberUrl = searchParams.get('ref') || searchParams.get('member') || undefined
  
  const [currentLevel, setCurrentLevel] = useState<RegistrationLevel>(initialLevel)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Get the appropriate schema and default values based on level
  const getSchemaAndDefaults = (level: RegistrationLevel) => {
    switch (level) {
      case 1:
        return { schema: Level1Schema, defaults: { email: '' } }
      case 2:
        return { schema: Level2Schema, defaults: { email: '', phone: '' } }
      case 3:
        return { schema: Level3Schema, defaults: { email: '', phone: '', fullName: '', city: '' } }
    }
  }

  const { schema, defaults } = getSchemaAndDefaults(currentLevel)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaults
  })

  useEffect(() => {
    // Track page view
    trackingService.trackPageView(undefined, {
      page: 'auth_register',
      level: currentLevel,
      returnTo,
      memberUrl
    })
  }, [currentLevel, returnTo, memberUrl])

  useEffect(() => {
    // Reset form when level changes
    const { defaults: newDefaults } = getSchemaAndDefaults(currentLevel)
    reset(newDefaults)
  }, [currentLevel, reset])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Get attribution data for tracking
      const attribution = trackingService.getAttributionData()
      
      const result = await authService.progressiveRegister({
        level: currentLevel,
        data,
        entryPoint: attribution?.entryPoint || '/',
        memberUrl,
        utmParams: attribution ? {
          utm_source: attribution.utmSource || '',
          utm_medium: attribution.utmMedium || '',
          utm_campaign: attribution.utmCampaign || '',
          utm_term: attribution.utmTerm || '',
          utm_content: attribution.utmContent || ''
        } : undefined
      })

      // Track successful registration
      await trackingService.trackUserJourney({
        userId: result.user.id,
        eventType: 'registration_success',
        eventData: {
          level: currentLevel,
          isNewUser: result.isNewUser,
          memberUrl,
          returnTo
        }
      })

      // Update session tracking
      trackingService.updateSessionWithUser(result.user.id)

      setSuccess(result.isNewUser ? 'Account created successfully!' : 'Profile updated successfully!')

      // Redirect after a short delay
      setTimeout(() => {
        router.push(returnTo)
      }, 1500)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      
      // Track registration error
      await trackingService.trackUserJourney({
        eventType: 'registration_error',
        eventData: {
          error: errorMessage,
          level: currentLevel,
          email: 'email' in data ? data.email : undefined
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLevelChange = (newLevel: RegistrationLevel) => {
    setCurrentLevel(newLevel)
    setError(null)
    setSuccess(null)
  }

  const handleSignInRedirect = () => {
    const signInUrl = new URL('/auth/signin', window.location.origin)
    if (returnTo) {
      signInUrl.searchParams.set('returnTo', returnTo)
    }
    router.push(signInUrl.toString())
  }

  const getLevelDescription = (level: RegistrationLevel) => {
    switch (level) {
      case 1:
        return 'Get started with just your email to access basic tools and insights'
      case 2:
        return 'Add your phone number to unlock intermediate assessments and personalized content'
      case 3:
        return 'Complete your profile to access all premium tools and features'
    }
  }

  const getLevelBenefits = (level: RegistrationLevel) => {
    switch (level) {
      case 1:
        return ['Potential Assessment', 'Basic insights', 'Email updates']
      case 2:
        return ['All Level 1 benefits', 'Success Factor Calculator', 'Habit Strength Analyzer', 'SMS notifications']
      case 3:
        return ['All previous benefits', 'Future Self Visualizer', 'Leadership Style Identifier', 'Full profile insights', 'Priority support']
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Start Your Journey
        </h1>
        <p className="text-gray-600">
          {getLevelDescription(currentLevel)}
        </p>
      </div>

      {/* Level Selection */}
      <div className="mb-6">
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => handleLevelChange(level as RegistrationLevel)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentLevel === level
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Level {level}
            </button>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-green-50 rounded-md p-4 mb-6">
          <h3 className="text-sm font-medium text-green-800 mb-2">What you&apos;ll get:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            {getLevelBenefits(currentLevel).map((benefit, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email (Level 1+) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone (Level 2+) */}
        {currentLevel >= 2 && (
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your phone number"
            />
            {'phone' in errors && errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        )}

        {/* Full Name and City (Level 3) */}
        {currentLevel >= 3 && (
          <>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                {...register('fullName')}
                type="text"
                id="fullName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your full name"
              />
              {'fullName' in errors && errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                {...register('city')}
                type="text"
                id="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating Account...' : `Continue with Level ${currentLevel}`}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={handleSignInRedirect}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>

      {memberUrl && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Referred by:</span> {memberUrl}
          </p>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          By registering, you agree to our Terms of Service and Privacy Policy.
          You can upgrade your profile level anytime to access more features.
        </p>
      </div>
    </div>
  )
}
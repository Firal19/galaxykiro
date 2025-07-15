'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../../lib/contexts/auth-context'
import { authService } from '../../../lib/auth'
import { trackingService } from '../../../lib/tracking'
import { Level2Schema, Level3Schema, Level2Data, Level3Data } from '../../../lib/validations'

type CaptureLevel = 2 | 3
type FormData = Level2Data | Level3Data

export default function CapturePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, refreshUser } = useAuth()
  
  const requiredLevel = parseInt(searchParams.get('level') || '2') as CaptureLevel
  const returnTo = searchParams.get('returnTo') || '/'
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Redirect if user already has required level
  useEffect(() => {
    if (user && user.captureLevel >= requiredLevel) {
      router.push(returnTo)
    }
  }, [user, requiredLevel, returnTo, router])

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      const signInUrl = new URL('/auth/signin', window.location.origin)
      signInUrl.searchParams.set('returnTo', window.location.pathname + window.location.search)
      router.push(signInUrl.toString())
    }
  }, [user, router])

  const getSchemaAndDefaults = (level: CaptureLevel) => {
    switch (level) {
      case 2:
        return { 
          schema: Level2Schema, 
          defaults: { 
            email: user?.email || '', 
            phone: user?.phone || '' 
          } 
        }
      case 3:
        return { 
          schema: Level3Schema, 
          defaults: { 
            email: user?.email || '', 
            phone: user?.phone || '',
            fullName: user?.fullName || '',
            city: user?.city || ''
          } 
        }
    }
  }

  const { schema, defaults } = getSchemaAndDefaults(requiredLevel)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaults
  })

  useEffect(() => {
    // Track page view
    trackingService.trackPageView(user?.id, {
      page: 'auth_capture',
      level: requiredLevel,
      returnTo
    })
  }, [user?.id, requiredLevel, returnTo])

  const onSubmit = async (data: FormData) => {
    if (!user) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await authService.updateProfile(data)
      
      // Refresh user data
      await refreshUser()

      // Track successful capture
      await trackingService.trackUserJourney({
        userId: user.id,
        eventType: 'capture_level_upgrade',
        eventData: {
          previousLevel: user.captureLevel,
          newLevel: requiredLevel,
          returnTo
        }
      })

      setSuccess('Profile updated successfully!')

      // Redirect after a short delay
      setTimeout(() => {
        router.push(returnTo)
      }, 1500)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed'
      setError(errorMessage)
      
      // Track capture error
      await trackingService.trackUserJourney({
        userId: user?.id,
        eventType: 'capture_level_error',
        eventData: {
          error: errorMessage,
          level: requiredLevel
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getLevelDescription = (level: CaptureLevel) => {
    switch (level) {
      case 2:
        return 'Add your phone number to unlock intermediate assessments and personalized content'
      case 3:
        return 'Complete your profile to access all premium tools and features'
    }
  }

  const getLevelBenefits = (level: CaptureLevel) => {
    switch (level) {
      case 2:
        return [
          'Success Factor Calculator',
          'Habit Strength Analyzer', 
          'SMS notifications for important updates',
          'Personalized content recommendations'
        ]
      case 3:
        return [
          'Future Self Visualizer',
          'Leadership Style Identifier',
          'Complete assessment suite',
          'Full profile insights',
          'Priority support access',
          'Advanced analytics dashboard'
        ]
    }
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Unlock More Features
        </h1>
        <p className="text-gray-600">
          {getLevelDescription(requiredLevel)}
        </p>
      </div>

      {/* Current vs Required Level */}
      <div className="mb-6 p-4 bg-blue-50 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-blue-800">Current Level</p>
            <p className="text-lg font-bold text-blue-900">Level {user.captureLevel}</p>
          </div>
          <div className="text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Required Level</p>
            <p className="text-lg font-bold text-blue-900">Level {requiredLevel}</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-green-50 rounded-md p-4 mb-6">
        <h3 className="text-sm font-medium text-green-800 mb-2">What you&apos;ll unlock:</h3>
        <ul className="text-sm text-green-700 space-y-1">
          {getLevelBenefits(requiredLevel).map((benefit, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email (read-only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
          />
        </div>

        {/* Phone (Level 2+) */}
        {requiredLevel >= 2 && (
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
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        )}

        {/* Full Name and City (Level 3) */}
        {requiredLevel >= 3 && (
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
              {'city' in errors && errors.city && (
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
          {isLoading ? 'Updating Profile...' : `Upgrade to Level ${requiredLevel}`}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-700 text-sm"
        >
          Maybe later
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Your information is secure and used only to provide personalized experiences.
          You can update your preferences anytime in your profile settings.
        </p>
      </div>
    </div>
  )
}
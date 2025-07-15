'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '../../../lib/auth'
import { trackingService } from '../../../lib/tracking'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  useEffect(() => {
    // Track page view
    trackingService.trackPageView(undefined, {
      page: 'auth_signin',
      returnTo
    })
  }, [returnTo])

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.signIn(data.email)
      
      // Track successful sign in
      await trackingService.trackUserJourney({
        userId: result.user.id,
        eventType: 'sign_in_success',
        eventData: {
          method: 'email',
          returnTo
        }
      })

      // Update session tracking
      trackingService.updateSessionWithUser(result.user.id)

      // Redirect to return URL or dashboard
      router.push(returnTo)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
      setError(errorMessage)
      
      // Track sign in error
      await trackingService.trackUserJourney({
        eventType: 'sign_in_error',
        eventData: {
          error: errorMessage,
          email: data.email
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterRedirect = () => {
    const registerUrl = new URL('/auth/register', window.location.origin)
    if (returnTo) {
      registerUrl.searchParams.set('returnTo', returnTo)
    }
    router.push(registerUrl.toString())
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600">
          Continue your personal development journey
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            onClick={handleRegisterRedirect}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Start your journey
          </button>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy.
          Your data is protected and used only to enhance your personal development experience.
        </p>
      </div>
    </div>
  )
}
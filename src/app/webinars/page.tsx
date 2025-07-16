'use client'

import { useState } from 'react'
import { WebinarListing } from '../../components/webinar-listing'
import { WebinarRegistration } from '../../components/webinar-registration'
import { WebinarModel } from '../../lib/models/webinar'
import { GalaxyDreamTeamLogo } from '../../components/galaxy-dream-team-logo'

export default function WebinarsPage() {
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarModel | null>(null)
  const [registrationOpen, setRegistrationOpen] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null)

  const handleRegisterClick = (webinar: WebinarModel) => {
    setSelectedWebinar(webinar)
    setRegistrationOpen(true)
  }

  const handleRegistrationClose = () => {
    setRegistrationOpen(false)
    setSelectedWebinar(null)
    setRegistrationSuccess(null)
  }

  const handleRegistrationSuccess = (registrationId: string) => {
    setRegistrationSuccess(registrationId)
    setRegistrationOpen(false)
    
    // Show success message
    setTimeout(() => {
      setRegistrationSuccess(null)
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <GalaxyDreamTeamLogo 
              href="/"
              variant="full"
              size="medium"
              className="transition-opacity hover:opacity-90"
            />
            <div className="text-sm text-gray-600">
              Webinars
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Galaxy Dream Team Webinars
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our live webinars to unlock your potential, learn from Galaxy Dream Team experts, 
              and connect with a community of growth-minded individuals.
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {registrationSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Registration Successful!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    You're all set! Check your email for confirmation details and calendar invite.
                    We'll send you reminder emails before the webinar starts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Webinar Listings */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Sessions
              </h2>
              <WebinarListing 
                onRegisterClick={handleRegisterClick}
                showPastWebinars={false}
                limit={10}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Why Join Our Webinars?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Learn practical strategies you can implement immediately</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Get your questions answered by experts</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Connect with like-minded individuals</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Access recordings if you can't attend live</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Completely free to attend</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Can't Find What You're Looking For?
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                We regularly add new webinars based on community interest. 
                Let us know what topics you'd like to see covered!
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                Suggest a Topic
              </button>
            </div>
          </div>
        </div>

        {/* Past Webinars Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Past Webinars & Recordings
          </h2>
          <WebinarListing 
            onRegisterClick={handleRegisterClick}
            showPastWebinars={true}
            limit={6}
          />
        </div>
      </div>

      {/* Registration Modal */}
      <WebinarRegistration
        webinar={selectedWebinar}
        isOpen={registrationOpen}
        onClose={handleRegistrationClose}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  )
}
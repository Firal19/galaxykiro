'use client'

import React from 'react'
import { GalaxyDreamTeamLogo } from './galaxy-dream-team-logo'

interface BrandedCertificateProps {
  title: string
  recipientName: string
  assessmentType: string
  completionDate: Date
  score?: number
  insights?: string[]
  className?: string
}

export function BrandedCertificate({
  title,
  recipientName,
  assessmentType,
  completionDate,
  score,
  insights = [],
  className = ''
}: BrandedCertificateProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={`bg-white border-2 border-gray-200 rounded-lg p-8 max-w-2xl mx-auto ${className}`}>
      {/* Header with Logo */}
      <div className="text-center mb-8">
        <GalaxyDreamTeamLogo 
          variant="full" 
          size="large" 
          showTagline={true}
          className="justify-center mb-4"
        />
        <div className="h-1 w-24 bg-gradient-to-r from-[#FFD700] via-[#078930] to-[#DA121A] mx-auto rounded-full"></div>
      </div>

      {/* Certificate Content */}
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Certificate of Completion
        </h1>
        
        <p className="text-lg text-gray-600">
          This certifies that
        </p>
        
        <h2 className="text-4xl font-bold text-[#078930] border-b-2 border-[#FFD700] pb-2 inline-block">
          {recipientName}
        </h2>
        
        <p className="text-lg text-gray-600">
          has successfully completed the
        </p>
        
        <h3 className="text-2xl font-semibold text-gray-900">
          {title}
        </h3>
        
        <p className="text-base text-gray-600">
          Assessment Type: <span className="font-medium">{assessmentType}</span>
        </p>
        
        {score && (
          <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#078930]/10 rounded-lg p-4 my-6">
            <p className="text-lg font-semibold text-gray-900">
              Overall Score: <span className="text-2xl text-[#078930]">{score}%</span>
            </p>
          </div>
        )}
        
        {insights.length > 0 && (
          <div className="text-left bg-gray-50 rounded-lg p-6 my-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Insights:</h4>
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <p className="text-base text-gray-600">
          Completed on {formatDate(completionDate)}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600 font-medium">Galaxy Dream Team</p>
            <p className="text-xs text-gray-500">Personal Development Experts</p>
          </div>
          
          <div className="text-right">
            <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600 font-medium">Authorized Signature</p>
            <p className="text-xs text-gray-500">Certificate ID: GDT-{Date.now()}</p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            This certificate is issued by Galaxy Dream Team, Ethiopia's premier personal development platform.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            For verification, visit: www.galaxydreamteam.com/verify
          </p>
        </div>
      </div>
    </div>
  )
}

// Component for downloadable resource headers
export function BrandedResourceHeader({
  title,
  subtitle,
  resourceType = 'Guide',
  className = ''
}: {
  title: string
  subtitle?: string
  resourceType?: string
  className?: string
}) {
  return (
    <div className={`bg-gradient-to-r from-[#FFD700]/10 via-[#078930]/10 to-[#DA121A]/10 p-6 rounded-lg mb-8 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <GalaxyDreamTeamLogo variant="compact" size="medium" />
        <span className="bg-[#078930] text-white px-3 py-1 rounded-full text-sm font-medium">
          {resourceType}
        </span>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      {subtitle && (
        <p className="text-lg text-gray-600">{subtitle}</p>
      )}
      
      <div className="h-1 w-full bg-gradient-to-r from-[#FFD700] via-[#078930] to-[#DA121A] rounded-full mt-4"></div>
    </div>
  )
}
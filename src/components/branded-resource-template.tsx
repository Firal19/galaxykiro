'use client'

import React from 'react'
import { GalaxyDreamTeamLogo } from './galaxy-dream-team-logo'

interface BrandedResourceTemplateProps {
  title: string
  subtitle?: string
  resourceType: 'Guide' | 'Workbook' | 'Assessment' | 'Report' | 'Certificate' | 'Checklist'
  content: React.ReactNode
  downloadable?: boolean
  className?: string
}

export function BrandedResourceTemplate({
  title,
  subtitle,
  resourceType,
  content,
  downloadable = false,
  className = ''
}: BrandedResourceTemplateProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className={`bg-white min-h-screen ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFD700]/10 via-[#078930]/10 to-[#DA121A]/10 p-8 border-b-2 border-[#FFD700]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <GalaxyDreamTeamLogo 
              variant="full" 
              size="large" 
              showTagline={true}
            />
            <div className="text-right">
              <span className="bg-[#078930] text-white px-4 py-2 rounded-full text-sm font-medium">
                {resourceType}
              </span>
              <p className="text-xs text-gray-600 mt-2">{currentDate}</p>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
            )}
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-[#FFD700] via-[#078930] to-[#DA121A] rounded-full mt-6"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-8">
        {content}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-8 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div>
              <GalaxyDreamTeamLogo variant="compact" size="medium" className="mb-4" />
              <p className="text-gray-600 mb-4">
                Galaxy Dream Team is Ethiopia's premier personal development platform, 
                helping individuals unlock their hidden potential through proven tools, 
                assessments, and transformational programs.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Office:</strong> Bole Atlas, 4th Floor, Suite 401, Addis Ababa</p>
                <p><strong>Phone:</strong> +251 11 123 4567</p>
                <p><strong>Email:</strong> hello@galaxydreamteam.com</p>
                <p><strong>Website:</strong> www.galaxydreamteam.com</p>
              </div>
            </div>

            {/* Resource Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About This {resourceType}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Created:</strong> {currentDate}</p>
                <p><strong>Version:</strong> 1.0</p>
                <p><strong>Language:</strong> English</p>
                <p><strong>Copyright:</strong> © {new Date().getFullYear()} Galaxy Dream Team</p>
              </div>
              
              {downloadable && (
                <div className="mt-4 p-4 bg-[#FFD700]/10 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Usage Rights:</strong> This resource is provided for personal development use. 
                    Redistribution or commercial use requires written permission from Galaxy Dream Team.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Attribution */}
          <div className="border-t border-gray-300 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-600">
              This {resourceType.toLowerCase()} is part of Galaxy Dream Team's comprehensive personal development system.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              For more resources and tools, visit www.galaxydreamteam.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Specialized templates for different resource types
export function BrandedGuideTemplate({ 
  title, 
  subtitle, 
  content, 
  className 
}: Omit<BrandedResourceTemplateProps, 'resourceType'>) {
  return (
    <BrandedResourceTemplate
      title={title}
      subtitle={subtitle}
      resourceType="Guide"
      content={content}
      downloadable={true}
      className={className}
    />
  )
}

export function BrandedWorkbookTemplate({ 
  title, 
  subtitle, 
  content, 
  className 
}: Omit<BrandedResourceTemplateProps, 'resourceType'>) {
  return (
    <BrandedResourceTemplate
      title={title}
      subtitle={subtitle}
      resourceType="Workbook"
      content={content}
      downloadable={true}
      className={className}
    />
  )
}

export function BrandedAssessmentTemplate({ 
  title, 
  subtitle, 
  content, 
  className 
}: Omit<BrandedResourceTemplateProps, 'resourceType'>) {
  return (
    <BrandedResourceTemplate
      title={title}
      subtitle={subtitle}
      resourceType="Assessment"
      content={content}
      downloadable={false}
      className={className}
    />
  )
}
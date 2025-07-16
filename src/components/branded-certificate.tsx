"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Download, Share2, Award, Star, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GalaxyDreamTeamLogo } from "./galaxy-dream-team-logo"

interface BrandedCertificateProps {
  recipientName: string
  achievementTitle: string
  achievementDescription: string
  completionDate: string
  certificateType: 'assessment' | 'course' | 'challenge' | 'milestone' | 'membership'
  score?: number
  level?: string
  validationId?: string
  signatoryName?: string
  signatoryTitle?: string
  className?: string
}

const certificateStyles = {
  assessment: {
    primaryColor: 'var(--color-energy-500)',
    secondaryColor: 'var(--color-energy-100)',
    accentColor: 'var(--color-energy-600)',
    icon: Award,
    pattern: 'geometric'
  },
  course: {
    primaryColor: 'var(--color-growth-500)',
    secondaryColor: 'var(--color-growth-100)',
    accentColor: 'var(--color-growth-600)',
    icon: Star,
    pattern: 'waves'
  },
  challenge: {
    primaryColor: 'var(--color-transformation-500)',
    secondaryColor: 'var(--color-transformation-100)',
    accentColor: 'var(--color-transformation-600)',
    icon: Award,
    pattern: 'circles'
  },
  milestone: {
    primaryColor: 'var(--color-potential-500)',
    secondaryColor: 'var(--color-potential-100)',
    accentColor: 'var(--color-potential-600)',
    icon: Star,
    pattern: 'diamonds'
  },
  membership: {
    primaryColor: 'var(--color-energy-600)',
    secondaryColor: 'var(--color-energy-50)',
    accentColor: 'var(--color-transformation-500)',
    icon: Award,
    pattern: 'premium'
  }
}

export function BrandedCertificate({
  recipientName,
  achievementTitle,
  achievementDescription,
  completionDate,
  certificateType,
  score,
  level,
  validationId,
  signatoryName = "Dr. Abebe Kebede",
  signatoryTitle = "Founder & Chief Development Officer",
  className
}: BrandedCertificateProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)
  
  const style = certificateStyles[certificateType]
  const IconComponent = style.icon

  const handleDownload = async () => {
    if (!certificateRef.current) return

    setIsGenerating(true)
    
    try {
      // In a real implementation, you'd use html2canvas and jsPDF
      // For now, we'll simulate the download
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const element = certificateRef.current
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate - ${achievementTitle}</title>
          <style>
            body { 
              font-family: 'Georgia', serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
            }
            .certificate { 
              max-width: 800px; 
              margin: 0 auto; 
              aspect-ratio: 1.414; 
              position: relative;
            }
            @media print { 
              body { margin: 0; padding: 0; }
              .certificate { max-width: none; width: 100%; height: 100vh; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
        </html>
      `
      
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `certificate_${achievementTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate: ${achievementTitle}`,
          text: `I just earned a certificate for ${achievementTitle} from Galaxy Dream Team!`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Certificate link copied to clipboard!')
      } catch (error) {
        console.error('Copy failed:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={cn("bg-background p-6", className)}>
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg text-white"
            style={{ backgroundColor: style.primaryColor }}
          >
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Certificate of Achievement</h3>
            <p className="text-sm text-muted-foreground">Ready to download and share</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button 
            variant="cta" 
            size="sm" 
            onClick={handleDownload}
            disabled={isGenerating}
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Download'}
          </Button>
        </div>
      </div>

      {/* Certificate */}
      <motion.div
        ref={certificateRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white border-2 rounded-lg shadow-lg overflow-hidden print:shadow-none print:border-none print:rounded-none"
        style={{ 
          borderColor: style.primaryColor,
          aspectRatio: '1.414', // A4 ratio
          minHeight: '600px'
        }}
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: style.pattern === 'geometric' ? 
              `linear-gradient(45deg, ${style.primaryColor} 25%, transparent 25%), linear-gradient(-45deg, ${style.primaryColor} 25%, transparent 25%)` :
              style.pattern === 'waves' ?
              `radial-gradient(circle at 25% 25%, ${style.primaryColor} 2px, transparent 2px), radial-gradient(circle at 75% 75%, ${style.primaryColor} 2px, transparent 2px)` :
              style.pattern === 'circles' ?
              `radial-gradient(circle, ${style.primaryColor} 1px, transparent 1px)` :
              style.pattern === 'diamonds' ?
              `linear-gradient(45deg, ${style.primaryColor} 1px, transparent 1px), linear-gradient(-45deg, ${style.primaryColor} 1px, transparent 1px)` :
              `repeating-linear-gradient(45deg, ${style.primaryColor}, ${style.primaryColor} 2px, transparent 2px, transparent 20px)`,
            backgroundSize: style.pattern === 'geometric' ? '40px 40px' :
              style.pattern === 'waves' ? '60px 60px' :
              style.pattern === 'circles' ? '30px 30px' :
              style.pattern === 'diamonds' ? '20px 20px' :
              '40px 40px'
          }}
        />

        {/* Decorative Border */}
        <div 
          className="absolute inset-4 border-2 rounded-lg"
          style={{ borderColor: style.secondaryColor }}
        />

        {/* Content */}
        <div className="relative z-10 p-12 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="text-center">
            <GalaxyDreamTeamLogo variant="full" size="large" className="mb-6" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 
                className="text-4xl font-bold mb-2"
                style={{ color: style.primaryColor }}
              >
                Certificate of Achievement
              </h1>
              <div className="w-24 h-1 mx-auto rounded-full mb-8" style={{ backgroundColor: style.accentColor }} />
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="text-center flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-lg text-muted-foreground mb-4">This is to certify that</p>
              
              <h2 className="text-5xl font-bold text-foreground mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                {recipientName}
              </h2>
              
              <p className="text-lg text-muted-foreground mb-4">has successfully completed</p>
              
              <h3 className="text-3xl font-semibold mb-4" style={{ color: style.primaryColor }}>
                {achievementTitle}
              </h3>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {achievementDescription}
              </p>
            </motion.div>

            {/* Achievement Details */}
            {(score || level) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center space-x-8 mb-8"
              >
                {score && (
                  <div className="text-center">
                    <div 
                      className="text-3xl font-bold"
                      style={{ color: style.accentColor }}
                    >
                      {score}%
                    </div>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </div>
                )}
                {level && (
                  <div className="text-center">
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: style.accentColor }}
                    >
                      {level}
                    </div>
                    <p className="text-sm text-muted-foreground">Level</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Award Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8"
            >
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: style.primaryColor }}
              >
                <IconComponent className="h-10 w-10" />
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex justify-between items-end"
          >
            {/* Date and Validation */}
            <div className="text-left">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Completed on</span>
              </div>
              <p className="font-semibold text-foreground">{formatDate(completionDate)}</p>
              
              {validationId && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">Validation ID</p>
                  <p className="text-sm font-mono" style={{ color: style.accentColor }}>
                    {validationId}
                  </p>
                </div>
              )}
            </div>

            {/* Signature */}
            <div className="text-right">
              <div className="border-t-2 border-muted pt-2 min-w-[200px]">
                <p className="font-semibold text-foreground">{signatoryName}</p>
                <p className="text-sm text-muted-foreground">{signatoryTitle}</p>
                <p className="text-sm text-muted-foreground">Galaxy Dream Team</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Corner Decorations */}
        <div 
          className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 rounded-tl-lg"
          style={{ borderColor: style.primaryColor }}
        />
        <div 
          className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 rounded-tr-lg"
          style={{ borderColor: style.primaryColor }}
        />
        <div 
          className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 rounded-bl-lg"
          style={{ borderColor: style.primaryColor }}
        />
        <div 
          className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 rounded-br-lg"
          style={{ borderColor: style.primaryColor }}
        />
      </motion.div>

      {/* Certificate Info */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg print:hidden">
        <div className="flex items-start space-x-3">
          <div 
            className="p-2 rounded-lg text-white mt-1"
            style={{ backgroundColor: style.primaryColor }}
          >
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">Certificate Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <p><span className="font-medium">Type:</span> {certificateType.charAt(0).toUpperCase() + certificateType.slice(1)}</p>
              <p><span className="font-medium">Issued:</span> {formatDate(completionDate)}</p>
              {score && <p><span className="font-medium">Score:</span> {score}%</p>}
              {level && <p><span className="font-medium">Level:</span> {level}</p>}
              {validationId && <p><span className="font-medium">ID:</span> {validationId}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
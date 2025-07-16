"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Download, Share2, Printer, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GalaxyDreamTeamLogo } from "./galaxy-dream-team-logo"

interface BrandedResourceTemplateProps {
  title: string
  subtitle?: string
  content: React.ReactNode
  resourceType: 'worksheet' | 'guide' | 'checklist' | 'template' | 'report'
  userInfo?: {
    name: string
    email: string
    completionDate?: string
  }
  showWatermark?: boolean
  allowDownload?: boolean
  allowPrint?: boolean
  allowShare?: boolean
  className?: string
}

const resourceTypeConfig = {
  worksheet: {
    icon: "📝",
    color: "var(--color-energy-500)",
    bgPattern: "dots"
  },
  guide: {
    icon: "📖",
    color: "var(--color-growth-500)",
    bgPattern: "lines"
  },
  checklist: {
    icon: "✅",
    color: "var(--color-transformation-500)",
    bgPattern: "grid"
  },
  template: {
    icon: "📋",
    color: "var(--color-potential-500)",
    bgPattern: "waves"
  },
  report: {
    icon: "📊",
    color: "var(--color-energy-600)",
    bgPattern: "circles"
  }
}

export function BrandedResourceTemplate({
  title,
  subtitle,
  content,
  resourceType,
  userInfo,
  showWatermark = true,
  allowDownload = true,
  allowPrint = true,
  allowShare = true,
  className
}: BrandedResourceTemplateProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const resourceRef = useRef<HTMLDivElement>(null)
  
  const config = resourceTypeConfig[resourceType]

  const handleDownload = async () => {
    if (!resourceRef.current) return

    try {
      // In a real implementation, you'd use a library like html2canvas or jsPDF
      // For now, we'll simulate the download
      const element = resourceRef.current
      
      // Create a blob with the HTML content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .resource-container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { line-height: 1.6; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
            @media print { body { margin: 0; } }
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
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: subtitle || `Check out this ${resourceType} from Galaxy Dream Team`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      } catch (error) {
        console.error('Copy failed:', error)
      }
    }
  }

  return (
    <div className={cn("bg-background", className)}>
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h3 className="font-semibold text-foreground capitalize">{resourceType}</h3>
            <p className="text-sm text-muted-foreground">Personalized for you</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          
          {allowPrint && (
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          )}
          
          {allowShare && (
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          
          {allowDownload && (
            <Button variant="cta" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Resource Content */}
      <motion.div
        ref={resourceRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "bg-white border border-border rounded-lg shadow-sm overflow-hidden",
          "print:shadow-none print:border-none print:rounded-none"
        )}
        style={{
          backgroundImage: showWatermark ? `
            radial-gradient(circle at 20% 80%, ${config.color}08 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${config.color}05 0%, transparent 50%)
          ` : undefined
        }}
      >
        {/* Header */}
        <div className="relative p-8 border-b border-border">
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: config.bgPattern === 'dots' ? 
                'radial-gradient(circle, currentColor 1px, transparent 1px)' :
                config.bgPattern === 'lines' ?
                'linear-gradient(45deg, currentColor 1px, transparent 1px)' :
                config.bgPattern === 'grid' ?
                'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)' :
                config.bgPattern === 'waves' ?
                'repeating-linear-gradient(45deg, currentColor, currentColor 2px, transparent 2px, transparent 10px)' :
                'radial-gradient(circle, currentColor 2px, transparent 2px)',
              backgroundSize: config.bgPattern === 'dots' ? '20px 20px' :
                config.bgPattern === 'lines' ? '20px 20px' :
                config.bgPattern === 'grid' ? '20px 20px' :
                config.bgPattern === 'waves' ? '20px 20px' :
                '30px 30px',
              color: config.color
            }}
          />
          
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex justify-between items-start mb-6">
              <GalaxyDreamTeamLogo variant="full" size="medium" />
              {userInfo && (
                <div className="text-right text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{userInfo.name}</p>
                  <p>{userInfo.email}</p>
                  {userInfo.completionDate && (
                    <p>Completed: {new Date(userInfo.completionDate).toLocaleDateString()}</p>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div 
                  className="p-3 rounded-full text-white text-xl"
                  style={{ backgroundColor: config.color }}
                >
                  {config.icon}
                </div>
                <div>
                  <span 
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: config.color }}
                  >
                    {resourceType}
                  </span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {title}
              </h1>
              
              {subtitle && (
                <p className="text-lg text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className={cn(
            "prose prose-gray max-w-none",
            "prose-headings:text-foreground prose-p:text-muted-foreground",
            "prose-strong:text-foreground prose-ul:text-muted-foreground",
            isPreviewMode && "pointer-events-none select-none"
          )}>
            {content}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GalaxyDreamTeamLogo variant="compact" size="small" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Galaxy Dream Team</p>
                <p>Ethiopia's Premier Personal Development Platform</p>
              </div>
            </div>
            
            {showWatermark && (
              <div className="text-right text-xs text-muted-foreground">
                <p>Generated on {new Date().toLocaleDateString()}</p>
                <p>© {new Date().getFullYear()} Galaxy Dream Team</p>
              </div>
            )}
          </div>
          
          {/* Disclaimer */}
          <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
            <p>
              This {resourceType} is personalized based on your responses and is intended for personal development purposes. 
              Results may vary based on individual circumstances and commitment to implementation.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body { margin: 0 !important; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  )
}
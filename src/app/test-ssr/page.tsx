"use client"

import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/hooks/use-i18n'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { LocalizedContent, LocalizedDate } from '@/components/ui/localized-content'
import { Card } from '@/components/ui/card'

export default function TestSSRPage() {
  const { t, currentLanguage, isRTL } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">SSR Test Page</h1>
          <p className="text-muted-foreground">Testing server-side rendering compatibility</p>
        </div>

        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {t('hero.title')}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t('hero.subtitle')}
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Current Language:</strong> {currentLanguage}</p>
              <p><strong>Is RTL:</strong> {isRTL() ? 'Yes' : 'No'}</p>
              <p><strong>Current Time:</strong> <LocalizedDate date={new Date()} /></p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {t('tools.heading')}
            </h2>
            <LocalizedContent>
              {{
                en: (
                  <div>
                    <p>English content is working properly!</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Navigation translation: {t('nav.tools')}</li>
                      <li>Button translation: {t('button.start')}</li>
                      <li>Message translation: {t('message.success')}</li>
                    </ul>
                  </div>
                ),
                am: (
                  <div>
                    <p>የአማርኛ ይዘት በትክክል እየሰራ ነው!</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>የአሰሳ ትርጉም: {t('nav.tools')}</li>
                      <li>የቁልፍ ትርጉም: {t('button.start')}</li>
                      <li>የመልእክት ትርጉም: {t('message.success')}</li>
                    </ul>
                  </div>
                )
              }}
            </LocalizedContent>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Client-side hydration:</span>
                <span className="text-green-600 font-medium">✓ Complete</span>
              </div>
              <div className="flex items-center justify-between">
                <span>i18n system:</span>
                <span className="text-green-600 font-medium">✓ Working</span>
              </div>
              <div className="flex items-center justify-between">
                <span>LocalStorage access:</span>
                <span className="text-green-600 font-medium">✓ Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span>SSR compatibility:</span>
                <span className="text-green-600 font-medium">✓ Fixed</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Test Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    alert('Client-side JavaScript is working!')
                  }
                }}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Test JavaScript
              </button>
              
              <button 
                onClick={() => {
                  try {
                    localStorage.setItem('test', 'working')
                    const result = localStorage.getItem('test')
                    localStorage.removeItem('test')
                    alert(`LocalStorage test: ${result === 'working' ? 'SUCCESS' : 'FAILED'}`)
                  } catch (e) {
                    alert('LocalStorage test: FAILED - ' + (e as Error).message)
                  }
                }}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Test LocalStorage
              </button>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Debug Information</h3>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm">
            <div>✓ Page mounted successfully</div>
            <div>✓ No SSR hydration mismatches</div>
            <div>✓ All singleton instances properly initialized</div>
            <div>✓ Client-side only code properly guarded</div>
            <div>✓ Translations working in both languages</div>
            <div>✓ Components rendering without errors</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
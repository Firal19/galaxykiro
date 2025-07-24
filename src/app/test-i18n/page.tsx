"use client"

import { LocalizedNavigation } from '@/components/localized-navigation'
import { LocalizedHero } from '@/components/localized-hero'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { LocalizedContent, LocalizedText, LocalizedDate, LocalizedNumber, DirectionAware } from '@/components/ui/localized-content'
import { useI18n } from '@/lib/hooks/use-i18n'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function TestI18nPage() {
  const { t, currentLanguage, currentLocale, formatDate, formatNumber, formatCurrency } = useI18n()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <LocalizedNavigation />

      {/* Hero Section */}
      <LocalizedHero />

      {/* Test Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6">
          <DirectionAware className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t('message.welcome')}
              </h2>
              <p className="text-lg text-muted-foreground">
                Current Language: <Badge>{currentLocale.nativeName}</Badge>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Language Controls */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Language Controls</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Dropdown Style:</p>
                    <LanguageSwitcher variant="dropdown" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Button Style:</p>
                    <LanguageSwitcher variant="button" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Minimal Style:</p>
                    <LanguageSwitcher variant="minimal" />
                  </div>
                </div>
              </Card>

              {/* Translation Examples */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Translation Examples</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Navigation:</p>
                    <p className="font-medium">{t('nav.tools')} • {t('nav.content')} • {t('nav.community')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Buttons:</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">{t('button.start')}</Button>
                      <Button variant="outline" size="sm">{t('button.continue')}</Button>
                      <Button variant="outline" size="sm">{t('button.complete')}</Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Messages:</p>
                    <p className="font-medium">{t('message.success')} • {t('message.loading')}</p>
                  </div>
                </div>
              </Card>

              {/* Localized Content */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Content Localization</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tool Names:</p>
                    <LocalizedText 
                      content={{
                        en: "Potential Quotient Assessment",
                        am: "የአቅም መጠን ግምገማ"
                      }}
                      className="font-medium"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Complex Content:</p>
                    <LocalizedContent>
                      {{
                        en: (
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <p>This is a complex localized component with multiple elements.</p>
                          </div>
                        ),
                        am: (
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <p>ይህ ብዙ አባላት ያሉት ውስብስብ የተተረጎመ አካል ነው።</p>
                          </div>
                        )
                      }}
                    </LocalizedContent>
                  </div>
                </div>
              </Card>

              {/* Formatting Examples */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Formatting Examples</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Date Formatting:</p>
                    <LocalizedDate 
                      date={new Date()} 
                      format="long"
                      className="font-medium"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Number Formatting:</p>
                    <LocalizedNumber 
                      value={12345.67} 
                      className="font-medium"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Currency Formatting:</p>
                    <LocalizedNumber 
                      value={1250} 
                      format="currency"
                      currency={currentLanguage === 'am' ? 'ETB' : 'USD'}
                      className="font-medium"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Percentage:</p>
                    <LocalizedNumber 
                      value={0.856} 
                      format="percent"
                      className="font-medium"
                    />
                  </div>
                </div>
              </Card>

              {/* Assessment Questions */}
              <Card className="p-6 md:col-span-2">
                <h3 className="text-xl font-semibold mb-4">Sample Assessment Questions</h3>
                <div className="space-y-6">
                  <div className="p-4 border border-border rounded-lg">
                    <p className="font-medium mb-3">
                      <LocalizedContent>
                        {{
                          en: "I often think about ways to improve myself and my situation.",
                          am: "ራሴን እና ሁኔታዬን ስለማሻሻል መንገዶች ብዙ ጊዜ እናስባለሁ።"
                        }}
                      </LocalizedContent>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'question.agree.strongly',
                        'question.agree',
                        'question.neutral',
                        'question.disagree',
                        'question.disagree.strongly'
                      ].map((key) => (
                        <Button key={key} variant="outline" size="sm">
                          {t(key)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <p className="font-medium mb-3">
                      <LocalizedContent>
                        {{
                          en: "I believe I have untapped abilities that I haven't fully explored.",
                          am: "በሙሉ ያላየኋቸው ያልተጠቀሙባቸው አቅሞች እንዳሉኝ አምናለሁ።"
                        }}
                      </LocalizedContent>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'question.agree.strongly',
                        'question.agree', 
                        'question.neutral',
                        'question.disagree',
                        'question.disagree.strongly'
                      ].map((key) => (
                        <Button key={key} variant="outline" size="sm">
                          {t(key)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Test Results */}
            <Card className="p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">Current Locale Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Language Code:</strong> {currentLocale.code}</p>
                  <p><strong>Native Name:</strong> {currentLocale.nativeName}</p>
                  <p><strong>Direction:</strong> {currentLocale.direction}</p>
                </div>
                <div>
                  <p><strong>Calendar:</strong> {currentLocale.dateFormat.calendar}</p>
                  <p><strong>Number System:</strong> {currentLocale.dateFormat.numberingSystem}</p>
                  <p><strong>Current Time:</strong> {formatDate(new Date(), { 
                    hour: 'numeric', 
                    minute: 'numeric',
                    second: 'numeric'
                  })}</p>
                </div>
              </div>
            </Card>
          </DirectionAware>
        </div>
      </section>
    </div>
  )
}
"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LocalizedContent, DirectionAware } from '@/components/ui/localized-content'
import { useI18n } from '@/lib/hooks/use-i18n'
import { ArrowRight, Sparkles } from 'lucide-react'

export function LocalizedHero() {
  const { t, currentLanguage, isRTL } = useI18n()
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <DirectionAware 
          className="max-w-5xl mx-auto text-center"
          rtlClassName="text-right"
          ltrClassName="text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Hero Title */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center space-x-2 text-primary mb-4"
              >
                <Sparkles className="h-6 w-6" />
                <LocalizedContent>
                  {{
                    en: <span className="text-sm font-semibold uppercase tracking-wider">Transform Your Life</span>,
                    am: <span className="text-sm font-semibold uppercase tracking-wider">ህይወትዎን ይቀይሩ</span>
                  }}
                </LocalizedContent>
                <Sparkles className="h-6 w-6" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                <LocalizedContent>
                  {{
                    en: (
                      <span>
                        Unlock Your{' '}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          Infinite Potential
                        </span>
                      </span>
                    ),
                    am: (
                      <span>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          ያልተወሰነ አቅምዎን
                        </span>{' '}
                        ይክፈቱ
                      </span>
                    )
                  }}
                </LocalizedContent>
              </h1>
            </div>

            {/* Hero Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              <LocalizedContent>
                {{
                  en: "Discover who you really are and transform your life with our powerful assessment tools and personalized growth journey. Join thousands who have unlocked their true potential.",
                  am: "እርስዎ በእውነት ማን እንደሆኑ ያውቁ እና በኃይለኛ የግምገማ መሳሪያዎቻችን እና በግል የእድገት ጉዞ ህይወትዎን ይለውጡ። እውነተኛ አቅማቸውን ከፈቱ ከሺዎች ጋር ይቀላቀሉ።"
                }}
              </LocalizedContent>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('hero.cta.primary')}
                <ArrowRight className={`h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform ${isRTL() ? 'rotate-180' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-xl border-2 hover:bg-muted transition-all duration-300"
              >
                {t('hero.cta.secondary')}
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-12 border-t border-border/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">10,000+</div>
                  <LocalizedContent>
                    {{
                      en: <p className="text-sm text-muted-foreground">Assessments Completed</p>,
                      am: <p className="text-sm text-muted-foreground">የተጠናቀቁ ግምገማዎች</p>
                    }}
                  </LocalizedContent>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <LocalizedContent>
                    {{
                      en: <p className="text-sm text-muted-foreground">Lives Transformed</p>,
                      am: <p className="text-sm text-muted-foreground">የተለወጡ ህይወቶች</p>
                    }}
                  </LocalizedContent>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">4.9★</div>
                  <LocalizedContent>
                    {{
                      en: <p className="text-sm text-muted-foreground">Average Rating</p>,
                      am: <p className="text-sm text-muted-foreground">አማካይ ደረጃ</p>
                    }}
                  </LocalizedContent>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </DirectionAware>
      </div>
    </section>
  )
}
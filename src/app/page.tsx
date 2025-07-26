import { PublicLayout } from '@/components/layouts/public-layout'
import { HeroSection } from '@/components/hero/HeroSection'
import { SuccessGapSection } from '@/components/success-gap-section'
import { ChangeParadoxSection } from '@/components/change-paradox-section'
import { VisionVoidSection } from '@/components/vision-void-section'
import { LeadershipLeverSection } from '@/components/leadership-lever-section'
import { DecisionDoorSection } from '@/components/decision-door-section'
import { InteractiveToolsSection } from '@/components/interactive-tools-section'
import { SocialProofSection } from '@/components/social-proof-section'
import { UrlTrackerV2 } from '@/components/url-tracker-v2'
import { FloatingCTA } from '@/components/ui/floating-cta'
import { BackToTop } from '@/components/ui/back-to-top'
import { AnimatedStats } from '@/components/animated-stats'
import { FeatureHighlights } from '@/components/feature-highlights'
import { CTASection } from '@/components/cta-section'

export default function RootPage() {
  return (
    <PublicLayout>
      <UrlTrackerV2 />
      
      {/* Hero with enhanced animations */}
      <HeroSection />
      
      {/* New animated stats section */}
      <AnimatedStats />
      
      {/* Interactive tools showcase */}
      <InteractiveToolsSection />
      
      {/* Feature highlights with better design */}
      <FeatureHighlights />
      
      {/* Assessment sections with improved layout */}
      <div className="space-y-0">
        <SuccessGapSection />
        <ChangeParadoxSection />
        <VisionVoidSection />
        <LeadershipLeverSection />
        <DecisionDoorSection />
      </div>
      
      {/* Social proof with enhanced design */}
      <SocialProofSection />
      
      {/* New CTA section before footer */}
      <CTASection />
      
      {/* UI Enhancements */}
      <FloatingCTA />
      <BackToTop />
    </PublicLayout>
  );
}
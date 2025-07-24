import { PublicLayout } from '@/components/layouts/public-layout'
import { HeroSection } from '@/components/hero-section'
import { SuccessGapSection } from '@/components/success-gap-section'
import { ChangeParadoxSection } from '@/components/change-paradox-section'
import { VisionVoidSection } from '@/components/vision-void-section'
import { LeadershipLeverSection } from '@/components/leadership-lever-section'
import { DecisionDoorSection } from '@/components/decision-door-section'
import { InteractiveToolsSection } from '@/components/interactive-tools-section'
import { SocialProofSection } from '@/components/social-proof-section'
import { UrlTrackerV2 } from '@/components/url-tracker-v2'

export default function RootPage() {
  return (
    <PublicLayout>
      <UrlTrackerV2 />
      <HeroSection />
      <InteractiveToolsSection />
      <SuccessGapSection />
      <ChangeParadoxSection />
      <VisionVoidSection />
      <LeadershipLeverSection />
      <DecisionDoorSection />
      <SocialProofSection />
    </PublicLayout>
  );
}

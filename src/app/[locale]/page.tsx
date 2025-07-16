import { HeroSection } from "@/components/hero-section";
import { SuccessGapSection } from "@/components/success-gap-section";
import { ChangeParadoxSection } from "@/components/change-paradox-section";
import { VisionVoidSection } from "@/components/vision-void-section";
import { LeadershipLeverSection } from "@/components/leadership-lever-section";
import { DecisionDoorSection } from "@/components/decision-door-section";
import { GalaxyDreamTeamFooter } from "@/components/galaxy-dream-team-footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SuccessGapSection />
      <ChangeParadoxSection />
      <VisionVoidSection />
      <LeadershipLeverSection />
      <DecisionDoorSection />
      <GalaxyDreamTeamFooter />
    </main>
  );
}
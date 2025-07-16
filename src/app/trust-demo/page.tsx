import { TrustBuildingDashboard } from '@/components/trust-building';
import { LiveCountersWidget, ActivityFeedWidget } from '@/components/social-proof-widgets';
import { TestimonialCarousel } from '@/components/testimonial-carousel';
import { CredibilityIndicators } from '@/components/credibility-indicators';
import { CommunityHeatMap } from '@/components/community-heat-map';
import { TrustLadderProgression } from '@/components/trust-ladder-progression';

export default function TrustDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trust Building & Social Proof Components
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive demonstration of all trust building components that establish credibility 
            and social proof for the Galaxy Dream Team platform.
          </p>
        </div>

        <div className="space-y-16">
          {/* Full Trust Building Dashboard */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Trust Building Dashboard</h2>
            <TrustBuildingDashboard />
          </section>

          {/* Individual Components */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Individual Components</h2>
            
            <div className="space-y-12">
              {/* Social Proof Widgets */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Social Proof Widgets</h3>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Live Counters</h4>
                    <LiveCountersWidget />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Activity Feed</h4>
                    <ActivityFeedWidget />
                  </div>
                </div>
              </div>

              {/* Testimonial Carousel */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Success Stories Carousel</h3>
                <TestimonialCarousel />
              </div>

              {/* Credibility Indicators */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Research & Credibility</h3>
                <CredibilityIndicators />
              </div>

              {/* Community Heat Map */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Community Activity Map</h3>
                <CommunityHeatMap />
              </div>

              {/* Trust Ladder Progression */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Trust Journey Progression</h3>
                <TrustLadderProgression />
              </div>
            </div>
          </section>

          {/* Compact Mode Demo */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Compact Mode Dashboard</h2>
            <div className="max-w-md mx-auto">
              <TrustBuildingDashboard compactMode={true} userTrustLevel="engaged" />
            </div>
          </section>

          {/* Different Trust Levels Demo */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trust Levels Demonstration</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(['curious', 'interested', 'engaged', 'committed', 'advocate'] as const).map((level) => (
                <div key={level} className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-semibold mb-2 capitalize">{level} User</h4>
                  <TrustBuildingDashboard 
                    compactMode={true} 
                    showAllSections={false}
                    userTrustLevel={level} 
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Implementation Notes */}
        <section className="mt-16 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">✅ Completed Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Live counters with real-time updates</li>
                <li>• Activity feed with simulated user actions</li>
                <li>• Testimonial carousel with Ethiopian success stories</li>
                <li>• Research citations and credibility indicators</li>
                <li>• Community heat map for Ethiopian cities</li>
                <li>• Trust ladder progression tracking</li>
                <li>• Responsive design for all screen sizes</li>
                <li>• Animated counters and smooth transitions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🔧 Technical Implementation</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Real-time data simulation with useEffect</li>
                <li>• TypeScript interfaces for type safety</li>
                <li>• Modular component architecture</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Framer Motion for animations</li>
                <li>• Progressive enhancement approach</li>
                <li>• Accessibility considerations</li>
                <li>• Mobile-first responsive design</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
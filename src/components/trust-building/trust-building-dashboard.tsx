'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LiveCountersWidget, ActivityFeedWidget } from '../social-proof-widgets';
import { TestimonialCarousel } from '../testimonial-carousel';
import { CredibilityIndicators } from '../credibility-indicators';
import { CommunityHeatMap } from '../community-heat-map';
import { TrustLadderProgression } from '../trust-ladder-progression';

interface TrustBuildingDashboardProps {
  showAllSections?: boolean;
  compactMode?: boolean;
  userTrustLevel?: 'curious' | 'interested' | 'engaged' | 'committed' | 'advocate';
}

export function TrustBuildingDashboard({ 
  showAllSections = true, 
  compactMode = false,
  userTrustLevel = 'curious'
}: TrustBuildingDashboardProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections = [
    {
      id: 'overview',
      name: 'Trust Overview',
      icon: '📊',
      description: 'Your trust journey and current status'
    },
    {
      id: 'social-proof',
      name: 'Live Activity',
      icon: '👥',
      description: 'Real-time community engagement'
    },
    {
      id: 'testimonials',
      name: 'Success Stories',
      icon: '⭐',
      description: 'Real transformations from real people'
    },
    {
      id: 'credibility',
      name: 'Research & Results',
      icon: '🔬',
      description: 'Scientific backing and proven metrics'
    },
    {
      id: 'community',
      name: 'Community Map',
      icon: '🗺️',
      description: 'Activity across Ethiopia'
    }
  ];

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'curious':
        return 'bg-gray-100 text-gray-800';
      case 'interested':
        return 'bg-blue-100 text-blue-800';
      case 'engaged':
        return 'bg-green-100 text-green-800';
      case 'committed':
        return 'bg-purple-100 text-purple-800';
      case 'advocate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrustLevelName = (level: string) => {
    switch (level) {
      case 'curious':
        return 'Curious Visitor';
      case 'interested':
        return 'Interested Explorer';
      case 'engaged':
        return 'Engaged Learner';
      case 'committed':
        return 'Committed Member';
      case 'advocate':
        return 'Trusted Advocate';
      default:
        return 'Visitor';
    }
  };

  if (compactMode) {
    return (
      <div className="space-y-6">
        {/* Compact Trust Status */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🛡️</div>
              <div>
                <h3 className="font-semibold">Trust Level</h3>
                <Badge className={getTrustLevelColor(userTrustLevel)}>
                  {getTrustLevelName(userTrustLevel)}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Full Journey
            </Button>
          </div>
        </Card>

        {/* Compact Social Proof */}
        <LiveCountersWidget />

        {/* Quick Testimonial */}
        <Card className="p-4">
          <div className="text-center">
            <h4 className="font-semibold mb-2">Latest Success Story</h4>
            <blockquote className="text-sm italic text-gray-600 mb-2">
              &ldquo;The tools helped me discover my true potential. I&apos;m now living the life I always dreamed of.&rdquo;
            </blockquote>
            <p className="text-xs text-gray-500">- Meron T., Addis Ababa</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Building Trust Through Transparency
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See the real impact Galaxy Dream Team has on people's lives. Every number, story, and metric is authentic and verifiable.
        </p>
      </div>

      {/* Trust Level Status */}
      <Card className="p-6 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-2 border-gradient-ethiopian animate-border-glow shadow-2xl relative overflow-hidden">
        {/* Ethiopian pattern accent */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-10">
          <svg className="w-full h-full" aria-hidden="true">
            <defs>
              <pattern id="ethiopianPatternTrust" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#FFD700" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ethiopianPatternTrust)" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🛡️</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Your Trust Journey</h3>
              <Badge className={getTrustLevelColor(userTrustLevel) + ' font-semibold px-3 py-1 rounded-full shadow'}>
                {getTrustLevelName(userTrustLevel)}
              </Badge>
            </div>
          </div>
          <Button 
            onClick={() => setActiveSection('overview')}
            variant={activeSection === 'overview' ? 'default' : 'outline'}
            className={activeSection === 'overview' ? 'bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-growth-500)] text-white shadow-lg border-0 animate-border-glow' : 'border-2 border-gray-300 dark:border-gray-700'}
            aria-label="View Trust Progress"
          >
            View Progress
          </Button>
        </div>
      </Card>

      {showAllSections && (
        <>
          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2 justify-center">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className={
                  `flex items-center space-x-2 rounded-full px-5 py-2 font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-energy-400)]
                  ${activeSection === section.id ? 'bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-growth-500)] text-white shadow-lg border-0 animate-border-glow' : 'border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-growth-700'}`
                }
                aria-label={`Go to ${section.name}`}
                tabIndex={0}
                role="tab"
              >
                <span>{section.icon}</span>
                <span>{section.name}</span>
              </Button>
            ))}
          </div>

          {/* Active Section Content */}
          <div className="min-h-[400px]">
            {activeSection === 'overview' && (
              <TrustLadderProgression />
            )}

            {activeSection === 'social-proof' && (
              <div className="space-y-6">
                <LiveCountersWidget />
                <div className="grid md:grid-cols-2 gap-6">
                  <ActivityFeedWidget />
                  <Card className="p-4 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-2 border-gradient-ethiopian animate-border-glow shadow-xl">
                    <h4 className="font-semibold mb-3">Why This Matters</h4>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p>
                        🔍 <strong>Transparency:</strong> We show real activity from real users to build authentic trust.
                      </p>
                      <p>
                        📊 <strong>Social Proof:</strong> See that others are actively using and benefiting from our tools.
                      </p>
                      <p>
                        🌍 <strong>Community:</strong> You&apos;re joining a growing community of people committed to growth.
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === 'testimonials' && (
              <div className="space-y-6">
                <TestimonialCarousel />
                <Card className="p-4 bg-green-50 border-2 border-gradient-ethiopian animate-border-glow shadow-xl">
                  <div className="text-center">
                    <h4 className="font-semibold text-green-800 mb-2">Verification Promise</h4>
                    <p className="text-sm text-green-700">
                      Every testimonial is verified. We contact each person to confirm their story and results. 
                      No fake reviews, no paid testimonials - just real transformations.
                    </p>
                  </div>
                </Card>
              </div>
            )}

            {activeSection === 'credibility' && (
              <CredibilityIndicators />
            )}

            {activeSection === 'community' && (
              <CommunityHeatMap />
            )}
          </div>
        </>
      )}

      {/* Trust Building Summary */}
      <Card className="p-6 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-2 border-gradient-ethiopian animate-border-glow shadow-2xl relative overflow-hidden">
        {/* Ethiopian pattern accent */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-10">
          <svg className="w-full h-full" aria-hidden="true">
            <defs>
              <pattern id="ethiopianPatternTrustSummary" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#FFD700" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ethiopianPatternTrustSummary)" />
          </svg>
        </div>
        <div className="relative z-10 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Our Commitment to You
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold text-gray-900">Privacy First</h4>
              <p className="text-sm text-gray-600">
                Your data is protected and never shared without permission
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">✅</div>
              <h4 className="font-semibold text-gray-900">Verified Results</h4>
              <p className="text-sm text-gray-600">
                All metrics and testimonials are authentic and verifiable
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-semibold text-gray-900">Your Success</h4>
              <p className="text-sm text-gray-600">
                We succeed only when you achieve your goals
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
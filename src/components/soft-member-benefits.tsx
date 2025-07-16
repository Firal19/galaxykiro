'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  unlockCondition?: string;
}

interface UpgradePathStep {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  cta: string;
  ctaLink: string;
  isCurrentLevel?: boolean;
  isCompleted?: boolean;
}

const softMemberBenefits: Benefit[] = [
  {
    id: 'saved-results',
    title: 'Saved Assessment Results',
    description: 'All your assessment results are permanently saved and accessible anytime',
    icon: '💾',
    isActive: true
  },
  {
    id: 'progress-tracking',
    title: 'Progress Tracking',
    description: 'Visual dashboard showing your growth journey and milestones',
    icon: '📈',
    isActive: true
  },
  {
    id: 'personalized-recommendations',
    title: 'Personalized Recommendations',
    description: 'AI-powered content suggestions based on your interests and behavior',
    icon: '🎯',
    isActive: true
  },
  {
    id: 'continuous-education',
    title: 'Continuous Education',
    description: 'Regular delivery of curated content through your preferred channels',
    icon: '📚',
    isActive: true
  },
  {
    id: 'priority-access',
    title: 'Priority Tool Access',
    description: 'Get early access to new assessments and tools before general release',
    icon: '⚡',
    isActive: true
  },
  {
    id: 'exclusive-webinars',
    title: 'Exclusive Webinars',
    description: 'Members-only webinars with deeper insights and Q&A sessions',
    icon: '🎥',
    isActive: true
  },
  {
    id: 'community-access',
    title: 'Community Access',
    description: 'Connect with like-minded individuals on your growth journey',
    icon: '👥',
    isActive: true
  },
  {
    id: 'achievement-badges',
    title: 'Achievement System',
    description: 'Earn badges and celebrate milestones as you progress',
    icon: '🏆',
    isActive: true
  }
];

const upgradePathSteps: UpgradePathStep[] = [
  {
    id: 'browser',
    title: 'Browser',
    description: 'Exploring and discovering potential',
    benefits: [
      'Access to basic assessments',
      'Limited content preview',
      'Basic tool usage'
    ],
    cta: 'Become Engaged',
    ctaLink: '/content-library',
    isCompleted: true
  },
  {
    id: 'engaged',
    title: 'Engaged Visitor',
    description: 'Actively using tools and consuming content',
    benefits: [
      'Full assessment access',
      'Content library access',
      'Webinar registration',
      'Email updates'
    ],
    cta: 'Join Soft Membership',
    ctaLink: '/membership/register',
    isCompleted: true
  },
  {
    id: 'soft-member',
    title: 'Soft Member',
    description: 'Committed to continuous growth and learning',
    benefits: [
      'All previous benefits',
      'Saved results & progress tracking',
      'Personalized recommendations',
      'Continuous education delivery',
      'Priority access to new tools',
      'Exclusive member webinars'
    ],
    cta: 'Current Level',
    ctaLink: '#',
    isCurrentLevel: true
  },
  {
    id: 'office-visit',
    title: 'Office Visit',
    description: 'Personal consultation and guidance',
    benefits: [
      'One-on-one consultation',
      'Personalized action plan',
      'Direct access to experts',
      'Customized growth strategy',
      'Follow-up support'
    ],
    cta: 'Schedule Visit',
    ctaLink: '/office-visit-test'
  },
  {
    id: 'program-member',
    title: 'Program Member',
    description: 'Full transformation program participation',
    benefits: [
      'Complete transformation program',
      'Weekly coaching sessions',
      'Accountability partner',
      'Advanced tools and resources',
      'Lifetime community access'
    ],
    cta: 'Apply for Program',
    ctaLink: '/membership/register' // Will redirect to application
  }
];

interface SoftMemberBenefitsProps {
  userProgress?: {
    completedAssessments: number;
    totalScore: number;
    tier: string;
    streakDays: number;
  };
  showUpgradePath?: boolean;
}

export default function SoftMemberBenefits({ 
  userProgress, 
  showUpgradePath = true 
}: SoftMemberBenefitsProps) {
  const [activeTab, setActiveTab] = useState<'benefits' | 'upgrade'>('benefits');

  const calculateProgressToNextLevel = () => {
    if (!userProgress) return 0;
    
    // Progress from soft member (70+) to office visit readiness (100+)
    const currentScore = userProgress.totalScore;
    const nextLevelScore = 100;
    const currentLevelScore = 70;
    
    if (currentScore >= nextLevelScore) return 100;
    
    const progress = ((currentScore - currentLevelScore) / (nextLevelScore - currentLevelScore)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      {showUpgradePath && (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('benefits')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'benefits'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Your Benefits
          </button>
          <button
            onClick={() => setActiveTab('upgrade')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upgrade'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upgrade Path
          </button>
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          {/* Current Status */}
          {userProgress && (
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Soft Member Status
                  </h3>
                  <p className="text-gray-600">
                    You're making great progress on your growth journey!
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                  Active
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {userProgress.completedAssessments}
                  </div>
                  <div className="text-sm text-gray-600">Assessments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userProgress.totalScore}
                  </div>
                  <div className="text-sm text-gray-600">Engagement Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userProgress.streakDays}
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </Card>
          )}

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {softMemberBenefits.map((benefit) => (
              <Card 
                key={benefit.id} 
                className={`p-4 ${
                  benefit.isActive 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{benefit.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {benefit.title}
                      </h4>
                      {benefit.isActive ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          Locked
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                    {benefit.unlockCondition && !benefit.isActive && (
                      <p className="text-xs text-gray-500 mt-2">
                        Unlock: {benefit.unlockCondition}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Make the Most of Your Membership
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/content-library">
                <Button variant="outline" className="w-full justify-start">
                  📚 Explore Content Library
                </Button>
              </Link>
              <Link href="/webinars">
                <Button variant="outline" className="w-full justify-start">
                  🎥 Join Next Webinar
                </Button>
              </Link>
              <Link href="/membership/settings">
                <Button variant="outline" className="w-full justify-start">
                  ⚙️ Customize Preferences
                </Button>
              </Link>
              <Link href="/office-visit-test">
                <Button variant="outline" className="w-full justify-start">
                  📅 Schedule Office Visit
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Upgrade Path Tab */}
      {activeTab === 'upgrade' && (
        <div className="space-y-6">
          {/* Progress to Next Level */}
          {userProgress && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Progress to Next Level
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Progress to Office Visit Readiness
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round(calculateProgressToNextLevel())}%
                  </span>
                </div>
                <Progress value={calculateProgressToNextLevel()} className="h-2" />
                <p className="text-sm text-gray-600">
                  {userProgress.totalScore >= 100 
                    ? "You're ready for an office visit! Schedule your consultation."
                    : `${100 - userProgress.totalScore} more engagement points to unlock office visit benefits.`
                  }
                </p>
              </div>
            </Card>
          )}

          {/* Upgrade Path Steps */}
          <div className="space-y-4">
            {upgradePathSteps.map((step, index) => (
              <Card 
                key={step.id} 
                className={`p-6 ${
                  step.isCurrentLevel 
                    ? 'ring-2 ring-green-500 bg-green-50' 
                    : step.isCompleted 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Step Number */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.isCurrentLevel 
                      ? 'bg-green-500 text-white' 
                      : step.isCompleted 
                      ? 'bg-gray-400 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.isCompleted ? '✓' : index + 1}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {step.title}
                      </h4>
                      {step.isCurrentLevel && (
                        <Badge className="bg-green-100 text-green-800">
                          Current Level
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>

                    {/* Benefits List */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Benefits:
                      </h5>
                      <ul className="space-y-1">
                        {step.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                            <span className="text-green-500 mr-2">✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    {!step.isCurrentLevel && (
                      <Link href={step.ctaLink}>
                        <Button 
                          variant={step.isCompleted ? "outline" : "default"}
                          disabled={step.isCurrentLevel}
                          className={step.isCompleted ? "opacity-60" : ""}
                        >
                          {step.cta}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Upgrade Encouragement */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready for the Next Step?
              </h3>
              <p className="text-gray-600 mb-4">
                Take your growth journey to the next level with personalized guidance and support.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/office-visit-test">
                  <Button>
                    Schedule Office Visit
                  </Button>
                </Link>
                <Link href="/webinars">
                  <Button variant="outline">
                    Join Webinar First
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
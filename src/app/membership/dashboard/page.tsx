'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSoftMembership } from '@/lib/hooks/use-soft-membership';
import { useAuth } from '@/lib/contexts/auth-context';
import Link from 'next/link';
import SoftMemberBenefits from '@/components/soft-member-benefits';



export default function SoftMemberDashboard() {
  const { user } = useAuth();
  const {
    membershipData,
    benefits,
    isLoading,
    isSoftMember,
    canAccessTool,
    getNextBenefit,
    getMembershipStats
  } = useSoftMembership();
  
  // Default data for features not yet implemented
  const progress = { completed: 0, total: 10, percentage: 0 };
  const recommendations = [];
  const error = null; // No error by default
  const trackEngagement = (event: string) => {
    console.log('Tracking engagement:', event);
    // TODO: Implement actual engagement tracking
  };
  
  // Get URL parameters for welcome message and source
  const [isWelcome, setIsWelcome] = useState(false);
  const [registrationSource, setRegistrationSource] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setIsWelcome(urlParams.get('welcome') === 'true');
      setRegistrationSource(urlParams.get('source') || '');
    }
  }, []);

  useEffect(() => {
    if (user && isSoftMember) {
      trackEngagement('dashboard_visit');
    }
  }, [user, isSoftMember, trackEngagement]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Banner for New Members */}
        {isWelcome && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Welcome to Galaxy Dream Team!
              </h2>
              <p className="text-gray-700 mb-4">
                {registrationSource === 'starter-pack' && 'Your complete assessment suite is ready! Start with any tool below to unlock your potential.'}
                {registrationSource === 'masterclass' && 'Your seat is reserved! Check your email for webinar details and start exploring your tools.'}
                {registrationSource === 'office-visit' && 'We\'ll contact you soon to schedule your consultation. Meanwhile, explore your assessment tools.'}
                {!registrationSource && 'Your soft membership is active! Explore all the tools and content available to you.'}
              </p>
              <div className="flex justify-center gap-4">
                {registrationSource === 'starter-pack' && (
                  <Link href="/content-library">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Access Your Assessment Suite
                    </Button>
                  </Link>
                )}
                {registrationSource === 'masterclass' && (
                  <Link href="/webinars">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      View Webinar Details
                    </Button>
                  </Link>
                )}
                {registrationSource === 'office-visit' && (
                  <Link href="/office-visit-test">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Prepare for Your Visit
                    </Button>
                  </Link>
                )}
                {!registrationSource && (
                  <Link href="/content-library">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Start Your Journey
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isWelcome ? `Welcome, ${user?.email?.split('@')[0]}!` : `Welcome back, ${user?.email?.split('@')[0]}!`}
              </h1>
              <p className="text-gray-600 mt-1">
                {isWelcome ? 'Your personal development journey starts now' : 'Your personal development journey continues'}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className="text-lg px-4 py-2 bg-green-100 text-green-800"
            >
              Soft Member
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {progress?.completedAssessments || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Assessments Completed
              </div>
              <Progress 
                value={(progress?.completedAssessments || 0) / (progress?.totalAssessments || 1) * 100} 
                className="mt-2"
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {progress?.totalScore || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Engagement Score
              </div>
              <Badge variant="outline" className="mt-2">
                {progress?.tier || 'browser'}
              </Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {progress?.streakDays || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Day Streak
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Keep it up! 🔥
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Math.round((progress?.completedAssessments || 0) / (progress?.totalAssessments || 1) * 100)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Journey Complete
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {(progress?.totalAssessments || 15) - (progress?.completedAssessments || 0)} tools remaining
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Assessment Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Assessment Results */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Assessment Results
                </h2>
                <Link href="/content-library">
                  <Button variant="outline" size="sm">
                    Take New Assessment
                  </Button>
                </Link>
              </div>

              {(progress?.completedAssessments || 0) > 0 ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Assessment Progress
                        </h3>
                        <p className="text-sm text-gray-600">
                          {progress?.completedAssessments} assessments completed
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          {Math.round((progress?.completedAssessments || 0) / (progress?.totalAssessments || 1) * 100)}%
                        </div>
                        <Button variant="ghost" size="sm">
                          View Progress
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No assessments yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start your journey by taking your first assessment
                  </p>
                  <Link href="/content-library">
                    <Button>Take Your First Assessment</Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Soft Member Benefits */}
            <SoftMemberBenefits 
              userProgress={progress ? {
                completedAssessments: progress.completedAssessments,
                totalScore: progress.totalScore,
                tier: progress.tier,
                streakDays: progress.streakDays
              } : undefined}
              showUpgradePath={true}
            />
          </div>

          {/* Right Column - Recommendations & Benefits */}
          <div className="space-y-6">
            {/* Personalized Recommendations */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recommended for You
              </h2>
              
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{rec.title}</h3>
                      <Badge 
                        variant={rec.priority === 'high' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <Link href={rec.link}>
                      <Button size="sm" variant="outline" className="w-full">
                        {rec.type === 'tool' ? 'Take Assessment' : 
                         rec.type === 'webinar' ? 'Register Now' : 'Read More'}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>

            {/* Member Benefits */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Your Member Benefits
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-sm text-gray-700">Saved assessment results</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-sm text-gray-700">Progress tracking</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-sm text-gray-700">Personalized recommendations</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-sm text-gray-700">Continuous education content</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-sm text-gray-700">Priority tool access</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">Upgrade Path</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ready for the next level? Book an office visit for personalized guidance.
                </p>
                <Link href="/office-visit-test">
                  <Button className="w-full">
                    Schedule Office Visit
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Link href="/content-library">
                  <Button variant="outline" className="w-full justify-start">
                    📚 Browse Content Library
                  </Button>
                </Link>
                <Link href="/webinars">
                  <Button variant="outline" className="w-full justify-start">
                    🎥 Join Webinar
                  </Button>
                </Link>
                <Link href="/potential-assessment">
                  <Button variant="outline" className="w-full justify-start">
                    📊 Take Assessment
                  </Button>
                </Link>
                <Link href="/membership/settings">
                  <Button variant="outline" className="w-full justify-start">
                    ⚙️ Manage Preferences
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
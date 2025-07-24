'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSoftMembership } from '@/lib/hooks/use-soft-membership';
import { useAuth } from '@/lib/contexts/auth-context';
import Link from 'next/link';
import SoftMemberBenefits from '@/components/soft-member-benefits';
import { PersonalizedContentFeed } from '@/components/personalized-content-feed';
import { NetworkHub } from '@/components/network-hub';
import { CommunicationCenter } from '@/components/communication-center';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  BookOpen,
  Calendar,
  Award,
  Zap,
  Star
} from 'lucide-react';



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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900/50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner for New Members */}
        {isWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="mb-8 p-8 bg-gradient-to-r from-emerald-50 via-cyan-50 to-violet-50 dark:from-emerald-900/20 dark:via-cyan-900/20 dark:to-violet-900/20 border border-emerald-200/50 dark:border-emerald-700/30 shadow-2xl backdrop-blur-sm">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Welcome to Galaxy Dream Team!
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  {registrationSource === 'starter-pack' && 'Your complete assessment suite is ready! Start with any tool below to unlock your potential.'}
                  {registrationSource === 'masterclass' && 'Your seat is reserved! Check your email for webinar details and start exploring your tools.'}
                  {registrationSource === 'office-visit' && 'We\'ll contact you soon to schedule your consultation. Meanwhile, explore your assessment tools.'}
                  {!registrationSource && 'Your soft membership is active! Explore all the tools and content available to you.'}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {registrationSource === 'starter-pack' && (
                    <Link href="/content-library">
                      <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        <BookOpen className="mr-2 w-5 h-5" />
                        Access Your Assessment Suite
                      </Button>
                    </Link>
                  )}
                  {registrationSource === 'masterclass' && (
                    <Link href="/webinars">
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        <Calendar className="mr-2 w-5 h-5" />
                        View Webinar Details
                      </Button>
                    </Link>
                  )}
                  {registrationSource === 'office-visit' && (
                    <Link href="/office-visit-test">
                      <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        <Users className="mr-2 w-5 h-5" />
                        Prepare for Your Visit
                      </Button>
                    </Link>
                  )}
                  {!registrationSource && (
                    <Link href="/content-library">
                      <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        <Zap className="mr-2 w-5 h-5" />
                        Start Your Journey
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                {isWelcome ? `Welcome, ${user?.email?.split('@')[0]}!` : `Welcome back, ${user?.email?.split('@')[0]}!`}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                {isWelcome ? 'Your personal development journey starts now' : 'Your personal development journey continues'}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge 
                className="text-base px-6 py-3 bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200/50 dark:border-emerald-700/30 shadow-lg font-semibold"
              >
                <Users className="w-4 h-4 mr-2" />
                Soft Member
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              value: progress?.completedAssessments || 0,
              label: 'Assessments Completed',
              color: 'emerald',
              icon: Brain,
              gradient: 'from-emerald-500 to-teal-600',
              bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
              progress: (progress?.completedAssessments || 0) / (progress?.totalAssessments || 1) * 100
            },
            {
              value: progress?.totalScore || 0,
              label: 'Engagement Score',
              color: 'blue',
              icon: Target,
              gradient: 'from-blue-500 to-cyan-600',
              bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
              badge: progress?.tier || 'browser'
            },
            {
              value: progress?.streakDays || 0,
              label: 'Day Streak',
              color: 'purple',
              icon: TrendingUp,
              gradient: 'from-purple-500 to-indigo-600',
              bgGradient: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
              subtitle: 'Keep it up! 🔥'
            },
            {
              value: `${Math.round((progress?.completedAssessments || 0) / (progress?.totalAssessments || 1) * 100)}%`,
              label: 'Journey Complete',
              color: 'orange',
              icon: Award,
              gradient: 'from-orange-500 to-red-500',
              bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
              subtitle: `${(progress?.totalAssessments || 15) - (progress?.completedAssessments || 0)} tools remaining`
            }
          ].map((item, index) => {
            const IconComponent = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className={`p-6 bg-gradient-to-br ${item.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className={`text-4xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                      {item.value}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {item.label}
                    </div>
                    {item.progress !== undefined && (
                      <Progress 
                        value={item.progress} 
                        className="mt-3 h-2"
                      />
                    )}
                    {item.badge && (
                      <Badge variant="outline" className="mt-2 capitalize">
                        {item.badge}
                      </Badge>
                    )}
                    {item.subtitle && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personalized Content Feed */}
            <PersonalizedContentFeed 
              userId={user?.id}
              engagementLevel={membershipData?.current_tier}
            />

            {/* Communication Center */}
            <CommunicationCenter 
              userId={user?.id}
              userTier={membershipData?.current_tier}
              referrerId="sarah_tesfaye"
            />

            {/* Recent Assessment Results - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Your Assessment Journey
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Track your progress and insights
                      </p>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/content-library">
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg px-6 py-3">
                        <Target className="w-4 h-4 mr-2" />
                        Take New Assessment
                      </Button>
                    </Link>
                  </motion.div>
                </div>

              {(progress?.completedAssessments || 0) > 0 ? (
                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          Assessment Progress
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                          {progress?.completedAssessments} assessments completed
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                          {Math.round((progress?.completedAssessments || 0) / (progress?.totalAssessments || 1) * 100)}%
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" size="sm" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                            View Progress
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <motion.div 
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="text-8xl mb-6"
                  >
                    📊
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    No assessments yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
                    Start your journey by taking your first assessment and unlock personalized insights about your potential
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/content-library">
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg">
                        <Star className="w-5 h-5 mr-2" />
                        Take Your First Assessment
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </Card>
            </motion.div>

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

          {/* Right Column - Network & Benefits */}
          <div className="space-y-8">
            {/* Network Hub */}
            <NetworkHub 
              userId={user?.id}
              userTier={membershipData?.current_tier}
            />

            {/* Personalized Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Recommended for You
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Personalized based on your progress
                    </p>
                  </div>
                </div>
              
              <div className="space-y-4">
                {recommendations.length > 0 ? recommendations.map((rec) => (
                  <motion.div 
                    key={rec.id} 
                    whileHover={{ scale: 1.02 }}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{rec.title}</h3>
                      <Badge 
                        variant={rec.priority === 'high' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{rec.description}</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href={rec.link}>
                        <Button size="sm" variant="outline" className="w-full">
                          {rec.type === 'tool' ? 'Take Assessment' : 
                           rec.type === 'webinar' ? 'Register Now' : 'Read More'}
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                )) : (
                  <div className="text-center py-8">
                    <motion.div 
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 4
                      }}
                      className="text-6xl mb-4"
                    >
                      🎯
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Personalized recommendations will appear here based on your assessment results
                    </p>
                  </div>
                )}
              </div>
              </Card>
            </motion.div>

            {/* Member Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Your Member Benefits
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      What you get as a soft member
                    </p>
                  </div>
                </div>
              
              <div className="space-y-4">
                {[
                  'Saved assessment results',
                  'Progress tracking',
                  'Personalized recommendations',
                  'Continuous education content',
                  'Priority tool access'
                ].map((benefit, index) => (
                  <motion.div 
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-3 mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white">Upgrade Path</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Ready for the next level? Book an office visit for personalized guidance and advanced strategies.
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/office-visit-test">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg py-3">
                      <Users className="w-4 h-4 mr-2" />
                      Schedule Office Visit
                    </Button>
                  </Link>
                </motion.div>
              </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Quick Actions
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Fast access to key features
                    </p>
                  </div>
                </div>
              
              <div className="space-y-3">
                {[
                  { href: '/content-library', icon: '📚', label: 'Browse Content Library', color: 'from-blue-500 to-cyan-500' },
                  { href: '/webinars', icon: '🎥', label: 'Join Webinar', color: 'from-purple-500 to-indigo-500' },
                  { href: '/tools', icon: '📊', label: 'Take Assessment', color: 'from-emerald-500 to-teal-500' },
                  { href: '/membership/settings', icon: '⚙️', label: 'Manage Preferences', color: 'from-gray-500 to-slate-500' }
                ].map((action, index) => (
                  <motion.div 
                    key={action.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={action.href}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-12 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700 border-slate-200 dark:border-slate-700"
                      >
                        <span className="text-lg mr-3">{action.icon}</span>
                        <span className="font-medium">{action.label}</span>
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  Target,
  Clock,
  Flame,
  Star,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  Zap,
  BookOpen,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface ProgressTrackerProps {
  memberId: string
  memberStats: any
  onRefresh: () => void
}

export function ProgressTracker({ memberId, memberStats, onRefresh }: ProgressTrackerProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week')

  if (!memberStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No progress data available yet</p>
        </div>
      </div>
    )
  }

  const achievements = [
    {
      id: 'first_chunk',
      title: 'First Steps',
      description: 'Completed your first chunk',
      icon: '🎯',
      unlocked: memberStats.totalChunksCompleted >= 1,
      progress: Math.min(memberStats.totalChunksCompleted, 1)
    },
    {
      id: 'consistent_learner',
      title: 'Consistent Learner',
      description: 'Maintained a 7-day streak',
      icon: '🔥',
      unlocked: memberStats.currentStreak >= 7,
      progress: Math.min(memberStats.currentStreak / 7, 1)
    },
    {
      id: 'chunk_master',
      title: 'Chunk Master',
      description: 'Completed 10 chunks',
      icon: '🏆',
      unlocked: memberStats.totalChunksCompleted >= 10,
      progress: Math.min(memberStats.totalChunksCompleted / 10, 1)
    },
    {
      id: 'high_engagement',
      title: 'Highly Engaged',
      description: 'Achieved 85+ engagement score',
      icon: '⚡',
      unlocked: memberStats.averageEngagement >= 85,
      progress: Math.min(memberStats.averageEngagement / 85, 1)
    },
    {
      id: 'time_investor',
      title: 'Time Investor',
      description: 'Invested 20+ hours in learning',
      icon: '⏰',
      unlocked: memberStats.totalTimeSpent >= 1200, // 20 hours in minutes
      progress: Math.min(memberStats.totalTimeSpent / 1200, 1)
    }
  ]

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-400'
    if (streak >= 14) return 'text-orange-400'
    if (streak >= 7) return 'text-yellow-400'
    if (streak >= 3) return 'text-green-400'
    return 'text-gray-400'
  }

  const getEngagementColor = (score: number) => {
    if (score >= 90) return 'text-purple-400'
    if (score >= 80) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    if (score >= 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const mockWeeklyData = [
    { day: 'Mon', chunks: 2, time: 45 },
    { day: 'Tue', chunks: 1, time: 30 },
    { day: 'Wed', chunks: 3, time: 60 },
    { day: 'Thu', chunks: 1, time: 25 },
    { day: 'Fri', chunks: 2, time: 50 },
    { day: 'Sat', chunks: 1, time: 20 },
    { day: 'Sun', chunks: 2, time: 40 }
  ]

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{memberStats.totalChunksCompleted}</div>
                <div className="text-sm text-purple-400">Chunks</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Completed</span>
                <span className="text-purple-400">
                  {memberStats.totalChunksStarted > 0 
                    ? Math.round((memberStats.totalChunksCompleted / memberStats.totalChunksStarted) * 100)
                    : 0}%
                </span>
              </div>
              <Progress 
                value={memberStats.totalChunksStarted > 0 
                  ? (memberStats.totalChunksCompleted / memberStats.totalChunksStarted) * 100 
                  : 0} 
                className="h-2"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <Flame className={`w-6 h-6 ${getStreakColor(memberStats.currentStreak)}`} />
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getStreakColor(memberStats.currentStreak)}`}>
                  {memberStats.currentStreak}
                </div>
                <div className="text-sm text-orange-400">Day Streak</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Target: 30 days</span>
                <span className="text-orange-400">{Math.min(memberStats.currentStreak, 30)}/30</span>
              </div>
              <Progress value={Math.min((memberStats.currentStreak / 30) * 100, 100)} className="h-2" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Star className={`w-6 h-6 ${getEngagementColor(memberStats.averageEngagement)}`} />
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getEngagementColor(memberStats.averageEngagement)}`}>
                  {memberStats.averageEngagement}
                </div>
                <div className="text-sm text-green-400">Engagement</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Excellence: 90+</span>
                <span className="text-green-400">{Math.min(memberStats.averageEngagement, 90)}/90</span>
              </div>
              <Progress value={Math.min((memberStats.averageEngagement / 90) * 100, 100)} className="h-2" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {Math.floor(memberStats.totalTimeSpent / 60)}h
                </div>
                <div className="text-sm text-blue-400">Time Invested</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">This week</span>
                <span className="text-blue-400">
                  {mockWeeklyData.reduce((sum, day) => sum + day.time, 0)}min
                </span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Weekly Activity</h3>
            <div className="flex items-center space-x-2">
              {['week', 'month', 'all'].map(period => (
                <Button
                  key={period}
                  variant={timeframe === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeframe(period as any)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {mockWeeklyData.map((day, index) => (
              <div key={day.day} className="text-center">
                <div className="text-sm text-gray-400 mb-2">{day.day}</div>
                <div className="space-y-2">
                  <div 
                    className="bg-purple-500/20 rounded-lg p-2 border border-purple-500/30"
                    style={{ height: `${Math.max(day.chunks * 20, 20)}px` }}
                  >
                    <div className="text-xs font-bold text-purple-300">{day.chunks}</div>
                  </div>
                  <div className="text-xs text-gray-500">{day.time}min</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6">Achievements</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`p-4 transition-all ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                    : 'bg-slate-700/30 border border-slate-600'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`text-2xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${achievement.unlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Progress</span>
                          <span className={achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}>
                            {Math.round(achievement.progress * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={achievement.progress * 100} 
                          className="h-1"
                        />
                      </div>
                      
                      {achievement.unlocked && (
                        <Badge className="mt-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          <Award className="w-3 h-3 mr-1" />
                          Unlocked!
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Strengths and Improvement Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-white">Your Strengths</h3>
            </div>
            
            {memberStats.strengthAreas.length > 0 ? (
              <div className="space-y-3">
                {memberStats.strengthAreas.map((strength: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{strength}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Complete more chunks to discover your strengths!
              </p>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-bold text-white">Growth Opportunities</h3>
            </div>
            
            {memberStats.improvementAreas.length > 0 ? (
              <div className="space-y-3">
                {memberStats.improvementAreas.map((area: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Target className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-300">{area}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Keep learning to identify areas for growth!
              </p>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <Button onClick={onRefresh} variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Refresh Progress
        </Button>
      </div>
    </div>
  )
}
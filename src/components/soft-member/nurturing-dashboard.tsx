"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  ArrowRight,
  Trophy,
  Target,
  Star,
  Flame,
  TrendingUp,
  Calendar,
  Users,
  Zap
} from 'lucide-react'
import { 
  softMemberNurturingService, 
  NurturingChunk, 
  MemberProgress,
  ActionItem
} from '@/lib/soft-member-nurturing'
import { ChunkDisplay } from './chunk-display'
import { ProgressTracker } from './progress-tracker'

interface NurturingDashboardProps {
  memberId: string
  visitorStatus: 'cold_lead' | 'candidate' | 'hot_lead'
}

export function NurturingDashboard({ memberId, visitorStatus }: NurturingDashboardProps) {
  const [currentChunks, setCurrentChunks] = useState<NurturingChunk[]>([])
  const [memberStats, setMemberStats] = useState<any>(null)
  const [recommendedActions, setRecommendedActions] = useState<{
    primary: string
    secondary: string[]
    urgentItems: ActionItem[]
  }>({ primary: '', secondary: [], urgentItems: [] })
  const [activeChunk, setActiveChunk] = useState<NurturingChunk | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadNurturingData = async () => {
      setIsLoading(true)
      try {
        // Get current chunks for the member
        const chunks = await softMemberNurturingService.getCurrentChunks(memberId)
        setCurrentChunks(chunks)

        // Get member stats
        const stats = softMemberNurturingService.getMemberNurturingStats(memberId)
        setMemberStats(stats)

        // Get recommended actions
        const actions = softMemberNurturingService.getRecommendedActions(memberId)
        setRecommendedActions(actions)
      } catch (error) {
        console.error('Error loading nurturing data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNurturingData()
  }, [memberId])

  const handleStartChunk = async (chunk: NurturingChunk) => {
    try {
      await softMemberNurturingService.startChunk(memberId, chunk.id)
      setActiveChunk(chunk)
    } catch (error) {
      console.error('Error starting chunk:', error)
    }
  }

  const handleCompleteChunk = async (chunkId: string) => {
    try {
      await softMemberNurturingService.updateChunkProgress(memberId, chunkId, {
        status: 'completed'
      })
      
      // Reload data
      const chunks = await softMemberNurturingService.getCurrentChunks(memberId)
      setCurrentChunks(chunks)
      
      const stats = softMemberNurturingService.getMemberNurturingStats(memberId)
      setMemberStats(stats)
      
      setActiveChunk(null)
    } catch (error) {
      console.error('Error completing chunk:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
          Your Transformation Journey
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Every step forward is a step toward the extraordinary person you're becoming.
        </p>
      </motion.div>

      {/* Progress Overview */}
      {memberStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="text-2xl font-bold text-white">{memberStats.totalChunksCompleted}</span>
                </div>
                <p className="text-gray-400 text-sm">Chunks Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="w-6 h-6 text-orange-400 mr-2" />
                  <span className="text-2xl font-bold text-white">{memberStats.currentStreak}</span>
                </div>
                <p className="text-gray-400 text-sm">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-purple-400 mr-2" />
                  <span className="text-2xl font-bold text-white">{memberStats.averageEngagement}</span>
                </div>
                <p className="text-gray-400 text-sm">Engagement Score</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-blue-400 mr-2" />
                  <span className="text-2xl font-bold text-white">{Math.floor(memberStats.totalTimeSpent / 60)}h</span>
                </div>
                <p className="text-gray-400 text-sm">Time Invested</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recommended Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Card className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Your Next Move</h3>
              <p className="text-gray-300">{recommendedActions.primary}</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Take Action
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="current" className="data-[state=active]:bg-purple-600">
            <BookOpen className="w-4 h-4 mr-2" />
            Current Journey
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="community" className="data-[state=active]:bg-purple-600">
            <Users className="w-4 h-4 mr-2" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6 mt-6">
          {activeChunk ? (
            <ChunkDisplay
              chunk={activeChunk}
              memberId={memberId}
              onComplete={() => handleCompleteChunk(activeChunk.id)}
              onCancel={() => setActiveChunk(null)}
            />
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Your Current Chunks</h2>
              <div className="grid gap-6">
                {currentChunks.map((chunk, index) => (
                  <motion.div
                    key={chunk.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                              {chunk.stage}
                            </Badge>
                            <Badge variant="outline" className="border-slate-600">
                              {chunk.type}
                            </Badge>
                            <div className="flex items-center text-gray-400 text-sm">
                              <Clock className="w-4 h-4 mr-1" />
                              {chunk.estimatedTime} min
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-2">{chunk.title}</h3>
                          <p className="text-gray-300 mb-4">{chunk.description}</p>
                          
                          <div className="bg-slate-700/50 p-4 rounded-lg mb-4">
                            <p className="text-gray-200 italic">"{chunk.content.hook}"</p>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Target className="w-4 h-4 mr-1" />
                              Level {chunk.difficultyLevel}
                            </div>
                            <div className="flex items-center">
                              <Zap className="w-4 h-4 mr-1" />
                              {chunk.interactionElements.length} interactions
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6">
                          <Button
                            onClick={() => handleStartChunk(chunk)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Chunk
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <ProgressTracker
            memberId={memberId}
            memberStats={memberStats}
            onRefresh={() => {
              // Refresh data
              const stats = softMemberNurturingService.getMemberNurturingStats(memberId)
              setMemberStats(stats)
            }}
          />
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <div className="space-y-6">
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Community Coming Soon</h3>
                <p className="text-gray-400">Connect with fellow transformation champions on your journey.</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
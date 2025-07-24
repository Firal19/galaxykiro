"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MemberRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the new soft member dashboard
    router.push('/soft-member/dashboard')
  }, [router])

  return null
}

// Keep the old component as SoftMemberDashboard for backward compatibility
export function SoftMemberDashboard() {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'nurturing' | 'community' | 'profile'>('dashboard')
  const [memberProfile, setMemberProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMemberData = async () => {
      setIsLoading(true)
      try {
        // Get current lead profile
        const profile = leadScoringService.getCurrentProfile()
        setMemberProfile(profile)
      } catch (error) {
        console.error('Error loading member data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMemberData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-purple-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Your Space</h3>
          <p className="text-gray-400">Preparing your transformation journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-300 text-lg font-medium">
                Your transformation journey continues here
              </p>
              {memberProfile && (
                <div className="flex items-center space-x-4">
                  <Badge className={`px-3 py-1 ${
                    memberProfile.status === 'hot_lead' 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                      : memberProfile.status === 'candidate'
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    {memberProfile.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-gray-400 text-sm">
                    Engagement Score: {memberProfile.score}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="border-slate-600 hover:bg-slate-700"
                  onClick={() => setActiveSection('profile')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-2">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                { key: 'nurturing', label: 'Learning Journey', icon: BookOpen },
                { key: 'community', label: 'Community', icon: MessageSquare },
                { key: 'profile', label: 'Profile', icon: User }
              ].map(section => {
                const IconComponent = section.icon
                const isActive = activeSection === section.key
                return (
                  <motion.button
                    key={section.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection(section.key as any)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span className="hidden sm:inline">{section.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        {activeSection === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Level</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {memberProfile?.status?.replace('_', ' ') || 'Member'}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-purple-400" />
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Engagement Score</p>
                    <p className="text-2xl font-bold text-blue-400">{memberProfile?.score || 0}</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Days Active</p>
                    <p className="text-2xl font-bold text-green-400">
                      {Math.floor((Date.now() - new Date(memberProfile?.lastInteraction || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  onClick={() => setActiveSection('nurturing')}
                  className="h-auto p-4 flex flex-col items-start space-y-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:from-purple-600/30 hover:to-pink-600/30"
                >
                  <BookOpen className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <div className="font-medium text-white">Continue Learning</div>
                    <div className="text-xs text-gray-400">Pick up where you left off</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 ml-auto" />
                </Button>
                
                <Button
                  disabled
                  className="h-auto p-4 flex flex-col items-start space-y-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 opacity-50"
                >
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                  <div className="text-left">
                    <div className="font-medium text-white">Join Community</div>
                    <div className="text-xs text-gray-400">Connect with others (Coming Soon)</div>
                  </div>
                </Button>
                
                <Button
                  disabled
                  className="h-auto p-4 flex flex-col items-start space-y-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 opacity-50"
                >
                  <Calendar className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <div className="font-medium text-white">Schedule Session</div>
                    <div className="text-xs text-gray-400">Book 1-on-1 time (Coming Soon)</div>
                  </div>
                </Button>
              </div>
            </Card>

            {/* Benefits Overview */}
            <SoftMemberBenefits />
          </motion.div>
        )}

        {activeSection === 'nurturing' && memberProfile && (
          <NurturingDashboard 
            memberId={memberProfile.id || 'default-member'}
            visitorStatus={memberProfile.status}
          />
        )}

        {activeSection === 'community' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="p-12 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Community Coming Soon</h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                We're building an amazing community space where you can connect with fellow transformation champions, 
                share your journey, and support each other's growth.
              </p>
              <Button disabled className="bg-gradient-to-r from-purple-600 to-pink-600 opacity-50">
                Join Waitlist
              </Button>
            </Card>
          </motion.div>
        )}

        {activeSection === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="p-12 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Profile Settings</h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Manage your profile, preferences, and account settings. This section is being enhanced 
                with more personalization options.
              </p>
              {memberProfile && (
                <div className="max-w-md mx-auto space-y-4 text-left">
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white">{memberProfile.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-gray-400">Engagement Score:</span>
                    <span className="text-white">{memberProfile.score}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-gray-400">Last Activity:</span>
                    <span className="text-white">
                      {new Date(memberProfile.lastInteraction).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
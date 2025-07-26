"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// Layout handled by src/app/soft-member/layout.tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  User,
  Edit,
  Save,
  Camera,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Award,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  Settings,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Download,
  Upload
} from 'lucide-react'
import { format } from 'date-fns'
import { leadScoringService } from '@/lib/lead-scoring-service'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  title?: string
  company?: string
  location?: string
  bio?: string
  avatar?: string
  website?: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    github?: string
  }
  preferences: {
    emailNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    weeklyDigest: boolean
    profileVisibility: 'public' | 'members_only' | 'private'
  }
  stats: {
    profileViews: number
    contentEngagement: number
    networkConnections: number
    assessmentsCompleted: number
    certificationsEarned: number
  }
  skills: string[]
  interests: string[]
  goals: string[]
  achievements: Array<{
    id: string
    title: string
    description: string
    dateEarned: string
    type: 'assessment' | 'engagement' | 'network' | 'content'
  }>
}

export default function SoftMemberProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Mock profile data - in production this would come from API
        const mockProfile: UserProfile = {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+1-555-0123',
          title: 'Senior Product Manager',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          bio: 'Passionate about product strategy and team leadership. On a journey of continuous growth and transformation. Excited to connect with like-minded professionals and share insights.',
          avatar: '',
          website: 'https://sarahjohnson.dev',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/sarahjohnson',
            twitter: 'https://twitter.com/sarahjohnson',
            github: 'https://github.com/sarahjohnson'
          },
          preferences: {
            emailNotifications: true,
            pushNotifications: true,
            marketingEmails: false,
            weeklyDigest: true,
            profileVisibility: 'members_only'
          },
          stats: {
            profileViews: 127,
            contentEngagement: 85,
            networkConnections: 23,
            assessmentsCompleted: 8,
            certificationsEarned: 3
          },
          skills: ['Product Management', 'Strategic Planning', 'Team Leadership', 'Data Analysis', 'User Research'],
          interests: ['Leadership Development', 'Innovation', 'Technology Trends', 'Personal Growth', 'Coaching'],
          goals: ['Become a VP of Product', 'Complete Executive Leadership Program', 'Build a network of 100+ connections', 'Mentor junior product managers'],
          achievements: [
            {
              id: '1',
              title: 'Assessment Master',
              description: 'Completed 5 comprehensive assessments',
              dateEarned: '2025-01-20',
              type: 'assessment'
            },
            {
              id: '2',
              title: 'Content Explorer',
              description: 'Engaged with 50+ pieces of content',
              dateEarned: '2025-01-18',
              type: 'content'
            },
            {
              id: '3',
              title: 'Network Builder',
              description: 'Connected with 20+ professionals',
              dateEarned: '2025-01-15',
              type: 'network'
            }
          ]
        }

        setProfile(mockProfile)
        setEditedProfile(mockProfile)

        // Track profile visit
        leadScoringService.updateEngagement('high_engagement', {
          eventType: 'page_visit',
          page: 'soft_member_profile'
        })

      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSaveProfile = async () => {
    if (!editedProfile) return

    try {
      // In production, this would make an API call
      setProfile(editedProfile)
      setEditing(false)

      // Track profile update
      leadScoringService.updateEngagement('high_engagement', {
        eventType: 'profile_update',
        updateType: 'basic_info'
      })

    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    }
  }

  const handleCancelEdit = () => {
    setEditedProfile(profile)
    setEditing(false)
  }

  const handleFieldChange = (field: string, value: any) => {
    if (!editedProfile) return

    setEditedProfile(prev => {
      if (!prev) return prev
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof UserProfile] as object || {}),
            [child]: value
          }
        }
      }
      
      return {
        ...prev,
        [field]: value
      }
    })
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'assessment': return Target
      case 'content': return Star
      case 'network': return User
      case 'engagement': return TrendingUp
      default: return Award
    }
  }

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'content': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'network': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'engagement': return 'bg-purple-500/10 text-purple-700 border-purple-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile || !editedProfile) {
    return (
      <div className="min-h-screen">
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">Unable to load your profile. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {editing ? (
                <>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-purple-500/5">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                {editing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Soft Member
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {profile.title && profile.company && (
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{profile.title} at {profile.company}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{profile.stats.profileViews} profile views</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>{profile.stats.contentEngagement}% engagement</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{profile.stats.assessmentsCompleted}</div>
                  <div className="text-xs text-muted-foreground">Assessments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{profile.stats.networkConnections}</div>
                  <div className="text-xs text-muted-foreground">Connections</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">{profile.stats.certificationsEarned}</div>
                  <div className="text-xs text-muted-foreground">Certificates</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Personal Details</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* About */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">About</h3>
                  {editing ? (
                    <Textarea
                      value={editedProfile.bio || ''}
                      onChange={(e) => handleFieldChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {profile.bio || 'No bio added yet.'}
                    </p>
                  )}
                </Card>

                {/* Skills */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    {editing && (
                      <Button variant="outline" size="sm">
                        + Add Skill
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Interests */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                    {editing && (
                      <Button variant="outline" size="sm">
                        + Add Interest
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Goals */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Goals</h3>
                  <div className="space-y-3">
                    {profile.goals.map((goal, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Target className="w-4 h-4 text-primary mt-1" />
                        <span className="text-sm">{goal}</span>
                      </div>
                    ))}
                    {editing && (
                      <Button variant="outline" size="sm" className="w-full">
                        + Add Goal
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editing ? editedProfile.name : profile.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        disabled={!editing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editing ? editedProfile.email : profile.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        disabled={!editing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editing ? (editedProfile.phone || '') : (profile.phone || '')}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        disabled={!editing}
                        placeholder="Your phone number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={editing ? (editedProfile.website || '') : (profile.website || '')}
                        onChange={(e) => handleFieldChange('website', e.target.value)}
                        disabled={!editing}
                        placeholder="Your website URL"
                      />
                    </div>
                  </div>
                </Card>

                {/* Professional Information */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Professional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={editing ? (editedProfile.title || '') : (profile.title || '')}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        disabled={!editing}
                        placeholder="Your job title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={editing ? (editedProfile.company || '') : (profile.company || '')}
                        onChange={(e) => handleFieldChange('company', e.target.value)}
                        disabled={!editing}
                        placeholder="Your company"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editing ? (editedProfile.location || '') : (profile.location || '')}
                        onChange={(e) => handleFieldChange('location', e.target.value)}
                        disabled={!editing}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </Card>

                {/* Social Links */}
                <Card className="p-6 lg:col-span-2">
                  <h3 className="font-semibold mb-4">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="linkedin"
                          value={editing ? (editedProfile.socialLinks.linkedin || '') : (profile.socialLinks.linkedin || '')}
                          onChange={(e) => handleFieldChange('socialLinks.linkedin', e.target.value)}
                          disabled={!editing}
                          placeholder="LinkedIn profile URL"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="twitter"
                          value={editing ? (editedProfile.socialLinks.twitter || '') : (profile.socialLinks.twitter || '')}
                          onChange={(e) => handleFieldChange('socialLinks.twitter', e.target.value)}
                          disabled={!editing}
                          placeholder="Twitter profile URL"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="github"
                          value={editing ? (editedProfile.socialLinks.github || '') : (profile.socialLinks.github || '')}
                          onChange={(e) => handleFieldChange('socialLinks.github', e.target.value)}
                          disabled={!editing}
                          placeholder="GitHub profile URL"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.achievements.map((achievement) => {
                  const Icon = getAchievementIcon(achievement.type)
                  return (
                    <Card key={achievement.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${getAchievementColor(achievement.type)}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Earned {format(new Date(achievement.dateEarned), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}

                {/* Progress Indicators */}
                <Card className="p-6 md:col-span-2 lg:col-span-3">
                  <h3 className="font-semibold mb-4">Progress Towards Next Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Content Master</span>
                        <span className="text-sm text-muted-foreground">75/100 views</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Network Champion</span>
                        <span className="text-sm text-muted-foreground">23/50 connections</span>
                      </div>
                      <Progress value={46} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Assessment Expert</span>
                        <span className="text-sm text-muted-foreground">8/10 completed</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Engagement Leader</span>
                        <span className="text-sm text-muted-foreground">85/90% rate</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notification Preferences */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">Email Notifications</div>
                          <div className="text-xs text-muted-foreground">Receive notifications via email</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.emailNotifications}
                        onChange={(e) => handleFieldChange('preferences.emailNotifications', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">Push Notifications</div>
                          <div className="text-xs text-muted-foreground">Receive push notifications</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.pushNotifications}
                        onChange={(e) => handleFieldChange('preferences.pushNotifications', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">Marketing Emails</div>
                          <div className="text-xs text-muted-foreground">Receive promotional content</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.marketingEmails}
                        onChange={(e) => handleFieldChange('preferences.marketingEmails', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">Weekly Digest</div>
                          <div className="text-xs text-muted-foreground">Weekly summary of activities</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.weeklyDigest}
                        onChange={(e) => handleFieldChange('preferences.weeklyDigest', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </Card>

                {/* Privacy Settings */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="visibility">Profile Visibility</Label>
                      <Select
                        value={profile.preferences.profileVisibility}
                        onValueChange={(value: 'public' | 'members_only' | 'private') => 
                          handleFieldChange('preferences.profileVisibility', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4" />
                              <span>Public - Visible to everyone</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="members_only">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>Members Only - Visible to members</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center space-x-2">
                              <EyeOff className="w-4 h-4" />
                              <span>Private - Only visible to you</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* Account Actions */}
                <Card className="p-6 lg:col-span-2">
                  <h3 className="font-semibold mb-4">Account Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Data
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Report
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
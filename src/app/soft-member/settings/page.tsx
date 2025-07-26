'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface UserSettings {
  // Profile Settings
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  timezone: string
  language: string
  
  // Notification Settings
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  assessmentReminders: boolean
  weeklyInsights: boolean
  
  // Privacy Settings
  profileVisibility: 'public' | 'members' | 'private'
  showProgress: boolean
  allowDataCollection: boolean
  
  // Appearance Settings
  theme: 'light' | 'dark' | 'system'
  colorScheme: 'purple' | 'blue' | 'green' | 'orange'
  compactMode: boolean
  
  // Communication Preferences
  preferredContactMethod: 'email' | 'sms' | 'app'
  communicationFrequency: 'daily' | 'weekly' | 'monthly'
}

const defaultSettings: UserSettings = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  timezone: 'Africa/Addis_Ababa',
  language: 'en',
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  marketingEmails: true,
  assessmentReminders: true,
  weeklyInsights: true,
  profileVisibility: 'members',
  showProgress: true,
  allowDataCollection: true,
  theme: 'system',
  colorScheme: 'purple',
  compactMode: false,
  preferredContactMethod: 'email',
  communicationFrequency: 'weekly'
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // In a real app, this would load from an API
      const savedSettings = localStorage.getItem('user_settings')
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // In a real app, this would save to an API
      localStorage.setItem('user_settings', JSON.stringify(settings))
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const exportData = () => {
    const dataToExport = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'galaxy-kiro-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Data exported",
      description: "Your data has been downloaded successfully.",
    })
  }

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: "Account deletion requested",
        description: "Please contact support to complete account deletion.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and privacy settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={settings.firstName}
                  onChange={(e) => updateSetting('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={settings.lastName}
                  onChange={(e) => updateSetting('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => updateSetting('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Addis_Ababa">East Africa Time (EAT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose how you want to be notified about updates and activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="assessmentReminders">Assessment Reminders</Label>
                <p className="text-sm text-gray-600">Get reminded to complete assessments</p>
              </div>
              <Switch
                id="assessmentReminders"
                checked={settings.assessmentReminders}
                onCheckedChange={(checked) => updateSetting('assessmentReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyInsights">Weekly Insights</Label>
                <p className="text-sm text-gray-600">Receive weekly progress summaries</p>
              </div>
              <Switch
                id="weeklyInsights"
                checked={settings.weeklyInsights}
                onCheckedChange={(checked) => updateSetting('weeklyInsights', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketingEmails">Marketing Communications</Label>
                <p className="text-sm text-gray-600">Receive news and promotional content</p>
              </div>
              <Switch
                id="marketingEmails"
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => updateSetting('marketingEmails', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Control your privacy settings and data usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="profileVisibility">Profile Visibility</Label>
              <Select value={settings.profileVisibility} onValueChange={(value: any) => updateSetting('profileVisibility', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                  <SelectItem value="members">Members Only - Only Galaxy Kiro members</SelectItem>
                  <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showProgress">Show Progress</Label>
                <p className="text-sm text-gray-600">Display your assessment progress publicly</p>
              </div>
              <Switch
                id="showProgress"
                checked={settings.showProgress}
                onCheckedChange={(checked) => updateSetting('showProgress', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowDataCollection">Data Collection</Label>
                <p className="text-sm text-gray-600">Allow data collection for improving services</p>
              </div>
              <Switch
                id="allowDataCollection"
                checked={settings.allowDataCollection}
                onCheckedChange={(checked) => updateSetting('allowDataCollection', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the application looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={settings.theme} onValueChange={(value: any) => updateSetting('theme', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="colorScheme">Color Scheme</Label>
              <Select value={settings.colorScheme} onValueChange={(value: any) => updateSetting('colorScheme', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compactMode">Compact Mode</Label>
                <p className="text-sm text-gray-600">Use less spacing for a denser layout</p>
              </div>
              <Switch
                id="compactMode"
                checked={settings.compactMode}
                onCheckedChange={(checked) => updateSetting('compactMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export your data or delete your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" onClick={exportData} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export My Data
              </Button>
              
              <Button variant="destructive" onClick={deleteAccount} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
            
            <p className="text-sm text-gray-600">
              You can export all your data in JSON format or permanently delete your account. 
              Account deletion cannot be undone.
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={loading} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}
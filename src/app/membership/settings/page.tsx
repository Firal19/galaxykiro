'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/contexts/auth-context';

interface UserSettings {
  email: string;
  phone?: string;
  telegram_handle?: string;
  subscription_preferences: string[];
  notification_frequency: string;
  content_preferences: string[];
  language: string;
}

const subscriptionOptions = [
  {
    id: 'email',
    name: 'Email Updates',
    description: 'Weekly insights and tools',
    icon: '📧'
  },
  {
    id: 'sms',
    name: 'SMS Notifications',
    description: 'Daily motivation messages',
    icon: '📱'
  },
  {
    id: 'telegram',
    name: 'Telegram Channel',
    description: 'Real-time community updates',
    icon: '💬'
  }
];

const contentCategories = [
  'Personal Development',
  'Goal Setting',
  'Habit Formation',
  'Leadership',
  'Mindset',
  'Productivity',
  'Relationships',
  'Career Growth'
];

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

export default function MembershipSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setSettings({
        email: data.email || '',
        phone: data.phone || '',
        telegram_handle: data.telegram_handle || '',
        subscription_preferences: data.subscription_preferences || ['email'],
        notification_frequency: data.notification_frequency || 'weekly',
        content_preferences: data.content_preferences || [],
        language: data.language || 'en'
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscriptionToggle = (optionId: string) => {
    if (!settings) return;

    const newPreferences = settings.subscription_preferences.includes(optionId)
      ? settings.subscription_preferences.filter(id => id !== optionId)
      : [...settings.subscription_preferences, optionId];

    setSettings({
      ...settings,
      subscription_preferences: newPreferences
    });
  };

  const handleContentPreferenceToggle = (category: string) => {
    if (!settings) return;

    const newPreferences = settings.content_preferences.includes(category)
      ? settings.content_preferences.filter(cat => cat !== category)
      : [...settings.content_preferences, category];

    setSettings({
      ...settings,
      content_preferences: newPreferences
    });
  };

  const handleInputChange = (field: keyof UserSettings, value: string) => {
    if (!settings) return;

    setSettings({
      ...settings,
      [field]: value
    });
  };

  const saveSettings = async () => {
    if (!settings || !user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          phone: settings.phone,
          telegram_handle: settings.telegram_handle,
          subscription_preferences: settings.subscription_preferences,
          notification_frequency: settings.notification_frequency,
          content_preferences: settings.content_preferences,
          language: settings.language,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Track settings update
      await supabase
        .from('interactions')
        .insert({
          user_id: user.id,
          interaction_type: 'settings_updated',
          metadata: {
            subscription_preferences: settings.subscription_preferences,
            content_preferences: settings.content_preferences
          }
        });

      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load settings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Membership Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Customize your learning experience and communication preferences
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+251 9XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telegram Handle
                </label>
                <input
                  type="text"
                  value={settings.telegram_handle || ''}
                  onChange={(e) => handleInputChange('telegram_handle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="@yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language Preference
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="am">አማርኛ (Amharic)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Subscription Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Communication Preferences
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  How would you like to receive updates?
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {subscriptionOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        settings.subscription_preferences.includes(option.id)
                          ? 'ring-2 ring-green-500 bg-green-50'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleSubscriptionToggle(option.id)}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{option.icon}</div>
                        <h4 className="font-medium text-gray-900">{option.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Notification Frequency
                </h3>
                <div className="flex space-x-4">
                  {frequencyOptions.map((freq) => (
                    <label key={freq.value} className="flex items-center">
                      <input
                        type="radio"
                        name="frequency"
                        value={freq.value}
                        checked={settings.notification_frequency === freq.value}
                        onChange={(e) => handleInputChange('notification_frequency', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">{freq.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Content Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Content Interests
            </h2>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                What topics interest you most?
              </h3>
              <div className="grid md:grid-cols-4 gap-3">
                {contentCategories.map((category) => (
                  <div
                    key={category}
                    className={`border rounded-lg p-3 cursor-pointer text-center transition-all duration-200 ${
                      settings.content_preferences.includes(category)
                        ? 'ring-2 ring-green-500 bg-green-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleContentPreferenceToggle(category)}
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {category}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Select your interests to receive personalized content recommendations
              </p>
            </div>
          </Card>

          {/* Account Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Account Status
            </h2>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Soft Member
                  </Badge>
                  <span className="text-gray-600">Active since registration</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Enjoying your membership? Consider scheduling an office visit for personalized guidance.
                </p>
              </div>
              <Button variant="outline">
                Schedule Office Visit
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={saveSettings}
              disabled={isSaving}
              className="px-8"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
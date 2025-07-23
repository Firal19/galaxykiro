'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/contexts/auth-context';
import { GalaxyDreamTeamLogo } from '@/components/galaxy-dream-team-logo';

interface SubscriptionOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  benefits: string[];
  frequency: string;
}

const subscriptionOptions: SubscriptionOption[] = [
  {
    id: 'email',
    name: 'Email Updates',
    description: 'Receive weekly insights and tools directly in your inbox',
    icon: '📧',
    benefits: [
      'Weekly personal development insights',
      'New tool notifications',
      'Exclusive content previews',
      'Progress tracking summaries'
    ],
    frequency: 'Weekly'
  },
  {
    id: 'sms',
    name: 'SMS Notifications',
    description: 'Get instant updates and daily motivation via text',
    icon: '📱',
    benefits: [
      'Daily motivation messages',
      'Tool completion reminders',
      'Webinar notifications',
      'Achievement celebrations'
    ],
    frequency: 'Daily'
  },
  {
    id: 'telegram',
    name: 'Telegram Channel',
    description: 'Join our exclusive community for real-time updates',
    icon: '💬',
    benefits: [
      'Real-time community updates',
      'Interactive discussions',
      'Live Q&A sessions',
      'Peer support network'
    ],
    frequency: 'Real-time'
  }
];

const memberBenefits = [
  'Save all assessment results permanently',
  'Track your progress over time',
  'Access personalized recommendations',
  'Receive continuous education content',
  'Get priority access to new tools',
  'Join exclusive webinars and events',
  'Connect with like-minded community',
  'Receive achievement badges and milestones'
];

export default function SoftMembershipRegistration() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['email']);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    telegram: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [registrationSource, setRegistrationSource] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const source = searchParams.get('source') || '';
    setRegistrationSource(source);
  }, [searchParams]);

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    if (step === 1) return selectedOptions.length > 0;
    if (step === 2) {
      if (selectedOptions.includes('email') && !contactInfo.email) return false;
      if (selectedOptions.includes('sms') && !contactInfo.phone) return false;
      if (selectedOptions.includes('telegram') && !contactInfo.telegram) return false;
      return true;
    }
    return true;
  };

  const handleRegistration = async () => {
    if (!validateStep()) return;
    
    setIsLoading(true);
    try {
      // Create or update user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert({
          id: user?.id || crypto.randomUUID(),
          email: contactInfo.email || user?.email,
          phone: selectedOptions.includes('sms') ? contactInfo.phone : null,
          telegram_handle: selectedOptions.includes('telegram') ? contactInfo.telegram : null,
          subscription_preferences: selectedOptions,
          user_tier: 'soft-member',
          membership_started_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (userError) throw userError;

      // Track membership registration
      await supabase
        .from('interactions')
        .insert({
          user_id: userData.id,
          interaction_type: 'soft_membership_registration',
          metadata: {
            subscription_options: selectedOptions,
            registration_source: registrationSource || 'membership_page'
          }
        });

      // Update lead score for membership registration
      await supabase
        .from('lead_scores')
        .upsert({
          user_id: userData.id,
          total_score: 70, // Minimum for soft member tier
          tier: 'soft-member',
          last_updated: new Date().toISOString()
        });

      router.push(`/membership/dashboard?welcome=true&source=${registrationSource}`);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <GalaxyDreamTeamLogo 
              variant="full" 
              size="large" 
              showTagline={true}
              className="justify-center"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Galaxy Dream Team
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {registrationSource === 'starter-pack' && 'Get instant access to our complete assessment suite and personalized action plans'}
            {registrationSource === 'masterclass' && 'Reserve your seat for our exclusive 90-minute live training with Q&A'}
            {registrationSource === 'office-visit' && 'Schedule your personal consultation and get a customized development plan'}
            {!registrationSource && 'Join our soft membership program and unlock your potential'}
          </p>
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-lg px-6 py-2">
              100% Free • No Payment Required
            </Badge>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-500' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-green-500' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Choose Subscription Options */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How would you like to receive your continuous education?
              </h2>
              <p className="text-gray-600">
                Choose one or more ways to stay connected with your growth journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {subscriptionOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    selectedOptions.includes(option.id)
                      ? 'ring-2 ring-green-500 bg-green-50'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleOptionToggle(option.id)}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{option.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {option.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {option.description}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {option.frequency}
                    </Badge>
                  </div>
                  
                  <ul className="space-y-2">
                    {option.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                onClick={() => setStep(2)}
                disabled={selectedOptions.length === 0}
                className="px-8 py-3 text-lg"
              >
                Continue to Contact Information
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Provide your contact information
              </h2>
              <p className="text-gray-600">
                We'll use this information to deliver your personalized content
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              {selectedOptions.includes('email') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              )}

              {selectedOptions.includes('sms') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+251 9XX XXX XXX"
                    required
                  />
                </div>
              )}

              {selectedOptions.includes('telegram') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telegram Handle *
                  </label>
                  <input
                    type="text"
                    value={contactInfo.telegram}
                    onChange={(e) => handleContactInfoChange('telegram', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="@yourusername"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
                className="px-6 py-2"
              >
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!validateStep()}
                className="px-8 py-3 text-lg"
              >
                Review & Complete
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Benefits */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                You're almost there!
              </h2>
              <p className="text-gray-600">
                Review your selections and discover what you'll get as a soft member
              </p>
            </div>

            {/* Review Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Subscription Preferences
              </h3>
              <div className="space-y-3">
                {selectedOptions.map(optionId => {
                  const option = subscriptionOptions.find(o => o.id === optionId);
                  return (
                    <div key={optionId} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{option?.icon}</span>
                        <div>
                          <div className="font-medium">{option?.name}</div>
                          <div className="text-sm text-gray-600">{option?.frequency}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">{option?.frequency}</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Member Benefits */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Soft Member Benefits
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {memberBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="text-center">
              <Button 
                onClick={handleRegistration}
                disabled={isLoading}
                className="px-12 py-4 text-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {isLoading ? 'Creating Your Membership...' : 'Complete Registration'}
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                By registering, you agree to receive educational content according to your preferences.
                You can unsubscribe at any time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
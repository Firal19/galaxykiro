'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '@/lib/contexts/auth-context';

export interface SoftMembershipData {
  id: string;
  user_tier: string;
  subscription_preferences: string[];
  notification_frequency: string;
  content_preferences: string[];
  membership_started_at: string;
  telegram_handle?: string;
  phone?: string;
}

export interface MembershipProgress {
  totalAssessments: number;
  completedAssessments: number;
  totalScore: number;
  tier: string;
  streakDays: number;
  lastActivity: string;
  engagementLevel: 'low' | 'medium' | 'high';
}

export interface PersonalizedRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'tool' | 'content' | 'webinar';
  priority: 'high' | 'medium' | 'low';
  link: string;
  reason: string;
}

export function useSoftMembership() {
  const [membershipData, setMembershipData] = useState<SoftMembershipData | null>(null);
  const [progress, setProgress] = useState<MembershipProgress | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadMembershipData();
    }
  }, [user]);

  const loadMembershipData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Load user membership data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      setMembershipData(userData);

      // Load progress data
      const progressData = await loadProgressData(user.id);
      setProgress(progressData);

      // Load personalized recommendations
      const recommendationsData = await loadRecommendations(user.id, progressData);
      setRecommendations(recommendationsData);

    } catch (err) {
      console.error('Error loading membership data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load membership data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgressData = async (userId: string): Promise<MembershipProgress> => {
    try {
      // Load assessment results
      const { data: assessments } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Load lead score
      const { data: leadScore } = await supabase
        .from('lead_scores')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Calculate streak days
      const streakDays = calculateStreakDays(assessments || []);

      // Determine engagement level
      const completedCount = assessments?.length || 0;
      const engagementLevel = completedCount >= 10 ? 'high' : 
                             completedCount >= 5 ? 'medium' : 'low';

      return {
        totalAssessments: 15, // Total available tools
        completedAssessments: completedCount,
        totalScore: leadScore?.total_score || 0,
        tier: leadScore?.tier || 'browser',
        streakDays,
        lastActivity: assessments?.[0]?.created_at || new Date().toISOString(),
        engagementLevel
      };
    } catch (error) {
      console.error('Error loading progress data:', error);
      return {
        totalAssessments: 15,
        completedAssessments: 0,
        totalScore: 0,
        tier: 'browser',
        streakDays: 0,
        lastActivity: new Date().toISOString(),
        engagementLevel: 'low'
      };
    }
  };

  const loadRecommendations = async (
    userId: string, 
    progressData: MembershipProgress
  ): Promise<PersonalizedRecommendation[]> => {
    try {
      const recommendations: PersonalizedRecommendation[] = [];

      // Recommend based on completion rate
      if (progressData.completedAssessments < 5) {
        recommendations.push({
          id: '1',
          title: 'Complete Your Potential Assessment',
          description: 'Discover your hidden potential with our comprehensive assessment',
          type: 'tool',
          priority: 'high',
          link: '/potential-assessment',
          reason: 'Essential first step in your growth journey'
        });
      }

      // Recommend based on tier
      if (progressData.tier === 'browser') {
        recommendations.push({
          id: '2',
          title: 'Join Our Next Webinar',
          description: 'Take the next step in your growth journey',
          type: 'webinar',
          priority: 'high',
          link: '/webinars',
          reason: 'Perfect for your current engagement level'
        });
      }

      // Content recommendations based on engagement level
      if (progressData.engagementLevel === 'high') {
        recommendations.push({
          id: '3',
          title: 'Schedule Office Visit',
          description: 'Ready for personalized guidance? Book a consultation',
          type: 'content',
          priority: 'high',
          link: '/office-visit-test',
          reason: 'Your high engagement shows readiness for next level'
        });
      } else {
        recommendations.push({
          id: '4',
          title: 'Explore Success Gap Content',
          description: 'Learn why some achieve their dreams while others just dream',
          type: 'content',
          priority: 'medium',
          link: '/success-gap/learn-more',
          reason: 'Build foundation knowledge for success'
        });
      }

      // Add streak-based recommendations
      if (progressData.streakDays >= 7) {
        recommendations.push({
          id: '5',
          title: 'Advanced Leadership Tools',
          description: 'Your consistency shows readiness for advanced content',
          type: 'tool',
          priority: 'medium',
          link: '/leadership-lever',
          reason: 'Reward for your consistent engagement'
        });
      }

      return recommendations.slice(0, 4); // Limit to 4 recommendations
    } catch (error) {
      console.error('Error loading recommendations:', error);
      return [];
    }
  };

  const calculateStreakDays = (assessments: any[]): number => {
    if (assessments.length === 0) return 0;
    
    const dates = assessments.map(a => new Date(a.created_at).toDateString());
    const uniqueDates = [...new Set(dates)].sort();
    
    let streak = 0;
    const today = new Date().toDateString();
    
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const daysDiff = Math.floor(
        (new Date(today).getTime() - new Date(uniqueDates[i]).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const updateSubscriptionPreferences = async (preferences: {
    subscription_preferences?: string[];
    notification_frequency?: string;
    content_preferences?: string[];
    phone?: string;
    telegram_handle?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Reload membership data
      await loadMembershipData();

      // Track preference update
      await supabase
        .from('interactions')
        .insert({
          user_id: user.id,
          interaction_type: 'preferences_updated',
          metadata: preferences
        });

      return { success: true };
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const registerSoftMembership = async (registrationData: {
    subscription_preferences: string[];
    phone?: string;
    telegram_handle?: string;
    content_preferences?: string[];
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...registrationData,
          user_tier: 'soft-member',
          membership_started_at: new Date().toISOString(),
          notification_frequency: 'weekly',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update lead score to soft member level
      await supabase
        .from('lead_scores')
        .upsert({
          user_id: user.id,
          total_score: Math.max(70, progress?.totalScore || 0), // Minimum for soft member
          tier: 'soft-member',
          last_updated: new Date().toISOString()
        });

      // Track membership registration
      await supabase
        .from('interactions')
        .insert({
          user_id: user.id,
          interaction_type: 'soft_membership_registration',
          metadata: {
            subscription_options: registrationData.subscription_preferences,
            registration_source: 'membership_registration'
          }
        });

      // Reload membership data
      await loadMembershipData();

      return { success: true };
    } catch (error) {
      console.error('Error registering soft membership:', error);
      throw error;
    }
  };

  const trackEngagement = async (engagementType: string, metadata?: any) => {
    if (!user) return;

    try {
      await supabase
        .from('interactions')
        .insert({
          user_id: user.id,
          interaction_type: engagementType,
          metadata: metadata || {}
        });

      // Update engagement score
      const scoreIncrease = getScoreIncrease(engagementType);
      if (scoreIncrease > 0) {
        const currentScore = progress?.totalScore || 0;
        const newScore = currentScore + scoreIncrease;

        await supabase
          .from('lead_scores')
          .upsert({
            user_id: user.id,
            total_score: newScore,
            tier: newScore >= 70 ? 'soft-member' : newScore >= 30 ? 'engaged' : 'browser',
            last_updated: new Date().toISOString()
          });

        // Reload progress to reflect changes
        const updatedProgress = await loadProgressData(user.id);
        setProgress(updatedProgress);
      }
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  };

  const getScoreIncrease = (engagementType: string): number => {
    const scoreMap: { [key: string]: number } = {
      'dashboard_visit': 1,
      'recommendation_click': 2,
      'content_view': 1,
      'tool_completion': 5,
      'webinar_registration': 10,
      'settings_update': 2
    };

    return scoreMap[engagementType] || 0;
  };

  const isSoftMember = () => {
    return membershipData?.user_tier === 'soft-member';
  };

  const canAccessFeature = (feature: string): boolean => {
    if (!membershipData) return false;

    const featureRequirements: { [key: string]: string[] } = {
      'saved_results': ['soft-member'],
      'progress_tracking': ['soft-member'],
      'personalized_recommendations': ['soft-member'],
      'continuous_education': ['soft-member'],
      'priority_access': ['soft-member'],
      'exclusive_webinars': ['soft-member']
    };

    const requiredTiers = featureRequirements[feature] || [];
    return requiredTiers.includes(membershipData.user_tier);
  };

  return {
    membershipData,
    progress,
    recommendations,
    isLoading,
    error,
    isSoftMember: isSoftMember(),
    canAccessFeature,
    updateSubscriptionPreferences,
    registerSoftMembership,
    trackEngagement,
    refreshData: loadMembershipData
  };
}
import { supabase } from './supabase';

export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  content_type: 'article' | 'video' | 'tool' | 'webinar' | 'guide';
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: number; // in minutes
  tags: string[];
  content_url?: string;
  thumbnail_url?: string;
  created_at: string;
  engagement_score: number;
  completion_rate: number;
}

export interface PersonalizedRecommendation {
  content: EducationalContent;
  relevance_score: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UserEngagementPattern {
  user_id: string;
  preferred_content_types: string[];
  preferred_categories: string[];
  preferred_time_slots: string[];
  engagement_frequency: 'daily' | 'weekly' | 'monthly';
  completion_rate: number;
  last_activity: string;
}

export class ContinuousEducationEngine {
  
  /**
   * Generate personalized content recommendations based on user behavior and preferences
   */
  static async generatePersonalizedRecommendations(
    userId: string, 
    limit: number = 10
  ): Promise<PersonalizedRecommendation[]> {
    try {
      // Get user profile and preferences
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      // Get user's engagement patterns
      const engagementPattern = await this.analyzeUserEngagementPattern(userId);
      
      // Get user's assessment results to understand interests
      const { data: assessmentResults } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Get user's content consumption history
      const { data: contentHistory } = await supabase
        .from('content_engagement')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Get available educational content
      const { data: availableContent } = await supabase
        .from('educational_content')
        .select('*')
        .eq('is_active', true)
        .order('engagement_score', { ascending: false });

      if (!availableContent) return [];

      // Generate recommendations based on multiple factors
      const recommendations: PersonalizedRecommendation[] = [];

      for (const content of availableContent) {
        const relevanceScore = this.calculateRelevanceScore(
          content,
          userProfile,
          engagementPattern,
          assessmentResults || [],
          contentHistory || []
        );

        if (relevanceScore > 0.3) { // Minimum relevance threshold
          recommendations.push({
            content,
            relevance_score: relevanceScore,
            reason: this.generateRecommendationReason(content, userProfile, engagementPattern),
            priority: relevanceScore > 0.7 ? 'high' : relevanceScore > 0.5 ? 'medium' : 'low'
          });
        }
      }

      // Sort by relevance score and return top recommendations
      return recommendations
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, limit);

    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      return [];
    }
  }

  /**
   * Analyze user engagement patterns to understand preferences
   */
  static async analyzeUserEngagementPattern(userId: string): Promise<UserEngagementPattern> {
    try {
      // Get user interactions
      const { data: interactions } = await supabase
        .from('interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      // Get content engagement
      const { data: contentEngagement } = await supabase
        .from('content_engagement')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      // Get tool usage
      const { data: toolUsage } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      // Analyze patterns
      const preferredContentTypes = this.extractPreferredContentTypes(contentEngagement || []);
      const preferredCategories = this.extractPreferredCategories(interactions || [], toolUsage || []);
      const preferredTimeSlots = this.extractPreferredTimeSlots(interactions || []);
      const engagementFrequency = this.calculateEngagementFrequency(interactions || []);
      const completionRate = this.calculateCompletionRate(toolUsage || []);

      return {
        user_id: userId,
        preferred_content_types: preferredContentTypes,
        preferred_categories: preferredCategories,
        preferred_time_slots: preferredTimeSlots,
        engagement_frequency: engagementFrequency,
        completion_rate: completionRate,
        last_activity: interactions?.[0]?.created_at || new Date().toISOString()
      };

    } catch (error) {
      console.error('Error analyzing engagement pattern:', error);
      return {
        user_id: userId,
        preferred_content_types: [],
        preferred_categories: [],
        preferred_time_slots: [],
        engagement_frequency: 'weekly',
        completion_rate: 0,
        last_activity: new Date().toISOString()
      };
    }
  }

  /**
   * Calculate relevance score for content based on user data
   */
  private static calculateRelevanceScore(
    content: EducationalContent,
    userProfile: any,
    engagementPattern: UserEngagementPattern,
    assessmentResults: any[],
    contentHistory: any[]
  ): number {
    let score = 0;

    // Base score from content quality
    score += content.engagement_score * 0.2;

    // Content type preference
    if (engagementPattern.preferred_content_types.includes(content.content_type)) {
      score += 0.3;
    }

    // Category preference
    if (engagementPattern.preferred_categories.includes(content.category)) {
      score += 0.25;
    }

    // User's content preferences from profile
    if (userProfile?.content_preferences?.includes(content.category)) {
      score += 0.2;
    }

    // Difficulty level matching (based on user's completion rate)
    const userLevel = engagementPattern.completion_rate > 0.8 ? 'advanced' : 
                     engagementPattern.completion_rate > 0.5 ? 'intermediate' : 'beginner';
    if (content.difficulty_level === userLevel) {
      score += 0.15;
    }

    // Penalize if user has already consumed this content
    const alreadyConsumed = contentHistory.some(h => h.content_id === content.id);
    if (alreadyConsumed) {
      score -= 0.5;
    }

    // Boost score for trending content
    const daysSinceCreated = Math.floor(
      (new Date().getTime() - new Date(content.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreated <= 7) {
      score += 0.1; // New content boost
    }

    // Normalize score to 0-1 range
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Generate human-readable reason for recommendation
   */
  private static generateRecommendationReason(
    content: EducationalContent,
    userProfile: any,
    engagementPattern: UserEngagementPattern
  ): string {
    const reasons = [];

    if (engagementPattern.preferred_categories.includes(content.category)) {
      reasons.push(`matches your interest in ${content.category}`);
    }

    if (userProfile?.content_preferences?.includes(content.category)) {
      reasons.push('aligns with your selected preferences');
    }

    if (engagementPattern.preferred_content_types.includes(content.content_type)) {
      reasons.push(`you enjoy ${content.content_type} content`);
    }

    if (content.engagement_score > 0.8) {
      reasons.push('highly rated by other users');
    }

    const daysSinceCreated = Math.floor(
      (new Date().getTime() - new Date(content.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreated <= 7) {
      reasons.push('newly published content');
    }

    return reasons.length > 0 
      ? `Recommended because it ${reasons.slice(0, 2).join(' and ')}`
      : 'Recommended based on your activity patterns';
  }

  /**
   * Extract preferred content types from engagement data
   */
  private static extractPreferredContentTypes(contentEngagement: any[]): string[] {
    const typeCount: { [key: string]: number } = {};
    
    contentEngagement.forEach(engagement => {
      const type = engagement.content_type || 'article';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return Object.entries(typeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
  }

  /**
   * Extract preferred categories from user interactions
   */
  private static extractPreferredCategories(interactions: any[], toolUsage: any[]): string[] {
    const categoryCount: { [key: string]: number } = {};

    // From tool usage
    toolUsage.forEach(usage => {
      const category = this.mapToolToCategory(usage.tool_name);
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 2; // Higher weight for tools
      }
    });

    // From interactions
    interactions.forEach(interaction => {
      if (interaction.metadata?.category) {
        const category = interaction.metadata.category;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });

    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);
  }

  /**
   * Extract preferred time slots from interaction timestamps
   */
  private static extractPreferredTimeSlots(interactions: any[]): string[] {
    const hourCount: { [key: number]: number } = {};

    interactions.forEach(interaction => {
      const hour = new Date(interaction.created_at).getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });

    const topHours = Object.entries(hourCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    return topHours.map(hour => {
      if (hour >= 6 && hour < 12) return 'morning';
      if (hour >= 12 && hour < 18) return 'afternoon';
      if (hour >= 18 && hour < 22) return 'evening';
      return 'night';
    });
  }

  /**
   * Calculate user's engagement frequency
   */
  private static calculateEngagementFrequency(interactions: any[]): 'daily' | 'weekly' | 'monthly' {
    if (interactions.length === 0) return 'weekly';

    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailyInteractions = interactions.filter(i => new Date(i.created_at) > dayAgo).length;
    const weeklyInteractions = interactions.filter(i => new Date(i.created_at) > weekAgo).length;

    if (dailyInteractions >= 3) return 'daily';
    if (weeklyInteractions >= 10) return 'weekly';
    return 'monthly';
  }

  /**
   * Calculate completion rate from tool usage
   */
  private static calculateCompletionRate(toolUsage: any[]): number {
    if (toolUsage.length === 0) return 0;

    const totalCompletionRate = toolUsage.reduce((sum, usage) => sum + (usage.completion_rate || 0), 0);
    return totalCompletionRate / toolUsage.length;
  }

  /**
   * Map tool names to content categories
   */
  private static mapToolToCategory(toolName: string): string | null {
    const categoryMap: { [key: string]: string } = {
      'potential-assessment': 'Personal Development',
      'success-factor-calculator': 'Goal Setting',
      'habit-strength-analyzer': 'Habit Formation',
      'leadership-style-identifier': 'Leadership',
      'future-self-visualizer': 'Goal Setting',
      'cost-of-inaction-calculator': 'Decision Making'
    };

    return categoryMap[toolName] || null;
  }

  /**
   * Schedule content delivery based on user preferences
   */
  static async scheduleContentDelivery(userId: string): Promise<void> {
    try {
      const engagementPattern = await this.analyzeUserEngagementPattern(userId);
      const recommendations = await this.generatePersonalizedRecommendations(userId, 5);

      // Get user's subscription preferences
      const { data: userProfile } = await supabase
        .from('users')
        .select('subscription_preferences, notification_frequency')
        .eq('id', userId)
        .single();

      if (!userProfile?.subscription_preferences) return;

      // Schedule delivery based on preferences
      const deliverySchedule = {
        user_id: userId,
        content_recommendations: recommendations,
        delivery_channels: userProfile.subscription_preferences,
        frequency: userProfile.notification_frequency || 'weekly',
        next_delivery: this.calculateNextDeliveryTime(
          userProfile.notification_frequency || 'weekly',
          engagementPattern.preferred_time_slots
        ),
        created_at: new Date().toISOString()
      };

      // Store delivery schedule
      await supabase
        .from('content_delivery_schedule')
        .upsert(deliverySchedule);

    } catch (error) {
      console.error('Error scheduling content delivery:', error);
    }
  }

  /**
   * Calculate next delivery time based on frequency and preferred time slots
   */
  private static calculateNextDeliveryTime(
    frequency: string, 
    preferredTimeSlots: string[]
  ): string {
    const now = new Date();
    let nextDelivery = new Date(now);

    // Set preferred hour
    const preferredHour = preferredTimeSlots.includes('morning') ? 9 :
                         preferredTimeSlots.includes('afternoon') ? 14 :
                         preferredTimeSlots.includes('evening') ? 19 : 10;

    nextDelivery.setHours(preferredHour, 0, 0, 0);

    // Adjust based on frequency
    switch (frequency) {
      case 'daily':
        if (nextDelivery <= now) {
          nextDelivery.setDate(nextDelivery.getDate() + 1);
        }
        break;
      case 'weekly':
        nextDelivery.setDate(nextDelivery.getDate() + (7 - nextDelivery.getDay() + 1)); // Next Monday
        break;
      case 'monthly':
        nextDelivery.setMonth(nextDelivery.getMonth() + 1, 1); // First of next month
        break;
    }

    return nextDelivery.toISOString();
  }

  /**
   * Track content engagement for improving recommendations
   */
  static async trackContentEngagement(
    userId: string,
    contentId: string,
    engagementType: 'view' | 'click' | 'complete' | 'share',
    metadata?: any
  ): Promise<void> {
    try {
      await supabase
        .from('content_engagement')
        .insert({
          user_id: userId,
          content_id: contentId,
          engagement_type: engagementType,
          metadata: metadata || {},
          created_at: new Date().toISOString()
        });

      // Update user's engagement score
      await this.updateUserEngagementScore(userId, engagementType);

    } catch (error) {
      console.error('Error tracking content engagement:', error);
    }
  }

  /**
   * Update user's engagement score based on activity
   */
  private static async updateUserEngagementScore(
    userId: string, 
    engagementType: string
  ): Promise<void> {
    const scoreMap = {
      'view': 1,
      'click': 2,
      'complete': 5,
      'share': 3
    };

    const points = scoreMap[engagementType as keyof typeof scoreMap] || 1;

    try {
      const { data: currentScore } = await supabase
        .from('lead_scores')
        .select('total_score')
        .eq('user_id', userId)
        .single();

      const newScore = (currentScore?.total_score || 0) + points;

      await supabase
        .from('lead_scores')
        .upsert({
          user_id: userId,
          total_score: newScore,
          tier: newScore >= 70 ? 'soft-member' : newScore >= 30 ? 'engaged' : 'browser',
          last_updated: new Date().toISOString()
        });

    } catch (error) {
      console.error('Error updating engagement score:', error);
    }
  }
}
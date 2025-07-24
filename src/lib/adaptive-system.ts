/**
 * Adaptive Question System for Revolutionary PQC
 * Intelligently adjusts assessment flow based on user engagement and energy levels
 */

export interface EngagementMetrics {
  userEnergyLevel: number;
  averageResponseTime: number;
  interactionQuality: number;
  preferredInteractionTypes: string[];
  attentionSpan: number;
  fatigueLevel: number;
  engagementTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface AdaptiveRecommendation {
  type: 'interaction_type' | 'break' | 'pace_adjustment' | 'encouragement';
  action: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export class AdaptiveQuestionSystem {
  private static readonly OPTIMAL_RESPONSE_TIME = 15000; // 15 seconds
  private static readonly FATIGUE_THRESHOLD = 30; // Energy below 30%
  private static readonly ATTENTION_SPAN_WINDOW = 5; // Last 5 questions
  
  /**
   * Analyzes user engagement patterns and recommends adaptations
   */
  static analyzeEngagement(
    metrics: EngagementMetrics,
    questionHistory: Array<{
      responseTime: number;
      interactionType: string;
      quality: number;
      timestamp: Date;
    }>
  ): AdaptiveRecommendation[] {
    const recommendations: AdaptiveRecommendation[] = [];
    
    // Check for fatigue
    if (metrics.userEnergyLevel < this.FATIGUE_THRESHOLD) {
      recommendations.push({
        type: 'break',
        action: 'suggest_energy_break',
        reason: `Energy level at ${metrics.userEnergyLevel}% - user needs rejuvenation`,
        priority: 'high'
      });
    }
    
    // Check response time patterns
    if (metrics.averageResponseTime > this.OPTIMAL_RESPONSE_TIME * 2) {
      recommendations.push({
        type: 'interaction_type',
        action: 'switch_to_faster_interactions',
        reason: 'Response times indicate cognitive overload',
        priority: 'high'
      });
    }
    
    // Check for declining attention
    const recentQuestions = questionHistory.slice(-this.ATTENTION_SPAN_WINDOW);
    const qualityTrend = this.calculateQualityTrend(recentQuestions);
    
    if (qualityTrend === 'declining') {
      recommendations.push({
        type: 'encouragement',
        action: 'show_progress_celebration',
        reason: 'Interaction quality declining - user needs motivation',
        priority: 'medium'
      });
    }
    
    // Suggest optimal interaction types
    const optimalType = this.suggestOptimalInteractionType(metrics, questionHistory);
    if (optimalType) {
      recommendations.push({
        type: 'interaction_type',
        action: `prefer_${optimalType}`,
        reason: `User shows high engagement with ${optimalType} interactions`,
        priority: 'low'
      });
    }
    
    return recommendations;
  }
  
  /**
   * Calculates the optimal interaction type based on user preferences and energy
   */
  static suggestOptimalInteractionType(
    metrics: EngagementMetrics,
    questionHistory: Array<{ interactionType: string; quality: number }>
  ): string | null {
    // Analyze performance by interaction type
    const typePerformance: Record<string, { total: number; count: number; average: number }> = {};
    
    questionHistory.forEach(q => {
      if (!typePerformance[q.interactionType]) {
        typePerformance[q.interactionType] = { total: 0, count: 0, average: 0 };
      }
      typePerformance[q.interactionType].total += q.quality;
      typePerformance[q.interactionType].count += 1;
    });
    
    // Calculate averages
    Object.keys(typePerformance).forEach(type => {
      const perf = typePerformance[type];
      perf.average = perf.total / perf.count;
    });
    
    // Find best performing type with sufficient data
    const minSamples = 2;
    const bestType = Object.entries(typePerformance)
      .filter(([_, perf]) => perf.count >= minSamples)
      .sort(([_, a], [__, b]) => b.average - a.average)[0];
    
    return bestType ? bestType[0] : null;
  }
  
  /**
   * Determines if user needs an energy break
   */
  static shouldTriggerEnergyBreak(
    metrics: EngagementMetrics,
    questionIndex: number,
    lastBreakIndex: number
  ): boolean {
    // Standard mid-assessment break
    if (questionIndex === 25) return true;
    
    // Adaptive breaks based on fatigue
    if (metrics.userEnergyLevel < 40 && questionIndex - lastBreakIndex > 10) {
      return true;
    }
    
    // Break for consistently poor interaction quality
    if (metrics.interactionQuality < 60 && questionIndex - lastBreakIndex > 7) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Calculates personalized encouragement messages
   */
  static generateEncouragement(metrics: EngagementMetrics, progress: number): string {
    const progressMessages = [
      "You're making incredible progress! Your self-awareness is growing with each question.",
      "Amazing insights emerging! You're in the top 10% of people who complete assessments like this.",
      "Your thoughtful responses show real emotional intelligence. Keep going!",
      "You're unlocking deeper self-knowledge with every answer. This is powerful work.",
      "Your engagement level is inspiring! You're clearly committed to growth."
    ];
    
    const energyMessages = [
      "Take your time - there's no rush. Your authentic responses are what matter most.",
      "You're doing great! Consider taking a deep breath and continuing at your own pace.",
      "Your persistence is admirable. Each question brings you closer to valuable insights.",
      "Quality over speed - your thoughtful approach will yield better results."
    ];
    
    if (metrics.userEnergyLevel < 50) {
      return energyMessages[Math.floor(Math.random() * energyMessages.length)];
    }
    
    return progressMessages[Math.floor(Math.random() * progressMessages.length)];
  }
  
  /**
   * Adjusts question difficulty based on user state
   */
  static adjustQuestionComplexity(
    metrics: EngagementMetrics,
    baseComplexity: 'simple' | 'moderate' | 'complex'
  ): 'simple' | 'moderate' | 'complex' {
    // Reduce complexity if user is fatigued
    if (metrics.userEnergyLevel < 40 || metrics.interactionQuality < 60) {
      if (baseComplexity === 'complex') return 'moderate';
      if (baseComplexity === 'moderate') return 'simple';
    }
    
    // Increase complexity if user is highly engaged
    if (metrics.userEnergyLevel > 80 && metrics.interactionQuality > 85) {
      if (baseComplexity === 'simple') return 'moderate';
      if (baseComplexity === 'moderate') return 'complex';
    }
    
    return baseComplexity;
  }
  
  /**
   * Calculates trend in interaction quality
   */
  private static calculateQualityTrend(
    recentQuestions: Array<{ quality: number }>
  ): 'improving' | 'declining' | 'stable' {
    if (recentQuestions.length < 3) return 'stable';
    
    const first = recentQuestions.slice(0, Math.floor(recentQuestions.length / 2));
    const second = recentQuestions.slice(Math.floor(recentQuestions.length / 2));
    
    const firstAvg = first.reduce((sum, q) => sum + q.quality, 0) / first.length;
    const secondAvg = second.reduce((sum, q) => sum + q.quality, 0) / second.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 10) return 'improving';
    if (difference < -10) return 'declining';
    return 'stable';
  }
  
  /**
   * Predicts optimal assessment duration based on user patterns
   */
  static predictOptimalDuration(metrics: EngagementMetrics): number {
    const baseTime = 15; // 15 minutes baseline
    
    // Adjust based on response speed
    const speedFactor = metrics.averageResponseTime / this.OPTIMAL_RESPONSE_TIME;
    const timeAdjustment = Math.max(0.7, Math.min(1.5, speedFactor));
    
    // Adjust based on energy level
    const energyFactor = metrics.userEnergyLevel / 100;
    const energyAdjustment = Math.max(0.8, Math.min(1.2, 1 + (1 - energyFactor) * 0.3));
    
    return Math.round(baseTime * timeAdjustment * energyAdjustment);
  }
  
  /**
   * Generates personalized tips for completing the assessment
   */
  static generatePersonalizedTips(metrics: EngagementMetrics): string[] {
    const tips: string[] = [];
    
    if (metrics.averageResponseTime > this.OPTIMAL_RESPONSE_TIME * 1.5) {
      tips.push("Trust your instincts - your first response is often the most authentic.");
    }
    
    if (metrics.userEnergyLevel < 60) {
      tips.push("Consider taking short breaks between sections to maintain focus.");
    }
    
    if (metrics.interactionQuality > 85) {
      tips.push("Your engagement level is excellent! You're getting maximum value from this assessment.");
    }
    
    tips.push("Remember: there are no right or wrong answers, only authentic insights about yourself.");
    
    return tips;
  }
}

/**
 * Real-time engagement tracking utility
 */
export class EngagementTracker {
  private questionHistory: Array<{
    questionId: string;
    responseTime: number;
    interactionType: string;
    quality: number;
    timestamp: Date;
  }> = [];
  
  private energyHistory: number[] = [];
  private qualityHistory: number[] = [];
  
  /**
   * Records a question response for analysis
   */
  recordResponse(
    questionId: string,
    responseTime: number,
    interactionType: string,
    quality: number
  ) {
    this.questionHistory.push({
      questionId,
      responseTime,
      interactionType,
      quality,
      timestamp: new Date()
    });
    
    this.qualityHistory.push(quality);
    if (this.qualityHistory.length > 10) {
      this.qualityHistory.shift(); // Keep only last 10
    }
  }
  
  /**
   * Updates user energy level
   */
  updateEnergyLevel(energyLevel: number) {
    this.energyHistory.push(energyLevel);
    if (this.energyHistory.length > 20) {
      this.energyHistory.shift(); // Keep only last 20
    }
  }
  
  /**
   * Gets current engagement metrics
   */
  getCurrentMetrics(): EngagementMetrics {
    const averageResponseTime = this.questionHistory.length > 0
      ? this.questionHistory.reduce((sum, q) => sum + q.responseTime, 0) / this.questionHistory.length
      : 0;
    
    const averageQuality = this.qualityHistory.length > 0
      ? this.qualityHistory.reduce((sum, q) => sum + q, 0) / this.qualityHistory.length
      : 100;
    
    const currentEnergy = this.energyHistory.length > 0
      ? this.energyHistory[this.energyHistory.length - 1]
      : 100;
    
    const engagementTrend = this.calculateEngagementTrend();
    
    return {
      userEnergyLevel: currentEnergy,
      averageResponseTime,
      interactionQuality: averageQuality,
      preferredInteractionTypes: this.getPreferredInteractionTypes(),
      attentionSpan: this.calculateAttentionSpan(),
      fatigueLevel: 100 - currentEnergy,
      engagementTrend
    };
  }
  
  /**
   * Calculates attention span based on response patterns
   */
  private calculateAttentionSpan(): number {
    if (this.questionHistory.length < 5) return 100;
    
    const recentQuestions = this.questionHistory.slice(-5);
    const qualityVariance = this.calculateVariance(recentQuestions.map(q => q.quality));
    
    // Lower variance = better attention span
    return Math.max(50, 100 - qualityVariance * 2);
  }
  
  /**
   * Identifies preferred interaction types
   */
  private getPreferredInteractionTypes(): string[] {
    const typePerformance: Record<string, number[]> = {};
    
    this.questionHistory.forEach(q => {
      if (!typePerformance[q.interactionType]) {
        typePerformance[q.interactionType] = [];
      }
      typePerformance[q.interactionType].push(q.quality);
    });
    
    const typeAverages = Object.entries(typePerformance)
      .map(([type, qualities]) => ({
        type,
        average: qualities.reduce((sum, q) => sum + q, 0) / qualities.length,
        count: qualities.length
      }))
      .filter(item => item.count >= 2) // Need at least 2 samples
      .sort((a, b) => b.average - a.average);
    
    return typeAverages.slice(0, 3).map(item => item.type);
  }
  
  /**
   * Calculates engagement trend
   */
  private calculateEngagementTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.qualityHistory.length < 4) return 'stable';
    
    const first = this.qualityHistory.slice(0, Math.floor(this.qualityHistory.length / 2));
    const second = this.qualityHistory.slice(Math.floor(this.qualityHistory.length / 2));
    
    const firstAvg = first.reduce((sum, q) => sum + q, 0) / first.length;
    const secondAvg = second.reduce((sum, q) => sum + q, 0) / second.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 5) return 'increasing';
    if (difference < -5) return 'decreasing';
    return 'stable';
  }
  
  /**
   * Calculates variance in a set of numbers
   */
  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const squaredDifferences = numbers.map(n => Math.pow(n - mean, 2));
    return squaredDifferences.reduce((sum, sq) => sum + sq, 0) / numbers.length;
  }
  
  /**
   * Gets detailed analytics for dashboard
   */
  getAnalytics() {
    return {
      totalQuestions: this.questionHistory.length,
      averageResponseTime: this.getCurrentMetrics().averageResponseTime,
      interactionTypeBreakdown: this.getInteractionTypeBreakdown(),
      qualityTrend: this.qualityHistory,
      energyTrend: this.energyHistory,
      recommendations: AdaptiveQuestionSystem.analyzeEngagement(
        this.getCurrentMetrics(),
        this.questionHistory
      )
    };
  }
  
  /**
   * Gets breakdown of interaction types used
   */
  private getInteractionTypeBreakdown(): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    this.questionHistory.forEach(q => {
      breakdown[q.interactionType] = (breakdown[q.interactionType] || 0) + 1;
    });
    
    return breakdown;
  }
}
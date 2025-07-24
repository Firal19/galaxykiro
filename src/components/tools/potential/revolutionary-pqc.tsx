"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHydration } from '@/hooks/use-hydration';
import { 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Share2,
  Download,
  Clock,
  Trophy,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Import Zustand store hooks
import { 
  usePQCAssessment,
  usePQCStage,
  usePQCCurrentQuestion,
  usePQCCurrentDimension,
  usePQCAnswers,
  usePQCResult,
  usePQCEngagementMetrics,
  usePQCAdaptiveRecommendations,
  usePQCShowAdaptiveMessage,
  usePQCActions,
  usePQCProgress,
  usePQCTotalQuestions
} from '@/lib/store';

import { 
  dimensions, 
  questions, 
  potentialLevels,
  getPotentialLevel,
  getDimensionById,
  type Question,
  type LocalizedString,
  type PotentialLevel,
  type PotentialDimension
} from '@/lib/data/pqc-data';

import { 
  AdaptiveQuestionSystem, 
  EngagementTracker,
  type EngagementMetrics,
  type AdaptiveRecommendation
} from '@/lib/adaptive-system';

// Import interaction components
import { EmojiSliderQuestion } from './interactions/EmojiSliderQuestion';
import { WordCloudQuestion } from './interactions/WordCloudQuestion';
import { SectionIntroCard } from './interactions/SectionIntroCard';
import { EnergyBoostBreak } from './interactions/EnergyBoostBreak';

// Import main components
import { IntroScreen } from './components/IntroScreen';
import { AssessmentFlow } from './components/AssessmentFlow';
import { ProcessingAnimation } from './components/ProcessingAnimation';
import { ResultsDashboard } from './components/ResultsDashboard';

// Types
interface Answer {
  questionId: string;
  value: any;
  timeSpent: number;
  timestamp: Date;
  interactionQuality: number;
  responseTime: number;
}

interface PQCResult {
  overallScore: number;
  dimensionScores: Record<string, number>;
  insights: Insight[];
  recommendations: Recommendation[];
  percentile: number;
  potentialLevel: PotentialLevel;
  growthTrajectory: string;
  shareLink?: string;
  totalPoints: number;
  achievements: Achievement[];
}

interface Insight {
  type: 'strength' | 'opportunity' | 'pattern';
  title: string;
  description: string;
  icon: string;
}

interface Recommendation {
  type: 'priority' | 'quick_win' | 'development_plan' | 'resources';
  urgency: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actions?: string[];
  timeRequired?: string;
  expectedImpact?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface EngagementMetrics {
  userEnergyLevel: number;
  averageResponseTime: number;
  interactionQuality: number;
  preferredInteractionTypes: string[];
}

type AssessmentStage = 'intro' | 'section-intro' | 'assessment' | 'energy-boost' | 'processing' | 'results';

export function RevolutionaryPQC() {
  const hydrated = useHydration();
  
  // Always call Zustand hooks (never conditional) to follow Rules of Hooks
  const storeStage = usePQCStage();
  const storeAnswers = usePQCAnswers();
  const storeCurrentQuestion = usePQCCurrentQuestion();
  const storeCurrentDimension = usePQCCurrentDimension();
  const storeResult = usePQCResult();
  const storeEngagementMetrics = usePQCEngagementMetrics();
  const storeAdaptiveRecommendations = usePQCAdaptiveRecommendations();
  const storeShowAdaptiveMessage = usePQCShowAdaptiveMessage();
  const storeProgress = usePQCProgress();
  const totalQuestions = usePQCTotalQuestions();
  const storePqcAssessment = usePQCAssessment();
  const storeActions = usePQCActions();
  
  // Use fallback values only if not hydrated
  const stage = hydrated ? storeStage : 'intro';
  const answers = hydrated ? storeAnswers : new Map();
  const currentQuestion = hydrated ? storeCurrentQuestion : 0;
  const currentDimension = hydrated ? storeCurrentDimension : 0;
  const result = hydrated ? storeResult : null;
  const engagementMetrics = hydrated ? storeEngagementMetrics : {
    userEnergyLevel: 100,
    averageResponseTime: 0,
    interactionQuality: 100,
    preferredInteractionTypes: [],
    attentionSpan: 100,
    fatigueLevel: 0,
    engagementTrend: 'stable' as const
  };
  const adaptiveRecommendations = hydrated ? storeAdaptiveRecommendations : [];
  const showAdaptiveMessage = hydrated ? storeShowAdaptiveMessage : null;
  const progress = hydrated ? storeProgress : 0;
  const pqcAssessment = hydrated ? storePqcAssessment : null;
  
  const actions = hydrated ? storeActions : {
    setPQCStage: () => {},
    setPQCCurrentQuestion: () => {},
    setPQCCurrentDimension: () => {},
    addPQCAnswer: () => {},
    setPQCResult: () => {},
    setPQCStartTime: () => {},
    setPQCQuestionStartTime: () => {},
    setPQCLanguage: () => {},
    updatePQCEngagementMetrics: () => {},
    setPQCAdaptiveRecommendations: () => {},
    setPQCLastBreakIndex: () => {},
    setPQCShowAdaptiveMessage: () => {},
    resetPQCAssessment: () => {}
  };
  
  const {
    setPQCStage,
    setPQCCurrentQuestion,
    setPQCCurrentDimension,
    addPQCAnswer,
    setPQCResult,
    setPQCStartTime,
    setPQCQuestionStartTime,
    setPQCLanguage,
    updatePQCEngagementMetrics,
    setPQCAdaptiveRecommendations,
    setPQCLastBreakIndex,
    setPQCShowAdaptiveMessage,
    resetPQCAssessment
  } = actions;
  
  const [currentLanguage] = useState<'en' | 'am'>('en');
  const [engagementTracker] = useState(() => new EngagementTracker());
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);

  // Cognitive Load Management
  const getQuestionDistribution = () => {
    return {
      warmUp: questions.slice(0, 7),
      deepDive: questions.slice(7, 42),
      integration: questions.slice(42, 49)
    };
  };

  const shouldShowEnergyBoost = useCallback(() => {
    if (stage !== 'assessment') return false;
    
    const metrics = engagementTracker.getCurrentMetrics();
    return AdaptiveQuestionSystem.shouldTriggerEnergyBreak(
      metrics, 
      currentQuestion, 
      pqcAssessment?.lastBreakIndex || -1
    );
  }, [currentQuestion, stage, engagementTracker, pqcAssessment]);

  const shouldShowSectionIntro = useCallback(() => {
    return currentQuestion % 7 === 0 && stage === 'assessment';
  }, [currentQuestion, stage]);

  // Answer Handling
  const handleAnswer = useCallback((questionId: string, value: any) => {
    const timeSpent = questionStartTime ? Date.now() - questionStartTime.getTime() : 0;
    const currentQuestionData = questions[currentQuestion];
    
    const answer: Answer = {
      questionId,
      value,
      timeSpent,
      timestamp: new Date(),
      interactionQuality: calculateInteractionQuality(timeSpent),
      responseTime: timeSpent
    };
    
    addPQCAnswer(questionId, answer);
    
    // Record response in adaptive system
    engagementTracker.recordResponse(
      questionId,
      timeSpent,
      currentQuestionData.interactionType,
      answer.interactionQuality
    );
    
    // Update energy level in tracker
    const newEnergyLevel = Math.max(50, 100 - (currentQuestion * 1.2) + (answer.interactionQuality - 50) * 0.5);
    engagementTracker.updateEnergyLevel(newEnergyLevel);
    
    // Get adaptive recommendations
    const metrics = engagementTracker.getCurrentMetrics();
    const recommendations = AdaptiveQuestionSystem.analyzeEngagement(
      metrics,
      engagementTracker.getAnalytics().totalQuestions > 0 ? 
        [{ interactionType: currentQuestionData.interactionType, quality: answer.interactionQuality, responseTime: timeSpent, timestamp: new Date() }] : 
        []
    );
    
    setPQCAdaptiveRecommendations(recommendations);
    
    // Show adaptive messages for high priority recommendations
    const highPriorityRec = recommendations.find(r => r.priority === 'high');
    if (highPriorityRec && highPriorityRec.type === 'encouragement') {
      setPQCShowAdaptiveMessage(AdaptiveQuestionSystem.generateEncouragement(metrics, (currentQuestion / questions.length) * 100));
    }
    
    // Auto-advance based on interaction type
    setTimeout(() => {
      navigateToNext();
    }, 1000);
  }, [questionStartTime, currentQuestion, engagementTracker]);

  const calculateInteractionQuality = (timeSpent: number): number => {
    // Optimal response time between 10-60 seconds
    if (timeSpent < 5000) return 60; // Too fast
    if (timeSpent > 120000) return 70; // Too slow
    if (timeSpent >= 10000 && timeSpent <= 60000) return 100; // Optimal
    return 85; // Good
  };


  // Navigation
  const navigateToNext = useCallback(() => {
    if (shouldShowEnergyBoost()) {
      setPQCStage('energy-boost');
      setPQCLastBreakIndex(currentQuestion);
      return;
    }

    if (shouldShowSectionIntro()) {
      setPQCCurrentDimension(Math.floor(currentQuestion / 7));
      setPQCStage('section-intro');
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setPQCCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(new Date());
      
      // Clear adaptive messages after moving to next question
      if (showAdaptiveMessage) {
        setTimeout(() => setPQCShowAdaptiveMessage(null), 3000);
      }
    } else {
      handleComplete();
    }
  }, [currentQuestion, shouldShowEnergyBoost, shouldShowSectionIntro, showAdaptiveMessage, setPQCStage, setPQCLastBreakIndex, setPQCCurrentDimension, setPQCCurrentQuestion, setPQCShowAdaptiveMessage]);

  const navigateToPrevious = () => {
    if (currentQuestion > 0) {
      setPQCCurrentQuestion(currentQuestion - 1);
      setQuestionStartTime(new Date());
      setPQCStage('assessment');
    }
  };

  const handleComplete = async () => {
    setPQCStage('processing');
    
    setTimeout(() => {
      const calculatedResult = calculateResult(answers);
      setPQCResult(calculatedResult);
      setPQCStage('results');
    }, 4000);
  };

  const resetAssessment = () => {
    resetPQCAssessment();
    setQuestionStartTime(null);
    // Note: engagementTracker resets automatically with new instance
  };

  const calculateResult = (answers: Map<string, Answer>): PQCResult => {
    const dimensionScores: Record<string, number> = {};
    const dimensionCounts: Record<string, number> = {};
    
    dimensions.forEach(dim => {
      dimensionScores[dim.id] = 0;
      dimensionCounts[dim.id] = 0;
    });
    
    answers.forEach((answer, questionId) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;
      
      let score = 0;
      
      switch (question.scoring.type) {
        case 'direct':
          score = (answer.value / question.scoring.maxPoints) * 100;
          break;
        case 'weighted':
          if (question.scoring.weights && Array.isArray(question.scoring.weights)) {
            const weightIndex = Math.min(answer.value - 1, question.scoring.weights.length - 1);
            score = (question.scoring.weights[weightIndex] || 0) * 100;
          }
          break;
        case 'percentage':
          score = answer.value;
          break;
        case 'ranking_matrix':
          score = Math.max(0, 100 - (answer.value || 0) * 20);
          break;
      }
      
      dimensionScores[question.dimension] += score;
      dimensionCounts[question.dimension]++;
    });
    
    Object.keys(dimensionScores).forEach(dimId => {
      if (dimensionCounts[dimId] > 0) {
        dimensionScores[dimId] = Math.round(dimensionScores[dimId] / dimensionCounts[dimId]);
      }
    });
    
    let overallScore = 0;
    dimensions.forEach(dim => {
      overallScore += (dimensionScores[dim.id] || 0) * dim.weight;
    });
    overallScore = Math.round(overallScore);
    
    const insights = generateInsights(overallScore, dimensionScores);
    const recommendations = generateRecommendations(overallScore, dimensionScores);
    const achievements = generateAchievements(overallScore, dimensionScores, engagementMetrics);
    
    return {
      overallScore,
      dimensionScores,
      insights,
      recommendations,
      percentile: Math.max(1, Math.min(99, Math.round(overallScore * 0.9))),
      potentialLevel: getPotentialLevel(overallScore),
      growthTrajectory: overallScore >= 75 ? "ascending" : overallScore >= 50 ? "emerging" : "developing",
      totalPoints: overallScore * 10,
      achievements
    };
  };

  const generateInsights = (overallScore: number, dimensionScores: Record<string, number>): Insight[] => {
    const insights: Insight[] = [];
    
    if (overallScore >= 85) {
      insights.push({
        type: 'strength',
        title: "Exceptional Potential Detected",
        description: "You're in the top 15% of potential. Your combination of superpowers positions you for extraordinary achievements.",
        icon: "🚀"
      });
    }
    
    const topDimension = Object.entries(dimensionScores)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topDimension) {
      const dimension = getDimensionById(topDimension[0]);
      if (dimension) {
        insights.push({
          type: 'strength',
          title: `Your Superpower: ${dimension.storytellingName[currentLanguage]}`,
          description: `This is your strongest dimension at ${topDimension[1]}%. ${dimension.tagline[currentLanguage]}`,
          icon: dimension.icon
        });
      }
    }
    
    return insights;
  };

  const generateRecommendations = (overallScore: number, dimensionScores: Record<string, number>): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    const lowestDimension = Object.entries(dimensionScores)
      .sort(([,a], [,b]) => a - b)[0];
    
    if (lowestDimension) {
      const dimension = getDimensionById(lowestDimension[0]);
      if (dimension) {
        recommendations.push({
          type: 'priority',
          urgency: 'high',
          title: `Boost Your ${dimension.storytellingName[currentLanguage]}`,
          description: `This superpower scored ${lowestDimension[1]}% and represents your biggest growth opportunity.`,
          actions: [
            "Take one small action daily in this area",
            "Find a mentor or resource to guide your development",
            "Track your progress weekly"
          ],
          timeRequired: "15-30 minutes daily",
          expectedImpact: "Significant improvement in 30-60 days"
        });
      }
    }
    
    return recommendations;
  };

  const generateAchievements = (
    overallScore: number, 
    dimensionScores: Record<string, number>, 
    metrics: EngagementMetrics
  ): Achievement[] => {
    const achievements: Achievement[] = [
      {
        id: 'first_assessment',
        title: 'Self-Discovery Pioneer',
        description: 'Completed your first potential assessment',
        icon: '🏆',
        unlocked: true
      },
      {
        id: 'high_engagement',
        title: 'Focused Explorer',
        description: 'Maintained high engagement throughout',
        icon: '🎯',
        unlocked: metrics.interactionQuality > 80
      },
      {
        id: 'superpower_unlocked',
        title: 'Superpower Unlocked',
        description: 'Scored 80+ in at least one dimension',
        icon: '⚡',
        unlocked: Object.values(dimensionScores).some(score => score >= 80)
      }
    ];
    
    return achievements;
  };

  const startAssessment = () => {
    setPQCStage('section-intro');
    setPQCCurrentDimension(0);
    setPQCStartTime(new Date());
    setQuestionStartTime(new Date());
  };

  const continueFromSectionIntro = () => {
    setPQCStage('assessment');
    setQuestionStartTime(new Date());
  };

  const continueFromEnergyBoost = () => {
    setPQCStage('assessment');
    setQuestionStartTime(new Date());
    // Restore energy
    updatePQCEngagementMetrics({
      userEnergyLevel: Math.min(100, engagementMetrics.userEnergyLevel + 30)
    });
  };

  const currentQuestionData = questions[currentQuestion];

  // Show loading during hydration
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <IntroScreen onStart={startAssessment} />
        )}
        
        {stage === 'section-intro' && (
          <motion.div
            key="section-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <SectionIntroCard
              dimension={dimensions[currentDimension]}
              currentLanguage={currentLanguage}
              questionNumber={currentDimension * 7 + 1}
            />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Button
                onClick={continueFromSectionIntro}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Begin {dimensions[currentDimension].storytellingName[currentLanguage]} Questions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
        
        {stage === 'energy-boost' && (
          <EnergyBoostBreak
            onContinue={continueFromEnergyBoost}
            progress={{
              completed: currentQuestion,
              insights: Math.floor(currentQuestion / 7),
              points: currentQuestion * 10
            }}
          />
        )}
        
        {stage === 'assessment' && currentQuestionData && (
          <AssessmentFlow
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            question={currentQuestionData}
            onAnswer={handleAnswer}
            onNext={navigateToNext}
            onPrevious={navigateToPrevious}
            currentLanguage={currentLanguage}
            answers={answers}
            progress={progress}
            engagementMetrics={engagementMetrics}
            adaptiveRecommendations={adaptiveRecommendations}
            showAdaptiveMessage={showAdaptiveMessage}
          />
        )}
        
        {stage === 'processing' && (
          <ProcessingAnimation />
        )}
        
        {stage === 'results' && result && (
          <ResultsDashboard
            result={result}
            onExport={() => {}}
            onShare={() => {}}
            onRetake={resetAssessment}
            currentLanguage={currentLanguage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Brain, 
  Zap,
  Clock
} from 'lucide-react';

import { Question, type Answer } from '@/lib/data/pqc-data';
import { type EngagementMetrics, type AdaptiveRecommendation } from '@/lib/adaptive-system';
import { EmojiSliderQuestion } from '../interactions/EmojiSliderQuestion';
import { WordCloudQuestion } from '../interactions/WordCloudQuestion';
import { CardSortQuestion } from '../interactions/CardSortQuestion';
import { SpectrumTapQuestion } from '../interactions/SpectrumTapQuestion';
import { BinaryChoiceQuestion } from '../interactions/BinaryChoiceQuestion';
import { ScenarioAdventureQuestion } from '../interactions/ScenarioAdventureQuestion';
import { VisualSpectrumQuestion } from '../interactions/VisualSpectrumQuestion';
import { RankingMatrixQuestion } from '../interactions/RankingMatrixQuestion';
import { TimeAllocationQuestion } from '../interactions/TimeAllocationQuestion';
import { ValueAuctionQuestion } from '../interactions/ValueAuctionQuestion';
import { StoryCompletionQuestion } from '../interactions/StoryCompletionQuestion';
import { MetaphorSelectionQuestion } from '../interactions/MetaphorSelectionQuestion';
import { PriorityPyramidQuestion } from '../interactions/PriorityPyramidQuestion';
import { EnergyDistributionQuestion } from '../interactions/EnergyDistributionQuestion';
import { FutureVisualizationQuestion } from '../interactions/FutureVisualizationQuestion';

interface AssessmentFlowProps {
  currentQuestion: number;
  totalQuestions: number;
  question: Question;
  onAnswer: (questionId: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentLanguage: 'en' | 'am';
  answers: Map<string, Answer>;
  progress: number;
  engagementMetrics: EngagementMetrics;
  adaptiveRecommendations: AdaptiveRecommendation[];
  showAdaptiveMessage: string | null;
}

export function AssessmentFlow({
  currentQuestion,
  totalQuestions,
  question,
  onAnswer,
  onNext,
  onPrevious,
  currentLanguage,
  answers,
  progress,
  engagementMetrics,
  adaptiveRecommendations,
  showAdaptiveMessage
}: AssessmentFlowProps) {
  
  const handleAnswer = (value: any) => {
    onAnswer(question.id, value);
  };

  const renderQuestionByType = () => {
    switch (question.interactionType) {
      case 'emoji_slider':
        return (
          <EmojiSliderQuestion
            question={{
              id: question.id,
              content: question.content,
              number: currentQuestion + 1,
              total: totalQuestions
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'word_cloud':
        return (
          <WordCloudQuestion
            question={{
              id: question.id,
              content: question.content,
              words: question.options?.words || []
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'card_sort':
        return (
          <CardSortQuestion
            question={{
              id: question.id,
              content: question.content,
              cards: question.options?.cards || []
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'spectrum_tap':
        return (
          <SpectrumTapQuestion
            question={{
              id: question.id,
              content: question.content,
              leftLabel: question.options?.leftLabel || 'Left',
              rightLabel: question.options?.rightLabel || 'Right',
              centerLabel: question.options?.centerLabel
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'binary_choice':
        return (
          <BinaryChoiceQuestion
            question={{
              id: question.id,
              content: question.content,
              optionA: question.options?.optionA || { text: 'Option A', icon: '🅰️', color: 'blue' },
              optionB: question.options?.optionB || { text: 'Option B', icon: '🅱️', color: 'pink' }
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'scenario_adventure':
        return (
          <ScenarioAdventureQuestion
            question={{
              id: question.id,
              content: question.content,
              scenario: question.options?.scenario || {
                title: 'Decision Point',
                description: 'Choose your path forward...',
                choices: []
              }
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'visual_spectrum':
        return (
          <VisualSpectrumQuestion
            question={{
              id: question.id,
              content: question.content,
              visualOptions: question.options?.visualOptions || []
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'ranking_matrix':
        return (
          <RankingMatrixQuestion
            question={{
              id: question.id,
              content: question.content,
              items: question.options?.items || []
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'time_allocation':
        return (
          <TimeAllocationQuestion
            question={{
              id: question.id,
              content: question.content,
              categories: question.options?.categories || [],
              totalHours: question.options?.totalHours || 24
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'value_auction':
        return (
          <ValueAuctionQuestion
            question={{
              id: question.id,
              content: question.content,
              values: question.options?.values || [],
              totalBudget: question.options?.totalBudget || 100
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'story_completion':
        return (
          <StoryCompletionQuestion
            question={{
              id: question.id,
              content: question.content,
              storyPrompt: question.options?.storyPrompt || {
                title: 'Your Story',
                setup: 'Complete this story...',
                cliffhanger: 'What happens next?',
                guidingQuestions: []
              },
              analysisCategories: question.options?.analysisCategories || []
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'metaphor_selection':
        return (
          <MetaphorSelectionQuestion
            question={{
              id: question.id,
              content: question.content,
              concept: question.options?.concept || 'your approach',
              metaphors: question.options?.metaphors || []
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'priority_pyramid':
        return (
          <PriorityPyramidQuestion
            question={{
              id: question.id,
              content: question.content,
              items: question.options?.items || [],
              pyramidLevels: question.options?.pyramidLevels || {
                top: { name: 'Essential', slots: 2, description: 'Most important' },
                middle: { name: 'Important', slots: 3, description: 'Very important' },
                bottom: { name: 'Valuable', slots: 4, description: 'Nice to have' }
              }
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'energy_distribution':
        return (
          <EnergyDistributionQuestion
            question={{
              id: question.id,
              content: question.content,
              energyAreas: question.options?.energyAreas || [],
              totalEnergy: question.options?.totalEnergy || 100
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      case 'future_visualization':
        return (
          <FutureVisualizationQuestion
            question={{
              id: question.id,
              content: question.content,
              timeFrames: question.options?.timeFrames || [],
              visualizationAspects: question.options?.visualizationAspects || []
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
      
      default:
        // Fallback to emoji slider for unsupported types
        return (
          <EmojiSliderQuestion
            question={{
              id: question.id,
              content: question.content,
              number: currentQuestion + 1,
              total: totalQuestions
            }}
            currentLanguage={currentLanguage}
            onAnswer={handleAnswer}
          />
        );
    }
  };

  const getEnergyColor = (level: number) => {
    if (level >= 80) return 'text-green-600';
    if (level >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getInteractionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'emoji_slider': '😊 Emoji Scale',
      'word_cloud': '☁️ Word Cloud',
      'card_sort': '🃏 Card Sort',
      'spectrum_tap': '📊 Spectrum Tap',
      'binary_choice': '⚡ Quick Choice',
      'scenario_adventure': '🎭 Scenario Adventure',
      'visual_spectrum': '🎨 Visual Spectrum',
      'ranking_matrix': '📋 Ranking Matrix',
      'time_allocation': '⏰ Time Allocation',
      'value_auction': '💰 Value Auction',
      'story_completion': '📖 Story Completion',
      'metaphor_selection': '🎭 Metaphor Selection',
      'priority_pyramid': '🔺 Priority Pyramid',
      'energy_distribution': '⚡ Energy Distribution',
      'future_visualization': '🔮 Future Visualization'
    };
    return labels[type] || '❓ Interactive';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-purple-100 z-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-purple-600">
                Question {currentQuestion + 1} of {totalQuestions}
              </Badge>
              <Badge className={`${getEnergyColor(engagementMetrics.userEnergyLevel)} bg-white border-current`}>
                <Zap className="w-3 h-3 mr-1" />
                Energy: {Math.round(engagementMetrics.userEnergyLevel)}%
              </Badge>
              <Badge variant="outline" className="text-indigo-600">
                {getInteractionTypeLabel(question.interactionType)}
              </Badge>
              {engagementMetrics.engagementTrend === 'increasing' && (
                <Badge className="bg-green-100 text-green-700">
                  📈 Improving
                </Badge>
              )}
              {adaptiveRecommendations.some(r => r.priority === 'high') && (
                <Badge className="bg-orange-100 text-orange-700">
                  🎯 Adaptive
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                ~{Math.round((totalQuestions - currentQuestion) * 0.5)} min left
              </span>
            </div>
          </div>
          
          <Progress value={progress} className="h-2 bg-purple-100" />
        </div>
      </div>

      {/* Adaptive Message */}
      {showAdaptiveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-4xl mx-auto px-8 pb-4"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  🤖
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Adaptive AI Coach</p>
                  <p className="text-sm text-gray-700">{showAdaptiveMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Question Content */}
      <div className="max-w-4xl mx-auto p-8">
        {renderQuestionByType()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onPrevious}
            disabled={currentQuestion === 0}
            className="text-gray-600"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600">
              Quality: {Math.round(engagementMetrics.interactionQuality)}%
            </span>
          </div>
          
          <Button
            onClick={onNext}
            disabled={!answers.has(question.id)}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
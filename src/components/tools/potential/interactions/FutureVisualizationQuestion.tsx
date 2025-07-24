"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, Eye, Crystal, Sparkles, Calendar } from 'lucide-react';

interface FutureVisualizationQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    timeFrames: Array<{
      id: string;
      period: string;
      description: string;
      icon: string;
    }>;
    visualizationAspects: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      scale: {
        low: string;
        high: string;
      };
    }>;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { 
    timeFrame: string;
    visualizations: Record<string, number>;
    clarity: number;
    confidence: number;
    visionType: string;
    timestamp: Date;
  }) => void;
}

const defaultTimeFrames = [
  {
    id: '1year',
    period: '1 Year',
    description: 'Where you see yourself in the near future',
    icon: '📅'
  },
  {
    id: '5years',
    period: '5 Years',
    description: 'Your medium-term vision and goals',
    icon: '🎯'
  },
  {
    id: '10years',
    period: '10 Years',
    description: 'Your long-term aspirations and legacy',
    icon: '🌟'
  }
];

const defaultVisualizationAspects = [
  {
    id: 'career',
    name: 'Career Success',
    description: 'Professional achievements and recognition',
    icon: '🏆',
    scale: {
      low: 'Stable, comfortable work',
      high: 'Industry leader, significant impact'
    }
  },
  {
    id: 'relationships',
    name: 'Relationship Quality',
    description: 'Depth and fulfillment in personal connections',
    icon: '💕',
    scale: {
      low: 'Good connections with some people',
      high: 'Deep, meaningful relationships across life'
    }
  },
  {
    id: 'health',
    name: 'Physical Vitality',
    description: 'Energy, fitness, and overall wellbeing',
    icon: '⚡',
    scale: {
      low: 'Decent health, managing well',
      high: 'Peak physical condition, boundless energy'
    }
  },
  {
    id: 'wealth',
    name: 'Financial Freedom',
    description: 'Economic security and lifestyle flexibility',
    icon: '💎',
    scale: {
      low: 'Financially secure, needs met',
      high: 'Complete financial independence'
    }
  },
  {
    id: 'impact',
    name: 'Positive Impact',
    description: 'Making a difference in the world',
    icon: '🌍',
    scale: {
      low: 'Contributing to my community',
      high: 'Changing the world significantly'
    }
  },
  {
    id: 'growth',
    name: 'Personal Growth',
    description: 'Learning, wisdom, and self-development',
    icon: '🌱',
    scale: {
      low: 'Steady personal development',
      high: 'Transformed into my best self'
    }
  }
];

export function FutureVisualizationQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: FutureVisualizationQuestionProps) {
  const timeFrames = question.timeFrames || defaultTimeFrames;
  const visualizationAspects = question.visualizationAspects || defaultVisualizationAspects;
  
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string | null>(null);
  const [visualizations, setVisualizations] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    visualizationAspects.forEach(aspect => {
      initial[aspect.id] = 50; // Start at middle
    });
    return initial;
  });
  const [clarity, setClarity] = useState(70);
  const [confidence, setConfidence] = useState(60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState<'timeframe' | 'visualization' | 'assessment'>('timeframe');

  const handleTimeFrameSelect = (timeFrameId: string) => {
    if (isSubmitted) return;
    setSelectedTimeFrame(timeFrameId);
    setCurrentStep('visualization');
  };

  const handleVisualizationComplete = () => {
    setCurrentStep('assessment');
  };

  const handleSubmit = () => {
    if (!selectedTimeFrame) return;
    
    const visionType = analyzeVisionType(visualizations);
    
    setIsSubmitted(true);
    onAnswer({
      timeFrame: selectedTimeFrame,
      visualizations,
      clarity,
      confidence,
      visionType,
      timestamp: new Date()
    });
  };

  const analyzeVisionType = (visualizations: Record<string, number>): string => {
    const scores = Object.values(visualizations);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    const highScores = scores.filter(s => s >= 80).length;
    const lowScores = scores.filter(s => s <= 30).length;
    
    if (average >= 85) return 'Visionary Dreamer';
    if (average <= 30) return 'Grounded Realist';
    if (highScores >= 4) return 'Ambitious Achiever';
    if (lowScores >= 3) return 'Modest Aspirant';
    if (Math.max(...scores) - Math.min(...scores) > 50) return 'Focused Specialist';
    return 'Balanced Optimist';
  };

  const getVisualizationIntensity = () => {
    const average = Object.values(visualizations).reduce((sum, val) => sum + val, 0) / visualizationAspects.length;
    if (average >= 80) return 'Highly Ambitious';
    if (average >= 60) return 'Optimistically Driven';
    if (average >= 40) return 'Moderately Hopeful';
    return 'Realistically Grounded';
  };

  const selectedTimeFrameData = timeFrames.find(tf => tf.id === selectedTimeFrame);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crystal className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">{question.content[currentLanguage]}</h2>
          <Eye className="w-6 h-6 text-indigo-600" />
        </div>
        <p className="text-gray-600">
          Visualize your ideal future across different life dimensions
        </p>
        <Badge className="bg-indigo-100 text-indigo-700 mt-2">
          Future Visualization
        </Badge>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-center items-center gap-4">
          {['timeframe', 'visualization', 'assessment'].map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === step ? 'bg-indigo-600 text-white' :
                index < ['timeframe', 'visualization', 'assessment'].indexOf(currentStep) ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              {index < 2 && <div className="w-8 h-1 bg-gray-200 rounded" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Time Frame Selection */}
      <AnimatePresence mode="wait">
        {currentStep === 'timeframe' && (
          <motion.div
            key="timeframe"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center mb-6">Choose Your Time Horizon</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {timeFrames.map((timeFrame, index) => (
                    <motion.div
                      key={timeFrame.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTimeFrameSelect(timeFrame.id)}
                      className="cursor-pointer"
                    >
                      <Card className="border-2 hover:border-indigo-300 hover:shadow-lg transition-all">
                        <CardContent className="p-6 text-center">
                          <div className="text-5xl mb-4">{timeFrame.icon}</div>
                          <h4 className="font-bold text-xl mb-2">{timeFrame.period}</h4>
                          <p className="text-gray-600">{timeFrame.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Future Visualization */}
        {currentStep === 'visualization' && selectedTimeFrameData && (
          <motion.div
            key="visualization"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">
                    Visualize Your Life in {selectedTimeFrameData.period}
                  </h3>
                  <p className="text-gray-600">
                    Set the dial for each area based on your ideal vision
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {visualizationAspects.map((aspect, index) => (
                    <motion.div
                      key={aspect.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{aspect.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg">{aspect.name}</h4>
                              <p className="text-sm text-gray-600">{aspect.description}</p>
                            </div>
                            <div className="text-2xl font-bold text-indigo-600">
                              {visualizations[aspect.id]}%
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Slider
                              value={[visualizations[aspect.id]]}
                              onValueChange={([value]) => setVisualizations(prev => ({
                                ...prev,
                                [aspect.id]: value
                              }))}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                            
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{aspect.scale.low}</span>
                              <span>{aspect.scale.high}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={handleVisualizationComplete}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    Continue to Assessment
                    <Sparkles className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Vision Assessment */}
        {currentStep === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center mb-6">Assess Your Vision</h3>
                
                {/* Vision Summary */}
                <div className="mb-8">
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-4 text-center">Your Vision Summary</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Time Frame:</h5>
                          <p className="text-gray-700">{selectedTimeFrameData?.period}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-purple-700 mb-2">Vision Intensity:</h5>
                          <p className="text-gray-700">{getVisualizationIntensity()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Clarity Assessment */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-indigo-600" />
                      Vision Clarity
                    </h4>
                    <p className="text-gray-600 mb-4">How clear and detailed is this vision in your mind?</p>
                    <Slider
                      value={[clarity]}
                      onValueChange={([value]) => setClarity(value)}
                      max={100}
                      step={5}
                      className="w-full mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Vague idea</span>
                      <span>Crystal clear</span>
                    </div>
                    <div className="text-center mt-2">
                      <Badge className="bg-indigo-100 text-indigo-700">
                        {clarity}% Clear
                      </Badge>
                    </div>
                  </div>

                  {/* Confidence Assessment */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      Achievement Confidence
                    </h4>
                    <p className="text-gray-600 mb-4">How confident are you that you can achieve this vision?</p>
                    <Slider
                      value={[confidence]}
                      onValueChange={([value]) => setConfidence(value)}
                      max={100}
                      step={5}
                      className="w-full mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Unlikely</span>
                      <span>Definitely achievable</span>
                    </div>
                    <div className="text-center mt-2">
                      <Badge className="bg-green-100 text-green-700">
                        {confidence}% Confident
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Vision Captured!
                      </>
                    ) : (
                      'Complete Vision Assessment'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Your Future Vision Profile
                  </h3>
                  <Badge className="bg-green-100 text-green-700 text-lg px-4 py-2">
                    {analyzeVisionType(visualizations)}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="font-bold text-green-700 mb-2">Time Horizon</h4>
                    <p className="text-gray-700">{selectedTimeFrameData?.period} Vision</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-blue-700 mb-2">Vision Clarity</h4>
                    <p className="text-gray-700">{clarity}% Clear</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-purple-700 mb-2">Confidence Level</h4>
                    <p className="text-gray-700">{confidence}% Confident</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white/60 rounded-lg text-center">
                  <p className="text-gray-700">
                    <span className="font-medium">Vision Insight:</span> Your future visualization reveals 
                    your deepest aspirations and shows how you naturally think about growth and achievement. 
                    The clarity and confidence levels indicate your readiness to pursue these goals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Heart, Brain, Zap } from 'lucide-react';

interface MetaphorSelectionQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    concept: string;
    metaphors: Array<{
      id: string;
      title: string;
      description: string;
      imagery: string;
      personality: string;
      reasoning: string;
      icon: string;
    }>;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { 
    selectedMetaphor: string; 
    personalityType: string;
    reasoning: string;
    timestamp: Date;
  }) => void;
}

const defaultMetaphors = [
  {
    id: 'river',
    title: 'A River',
    description: 'Flowing naturally around obstacles, always finding a way forward',
    imagery: 'Gentle yet persistent, carving new paths through the landscape',
    personality: 'Adaptive Flow-State Achiever',
    reasoning: 'You prefer organic solutions and believe persistence overcomes resistance',
    icon: '🌊'
  },
  {
    id: 'mountain',
    title: 'A Mountain',
    description: 'Standing strong and unmovable, weathering all storms',
    imagery: 'Solid foundation rising to great heights, visible from far away',
    personality: 'Steadfast Pillar of Strength',
    reasoning: 'You value stability, endurance, and being a reliable foundation for others',
    icon: '⛰️'
  },
  {
    id: 'lightning',
    title: 'Lightning',
    description: 'Striking with brilliant energy, illuminating everything in an instant',
    imagery: 'Sudden, powerful, and transformative - impossible to ignore',
    personality: 'Catalytic Change Agent',
    reasoning: 'You thrive on breakthrough moments and rapid transformation',
    icon: '⚡'
  },
  {
    id: 'garden',
    title: 'A Garden',
    description: 'Nurturing growth in yourself and others, creating beauty over time',
    imagery: 'Carefully tended space where diverse elements flourish together',
    personality: 'Cultivating Growth Nurturer',
    reasoning: 'You believe in patient development and creating environments for others to thrive',
    icon: '🌺'
  },
  {
    id: 'compass',
    title: 'A Compass',
    description: 'Always pointing toward true direction, helping others navigate',
    imagery: 'Reliable guidance system that never loses its sense of direction',
    personality: 'Visionary Direction Finder',
    reasoning: 'You have strong intuition about the right path and help others find their way',
    icon: '🧭'
  },
  {
    id: 'fire',
    title: 'Fire',
    description: 'Warming others while burning brightly, spreading energy and passion',
    imagery: 'Dancing flames that bring light, heat, and transformative power',
    personality: 'Inspirational Energy Igniter',
    reasoning: 'You energize situations and people, spreading enthusiasm and motivation',
    icon: '🔥'
  }
];

export function MetaphorSelectionQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: MetaphorSelectionQuestionProps) {
  const [selectedMetaphor, setSelectedMetaphor] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  
  const metaphors = question.metaphors || defaultMetaphors;
  const concept = question.concept || 'your approach to challenges';
  
  const handleSelection = (metaphorId: string) => {
    if (isSubmitted) return;
    
    setSelectedMetaphor(metaphorId);
    setShowInsight(true);
    
    setTimeout(() => {
      const selected = metaphors.find(m => m.id === metaphorId);
      if (selected) {
        setIsSubmitted(true);
        onAnswer({
          selectedMetaphor: metaphorId,
          personalityType: selected.personality,
          reasoning: selected.reasoning,
          timestamp: new Date()
        });
      }
    }, 2000);
  };

  const selectedMetaphorData = metaphors.find(m => m.id === selectedMetaphor);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-pink-600" />
          <h2 className="text-2xl font-bold">{question.content[currentLanguage]}</h2>
          <Brain className="w-6 h-6 text-pink-600" />
        </div>
        <p className="text-gray-600">
          Which metaphor best represents {concept}?
        </p>
        <Badge className="bg-pink-100 text-pink-700 mt-2">
          Metaphor Selection
        </Badge>
      </div>

      {/* Instruction Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-pink-600 mx-auto mb-3" />
            <p className="text-gray-700">
              <span className="font-medium">Think intuitively:</span> Which metaphor immediately 
              resonates with you? There's no logical analysis needed - go with your gut feeling.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metaphor Options */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metaphors.map((metaphor, index) => (
          <motion.div
            key={metaphor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              whileHover={{ scale: isSubmitted ? 1 : 1.05, y: -5 }}
              whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
              onClick={() => handleSelection(metaphor.id)}
              className={`cursor-pointer h-full ${isSubmitted ? 'cursor-default' : ''}`}
            >
              <Card 
                className={`h-full border-2 transition-all duration-300 ${
                  selectedMetaphor === metaphor.id
                    ? 'border-pink-500 bg-pink-50 shadow-2xl scale-105'
                    : selectedMetaphor && selectedMetaphor !== metaphor.id
                    ? 'border-gray-200 bg-gray-50 opacity-50'
                    : 'border-gray-200 hover:border-pink-300 hover:shadow-xl'
                }`}
              >
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Icon and Title */}
                  <div className="text-center mb-4">
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: selectedMetaphor === metaphor.id ? 1.3 : 1,
                        rotate: selectedMetaphor === metaphor.id ? 360 : 0
                      }}
                      transition={{ duration: 0.5 }}
                      className="text-6xl mb-3"
                    >
                      {metaphor.icon}
                    </motion.div>
                    <h3 className="font-bold text-xl text-gray-800">
                      {metaphor.title}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <div className="flex-grow">
                    <p className="text-gray-700 mb-3 font-medium">
                      {metaphor.description}
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      {metaphor.imagery}
                    </p>
                  </div>
                  
                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {selectedMetaphor === metaphor.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-4 flex items-center justify-center gap-2 text-pink-600"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">This resonates with me!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Metaphor Insight */}
      <AnimatePresence>
        {showInsight && selectedMetaphorData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-6xl mb-4"
                  >
                    {selectedMetaphorData.icon}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-purple-800 mb-2">
                    You Are: {selectedMetaphorData.title}
                  </h3>
                  
                  <Badge className="bg-purple-100 text-purple-700 text-lg px-4 py-2">
                    {selectedMetaphorData.personality}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-purple-700">Your Essence:</h4>
                    <p className="text-gray-700">{selectedMetaphorData.description}</p>
                    
                    <h4 className="font-bold text-purple-700">How Others See You:</h4>
                    <p className="text-gray-700">{selectedMetaphorData.imagery}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-purple-700">What This Reveals:</h4>
                    <p className="text-gray-700">{selectedMetaphorData.reasoning}</p>
                    
                    <div className="p-4 bg-white/60 rounded-lg">
                      <p className="text-sm text-purple-800 font-medium">
                        💡 Metaphor Insight: Your choice reveals deep patterns about how you 
                        navigate life's challenges and opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Message */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="text-gray-700">
                  <span className="font-medium">Metaphor captured!</span> Your intuitive choice 
                  provides valuable insights into your core personality and approach to life.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
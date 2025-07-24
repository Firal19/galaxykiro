"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface WordCloudQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    words: Array<{
      text: string;
      size: 'large' | 'medium' | 'small';
      position: { x: number; y: number };
    }>;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { selected: string[]; pattern: string; timestamp: Date }) => void;
}

const defaultWords = [
  { text: "Challenge", size: "large" as const, position: { x: 20, y: 15 } },
  { text: "Growth", size: "medium" as const, position: { x: 70, y: 25 } },
  { text: "Comfort", size: "large" as const, position: { x: 45, y: 40 } },
  { text: "Risk", size: "small" as const, position: { x: 15, y: 60 } },
  { text: "Learning", size: "large" as const, position: { x: 65, y: 55 } },
  { text: "Safety", size: "medium" as const, position: { x: 30, y: 75 } },
  { text: "Adventure", size: "medium" as const, position: { x: 80, y: 70 } },
  { text: "Routine", size: "small" as const, position: { x: 10, y: 35 } },
  { text: "Discovery", size: "medium" as const, position: { x: 50, y: 10 } },
  { text: "Stability", size: "large" as const, position: { x: 25, y: 50 } }
];

export function WordCloudQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: WordCloudQuestionProps) {
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const words = question.words || defaultWords;
  
  const toggleWord = (word: string) => {
    if (isSubmitted) return;
    
    const newSelected = new Set(selectedWords);
    if (newSelected.has(word)) {
      newSelected.delete(word);
    } else if (newSelected.size < 5) {
      newSelected.add(word);
    }
    setSelectedWords(newSelected);
  };
  
  const getSizeClass = (size: string) => {
    switch(size) {
      case 'large': return 'text-3xl font-bold';
      case 'medium': return 'text-2xl font-semibold';
      case 'small': return 'text-xl font-medium';
      default: return 'text-xl';
    }
  };

  const analyzeWordPattern = (selected: Set<string>): string => {
    const selectedArray = Array.from(selected);
    const growthWords = ['Challenge', 'Growth', 'Learning', 'Adventure', 'Discovery'];
    const comfortWords = ['Comfort', 'Safety', 'Routine', 'Stability'];
    
    const growthCount = selectedArray.filter(word => growthWords.includes(word)).length;
    const comfortCount = selectedArray.filter(word => comfortWords.includes(word)).length;
    
    if (growthCount > comfortCount) return 'growth-oriented';
    if (comfortCount > growthCount) return 'stability-oriented';
    return 'balanced';
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onAnswer({
      selected: Array.from(selectedWords),
      pattern: analyzeWordPattern(selectedWords),
      timestamp: new Date()
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{question.content[currentLanguage]}</h2>
        <p className="text-gray-600">
          Tap up to 5 words that resonate with you most
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="outline" className="text-purple-600">
            {selectedWords.size}/5 selected
          </Badge>
        </div>
      </div>
      
      {/* Word Cloud Container */}
      <Card className="shadow-xl border-none overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-[400px] bg-gradient-to-br from-purple-50 to-pink-50">
            {words.map((word, index) => (
              <motion.button
                key={word.text}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleWord(word.text)}
                className={`
                  absolute px-4 py-2 rounded-full transition-all
                  ${selectedWords.has(word.text)
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                  }
                  ${getSizeClass(word.size)}
                `}
                style={{
                  left: `${word.position.x}%`,
                  top: `${word.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                disabled={isSubmitted}
              >
                {word.text}
                {selectedWords.has(word.text) && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedWords.size >= 3 ? 1 : 0.5 }}
        className="mt-8 text-center"
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={selectedWords.size < 3 || isSubmitted}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {isSubmitted ? 'Words Captured!' : 'Confirm My Choices'}
        </Button>
      </motion.div>
      
      {/* Insight after submission */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Pattern detected:</span> Your word choices 
                    suggest a {analyzeWordPattern(selectedWords)} orientation. This is valuable 
                    self-awareness!
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
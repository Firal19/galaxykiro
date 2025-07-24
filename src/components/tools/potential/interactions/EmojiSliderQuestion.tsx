"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, ArrowRight, Brain, Sparkles } from 'lucide-react';

interface EmojiSliderQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    number: number;
    total: number;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { value: number; emoji: string; timestamp: Date }) => void;
}

export function EmojiSliderQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: EmojiSliderQuestionProps) {
  const [value, setValue] = useState(50);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const emojis = ["😴", "😐", "🙂", "😊", "🤩"];
  const currentEmoji = emojis[Math.floor(value / 20)];
  
  const handleSubmit = () => {
    setIsAnswered(true);
    onAnswer({
      value,
      emoji: currentEmoji,
      timestamp: new Date()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto p-8"
    >
      {/* Implicit Context Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-700">
                <span className="font-medium">Quick insight:</span> People who see challenges 
                as growth opportunities have 73% higher achievement rates
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Main Question */}
      <Card className="shadow-2xl border-none">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {question.content[currentLanguage]}
          </h2>
          
          {/* Interactive Emoji Display */}
          <motion.div
            key={currentEmoji}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-8xl text-center mb-8"
          >
            {currentEmoji}
          </motion.div>
          
          {/* Custom Slider */}
          <div className="relative mb-8">
            <Slider
              value={[value]}
              onValueChange={([v]) => setValue(v)}
              max={100}
              step={1}
              className="relative"
            />
            
            {/* Emoji markers */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2">
              {emojis.map((emoji, index) => (
                <span
                  key={index}
                  className={`text-2xl transition-all ${
                    Math.floor(value / 20) === index 
                      ? 'scale-125' 
                      : 'scale-100 opacity-50'
                  }`}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
          
          {/* Context Labels */}
          <div className="flex justify-between text-sm text-gray-600 mt-12 mb-6">
            <span>Never True</span>
            <span>Always True</span>
          </div>
          
          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isAnswered}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-w-[200px]"
            >
              {isAnswered ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Captured!
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
      
      {/* Encouraging Feedback */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 text-center"
          >
            <p className="text-green-600 font-medium">
              Great choice! Your honesty is building an accurate picture. 🎯
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
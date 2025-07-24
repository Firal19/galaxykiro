"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Zap } from 'lucide-react';

interface BinaryChoiceQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    optionA: {
      text: string;
      icon: string;
      color: string;
    };
    optionB: {
      text: string;
      icon: string;
      color: string;
    };
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { choice: 'A' | 'B'; option: string; timestamp: Date }) => void;
}

export function BinaryChoiceQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: BinaryChoiceQuestionProps) {
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChoice = (choice: 'A' | 'B') => {
    if (isSubmitted) return;
    
    setSelectedChoice(choice);
    setIsSubmitted(true);
    
    setTimeout(() => {
      onAnswer({
        choice,
        option: choice === 'A' ? question.optionA.text : question.optionB.text,
        timestamp: new Date()
      });
    }, 800);
  };

  const options = [
    { key: 'A' as const, ...question.optionA },
    { key: 'B' as const, ...question.optionB }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{question.content[currentLanguage]}</h2>
        <p className="text-gray-600 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          Quick choice - go with your gut feeling
        </p>
      </div>

      {/* Binary Options */}
      <div className="grid md:grid-cols-2 gap-8">
        {options.map((option) => (
          <motion.div
            key={option.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: option.key === 'A' ? 0.1 : 0.2 }}
          >
            <motion.div
              whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
              onClick={() => handleChoice(option.key)}
              className={`cursor-pointer ${isSubmitted ? 'cursor-default' : ''}`}
            >
              <Card 
                className={`h-64 border-2 transition-all duration-300 ${
                  selectedChoice === option.key
                    ? `border-${option.color}-500 bg-${option.color}-50 shadow-xl scale-105`
                    : selectedChoice && selectedChoice !== option.key
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : `border-gray-200 hover:border-${option.color}-300 hover:shadow-lg`
                }`}
              >
                <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: selectedChoice === option.key ? 1.2 : 1,
                      rotate: selectedChoice === option.key ? 360 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4"
                  >
                    {option.icon}
                  </motion.div>
                  
                  {/* Text */}
                  <h3 className={`text-xl font-bold mb-2 ${
                    selectedChoice === option.key ? `text-${option.color}-700` : 'text-gray-800'
                  }`}>
                    {option.text}
                  </h3>
                  
                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {selectedChoice === option.key && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`mt-4 flex items-center gap-2 text-${option.color}-600`}
                      >
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-medium">Selected!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Message */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-4xl mb-2"
                >
                  ✨
                </motion.div>
                <p className="text-gray-700">
                  <span className="font-medium">Great choice!</span> Your instinctive response reveals 
                  important patterns about your decision-making style.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="mt-8 text-center">
        <div className="flex justify-center items-center gap-2">
          {[1, 2, 3].map((step) => (
            <motion.div
              key={step}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: step * 0.1 }}
              className={`w-2 h-2 rounded-full ${
                step === 1 ? 'bg-purple-500' : 
                step === 2 && isSubmitted ? 'bg-purple-500' : 
                step === 3 && isSubmitted ? 'bg-purple-500' : 
                'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {isSubmitted ? 'Choice captured, moving forward...' : 'Choose your preference'}
        </p>
      </div>
    </motion.div>
  );
}
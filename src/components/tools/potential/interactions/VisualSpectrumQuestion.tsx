"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Palette, Eye } from 'lucide-react';

interface VisualSpectrumQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    visualOptions: Array<{
      id: string;
      image: string;
      title: string;
      description: string;
      value: number;
      color: string;
    }>;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { selectedId: string; value: number; preference: string; timestamp: Date }) => void;
}

const defaultVisualOptions = [
  {
    id: 'structured',
    image: '🏛️',
    title: 'Structured & Organized',
    description: 'Clean lines, clear hierarchy, systematic approach',
    value: 20,
    color: 'blue'
  },
  {
    id: 'creative',
    image: '🎨',
    title: 'Creative & Expressive',
    description: 'Artistic flair, unique perspective, imaginative',
    value: 40,
    color: 'purple'
  },
  {
    id: 'dynamic',
    image: '⚡',
    title: 'Dynamic & Energetic',
    description: 'Movement, action, high energy, fast-paced',
    value: 60,
    color: 'orange'
  },
  {
    id: 'harmonious',
    image: '🌸',
    title: 'Harmonious & Balanced',
    description: 'Natural flow, peaceful, well-balanced elements',
    value: 80,
    color: 'green'
  },
  {
    id: 'bold',
    image: '🔥',
    title: 'Bold & Impactful',
    description: 'Strong contrasts, attention-grabbing, powerful',
    value: 100,
    color: 'red'
  }
];

export function VisualSpectrumQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: VisualSpectrumQuestionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoverEffect, setHoverEffect] = useState<string | null>(null);
  
  const visualOptions = question.visualOptions || defaultVisualOptions;
  
  const handleSelection = (optionId: string) => {
    if (isSubmitted) return;
    
    setSelectedId(optionId);
    
    setTimeout(() => {
      const selectedOption = visualOptions.find(opt => opt.id === optionId);
      if (selectedOption) {
        setIsSubmitted(true);
        onAnswer({
          selectedId: optionId,
          value: selectedOption.value,
          preference: selectedOption.title,
          timestamp: new Date()
        });
      }
    }, 800);
  };

  const getColorClasses = (color: string, selected: boolean = false) => {
    const colorMap = {
      blue: selected ? 'bg-blue-500 border-blue-600' : 'bg-blue-100 border-blue-300 hover:bg-blue-200',
      purple: selected ? 'bg-purple-500 border-purple-600' : 'bg-purple-100 border-purple-300 hover:bg-purple-200',
      orange: selected ? 'bg-orange-500 border-orange-600' : 'bg-orange-100 border-orange-300 hover:bg-orange-200',
      green: selected ? 'bg-green-500 border-green-600' : 'bg-green-100 border-green-300 hover:bg-green-200',
      red: selected ? 'bg-red-500 border-red-600' : 'bg-red-100 border-red-300 hover:bg-red-200'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 border-gray-300';
  };

  const selectedOption = visualOptions.find(opt => opt.id === selectedId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Palette className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">{question.content[currentLanguage]}</h2>
          <Eye className="w-6 h-6 text-purple-600" />
        </div>
        <p className="text-gray-600">
          Choose the visual style that resonates most with you
        </p>
        <Badge className="bg-purple-100 text-purple-700 mt-2">
          Visual Spectrum
        </Badge>
      </div>

      {/* Visual Options Grid */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        {visualOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setHoverEffect(option.id)}
            onHoverEnd={() => setHoverEffect(null)}
          >
            <motion.div
              whileHover={{ scale: isSubmitted ? 1 : 1.05, y: -5 }}
              whileTap={{ scale: isSubmitted ? 1 : 0.95 }}
              onClick={() => handleSelection(option.id)}
              className={`cursor-pointer ${isSubmitted ? 'cursor-default' : ''}`}
            >
              <Card 
                className={`h-full border-3 transition-all duration-300 ${
                  selectedId === option.id
                    ? `${getColorClasses(option.color, true)} shadow-2xl transform scale-105`
                    : selectedId && selectedId !== option.id
                    ? 'border-gray-200 bg-gray-50 opacity-50'
                    : `${getColorClasses(option.color)} hover:shadow-xl`
                }`}
              >
                <CardContent className="p-6 text-center h-full flex flex-col">
                  {/* Visual Icon */}
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: selectedId === option.id ? 1.3 : hoverEffect === option.id ? 1.1 : 1,
                      rotate: selectedId === option.id ? 360 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4"
                  >
                    {option.image}
                  </motion.div>
                  
                  {/* Title */}
                  <h3 className={`font-bold text-lg mb-2 ${
                    selectedId === option.id ? 'text-white' : `text-${option.color}-800`
                  }`}>
                    {option.title}
                  </h3>
                  
                  {/* Description */}
                  <p className={`text-sm flex-grow ${
                    selectedId === option.id ? 'text-white/90' : `text-${option.color}-600`
                  }`}>
                    {option.description}
                  </p>
                  
                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {selectedId === option.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-4 flex items-center justify-center gap-2 text-white"
                      >
                        <CheckCircle className="w-5 h-5" />
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

      {/* Visual Preference Analysis */}
      <AnimatePresence>
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-5xl mb-4"
                  >
                    {selectedOption.image}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-indigo-800 mb-2">
                    Your Visual Preference: {selectedOption.title}
                  </h3>
                  
                  <p className="text-lg text-gray-700 mb-4">
                    {selectedOption.description}
                  </p>
                  
                  {/* Preference Spectrum Bar */}
                  <div className="max-w-md mx-auto">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedOption.value}%` }}
                        transition={{ delay: 1, duration: 1.5 }}
                        className={`h-full bg-gradient-to-r from-${selectedOption.color}-400 to-${selectedOption.color}-600`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Structured</span>
                      <span>Bold</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personality Insight */}
      <AnimatePresence>
        {isSubmitted && selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-orange-600" />
                  <h4 className="font-bold text-orange-800">Visual Psychology Insight</h4>
                  <Eye className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-gray-700">
                  Your preference for <span className="font-semibold text-orange-700">
                  {selectedOption.title}</span> visuals suggests you're drawn to environments and 
                  experiences that match this aesthetic. This influences how you process information, 
                  make decisions, and interact with your surroundings.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="mt-8 text-center">
        <div className="flex justify-center items-center gap-2">
          {visualOptions.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-2 h-2 rounded-full transition-colors ${
                selectedId && visualOptions.findIndex(opt => opt.id === selectedId) === index
                  ? `bg-${visualOptions[index].color}-500`
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {!selectedId ? 'Select your visual preference' : 
           !isSubmitted ? 'Processing your choice...' :
           'Visual preference captured!'}
        </p>
      </div>
    </motion.div>
  );
}
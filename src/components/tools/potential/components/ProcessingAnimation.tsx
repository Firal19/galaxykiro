"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Zap,
  Star,
  Trophy
} from 'lucide-react';

export function ProcessingAnimation() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Analyzing Your Responses",
      description: "Processing 49 data points across 7 dimensions",
      color: "text-blue-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Identifying Patterns",
      description: "Discovering your unique potential signature",
      color: "text-purple-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Generating Insights",
      description: "Creating personalized recommendations",
      color: "text-green-600"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Preparing Your Results",
      description: "Crafting your superpower profile",
      color: "text-orange-600"
    }
  ];

  const funFacts = [
    "Your brain just made over 49 micro-decisions!",
    "Research shows self-assessment improves performance by 23%",
    "You're in the top 5% of people who complete growth assessments",
    "Each answer revealed something unique about your potential"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 2, 100);
        const newStep = Math.floor(newProgress / 25);
        setCurrentStep(newStep);
        return newProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"
    >
      <div className="max-w-2xl w-full">
        {/* Main Processing Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-12">
            {/* Animated Logo */}
            <motion.div
              className="text-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Unlocking Your Potential
              </h2>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={progress} className="h-3 bg-purple-100" />
              <p className="text-center text-sm text-gray-600 mt-2">
                {Math.round(progress)}% Complete
              </p>
            </div>

            {/* Processing Steps */}
            <div className="space-y-4 mb-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.3,
                    x: 0 
                  }}
                  transition={{ delay: index * 0.5 }}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    index === currentStep 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 scale-105' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className={`${step.color} ${index === currentStep ? 'animate-pulse' : ''}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {index < currentStep && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-600"
                    >
                      ✓
                    </motion.div>
                  )}
                  {index === currentStep && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={step.color}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Fun Facts Carousel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Did You Know?</span>
                    </div>
                    <p className="text-gray-700">
                      {funFacts[currentStep] || funFacts[0]}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
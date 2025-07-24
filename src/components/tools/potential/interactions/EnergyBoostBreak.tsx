"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Star, Trophy, Sparkles } from 'lucide-react';

interface EnergyBoostBreakProps {
  onContinue: () => void;
  progress: {
    completed: number;
    insights: number;
    points: number;
  };
}

export function EnergyBoostBreak({ onContinue, progress }: EnergyBoostBreakProps) {
  const [showMotivation, setShowMotivation] = useState(false);
  
  const achievements = [
    { icon: "🎯", label: "Questions Completed", value: progress.completed },
    { icon: "⚡", label: "Insights Unlocked", value: progress.insights },
    { icon: "🌟", label: "Potential Points", value: progress.points }
  ];
  
  useEffect(() => {
    const timer = setTimeout(() => setShowMotivation(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-purple-100 to-pink-100"
    >
      <div className="max-w-2xl w-full">
        {/* Celebration Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-center mb-8"
        >
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            You're Halfway There!
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Take a moment to celebrate your progress
          </p>
        </motion.div>
        
        {/* Achievement Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <motion.div 
                    className="text-3xl font-bold text-purple-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
                  >
                    {achievement.value}
                  </motion.div>
                  <p className="text-sm text-gray-600">{achievement.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Motivational Message */}
        <AnimatePresence>
          {showMotivation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-none shadow-lg">
                <CardContent className="p-8 text-center">
                  <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    "The fact that you're here, investing in understanding yourself better, 
                    shows remarkable self-awareness. You're already in the top 10% of people 
                    who take action on personal growth!"
                  </p>
                  <p className="text-sm text-gray-500">
                    — Dr. Sarah Chen, Potential Psychology Researcher
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Fun Facts Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-8"
        >
          <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  🧠
                </div>
                <h3 className="font-semibold text-purple-800">Did You Know?</h3>
              </div>
              <p className="text-gray-700">
                Your brain is literally rewiring itself as you answer each question. 
                Self-reflection creates new neural pathways that strengthen your self-awareness!
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={onContinue}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-w-[200px] shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            I'm Ready for More!
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Only 24 questions left
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              10 minutes remaining
            </span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Battery, Zap, Minus, Plus } from 'lucide-react';

interface EnergyDistributionQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    energyAreas: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      color: string;
      minEnergy: number;
      maxEnergy: number;
    }>;
    totalEnergy: number;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { 
    distribution: Record<string, number>;
    percentages: Record<string, number>;
    energyProfile: string;
    timestamp: Date;
  }) => void;
}

const defaultEnergyAreas = [
  {
    id: 'work',
    name: 'Professional Work',
    description: 'Career tasks, meetings, skill development',
    icon: '💼',
    color: '#3B82F6',
    minEnergy: 10,
    maxEnergy: 70
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Family time, social connections, communication',
    icon: '❤️',
    color: '#EF4444',
    minEnergy: 5,
    maxEnergy: 50
  },
  {
    id: 'health',
    name: 'Physical Health',
    description: 'Exercise, nutrition, medical care, rest',
    icon: '💪',
    color: '#10B981',
    minEnergy: 10,
    maxEnergy: 40
  },
  {
    id: 'learning',
    name: 'Learning & Growth',
    description: 'Reading, courses, new skills, self-reflection',
    icon: '🧠',
    color: '#8B5CF6',
    minEnergy: 5,
    maxEnergy: 35
  },
  {
    id: 'creativity',
    name: 'Creative Expression',
    description: 'Hobbies, art, music, creative projects',
    icon: '🎨',
    color: '#F59E0B',
    minEnergy: 0,
    maxEnergy: 30
  },
  {
    id: 'service',
    name: 'Service & Contribution',
    description: 'Helping others, volunteering, community work',
    icon: '🤝',
    color: '#06B6D4',
    minEnergy: 0,
    maxEnergy: 25
  }
];

export function EnergyDistributionQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: EnergyDistributionQuestionProps) {
  const energyAreas = question.energyAreas || defaultEnergyAreas;
  const totalEnergy = question.totalEnergy || 100;
  
  const [distribution, setDistribution] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    energyAreas.forEach(area => {
      initial[area.id] = area.minEnergy;
    });
    return initial;
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeArea, setActiveArea] = useState<string | null>(null);

  const totalAllocated = Object.values(distribution).reduce((sum, energy) => sum + energy, 0);
  const remainingEnergy = totalEnergy - totalAllocated;
  const isValid = Math.abs(remainingEnergy) <= 2; // Allow small rounding differences

  const adjustEnergy = useCallback((areaId: string, change: number) => {
    if (isSubmitted) return;
    
    const area = energyAreas.find(a => a.id === areaId);
    if (!area) return;
    
    const currentValue = distribution[areaId];
    const newValue = Math.max(
      area.minEnergy,
      Math.min(area.maxEnergy, currentValue + change)
    );
    
    // Check if we have enough remaining energy
    if (change > 0 && remainingEnergy < change) return;
    
    setDistribution(prev => ({
      ...prev,
      [areaId]: newValue
    }));
  }, [distribution, remainingEnergy, energyAreas, isSubmitted]);

  const handleSubmit = () => {
    if (!isValid) return;
    
    const percentages: Record<string, number> = {};
    Object.entries(distribution).forEach(([areaId, energy]) => {
      percentages[areaId] = Math.round((energy / totalEnergy) * 100);
    });
    
    const energyProfile = analyzeEnergyProfile(percentages);
    
    setIsSubmitted(true);
    onAnswer({
      distribution,
      percentages,
      energyProfile,
      timestamp: new Date()
    });
  };

  const analyzeEnergyProfile = (percentages: Record<string, number>): string => {
    const workEnergy = percentages.work || 0;
    const relationshipEnergy = percentages.relationships || 0;
    const healthEnergy = percentages.health || 0;
    const learningEnergy = percentages.learning || 0;
    
    if (workEnergy > 50) return 'Career-Focused Achiever';
    if (relationshipEnergy > 30) return 'Connection-Centered Nurturer';
    if (healthEnergy > 25) return 'Wellness-Oriented Optimizer';
    if (learningEnergy > 20) return 'Growth-Minded Explorer';
    
    const balanced = Object.values(percentages).filter(p => p >= 15 && p <= 25).length;
    if (balanced >= 4) return 'Holistic Life Balancer';
    
    return 'Adaptive Energy Manager';
  };

  const autoBalance = () => {
    if (isSubmitted) return;
    
    const newDistribution: Record<string, number> = {};
    const totalMin = energyAreas.reduce((sum, area) => sum + area.minEnergy, 0);
    const remaining = totalEnergy - totalMin;
    const perArea = Math.floor(remaining / energyAreas.length);
    
    energyAreas.forEach((area, index) => {
      const extra = index < remaining % energyAreas.length ? 1 : 0;
      newDistribution[area.id] = area.minEnergy + perArea + extra;
    });
    
    setDistribution(newDistribution);
  };

  const getEnergyBar = (percentage: number, color: string) => {
    return (
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Battery className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold">{question.content[currentLanguage]}</h2>
          <Zap className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-gray-600">
          Allocate your {totalEnergy} energy points across different life areas
        </p>
        <Badge className="bg-green-100 text-green-700 mt-2">
          Energy Distribution
        </Badge>
      </div>

      {/* Energy Summary */}
      <div className="mb-8">
        <Card className={`${isValid ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{totalAllocated}</div>
                <div className="text-sm text-gray-600">Energy Used</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${remainingEnergy >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {remainingEnergy}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{totalEnergy}</div>
                <div className="text-sm text-gray-600">Total Energy</div>
              </div>
            </div>
            
            {totalAllocated === 0 && (
              <div className="mt-4 text-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={autoBalance}
                  className="text-blue-600 border-blue-300"
                >
                  Auto Balance Energy
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Energy Areas */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {energyAreas.map((area, index) => {
          const currentEnergy = distribution[area.id] || 0;
          const percentage = totalEnergy > 0 ? (currentEnergy / totalEnergy) * 100 : 0;
          
          return (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setActiveArea(area.id)}
              onHoverEnd={() => setActiveArea(null)}
            >
              <Card 
                className={`border-2 transition-all duration-300 ${
                  activeArea === area.id
                    ? 'shadow-lg scale-105 border-purple-300'
                    : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{area.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{area.name}</h3>
                      <p className="text-sm text-gray-600">{area.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: area.color }}>
                        {currentEnergy}
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Energy Bar */}
                  <div className="mb-4">
                    {getEnergyBar(percentage, area.color)}
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustEnergy(area.id, -5)}
                      disabled={currentEnergy <= area.minEnergy || isSubmitted}
                      className="w-10 h-8"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustEnergy(area.id, -1)}
                      disabled={currentEnergy <= area.minEnergy || isSubmitted}
                      className="w-8 h-8"
                    >
                      -1
                    </Button>
                    <div className="w-16 text-center font-medium">{currentEnergy}</div>
                    <Button
                      size="sm"
                      onClick={() => adjustEnergy(area.id, 1)}
                      disabled={currentEnergy >= area.maxEnergy || remainingEnergy < 1 || isSubmitted}
                      className="w-8 h-8"
                      style={{ backgroundColor: area.color }}
                    >
                      +1
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => adjustEnergy(area.id, 5)}
                      disabled={currentEnergy >= area.maxEnergy || remainingEnergy < 5 || isSubmitted}
                      className="w-10 h-8"
                      style={{ backgroundColor: area.color }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center mt-2">
                    Range: {area.minEnergy} - {area.maxEnergy} energy
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Energy Profile Preview */}
      {totalAllocated > 50 && (
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-center mb-4">Your Energy Profile</h3>
              <div className="text-center">
                <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">
                  {analyzeEnergyProfile(Object.fromEntries(
                    Object.entries(distribution).map(([id, energy]) => [id, Math.round((energy / totalEnergy) * 100)])
                  ))}
                </Badge>
                <p className="text-gray-700 mt-3">
                  Your energy allocation reveals your current life priorities and focus areas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isValid ? 1 : 0.5 }}
        className="text-center"
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!isValid || isSubmitted}
          className="bg-gradient-to-r from-green-600 to-emerald-600"
        >
          {isSubmitted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Energy Distribution Complete!
            </>
          ) : (
            'Submit My Energy Plan'
          )}
        </Button>
        
        {!isValid && (
          <p className="text-sm text-gray-500 mt-2">
            {remainingEnergy > 2 
              ? `Allocate ${remainingEnergy} more energy points`
              : `Reduce allocation by ${Math.abs(remainingEnergy)} points`
            }
          </p>
        )}
      </motion.div>

      {/* Energy Analysis */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-bold text-yellow-800 mb-4">Your Energy Insights</h4>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {Object.entries(distribution)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([areaId, energy], index) => {
                        const area = energyAreas.find(a => a.id === areaId);
                        if (!area) return null;
                        
                        const percentage = Math.round((energy / totalEnergy) * 100);
                        const labels = ['Highest Energy', 'Second Focus', 'Third Priority'];
                        
                        return (
                          <div key={areaId} className="text-center">
                            <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                              {labels[index]}
                            </Badge>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-2xl">{area.icon}</span>
                              <div>
                                <p className="font-medium">{area.name}</p>
                                <p className="text-sm text-gray-600">{energy} energy ({percentage}%)</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  <p className="text-gray-700">
                    Your energy allocation shows where you naturally invest your time and attention. 
                    This pattern reflects your current life phase and what matters most to you right now.
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
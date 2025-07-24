"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, Clock, PieChart } from 'lucide-react';

interface TimeAllocationQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    categories: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      color: string;
      minValue?: number;
      maxValue?: number;
    }>;
    totalHours: number;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { allocations: Record<string, number>; percentages: Record<string, number>; timestamp: Date }) => void;
}

const defaultCategories = [
  {
    id: 'work',
    name: 'Work & Career',
    description: 'Professional activities, skill building, networking',
    icon: '💼',
    color: '#3B82F6',
    minValue: 2,
    maxValue: 16
  },
  {
    id: 'family',
    name: 'Family & Relationships',
    description: 'Quality time with loved ones, social connections',
    icon: '👨‍👩‍👧‍👦',
    color: '#EF4444',
    minValue: 1,
    maxValue: 12
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    description: 'Exercise, nutrition, mental health, self-care',
    icon: '🏃‍♂️',
    color: '#10B981',
    minValue: 0.5,
    maxValue: 6
  },
  {
    id: 'learning',
    name: 'Learning & Growth',
    description: 'Education, reading, skill development, hobbies',
    icon: '📚',
    color: '#8B5CF6',
    minValue: 0.5,
    maxValue: 8
  },
  {
    id: 'leisure',
    name: 'Leisure & Entertainment',
    description: 'Relaxation, entertainment, fun activities',
    icon: '🎮',
    color: '#F59E0B',
    minValue: 0.5,
    maxValue: 8
  },
  {
    id: 'sleep',
    name: 'Sleep & Rest',
    description: 'Essential rest and recovery time',
    icon: '😴',
    color: '#6B7280',
    minValue: 4,
    maxValue: 12
  }
];

export function TimeAllocationQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: TimeAllocationQuestionProps) {
  const categories = question.categories || defaultCategories;
  const totalHours = question.totalHours || 24;
  
  const [allocations, setAllocations] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    categories.forEach(cat => {
      initial[cat.id] = cat.minValue || 1;
    });
    return initial;
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const remainingHours = Math.max(0, totalHours - totalAllocated);
  const isValid = Math.abs(totalAllocated - totalHours) < 0.1;

  const updateAllocation = useCallback((categoryId: string, value: number) => {
    if (isSubmitted) return;
    
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const minVal = category.minValue || 0;
    const maxVal = category.maxValue || totalHours;
    const clampedValue = Math.max(minVal, Math.min(maxVal, value));
    
    setAllocations(prev => ({
      ...prev,
      [categoryId]: clampedValue
    }));
  }, [categories, totalHours, isSubmitted]);

  const handleSubmit = () => {
    if (!isValid) return;
    
    const percentages: Record<string, number> = {};
    Object.entries(allocations).forEach(([id, hours]) => {
      percentages[id] = Math.round((hours / totalHours) * 100);
    });
    
    setIsSubmitted(true);
    onAnswer({
      allocations,
      percentages,
      timestamp: new Date()
    });
  };

  const autoBalance = () => {
    if (isSubmitted) return;
    
    const excess = totalAllocated - totalHours;
    if (Math.abs(excess) < 0.1) return;
    
    const newAllocations = { ...allocations };
    const adjustableCategories = categories.filter(cat => {
      const current = newAllocations[cat.id];
      const min = cat.minValue || 0;
      const max = cat.maxValue || totalHours;
      return excess > 0 ? current > min : current < max;
    });
    
    if (adjustableCategories.length === 0) return;
    
    const adjustment = excess / adjustableCategories.length;
    
    adjustableCategories.forEach(cat => {
      const current = newAllocations[cat.id];
      const min = cat.minValue || 0;
      const max = cat.maxValue || totalHours;
      newAllocations[cat.id] = Math.max(min, Math.min(max, current - adjustment));
    });
    
    setAllocations(newAllocations);
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
          <Clock className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">{question.content[currentLanguage]}</h2>
          <PieChart className="w-6 h-6 text-purple-600" />
        </div>
        <p className="text-gray-600">
          Allocate your {totalHours} hours across these life categories
        </p>
        <Badge className="bg-purple-100 text-purple-700 mt-2">
          Time Allocation
        </Badge>
      </div>

      {/* Time Summary */}
      <div className="mb-8">
        <Card className={`${isValid ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{totalAllocated.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Hours Allocated</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${remainingHours === 0 ? 'text-green-600' : remainingHours > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                  {remainingHours.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{totalHours}</div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
            </div>
            
            {!isValid && (
              <div className="mt-4 text-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={autoBalance}
                  className="text-orange-600 border-orange-300"
                >
                  Auto Balance
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Sliders */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setActiveCategory(category.id)}
            onHoverEnd={() => setActiveCategory(null)}
          >
            <Card 
              className={`border-2 transition-all duration-300 ${
                activeCategory === category.id
                  ? 'shadow-lg scale-105 border-purple-300'
                  : 'border-gray-200 hover:shadow-md'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: category.color }}>
                      {allocations[category.id].toFixed(1)}h
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((allocations[category.id] / totalHours) * 100)}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Slider
                    value={[allocations[category.id]]}
                    onValueChange={([value]) => updateAllocation(category.id, value)}
                    min={category.minValue || 0}
                    max={category.maxValue || totalHours}
                    step={0.5}
                    className="w-full"
                    disabled={isSubmitted}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{category.minValue || 0}h min</span>
                    <span>{category.maxValue || totalHours}h max</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Visual Pie Chart Representation */}
      <div className="mb-8">
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-center mb-4">Your Time Distribution</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => {
                const percentage = (allocations[category.id] / totalHours) * 100;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">
                      {category.name}: {percentage.toFixed(1)}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

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
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {isSubmitted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Time Allocation Captured!
            </>
          ) : (
            'Confirm My Time Allocation'
          )}
        </Button>
      </motion.div>

      {/* Time Allocation Insight */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-bold text-blue-800 mb-3">Your Time Priorities Revealed</h4>
                  
                  {/* Top 3 allocations */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {Object.entries(allocations)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([categoryId, hours], index) => {
                        const category = categories.find(cat => cat.id === categoryId);
                        if (!category) return null;
                        
                        const labels = ['Highest Priority', 'Second Priority', 'Third Priority'];
                        return (
                          <div key={categoryId} className="text-center">
                            <Badge className="bg-blue-100 text-blue-800 mb-2">
                              {labels[index]}
                            </Badge>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-xl">{category.icon}</span>
                              <div>
                                <p className="font-medium">{category.name}</p>
                                <p className="text-sm text-gray-600">{hours.toFixed(1)} hours</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  <p className="text-gray-700">
                    Your time allocation reveals your true priorities and values. How you choose to spend 
                    your hours reflects what matters most to you in this phase of your life.
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
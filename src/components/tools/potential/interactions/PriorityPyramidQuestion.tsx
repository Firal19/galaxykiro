"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Triangle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityPyramidQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    items: Array<{
      id: string;
      text: string;
      description: string;
      icon: string;
      category: string;
    }>;
    pyramidLevels: {
      top: { name: string; slots: number; description: string };
      middle: { name: string; slots: number; description: string };
      bottom: { name: string; slots: number; description: string };
    };
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { 
    pyramid: Record<string, string[]>; 
    priorities: Record<string, number>;
    timestamp: Date;
  }) => void;
}

const defaultItems = [
  {
    id: 'health',
    text: 'Physical Health',
    description: 'Exercise, nutrition, medical care',
    icon: '💪',
    category: 'personal'
  },
  {
    id: 'family',
    text: 'Family Relationships',
    description: 'Time with loved ones, family traditions',
    icon: '👨‍👩‍👧‍👦',
    category: 'relationships'
  },
  {
    id: 'career',
    text: 'Career Growth',
    description: 'Professional development, advancement',
    icon: '📈',
    category: 'professional'
  },
  {
    id: 'finances',
    text: 'Financial Security',
    description: 'Savings, investments, debt management',
    icon: '💰',
    category: 'security'
  },
  {
    id: 'learning',
    text: 'Personal Learning',
    description: 'New skills, education, reading',
    icon: '📚',
    category: 'growth'
  },
  {
    id: 'friends',
    text: 'Social Connections',
    description: 'Friendships, social activities',
    icon: '👥',
    category: 'relationships'
  },
  {
    id: 'hobbies',
    text: 'Hobbies & Interests',
    description: 'Creative pursuits, recreational activities',
    icon: '🎨',
    category: 'personal'
  },
  {
    id: 'service',
    text: 'Community Service',
    description: 'Volunteering, helping others',
    icon: '🤝',
    category: 'contribution'
  },
  {
    id: 'spirituality',
    text: 'Spiritual Growth',
    description: 'Meditation, philosophy, meaning',
    icon: '🙏',
    category: 'personal'
  }
];

const defaultPyramidLevels = {
  top: { name: 'Essential', slots: 2, description: 'Absolutely crucial - you would sacrifice everything else for these' },
  middle: { name: 'Important', slots: 3, description: 'Very important but you could adapt if necessary' },
  bottom: { name: 'Valuable', slots: 4, description: 'Nice to have - you pursue these when other needs are met' }
};

export function PriorityPyramidQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: PriorityPyramidQuestionProps) {
  const items = question.items || defaultItems;
  const pyramidLevels = question.pyramidLevels || defaultPyramidLevels;
  
  const [pyramid, setPyramid] = useState<Record<string, string[]>>({
    top: [],
    middle: [],
    bottom: []
  });
  
  const [availableItems, setAvailableItems] = useState<string[]>(
    items.map(item => item.id)
  );
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const moveItemToPyramid = useCallback((itemId: string, level: string) => {
    if (isSubmitted) return;
    
    const levelData = pyramidLevels[level as keyof typeof pyramidLevels];
    if (pyramid[level].length >= levelData.slots) return;
    
    setPyramid(prev => ({
      ...prev,
      [level]: [...prev[level], itemId]
    }));
    
    setAvailableItems(prev => prev.filter(id => id !== itemId));
  }, [pyramid, pyramidLevels, isSubmitted]);

  const removeItemFromPyramid = useCallback((itemId: string, level: string) => {
    if (isSubmitted) return;
    
    setPyramid(prev => ({
      ...prev,
      [level]: prev[level].filter(id => id !== itemId)
    }));
    
    setAvailableItems(prev => [...prev, itemId]);
  }, [isSubmitted]);

  const handleSubmit = () => {
    const totalPlaced = Object.values(pyramid).reduce((sum, items) => sum + items.length, 0);
    if (totalPlaced !== items.length) return;
    
    const priorities: Record<string, number> = {};
    
    // Assign priority scores based on pyramid level
    pyramid.top.forEach(itemId => { priorities[itemId] = 100; });
    pyramid.middle.forEach(itemId => { priorities[itemId] = 75; });
    pyramid.bottom.forEach(itemId => { priorities[itemId] = 50; });
    
    setIsSubmitted(true);
    onAnswer({
      pyramid,
      priorities,
      timestamp: new Date()
    });
  };

  const getItemData = (itemId: string) => {
    return items.find(item => item.id === itemId);
  };

  const totalPlaced = Object.values(pyramid).reduce((sum, items) => sum + items.length, 0);
  const allItemsPlaced = totalPlaced === items.length;

  const pyramidLevelOrder = ['top', 'middle', 'bottom'] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Triangle className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-bold">{question.content[currentLanguage]}</h2>
          <Triangle className="w-6 h-6 text-yellow-600" />
        </div>
        <p className="text-gray-600">
          Organize your priorities into a pyramid - most important at the top
        </p>
        <Badge className="bg-yellow-100 text-yellow-700 mt-2">
          Priority Pyramid
        </Badge>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800 text-center">
              <span className="font-medium">How it works:</span> Drag items from the pool below 
              into the pyramid levels. The top has limited space - only your most essential priorities fit there.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Pyramid Structure */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-center mb-6">Your Priority Pyramid</h3>
          <div className="space-y-4">
            {pyramidLevelOrder.map((level, levelIndex) => {
              const levelData = pyramidLevels[level];
              const levelItems = pyramid[level];
              const slotsUsed = levelItems.length;
              const slotsTotal = levelData.slots;
              
              return (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: levelIndex * 0.1 }}
                >
                  <Card 
                    className={`border-2 ${
                      level === 'top' ? 'border-yellow-300 bg-yellow-50' :
                      level === 'middle' ? 'border-orange-300 bg-orange-50' :
                      'border-red-300 bg-red-50'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg">{levelData.name}</h4>
                        <Badge className={
                          level === 'top' ? 'bg-yellow-100 text-yellow-800' :
                          level === 'middle' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {slotsUsed}/{slotsTotal} items
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{levelData.description}</p>
                      
                      {/* Items in this level */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[120px]">
                        <AnimatePresence>
                          {levelItems.map((itemId) => {
                            const itemData = getItemData(itemId);
                            if (!itemData) return null;
                            
                            return (
                              <motion.div
                                key={itemId}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => removeItemFromPyramid(itemId, level)}
                                className="cursor-pointer"
                              >
                                <Card className="bg-white hover:shadow-md transition-all border">
                                  <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl">{itemData.icon}</span>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{itemData.text}</p>
                                        <p className="text-xs text-gray-500 truncate">{itemData.description}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                        
                        {/* Empty slots */}
                        {Array.from({ length: slotsTotal - slotsUsed }).map((_, index) => (
                          <div
                            key={`empty-${level}-${index}`}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center text-gray-400 text-sm flex items-center justify-center min-h-[60px]"
                          >
                            Drop item here
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Available Items Pool */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-center mb-6">Available Items</h3>
          <Card className="bg-gray-50 border-2 border-dashed border-gray-300 min-h-[400px]">
            <CardContent className="p-4">
              <div className="space-y-3">
                <AnimatePresence>
                  {availableItems.map((itemId) => {
                    const itemData = getItemData(itemId);
                    if (!itemData) return null;
                    
                    return (
                      <motion.div
                        key={itemId}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                      >
                        <Card className="bg-white hover:shadow-md transition-all border">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{itemData.icon}</span>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{itemData.text}</p>
                                <p className="text-xs text-gray-500">{itemData.description}</p>
                              </div>
                            </div>
                            
                            {/* Quick action buttons */}
                            <div className="flex gap-1 mt-2">
                              {pyramidLevelOrder.map((level) => {
                                const levelData = pyramidLevels[level];
                                const canAdd = pyramid[level].length < levelData.slots;
                                return (
                                  <Button
                                    key={level}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => canAdd && moveItemToPyramid(itemId, level)}
                                    disabled={!canAdd || isSubmitted}
                                    className={`text-xs px-2 py-1 h-6 ${
                                      level === 'top' ? 'text-yellow-600' :
                                      level === 'middle' ? 'text-orange-600' :
                                      'text-red-600'
                                    }`}
                                  >
                                    {level === 'top' ? '↑ Essential' :
                                     level === 'middle' ? '↑ Important' :
                                     '↑ Valuable'}
                                  </Button>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
              
              {availableItems.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>All items placed!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: allItemsPlaced ? 1 : 0.5 }}
        className="text-center mt-8"
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!allItemsPlaced || isSubmitted}
          className="bg-gradient-to-r from-yellow-600 to-orange-600"
        >
          {isSubmitted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Pyramid Complete!
            </>
          ) : (
            'Submit My Pyramid'
          )}
        </Button>
        
        {!allItemsPlaced && (
          <p className="text-sm text-gray-500 mt-2">
            Place all {items.length} items in the pyramid to continue
          </p>
        )}
      </motion.div>

      {/* Priority Analysis */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-bold text-green-800 mb-4">Your Priority Structure Revealed</h4>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {pyramidLevelOrder.map((level) => {
                      const levelData = pyramidLevels[level];
                      const levelItems = pyramid[level];
                      return (
                        <div key={level} className="text-center">
                          <Badge className={`mb-2 ${
                            level === 'top' ? 'bg-yellow-100 text-yellow-800' :
                            level === 'middle' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {levelData.name} Level
                          </Badge>
                          <div className="space-y-1">
                            {levelItems.map(itemId => {
                              const item = getItemData(itemId);
                              return item ? (
                                <p key={itemId} className="text-sm flex items-center justify-center gap-1">
                                  <span>{item.icon}</span>
                                  <span>{item.text}</span>
                                </p>
                              ) : null;
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <p className="text-gray-700">
                    Your pyramid reveals your core value system and how you instinctively prioritize 
                    when resources are limited. This structure guides your daily decisions and long-term planning.
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
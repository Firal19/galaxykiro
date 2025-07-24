"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowUpDown, GripVertical } from 'lucide-react';

interface RankingMatrixQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    items: Array<{
      id: string;
      text: string;
      description: string;
      icon: string;
    }>;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { rankings: string[]; priorities: Record<string, number>; timestamp: Date }) => void;
}

const defaultItems = [
  {
    id: 'achievement',
    text: 'Personal Achievement',
    description: 'Reaching goals and accomplishing meaningful objectives',
    icon: '🏆'
  },
  {
    id: 'relationships',
    text: 'Strong Relationships',
    description: 'Deep connections with family, friends, and community',
    icon: '❤️'
  },
  {
    id: 'creativity',
    text: 'Creative Expression',
    description: 'Artistic pursuits and innovative thinking',
    icon: '🎨'
  },
  {
    id: 'security',
    text: 'Financial Security',
    description: 'Stable income and financial independence',
    icon: '💰'
  },
  {
    id: 'health',
    text: 'Physical Health',
    description: 'Fitness, wellness, and taking care of your body',
    icon: '💪'
  },
  {
    id: 'learning',
    text: 'Continuous Learning',
    description: 'Growing knowledge and developing new skills',
    icon: '📚'
  }
];

export function RankingMatrixQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: RankingMatrixQuestionProps) {
  const items = question.items || defaultItems;
  const [rankings, setRankings] = useState<string[]>(items.map(item => item.id));
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (isSubmitted) return;
    
    setRankings(prev => {
      const newRankings = [...prev];
      const [movedItem] = newRankings.splice(fromIndex, 1);
      newRankings.splice(toIndex, 0, movedItem);
      return newRankings;
    });
  }, [isSubmitted]);

  const handleDragStart = (itemId: string) => {
    if (isSubmitted) return;
    setDraggedItem(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (targetIndex: number) => {
    if (!draggedItem || isSubmitted) return;
    
    const fromIndex = rankings.indexOf(draggedItem);
    if (fromIndex !== -1 && fromIndex !== targetIndex) {
      moveItem(fromIndex, targetIndex);
    }
  };

  const handleSubmit = () => {
    const priorities: Record<string, number> = {};
    rankings.forEach((itemId, index) => {
      priorities[itemId] = rankings.length - index; // Higher rank = higher number
    });
    
    setIsSubmitted(true);
    onAnswer({
      rankings,
      priorities,
      timestamp: new Date()
    });
  };

  const getItemData = (itemId: string) => {
    return items.find(item => item.id === itemId);
  };

  const getRankingLabel = (index: number) => {
    const labels = ['1st Priority', '2nd Priority', '3rd Priority', '4th Priority', '5th Priority', '6th Priority'];
    return labels[index] || `${index + 1}th Priority`;
  };

  const getRankingColor = (index: number) => {
    const colors = [
      'from-yellow-400 to-orange-500',
      'from-orange-400 to-red-500', 
      'from-purple-400 to-pink-500',
      'from-blue-400 to-indigo-500',
      'from-green-400 to-teal-500',
      'from-gray-400 to-slate-500'
    ];
    return colors[index] || 'from-gray-400 to-slate-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ArrowUpDown className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">{question.content[currentLanguage]}</h2>
          <ArrowUpDown className="w-6 h-6 text-purple-600" />
        </div>
        <p className="text-gray-600">
          Drag and drop to rank these items by importance to you
        </p>
        <Badge className="bg-purple-100 text-purple-700 mt-2">
          Ranking Matrix
        </Badge>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <GripVertical className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                <span className="font-medium">How to rank:</span> Drag items up or down to reorder them. 
                Your top priority should be at the top of the list.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking List */}
      <div className="space-y-4 mb-8">
        <AnimatePresence>
          {rankings.map((itemId, index) => {
            const itemData = getItemData(itemId);
            if (!itemData) return null;
            
            return (
              <motion.div
                key={itemId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                draggable={!isSubmitted}
                onDragStart={() => handleDragStart(itemId)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className={`cursor-move ${isSubmitted ? 'cursor-default' : ''}`}
              >
                <Card 
                  className={`border-2 transition-all duration-300 ${
                    draggedItem === itemId
                      ? 'border-purple-500 shadow-xl scale-105 rotate-2'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                  } ${isSubmitted ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`min-w-[120px] h-16 rounded-lg bg-gradient-to-r ${getRankingColor(index)} 
                          flex items-center justify-center text-white font-bold shadow-lg`}
                      >
                        <div className="text-center">
                          <div className="text-2xl">{index + 1}</div>
                          <div className="text-xs">{getRankingLabel(index).split(' ')[0]}</div>
                        </div>
                      </motion.div>
                      
                      {/* Item Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{itemData.icon}</span>
                          <h3 className="text-xl font-bold text-gray-800">
                            {itemData.text}
                          </h3>
                        </div>
                        <p className="text-gray-600">
                          {itemData.description}
                        </p>
                      </div>
                      
                      {/* Drag Handle */}
                      {!isSubmitted && (
                        <div className="text-gray-400 hover:text-gray-600 transition-colors">
                          <GripVertical className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitted}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {isSubmitted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Rankings Captured!
            </>
          ) : (
            'Confirm My Rankings'
          )}
        </Button>
      </motion.div>

      {/* Ranking Insight */}
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
                  <h4 className="font-bold text-green-800 mb-3">Your Priority Hierarchy Revealed</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Badge className="bg-yellow-100 text-yellow-800 mb-2">Top Priority</Badge>
                      <p className="font-medium">{getItemData(rankings[0])?.text}</p>
                    </div>
                    <div>
                      <Badge className="bg-blue-100 text-blue-800 mb-2">Core Focus</Badge>
                      <p className="font-medium">{getItemData(rankings[1])?.text}</p>
                    </div>
                    <div>
                      <Badge className="bg-purple-100 text-purple-800 mb-2">Important Goal</Badge>
                      <p className="font-medium">{getItemData(rankings[2])?.text}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-4">
                    Your rankings reveal your core values and what drives your decision-making. 
                    Understanding your priority hierarchy helps align your actions with what truly matters to you.
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
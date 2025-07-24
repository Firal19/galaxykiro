"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface CardSortQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    cards: Array<{
      id: string;
      text: string;
      category: 'important' | 'neutral' | 'unimportant';
    }>;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { sorted: Record<string, string[]>; timestamp: Date }) => void;
}

const defaultCards = [
  { id: '1', text: 'Financial Security', category: 'important' as const },
  { id: '2', text: 'Creative Expression', category: 'important' as const },
  { id: '3', text: 'Work-Life Balance', category: 'important' as const },
  { id: '4', text: 'Social Recognition', category: 'neutral' as const },
  { id: '5', text: 'Personal Growth', category: 'important' as const },
  { id: '6', text: 'Helping Others', category: 'important' as const },
  { id: '7', text: 'Job Title', category: 'neutral' as const },
  { id: '8', text: 'Independence', category: 'important' as const },
  { id: '9', text: 'Luxury Items', category: 'unimportant' as const },
  { id: '10', text: 'Adventure', category: 'neutral' as const }
];

export function CardSortQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: CardSortQuestionProps) {
  const cards = question.cards || defaultCards;
  
  const [sortedCards, setSortedCards] = useState<Record<string, string[]>>({
    important: [],
    neutral: [],
    unimportant: []
  });
  
  const [availableCards, setAvailableCards] = useState<string[]>(
    cards.map(card => card.id)
  );
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moveCard = useCallback((cardId: string, toCategory: string) => {
    if (isSubmitted) return;
    
    setSortedCards(prev => {
      const newSorted = { ...prev };
      
      // Remove from all categories
      Object.keys(newSorted).forEach(category => {
        newSorted[category] = newSorted[category].filter(id => id !== cardId);
      });
      
      // Add to target category
      newSorted[toCategory] = [...newSorted[toCategory], cardId];
      
      return newSorted;
    });
    
    setAvailableCards(prev => prev.filter(id => id !== cardId));
  }, [isSubmitted]);

  const removeFromCategory = useCallback((cardId: string) => {
    if (isSubmitted) return;
    
    setSortedCards(prev => {
      const newSorted = { ...prev };
      Object.keys(newSorted).forEach(category => {
        newSorted[category] = newSorted[category].filter(id => id !== cardId);
      });
      return newSorted;
    });
    
    setAvailableCards(prev => [...prev, cardId]);
  }, [isSubmitted]);

  const handleSubmit = () => {
    setIsSubmitted(true);
    onAnswer({
      sorted: sortedCards,
      timestamp: new Date()
    });
  };

  const getCardText = (cardId: string) => {
    return cards.find(card => card.id === cardId)?.text || '';
  };

  const totalSorted = Object.values(sortedCards).reduce((sum, arr) => sum + arr.length, 0);
  const allCardsSorted = totalSorted === cards.length;

  const categories = [
    { 
      id: 'important', 
      title: 'Very Important', 
      description: 'Essential for your happiness',
      color: 'bg-green-50 border-green-200',
      badgeColor: 'bg-green-100 text-green-700'
    },
    { 
      id: 'neutral', 
      title: 'Somewhat Important', 
      description: 'Nice to have but not critical',
      color: 'bg-yellow-50 border-yellow-200',
      badgeColor: 'bg-yellow-100 text-yellow-700'
    },
    { 
      id: 'unimportant', 
      title: 'Not Important', 
      description: 'You can live without these',
      color: 'bg-gray-50 border-gray-200',
      badgeColor: 'bg-gray-100 text-gray-700'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{question.content[currentLanguage]}</h2>
        <p className="text-gray-600">
          Drag the cards into categories that matter most to you
        </p>
        <Badge variant="outline" className="mt-2">
          {totalSorted}/{cards.length} cards sorted
        </Badge>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Available Cards */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold mb-4 text-center">Available Cards</h3>
          <div className="space-y-3 min-h-[200px]">
            <AnimatePresence>
              {availableCards.map((cardId) => (
                <motion.div
                  key={cardId}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <Card className="bg-white hover:shadow-md transition-all border-2 border-dashed border-gray-300">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm font-medium">{getCardText(cardId)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Category Columns */}
        <div className="lg:col-span-3 grid md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
                <Badge className={category.badgeColor}>
                  {sortedCards[category.id].length} cards
                </Badge>
              </div>
              
              <Card className={`min-h-[300px] ${category.color}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {sortedCards[category.id].map((cardId) => (
                        <motion.div
                          key={cardId}
                          layout
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          whileHover={{ scale: 1.02 }}
                          className="cursor-pointer"
                          onClick={() => removeFromCategory(cardId)}
                        >
                          <Card className="bg-white shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-3 text-center">
                              <p className="text-sm font-medium">{getCardText(cardId)}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Drop Zone */}
                    {!isSubmitted && sortedCards[category.id].length < 5 && (
                      <motion.div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-gray-400 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          // Simple click-to-move for available cards
                          if (availableCards.length > 0) {
                            moveCard(availableCards[0], category.id);
                          }
                        }}
                      >
                        <p className="text-sm">Drop cards here</p>
                        <p className="text-xs">or click to auto-fill</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Sort Buttons */}
      {!isSubmitted && availableCards.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Quick actions for remaining cards:</p>
          <div className="flex justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  availableCards.forEach(cardId => moveCard(cardId, category.id));
                }}
                disabled={availableCards.length === 0}
              >
                Move all to {category.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: allCardsSorted ? 1 : 0.5 }}
        className="mt-8 text-center"
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!allCardsSorted || isSubmitted}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {isSubmitted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Preferences Captured!
            </>
          ) : (
            'Confirm My Priorities'
          )}
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
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Insight:</span> You prioritized {sortedCards.important.length} key values. 
                  This reveals your core motivation patterns and what drives your decisions.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
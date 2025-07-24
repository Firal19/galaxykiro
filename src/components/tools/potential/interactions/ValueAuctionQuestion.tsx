"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, DollarSign, TrendingUp } from 'lucide-react';

interface ValueAuctionQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    values: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      startingBid: number;
    }>;
    totalBudget: number;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { bids: Record<string, number>; priorities: Record<string, number>; timestamp: Date }) => void;
}

const defaultValues = [
  {
    id: 'freedom',
    name: 'Freedom & Autonomy',
    description: 'Independence to make your own choices and control your time',
    icon: '🕊️',
    startingBid: 0
  },
  {
    id: 'security',
    name: 'Security & Stability',
    description: 'Financial safety and predictable future',
    icon: '🛡️',
    startingBid: 0
  },
  {
    id: 'recognition',
    name: 'Recognition & Status',
    description: 'Respect from others and social standing',
    icon: '🏆',
    startingBid: 0
  },
  {
    id: 'connection',
    name: 'Love & Connection',
    description: 'Deep relationships and emotional bonds',
    icon: '❤️',
    startingBid: 0
  },
  {
    id: 'impact',
    name: 'Impact & Legacy',
    description: 'Making a meaningful difference in the world',
    icon: '🌍',
    startingBid: 0
  },
  {
    id: 'growth',
    name: 'Growth & Learning',
    description: 'Continuous development and new experiences',
    icon: '🌱',
    startingBid: 0
  }
];

export function ValueAuctionQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: ValueAuctionQuestionProps) {
  const values = question.values || defaultValues;
  const totalBudget = question.totalBudget || 100;
  
  const [bids, setBids] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    values.forEach(value => {
      initial[value.id] = value.startingBid;
    });
    return initial;
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeValue, setActiveValue] = useState<string | null>(null);

  const totalSpent = Object.values(bids).reduce((sum, bid) => sum + bid, 0);
  const remainingBudget = totalBudget - totalSpent;
  const canSubmit = totalSpent === totalBudget && totalSpent > 0;

  const increaseBid = useCallback((valueId: string, amount: number = 5) => {
    if (isSubmitted || remainingBudget < amount) return;
    
    setBids(prev => ({
      ...prev,
      [valueId]: prev[valueId] + amount
    }));
  }, [isSubmitted, remainingBudget]);

  const decreaseBid = useCallback((valueId: string, amount: number = 5) => {
    if (isSubmitted) return;
    
    setBids(prev => ({
      ...prev,
      [valueId]: Math.max(0, prev[valueId] - amount)
    }));
  }, [isSubmitted]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    const priorities: Record<string, number> = {};
    const maxBid = Math.max(...Object.values(bids));
    
    Object.entries(bids).forEach(([valueId, bid]) => {
      priorities[valueId] = maxBid > 0 ? (bid / maxBid) * 100 : 0;
    });
    
    setIsSubmitted(true);
    onAnswer({
      bids,
      priorities,
      timestamp: new Date()
    });
  };

  const autoDistribute = () => {
    if (isSubmitted) return;
    
    const equalBid = Math.floor(totalBudget / values.length);
    const remainder = totalBudget % values.length;
    
    const newBids: Record<string, number> = {};
    values.forEach((value, index) => {
      newBids[value.id] = equalBid + (index < remainder ? 1 : 0);
    });
    
    setBids(newBids);
  };

  const getValueData = (valueId: string) => {
    return values.find(value => value.id === valueId);
  };

  const sortedByBid = Object.entries(bids)
    .sort(([,a], [,b]) => b - a)
    .filter(([,bid]) => bid > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <DollarSign className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold">{question.content[currentLanguage]}</h2>
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-gray-600">
          You have {totalBudget} points to bid on what matters most to you
        </p>
        <Badge className="bg-green-100 text-green-700 mt-2">
          Value Auction
        </Badge>
      </div>

      {/* Budget Display */}
      <div className="mb-8">
        <Card className={`${canSubmit ? 'bg-green-50 border-green-200' : remainingBudget < 0 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{totalSpent}</div>
                <div className="text-sm text-gray-600">Points Spent</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${remainingBudget >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {remainingBudget}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{totalBudget}</div>
                <div className="text-sm text-gray-600">Total Budget</div>
              </div>
            </div>
            
            {totalSpent === 0 && (
              <div className="mt-4 text-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={autoDistribute}
                  className="text-blue-600 border-blue-300"
                >
                  Auto Distribute Equally
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Value Bidding Interface */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {values.map((value, index) => (
          <motion.div
            key={value.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setActiveValue(value.id)}
            onHoverEnd={() => setActiveValue(null)}
          >
            <Card 
              className={`border-2 transition-all duration-300 ${
                activeValue === value.id
                  ? 'shadow-lg scale-105 border-green-300'
                  : bids[value.id] > 0
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:shadow-md'
              }`}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <span className="text-4xl mb-2 block">{value.icon}</span>
                  <h3 className="font-bold text-lg">{value.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{value.description}</p>
                </div>
                
                {/* Current Bid Display */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {bids[value.id]} pts
                  </div>
                  {bids[value.id] > 0 && (
                    <Badge className="bg-green-100 text-green-700">
                      {((bids[value.id] / totalBudget) * 100).toFixed(1)}% of budget
                    </Badge>
                  )}
                </div>
                
                {/* Bidding Controls */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => decreaseBid(value.id, 5)}
                    disabled={bids[value.id] <= 0 || isSubmitted}
                    className="w-12"
                  >
                    -5
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => decreaseBid(value.id, 1)}
                    disabled={bids[value.id] <= 0 || isSubmitted}
                    className="w-10"
                  >
                    -1
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => increaseBid(value.id, 1)}
                    disabled={remainingBudget < 1 || isSubmitted}
                    className="w-10 bg-green-600 hover:bg-green-700"
                  >
                    +1
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => increaseBid(value.id, 5)}
                    disabled={remainingBudget < 5 || isSubmitted}
                    className="w-12 bg-green-600 hover:bg-green-700"
                  >
                    +5
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bidding Results Preview */}
      {sortedByBid.length > 0 && (
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-center mb-4">Your Value Rankings</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {sortedByBid.slice(0, 3).map(([valueId, bid], index) => {
                  const valueData = getValueData(valueId);
                  if (!valueData) return null;
                  
                  const labels = ['Highest Value', 'Second Priority', 'Third Priority'];
                  const colors = ['text-yellow-600', 'text-orange-600', 'text-red-600'];
                  
                  return (
                    <div key={valueId} className="text-center">
                      <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                        {labels[index]}
                      </Badge>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">{valueData.icon}</span>
                        <div>
                          <p className="font-medium">{valueData.name}</p>
                          <p className={`text-sm font-bold ${colors[index]}`}>{bid} points</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: canSubmit ? 1 : 0.5 }}
        className="text-center"
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitted}
          className="bg-gradient-to-r from-green-600 to-emerald-600"
        >
          {isSubmitted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Value Auction Complete!
            </>
          ) : (
            'Submit My Bids'
          )}
        </Button>
        
        {!canSubmit && totalSpent !== totalBudget && (
          <p className="text-sm text-gray-500 mt-2">
            {totalSpent < totalBudget 
              ? `Spend ${totalBudget - totalSpent} more points to continue`
              : `Reduce spending by ${totalSpent - totalBudget} points`
            }
          </p>
        )}
      </motion.div>

      {/* Value Analysis Insight */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-bold text-purple-800 mb-3">Your Value Investment Analysis</h4>
                  <p className="text-gray-700 mb-4">
                    How you chose to "spend" your points reveals your deepest values and priorities. 
                    This allocation pattern influences every major decision you make.
                  </p>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Investment Strategy:</span> You allocated{' '}
                    {((Object.values(bids).filter(bid => bid > 0).length / values.length) * 100).toFixed(0)}%{' '}
                    of available values, showing a{' '}
                    {Object.values(bids).filter(bid => bid > 0).length <= 3 ? 'focused' : 'balanced'}{' '}
                    approach to what matters most.
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
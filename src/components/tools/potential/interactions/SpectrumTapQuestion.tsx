"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SpectrumTapQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    leftLabel: string;
    rightLabel: string;
    centerLabel?: string;
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { position: number; zone: string; timestamp: Date }) => void;
}

export function SpectrumTapQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: SpectrumTapQuestionProps) {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tapAnimation, setTapAnimation] = useState<{ x: number; show: boolean }>({ x: 0, show: false });

  const handleSpectrumTap = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isSubmitted) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    
    setSelectedPosition(percentage);
    setTapAnimation({ x, show: true });
    
    setTimeout(() => setTapAnimation(prev => ({ ...prev, show: false })), 300);
  };

  const getZone = (position: number): string => {
    if (position < 20) return 'strongly-left';
    if (position < 40) return 'moderately-left';
    if (position < 60) return 'center';
    if (position < 80) return 'moderately-right';
    return 'strongly-right';
  };

  const getZoneLabel = (position: number): string => {
    const zone = getZone(position);
    switch (zone) {
      case 'strongly-left': return `Strongly ${question.leftLabel}`;
      case 'moderately-left': return `Moderately ${question.leftLabel}`;
      case 'center': return question.centerLabel || 'Balanced';
      case 'moderately-right': return `Moderately ${question.rightLabel}`;
      case 'strongly-right': return `Strongly ${question.rightLabel}`;
      default: return 'Balanced';
    }
  };

  const getPositionColor = (position: number): string => {
    const zone = getZone(position);
    switch (zone) {
      case 'strongly-left': return 'bg-blue-600';
      case 'moderately-left': return 'bg-blue-400';
      case 'center': return 'bg-purple-500';
      case 'moderately-right': return 'bg-pink-400';
      case 'strongly-right': return 'bg-pink-600';
      default: return 'bg-gray-400';
    }
  };

  const handleSubmit = () => {
    if (selectedPosition === null) return;
    
    setIsSubmitted(true);
    onAnswer({
      position: selectedPosition,
      zone: getZone(selectedPosition),
      timestamp: new Date()
    });
  };

  const spectrumColors = [
    'from-blue-600 via-blue-400',
    'via-purple-500',
    'via-pink-400 to-pink-600'
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
        <p className="text-gray-600">
          Tap anywhere on the spectrum that represents your position
        </p>
      </div>

      {/* Main Spectrum */}
      <Card className="shadow-xl border-none overflow-hidden mb-8">
        <CardContent className="p-8">
          {/* Labels */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-blue-600 text-xl">←</span>
              </div>
              <p className="font-semibold text-blue-600">{question.leftLabel}</p>
            </div>
            
            {question.centerLabel && (
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-purple-600 text-xl">◎</span>
                </div>
                <p className="font-semibold text-purple-600">{question.centerLabel}</p>
              </div>
            )}
            
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-pink-600 text-xl">→</span>
              </div>
              <p className="font-semibold text-pink-600">{question.rightLabel}</p>
            </div>
          </div>

          {/* Interactive Spectrum */}
          <div className="relative">
            <motion.div
              className={`h-16 rounded-full cursor-pointer bg-gradient-to-r ${spectrumColors.join(' ')}`}
              onClick={handleSpectrumTap}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            />
            
            {/* Zone markers */}
            <div className="absolute inset-0 flex">
              {[20, 40, 60, 80].map((position, index) => (
                <div
                  key={position}
                  className="flex-1 border-r border-white/30 last:border-r-0"
                  style={{ width: '20%' }}
                />
              ))}
            </div>
            
            {/* Selected position indicator */}
            <AnimatePresence>
              {selectedPosition !== null && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${selectedPosition}%` }}
                >
                  <div className={`w-6 h-6 rounded-full ${getPositionColor(selectedPosition)} border-4 border-white shadow-lg`} />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Tap animation */}
            <AnimatePresence>
              {tapAnimation.show && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ left: tapAnimation.x }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/60 border-2 border-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Position feedback */}
          <AnimatePresence>
            {selectedPosition !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <Badge className={`${getPositionColor(selectedPosition)} text-white text-lg px-4 py-2`}>
                  {getZoneLabel(selectedPosition)}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  Position: {selectedPosition}% toward {selectedPosition > 50 ? question.rightLabel : question.leftLabel}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedPosition !== null ? 1 : 0.5 }}
        className="text-center"
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={selectedPosition === null || isSubmitted}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {isSubmitted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Position Captured!
            </>
          ) : (
            <>
              Confirm My Position
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </motion.div>

      {/* Insight after submission */}
      <AnimatePresence>
        {isSubmitted && selectedPosition !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Insight:</span> Your position in the {getZone(selectedPosition)} zone 
                  reveals important preferences about how you approach this aspect of life.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
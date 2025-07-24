"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Lightbulb } from 'lucide-react';
import { PotentialDimension } from '@/lib/data/pqc-data';

interface SectionIntroCardProps {
  dimension: PotentialDimension;
  currentLanguage: 'en' | 'am';
  questionNumber: number;
}

export function SectionIntroCard({ 
  dimension, 
  currentLanguage, 
  questionNumber 
}: SectionIntroCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mb-8"
    >
      <Card 
        className="border-none shadow-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${dimension.color}10 0%, ${dimension.color}20 100%)`
        }}
      >
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {dimension.icon}
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {dimension.storytellingName[currentLanguage]}
              </h3>
              <p className="text-gray-600 text-lg">
                {dimension.tagline[currentLanguage]}
              </p>
            </div>
          </div>
          
          <Separator className="my-4 opacity-20" />
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2" style={{ color: dimension.color }}>
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Why This Matters</span>
              </div>
              <p className="text-sm text-gray-600">
                {dimension.whyItMatters[currentLanguage]}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2" style={{ color: dimension.color }}>
                <Lightbulb className="w-4 h-4" />
                <span className="font-medium">Fun Fact</span>
              </div>
              <p className="text-sm text-gray-600">
                {dimension.funFact[currentLanguage]}
              </p>
            </div>
          </div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-6 h-2 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${dimension.color} 0%, ${dimension.color}80 100%)`
            }}
          />
          
          {/* Question Progress */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Questions {questionNumber} - {questionNumber + 6} • {dimension.name[currentLanguage]} Assessment
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
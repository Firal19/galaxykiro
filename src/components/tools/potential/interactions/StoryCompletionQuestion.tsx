"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, BookOpen, Lightbulb, Sparkles } from 'lucide-react';

interface StoryCompletionQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    storyPrompt: {
      title: string;
      setup: string;
      cliffhanger: string;
      guidingQuestions: string[];
    };
    analysisCategories: string[];
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { 
    completion: string; 
    themes: string[]; 
    characterTraits: string[];
    values: string[];
    timestamp: Date;
  }) => void;
}

const defaultStoryPrompt = {
  title: "The Crossroads Moment",
  setup: "Alex had always been the reliable one - the person everyone turned to in a crisis. But today, standing in the empty office after being laid off from a job they'd held for five years, everything felt different. The severance check in their hand represented both an ending and a beginning.",
  cliffhanger: "As Alex walked toward the elevator, their phone buzzed with three notifications: a text from their best friend asking for emergency help, an email about a dream job opportunity that required an immediate response, and a voicemail from their elderly parent who lived alone. The elevator doors opened, and Alex had to decide...",
  guidingQuestions: [
    "What does Alex do first and why?",
    "How does this choice reflect their deepest values?",
    "What does this moment reveal about their character?",
    "How do they handle competing priorities?"
  ]
};

export function StoryCompletionQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: StoryCompletionQuestionProps) {
  const [storyCompletion, setStoryCompletion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const storyPrompt = question.storyPrompt || defaultStoryPrompt;
  const minWords = 50;
  const wordCount = storyCompletion.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  const handleSubmit = () => {
    if (wordCount < minWords || isSubmitted) return;
    
    setIsSubmitted(true);
    
    // Analyze the story completion (simplified analysis)
    const analysis = analyzeStoryCompletion(storyCompletion);
    setAnalysisResult(analysis);
    setShowAnalysis(true);
    
    setTimeout(() => {
      onAnswer({
        completion: storyCompletion,
        themes: analysis.themes,
        characterTraits: analysis.traits,
        values: analysis.values,
        timestamp: new Date()
      });
    }, 2000);
  };
  
  const analyzeStoryCompletion = (completion: string): any => {
    const lowerText = completion.toLowerCase();
    
    // Simple keyword-based analysis (in a real app, this would use NLP)
    const themeKeywords = {
      'responsibility': ['help', 'duty', 'obligation', 'responsible', 'support'],
      'ambition': ['opportunity', 'career', 'job', 'success', 'advance'],
      'family': ['parent', 'family', 'home', 'care', 'love'],
      'independence': ['alone', 'self', 'independent', 'own', 'freedom'],
      'service': ['others', 'community', 'help', 'serve', 'give']
    };
    
    const traitKeywords = {
      'decisive': ['quickly', 'immediate', 'decided', 'chose'],
      'thoughtful': ['consider', 'think', 'reflect', 'weigh'],
      'empathetic': ['understand', 'feel', 'emotional', 'care'],
      'practical': ['practical', 'logical', 'realistic', 'sensible'],
      'creative': ['creative', 'innovative', 'unique', 'different']
    };
    
    const valueKeywords = {
      'loyalty': ['loyal', 'commitment', 'faithful', 'dedicated'],
      'growth': ['learn', 'grow', 'develop', 'improve'],
      'security': ['safe', 'secure', 'stable', 'certain'],
      'adventure': ['adventure', 'risk', 'explore', 'new'],
      'connection': ['relationship', 'together', 'bond', 'connect']
    };
    
    const detectCategories = (keywords: Record<string, string[]>) => {
      return Object.entries(keywords)
        .filter(([_, words]) => words.some(word => lowerText.includes(word)))
        .map(([category]) => category);
    };
    
    return {
      themes: detectCategories(themeKeywords).slice(0, 3),
      traits: detectCategories(traitKeywords).slice(0, 3),
      values: detectCategories(valueKeywords).slice(0, 3),
      wordCount: wordCount,
      sentiment: lowerText.includes('hope') || lowerText.includes('positive') ? 'optimistic' : 
                lowerText.includes('fear') || lowerText.includes('worry') ? 'cautious' : 'balanced'
    };
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
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">{question.content[currentLanguage]}</h2>
          <Sparkles className="w-6 h-6 text-indigo-600" />
        </div>
        <p className="text-gray-600">
          Complete this story to reveal insights about your decision-making style
        </p>
        <Badge className="bg-indigo-100 text-indigo-700 mt-2">
          Story Completion
        </Badge>
      </div>

      {/* Story Setup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-xl">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-indigo-800 mb-4 text-center">
              {storyPrompt.title}
            </h3>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>{storyPrompt.setup}</p>
              <p className="font-medium text-indigo-700">{storyPrompt.cliffhanger}</p>
            </div>
            
            {/* Guiding Questions */}
            <div className="mt-6 p-4 bg-white/60 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Consider These Questions:
              </h4>
              <ul className="space-y-2 text-sm">
                {storyPrompt.guidingQuestions.map((question, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Story Completion Input */}
      <div className="mb-8">
        <Card className="shadow-lg border-2 border-gray-200 focus-within:border-indigo-300 transition-colors">
          <CardContent className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete the story in your own words:
              </label>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">Share your authentic response</span>
                <Badge variant={wordCount >= minWords ? "default" : "secondary"}>
                  {wordCount} / {minWords} words
                </Badge>
              </div>
            </div>
            
            <Textarea
              value={storyCompletion}
              onChange={(e) => setStoryCompletion(e.target.value)}
              placeholder="Alex takes a deep breath and..."
              className="min-h-[200px] text-base leading-relaxed resize-none"
              disabled={isSubmitted}
            />
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Write naturally - there are no right or wrong answers
              </div>
              
              {wordCount >= minWords && !isSubmitted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-600 text-sm font-medium flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Ready to analyze
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: wordCount >= minWords ? 1 : 0.5 }}
        className="text-center mb-8"
      >
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={wordCount < minWords || isSubmitted}
          className="bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          {isSubmitted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Story Analyzed!
            </>
          ) : (
            'Analyze My Story'
          )}
        </Button>
      </motion.div>

      {/* Story Analysis Results */}
      <AnimatePresence>
        {showAnalysis && analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Your Story Reveals...
                  </h3>
                  <p className="text-gray-700">
                    Analysis of your decision-making patterns and values
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Themes */}
                  <div className="text-center">
                    <h4 className="font-bold text-green-700 mb-3">Core Themes</h4>
                    <div className="space-y-2">
                      {analysisResult.themes.map((theme: string, index: number) => (
                        <Badge key={index} className="bg-green-100 text-green-800 block">
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Character Traits */}
                  <div className="text-center">
                    <h4 className="font-bold text-blue-700 mb-3">Character Traits</h4>
                    <div className="space-y-2">
                      {analysisResult.traits.map((trait: string, index: number) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800 block">
                          {trait.charAt(0).toUpperCase() + trait.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Values */}
                  <div className="text-center">
                    <h4 className="font-bold text-purple-700 mb-3">Core Values</h4>
                    <div className="space-y-2">
                      {analysisResult.values.map((value: string, index: number) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800 block">
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white/60 rounded-lg text-center">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Narrative Style:</span> Your story shows a{' '}
                    <span className="font-semibold text-green-700">{analysisResult.sentiment}</span> approach 
                    to decision-making, revealing how you naturally process complex situations.
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
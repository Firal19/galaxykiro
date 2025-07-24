"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Compass, Map, Star } from 'lucide-react';

interface ScenarioAdventureQuestionProps {
  question: {
    id: string;
    content: { en: string; am: string };
    scenario: {
      title: string;
      description: string;
      choices: Array<{
        id: string;
        text: string;
        consequence: string;
        trait: string;
        icon: string;
      }>;
    };
  };
  currentLanguage: 'en' | 'am';
  onAnswer: (answer: { choiceId: string; trait: string; journey: string[]; timestamp: Date }) => void;
}

const defaultScenario = {
  title: "The Career Crossroads",
  description: "You've been offered your dream job, but it requires moving to a new city where you know nobody. Your current job is stable but unfulfilling. What drives your decision?",
  choices: [
    {
      id: 'growth',
      text: "Take the leap! This is my chance to grow and chase my dreams.",
      consequence: "You embrace uncertainty and prioritize personal development over comfort.",
      trait: "Growth-Oriented Risk Taker",
      icon: "🚀"
    },
    {
      id: 'research',
      text: "I need to research everything first - the city, company culture, long-term prospects.",
      consequence: "You value thorough analysis and make informed decisions based on data.",
      trait: "Strategic Analytical Thinker",
      icon: "🔍"
    },
    {
      id: 'network',
      text: "I'd reach out to people I know in that city and build connections first.",
      consequence: "You leverage relationships and prioritize social support in major decisions.",
      trait: "Relationship-Focused Connector",
      icon: "🤝"
    },
    {
      id: 'stability',
      text: "I'd negotiate with my current employer for better opportunities here first.",
      consequence: "You prefer working within existing systems to create positive change.",
      trait: "Stability-Seeking Optimizer",
      icon: "⚖️"
    }
  ]
};

export function ScenarioAdventureQuestion({ 
  question, 
  currentLanguage, 
  onAnswer 
}: ScenarioAdventureQuestionProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const scenario = question.scenario || defaultScenario;
  
  const handleChoiceSelect = (choiceId: string) => {
    if (isSubmitted) return;
    
    setSelectedChoice(choiceId);
    setShowConsequence(true);
    
    setTimeout(() => {
      const choice = scenario.choices.find(c => c.id === choiceId);
      if (choice) {
        setIsSubmitted(true);
        onAnswer({
          choiceId,
          trait: choice.trait,
          journey: [choice.text, choice.consequence],
          timestamp: new Date()
        });
      }
    }, 2000);
  };

  const selectedChoiceData = scenario.choices.find(c => c.id === selectedChoice);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto p-8"
    >
      {/* Question Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Compass className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">{question.content[currentLanguage]}</h2>
          <Map className="w-6 h-6 text-purple-600" />
        </div>
        <Badge className="bg-purple-100 text-purple-700">
          Scenario Adventure
        </Badge>
      </div>

      {/* Scenario Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-purple-200 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-purple-800 mb-2">
                {scenario.title}
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              {scenario.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Choice Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {scenario.choices.map((choice, index) => (
          <motion.div
            key={choice.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              whileHover={{ scale: isSubmitted ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitted ? 1 : 0.98 }}
              onClick={() => handleChoiceSelect(choice.id)}
              className={`cursor-pointer ${isSubmitted ? 'cursor-default' : ''}`}
            >
              <Card 
                className={`h-full border-2 transition-all duration-300 ${
                  selectedChoice === choice.id
                    ? 'border-purple-500 bg-purple-50 shadow-xl'
                    : selectedChoice && selectedChoice !== choice.id
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: selectedChoice === choice.id ? 1.2 : 1 }}
                      className="text-4xl"
                    >
                      {choice.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2 text-gray-800">
                        {choice.text}
                      </h4>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-600 font-medium">
                          Choose this path
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Consequence Reveal */}
      <AnimatePresence>
        {showConsequence && selectedChoiceData && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-6xl mb-4"
                  >
                    {selectedChoiceData.icon}
                  </motion.div>
                  <Badge className="bg-green-100 text-green-700 text-lg px-4 py-2">
                    {selectedChoiceData.trait}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <h4 className="text-xl font-bold text-green-800 mb-3">
                    Your Journey Unfolds...
                  </h4>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {selectedChoiceData.consequence}
                  </p>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="mt-6 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personality Insight */}
      <AnimatePresence>
        {isSubmitted && selectedChoiceData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-purple-800">Personality Insight Unlocked</h4>
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-gray-700">
                  Your choice reveals you're a <span className="font-semibold text-purple-700">
                  {selectedChoiceData.trait}</span>. This decision-making pattern shows up in 
                  many areas of your life and influences how you approach challenges and opportunities.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="mt-8 text-center">
        <div className="flex justify-center items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <motion.div
              key={step}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: step * 0.2 }}
              className={`w-3 h-3 rounded-full transition-colors ${
                step === 1 ? 'bg-purple-500' : 
                step === 2 && selectedChoice ? 'bg-purple-500' : 
                step === 3 && showConsequence ? 'bg-purple-500' : 
                step === 4 && isSubmitted ? 'bg-purple-500' : 
                'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {!selectedChoice ? 'Choose your path' : 
           !showConsequence ? 'Revealing consequences...' :
           !isSubmitted ? 'Processing insight...' :
           'Adventure complete!'}
        </p>
      </div>
    </motion.div>
  );
}
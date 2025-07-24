"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp, 
  ArrowRight,
  Clock,
  Star,
  Zap
} from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Zero Cognitive Load",
      description: "Intuitive questions that feel like a conversation"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "15 Interaction Types",
      description: "From emoji sliders to word clouds - never boring"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "7 Superpowers",
      description: "Discover your unique potential dimensions"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Actionable Insights",
      description: "Get personalized growth recommendations"
    }
  ];

  const superpowers = [
    { name: "Growth Power", icon: "🌱", color: "text-green-600" },
    { name: "Bounce Power", icon: "🔄", color: "text-blue-600" },
    { name: "Learn Power", icon: "🧠", color: "text-purple-600" },
    { name: "Vision Power", icon: "👁️", color: "text-indigo-600" },
    { name: "Action Power", icon: "⚡", color: "text-yellow-600" },
    { name: "Connect Power", icon: "🤝", color: "text-pink-600" },
    { name: "Create Power", icon: "✨", color: "text-orange-600" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"
    >
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-purple-600" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Potential Quotient Calculator
            </h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-pink-600" />
            </motion.div>
          </div>
          
          <p className="text-xl text-gray-600 mb-6">
            The Revolutionary Assessment Experience That Feels Like Magic
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Clock className="w-4 h-4 mr-1" />
              12-15 minutes
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <Star className="w-4 h-4 mr-1" />
              49 smart questions
            </Badge>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-purple-600">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Superpowers Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6">Discover Your 7 Superpowers</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {superpowers.map((power, index) => (
                  <motion.div
                    key={power.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, type: "spring" }}
                    className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-sm"
                  >
                    <span className="text-2xl">{power.icon}</span>
                    <span className={`font-medium ${power.color}`}>{power.name}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Discover Your Potential?</h3>
              <p className="text-gray-600 mb-8">
                Join thousands who've unlocked their superpowers. Your journey of self-discovery starts now.
              </p>
              
              <Button
                size="lg"
                onClick={onStart}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-12 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Begin My Assessment
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                No signup required • Completely private • Instant results
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
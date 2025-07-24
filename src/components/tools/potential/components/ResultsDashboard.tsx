"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Share2, 
  Download, 
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Star,
  Zap,
  Brain,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

import { dimensions, getDimensionById } from '@/lib/data/pqc-data';
import { ExportManager } from './ExportManager';

interface PQCResult {
  overallScore: number;
  dimensionScores: Record<string, number>;
  insights: Array<{
    type: 'strength' | 'opportunity' | 'pattern';
    title: string;
    description: string;
    icon: string;
  }>;
  recommendations: Array<{
    type: 'priority' | 'quick_win' | 'development_plan' | 'resources';
    urgency: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    actions?: string[];
    timeRequired?: string;
    expectedImpact?: string;
  }>;
  percentile: number;
  potentialLevel: {
    name: { en: string; am: string };
    description: { en: string; am: string };
    range: { min: number; max: number };
    color: string;
    recommendations: string[];
  };
  growthTrajectory: string;
  totalPoints: number;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }>;
}

interface ResultsDashboardProps {
  result: PQCResult;
  onExport: () => void;
  onShare: () => void;
  onRetake: () => void;
  currentLanguage: 'en' | 'am';
}

export function ResultsDashboard({
  result,
  onExport,
  onShare,
  onRetake,
  currentLanguage
}: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showConfetti, setShowConfetti] = useState(true);
  const [showExportManager, setShowExportManager] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 85) return 'from-green-500 to-emerald-500';
    if (score >= 70) return 'from-blue-500 to-indigo-500';
    if (score >= 55) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-slate-500';
  };

  const topDimensions = Object.entries(result.dimensionScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-8"
    >
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -100, 
                  x: Math.random() * window.innerWidth,
                  rotate: 0 
                }}
                animate={{ 
                  y: window.innerHeight + 100,
                  rotate: 360 
                }}
                transition={{ 
                  duration: 3,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute text-2xl"
              >
                {['🎉', '✨', '🌟', '🎊', '💫'][i % 5]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Potential Profile
            </h1>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          
          {/* Overall Score */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="mb-6"
          >
            <Card className="inline-block bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)} mb-2`}>
                    {result.overallScore}
                  </div>
                  <div className="text-lg text-gray-600 mb-4">
                    Potential Quotient Score
                  </div>
                  <Badge 
                    className={`bg-gradient-to-r ${getScoreBackground(result.overallScore)} text-white`}
                  >
                    {result.potentialLevel.name[currentLanguage]}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    {result.percentile}th percentile
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => setShowExportManager(true)} className="bg-blue-600 hover:bg-blue-700">
              <Share2 className="w-4 h-4 mr-2" />
              Share & Export
            </Button>
            <Button onClick={onRetake} variant="ghost">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Assessment
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="superpowers">Superpowers</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="growth">Growth Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Top Superpowers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-500" />
                    Your Top 3 Superpowers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {topDimensions.map(([dimId, score], index) => {
                      const dimension = getDimensionById(dimId);
                      if (!dimension) return null;
                      
                      return (
                        <motion.div
                          key={dimId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center"
                        >
                          <div 
                            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl shadow-lg"
                            style={{ backgroundColor: `${dimension.color}20` }}
                          >
                            {dimension.icon}
                          </div>
                          <h3 className="font-bold text-lg mb-2">
                            {dimension.storytellingName[currentLanguage]}
                          </h3>
                          <div className={`text-3xl font-bold ${getScoreColor(score)} mb-2`}>
                            {score}%
                          </div>
                          <Progress value={score} className="h-2" />
                          <p className="text-sm text-gray-600 mt-2">
                            {dimension.tagline[currentLanguage]}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-purple-500" />
                    Achievements Unlocked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {result.achievements.filter(a => a.unlocked).map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg text-center border border-purple-200"
                      >
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <h4 className="font-semibold mb-1">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="superpowers" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {dimensions.map((dimension) => {
                const score = result.dimensionScores[dimension.id] || 0;
                return (
                  <motion.div
                    key={dimension.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                            style={{ backgroundColor: `${dimension.color}20` }}
                          >
                            {dimension.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl">
                              {dimension.storytellingName[currentLanguage]}
                            </h3>
                            <p className="text-gray-600">
                              {dimension.tagline[currentLanguage]}
                            </p>
                          </div>
                          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                            {score}%
                          </div>
                        </div>
                        
                        <Progress value={score} className="h-3 mb-4" />
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-1">Why This Matters:</h4>
                            <p className="text-sm text-gray-600">
                              {dimension.whyItMatters[currentLanguage]}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-1">Fun Fact:</h4>
                            <p className="text-sm text-gray-600">
                              {dimension.funFact[currentLanguage]}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              {result.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{insight.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{insight.title}</h3>
                          <p className="text-gray-700">{insight.description}</p>
                        </div>
                        <Badge className={`${
                          insight.type === 'strength' ? 'bg-green-100 text-green-700' :
                          insight.type === 'opportunity' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {insight.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <div className="grid gap-6">
              {result.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{rec.title}</h3>
                            <Badge className={`${
                              rec.urgency === 'high' ? 'bg-red-100 text-red-700' :
                              rec.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {rec.urgency} priority
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-4">{rec.description}</p>
                          
                          {rec.actions && (
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">Action Steps:</h4>
                              <ul className="space-y-1">
                                {rec.actions.map((action, i) => (
                                  <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="flex gap-4 text-sm text-gray-600">
                            {rec.timeRequired && (
                              <span className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                {rec.timeRequired}
                              </span>
                            )}
                            {rec.expectedImpact && (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {rec.expectedImpact}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button size="sm" className="shrink-0">
                          Start Now
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Export Manager Modal */}
      <AnimatePresence>
        {showExportManager && (
          <ExportManager
            result={result}
            onClose={() => setShowExportManager(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
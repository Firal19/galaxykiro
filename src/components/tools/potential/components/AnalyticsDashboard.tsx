"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Brain, 
  Zap,
  Target,
  Users,
  Eye,
  Activity,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';

import { EngagementTracker, type EngagementMetrics } from '@/lib/adaptive-system';

interface AnalyticsDashboardProps {
  engagementTracker: EngagementTracker;
  currentQuestion: number;
  totalQuestions: number;
  isVisible: boolean;
  onClose: () => void;
}

export function AnalyticsDashboard({ 
  engagementTracker, 
  currentQuestion, 
  totalQuestions, 
  isVisible, 
  onClose 
}: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (isVisible) {
      const currentMetrics = engagementTracker.getCurrentMetrics();
      const currentAnalytics = engagementTracker.getAnalytics();
      setMetrics(currentMetrics);
      setAnalytics(currentAnalytics);
    }
  }, [isVisible, engagementTracker, currentQuestion]);

  if (!isVisible || !metrics || !analytics) return null;

  const completionRate = (currentQuestion / totalQuestions) * 100;
  
  const getEngagementLevel = (quality: number) => {
    if (quality >= 85) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (quality >= 70) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (quality >= 55) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getEnergyStatus = (energy: number) => {
    if (energy >= 80) return { label: 'High Energy', color: 'text-green-600', icon: '🔋' };
    if (energy >= 60) return { label: 'Good Energy', color: 'text-blue-600', icon: '🔋' };
    if (energy >= 40) return { label: 'Moderate Energy', color: 'text-yellow-600', icon: '🪫' };
    return { label: 'Low Energy', color: 'text-red-600', icon: '🪫' };
  };

  const engagementLevel = getEngagementLevel(metrics.interactionQuality);
  const energyStatus = getEnergyStatus(metrics.userEnergyLevel);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-white shadow-2xl border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                      Real-Time Analytics Dashboard
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      Live insights into user engagement and assessment quality
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Metrics Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {Math.round(completionRate)}%
                      </div>
                      <p className="text-sm text-gray-600">Completion</p>
                      <Progress value={completionRate} className="mt-2 h-2" />
                    </CardContent>
                  </Card>

                  <Card className={`${energyStatus.color.includes('green') ? 'bg-green-50 border-green-200' : 
                                    energyStatus.color.includes('blue') ? 'bg-blue-50 border-blue-200' :
                                    energyStatus.color.includes('yellow') ? 'bg-yellow-50 border-yellow-200' :
                                    'bg-red-50 border-red-200'}`}>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${energyStatus.color} mb-1`}>
                        {Math.round(metrics.userEnergyLevel)}%
                      </div>
                      <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                        {energyStatus.icon} {energyStatus.label}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${engagementLevel.bg} border-current`}>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${engagementLevel.color} mb-1`}>
                        {Math.round(metrics.interactionQuality)}%
                      </div>
                      <p className="text-sm text-gray-600">
                        {engagementLevel.label}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {Math.round(metrics.averageResponseTime / 1000)}s
                      </div>
                      <p className="text-sm text-gray-600">Avg Response</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Analytics Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                    <TabsTrigger value="interactions">Interactions</TabsTrigger>
                    <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Progress Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-600" />
                            Assessment Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Questions Completed</span>
                            <span className="font-medium">{currentQuestion} / {totalQuestions}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Estimated Time Remaining</span>
                            <span className="font-medium">
                              {Math.round((totalQuestions - currentQuestion) * 0.5)} min
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Engagement Trend</span>
                            <Badge className={
                              metrics.engagementTrend === 'increasing' ? 'bg-green-100 text-green-700' :
                              metrics.engagementTrend === 'decreasing' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }>
                              {metrics.engagementTrend === 'increasing' && <ChevronUp className="w-3 h-3 mr-1" />}
                              {metrics.engagementTrend === 'decreasing' && <ChevronDown className="w-3 h-3 mr-1" />}
                              {metrics.engagementTrend.charAt(0).toUpperCase() + metrics.engagementTrend.slice(1)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quality Metrics */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Brain className="w-5 h-5 text-blue-600" />
                            Quality Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Interaction Quality</span>
                              <span className="font-medium">{Math.round(metrics.interactionQuality)}%</span>
                            </div>
                            <Progress value={metrics.interactionQuality} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Attention Span</span>
                              <span className="font-medium">{Math.round(metrics.attentionSpan)}%</span>
                            </div>
                            <Progress value={metrics.attentionSpan} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Energy Level</span>
                              <span className="font-medium">{Math.round(metrics.userEnergyLevel)}%</span>
                            </div>
                            <Progress value={metrics.userEnergyLevel} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="engagement" className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Response Pattern</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm">Optimal Responses</span>
                              <span className="font-medium">
                                {analytics.qualityTrend.filter((q: number) => q >= 85).length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Good Responses</span>
                              <span className="font-medium">
                                {analytics.qualityTrend.filter((q: number) => q >= 70 && q < 85).length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Needs Improvement</span>
                              <span className="font-medium">
                                {analytics.qualityTrend.filter((q: number) => q < 70).length}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Energy Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm">Peak Energy</span>
                              <span className="font-medium">
                                {Math.max(...analytics.energyTrend)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Current Energy</span>
                              <span className="font-medium">
                                {Math.round(metrics.userEnergyLevel)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Fatigue Level</span>
                              <span className="font-medium">
                                {Math.round(metrics.fatigueLevel)}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Timing Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm">Avg Response Time</span>
                              <span className="font-medium">
                                {Math.round(metrics.averageResponseTime / 1000)}s
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Total Time</span>
                              <span className="font-medium">
                                {Math.round(currentQuestion * 0.5)} min
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Estimated Completion</span>
                              <span className="font-medium">
                                {Math.round((totalQuestions * 0.5))} min
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="interactions" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          Interaction Type Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(analytics.interactionTypeBreakdown).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{count as number}</span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-purple-600 h-2 rounded-full" 
                                    style={{ width: `${((count as number) / analytics.totalQuestions) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {metrics.preferredInteractionTypes.length > 0 && (
                          <div className="mt-6 pt-4 border-t">
                            <h4 className="font-medium mb-2">Preferred Interaction Types:</h4>
                            <div className="flex flex-wrap gap-2">
                              {metrics.preferredInteractionTypes.map((type) => (
                                <Badge key={type} className="bg-green-100 text-green-700">
                                  {type.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Zap className="w-5 h-5 text-orange-600" />
                          AI-Powered Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {analytics.recommendations.length > 0 ? (
                          <div className="space-y-4">
                            {analytics.recommendations.map((rec: any, index: number) => (
                              <div 
                                key={index} 
                                className={`p-4 rounded-lg border-l-4 ${
                                  rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                                  rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                                  'border-green-500 bg-green-50'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <Badge className={`mb-2 ${
                                      rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-green-100 text-green-700'
                                    }`}>
                                      {rec.priority} priority
                                    </Badge>
                                    <h5 className="font-medium capitalize">{rec.type.replace('_', ' ')}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                                    <p className="text-sm font-medium mt-2">Action: {rec.action}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">
                              No adaptive recommendations at this time. 
                              The AI is monitoring engagement patterns.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
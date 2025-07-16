"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Target, 
  Award, 
  AlertCircle, 
  CheckCircle, 
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AssessmentResult, VisualizationData, PersonalizedInsight } from '@/lib/assessment-engine'
import { GalaxyDreamTeamLogo } from '../galaxy-dream-team-logo'

interface ResultVisualizationProps {
  result: AssessmentResult
  showSharing?: boolean
  compact?: boolean
}

export function ResultVisualization({ result, showSharing = true, compact = false }: ResultVisualizationProps) {
  const { scores, insights, visualizationData } = result

  // Prepare chart data based on visualization type
  const chartData = useMemo(() => {
    switch (visualizationData.chartType) {
      case 'radar':
        return visualizationData.data.labels.map((label, index) => ({
          category: label,
          value: visualizationData.data.datasets[0].data[index],
          fullMark: 100
        }))
      
      case 'bar':
        return visualizationData.data.labels.map((label, index) => ({
          name: label,
          value: visualizationData.data.datasets[0].data[index]
        }))
      
      case 'pie':
        return visualizationData.data.labels.map((label, index) => ({
          name: label,
          value: visualizationData.data.datasets[0].data[index]
        }))
      
      default:
        return []
    }
  }, [visualizationData])

  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16'  // Lime
  ]

  if (compact) {
    return (
      <div className="space-y-4">
        <ScoreOverview scores={scores} compact />
        <InsightsSummary insights={insights} compact />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <ScoreOverview scores={scores} />

      {/* Main Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Results Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {visualizationData.chartType === 'radar' && (
                <RadarChart data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={false}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              )}

              {visualizationData.chartType === 'bar' && (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              )}

              {visualizationData.chartType === 'pie' && (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}

              {visualizationData.chartType === 'gauge' && (
                <div className="flex items-center justify-center h-full">
                  <GaugeChart value={scores.percentage} />
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {scores.categoryScores && (
        <CategoryBreakdown categoryScores={scores.categoryScores} />
      )}

      {/* Personalized Insights */}
      <InsightsSummary insights={insights} />

      {/* Sharing Options */}
      {showSharing && (
        <SharingOptions result={result} />
      )}

      {/* Galaxy Dream Team Attribution */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-3 border-t border-border pt-4">
            <GalaxyDreamTeamLogo variant="compact" size="small" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Assessment by Galaxy Dream Team
              </p>
              <p className="text-xs text-muted-foreground">
                Ethiopia's premier personal development platform
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ScoreOverviewProps {
  scores: AssessmentResult['scores']
  compact?: boolean
}

function ScoreOverview({ scores, compact }: ScoreOverviewProps) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-blue-600'
    if (percentage >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 80) return <TrendingUp className="h-5 w-5 text-green-600" />
    if (percentage >= 60) return <Target className="h-5 w-5 text-blue-600" />
    if (percentage >= 40) return <Minus className="h-5 w-5 text-yellow-600" />
    return <AlertCircle className="h-5 w-5 text-red-600" />
  }

  if (compact) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className={cn("text-2xl font-bold", getScoreColor(scores.percentage))}>
                {scores.percentage}%
              </p>
            </div>
            {getScoreIcon(scores.percentage)}
          </div>
          {scores.tier && (
            <Badge variant="secondary" className="mt-2">
              {scores.tier.label}
            </Badge>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className={cn("text-3xl font-bold", getScoreColor(scores.percentage))}>
                {scores.percentage}%
              </p>
            </div>
            {getScoreIcon(scores.percentage)}
          </div>
          <Progress value={scores.percentage} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-3xl font-bold text-foreground">
                {scores.total}
              </p>
            </div>
            <Award className="h-5 w-5 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      {scores.tier && (
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Your Level</p>
              <p className="text-lg font-semibold text-foreground mb-2">
                {scores.tier.label}
              </p>
              <Badge variant="secondary">
                {scores.tier.description}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface CategoryBreakdownProps {
  categoryScores: NonNullable<AssessmentResult['scores']['categoryScores']>
}

function CategoryBreakdown({ categoryScores }: CategoryBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(categoryScores).map(([categoryId, categoryScore]) => (
            <div key={categoryId} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium capitalize">
                  {categoryId.replace('-', ' ')}
                </span>
                <span className="text-sm text-muted-foreground">
                  {categoryScore.percentage}%
                </span>
              </div>
              <Progress value={categoryScore.percentage} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface InsightsSummaryProps {
  insights: PersonalizedInsight[]
  compact?: boolean
}

function InsightsSummary({ insights, compact }: InsightsSummaryProps) {
  const getInsightIcon = (type: PersonalizedInsight['type']) => {
    switch (type) {
      case 'strength':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'opportunity':
        return <ArrowUp className="h-4 w-4 text-blue-600" />
      case 'recommendation':
        return <Target className="h-4 w-4 text-purple-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getInsightColor = (type: PersonalizedInsight['type']) => {
    switch (type) {
      case 'strength':
        return 'border-green-200 bg-green-50'
      case 'opportunity':
        return 'border-blue-200 bg-blue-50'
      case 'recommendation':
        return 'border-purple-200 bg-purple-50'
      case 'warning':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const priorityInsights = insights.filter(i => i.priority === 'high')
  const otherInsights = insights.filter(i => i.priority !== 'high')

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {priorityInsights.slice(0, 2).map((insight, index) => (
              <div key={index} className={cn("p-3 rounded-lg border", getInsightColor(insight.type))}>
                <div className="flex items-start gap-2">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Personalized Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* High Priority Insights */}
          {priorityInsights.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-red-600 mb-3">Priority Areas</h4>
              <div className="space-y-3">
                {priorityInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn("p-4 rounded-lg border", getInsightColor(insight.type))}
                  >
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
                        {insight.actionItems && insight.actionItems.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {insight.actionItems.map((action, actionIndex) => (
                              <li key={actionIndex} className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="w-1 h-1 bg-current rounded-full" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Other Insights */}
          {otherInsights.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">Additional Insights</h4>
              <div className="space-y-3">
                {otherInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (priorityInsights.length + index) * 0.1 }}
                    className={cn("p-4 rounded-lg border", getInsightColor(insight.type))}
                  >
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
                        {insight.actionItems && insight.actionItems.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {insight.actionItems.map((action, actionIndex) => (
                              <li key={actionIndex} className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="w-1 h-1 bg-current rounded-full" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface GaugeChartProps {
  value: number
  max?: number
}

function GaugeChart({ value, max = 100 }: GaugeChartProps) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getColor = (percentage: number) => {
    if (percentage >= 80) return '#10B981' // Green
    if (percentage >= 60) return '#3B82F6' // Blue
    if (percentage >= 40) return '#F59E0B' // Yellow
    return '#EF4444' // Red
  }

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={getColor(percentage)}
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{value}%</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </div>
      </div>
    </div>
  )
}

interface SharingOptionsProps {
  result: AssessmentResult
}

function SharingOptions({ result }: SharingOptionsProps) {
  const handleShare = async (platform: string) => {
    // Implementation would depend on sharing requirements
    console.log(`Sharing to ${platform}:`, result.id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Share Your Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <button
            onClick={() => handleShare('link')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Copy Link
          </button>
          <button
            onClick={() => handleShare('social')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Share on Social
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Share your results while maintaining privacy controls
        </p>
      </CardContent>
    </Card>
  )
}
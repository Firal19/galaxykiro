/**
 * ResultsDisplay - Dynamic assessment results display component
 */

"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Download, 
  Share2, 
  RefreshCw, 
  Star,
  Target,
  Lightbulb,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AssessmentResult, 
  ToolConfiguration 
} from '@/services/assessment/AssessmentTypes'
import { cn } from '@/lib/utils'

interface ResultsDisplayProps {
  result: AssessmentResult
  config: ToolConfiguration
  onRetake?: () => void
  onShare?: () => void
  onDownload?: () => void
  className?: string
}

export function ResultsDisplay({
  result,
  config,
  onRetake,
  onShare,
  onDownload,
  className
}: ResultsDisplayProps) {

  const [activeView, setActiveView] = useState<'overview' | 'dimensions' | 'insights'>('overview')

  // Calculate percentage score
  const maxPossibleScore = config.scoring.maxScore || 100
  const scorePercentage = Math.round((result.overallScore / maxPossibleScore) * 100)

  // Get score color based on percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    if (percentage >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  // Get visualization component based on config
  const renderVisualization = () => {
    switch (config.results.visualization) {
      case 'gauge':
        return <GaugeVisualization score={scorePercentage} />
      case 'bar_chart':
        return <BarChartVisualization dimensions={result.dimensionScores} />
      case 'radar':
        return <RadarVisualization dimensions={result.dimensionScores} />
      default:
        return <GaugeVisualization score={scorePercentage} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {config.name.en} Results
          </h1>
          <p className="text-muted-foreground">
            Here are your personalized results and insights
          </p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary/10 rounded-full"
        >
          <Star className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold text-primary">
            {result.overallScore}
          </span>
          <span className="text-muted-foreground">
            / {maxPossibleScore}
          </span>
        </motion.div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="dimensions" className="flex items-center space-x-2">
            <PieChart className="w-4 h-4" />
            <span>Dimensions</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Insights</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Visualization */}
          <Card className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Your Score Breakdown</h3>
              {renderVisualization()}
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {scorePercentage}%
              </div>
              <div className="text-sm text-muted-foreground">
                Overall Performance
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-2">
                {Object.keys(result.dimensionScores).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Areas Assessed
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-2">
                {Math.round(result.processingTime / 1000)}s
              </div>
              <div className="text-sm text-muted-foreground">
                Processing Time
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Dimensions Tab */}
        <TabsContent value="dimensions" className="space-y-4">
          {Object.entries(result.dimensionScores).map(([dimensionId, score]) => {
            const dimension = config.scoring.dimensions.find(d => d.id === dimensionId)
            const percentage = Math.round((score / maxPossibleScore) * 100)
            
            return (
              <motion.div
                key={dimensionId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {dimension?.name.en || dimensionId}
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        Weight: {dimension?.weight || 1.0}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-2xl font-bold", getScoreColor(percentage))}>
                        {score.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </Card>
              </motion.div>
            )
          })}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {/* Key Insights */}
          {result.insights && result.insights.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                <span>Key Insights</span>
              </h3>
              {result.insights.map((insight, index) => (
                <motion.div
                  key={insight.insightId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="mt-1">
                        {insight.type}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">
                          {insight.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Recommendations</span>
              </h3>
              {result.recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">
                          {rec.title}
                        </h4>
                        <Badge variant={rec.priority > 7 ? "default" : "secondary"}>
                          Priority: {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {rec.description}
                      </p>
                      {rec.actionItems && rec.actionItems.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">
                            Action Items:
                          </div>
                          <ul className="space-y-1">
                            {rec.actionItems.map((item, actionIndex) => (
                              <li 
                                key={actionIndex}
                                className="flex items-center space-x-2 text-sm"
                              >
                                <ChevronRight className="w-3 h-3 text-primary" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card className="p-6">
        <div className="flex flex-wrap justify-center gap-4">
          {onRetake && config.allowRetake && (
            <Button
              onClick={onRetake}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </Button>
          )}
          
          {onShare && config.results.shareableResults && (
            <Button
              onClick={onShare}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Results</span>
            </Button>
          )}
          
          {onDownload && config.results.downloadableReport && (
            <Button
              onClick={onDownload}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </Button>
          )}
        </div>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>Assessment completed on {new Date(result.completedAt).toLocaleDateString()}</p>
        <p>Tool version: {result.version} • Session: {result.sessionId.slice(-8)}</p>
      </div>
    </motion.div>
  )
}

// Visualization Components
function GaugeVisualization({ score }: { score: number }) {
  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="20"
          className="text-muted"
        />
        {/* Progress arc */}
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
          className="text-primary"
          strokeDasharray={`${2 * Math.PI * 80}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
          animate={{ 
            strokeDashoffset: 2 * Math.PI * 80 * (1 - score / 100)
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{score}%</div>
          <div className="text-sm text-muted-foreground">Score</div>
        </div>
      </div>
    </div>
  )
}

function BarChartVisualization({ dimensions }: { dimensions: Record<string, number> }) {
  const maxScore = Math.max(...Object.values(dimensions))
  
  return (
    <div className="space-y-4">
      {Object.entries(dimensions).map(([dimension, score], index) => (
        <div key={dimension} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{dimension}</span>
            <span className="text-muted-foreground">{score.toFixed(1)}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / maxScore) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="h-3 bg-primary rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function RadarVisualization({ dimensions }: { dimensions: Record<string, number> }) {
  // Simplified radar chart placeholder
  return (
    <div className="text-center text-muted-foreground">
      <Activity className="w-16 h-16 mx-auto mb-4" />
      <p>Radar chart visualization</p>
      <p className="text-xs">Coming soon</p>
    </div>
  )
}
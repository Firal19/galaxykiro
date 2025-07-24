"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Users,
  TrendingUp,
  Target,
  MousePointer,
  Eye,
  Clock,
  Award,
  Download
} from 'lucide-react'

const conversionFunnelData = [
  { stage: 'Page Visits', count: 45620, percentage: 100 },
  { stage: 'Tool Interactions', count: 12847, percentage: 28.2 },
  { stage: 'Email Captures', count: 8934, percentage: 19.6 },
  { stage: 'Soft Members', count: 3456, percentage: 7.6 },
  { stage: 'Hot Leads', count: 1234, percentage: 2.7 },
  { stage: 'Office Visits', count: 456, percentage: 1.0 }
]

const engagementData = [
  { week: 'Week 1', visitors: 4200, leads: 890, conversions: 234 },
  { week: 'Week 2', visitors: 4800, leads: 1020, conversions: 289 },
  { week: 'Week 3', visitors: 5200, leads: 1180, conversions: 345 },
  { week: 'Week 4', visitors: 5800, leads: 1345, conversions: 398 }
]

const topToolsData = [
  { name: 'Potential Quotient Calculator', completions: 8934, color: '#8B5CF6' },
  { name: 'Goal Achievement Predictor', completions: 6789, color: '#06B6D4' },
  { name: 'Transformation Readiness', completions: 5432, color: '#10B981' },
  { name: 'Leadership Style Profiler', completions: 4321, color: '#F59E0B' },
  { name: 'Habit Installer', completions: 3210, color: '#EF4444' }
]

const sourceTrackingData = [
  { source: 'Instagram', visitors: 15420, conversions: 1234, rate: '8.0%' },
  { source: 'Telegram', visitors: 12890, conversions: 1456, rate: '11.3%' },
  { source: 'LinkedIn', visitors: 8760, conversions: 789, rate: '9.0%' },
  { source: 'Facebook', visitors: 6540, conversions: 567, rate: '8.7%' },
  { source: 'Direct', visitors: 5430, conversions: 678, rate: '12.5%' },
  { source: 'WhatsApp', visitors: 4320, conversions: 543, rate: '12.6%' }
]

export function AdminAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeRange])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Advanced Analytics
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '90d', label: '90 Days' },
              { key: '1y', label: '1 Year' }
            ].map(period => (
              <Button
                key={period.key}
                variant={timeRange === period.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(period.key as any)}
              >
                {period.label}
              </Button>
            ))}
          </div>
          
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Conversion Funnel Analysis
            </h3>
            <Badge variant="outline">
              Overall Conversion: 1.0%
            </Badge>
          </div>

          <div className="space-y-4">
            {conversionFunnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stage.stage}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {stage.count.toLocaleString()}
                    </span>
                    <Badge variant="secondary">
                      {stage.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                  />
                </div>
                {index < conversionFunnelData.length - 1 && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Drop-off: {(stage.percentage - conversionFunnelData[index + 1].percentage).toFixed(1)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Engagement Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Engagement Trends
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Visitors"
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  name="Leads"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Top Performing Tools */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Top Performing Tools
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topToolsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="completions"
                >
                  {topToolsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {topToolsData.map((tool, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: tool.color }}
                    />
                    <span className="text-gray-700 dark:text-gray-300 truncate">
                      {tool.name}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {tool.completions.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Traffic Sources & Attribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Traffic Sources & Attribution
            </h3>
            <Badge variant="outline">
              Total: {sourceTrackingData.reduce((sum, item) => sum + item.visitors, 0).toLocaleString()} visitors
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Source
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Visitors
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Conversions
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Conversion Rate
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                {sourceTrackingData.map((source, index) => (
                  <motion.tr
                    key={source.source}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold mr-3">
                          {source.source[0]}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {source.source}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700 dark:text-gray-300">
                      {source.visitors.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700 dark:text-gray-300">
                      {source.conversions.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-4">
                      <Badge 
                        variant={parseFloat(source.rate) >= 10 ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {source.rate}
                      </Badge>
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            parseFloat(source.rate) >= 12 ? 'bg-green-500' :
                            parseFloat(source.rate) >= 10 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(parseFloat(source.rate) * 8, 100)}%` }}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Key Insights & Recommendations
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Engagement Growth',
                insight: '23% increase in tool completion rates this month',
                recommendation: 'Focus on promoting high-performing tools',
                color: 'text-green-600 dark:text-green-400'
              },
              {
                icon: Target,
                title: 'Conversion Optimization',
                insight: 'WhatsApp and Direct traffic have highest conversion rates',
                recommendation: 'Increase investment in direct outreach strategies',
                color: 'text-blue-600 dark:text-blue-400'
              },
              {
                icon: Users,
                title: 'User Behavior',
                insight: 'Users who complete 2+ assessments are 5x more likely to convert',
                recommendation: 'Create assessment completion incentives',
                color: 'text-purple-600 dark:text-purple-400'
              }
            ].map((insight, index) => {
              const IconComponent = insight.icon
              return (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <IconComponent className={`w-5 h-5 mr-2 ${insight.color}`} />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {insight.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {insight.insight}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    💡 {insight.recommendation}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
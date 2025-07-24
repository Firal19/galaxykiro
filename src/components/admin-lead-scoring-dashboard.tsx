"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Users,
  TrendingUp,
  Target,
  Clock,
  Award,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { leadScoringService } from '@/lib/lead-scoring-service'

interface ConversionFunnelData {
  stage: string
  visitors: number
  conversionRate: number
  dropOff: number
}

interface EngagementTrendData {
  date: string
  visitors: number
  cold_leads: number
  candidates: number
  hot_leads: number
}

interface LeadQualityData {
  status: string
  count: number
  avgScore: number
  conversionRate: number
  color: string
}

export function AdminLeadScoringDashboard() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [leadMetrics, setLeadMetrics] = useState({
    totalLeads: 0,
    newLeadsToday: 0,
    avgEngagementScore: 0,
    conversionRate: 0,
    avgTimeToConversion: 0
  })
  
  // Mock data - in real implementation, fetch from API
  const conversionFunnelData: ConversionFunnelData[] = [
    { stage: 'Visitors', visitors: 2450, conversionRate: 100, dropOff: 0 },
    { stage: 'Cold Leads', visitors: 1620, conversionRate: 66.1, dropOff: 830 },
    { stage: 'Candidates', visitors: 614, conversionRate: 37.9, dropOff: 1006 },
    { stage: 'Hot Leads', visitors: 175, conversionRate: 28.5, dropOff: 439 }
  ]

  const engagementTrendData: EngagementTrendData[] = [
    { date: '2024-01-01', visitors: 245, cold_leads: 162, candidates: 61, hot_leads: 17 },
    { date: '2024-01-02', visitors: 267, cold_leads: 176, candidates: 67, hot_leads: 19 },
    { date: '2024-01-03', visitors: 223, cold_leads: 147, candidates: 56, hot_leads: 16 },
    { date: '2024-01-04', visitors: 289, cold_leads: 191, candidates: 72, hot_leads: 21 },
    { date: '2024-01-05', visitors: 312, cold_leads: 206, candidates: 78, hot_leads: 22 },
    { date: '2024-01-06', visitors: 278, cold_leads: 184, candidates: 70, hot_leads: 20 },
    { date: '2024-01-07', visitors: 298, cold_leads: 197, candidates: 75, hot_leads: 21 }
  ]

  const leadQualityData: LeadQualityData[] = [
    { status: 'Visitors', count: 1547, avgScore: 8, conversionRate: 12.5, color: '#10B981' },
    { status: 'Cold Leads', count: 923, avgScore: 34, conversionRate: 28.3, color: '#3B82F6' },
    { status: 'Candidates', count: 287, avgScore: 89, conversionRate: 52.7, color: '#8B5CF6' },
    { status: 'Hot Leads', count: 78, avgScore: 167, conversionRate: 84.2, color: '#EF4444' }
  ]

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setLeadMetrics({
          totalLeads: 2835,
          newLeadsToday: 47,
          avgEngagementScore: 42,
          conversionRate: 7.8,
          avgTimeToConversion: 12
        })
      } catch (error) {
        console.error('Error fetching lead metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [timeframe])

  const exportData = () => {
    // Export lead scoring data
    console.log('Exporting lead scoring data...')
  }

  const refreshData = () => {
    // Refresh dashboard data
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Lead Scoring Dashboard</h2>
          <p className="text-gray-300">Comprehensive lead conversion analytics and pipeline insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: 'Total Leads',
                value: leadMetrics.totalLeads.toLocaleString(),
                change: '+12.5%',
                icon: Users,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'New Today',
                value: leadMetrics.newLeadsToday,
                change: '+8.3%',
                icon: TrendingUp,
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Avg Engagement',
                value: leadMetrics.avgEngagementScore,
                change: '+15.2%',
                icon: Target,
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Conversion Rate',
                value: `${leadMetrics.conversionRate}%`,
                change: '+2.1%',
                icon: Award,
                color: 'from-orange-500 to-red-500'
              },
              {
                title: 'Avg Time to Convert',
                value: `${leadMetrics.avgTimeToConversion} days`,
                change: '-3.2%',
                icon: Clock,
                color: 'from-indigo-500 to-purple-500'
              }
            ].map((metric, index) => {
              const IconComponent = metric.icon
              const isPositive = !metric.change.startsWith('-')
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-400">{metric.title}</div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Conversion Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Conversion Funnel</h3>
              
              <div className="space-y-4">
                {conversionFunnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-300">{stage.visitors.toLocaleString()} visitors</span>
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {stage.conversionRate.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-slate-700 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${stage.conversionRate}%` }}
                        >
                          <span className="text-xs font-medium text-white">
                            {stage.visitors.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      {stage.dropOff > 0 && (
                        <div className="mt-1 text-xs text-red-400">
                          Drop-off: {stage.dropOff.toLocaleString()} visitors
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Engagement Trends */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">Engagement Trends</h3>
                
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Area type="monotone" dataKey="hot_leads" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="candidates" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="cold_leads" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="visitors" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Lead Quality Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">Lead Quality Distribution</h3>
                
                <div className="space-y-4">
                  {leadQualityData.map((lead, index) => (
                    <div key={lead.status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: lead.color }}
                          />
                          <span className="text-white font-medium">{lead.status}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{lead.count.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">Avg: {lead.avgScore} pts</div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={lead.conversionRate} 
                        className="h-2"
                        style={{ 
                          '--progress-background': lead.color 
                        } as React.CSSProperties}
                      />
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Conversion Rate</span>
                        <span>{lead.conversionRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Lead Scoring Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Scoring Rules & Thresholds</h3>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Configure Rules
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    rule: 'Tool Usage',
                    points: '+20 pts',
                    weight: 'High',
                    description: 'User completes assessment tool'
                  },
                  {
                    rule: 'Email Verification',
                    points: '+50 pts',
                    weight: 'Very High',
                    description: 'User verifies email address'
                  },
                  {
                    rule: 'Webinar Registration',
                    points: '+100 pts',
                    weight: 'Critical',
                    description: 'User registers for webinar'
                  },
                  {
                    rule: 'Time on Site',
                    points: '+1 pt/min',
                    weight: 'Low',
                    description: 'Engagement duration tracking'
                  }
                ].map((rule, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{rule.rule}</h4>
                      <Badge 
                        className={`${
                          rule.weight === 'Critical' ? 'bg-red-500' :
                          rule.weight === 'Very High' ? 'bg-orange-500' :
                          rule.weight === 'High' ? 'bg-yellow-500' : 'bg-gray-500'
                        } text-white`}
                      >
                        {rule.weight}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-purple-400 mb-1">{rule.points}</div>
                    <p className="text-sm text-gray-400">{rule.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  )
}
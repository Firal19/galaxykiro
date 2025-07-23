'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Card } from './ui/card';

interface PerformanceMetric {
  timestamp: string;
  value: number;
  metric_name: string;
  page_path: string;
  performance_category?: string;
}

interface PerformanceData {
  metrics: PerformanceMetric[];
  summary: {
    lcp: { avg: number; p75: number; p95: number; };
    fid: { avg: number; p75: number; p95: number; };
    cls: { avg: number; p75: number; p95: number; };
    ttfb: { avg: number; p75: number; p95: number; };
  };
  pageViews: { path: string; count: number; }[];
  performanceByPage: { path: string; lcp: number; cls: number; }[];
  performanceByDevice: { device: string; lcp: number; cls: number; }[];
  performanceByConnection: { connection: string; lcp: number; ttfb: number; }[];
}

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics/performance?timeRange=${timeRange}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch performance data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setPerformanceData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching performance data:', err);
        setError('Failed to load performance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        <p>No performance data available for the selected time range.</p>
      </div>
    );
  }

  // Format data for charts
  const webVitalsData = [
    { name: 'LCP', value: performanceData.summary.lcp.avg, p75: performanceData.summary.lcp.p75, p95: performanceData.summary.lcp.p95 },
    { name: 'FID', value: performanceData.summary.fid.avg, p75: performanceData.summary.fid.p75, p95: performanceData.summary.fid.p95 },
    { name: 'CLS', value: performanceData.summary.cls.avg * 100, p75: performanceData.summary.cls.p75 * 100, p95: performanceData.summary.cls.p95 * 100 },
    { name: 'TTFB', value: performanceData.summary.ttfb.avg, p75: performanceData.summary.ttfb.p75, p95: performanceData.summary.ttfb.p95 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 rounded ${timeRange === 'day' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded ${timeRange === 'week' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded ${timeRange === 'month' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            30 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">LCP</h3>
          <div className="text-3xl font-bold">{performanceData.summary.lcp.avg.toFixed(0)}ms</div>
          <div className="text-sm text-gray-500">75th: {performanceData.summary.lcp.p75.toFixed(0)}ms</div>
          <div className={`text-sm ${performanceData.summary.lcp.avg <= 2500 ? 'text-green-500' : 'text-red-500'}`}>
            {performanceData.summary.lcp.avg <= 2500 ? 'Good' : 'Needs Improvement'}
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">FID</h3>
          <div className="text-3xl font-bold">{performanceData.summary.fid.avg.toFixed(0)}ms</div>
          <div className="text-sm text-gray-500">75th: {performanceData.summary.fid.p75.toFixed(0)}ms</div>
          <div className={`text-sm ${performanceData.summary.fid.avg <= 100 ? 'text-green-500' : 'text-red-500'}`}>
            {performanceData.summary.fid.avg <= 100 ? 'Good' : 'Needs Improvement'}
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">CLS</h3>
          <div className="text-3xl font-bold">{performanceData.summary.cls.avg.toFixed(2)}</div>
          <div className="text-sm text-gray-500">75th: {performanceData.summary.cls.p75.toFixed(2)}</div>
          <div className={`text-sm ${performanceData.summary.cls.avg <= 0.1 ? 'text-green-500' : 'text-red-500'}`}>
            {performanceData.summary.cls.avg <= 0.1 ? 'Good' : 'Needs Improvement'}
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">TTFB</h3>
          <div className="text-3xl font-bold">{performanceData.summary.ttfb.avg.toFixed(0)}ms</div>
          <div className="text-sm text-gray-500">75th: {performanceData.summary.ttfb.p75.toFixed(0)}ms</div>
          <div className={`text-sm ${performanceData.summary.ttfb.avg <= 800 ? 'text-green-500' : 'text-red-500'}`}>
            {performanceData.summary.ttfb.avg <= 800 ? 'Good' : 'Needs Improvement'}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Web Vitals Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={webVitalsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}${value === 'CLS' ? '' : 'ms'}`} />
            <Legend />
            <Bar dataKey="value" name="Average" fill="#10B981" />
            <Bar dataKey="p75" name="75th Percentile" fill="#3B82F6" />
            <Bar dataKey="p95" name="95th Percentile" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Performance by Page</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData.performanceByPage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="path" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="lcp" name="LCP (ms)" fill="#10B981" />
              <Bar dataKey="cls" name="CLS (x100)" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Performance by Device</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData.performanceByDevice}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="device" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="lcp" name="LCP (ms)" fill="#10B981" />
              <Bar dataKey="cls" name="CLS (x100)" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Performance by Connection Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData.performanceByConnection}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="connection" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="lcp" name="LCP (ms)" fill="#10B981" />
            <Bar dataKey="ttfb" name="TTFB (ms)" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Most Viewed Pages</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Path</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData.pageViews.map((page, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{page.path}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
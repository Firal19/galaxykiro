import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || 'day';
    
    // Calculate date range based on timeRange
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setDate(now.getDate() - 1);
    }
    
    // Format dates for Supabase query
    const startDateStr = startDate.toISOString();
    const endDateStr = now.toISOString();
    
    // Fetch metrics from Supabase
    const { data: metrics, error: metricsError } = await supabase
      .from('performance_metrics')
      .select('*')
      .gte('timestamp', startDateStr)
      .lte('timestamp', endDateStr)
      .order('timestamp', { ascending: true });
    
    if (metricsError) {
      console.error('Error fetching performance metrics:', metricsError);
      return NextResponse.json({ error: 'Failed to fetch performance data' }, { status: 500 });
    }
    
    // Calculate summary statistics
    const lcpMetrics = metrics.filter(m => m.metric_name === 'LCP').map(m => m.value);
    const fidMetrics = metrics.filter(m => m.metric_name === 'FID').map(m => m.value);
    const clsMetrics = metrics.filter(m => m.metric_name === 'CLS').map(m => m.value);
    const ttfbMetrics = metrics.filter(m => m.metric_name === 'TTFB').map(m => m.value);
    
    // Helper function to calculate statistics
    const calculateStats = (values: number[]) => {
      if (values.length === 0) return { avg: 0, p75: 0, p95: 0 };
      
      const sorted = [...values].sort((a, b) => a - b);
      const sum = sorted.reduce((a, b) => a + b, 0);
      const avg = sum / sorted.length;
      
      const p75Index = Math.floor(sorted.length * 0.75);
      const p95Index = Math.floor(sorted.length * 0.95);
      
      return {
        avg,
        p75: sorted[p75Index] || 0,
        p95: sorted[p95Index] || 0,
      };
    };
    
    // Calculate page views
    const pageViews = metrics.reduce((acc: Record<string, number>, metric) => {
      if (!acc[metric.page_path]) {
        acc[metric.page_path] = 0;
      }
      acc[metric.page_path]++;
      return acc;
    }, {});
    
    const pageViewsArray = Object.entries(pageViews)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Calculate performance by page
    const performanceByPage = Object.keys(pageViews).map(path => {
      const pageMetrics = metrics.filter(m => m.page_path === path);
      const pageLcp = calculateStats(pageMetrics.filter(m => m.metric_name === 'LCP').map(m => m.value));
      const pageCls = calculateStats(pageMetrics.filter(m => m.metric_name === 'CLS').map(m => m.value));
      
      return {
        path,
        lcp: pageLcp.avg,
        cls: pageCls.avg * 100, // Multiply by 100 for better visualization
      };
    }).sort((a, b) => b.lcp - a.lcp).slice(0, 5);
    
    // Extract device information from user agent
    const getDeviceType = (userAgent: string) => {
      if (!userAgent) return 'Unknown';
      if (userAgent.includes('Mobile')) return 'Mobile';
      if (userAgent.includes('Tablet')) return 'Tablet';
      return 'Desktop';
    };
    
    // Calculate performance by device
    const deviceMetrics: Record<string, { lcp: number[], cls: number[] }> = {};
    
    metrics.forEach(metric => {
      const device = getDeviceType(metric.user_agent || '');
      
      if (!deviceMetrics[device]) {
        deviceMetrics[device] = { lcp: [], cls: [] };
      }
      
      if (metric.metric_name === 'LCP') {
        deviceMetrics[device].lcp.push(metric.value);
      } else if (metric.metric_name === 'CLS') {
        deviceMetrics[device].cls.push(metric.value);
      }
    });
    
    const performanceByDevice = Object.entries(deviceMetrics).map(([device, values]) => ({
      device,
      lcp: values.lcp.length ? values.lcp.reduce((a, b) => a + b, 0) / values.lcp.length : 0,
      cls: values.cls.length ? (values.cls.reduce((a, b) => a + b, 0) / values.cls.length) * 100 : 0,
    }));
    
    // Calculate performance by connection type
    const connectionMetrics: Record<string, { lcp: number[], ttfb: number[] }> = {};
    
    metrics.forEach(metric => {
      const connection = metric.connection_type || 'Unknown';
      
      if (!connectionMetrics[connection]) {
        connectionMetrics[connection] = { lcp: [], ttfb: [] };
      }
      
      if (metric.metric_name === 'LCP') {
        connectionMetrics[connection].lcp.push(metric.value);
      } else if (metric.metric_name === 'TTFB') {
        connectionMetrics[connection].ttfb.push(metric.value);
      }
    });
    
    const performanceByConnection = Object.entries(connectionMetrics).map(([connection, values]) => ({
      connection,
      lcp: values.lcp.length ? values.lcp.reduce((a, b) => a + b, 0) / values.lcp.length : 0,
      ttfb: values.ttfb.length ? values.ttfb.reduce((a, b) => a + b, 0) / values.ttfb.length : 0,
    }));
    
    // Prepare response data
    const responseData = {
      metrics,
      summary: {
        lcp: calculateStats(lcpMetrics),
        fid: calculateStats(fidMetrics),
        cls: calculateStats(clsMetrics),
        ttfb: calculateStats(ttfbMetrics),
      },
      pageViews: pageViewsArray,
      performanceByPage,
      performanceByDevice,
      performanceByConnection,
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error processing performance data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
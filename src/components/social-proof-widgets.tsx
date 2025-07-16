'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface SocialProofData {
  assessmentsTaken: number;
  toolsUsed: number;
  activeUsers: number;
  successStories: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'assessment' | 'tool' | 'registration' | 'achievement';
  message: string;
  timestamp: Date;
  location?: string;
}

export function LiveCountersWidget() {
  const [data, setData] = useState<SocialProofData>({
    assessmentsTaken: 12847,
    toolsUsed: 8932,
    activeUsers: 234,
    successStories: 1456,
    recentActivity: []
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        assessmentsTaken: prev.assessmentsTaken + Math.floor(Math.random() * 3),
        toolsUsed: prev.toolsUsed + Math.floor(Math.random() * 2),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            <AnimatedCounter value={data.assessmentsTaken} />
          </div>
          <p className="text-sm text-gray-600">Assessments Taken</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            <AnimatedCounter value={data.toolsUsed} />
          </div>
          <p className="text-sm text-gray-600">Tools Used</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            <AnimatedCounter value={data.activeUsers} />
          </div>
          <p className="text-sm text-gray-600">Active Users</p>
          <Badge variant="secondary" className="text-xs mt-1">
            Live Now
          </Badge>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            <AnimatedCounter value={data.successStories} />
          </div>
          <p className="text-sm text-gray-600">Success Stories</p>
        </div>
      </div>
    </Card>
  );
}

export function ActivityFeedWidget() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'assessment',
      message: 'Someone from Addis Ababa completed the Potential Assessment',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      location: 'Addis Ababa'
    },
    {
      id: '2',
      type: 'tool',
      message: 'A user from Dire Dawa used the Success Factor Calculator',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      location: 'Dire Dawa'
    },
    {
      id: '3',
      type: 'registration',
      message: 'New member joined from Bahir Dar',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      location: 'Bahir Dar'
    },
    {
      id: '4',
      type: 'achievement',
      message: 'Someone completed their 7-day habit challenge',
      timestamp: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
      id: '5',
      type: 'tool',
      message: 'A user from Mekelle discovered their leadership style',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      location: 'Mekelle'
    }
  ]);

  useEffect(() => {
    // Simulate new activities
    const interval = setInterval(() => {
      const activityTypes: ActivityItem['type'][] = ['assessment', 'tool', 'registration', 'achievement'];
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        message: getRandomActivityMessage(),
        timestamp: new Date(),
        location: getRandomLocation()
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 45000); // New activity every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const getRandomActivityMessage = () => {
    const messages = [
      'Someone completed the Vision Clarity Assessment',
      'A user discovered their limiting beliefs',
      'New member registered for the masterclass',
      'Someone achieved their transformation goal',
      'A user completed the Leadership Style Identifier',
      'Someone from Ethiopia joined the community'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRandomLocation = () => {
    const locations = ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Mekelle', 'Hawassa', 'Gondar', 'Jimma'];
    return Math.random() > 0.3 ? locations[Math.floor(Math.random() * locations.length)] : undefined;
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'assessment':
        return '📊';
      case 'tool':
        return '🛠️';
      case 'registration':
        return '👋';
      case 'achievement':
        return '🎉';
      default:
        return '✨';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Live Activity</h3>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live
        </Badge>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 text-sm">
            <span className="text-lg">{getActivityIcon(activity.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-gray-700">{activity.message}</p>
              <p className="text-gray-500 text-xs">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
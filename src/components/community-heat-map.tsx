'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CityActivity {
  city: string;
  coordinates: [number, number]; // [lat, lng]
  activeUsers: number;
  recentActivity: number; // Activity in last hour
  topTools: string[];
  engagementLevel: 'low' | 'medium' | 'high';
}

interface HeatMapData {
  cities: CityActivity[];
  totalActiveUsers: number;
  peakHours: number[];
  mostPopularTools: string[];
}

const ethiopianCities: CityActivity[] = [
  {
    city: 'Addis Ababa',
    coordinates: [9.0320, 38.7469],
    activeUsers: 89,
    recentActivity: 23,
    topTools: ['Potential Assessment', 'Leadership Identifier', 'Vision Visualizer'],
    engagementLevel: 'high'
  },
  {
    city: 'Dire Dawa',
    coordinates: [9.5926, 41.8661],
    activeUsers: 34,
    recentActivity: 8,
    topTools: ['Success Calculator', 'Habit Analyzer', 'Goal Predictor'],
    engagementLevel: 'medium'
  },
  {
    city: 'Bahir Dar',
    coordinates: [11.5942, 37.3615],
    activeUsers: 28,
    recentActivity: 12,
    topTools: ['Future Self Visualizer', 'Dream Generator', 'Life Wheel'],
    engagementLevel: 'medium'
  },
  {
    city: 'Mekelle',
    coordinates: [13.4967, 39.4753],
    activeUsers: 19,
    recentActivity: 5,
    topTools: ['Leadership Profiler', 'Habit Installer', 'Mental Model Mapper'],
    engagementLevel: 'medium'
  },
  {
    city: 'Hawassa',
    coordinates: [7.0621, 38.4759],
    activeUsers: 22,
    recentActivity: 7,
    topTools: ['Potential Calculator', 'Belief Identifier', 'Achievement Predictor'],
    engagementLevel: 'medium'
  },
  {
    city: 'Gondar',
    coordinates: [12.6090, 37.4671],
    activeUsers: 15,
    recentActivity: 4,
    topTools: ['Success Factor Calculator', 'Routine Optimizer', 'Inner Dialogue Decoder'],
    engagementLevel: 'low'
  },
  {
    city: 'Jimma',
    coordinates: [7.6731, 36.8344],
    activeUsers: 12,
    recentActivity: 3,
    topTools: ['Habit Strength Analyzer', 'Affirmation Architect', 'Team Builder'],
    engagementLevel: 'low'
  }
];

export function CommunityHeatMap() {
  const [heatMapData, setHeatMapData] = useState<HeatMapData>({
    cities: ethiopianCities,
    totalActiveUsers: ethiopianCities.reduce((sum, city) => sum + city.activeUsers, 0),
    peakHours: [9, 14, 20], // 9 AM, 2 PM, 8 PM
    mostPopularTools: ['Potential Assessment', 'Leadership Identifier', 'Success Calculator']
  });

  const [selectedCity, setSelectedCity] = useState<CityActivity | null>(null);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setHeatMapData(prev => ({
        ...prev,
        cities: prev.cities.map(city => ({
          ...city,
          activeUsers: city.activeUsers + Math.floor(Math.random() * 3) - 1,
          recentActivity: Math.max(0, city.recentActivity + Math.floor(Math.random() * 5) - 2)
        }))
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getEngagementColor = (level: CityActivity['engagementLevel']) => {
    switch (level) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getEngagementSize = (level: CityActivity['engagementLevel']) => {
    switch (level) {
      case 'high':
        return 'w-6 h-6';
      case 'medium':
        return 'w-4 h-4';
      case 'low':
        return 'w-3 h-3';
      default:
        return 'w-2 h-2';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Live Community Activity Across Ethiopia
        </h3>
        <p className="text-gray-600">
          See where people are discovering their potential right now
        </p>
      </div>

      {/* Heat Map Visualization */}
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Map Representation */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-8 h-80 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-blue-200/30"></div>
              
              {/* Ethiopia outline representation */}
              <div className="absolute inset-4 border-2 border-gray-300 rounded-lg bg-white/50">
                <div className="relative w-full h-full">
                  {heatMapData.cities.map((city, index) => (
                    <div
                      key={city.city}
                      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getEngagementSize(city.engagementLevel)} ${getEngagementColor(city.engagementLevel)} rounded-full animate-pulse hover:scale-150 transition-transform`}
                      style={{
                        left: `${20 + (index % 3) * 25 + Math.random() * 10}%`,
                        top: `${15 + Math.floor(index / 3) * 20 + Math.random() * 10}%`
                      }}
                      onClick={() => setSelectedCity(city)}
                      title={`${city.city}: ${city.activeUsers} active users`}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                        {city.city}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white/90 p-2 rounded text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>High Activity</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* City Details */}
          <div className="space-y-4">
            {selectedCity ? (
              <Card className="p-4 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg">{selectedCity.city}</h4>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {selectedCity.engagementLevel} activity
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-semibold">{selectedCity.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recent Activity:</span>
                    <span className="font-semibold">{selectedCity.recentActivity} in last hour</span>
                  </div>
                  <div>
                    <span className="font-medium">Popular Tools:</span>
                    <div className="mt-1 space-y-1">
                      {selectedCity.topTools.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-4 border-dashed border-2 border-gray-300">
                <p className="text-gray-500 text-center">
                  Click on a city dot to see detailed activity
                </p>
              </Card>
            )}

            {/* Overall Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {heatMapData.totalActiveUsers}
                </div>
                <p className="text-xs text-gray-600">Active Users</p>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {heatMapData.cities.length}
                </div>
                <p className="text-xs text-gray-600">Active Cities</p>
              </Card>
            </div>
          </div>
        </div>

        {/* City List */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold mb-3">City Activity Overview</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {heatMapData.cities
              .sort((a, b) => b.activeUsers - a.activeUsers)
              .map((city) => (
                <div
                  key={city.city}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedCity(city)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${getEngagementColor(city.engagementLevel)} rounded-full`}></div>
                    <span className="font-medium text-sm">{city.city}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{city.activeUsers}</div>
                    <div className="text-xs text-gray-500">{city.recentActivity}/hr</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Card>

      {/* Peak Activity Times */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Peak Activity Hours (Ethiopian Time)</h4>
        <div className="flex justify-center space-x-8">
          {heatMapData.peakHours.map((hour) => (
            <div key={hour} className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {hour}:00
              </div>
              <p className="text-sm text-gray-600">Peak Hour</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
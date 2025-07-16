'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TrustLevel {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  benefits: string[];
  icon: string;
  color: string;
  progressColor: string;
  minScore: number;
}

interface UserTrustProgress {
  currentLevel: string;
  currentScore: number;
  completedRequirements: string[];
  nextLevelProgress: number;
  timeInCurrentLevel: number; // days
  totalEngagementTime: number; // minutes
}

const trustLevels: TrustLevel[] = [
  {
    id: 'curious',
    name: 'Curious Visitor',
    description: 'Just discovering what we offer',
    requirements: [
      'Visit the website',
      'Read at least one section',
      'Spend 2+ minutes on site'
    ],
    benefits: [
      'Access to basic assessments',
      'View success stories',
      'Browse content library'
    ],
    icon: '👀',
    color: 'bg-gray-100 text-gray-800',
    progressColor: 'bg-gray-400',
    minScore: 0
  },
  {
    id: 'interested',
    name: 'Interested Explorer',
    description: 'Actively engaging with our content',
    requirements: [
      'Complete at least one assessment',
      'Provide email address',
      'Spend 10+ minutes exploring',
      'View 3+ different sections'
    ],
    benefits: [
      'Personalized assessment results',
      'Email insights and tips',
      'Access to more tools',
      'Progress tracking'
    ],
    icon: '🔍',
    color: 'bg-blue-100 text-blue-800',
    progressColor: 'bg-blue-400',
    minScore: 15
  },
  {
    id: 'engaged',
    name: 'Engaged Learner',
    description: 'Committed to personal growth',
    requirements: [
      'Complete 3+ assessments',
      'Provide phone number',
      'Return to site within 7 days',
      'Spend 30+ minutes total',
      'Download at least one resource'
    ],
    benefits: [
      'Advanced assessment tools',
      'Personalized recommendations',
      'SMS insights and reminders',
      'Priority support',
      'Exclusive content access'
    ],
    icon: '📚',
    color: 'bg-green-100 text-green-800',
    progressColor: 'bg-green-400',
    minScore: 40
  },
  {
    id: 'committed',
    name: 'Committed Member',
    description: 'Serious about transformation',
    requirements: [
      'Complete full profile',
      'Use 5+ different tools',
      'Register for webinar',
      'Spend 60+ minutes total',
      'Return 3+ times',
      'Share or refer someone'
    ],
    benefits: [
      'Full tool suite access',
      'Webinar participation',
      'Community access',
      'Personal action plans',
      'Monthly check-ins',
      'Office visit eligibility'
    ],
    icon: '🎯',
    color: 'bg-purple-100 text-purple-800',
    progressColor: 'bg-purple-400',
    minScore: 70
  },
  {
    id: 'advocate',
    name: 'Trusted Advocate',
    description: 'Experiencing real transformation',
    requirements: [
      'Complete transformation journey',
      'Attend office visit or webinar',
      'Provide success story',
      'Refer 2+ people',
      'Engage for 30+ days',
      'Use platform regularly'
    ],
    benefits: [
      'VIP support access',
      'Beta feature testing',
      'Community leadership role',
      'Referral rewards',
      'Advanced coaching access',
      'Success story features'
    ],
    icon: '⭐',
    color: 'bg-yellow-100 text-yellow-800',
    progressColor: 'bg-yellow-400',
    minScore: 100
  }
];

export function TrustLadderProgression({ userProgress }: { userProgress?: UserTrustProgress }) {
  const [currentProgress] = useState<UserTrustProgress>(
    userProgress || {
      currentLevel: 'curious',
      currentScore: 8,
      completedRequirements: ['Visit the website', 'Read at least one section'],
      nextLevelProgress: 53,
      timeInCurrentLevel: 0,
      totalEngagementTime: 3
    }
  );

  const currentLevel = trustLevels.find(level => level.id === currentProgress.currentLevel);
  const currentLevelIndex = trustLevels.findIndex(level => level.id === currentProgress.currentLevel);
  const nextLevel = trustLevels[currentLevelIndex + 1];

  const calculateOverallProgress = () => {
    const totalLevels = trustLevels.length;
    const currentLevelProgress = currentLevelIndex / (totalLevels - 1);
    const nextLevelContribution = nextLevel ? (currentProgress.nextLevelProgress / 100) * (1 / (totalLevels - 1)) : 0;
    return Math.min(100, (currentLevelProgress + nextLevelContribution) * 100);
  };

  const getRequirementStatus = (requirement: string, levelId: string) => {
    if (currentProgress.completedRequirements.includes(requirement)) {
      return 'completed';
    }
    
    const levelIndex = trustLevels.findIndex(level => level.id === levelId);
    const currentLevelIndex = trustLevels.findIndex(level => level.id === currentProgress.currentLevel);
    
    if (levelIndex < currentLevelIndex) {
      return 'completed';
    } else if (levelIndex === currentLevelIndex) {
      return 'in-progress';
    } else {
      return 'locked';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'locked':
        return '🔒';
      default:
        return '⭕';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Your Trust Journey with Galaxy Dream Team
        </h3>
        <p className="text-gray-600">
          See how your engagement builds trust and unlocks new opportunities
        </p>
      </div>

      {/* Current Status Overview */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="text-4xl">{currentLevel?.icon}</div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">{currentLevel?.name}</h4>
              <p className="text-gray-600">{currentLevel?.description}</p>
              <Badge className={currentLevel?.color}>
                Score: {currentProgress.currentScore} points
              </Badge>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(calculateOverallProgress())}%
            </div>
            <p className="text-sm text-gray-600">Overall Progress</p>
          </div>
        </div>

        {nextLevel && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress to {nextLevel.name}
              </span>
              <span className="text-sm text-gray-600">
                {currentProgress.nextLevelProgress}%
              </span>
            </div>
            <Progress value={currentProgress.nextLevelProgress} className="h-2" />
          </div>
        )}
      </Card>

      {/* Trust Levels Ladder */}
      <div className="space-y-4">
        {trustLevels.map((level, index) => {
          const isCurrentLevel = level.id === currentProgress.currentLevel;
          const isPastLevel = index < currentLevelIndex;

          return (
            <Card
              key={level.id}
              className={`p-4 transition-all ${
                isCurrentLevel
                  ? 'border-2 border-blue-400 shadow-lg'
                  : isPastLevel
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    isPastLevel ? 'bg-green-500 text-white' :
                    isCurrentLevel ? 'bg-blue-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {isPastLevel ? '✓' : level.icon}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg text-gray-900">{level.name}</h4>
                    <Badge className={level.color}>
                      {level.minScore}+ points
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{level.description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Requirements */}
                    <div>
                      <h5 className="font-semibold text-sm text-gray-800 mb-2">Requirements:</h5>
                      <ul className="space-y-1">
                        {level.requirements.map((requirement, reqIndex) => {
                          const status = getRequirementStatus(requirement, level.id);
                          return (
                            <li key={reqIndex} className="flex items-center space-x-2 text-sm">
                              <span>{getStatusIcon(status)}</span>
                              <span className={
                                status === 'completed' ? 'text-green-700 line-through' :
                                status === 'in-progress' ? 'text-blue-700' :
                                'text-gray-500'
                              }>
                                {requirement}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h5 className="font-semibold text-sm text-gray-800 mb-2">Benefits:</h5>
                      <ul className="space-y-1">
                        {level.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center space-x-2 text-sm">
                            <span className="text-green-500">✨</span>
                            <span className={
                              isPastLevel || isCurrentLevel ? 'text-gray-700' : 'text-gray-400'
                            }>
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {isCurrentLevel && nextLevel && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium mb-2">
                        🎯 Next milestone: {nextLevel.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        Complete {level.requirements.length - currentProgress.completedRequirements.length} more requirements to advance
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Engagement Stats */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Your Engagement Journey</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{currentProgress.timeInCurrentLevel}</div>
            <p className="text-xs text-gray-600">Days at Current Level</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{currentProgress.totalEngagementTime}</div>
            <p className="text-xs text-gray-600">Total Minutes Engaged</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{currentProgress.completedRequirements.length}</div>
            <p className="text-xs text-gray-600">Requirements Completed</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{currentProgress.currentScore}</div>
            <p className="text-xs text-gray-600">Trust Score</p>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      {nextLevel && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 text-center">
          <h4 className="font-bold text-lg mb-2">Ready to Level Up?</h4>
          <p className="text-gray-600 mb-4">
            You're {100 - currentProgress.nextLevelProgress}% away from becoming a {nextLevel.name}
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Continue Your Journey
          </Button>
        </Card>
      )}
    </div>
  );
}
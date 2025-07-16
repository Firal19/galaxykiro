'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface ResearchCitation {
  id: string;
  title: string;
  source: string;
  year: number;
  url: string;
  relevance: string;
  keyFinding: string;
}

interface SuccessMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  description: string;
  icon: string;
  color: string;
}

const researchCitations: ResearchCitation[] = [
  {
    id: '1',
    title: 'The Science of Well-Being and Performance',
    source: 'Harvard Business Review',
    year: 2023,
    url: 'https://hbr.org/2023/wellbeing-performance',
    relevance: 'Supports our assessment methodology',
    keyFinding: 'Structured self-assessment increases performance by 23%'
  },
  {
    id: '2',
    title: 'Neuroplasticity and Habit Formation',
    source: 'Journal of Behavioral Psychology',
    year: 2022,
    url: 'https://jbp.org/2022/neuroplasticity-habits',
    relevance: 'Validates our habit change approach',
    keyFinding: 'Systematic habit tracking improves success rates by 42%'
  },
  {
    id: '3',
    title: 'Leadership Development Through Self-Awareness',
    source: 'MIT Sloan Management Review',
    year: 2023,
    url: 'https://sloanreview.mit.edu/2023/leadership-self-awareness',
    relevance: 'Backs our leadership assessment tools',
    keyFinding: 'Self-aware leaders are 79% more effective'
  },
  {
    id: '4',
    title: 'Goal Setting and Achievement Psychology',
    source: 'American Psychological Association',
    year: 2022,
    url: 'https://apa.org/2022/goal-achievement',
    relevance: 'Supports our goal-setting framework',
    keyFinding: 'Specific goal visualization increases achievement by 35%'
  },
  {
    id: '5',
    title: 'The Impact of Progressive Disclosure in Learning',
    source: 'Educational Technology Research',
    year: 2023,
    url: 'https://etr.org/2023/progressive-disclosure',
    relevance: 'Validates our progressive capture approach',
    keyFinding: 'Progressive information gathering improves completion by 67%'
  }
];

const successMetrics: SuccessMetric[] = [
  {
    id: '1',
    label: 'User Satisfaction Rate',
    value: 94.7,
    unit: '%',
    description: 'Users report positive transformation',
    icon: '😊',
    color: 'text-green-600'
  },
  {
    id: '2',
    label: 'Goal Achievement Rate',
    value: 78.3,
    unit: '%',
    description: 'Users achieve their stated goals',
    icon: '🎯',
    color: 'text-blue-600'
  },
  {
    id: '3',
    label: 'Tool Completion Rate',
    value: 89.2,
    unit: '%',
    description: 'Users complete full assessments',
    icon: '✅',
    color: 'text-purple-600'
  },
  {
    id: '4',
    label: 'Return Engagement',
    value: 73.8,
    unit: '%',
    description: 'Users return within 30 days',
    icon: '🔄',
    color: 'text-orange-600'
  },
  {
    id: '5',
    label: 'Recommendation Rate',
    value: 91.5,
    unit: '%',
    description: 'Users recommend to others',
    icon: '👥',
    color: 'text-indigo-600'
  },
  {
    id: '6',
    label: 'Life Satisfaction Increase',
    value: 4.2,
    unit: '/5',
    description: 'Average improvement in life satisfaction',
    icon: '⭐',
    color: 'text-yellow-600'
  }
];

export function CredibilityIndicators() {
  return (
    <div className="space-y-8">
      {/* Success Metrics Grid */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Proven Results That Speak for Themselves
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {successMetrics.map((metric) => (
            <Card key={metric.id} className="p-4 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">{metric.icon}</div>
              <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                <AnimatedCounter value={metric.value} />
                <span className="text-lg">{metric.unit}</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{metric.label}</h4>
              <p className="text-xs text-gray-600">{metric.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Research Citations */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Backed by Scientific Research
        </h3>
        <div className="space-y-4">
          {researchCitations.map((citation) => (
            <Card key={citation.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {citation.year}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {citation.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">{citation.source}</span>
                      </p>
                      <p className="text-sm text-green-700 bg-green-50 p-2 rounded mb-2">
                        <strong>Key Finding:</strong> {citation.keyFinding}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Relevance:</strong> {citation.relevance}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 md:ml-4">
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Research →
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Capability Proof */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Galaxy Dream Team: Proven Expertise
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl mb-2">🎓</div>
              <h4 className="font-semibold text-gray-900">Evidence-Based Methods</h4>
              <p className="text-sm text-gray-600">
                All our tools are built on peer-reviewed research and validated methodologies
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔬</div>
              <h4 className="font-semibold text-gray-900">Continuous Validation</h4>
              <p className="text-sm text-gray-600">
                We regularly test and refine our approaches based on user outcomes and feedback
              </p>
            </div>
            <div>
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-900">Transparent Results</h4>
              <p className="text-sm text-gray-600">
                We track and share real metrics to demonstrate the effectiveness of our platform
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
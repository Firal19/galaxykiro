'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  image?: string;
  quote: string;
  achievement: string;
  beforeAfter: {
    before: string;
    after: string;
  };
  timeframe: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Meron T.',
    role: 'Business Owner',
    location: 'Addis Ababa',
    quote: "I thought I was limited by my comfort zone. The Vision Clarity Assessment showed me exactly what was holding me back. Within 3 months, I launched my dream business.",
    achievement: 'Launched successful consulting business',
    beforeAfter: {
      before: 'Stuck in unfulfilling job for 8 years',
      after: 'Running profitable business with 15+ clients'
    },
    timeframe: '3 months',
    verified: true
  },
  {
    id: '2',
    name: 'Daniel K.',
    role: 'Software Engineer',
    location: 'Dire Dawa',
    quote: "The Leadership Style Identifier changed everything. I discovered I was a natural mentor, not a manager. Now I lead a team of 12 developers and love every day.",
    achievement: 'Promoted to Team Lead',
    beforeAfter: {
      before: 'Struggling individual contributor',
      after: 'Leading high-performing development team'
    },
    timeframe: '6 months',
    verified: true
  },
  {
    id: '3',
    name: 'Sara M.',
    role: 'Teacher',
    location: 'Bahir Dar',
    quote: "The Habit Strength Analyzer revealed why my previous attempts at change failed. Using their system, I built 5 life-changing habits that stuck.",
    achievement: 'Transformed daily routine and energy',
    beforeAfter: {
      before: 'Exhausted, no energy for personal goals',
      after: 'Energized, productive, achieving personal milestones'
    },
    timeframe: '4 months',
    verified: true
  },
  {
    id: '4',
    name: 'Yohannes A.',
    role: 'Marketing Manager',
    location: 'Hawassa',
    quote: "I was skeptical about online assessments, but the Potential Quotient Calculator was incredibly accurate. It identified my hidden strengths and gave me a clear path forward.",
    achievement: 'Career pivot to dream role',
    beforeAfter: {
      before: 'Unfulfilled in corporate marketing',
      after: 'Creative director at innovative startup'
    },
    timeframe: '5 months',
    verified: true
  },
  {
    id: '5',
    name: 'Hanan S.',
    role: 'University Student',
    location: 'Mekelle',
    quote: "The Future Self Visualizer helped me see beyond my current circumstances. I'm now pursuing opportunities I never thought possible.",
    achievement: 'Scholarship to study abroad',
    beforeAfter: {
      before: 'Uncertain about future direction',
      after: 'Clear vision and international opportunities'
    },
    timeframe: '2 months',
    verified: true
  },
  {
    id: '6',
    name: 'Robel G.',
    role: 'Small Business Owner',
    location: 'Gondar',
    quote: "The tools didn't just help me understand myself better - they gave me practical steps. My business revenue doubled after implementing their recommendations.",
    achievement: 'Doubled business revenue',
    beforeAfter: {
      before: 'Struggling to grow small shop',
      after: 'Expanded to 3 locations with steady growth'
    },
    timeframe: '8 months',
    verified: true
  }
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Real Stories, Real Results</h2>
        <p className="text-gray-600">See how Galaxy Dream Team has transformed lives across Ethiopia</p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 shadow-lg">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Section */}
          <div className="flex-shrink-0 text-center md:text-left">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto md:mx-0">
              {currentTestimonial.name.charAt(0)}
            </div>
            <h3 className="font-semibold text-lg text-gray-900">{currentTestimonial.name}</h3>
            <p className="text-gray-600">{currentTestimonial.role}</p>
            <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start mt-1">
              📍 {currentTestimonial.location}
            </p>
            {currentTestimonial.verified && (
              <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                ✓ Verified Story
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1">
            <blockquote className="text-lg text-gray-700 italic mb-6 leading-relaxed">
              &ldquo;{currentTestimonial.quote}&rdquo;
            </blockquote>

            {/* Achievement Highlight */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <p className="font-semibold text-green-800">🎯 Achievement:</p>
              <p className="text-green-700">{currentTestimonial.achievement}</p>
            </div>

            {/* Before/After */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="font-semibold text-red-800 text-sm">Before:</p>
                <p className="text-red-700 text-sm">{currentTestimonial.beforeAfter.before}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-semibold text-green-800 text-sm">After:</p>
                <p className="text-green-700 text-sm">{currentTestimonial.beforeAfter.after}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              ⏱️ Transformation timeframe: <span className="font-semibold">{currentTestimonial.timeframe}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-center mt-6 space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={prevTestimonial}
          className="px-3 py-1"
        >
          ← Previous
        </Button>

        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-green-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextTestimonial}
          className="px-3 py-1"
        >
          Next →
        </Button>
      </div>

      {/* Auto-play indicator */}
      {isAutoPlaying && (
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Auto-advancing • Click any control to pause
          </p>
        </div>
      )}
    </div>
  );
}
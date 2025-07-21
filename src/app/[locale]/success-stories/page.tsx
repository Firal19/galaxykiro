"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Users, 
  Award,
  Heart,
  Target,
  Zap,
  Calendar,
  MapPin
} from "lucide-react";

export default function SuccessStoriesPage() {
  const successStories = [
    {
      name: "Sarah Chen",
      title: "Marketing Director",
      location: "Addis Ababa, Ethiopia",
      story: "I was stuck in a dead-end job, feeling like I had no direction. After taking the assessment and working with the team, I discovered my true leadership potential. Within 6 months, I doubled my income and found my purpose.",
      transformation: "Income doubled, found leadership role",
      duration: "6 months",
      rating: 5,
      image: "/testimonial-poster.jpg",
      category: "Career"
    },
    {
      name: "Abebe Kebede",
      title: "Entrepreneur",
      location: "Bahir Dar, Ethiopia",
      story: "I had a dream of starting my own business but was paralyzed by fear and self-doubt. The tools and guidance I received here gave me the confidence to take the leap. Now I run a successful tech startup.",
      transformation: "Started successful business, overcame fear",
      duration: "8 months",
      rating: 5,
      image: "/testimonial-poster.jpg",
      category: "Entrepreneurship"
    },
    {
      name: "Fatima Ahmed",
      title: "Healthcare Professional",
      location: "Mekelle, Ethiopia",
      story: "I was struggling with work-life balance and felt like I was failing at everything. The mindset training completely changed how I approach challenges. Now I'm more productive and happier than ever.",
      transformation: "Improved work-life balance, increased happiness",
      duration: "4 months",
      rating: 5,
      image: "/testimonial-poster.jpg",
      category: "Wellness"
    },
    {
      name: "Tewodros Haile",
      title: "Student",
      location: "Hawassa, Ethiopia",
      story: "As a student, I was overwhelmed and unsure about my future. The goal-setting framework helped me create a clear path forward. I'm now more focused and confident about my career choices.",
      transformation: "Clear career path, increased confidence",
      duration: "3 months",
      rating: 5,
      image: "/testimonial-poster.jpg",
      category: "Education"
    },
    {
      name: "Amina Hassan",
      title: "Community Leader",
      location: "Dire Dawa, Ethiopia",
      story: "I wanted to make a difference in my community but didn't know how to start. The leadership development program gave me the skills and confidence to lead effectively. I've now helped over 100 people in my community.",
      transformation: "Became community leader, helped 100+ people",
      duration: "12 months",
      rating: 5,
      image: "/testimonial-poster.jpg",
      category: "Leadership"
    },
    {
      name: "Yohannes Tekle",
      title: "Software Engineer",
      location: "Gondar, Ethiopia",
      story: "I was good at my job but felt like I wasn't reaching my full potential. The personal development tools helped me identify my strengths and weaknesses. I've since been promoted twice and feel more fulfilled.",
      transformation: "Two promotions, increased fulfillment",
      duration: "9 months",
      rating: 5,
      image: "/testimonial-poster.jpg",
      category: "Career"
    }
  ];

  const categories = [
    { name: "All Stories", count: successStories.length, active: true },
    { name: "Career", count: 2, active: false },
    { name: "Entrepreneurship", count: 1, active: false },
    { name: "Wellness", count: 1, active: false },
    { name: "Education", count: 1, active: false },
    { name: "Leadership", count: 1, active: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Success Stories</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from real people who transformed their lives. Discover how our community members unlocked their hidden potential and achieved remarkable results.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-2xl font-bold text-gray-900">1000+</div>
            <div className="text-sm text-gray-600">Success Stories</div>
          </Card>
          <Card className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">90%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </Card>
          <Card className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <div className="text-2xl font-bold text-gray-900">6</div>
            <div className="text-sm text-gray-600">Months Average</div>
          </Card>
          <Card className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-3 text-red-600" />
            <div className="text-2xl font-bold text-gray-900">5.0</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={category.active ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-yellow-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {story.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>

              {/* Location and Duration */}
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {story.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {story.duration}
                </div>
              </div>

              {/* Story */}
              <div className="mb-4">
                <Quote className="w-6 h-6 text-gray-300 mb-2" />
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  "{story.story}"
                </p>
              </div>

              {/* Transformation */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <Zap className="w-4 h-4 text-green-600 mr-2" />
                  <span className="font-semibold text-gray-900">Transformation:</span>
                </div>
                <p className="text-sm text-gray-700">{story.transformation}</p>
              </div>

              {/* Category Badge */}
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-xs">
                  {story.category}
                </Badge>
                <Button size="sm" variant="ghost">
                  Read Full Story
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Story */}
        <div className="mt-16">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Award className="w-8 h-8 mr-3" />
                  <h2 className="text-2xl font-bold">Featured Success Story</h2>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sarah Chen - Marketing Director</h3>
                <p className="text-lg mb-4 opacity-90">
                  "I was stuck in a dead-end job, feeling like I had no direction. After taking the assessment and working with the team, I discovered my true leadership potential. Within 6 months, I doubled my income and found my purpose."
                </p>
                <div className="flex items-center space-x-4 text-sm opacity-90">
                  <span>📍 Addis Ababa, Ethiopia</span>
                  <span>⏱️ 6 months</span>
                  <span>⭐ 5.0 rating</span>
                </div>
                <Button variant="secondary" className="mt-6">
                  Read Full Story
                </Button>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <p className="text-sm opacity-90">
                  "The transformation was incredible. I went from feeling lost to being confident and successful."
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <Star className="w-16 h-16 mx-auto mb-6 text-yellow-600" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of people who have already transformed their lives. Start your journey today and become the next success story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Book Consultation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 
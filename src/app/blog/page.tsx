"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { PublicLayout } from '@/components/layouts/public-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  Filter,
  BookOpen,
  TrendingUp,
  Lightbulb,
  Target
} from 'lucide-react'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
  image: string
  featured: boolean
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'unlock-your-infinite-potential',
    title: 'Unlock Your Infinite Potential: The Science of Personal Transformation',
    excerpt: 'Discover the latest research on neuroplasticity and how it proves that your potential for growth is truly limitless.',
    content: '',
    author: 'Dr. Sarah Mitchell',
    date: '2025-01-20',
    readTime: '8 min read',
    category: 'Personal Growth',
    tags: ['Potential', 'Neuroscience', 'Transformation'],
    image: '/blog/potential.jpg',
    featured: true
  },
  {
    id: '2',
    slug: 'decision-making-mastery',
    title: 'Decision-Making Mastery: How Top Performers Choose',
    excerpt: 'Learn the cognitive frameworks that successful leaders use to make better decisions faster.',
    content: '',
    author: 'Michael Chen',
    date: '2025-01-18',
    readTime: '6 min read',
    category: 'Leadership',
    tags: ['Decision Making', 'Leadership', 'Success'],
    image: '/blog/decisions.jpg',
    featured: true
  },
  {
    id: '3',
    slug: 'habit-stacking-success',
    title: 'The Power of Habit Stacking for Lasting Change',
    excerpt: 'Build transformational habits that stick by leveraging the science of behavior design.',
    content: '',
    author: 'Dr. Emily Rodriguez',
    date: '2025-01-15',
    readTime: '5 min read',
    category: 'Habits',
    tags: ['Habits', 'Behavior Change', 'Productivity'],
    image: '/blog/habits.jpg',
    featured: false
  },
  {
    id: '4',
    slug: 'vision-clarity-achievement',
    title: 'From Vision to Reality: The Achievement Blueprint',
    excerpt: 'Transform your dreams into achievable goals with this proven step-by-step system.',
    content: '',
    author: 'James Wilson',
    date: '2025-01-12',
    readTime: '7 min read',
    category: 'Goal Setting',
    tags: ['Vision', 'Goals', 'Achievement'],
    image: '/blog/vision.jpg',
    featured: false
  },
  {
    id: '5',
    slug: 'leadership-influence-impact',
    title: 'Leadership Through Influence: Creating Lasting Impact',
    excerpt: 'Develop the influence skills that separate good leaders from transformational ones.',
    content: '',
    author: 'Dr. Rachel Adams',
    date: '2025-01-10',
    readTime: '9 min read',
    category: 'Leadership',
    tags: ['Leadership', 'Influence', 'Impact'],
    image: '/blog/leadership.jpg',
    featured: true
  },
  {
    id: '6',
    slug: 'mindset-shifts-success',
    title: '7 Mindset Shifts That Accelerate Success',
    excerpt: 'Adopt the mental models of high achievers to unlock new levels of performance.',
    content: '',
    author: 'David Thompson',
    date: '2025-01-08',
    readTime: '6 min read',
    category: 'Mindset',
    tags: ['Mindset', 'Success', 'Psychology'],
    image: '/blog/mindset.jpg',
    featured: false
  }
]

const categories = [
  { name: 'All', icon: BookOpen, count: mockPosts.length },
  { name: 'Personal Growth', icon: TrendingUp, count: 15 },
  { name: 'Leadership', icon: Target, count: 12 },
  { name: 'Mindset', icon: Lightbulb, count: 10 },
  { name: 'Habits', icon: Clock, count: 8 },
  { name: 'Goal Setting', icon: Target, count: 6 }
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredPosts, setFilteredPosts] = useState(mockPosts)

  useEffect(() => {
    let filtered = mockPosts

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }, [searchQuery, selectedCategory])

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transformation <span className="text-primary">Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Evidence-based articles and success stories to accelerate your personal and professional growth journey.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Posts */}
          {selectedCategory === 'All' && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredPosts
                  .filter(post => post.featured)
                  .slice(0, 2)
                  .map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                          <div className="aspect-[16/9] relative bg-muted">
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                            <div className="absolute bottom-4 left-4 right-4 z-20">
                              <Badge className="mb-2">{post.category}</Badge>
                              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                {post.title}
                              </h3>
                            </div>
                          </div>
                          <div className="p-6">
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <User className="w-4 h-4" />
                                  <span>{post.author}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{post.readTime}</span>
                                </span>
                              </div>
                              <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-8">
              {selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
            </h2>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts
                  .filter(post => selectedCategory !== 'All' || !post.featured)
                  .map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                          <div className="aspect-[16/9] relative bg-muted" />
                          <div className="p-6">
                            <Badge variant="outline" className="mb-3">
                              {post.category}
                            </Badge>
                            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(post.date).toLocaleDateString()}</span>
                              </span>
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands who are already on their journey to unlocking their infinite potential.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tools">
              <Button size="lg" className="min-w-[200px]">
                Try Our Free Tools
              </Button>
            </Link>
            <Link href="/membership/register">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Become a Member
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
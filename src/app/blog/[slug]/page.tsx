"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layouts/public-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Bookmark,
  ThumbsUp,
  MessageSquare,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check
} from 'lucide-react'
import { leadScoringService } from '@/lib/lead-scoring-service'

// This would come from your database
const mockPost = {
  id: '1',
  slug: 'unlock-your-infinite-potential',
  title: 'Unlock Your Infinite Potential: The Science of Personal Transformation',
  excerpt: 'Discover the latest research on neuroplasticity and how it proves that your potential for growth is truly limitless.',
  content: `
    <h2>The Neuroscience of Transformation</h2>
    <p>For decades, scientists believed that the adult brain was fixed and unchangeable. This limiting belief has been shattered by groundbreaking research in neuroplasticity, revealing that our brains can rewire and adapt throughout our entire lives.</p>
    
    <p>This discovery isn't just academically interesting—it's revolutionary for anyone seeking personal transformation. It means that your capacity for growth, learning, and change is not predetermined by your genes or past experiences. Instead, you have the power to literally reshape your brain through deliberate practice and focused attention.</p>

    <h3>Key Findings from Recent Research</h3>
    <p>A 2023 study from Stanford University showed that individuals who engaged in deliberate practice for just 20 minutes daily experienced measurable changes in brain structure within 8 weeks. These changes were associated with:</p>
    
    <ul>
      <li>Improved cognitive flexibility</li>
      <li>Enhanced emotional regulation</li>
      <li>Increased creativity and problem-solving abilities</li>
      <li>Greater resilience to stress</li>
    </ul>

    <h2>The 4 Pillars of Unleashing Your Potential</h2>
    
    <h3>1. Growth Mindset Cultivation</h3>
    <p>Carol Dweck's research on growth mindset has shown that believing in your ability to develop and improve is crucial for actual improvement. This isn't just positive thinking—it's about understanding that abilities can be developed through dedication and hard work.</p>

    <h3>2. Deliberate Practice</h3>
    <p>Not all practice is created equal. Deliberate practice involves focused attention on specific aspects of performance, immediate feedback, and repetition with refinement. This is how experts in any field develop their exceptional abilities.</p>

    <h3>3. Environmental Design</h3>
    <p>Your environment shapes your behavior more than you might realize. By intentionally designing your physical and social environment to support your goals, you can make transformation easier and more sustainable.</p>

    <h3>4. Recovery and Integration</h3>
    <p>Growth doesn't happen during practice—it happens during recovery. Quality sleep, stress management, and reflection time are essential for consolidating new neural pathways and integrating changes.</p>

    <h2>Practical Steps to Start Your Transformation</h2>
    
    <p>Ready to unlock your infinite potential? Here are evidence-based strategies you can implement today:</p>

    <ol>
      <li><strong>Morning Visualization:</strong> Spend 5 minutes each morning visualizing your ideal future self. Research shows this activates the same neural networks as actual practice.</li>
      <li><strong>Micro-Habits:</strong> Start with tiny, consistent actions. Even 2-minute daily practices can create lasting change when maintained over time.</li>
      <li><strong>Progress Tracking:</strong> Document your journey. What gets measured gets managed, and tracking progress reinforces positive neural pathways.</li>
      <li><strong>Community Connection:</strong> Surround yourself with others on similar journeys. Social support is one of the strongest predictors of successful transformation.</li>
    </ol>

    <h2>The Journey Ahead</h2>
    
    <p>Remember, transformation is not a destination—it's an ongoing journey of growth and discovery. Every step you take, no matter how small, is rewiring your brain and expanding your potential.</p>

    <p>The science is clear: you are not fixed or limited by your current circumstances. Your potential is infinite, waiting to be unlocked through consistent action and deliberate practice. The only question is: are you ready to begin?</p>
  `,
  author: 'Dr. Sarah Mitchell',
  authorBio: 'Neuroscientist and transformation coach with 15+ years of experience helping individuals unlock their potential.',
  date: '2025-01-20',
  readTime: '8 min read',
  category: 'Personal Growth',
  tags: ['Potential', 'Neuroscience', 'Transformation', 'Growth Mindset'],
  likes: 342,
  comments: 28,
  shares: 156
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showCTA, setShowCTA] = useState(false)

  useEffect(() => {
    // Track page view
    leadScoringService.updateEngagement('content_consumption', {
      content_type: 'blog_article',
      content_id: params.slug as string,
      page_url: window.location.href
    })

    // Scroll progress tracking
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const scrollPercentage = (scrollPosition / totalHeight) * 100
      setProgress(Math.min(scrollPercentage, 100))

      // Show CTA after 50% scroll
      if (scrollPercentage > 50 && !showCTA) {
        setShowCTA(true)
        leadScoringService.updateEngagement('high_engagement', {
          engagement_type: '50_percent_read',
          content_id: params.slug as string,
          page_url: window.location.href
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [params.slug, showCTA])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = mockPost.title

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }

    leadScoringService.updateEngagement('social_share', {
      platform,
      shared_url: window.location.href,
      content_id: params.slug as string
    })
  }

  const handleLike = () => {
    setLiked(!liked)
    leadScoringService.updateEngagement('high_engagement', {
      engagement_type: liked ? 'unlike' : 'like',
      content_id: params.slug as string,
      page_url: window.location.href
    })
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    leadScoringService.updateEngagement('high_engagement', {
      engagement_type: 'content_bookmark',
      content_id: params.slug as string,
      page_url: window.location.href
    })
  }

  return (
    <PublicLayout>
      {/* Progress Bar */}
      <Progress value={progress} className="fixed top-0 left-0 right-0 h-1 z-50" />

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Article Meta */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Badge>{mockPost.category}</Badge>
              <span className="text-sm text-muted-foreground">{mockPost.readTime}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {mockPost.title}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {mockPost.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{mockPost.author}</p>
                  <p className="text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {new Date(mockPost.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleShare('twitter')}>
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleShare('facebook')}>
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleShare('linkedin')}>
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleShare('copy')}>
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-[16/9] bg-muted rounded-lg mb-12" />

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: mockPost.content }}
          />

          {/* Article Footer */}
          <div className="border-t border-b border-border py-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Button
                  variant={liked ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleLike}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {mockPost.likes + (liked ? 1 : 0)}
                </Button>
                
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {mockPost.comments}
                </Button>
                
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  {mockPost.shares}
                </Button>
              </div>
              
              <Button
                variant={bookmarked ? 'default' : 'outline'}
                size="sm"
                onClick={handleBookmark}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-12">
            <h3 className="text-sm font-medium mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {mockPost.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Author Bio */}
          <Card className="p-6 mb-12">
            <h3 className="font-semibold mb-2">About the Author</h3>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-2">{mockPost.author}</p>
                <p className="text-sm text-muted-foreground">{mockPost.authorBio}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </article>

      {/* Inline CTA */}
      {showCTA && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4"
        >
          <Card className="p-6 shadow-lg border-primary">
            <h3 className="font-semibold mb-2">Ready to Transform Your Life?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take our free Potential Quotient assessment and discover your untapped abilities.
            </p>
            <div className="flex gap-3">
              <Link href="/tools/potential-quotient-calculator" className="flex-1">
                <Button className="w-full" size="sm">
                  Start Free Assessment
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCTA(false)}
              >
                Maybe Later
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Related Articles */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Related articles would be dynamically loaded here */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <div className="aspect-[16/9] bg-background" />
                <div className="p-6">
                  <Badge variant="outline" className="mb-3">Personal Growth</Badge>
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    Related Article Title {i}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    Brief excerpt of the related article to give readers an idea of the content...
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
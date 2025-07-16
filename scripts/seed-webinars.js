const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sampleWebinars = [
  {
    title: "Unlock Your Hidden Potential: The 90% You Haven't Discovered",
    description: "Join us for an eye-opening session where we'll explore the untapped potential within you. Learn practical strategies to identify and develop your hidden strengths, overcome limiting beliefs, and create a roadmap for exponential personal growth.",
    presenter_name: "Dr. Sarah Johnson",
    presenter_bio: "Personal Development Expert with 15+ years of experience helping individuals unlock their potential",
    scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    duration_minutes: 90,
    max_attendees: 500,
    registration_deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    webinar_url: "https://zoom.us/j/example123",
    tags: ["Personal Development", "Potential", "Growth Mindset", "Self-Discovery"],
    thumbnail_url: "/testimonial-poster.jpg",
    status: "scheduled"
  },
  {
    title: "The Science of Habit Formation: Build Lasting Change",
    description: "Discover the neuroscience behind habit formation and learn proven techniques to build positive habits that stick. We'll cover the habit loop, environmental design, and practical strategies for overcoming the most common obstacles to change.",
    presenter_name: "Dr. Michael Chen",
    presenter_bio: "Behavioral Scientist and Author of 'The Habit Blueprint'",
    scheduled_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    duration_minutes: 75,
    max_attendees: 300,
    registration_deadline: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
    webinar_url: "https://zoom.us/j/example456",
    tags: ["Habits", "Behavior Change", "Neuroscience", "Personal Growth"],
    thumbnail_url: "/testimonial-poster.jpg",
    status: "scheduled"
  },
  {
    title: "Leadership from Within: Developing Your Inner Leader",
    description: "Whether you're leading a team or leading your own life, true leadership starts from within. Learn how to develop self-awareness, emotional intelligence, and the mindset shifts that transform good managers into great leaders.",
    presenter_name: "Elena Rodriguez",
    presenter_bio: "Executive Coach and Former Fortune 500 CEO",
    scheduled_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
    duration_minutes: 60,
    max_attendees: 200,
    registration_deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    webinar_url: "https://zoom.us/j/example789",
    tags: ["Leadership", "Self-Awareness", "Emotional Intelligence", "Management"],
    thumbnail_url: "/testimonial-poster.jpg",
    status: "scheduled"
  },
  {
    title: "Goal Setting That Actually Works: From Dreams to Reality",
    description: "Most people set goals but few achieve them. Learn the psychology of effective goal setting, how to create systems instead of just goals, and the specific techniques used by high achievers to turn their biggest dreams into reality.",
    presenter_name: "James Thompson",
    presenter_bio: "Performance Coach and Author of 'Systems for Success'",
    scheduled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago (completed)
    duration_minutes: 90,
    max_attendees: 400,
    webinar_url: "https://zoom.us/j/example101",
    recording_url: "https://example.com/recording/goal-setting-webinar",
    tags: ["Goal Setting", "Achievement", "Success", "Planning"],
    thumbnail_url: "/testimonial-poster.jpg",
    status: "completed"
  }
]

async function seedWebinars() {
  try {
    console.log('Seeding webinars...')
    
    for (const webinar of sampleWebinars) {
      const { data, error } = await supabase
        .from('webinars')
        .insert(webinar)
        .select()
        .single()
      
      if (error) {
        console.error('Error inserting webinar:', webinar.title, error)
      } else {
        console.log('✅ Created webinar:', data.title)
      }
    }
    
    console.log('Webinar seeding completed!')
  } catch (error) {
    console.error('Error seeding webinars:', error)
  }
}

seedWebinars()
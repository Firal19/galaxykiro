import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '../lib/utils';
// Import necessary modules

interface SuccessStory {
  id: string;
  name: string;
  title: string;
  location: string;
  testimonial: string;
  achievement: string;
  imageSrc: string;
}

interface EthiopianSuccessStoriesProps {
  className?: string;
  compact?: boolean;
  maxStories?: number;
}

/**
 * Component that displays success stories with Ethiopian context
 */
export function EthiopianSuccessStories({
  className,
  compact = false,
  maxStories = 3
}: EthiopianSuccessStoriesProps): React.ReactNode {
  // Ethiopian success stories with local context
  const successStories: SuccessStory[] = [
    {
      id: 'story-1',
      name: 'Abebe Kebede',
      title: 'Tech Entrepreneur',
      location: 'Addis Ababa',
      testimonial: 'ይህ ፕሮግራም የኔን የአመራር ብቃት ከፍ አድርጎታል። በ6 ወራት ውስጥ፣ ቡድኔን ከ5 ወደ 20 ሰራተኞች አሳድጌያለሁ እና የገቢያችንን ድርሻ በ35% ጨምሬያለሁ።',
      achievement: 'Grew his tech startup from 5 to 20 employees in just 6 months after implementing the leadership principles from our program.',
      imageSrc: '/testimonial-poster.jpg'
    },
    {
      id: 'story-2',
      name: 'Tigist Haile',
      title: 'Coffee Exporter',
      location: 'Jimma',
      testimonial: 'የእኔ የንግድ ስኬት የመጣው ከዚህ ፕሮግራም የተማርኩትን የአመራር ክህሎቶች ተግባራዊ ካደረግኩ በኋላ ነው። አሁን የኢትዮጵያ ቡና ወደ አምስት አዳዲስ ዓለም አቀፍ ገበያዎች እየላክን ነው።',
      achievement: 'Expanded her coffee export business to five new international markets by applying the strategic planning tools from our leadership program.',
      imageSrc: '/testimonial-poster.jpg'
    },
    {
      id: 'story-3',
      name: 'Dawit Mengistu',
      title: 'School Director',
      location: 'Bahir Dar',
      testimonial: 'የተማሪዎቻችን የፈተና ውጤት በ40% ጨምሯል። ይህ የመጣው በትምህርት ቤታችን ውስጥ የተግባራዊ አመራር ስርዓትን ከተተገበርን በኋላ ነው።',
      achievement: 'Improved student test scores by 40% after implementing the practical leadership system in his school.',
      imageSrc: '/testimonial-poster.jpg'
    },
    {
      id: 'story-4',
      name: 'Hiwot Tadesse',
      title: 'Healthcare Administrator',
      location: 'Gondar',
      testimonial: 'የእኛ ሆስፒታል አሁን በአካባቢው ምርጥ የጤና አገልግሎት ሰጪ ተብሎ ይታወቃል። ይህ የተሳካው የሰው ሃይል አመራር ስልጠናውን ከወሰድን በኋላ ነው።',
      achievement: "Transformed her hospital into the region&apos;s top-rated healthcare provider after implementing the team management training.",
      imageSrc: '/testimonial-poster.jpg'
    },
    {
      id: 'story-5',
      name: 'Yonas Bekele',
      title: 'Agricultural Cooperative Leader',
      location: 'Hawassa',
      testimonial: 'የኛ ኅብረት ሥራ ማኅበር አሁን 3,000 አርሶ አደሮችን ያገለግላል። ከዚህ ፕሮግራም የተማርኩት የአመራር ክህሎቶች ለዚህ ዕድገት ቁልፍ ነበሩ።',
      achievement: 'Expanded his agricultural cooperative to serve 3,000 farmers by applying the organizational growth strategies from our program.',
      imageSrc: '/testimonial-poster.jpg'
    }
  ];

  // Display only the requested number of stories
  const displayedStories = successStories.slice(0, maxStories);

  return (
    <div className={cn("w-full py-8", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">
            <span className="ethiopian-green">የስኬት</span> <span className="ethiopian-gold">ታሪኮች</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how leaders across Ethiopia have transformed their organizations and communities using our proven methods
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg overflow-hidden shadow-md border border-border"
            >
              <div className="relative h-48">
                <Image
                  src={story.imageSrc}
                  alt={`${story.name} from ${story.location}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-bold text-lg">{story.name}</h3>
                    <p className="text-sm opacity-90">{story.title}, {story.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {!compact && (
                  <div className="mb-4">
                    <p className="italic text-sm font-ethiopic">{story.testimonial}</p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{story.achievement}</p>
              </div>
              
              <div className="px-6 pb-4">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-ethiopian-green mr-2"></div>
                  <span className="text-xs text-muted-foreground">Verified Success Story</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {!compact && (
          <div className="text-center mt-10">
            <button className="btn bg-ethiopian-green hover:bg-ethiopian-green/90 text-white px-6 py-2 rounded-md font-medium">
              View More Success Stories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { CulturalPatternShowcase } from '../../components/cultural-pattern-showcase';
import { EthiopianSuccessStories } from '../../components/ethiopian-success-stories';
import { getAllOfficeLocations } from '../../lib/models/office-location';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Ethiopian Design System | Galaxy Dream Team',
  description: 'Explore our Ethiopian-inspired design system with cultural patterns, symbols, and localized content',
};

export default function EthiopianDesignDemoPage() {
  const officeLocations = getAllOfficeLocations();

  return (
    <main className="min-h-screen">
      {/* Hero Section with Ethiopian Design Elements */}
      <section className="relative bg-ethiopian-subtle py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="ethiopian-green">የኢትዮጵያ</span>{' '}
              <span className="ethiopian-gold">ዲዛይን</span>{' '}
              <span className="ethiopian-red">ስርዓት</span>
            </h1>
            <p className="text-xl mb-8">
              Ethiopian-inspired design system with cultural patterns, symbols, and localized content
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-ethiopian">ዲዛይን ይመልከቱ</button>
              <button className="btn-ethiopian-gold">ተጨማሪ ይወቁ</button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 pattern-telsem opacity-10"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 pattern-meskel opacity-10"></div>
      </section>

      {/* Cultural Pattern Showcase */}
      <CulturalPatternShowcase />

      {/* Ethiopian Success Stories */}
      <section className="py-16 bg-card">
        <EthiopianSuccessStories />
      </section>

      {/* Office Locations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">
              <span className="ethiopian-green">የኛ</span>{' '}
              <span className="ethiopian-gold">ቢሮዎች</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our office locations across Ethiopia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officeLocations.map((location) => (
              <div 
                key={location.id}
                className="card-ethiopian overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={location.imageUrl}
                    alt={`${location.city} Office`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-bold text-lg">{location.city}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-sm mb-2">{location.address}</p>
                  <p className="text-sm mb-4">
                    <strong>Phone:</strong> {location.phone}<br />
                    <strong>Email:</strong> {location.email}
                  </p>
                  
                  <h4 className="font-medium mb-2">Opening Hours</h4>
                  <p className="text-sm mb-4">
                    <strong>Weekdays:</strong> {location.openingHours.weekdays}<br />
                    <strong>Saturday:</strong> {location.openingHours.saturday}<br />
                    <strong>Sunday:</strong> {location.openingHours.sunday}
                  </p>
                  
                  <h4 className="font-medium mb-2">Services</h4>
                  <ul className="text-sm mb-4 list-disc pl-5">
                    {location.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                  
                  <h4 className="font-medium mb-2">Staff</h4>
                  <ul className="text-sm">
                    {location.staff.map((person, index) => (
                      <li key={index} className="mb-1">
                        <strong>{person.name}</strong> - {person.role}<br />
                        <span className="text-xs text-muted-foreground">
                          Languages: {person.languages.join(', ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="px-6 pb-6">
                  <button className="btn-ethiopian w-full">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography Examples */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">
              <span className="ethiopian-green">የፊደል</span>{' '}
              <span className="ethiopian-gold">ዓይነቶች</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Typography Examples with Noto Sans Ethiopic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background p-6 rounded-lg border border-border">
              <h3 className="font-bold mb-4">Amharic Text Examples</h3>
              
              <div className="mb-6">
                <h4 className="text-sm text-muted-foreground mb-2">Heading</h4>
                <p className="text-2xl font-bold font-ethiopic">የህይወት ለውጥ ጉዞዎ ዛሬ ይጀምራል</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm text-muted-foreground mb-2">Subheading</h4>
                <p className="text-xl font-ethiopic">የተደበቀ ችሎታዎን ለመግለጥ ዝግጁ ነዎት?</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm text-muted-foreground mb-2">Body Text</h4>
                <p className="font-ethiopic">የእኛ ፕሮግራሞች ለውጥ ለማምጣት የሚፈልጉ ሰዎችን ለመርዳት የተነደፉ ናቸው። ከ10 ዓመታት በላይ ልምድ ባለን ባለሙያዎች የሚመሩ ሲሆን፣ ለእርስዎ ስኬት የሚያስፈልጉትን መሳሪያዎች እናቀርባለን።</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground mb-2">Button Text</h4>
                <div className="flex gap-4">
                  <button className="btn-ethiopian">ይመዝገቡ</button>
                  <button className="btn-ethiopian-gold">ተጨማሪ ይወቁ</button>
                </div>
              </div>
            </div>
            
            <div className="bg-background p-6 rounded-lg border border-border">
              <h3 className="font-bold mb-4">Bilingual Content Examples</h3>
              
              <div className="mb-6">
                <h4 className="text-sm text-muted-foreground mb-2">Section Title</h4>
                <p className="text-2xl font-bold">Leadership Development / <span className="font-ethiopic">የአመራር ልማት</span></p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm text-muted-foreground mb-2">Program Description</h4>
                <p className="mb-2">Our leadership program helps you develop essential skills for success.</p>
                <p className="font-ethiopic">የእኛ የአመራር ፕሮግራም አስፈላጊ የሆኑ ክህሎቶችን እንዲያዳብሩ ይረዳዎታል።</p>
              </div>
              
              <div>
                <h4 className="text-sm text-muted-foreground mb-2">Form Labels</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name / <span className="font-ethiopic">ስም</span></label>
                    <input type="text" className="w-full p-2 border border-border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email / <span className="font-ethiopic">ኢሜይል</span></label>
                    <input type="email" className="w-full p-2 border border-border rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-ethiopian-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Ethiopian Design System?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Incorporate these cultural elements into your projects and create authentic Ethiopian-inspired experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="bg-white text-black px-6 py-3 rounded-md font-medium">
              Back to Home
            </Link>
            <Link href="/tools" className="bg-black/30 text-white px-6 py-3 rounded-md font-medium border border-white/30">
              Explore Tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
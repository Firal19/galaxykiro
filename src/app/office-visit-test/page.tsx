'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OfficeVisitBooking } from '@/components/office-visit-booking';

export default function OfficeVisitTestPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSource, setBookingSource] = useState('test-page');
  const [preselectedLocation, setPreselectedLocation] = useState('');

  const testScenarios = [
    {
      title: 'Direct Booking',
      description: 'Test direct office visit booking without preselection',
      source: 'direct-test',
      location: ''
    },
    {
      title: 'Decision Door Booking',
      description: 'Test booking from Decision Door section',
      source: 'decision-door',
      location: ''
    },
    {
      title: 'Leadership Lever Booking',
      description: 'Test booking from Leadership Lever with Addis Ababa preselected',
      source: 'leadership-lever',
      location: 'Addis Ababa'
    },
    {
      title: 'Cost Calculator Booking',
      description: 'Test booking from Cost of Inaction Calculator',
      source: 'cost-calculator',
      location: ''
    }
  ];

  const handleTestBooking = (scenario: typeof testScenarios[0]) => {
    setBookingSource(scenario.source);
    setPreselectedLocation(scenario.location);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Office Visit Booking System Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the complete office visit booking and conversion system
          </p>
        </div>

        {/* System Status */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">System Components Status</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Database Schema (office_visits, office_locations, appointment_slots)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Office Visit Models</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Office Visit Booking Component</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>API Routes (/api/office-locations, /api/office-visits/book)</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Netlify Functions (confirmation, reminder)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Conversion Tracking Integration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Decision Door Integration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Leadership Lever Integration</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Test Scenarios */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test Scenarios</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {testScenarios.map((scenario, index) => (
              <Card key={index} className="p-4 border-2 hover:border-blue-500 transition-colors">
                <h3 className="font-semibold text-lg mb-2">{scenario.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{scenario.description}</p>
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <p><strong>Source:</strong> {scenario.source}</p>
                  {scenario.location && <p><strong>Preselected:</strong> {scenario.location}</p>}
                </div>
                <Button 
                  onClick={() => handleTestBooking(scenario)}
                  className="w-full"
                  variant="outline"
                >
                  Test This Scenario
                </Button>
              </Card>
            ))}
          </div>
        </Card>

        {/* Features Implemented */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Features Implemented</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Core Booking Features</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Office location selection based on user location</li>
                <li>✅ Calendar integration with available time slots</li>
                <li>✅ Appointment confirmation and preparation materials</li>
                <li>✅ Multi-step booking flow with validation</li>
                <li>✅ Ethiopian office locations (Addis Ababa, Bahir Dar, Hawassa)</li>
                <li>✅ Multilingual support (English/Amharic)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Advanced Features</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Automated follow-up sequence and nurturing</li>
                <li>✅ Conversion tracking from engagement to office visit</li>
                <li>✅ Integration with Decision Door section</li>
                <li>✅ Integration with Leadership Lever section</li>
                <li>✅ Row Level Security (RLS) policies</li>
                <li>✅ Real-time availability management</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Office Visit Booking Modal */}
        <OfficeVisitBooking
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          bookingSource={bookingSource}
          preselectedLocation={preselectedLocation}
        />
      </div>
    </div>
  );
}
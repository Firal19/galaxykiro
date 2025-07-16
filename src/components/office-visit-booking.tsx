'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { OfficeLocation, AvailableSlot, BookingRequest } from '@/lib/models/office-visit';
import { useAuth } from '@/lib/contexts/auth-context';
import { trackingService } from '@/lib/tracking';

interface OfficeVisitBookingProps {
  isOpen: boolean;
  onClose: () => void;
  bookingSource?: string;
  preselectedLocation?: string;
}

export function OfficeVisitBooking({ 
  isOpen, 
  onClose, 
  bookingSource = 'direct',
  preselectedLocation 
}: OfficeVisitBookingProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'location' | 'datetime' | 'details' | 'confirmation'>('location');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [offices, setOffices] = useState<OfficeLocation[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<OfficeLocation | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  
  // Form states
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [specialRequests, setSpecialRequests] = useState('');

  // Load office locations on mount
  useEffect(() => {
    if (isOpen) {
      loadOfficeLocations();
    }
  }, [isOpen]);

  // Auto-select office if preselected
  useEffect(() => {
    if (preselectedLocation && offices.length > 0) {
      const office = offices.find(o => 
        o.city.toLowerCase() === preselectedLocation.toLowerCase() ||
        o.name.toLowerCase().includes(preselectedLocation.toLowerCase())
      );
      if (office) {
        setSelectedOffice(office);
        setStep('datetime');
      }
    }
  }, [preselectedLocation, offices]);

  const loadOfficeLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/office-locations');
      if (!response.ok) throw new Error('Failed to load office locations');
      const data = await response.json();
      setOffices(data);
    } catch (err) {
      setError('Failed to load office locations. Please try again.');
      console.error('Error loading offices:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async (officeId: string) => {
    try {
      setLoading(true);
      const dateFrom = new Date().toISOString().split('T')[0];
      const dateTo = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await fetch(`/api/office-locations/${officeId}/availability?date_from=${dateFrom}&date_to=${dateTo}`);
      if (!response.ok) throw new Error('Failed to load availability');
      const data = await response.json();
      setAvailableSlots(data);
    } catch (err) {
      setError('Failed to load available times. Please try again.');
      console.error('Error loading slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOfficeSelect = (office: OfficeLocation) => {
    setSelectedOffice(office);
    loadAvailableSlots(office.id);
    setStep('datetime');
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleBookingSubmit = async () => {
    if (!selectedOffice || !selectedSlot || !user) return;

    try {
      setLoading(true);
      const bookingData: BookingRequest = {
        appointment_date: `${selectedSlot.date}T${selectedSlot.time}`,
        office_location: selectedOffice.name,
        appointment_type: appointmentType,
        preferred_language: preferredLanguage,
        special_requests: specialRequests || undefined,
        booking_source: bookingSource
      };

      const response = await fetch('/api/office-visits/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) throw new Error('Failed to book appointment');
      
      const result = await response.json();
      
      // Track the office visit booking
      await trackingService.trackOfficeVisitBooking(
        selectedOffice.name,
        `${selectedSlot.date}T${selectedSlot.time}`,
        user.id,
        {
          bookingSource,
          appointmentType,
          preferredLanguage,
          officeCity: selectedOffice.city,
          appointmentId: result.appointment?.id
        }
      );

      // Track conversion from engagement to office visit
      await trackingService.trackEngagementToOfficeVisitConversion(
        0, // This would be fetched from user data in a real implementation
        'engaged', // This would be fetched from user data
        user.id,
        {
          conversionPath: bookingSource,
          officeLocation: selectedOffice.name,
          appointmentType
        }
      );
      
      setStep('confirmation');
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
      console.error('Error booking appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderLocationStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Office Location</h3>
        <p className="text-gray-600">Select the Galaxy Dream Team office nearest to you</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading office locations...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {offices.map((office) => (
            <Card 
              key={office.id} 
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              onClick={() => handleOfficeSelect(office)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">{office.name}</h4>
                  <p className="text-gray-600 mt-1">{office.address}</p>
                  <p className="text-gray-600">{office.city}</p>
                  {office.phone && (
                    <p className="text-blue-600 mt-2">📞 {office.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    Available
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderDateTimeStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h3>
        <p className="text-gray-600">Choose your preferred appointment time at {selectedOffice?.name}</p>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Selected Office:</strong> {selectedOffice?.name}, {selectedOffice?.city}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading available times...</p>
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No available appointments in the next 30 days.</p>
          <p className="text-sm text-gray-500 mt-2">Please contact us directly to schedule.</p>
        </div>
      ) : (
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {availableSlots.map((slot, index) => (
            <Card 
              key={index}
              className="p-3 cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-500"
              onClick={() => handleSlotSelect(slot)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{formatDate(slot.date)}</p>
                  <p className="text-blue-600">{formatTime(slot.time)}</p>
                </div>
                <Button variant="outline" size="sm">
                  Select
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep('location')}>
          Back to Locations
        </Button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Appointment Details</h3>
        <p className="text-gray-600">Please provide additional information for your visit</p>
      </div>

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-600">Office</p>
          <p className="font-medium">{selectedOffice?.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date & Time</p>
          <p className="font-medium">
            {selectedSlot && `${formatDate(selectedSlot.date)} at ${formatTime(selectedSlot.time)}`}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Type
          </label>
          <select 
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="consultation">Personal Development Consultation</option>
            <option value="assessment">Comprehensive Assessment Session</option>
            <option value="planning">Goal Setting & Life Planning</option>
            <option value="follow-up">Follow-up Session</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Language
          </label>
          <select 
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="am">Amharic (አማርኛ)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests or Notes (Optional)
          </label>
          <textarea 
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any specific topics you'd like to focus on, accessibility needs, or other requests..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep('datetime')}>
          Back to Date & Time
        </Button>
        <Button 
          onClick={handleBookingSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Booking...' : 'Confirm Appointment'}
        </Button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="text-green-600 text-6xl mb-4">✓</div>
      <h3 className="text-2xl font-bold text-gray-900">Appointment Confirmed!</h3>
      <p className="text-gray-600">
        Your appointment has been successfully scheduled. You'll receive a confirmation email shortly with all the details.
      </p>
      
      <div className="bg-green-50 p-4 rounded-lg text-left">
        <h4 className="font-semibold text-green-800 mb-2">Appointment Summary:</h4>
        <div className="space-y-1 text-sm text-green-700">
          <p><strong>Office:</strong> {selectedOffice?.name}</p>
          <p><strong>Date:</strong> {selectedSlot && formatDate(selectedSlot.date)}</p>
          <p><strong>Time:</strong> {selectedSlot && formatTime(selectedSlot.time)}</p>
          <p><strong>Type:</strong> {appointmentType}</p>
          <p><strong>Language:</strong> {preferredLanguage === 'en' ? 'English' : 'Amharic'}</p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
        <ul className="text-sm text-blue-700 text-left space-y-1">
          <li>• You'll receive preparation materials via email</li>
          <li>• We'll send you a reminder 24 hours before your appointment</li>
          <li>• Please arrive 10 minutes early</li>
          <li>• Bring any questions or goals you'd like to discuss</li>
        </ul>
      </div>

      <Button 
        onClick={onClose}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Close
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {step === 'location' && renderLocationStep()}
        {step === 'datetime' && renderDateTimeStep()}
        {step === 'details' && renderDetailsStep()}
        {step === 'confirmation' && renderConfirmationStep()}
      </div>
    </Modal>
  );
}
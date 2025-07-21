"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Check, MapPin, Clock, User, Phone, Mail, Search, Filter } from "lucide-react";

// Mock office locations data with regions
const mockOfficeLocations = [
  {
    id: 1,
    name: "Addis Ababa Main Office",
    address: "Bole Road, Addis Ababa",
    city: "Addis Ababa",
    region: "Addis Ababa",
    area: "Bole",
    phone: "+251 11 123 4567",
    email: "addis@galaxykiro.com",
    available_hours: "9:00 AM - 6:00 PM",
    is_active: true
  },
  {
    id: 2,
    name: "Bahir Dar Branch",
    address: "Lake Tana Street, Bahir Dar",
    city: "Bahir Dar",
    region: "Amhara",
    area: "Lake Tana",
    phone: "+251 58 234 5678",
    email: "bahirdar@galaxykiro.com",
    available_hours: "8:00 AM - 5:00 PM",
    is_active: true
  },
  {
    id: 3,
    name: "Mekelle Office",
    address: "Yohannes Street, Mekelle",
    city: "Mekelle",
    region: "Tigray",
    area: "Central",
    phone: "+251 34 345 6789",
    email: "mekelle@galaxykiro.com",
    available_hours: "9:00 AM - 6:00 PM",
    is_active: true
  },
  {
    id: 4,
    name: "Hawassa Branch",
    address: "Lake Awassa Street, Hawassa",
    city: "Hawassa",
    region: "Sidama",
    area: "Lake Awassa",
    phone: "+251 46 456 7890",
    email: "hawassa@galaxykiro.com",
    available_hours: "8:00 AM - 5:00 PM",
    is_active: true
  },
  {
    id: 5,
    name: "Gondar Office",
    address: "Fasil Street, Gondar",
    city: "Gondar",
    region: "Amhara",
    area: "Fasil",
    phone: "+251 58 567 8901",
    email: "gondar@galaxykiro.com",
    available_hours: "9:00 AM - 6:00 PM",
    is_active: true
  },
  {
    id: 6,
    name: "Dire Dawa Branch",
    address: "Railway Street, Dire Dawa",
    city: "Dire Dawa",
    region: "Dire Dawa",
    area: "Railway",
    phone: "+251 25 678 9012",
    email: "diredawa@galaxykiro.com",
    available_hours: "8:00 AM - 5:00 PM",
    is_active: true
  }
];

// Mock time slots
const mockTimeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

// Get unique regions and areas for filtering
const uniqueRegions = [...new Set(mockOfficeLocations.map(office => office.region))];
const uniqueAreas = [...new Set(mockOfficeLocations.map(office => office.area))];

export default function OfficeVisitPage() {
  const [selectedOffice, setSelectedOffice] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: ""
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  
  // Filter states
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter offices based on selected criteria
  const filteredOffices = mockOfficeLocations.filter(office => {
    const matchesRegion = !selectedRegion || office.region === selectedRegion;
    const matchesArea = !selectedArea || office.area === selectedArea;
    const matchesSearch = !searchQuery || 
      office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      office.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      office.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRegion && matchesArea && matchesSearch;
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingComplete(true);
  };

  const resetBooking = () => {
    setSelectedOffice(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setFormData({ name: "", email: "", phone: "", purpose: "" });
    setCurrentStep(1);
    setIsBookingComplete(false);
    setSelectedRegion("");
    setSelectedArea("");
    setSearchQuery("");
  };

  const clearFilters = () => {
    setSelectedRegion("");
    setSelectedArea("");
    setSearchQuery("");
  };

  if (isBookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Booking Confirmed!</h1>
              <p className="text-lg text-gray-600">
                Your office visit has been successfully scheduled.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-4">Booking Details:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Office:</strong> {mockOfficeLocations.find(o => o.id === selectedOffice)?.name}</p>
                <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Purpose:</strong> {formData.purpose}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={resetBooking} className="w-full">
                Book Another Visit
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/en"} className="w-full">
                Return to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Book an Office Visit</h1>
          <p className="text-lg text-gray-600 mb-4">
            Schedule your in-person consultation or visit with our team. Find the nearest office and select your preferred date and time.
          </p>
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 mx-2 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-8">
          {/* Step 1: Select Office */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Find Your Nearest Office</h2>
              
              {/* Search and Filter Section */}
              <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by office name, city, or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="region">Region</Label>
                    <select
                      id="region"
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Regions</option>
                      {uniqueRegions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="area">Area</Label>
                    <select
                      id="area"
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Areas</option>
                      {uniqueAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="h-10"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                  {filteredOffices.length} office{filteredOffices.length !== 1 ? 's' : ''} found
                  {(selectedRegion || selectedArea || searchQuery) && (
                    <span className="ml-2">
                      (filtered from {mockOfficeLocations.length} total)
                    </span>
                  )}
                </div>
              </div>

              {/* Office Listings */}
              <div className="grid gap-4">
                {filteredOffices.length > 0 ? (
                  filteredOffices.map((office) => (
                    <div
                      key={office.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedOffice === office.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedOffice(office.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{office.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {office.region}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {office.area}
                            </Badge>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{office.address}, {office.city}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{office.available_hours}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Phone className="w-4 h-4 mr-1" />
                            <span>{office.phone}</span>
                          </div>
                        </div>
                        {selectedOffice === office.id && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No offices found</p>
                    <p className="text-sm">Try adjusting your search criteria or filters</p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="mt-4"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Select Date */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Select Date</h2>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                />
              </div>
            </div>
          )}

          {/* Step 3: Select Time */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Select Time</h2>
              <div className="grid grid-cols-3 gap-3">
                {mockTimeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    className="h-12"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Personal Information */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose of Visit</Label>
                  <Input
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="e.g., Consultation, Meeting, Training"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedOffice) ||
                  (currentStep === 2 && !selectedDate) ||
                  (currentStep === 3 && !selectedTime)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.email || !formData.phone}
              >
                Confirm Booking
              </Button>
            )}
          </div>

          {/* Booking Summary */}
          {(selectedOffice || selectedDate || selectedTime) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Booking Summary:</h3>
              <div className="space-y-1 text-sm">
                {selectedOffice && (
                  <div>
                    <p><strong>Office:</strong> {mockOfficeLocations.find(o => o.id === selectedOffice)?.name}</p>
                    <p><strong>Location:</strong> {mockOfficeLocations.find(o => o.id === selectedOffice)?.city}, {mockOfficeLocations.find(o => o.id === selectedOffice)?.region}</p>
                  </div>
                )}
                {selectedDate && (
                  <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
                )}
                {selectedTime && (
                  <p><strong>Time:</strong> {selectedTime}</p>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 
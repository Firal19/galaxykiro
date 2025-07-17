/**
 * Office location model for Ethiopian cities
 */

export interface OfficeLocation {
  id: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  staff: {
    name: string;
    role: string;
    languages: string[];
  }[];
  imageUrl: string;
}

/**
 * Ethiopian office locations data
 */
export const ethiopianOfficeLocations: OfficeLocation[] = [
  {
    id: 'addis-ababa',
    city: 'Addis Ababa',
    address: 'Bole Atlas, 4th Floor, Suite 401, Addis Ababa',
    phone: '+251 11 667 8901',
    email: 'addis@galaxydreamteam.com',
    coordinates: {
      lat: 9.0054,
      lng: 38.7636
    },
    openingHours: {
      weekdays: '9:00 AM - 5:30 PM',
      saturday: '10:00 AM - 3:00 PM',
      sunday: 'Closed'
    },
    services: [
      'Leadership Assessments',
      'Personal Development Coaching',
      'Team Building Workshops',
      'Strategic Planning Sessions'
    ],
    staff: [
      {
        name: 'Yohannes Alemu',
        role: 'Office Director',
        languages: ['Amharic', 'English']
      },
      {
        name: 'Sara Tesfaye',
        role: 'Lead Coach',
        languages: ['Amharic', 'English', 'Oromo']
      }
    ],
    imageUrl: '/testimonial-poster.jpg'
  },
  {
    id: 'bahir-dar',
    city: 'Bahir Dar',
    address: 'Tana Business Center, 2nd Floor, Room 205, Bahir Dar',
    phone: '+251 58 220 1234',
    email: 'bahirdar@galaxydreamteam.com',
    coordinates: {
      lat: 11.5742,
      lng: 37.3614
    },
    openingHours: {
      weekdays: '9:00 AM - 5:00 PM',
      saturday: '9:00 AM - 1:00 PM',
      sunday: 'Closed'
    },
    services: [
      'Leadership Assessments',
      'Personal Development Coaching',
      'Educational Workshops'
    ],
    staff: [
      {
        name: 'Abebe Tadesse',
        role: 'Office Manager',
        languages: ['Amharic', 'English']
      }
    ],
    imageUrl: '/testimonial-poster.jpg'
  },
  {
    id: 'hawassa',
    city: 'Hawassa',
    address: 'Hawassa City Center, Piazza Area, 3rd Floor, Hawassa',
    phone: '+251 46 212 3456',
    email: 'hawassa@galaxydreamteam.com',
    coordinates: {
      lat: 7.0504,
      lng: 38.4955
    },
    openingHours: {
      weekdays: '8:30 AM - 5:00 PM',
      saturday: '9:00 AM - 12:00 PM',
      sunday: 'Closed'
    },
    services: [
      'Leadership Assessments',
      'Personal Development Coaching',
      'Business Strategy Sessions'
    ],
    staff: [
      {
        name: 'Tigist Hailu',
        role: 'Regional Director',
        languages: ['Amharic', 'English', 'Sidamo']
      }
    ],
    imageUrl: '/testimonial-poster.jpg'
  },
  {
    id: 'mekelle',
    city: 'Mekelle',
    address: 'Ayder Business Complex, Ground Floor, Mekelle',
    phone: '+251 34 441 5678',
    email: 'mekelle@galaxydreamteam.com',
    coordinates: {
      lat: 13.4967,
      lng: 39.4697
    },
    openingHours: {
      weekdays: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed'
    },
    services: [
      'Leadership Assessments',
      'Personal Development Coaching'
    ],
    staff: [
      {
        name: 'Haile Gebremariam',
        role: 'Office Coordinator',
        languages: ['Amharic', 'English', 'Tigrinya']
      }
    ],
    imageUrl: '/testimonial-poster.jpg'
  },
  {
    id: 'dire-dawa',
    city: 'Dire Dawa',
    address: 'Kezira Main Street, Dire Dawa Business Tower, 1st Floor',
    phone: '+251 25 111 2345',
    email: 'diredawa@galaxydreamteam.com',
    coordinates: {
      lat: 9.5907,
      lng: 41.8661
    },
    openingHours: {
      weekdays: '8:30 AM - 5:30 PM',
      saturday: '9:00 AM - 1:00 PM',
      sunday: 'Closed'
    },
    services: [
      'Leadership Assessments',
      'Personal Development Coaching',
      'Team Building Workshops'
    ],
    staff: [
      {
        name: 'Fatima Ahmed',
        role: 'Office Manager',
        languages: ['Amharic', 'English', 'Somali']
      }
    ],
    imageUrl: '/testimonial-poster.jpg'
  }
];

/**
 * Get all Ethiopian office locations
 */
export function getAllOfficeLocations(): OfficeLocation[] {
  return ethiopianOfficeLocations;
}

/**
 * Get an office location by ID
 */
export function getOfficeLocationById(id: string): OfficeLocation | undefined {
  return ethiopianOfficeLocations.find(location => location.id === id);
}

/**
 * Get office locations by service
 */
export function getOfficeLocationsByService(service: string): OfficeLocation[] {
  return ethiopianOfficeLocations.filter(location => 
    location.services.some(s => s.toLowerCase().includes(service.toLowerCase()))
  );
}

/**
 * Get nearest office location based on coordinates
 */
export function getNearestOfficeLocation(lat: number, lng: number): OfficeLocation {
  // Calculate distance using Haversine formula
  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  let nearestLocation = ethiopianOfficeLocations[0];
  let shortestDistance = getDistance(lat, lng, nearestLocation.coordinates.lat, nearestLocation.coordinates.lng);
  
  for (let i = 1; i < ethiopianOfficeLocations.length; i++) {
    const location = ethiopianOfficeLocations[i];
    const distance = getDistance(lat, lng, location.coordinates.lat, location.coordinates.lng);
    
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestLocation = location;
    }
  }
  
  return nearestLocation;
}
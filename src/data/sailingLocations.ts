/**
 * SAILING LOCATIONS DATA
 * 
 * Popular sailing spots around San Francisco Bay with coordinates and descriptions.
 * Each location has different characteristics for different skill levels.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Add more locations around the Bay
 * - Change skill level recommendations
 * - Update descriptions based on local knowledge
 * - Add seasonal information
 */

import { SailingLocation } from './types';

export const sailingLocations: SailingLocation[] = [
  {
    id: 'sf-bay-central',
    name: 'San Francisco Bay',
    shortName: 'SF Bay',
    coordinates: { lat: 37.8267, lon: -122.4233 },
    description: 'Central Bay waters with consistent winds and great views of the city skyline.',
    skillLevel: 'All Levels',
    features: ['City Views', 'Consistent Wind', 'Open Water', 'Popular Anchorages']
  },
  {
    id: 'crissy-field',
    name: 'Crissy Field',
    shortName: 'Crissy',
    coordinates: { lat: 37.8050, lon: -122.4664 },
    description: 'Protected launch area perfect for beginners, with Golden Gate Bridge views.',
    skillLevel: 'Beginner',
    features: ['Protected Launch', 'Golden Gate Views', 'Beach Access', 'Parking Available']
  },
  {
    id: 'berkeley-marina',
    name: 'Berkeley Marina',
    shortName: 'Berkeley',
    coordinates: { lat: 37.8634, lon: -122.3176 },
    description: 'Calmer waters on the East Bay with excellent facilities and less traffic.',
    skillLevel: 'Beginner',
    features: ['Calm Waters', 'Full Service Marina', 'Restaurant', 'Easy Parking']
  },
  {
    id: 'sausalito',
    name: 'Sausalito Waters',
    shortName: 'Sausalito',
    coordinates: { lat: 37.8590, lon: -122.4777 },
    description: 'Scenic sailing with moderate winds and beautiful Marin County coastline.',
    skillLevel: 'Intermediate',
    features: ['Scenic Views', 'Moderate Winds', 'Marin Coastline', 'Charming Town']
  }
];

// Helper function to get location by ID
export const getLocationById = (id: string): SailingLocation | undefined => {
  return sailingLocations.find(location => location.id === id);
};

// Helper function to get locations by skill level
export const getLocationsBySkillLevel = (skillLevel: string): SailingLocation[] => {
  return sailingLocations.filter(location => 
    location.skillLevel === skillLevel || location.skillLevel === 'All Levels'
  );
};
/**
 * WEATHER SERVICE
 * 
 * Fetches real-time weather and sailing conditions for multiple SF Bay locations.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change coordinates to different sailing locations
 * - Adjust sailing condition algorithms
 * - Add more weather parameters
 * - Change update intervals
 */

import { WeatherData, SailingLocation } from '../data/types'; // ✅ Added SailingLocation import
import { sailingLocations } from '../data/sailingLocations';

const WEATHER_API_KEY = '77cdfefd01f0b3b921da9fd017e9eec2'; // Replace with your actual API key

// Calculate sailing difficulty based on wind speed
const calculateSailingDifficulty = (windSpeed: number): WeatherData['sailingDifficulty'] => {
  if (windSpeed < 5) return 'Beginner'; // Light air
  if (windSpeed < 15) return 'Beginner'; // Perfect for beginners
  if (windSpeed < 25) return 'Intermediate'; // Good sailing winds
  if (windSpeed < 35) return 'Expert'; // Strong winds
  return 'Dangerous'; // Too dangerous
};

// Calculate overall sailing condition
const calculateSailingCondition = (windSpeed: number, visibility: number): WeatherData['sailingCondition'] => {
  if (windSpeed < 3 || windSpeed > 35 || visibility < 1000) return 'Poor';
  if (windSpeed < 8 || windSpeed > 25 || visibility < 5000) return 'Fair';
  if (windSpeed < 20 && visibility > 8000) return 'Excellent';
  return 'Good';
};

// Convert wind direction from degrees to compass text
const getWindDirectionText = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

/**
 * Fetch weather data for SF Bay (original function)
 */
export const fetchWeatherData = async (): Promise<WeatherData> => {
  const SF_BAY_COORDS = { lat: 37.8267, lon: -122.4233 };
  return fetchWeatherDataForLocation(SF_BAY_COORDS.lat, SF_BAY_COORDS.lon);
};

/**
 * Fetch weather data for a specific location
 */
export const fetchWeatherDataForLocation = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    
    const data = await response.json();
    
    const windSpeed = data.wind?.speed || 0;
    const visibility = data.visibility || 10000;
    
    return {
      location: data.name || 'Unknown',
      temperature: Math.round(data.main.temp),
      windSpeed: Math.round(windSpeed),
      windDirection: data.wind?.deg || 0,
      windDirectionText: getWindDirectionText(data.wind?.deg || 0),
      description: data.weather[0]?.description || 'Clear',
      icon: data.weather[0]?.icon || '01d',
      visibility: Math.round(visibility * 3.28084),
      humidity: data.main.humidity,
      pressure: Math.round(data.main.pressure * 0.02953),
      sailingCondition: calculateSailingCondition(windSpeed, visibility),
      sailingDifficulty: calculateSailingDifficulty(windSpeed),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Fetch weather data for all sailing locations
 */
export const fetchAllLocationWeather = async (): Promise<SailingLocation[]> => {
  const promises = sailingLocations.map(async (location) => {
    try {
      const weather = await fetchWeatherDataForLocation(
        location.coordinates.lat, 
        location.coordinates.lon
      );
      return { ...location, weather };
    } catch (error) {
      console.error(`Failed to fetch weather for ${location.name}:`, error);
      return location; // Return location without weather data
    }
  });

  return Promise.all(promises);
};

/**
 * Find the best sailing location based on current conditions
 */
export const findBestSailingLocation = (locations: SailingLocation[]): SailingLocation | null => {
  const locationsWithWeather = locations.filter(loc => loc.weather);
  
  if (locationsWithWeather.length === 0) return null;

  // Sort by sailing condition quality (Excellent > Good > Fair > Poor)
  const conditionRanking: Record<WeatherData['sailingCondition'], number> = { 
    'Excellent': 4, 
    'Good': 3, 
    'Fair': 2, 
    'Poor': 1 
  }; // ✅ Fixed typing issue
  
  return locationsWithWeather.sort((a, b) => {
    const aRank = conditionRanking[a.weather!.sailingCondition];
    const bRank = conditionRanking[b.weather!.sailingCondition];
    return bRank - aRank;
  })[0];
};

// Get simple tide data (you can enhance this with a real tide API later)
export const getMockTideData = () => {
  const now = new Date();
  const nextHigh = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now
  const nextLow = new Date(now.getTime() + 9 * 60 * 60 * 1000); // 9 hours from now
  
  return {
    nextHigh: {
      time: nextHigh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      height: 5.2
    },
    nextLow: {
      time: nextLow.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      height: 1.8
    }
  };
};
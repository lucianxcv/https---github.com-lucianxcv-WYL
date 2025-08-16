import { weatherAPI } from './apiService';
import { SailingLocation } from '../data/types'; // Import from your main types file

// Main function to fetch all weather data
export const fetchAllLocationWeather = async (): Promise<SailingLocation[]> => {
  try {
    console.log('🌊 Fetching weather from backend...');
    
    // Call your backend API
    const response = await weatherAPI.getAllLocations();
    
    // Handle the response structure: {success: true, data: Array(4), message: '...'}
    // TypeScript fix: cast to any to access .data property
    const locations = (response as any)?.data || response || [];
    
    console.log('✅ Weather data received:', locations?.length, 'locations');
    console.log('📍 Full response:', response);
    console.log('📍 Extracted locations:', locations);
    
    // Return the locations array
    return locations;
    
  } catch (error) {
    console.error('❌ Error fetching weather from backend:', error);
    
    // Return empty array on error - let the frontend handle the empty state
    return [];
  }
};

// Function to update weather data (calls the backend to refresh weather)
export const updateAllWeatherData = async (): Promise<boolean> => {
  try {
    console.log('🔄 Updating weather data...');
    
    await weatherAPI.updateWeather();
    
    console.log('✅ Weather data updated successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Error updating weather data:', error);
    return false;
  }
};

// Function to get a single location
export const getLocationWeather = async (locationId: string): Promise<SailingLocation | null> => {
  try {
    console.log(`🌊 Fetching weather for location: ${locationId}`);
    
    const response = await weatherAPI.getLocation(locationId);
    
    // Handle the response structure
    const location = (response as any)?.data || response;
    
    console.log('✅ Location data received:', location);
    return location;
    
  } catch (error) {
    console.error(`❌ Error fetching location ${locationId}:`, error);
    return null;
  }
};

// Function to find the best sailing location based on conditions
export const findBestSailingLocation = (locations: SailingLocation[]): SailingLocation | null => {
  if (!locations || locations.length === 0) return null;
  
  // Simple scoring algorithm - prioritize good wind and conditions
  const scoredLocations = locations.map(location => {
    let score = 0;
    
    // Only score if weather data exists
    if (location.weather) {
      // Score based on sailing condition
      switch (location.weather.sailingCondition) {
        case 'Excellent': score += 100; break;
        case 'Good': score += 75; break;
        case 'Fair': score += 50; break;
        case 'Poor': score += 25; break;
      }
      
      // Score based on wind speed (ideal 10-20 mph)
      const windSpeed = location.weather.windSpeed;
      if (windSpeed >= 10 && windSpeed <= 20) {
        score += 50;
      } else if (windSpeed >= 5 && windSpeed < 10) {
        score += 25;
      } else if (windSpeed > 20 && windSpeed <= 30) {
        score += 30;
      }
    }
    
    return { location, score };
  });
  
  // Return the location with the highest score
  const bestLocation = scoredLocations.sort((a, b) => b.score - a.score)[0];
  return bestLocation ? bestLocation.location : null;
};

// Legacy function name - alias for fetchAllLocationWeather
export const fetchWeatherData = async (): Promise<any> => {
  try {
    // Fetch all locations
    const locations = await fetchAllLocationWeather();
    
    // If your component expects a different format, 
    // we can transform the data here
    // For now, let's return the first location's weather data
    // or adapt based on what WeatherData type expects
    
    if (locations.length > 0) {
      // Return the data in the format your component expects
      return {
        locations: locations,
        currentLocation: locations[0],
        lastUpdated: new Date().toISOString()
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error in fetchWeatherData:', error);
    return null;
  }
};

// Mock tide data function (if your app uses tide data)
export const getMockTideData = () => {
  const tides = [
    { time: '6:00 AM', height: 2.1, type: 'Low' },
    { time: '12:15 PM', height: 5.8, type: 'High' },
    { time: '6:45 PM', height: 1.9, type: 'Low' },
    { time: '11:30 PM', height: 6.2, type: 'High' },
  ];

  // Return data in the format your component expects
  return {
    tides: tides,
    nextHigh: { time: '12:15 PM', height: 5.8, type: 'High' },
    nextLow: { time: '6:45 PM', height: 1.9, type: 'Low' },
    current: { time: 'Now', height: 3.2, type: 'Rising' }
  };
};
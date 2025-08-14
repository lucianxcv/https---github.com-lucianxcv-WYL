// ==================== src/data/types.ts ====================
/**
 * TYPE DEFINITIONS
 * 
 * This file contains all the TypeScript types used throughout the project.
 * Think of types as "blueprints" that tell TypeScript what shape our data should have.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Add new fields to existing types (e.g., add 'email' to Speaker type)
 * - Create new types for new features (e.g., Comment type, User type)
 * - Change optional fields by adding/removing the '?' after field names
 */

// Speaker information structure
export interface Speaker {
  id: number;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  nextPresentationDate: string; // ISO date string
  topic: string;
}

// Past show/video information
export interface PastShow {
  id: number;
  title: string;
  speakerName: string;
  videoId: string; // YouTube video ID
  date: string; // ISO date string
  year: number;
  description: string;
}

// Owner/Captain information
export interface Owner {
  name: string;
  title: string;
  bio: string;
  achievements: string[];
  photoUrl: string;
}

// Theme colors configuration
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  gold: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

// Shadow styles configuration
export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
}

// Complete theme configuration
export interface Theme {
  colors: ThemeColors;
  shadows: ThemeShadows;
  typography: any; // Will be defined in themes.ts
  spacing: any; // Will be defined in themes.ts
  isDark: boolean;
  toggleTheme: () => void;
}

// Future types for when we add backend functionality
export interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  showId?: number; // Optional: link comment to specific show
}

export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  joinDate: string;
}

export interface SpeakerSuggestion {
  id: number;
  suggestedBy: string;
  speakerName: string;
  topic: string;
  reason: string;
  contactInfo?: string;
  status: 'pending' | 'approved' | 'declined';
}

// Add these new types to your existing types.ts file

export interface WeatherData {
  location: string;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  windDirectionText: string;
  description: string;
  icon: string;
  visibility: number;
  humidity: number;
  pressure: number;
  uvIndex?: number;
  sailingCondition: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  sailingDifficulty: 'Beginner' | 'Intermediate' | 'Expert' | 'Dangerous';
  lastUpdated: string;
}

export interface TideData {
  nextHigh: {
    time: string;
    height: number;
  };
  nextLow: {
    time: string;
    height: number;
  };
}

export interface SailingConditions {
  weather: WeatherData;
  tides: TideData;
  memberReports: MemberReport[];
}

export interface MemberReport {
  id: number;
  memberName: string;
  location: string;
  conditions: string;
  timestamp: string;
  photo?: string;
}
// Add this to your existing types
export interface SailingLocation {
  id: string;
  name: string;
  shortName: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  description: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Expert' | 'All Levels';
  features: string[];
  weather?: WeatherData;
}
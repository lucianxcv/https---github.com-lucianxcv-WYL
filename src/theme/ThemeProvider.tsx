// ==================== src/theme/ThemeProvider.tsx ====================
/**
 * THEME PROVIDER COMPONENT
 * 
 * This component wraps your entire app and provides theme information to all other components.
 * It handles switching between light and dark mode and makes theme colors available everywhere.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change the default theme (currently starts in light mode)
 * - Add persistence so the theme choice is remembered (using localStorage)
 * - Add more theme options beyond just light/dark
 */

import React, { useState, useContext, createContext, useMemo, ReactNode } from 'react';
import { themes, typography, spacing } from './themes';
import { Theme } from '../data/types';

// Create a context so any component can access theme information
const ThemeContext = createContext<Theme | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode; // This means it can wrap other components
}

/**
 * ThemeProvider Component
 * This wraps your entire app and provides theme data to all child components
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // State to track whether we're in dark mode or not
  const [isDark, setIsDark] = useState(false);
  
  // Combine all theme data into one object
  // useMemo prevents this from being recalculated on every render
  const theme = useMemo(() => ({
    ...themes[isDark ? 'dark' : 'light'], // Get colors based on current mode
    typography,
    spacing,
    isDark,
    toggleTheme: () => setIsDark(!isDark) // Function to switch themes
  }), [isDark]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme in any component
 * Use this in components like: const theme = useTheme();
 */
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

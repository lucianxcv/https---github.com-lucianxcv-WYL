// ==================== src/components/common/ThemeToggle.tsx ====================
/**
 * THEME TOGGLE COMPONENT
 * 
 * A button that switches between light and dark mode.
 * Shows a sun icon in light mode and moon icon in dark mode.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change the icons (use different emojis or import icon libraries)
 * - Modify the button styling (size, colors, border radius)
 * - Add animation effects or sound when clicked
 * - Change the button position or add text labels
 */

import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  // Get theme data and toggle function from our theme context
  const theme = useTheme();

  // Button styling that changes based on current theme
  const toggleStyle: React.CSSProperties = {
    position: 'relative',
    width: '60px',
    height: '30px',
    // Background color changes based on theme
    backgroundColor: theme.isDark ? theme.colors.gold : theme.colors.primary,
    borderRadius: '15px', // Makes it pill-shaped
    cursor: 'pointer',
    transition: 'all 0.3s ease', // Smooth color transition
    border: 'none',
    outline: 'none'
  };

  // The sliding circle inside the toggle
  const sliderStyle: React.CSSProperties = {
    position: 'absolute',
    top: '3px',
    // Position changes based on theme - slides left/right
    left: theme.isDark ? '33px' : '3px',
    width: '24px',
    height: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '50%', // Makes it circular
    transition: 'all 0.3s ease', // Smooth sliding animation
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px'
  };

  return (
    <button
      style={toggleStyle}
      onClick={theme.toggleTheme} // Call the toggle function when clicked
      aria-label={`Switch to ${theme.isDark ? 'light' : 'dark'} mode`}
    >
      <div style={sliderStyle}>
        {/* Show different icons based on current theme */}
        {theme.isDark ? '🌙' : '☀️'}
      </div>
    </button>
  );
};

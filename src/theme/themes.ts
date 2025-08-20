// ==================== src/theme/themes.ts ====================
/**
 * THEME CONFIGURATION
 * 
 * This file defines all the colors, fonts, and spacing used throughout your website.
 * Having everything in one place makes it easy to change the entire look of your site.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change any color values to customize the color scheme
 * - Modify font sizes to make text bigger or smaller
 * - Adjust spacing values to make elements closer together or farther apart
 * - Add new color themes (like a "sunset" theme with oranges and purples)
 */

// Color schemes for light and dark modes
export const themes = {
  light: {
    colors: {
      primary: '#1e3a5f',      // Navy blue - main brand color
      secondary: '#2e8b57',    // Sea green - accent color  
      accent: '#87ceeb',       // Sky blue - highlights
      gold: '#ffd700',         // Nautical gold - special elements
      background: '#ffffff',   // Pure white background
      surface: '#f8fafb',      // Light gray for cards/panels
      text: '#1e3a5f',         // Dark blue text
      textSecondary: '#64748b', // Gray for less important text
      border: 'rgba(30, 58, 95, 0.1)' // Subtle border color
    },
    shadows: {
      sm: '0 2px 8px rgba(30, 58, 95, 0.08)',   // Small shadow for buttons
      md: '0 4px 16px rgba(30, 58, 95, 0.12)',  // Medium shadow for cards
      lg: '0 8px 32px rgba(30, 58, 95, 0.16)',  // Large shadow for modals
      xl: '0 20px 25px -5px rgba(30, 58, 95, 0.1), 0 10px 10px -5px rgba(30, 58, 95, 0.04)' // Extra large shadow
    }
  },
  dark: {
    colors: {
      primary: '#0f1419',      // Deep navy background
      secondary: '#1e3a5f',    // Navy blue elements
      accent: '#4a90a4',       // Muted sea blue
      gold: '#ffd700',         // Bright gold (same as light)
      background: '#0f1419',   // Dark background
      surface: '#1e3a5f',      // Darker surface for cards
      text: '#ffffff',         // White text
      textSecondary: '#94a3b8', // Light gray secondary text
      border: 'rgba(255, 255, 255, 0.1)' // Light border for dark mode
    },
    shadows: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
      md: '0 4px 16px rgba(0, 0, 0, 0.4)', 
      lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' // Extra large shadow for dark mode
    }
  }
};

// Typography settings - controls all text styling
export const typography = {
  fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  sizes: {
    xs: '0.75rem',    // 12px - tiny text
    sm: '0.875rem',   // 14px - small text  
    base: '1rem',     // 16px - normal text
    lg: '1.125rem',   // 18px - larger text
    xl: '1.25rem',    // 20px - headings
    '2xl': '1.5rem',  // 24px - big headings
    '3xl': '1.875rem', // 30px - section titles
    '4xl': '2.25rem',  // 36px - page titles
    '5xl': '3rem'      // 48px - hero titles
  },
  weights: {
    normal: 400,    // Regular text
    medium: 500,    // Slightly bold
    semibold: 600,  // More bold
    bold: 700       // Very bold
  }
};

// Spacing system - consistent spacing throughout the site
export const spacing = {
  xs: '0.25rem',   // 4px - very tight spacing
  sm: '0.5rem',    // 8px - small spacing
  md: '1rem',      // 16px - normal spacing
  lg: '1.5rem',    // 24px - loose spacing
  xl: '2rem',      // 32px - section spacing
  '2xl': '3rem',   // 48px - large section spacing
  '3xl': '4rem'    // 64px - hero spacing
};
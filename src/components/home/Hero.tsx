// ==================== src/components/home/Hero.tsx ====================
/**
 * HERO SECTION COMPONENT
 * 
 * The main banner section at the top of the homepage with title, description, and countdown.
 * Features a gradient background with wave patterns.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change the main title or tagline text
 * - Modify background colors or gradients
 * - Add or remove content sections
 * - Change the background pattern or remove it entirely
 * - Modify text sizes and spacing
 */

import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { CountdownTimer } from './CountdownTimer';
import { sampleData } from '../../data/sampleData';

export const Hero: React.FC = () => {
  const theme = useTheme();

  // Hero section with dynamic background
  const heroStyle: React.CSSProperties = {
    // Complex gradient background with SVG wave pattern
    background: `linear-gradient(135deg, ${theme.colors.primary}ee, ${theme.colors.secondary}dd), 
                 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cpath fill='${encodeURIComponent(theme.colors.accent)}' d='M0,300 Q300,250 600,300 T1200,300 V600 H0 Z'/%3E%3Cpath fill='${encodeURIComponent(theme.colors.secondary)}' d='M0,400 Q300,350 600,400 T1200,400 V600 H0 Z'/%3E%3C/svg%3E")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#ffffff',
    padding: `${theme.spacing['3xl']} ${theme.spacing.xl}`,
    textAlign: 'center',
    marginTop: '80px', // Account for fixed navbar
    position: 'relative',
    overflow: 'hidden'
  };

  const heroContentStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2 // Above background elements
  };

  const heroTitleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['5xl'],
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.lg,
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)', // Adds depth
    lineHeight: 1.1
  };

  const heroTaglineStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.xl,
    marginBottom: theme.spacing.xl,
    opacity: 0.95,
    fontWeight: theme.typography.weights.medium
  };

  return (
    <section style={heroStyle} role="banner">
      <div style={heroContentStyle} className="hero-content">
        {/* Main title */}
        <h1 style={heroTitleStyle}>🛥️ Wednesday Yachting Luncheon</h1>
        
        {/* Subtitle/tagline */}
        <p style={heroTaglineStyle}>
          San Francisco's Premier Maritime Dining & Speaker Experience
        </p>
        
        {/* Description */}
        <p style={{ 
          fontSize: theme.typography.sizes.lg, 
          marginBottom: theme.spacing.xl,
          opacity: 0.9 
        }}>
          Join us every Wednesday at the historic St. Francis Yacht Club for inspiring maritime presentations paired with exceptional dining.
        </p>
        
        {/* Countdown section */}
        <div>
          <h3 style={{ 
            fontSize: theme.typography.sizes.xl, 
            marginBottom: theme.spacing.md,
            color: theme.colors.gold 
          }}>
            ⏰ Next Luncheon In:
          </h3>
          {/* Pass the next speaker's presentation date to the countdown timer */}
          <CountdownTimer targetDate={sampleData.speakers[0].nextPresentationDate} />
        </div>
      </div>
    </section>
  );
};

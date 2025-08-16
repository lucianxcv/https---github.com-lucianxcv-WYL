// ==================== src/components/home/Hero.tsx ====================
/**
 * HERO SECTION COMPONENT
 * 
 * Updated: Added repeatInterval prop to CountdownTimer so it automatically resets
 * when the countdown reaches zero. 
 * You can change "weekly" to "daily" or "monthly" depending on your event frequency.
 */

import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { CountdownTimer } from './CountdownTimer';
import { sampleData } from '../../data/sampleData';

export const Hero: React.FC = () => {
  const theme = useTheme();

  // Hero section with dynamic background
  const heroStyle: React.CSSProperties = {
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
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
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
        <div style={{ marginTop: theme.spacing.xl }}> {/* Added margin for spacing */}
          <h3 style={{ 
            fontSize: theme.typography.sizes.xl, 
            marginBottom: theme.spacing.md,
            color: theme.colors.gold 
          }}>
            ⏰ Next Luncheon In:
          </h3>

          {/* Updated CountdownTimer to use repeatInterval prop for auto-reset */}
          <CountdownTimer 
            targetDate={sampleData.speakers[0].nextPresentationDate || "2025-12-31T12:00:00"} 
            repeatInterval="weekly" // Auto-reset every week
          />
        </div>
      </div>
    </section>
  );
};

/**
 * ENHANCED HERO SECTION COMPONENT
 * 
 * Major improvements:
 * - Animated background waves
 * - Better responsive design
 * - Enhanced visual hierarchy
 * - Interactive CTA buttons
 * - Improved countdown styling
 * - Dynamic gradient animations
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { CountdownTimer } from './CountdownTimer';
import { sampleData } from '../../data/sampleData';

export const Hero: React.FC = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Animated hero section with dynamic background
  const heroStyle: React.CSSProperties = {
    position: 'relative',
    background: `linear-gradient(135deg, ${theme.colors.primary}ee, ${theme.colors.secondary}dd, ${theme.colors.accent}cc)`,
    backgroundSize: '300% 300%',
    animation: 'gradientShift 8s ease infinite',
    color: '#ffffff',
    padding: `${theme.spacing['4xl']} ${theme.spacing.xl}`,
    textAlign: 'center',
    marginTop: '80px',
    overflow: 'hidden',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const heroContentStyle: React.CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 3,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 1s ease-out'
  };

  const heroTitleStyle: React.CSSProperties = {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.lg,
    textShadow: '3px 3px 8px rgba(0,0,0,0.4)',
    lineHeight: 1.1,
    background: 'linear-gradient(45deg, #ffffff, #f0f8ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const heroTaglineStyle: React.CSSProperties = {
    fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
    marginBottom: theme.spacing.xl,
    opacity: 0.95,
    fontWeight: theme.typography.weights.medium,
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  const heroDescriptionStyle: React.CSSProperties = {
    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
    marginBottom: theme.spacing.xl,
    opacity: 0.9,
    maxWidth: '600px',
    margin: `0 auto ${theme.spacing.xl} auto`,
    lineHeight: 1.6
  };

  const ctaContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.xl
  };

  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    color: '#ffffff',
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50px',
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const secondaryButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#ffffff',
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    border: '2px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '50px',
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const countdownContainerStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: theme.spacing.lg,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    marginTop: theme.spacing.xl
  };

  // Animated background waves
  const backgroundWaves = (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cpath fill='%23ffffff' d='M0,300 Q300,250 600,300 T1200,300 V600 H0 Z'/%3E%3C/svg%3E")`,
        backgroundSize: 'cover',
        animation: 'waveMove 6s ease-in-out infinite',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cpath fill='%23ffffff' d='M0,400 Q300,350 600,400 T1200,400 V600 H0 Z'/%3E%3C/svg%3E")`,
        backgroundSize: 'cover',
        animation: 'waveMove 8s ease-in-out infinite reverse',
        zIndex: 1
      }} />
    </>
  );

  // CSS animations
  const animations = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes waveMove {
      0%, 100% { transform: translateX(0) translateY(0); }
      33% { transform: translateX(-10px) translateY(-5px); }
      66% { transform: translateX(10px) translateY(5px); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    .hero-button:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3) !important;
    }
    
    .hero-secondary-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px) scale(1.02);
    }
    
    .float-animation {
      animation: float 3s ease-in-out infinite;
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <section style={heroStyle} role="banner">
        {backgroundWaves}
        
        <div style={heroContentStyle} className="hero-content">
          {/* Enhanced countdown section */}
          <div style={countdownContainerStyle}>
            <h3 style={{
              fontSize: theme.typography.sizes.xl,
              marginBottom: theme.spacing.md,
              color: '#ffffff',
              fontWeight: theme.typography.weights.semibold,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              ⏰ Next Luncheon In:
            </h3>

            <CountdownTimer
              targetDate={sampleData.speakers[0].nextPresentationDate || "2025-12-31T12:00:00"}
              repeatInterval="weekly"
            />
          </div>
        </div>
      </section>
    </>
  );
};
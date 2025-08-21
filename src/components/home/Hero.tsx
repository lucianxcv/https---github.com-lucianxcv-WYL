/**
 * ENHANCED HERO SECTION WITH VIMEO VIDEO BACKGROUND
 * 
 * Features:
 * - Vimeo video background with overlay
 * - Fallback gradient background
 * - Interactive CTA buttons
 * - Enhanced countdown styling
 * - Responsive design
 * - Accessibility features
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { CountdownTimer } from './CountdownTimer';
import { sampleData } from '../../data/sampleData';

export const Hero: React.FC = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Video configuration
  const vimeoVideoId = '1111866421';
  const vimeoEmbedUrl = `https://player.vimeo.com/video/${vimeoVideoId}?autoplay=1&loop=1&muted=1&controls=0&background=1&quality=auto`;

  // Main hero container with video background
  const heroStyle: React.CSSProperties = {
    position: 'relative',
    height: '100vh',
    minHeight: '600px',
    maxHeight: '900px',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '80px'
  };

  // Video background styles
  const videoContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden'
  };

  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    minWidth: '100%',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    transform: 'translate(-50%, -50%)',
    opacity: videoLoaded && !videoError ? 1 : 0,
    transition: 'opacity 1s ease-in-out'
  };

  // Fallback gradient background
  const fallbackBackgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(135deg, ${theme.colors.primary}ee, ${theme.colors.secondary}dd, ${theme.colors.accent}cc)`,
    backgroundSize: '300% 300%',
    animation: 'gradientShift 8s ease infinite',
    zIndex: 0,
    opacity: !videoLoaded || videoError ? 1 : 0.3,
    transition: 'opacity 1s ease-in-out'
  };

  // Overlay to ensure text readability
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.4) 100%)',
    zIndex: 2
  };

  // Content container
  const heroContentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 3,
    maxWidth: '900px',
    margin: '0 auto',
    padding: theme.spacing.xl,
    textAlign: 'center',
    color: '#ffffff',
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 1s ease-out'
  };

  const heroTitleStyle: React.CSSProperties = {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.lg,
    textShadow: '3px 3px 8px rgba(0,0,0,0.7)',
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
    textShadow: '2px 2px 6px rgba(0,0,0,0.8)'
  };

  const heroDescriptionStyle: React.CSSProperties = {
    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
    marginBottom: theme.spacing.xl,
    opacity: 0.9,
    maxWidth: '600px',
    margin: `0 auto ${theme.spacing.xl} auto`,
    lineHeight: 1.6,
    textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
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
    border: '2px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '50px',
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const secondaryButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#ffffff',
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    border: '2px solid rgba(255, 255, 255, 0.6)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: theme.spacing.lg,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    marginTop: theme.spacing.xl
  };

  // Handle video load events
  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoaded(false);
    console.warn('Vimeo video failed to load, using fallback background');
  };

  // CSS animations
  const animations = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    .hero-button:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
      background-color: rgba(255, 255, 255, 0.3) !important;
    }
    
    .hero-secondary-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px) scale(1.02);
    }
    
    .float-animation {
      animation: float 3s ease-in-out infinite;
    }

    /* Mobile responsiveness for video */
    @media (max-width: 768px) {
      .hero-video {
        transform: translate(-50%, -50%) scale(1.5);
      }
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <section style={heroStyle} role="banner" aria-label="St. Francis Yacht Club Hero Section">
        
        {/* Fallback Background */}
        <div style={fallbackBackgroundStyle} />
        
        {/* Video Background */}
        <div style={videoContainerStyle}>
          <iframe
            src={vimeoEmbedUrl}
            style={videoStyle}
            className="hero-video"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="St. Francis Yacht Club Background Video"
            onLoad={handleVideoLoad}
            onError={handleVideoError}
          />
        </div>
        
        {/* Dark overlay for text readability */}
        <div style={overlayStyle} />
        
        {/* Main Content */}
        <div style={heroContentStyle} className="hero-content">
          <h1 style={heroTitleStyle} className="float-animation">
            ⛵ St. Francis Yacht Club
          </h1>
          
          <p style={heroTaglineStyle}>
            🌊 Where Maritime Excellence Meets Fine Dining
          </p>
          
          <p style={heroDescriptionStyle}>
            Join us every Wednesday at 12:00 PM for world-class maritime presentations, 
            exceptional cuisine, and stunning San Francisco Bay views in our historic clubhouse.
          </p>
          
          {/* Call to Action Buttons */}
          <div style={ctaContainerStyle}>
            <button
              style={primaryButtonStyle}
              className="hero-button"
              onClick={() => window.location.hash = '#upcoming'}
              aria-label="Learn about attending our luncheons"
            >
              🍽️ Join Our Luncheon
            </button>
            
            <button
              style={secondaryButtonStyle}
              className="hero-secondary-button"
              onClick={() => window.location.hash = '#past-shows'}
              aria-label="View our presentation archive"
            >
              🎥 Watch Presentations
            </button>
          </div>
          
          {/* Enhanced countdown section */}
          <div style={countdownContainerStyle}>
            <h2 style={{
              fontSize: theme.typography.sizes.xl,
              marginBottom: theme.spacing.md,
              color: '#ffffff',
              fontWeight: theme.typography.weights.semibold,
              textShadow: '2px 2px 6px rgba(0,0,0,0.8)'
            }}>
              ⏰ Next Luncheon In:
            </h2>

            <CountdownTimer
              targetDate={sampleData.speakers[0]?.nextPresentationDate || "2025-08-27T12:00:00"}
              repeatInterval="weekly"
            />
            
            <p style={{
              fontSize: theme.typography.sizes.sm,
              marginTop: theme.spacing.md,
              opacity: 0.8,
              textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
            }}>
              📍 Located at the prestigious St. Francis Yacht Club, San Francisco Bay
            </p>
          </div>

          {/* Quick Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: theme.spacing.md,
            marginTop: theme.spacing.xl,
            maxWidth: '600px',
            margin: `${theme.spacing.xl} auto 0`
          }}>
            <div style={{
              textAlign: 'center',
              padding: theme.spacing.md,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>📅</div>
              <div style={{ fontWeight: theme.typography.weights.semibold }}>Every Wednesday</div>
              <div style={{ fontSize: theme.typography.sizes.sm, opacity: 0.8 }}>12:00 PM Sharp</div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: theme.spacing.md,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>🎤</div>
              <div style={{ fontWeight: theme.typography.weights.semibold }}>Expert Speakers</div>
              <div style={{ fontSize: theme.typography.sizes.sm, opacity: 0.8 }}>Maritime Leaders</div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: theme.spacing.md,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>🍽️</div>
              <div style={{ fontWeight: theme.typography.weights.semibold }}>Fine Dining</div>
              <div style={{ fontSize: theme.typography.sizes.sm, opacity: 0.8 }}>Premium Cuisine</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
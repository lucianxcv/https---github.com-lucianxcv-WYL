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
      
      .countdown-corner {
        bottom: 10px !important;
        left: 10px !important;
        max-width: 160px !important;
        font-size: 0.7rem !important;
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
        </div>

        {/* Countdown Timer - Bottom Left Corner */}
        <div className="countdown-corner" style={{
          position: 'absolute',
          bottom: theme.spacing.lg,
          left: theme.spacing.lg,
          zIndex: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '8px',
          padding: theme.spacing.sm,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          maxWidth: '200px',
          fontSize: '0.8rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs,
            color: '#ffffff',
            fontWeight: theme.typography.weights.semibold,
            textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
            marginBottom: theme.spacing.xs,
            fontSize: '0.75rem'
          }}>
            ⏰ Next Luncheon
          </div>

          <CountdownTimer
            targetDate={sampleData.speakers[0]?.nextPresentationDate || "2025-08-27T12:00:00"}
            repeatInterval="weekly"
            compact={true}
          />
        </div>
      </section>
    </>
  );
};
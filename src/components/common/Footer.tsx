// ==================== src/components/common/Footer.tsx ====================
/**
 * FOOTER COMPONENT
 * 
 * The bottom section of every page with contact info, social links, and animated waves.
 * Contains three columns of information and animated background elements.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Update contact information (phone, email, address)
 * - Change social media icons or add new platforms
 * - Modify the animated wave effect or remove it entirely
 * - Add new sections like newsletter signup or quick links
 * - Change the background colors or styling
 */

import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export const Footer: React.FC = () => {
  const theme = useTheme();

  // Main footer container styling
  const footerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    padding: `${theme.spacing['2xl']} ${theme.spacing.xl}`,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden' // Needed for the wave animation
  };

  // Animated wave background effect
  const waveStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '200%', // Twice as wide so we can animate it
    height: '60px',
    // SVG wave pattern as background image
    background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23ffffff' fill-opacity='0.1'%3E%3C/path%3E%3C/svg%3E") repeat-x`,
    // CSS animation that slides the wave continuously
    animation: 'wave 8s linear infinite',
    opacity: 0.3
  };

  // Grid layout for footer content
  const footerContentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive columns
    gap: theme.spacing.xl,
    position: 'relative',
    zIndex: 2 // Above the wave animation
  };

  // Social media icons container
  const socialStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg
  };

  // Individual social media icon styling
  const socialIconStyle: React.CSSProperties = {
    color: '#ffffff',
    fontSize: theme.typography.sizes.xl,
    textDecoration: 'none',
    padding: theme.spacing.md,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px'
  };

  return (
    <>
      {/* CSS keyframes for wave animation - this creates the moving effect */}
      <style>
        {`
          @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      <footer style={footerStyle} role="contentinfo">
        {/* Animated wave background */}
        <div style={waveStyle}></div>
        
        <div style={footerContentStyle}>
          {/* Contact Information Column */}
          <div>
            <h3 style={{ 
              marginBottom: theme.spacing.lg,
              fontSize: theme.typography.sizes.xl,
              color: theme.colors.gold
            }}>
              📧 Contact Us
            </h3>
            <p style={{ marginBottom: theme.spacing.sm }}>luncheon@stfrancisyc.com</p>
            <p style={{ marginBottom: theme.spacing.sm }}>📞 (415) 563-6363</p>
            <p style={{ marginBottom: theme.spacing.sm }}>📍 St. Francis Yacht Club</p>
            <p>700 Marina Blvd, San Francisco, CA 94123</p>
          </div>

          {/* Event Information Column */}
          <div>
            <h3 style={{ 
              marginBottom: theme.spacing.lg,
              fontSize: theme.typography.sizes.xl,
              color: theme.colors.gold
            }}>
              🍽️ Luncheon Details
            </h3>
            <p style={{ marginBottom: theme.spacing.sm }}>🗓️ Every Wednesday at 12:00 PM</p>
            <p style={{ marginBottom: theme.spacing.sm }}>🍽️ Lunch included with presentation</p>
            <p style={{ marginBottom: theme.spacing.sm }}>🏛️ Historic St. Francis Yacht Club</p>
            <p>🌉 Beautiful San Francisco Bay views</p>
          </div>

          {/* Social Media Column */}
          <div>
            <h3 style={{ 
              marginBottom: theme.spacing.lg,
              fontSize: theme.typography.sizes.xl,
              color: theme.colors.gold
            }}>
              🌐 Follow Us
            </h3>
            <div style={socialStyle}>
              {/* Social media icons - these would link to real profiles */}
              <a 
                href="#" 
                style={socialIconStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
                aria-label="Facebook"
              >
                📘
              </a>
              <a 
                href="#" 
                style={socialIconStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
                aria-label="YouTube"
              >
                🎥
              </a>
              <a 
                href="#" 
                style={socialIconStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
                aria-label="Instagram"
              >
                📷
              </a>
            </div>
          </div>
        </div>

        {/* Copyright notice */}
        <div style={{ 
          marginTop: theme.spacing.xl, 
          paddingTop: theme.spacing.xl, 
          borderTop: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          zIndex: 2
        }}>
          <p>&copy; 2025 Wednesday Yachting Luncheon - St. Francis Yacht Club. All rights reserved. 🛥️</p>
        </div>
      </footer>
    </>
  );
};

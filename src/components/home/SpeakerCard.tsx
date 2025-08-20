/**
 * ENHANCED SPEAKER CARD COMPONENT
 * 
 * Major improvements:
 * - Modern card design with hover effects
 * - Better image handling and fallbacks
 * - Enhanced typography and spacing
 * - Interactive elements and animations
 * - Responsive design
 * - Social sharing buttons
 * - Better presentation of speaker info
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export interface SpeakerCardProps {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  nextPresentationDate?: string;
  topic?: string;
  presentationTitle?: string;
  company?: string;
  credentials?: string[];
  specialties?: string[];
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({
  id,
  name,
  title,
  bio,
  photoUrl,
  nextPresentationDate,
  topic,
  presentationTitle,
  company,
  credentials = [],
  specialties = []
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Container style with enhanced hover effects
  const cardContainerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '24px',
    boxShadow: isHovered ? theme.shadows.xl : theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    position: 'relative',
    maxWidth: '800px',
    margin: '0 auto'
  };

  // Header section with gradient background
  const headerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colors.primary}ee, ${theme.colors.secondary}dd)`,
    color: '#ffffff',
    padding: theme.spacing.xl,
    position: 'relative',
    overflow: 'hidden'
  };

  // Content section
  const contentStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg
  };

  // Speaker info section
  const speakerInfoStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  };

  // Photo styling with enhanced effects
  const photoContainerStyle: React.CSSProperties = {
    position: 'relative',
    flexShrink: 0,
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: theme.shadows.lg,
    background: theme.colors.surface
  };

  const photoStyle: React.CSSProperties = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
  };

  const photoPlaceholderStyle: React.CSSProperties = {
    width: '150px',
    height: '150px',
    backgroundColor: theme.colors.surface,
    border: `3px solid ${theme.colors.border}`,
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    color: theme.colors.textSecondary
  };

  // Speaker details styling
  const detailsStyle: React.CSSProperties = {
    flex: 1,
    minWidth: '300px'
  };

  const nameStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 1.2
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.sm
  };

  const companyStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.secondary,
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.md
  };

  const bioStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text,
    lineHeight: 1.6,
    marginBottom: theme.spacing.md
  };

  // Credentials and specialties styling
  const tagContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.xs,
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md
  };

  const tagStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '20px',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    border: `1px solid ${theme.colors.border}`
  };

  // Presentation info styling
  const presentationStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: '16px',
    padding: theme.spacing.lg,
    border: `1px solid ${theme.colors.border}`,
    marginTop: theme.spacing.md
  };

  const presentationTitleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm
  };

  const topicStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    fontStyle: 'italic',
    marginBottom: theme.spacing.md
  };

  const dateStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.accent,
    color: '#ffffff',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: '25px',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    width: 'fit-content'
  };

  // Action buttons styling
  const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
    marginTop: theme.spacing.lg
  };

  const buttonStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: '25px',
    border: 'none',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.primary,
    color: '#ffffff'
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: theme.colors.primary,
    border: `2px solid ${theme.colors.primary}`
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate bio for preview
  const truncatedBio = bio.length > 200 && !isExpanded ? bio.substring(0, 200) + '...' : bio;

  return (
    <div
      style={cardContainerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Section */}
      <div style={headerStyle}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{
            fontSize: theme.typography.sizes['2xl'],
            fontWeight: theme.typography.weights.bold,
            marginBottom: theme.spacing.sm,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🎤 Featured Speaker
          </h2>
          {nextPresentationDate && (
            <div style={dateStyle}>
              📅 {formatDate(nextPresentationDate)}
            </div>
          )}
        </div>
        
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.4s ease'
        }} />
      </div>

      {/* Content Section */}
      <div style={contentStyle}>
        {/* Speaker Info */}
        <div style={speakerInfoStyle}>
          {/* Photo */}
          <div style={photoContainerStyle}>
            {photoUrl && !imageError ? (
              <img
                src={photoUrl}
                alt={name}
                style={photoStyle}
                onError={() => setImageError(true)}
              />
            ) : (
              <div style={photoPlaceholderStyle}>
                👤
              </div>
            )}
          </div>

          {/* Details */}
          <div style={detailsStyle}>
            <h3 style={nameStyle}>{name}</h3>
            <p style={titleStyle}>{title}</p>
            {company && <p style={companyStyle}>🏢 {company}</p>}

            {/* Credentials */}
            {credentials.length > 0 && (
              <div style={tagContainerStyle}>
                {credentials.map((credential, index) => (
                  <span key={index} style={{...tagStyle, backgroundColor: theme.colors.accent, color: '#ffffff'}}>
                    🏆 {credential}
                  </span>
                ))}
              </div>
            )}

            {/* Specialties */}
            {specialties.length > 0 && (
              <div style={tagContainerStyle}>
                {specialties.map((specialty, index) => (
                  <span key={index} style={tagStyle}>
                    ⭐ {specialty}
                  </span>
                ))}
              </div>
            )}

            {/* Bio */}
            <p style={bioStyle}>
              {truncatedBio}
              {bio.length > 200 && (
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme.colors.primary,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    marginLeft: theme.spacing.xs
                  }}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Presentation Info */}
        {(presentationTitle || topic) && (
          <div style={presentationStyle}>
            <h4 style={presentationTitleStyle}>
              📋 {presentationTitle || 'Upcoming Presentation'}
            </h4>
            {topic && <p style={topicStyle}>"{topic}"</p>}
          </div>
        )}

        {/* Action Buttons */}
        <div style={actionButtonsStyle}>
          <button
            style={primaryButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.secondary;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🎫 Reserve Seat
          </button>

          <button
            style={secondaryButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📖 Learn More
          </button>

          <button
            style={secondaryButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.accent;
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = theme.colors.accent;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.colors.primary;
              e.currentTarget.style.borderColor = theme.colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📤 Share
          </button>
        </div>
      </div>
    </div>
  );
};
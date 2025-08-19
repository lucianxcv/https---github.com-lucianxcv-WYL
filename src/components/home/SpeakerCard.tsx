/**
 * FIXED SPEAKER CARD COMPONENT
 * 
 * Update your existing src/components/home/SpeakerCard.tsx with this version
 * This removes the redundant role attribute and handles the presentations property
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { formatDate } from '../../utils/dateUtils';

// Updated Speaker interface to match what we're actually using
interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  nextPresentationDate?: string;
  topic?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export const SpeakerCard: React.FC<Speaker> = ({
  name,
  title,
  bio,
  photoUrl,
  nextPresentationDate,
  topic
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Main card styling with hover effects
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    padding: theme.spacing.xl,
    margin: `${theme.spacing.lg} 0`,
    // Shadow changes on hover
    boxShadow: isHovered ? theme.shadows.lg : theme.shadows.md,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.lg,
    // Smooth transitions for all changes
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    // 3D transform effects on hover
    transform: isHovered ? 'translateY(-8px) rotateY(2deg)' : 'translateY(0) rotateY(0deg)',
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    overflow: 'hidden'
  };

  // Speaker photo styling
  const photoStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: `4px solid ${theme.colors.secondary}`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: `url(${photoUrl})`,
    backgroundColor: theme.colors.accent,
    transition: 'all 0.4s ease',
    // Photo also transforms on hover
    transform: isHovered ? 'scale(1.05) rotate(3deg)' : 'scale(1) rotate(0deg)',
    boxShadow: theme.shadows.md,
    flexShrink: 0 // Prevents photo from shrinking
  };

  // Content area styling
  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm
  };

  const nameStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    margin: 0,
    lineHeight: 1.2
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.secondary,
    fontWeight: theme.typography.weights.medium,
    margin: 0
  };

  const topicStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.gold,
    fontStyle: 'italic',
    fontWeight: theme.typography.weights.medium,
    margin: `${theme.spacing.xs} 0`
  };

  const bioStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    lineHeight: 1.6,
    fontSize: theme.typography.sizes.base,
    margin: `${theme.spacing.sm} 0`
  };

  const dateStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: '25px',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    boxShadow: theme.shadows.sm
  };

  return (
    <article
      style={cardStyle}
      // Hover state management
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Speaker: ${name}`}
    >
      {/* Decorative background element */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: `linear-gradient(135deg, ${theme.colors.accent}20, ${theme.colors.secondary}10)`,
        borderRadius: '0 16px 0 100px',
        pointerEvents: 'none'
      }} />

      {/* Speaker photo */}
      <div style={photoStyle} />

      {/* Speaker information */}
      <div style={contentStyle}>
        <h3 style={nameStyle}>{name}</h3>
        <h4 style={titleStyle}>{title}</h4>
        {topic && <p style={topicStyle}>"{topic}"</p>}
        <p style={bioStyle}>{bio}</p>
        <span style={dateStyle} aria-live="polite">
          📅 {nextPresentationDate ? formatDate(nextPresentationDate) : "TBA"}
        </span>
      </div>
    </article>
  );
};
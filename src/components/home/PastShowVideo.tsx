// ==================== src/components/home/PastShowVideo.tsx ====================
/**
 * PAST SHOW VIDEO COMPONENT
 * 
 * Displays a YouTube video embed for past luncheon presentations.
 * Includes show metadata and responsive video player.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change video player styling or aspect ratio
 * - Add video thumbnail images
 * - Modify the metadata display (speaker, date, description)
 * - Add video duration or view count
 * - Change the loading animation or placeholder
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { PastShow } from '../../data/types';

export const PastShowVideo: React.FC<PastShow> = ({ 
  title, 
  speakerName, 
  videoId, 
  description, 
  date 
}) => {
  const theme = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    border: `2px solid ${theme.colors.primary}`,
    borderRadius: '16px',
    padding: theme.spacing.xl,
    margin: `${theme.spacing.lg} 0`,
    boxShadow: theme.shadows.md,
    transition: 'all 0.3s ease',
    fontFamily: theme.typography.fontFamily
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: theme.spacing.lg
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    margin: `0 0 ${theme.spacing.sm} 0`,
    lineHeight: 1.3
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: theme.spacing.sm
  };

  const speakerStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.secondary,
    fontWeight: theme.typography.weights.semibold,
    margin: 0
  };

  const dateStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    margin: 0
  };

  // Responsive video container - maintains 16:9 aspect ratio
  const videoContainerStyle: React.CSSProperties = {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
    borderRadius: '12px',
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.sm
  };

  const iframeStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    opacity: isLoaded ? 1 : 0, // Fade in when loaded
    transition: 'opacity 0.3s ease'
  };

  return (
    <article style={cardStyle} role="article" aria-label={`Video: ${title}`}>
      {/* Video metadata header */}
      <header style={headerStyle}>
        <h3 style={titleStyle}>{title}</h3>
        <div style={metaStyle}>
          <p style={speakerStyle}>🎤 {speakerName}</p>
          <p style={dateStyle}>📅 {new Date(date).toLocaleDateString()}</p>
        </div>
        {description && (
          <p style={{ color: theme.colors.textSecondary, lineHeight: 1.6 }}>
            {description}
          </p>
        )}
      </header>

      {/* Responsive video player */}
      <div style={videoContainerStyle}>
        {/* Loading placeholder */}
        {!isLoaded && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: theme.colors.textSecondary,
            fontSize: theme.typography.sizes.lg
          }}>
            🎥 Loading video...
          </div>
        )}
        {/* YouTube embed */}
        <iframe
          style={iframeStyle}
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          allowFullScreen
          loading="lazy" // Only load when visible
          onLoad={() => setIsLoaded(true)}
          aria-label={`Video player for ${title} by ${speakerName}`}
        />
      </div>
    </article>
  );
};


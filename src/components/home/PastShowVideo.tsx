/**
 * PAST SHOW VIDEO COMPONENT - THUMBNAIL CARD VERSION
 * 
 * Now shows as a compact thumbnail card instead of full video embed
 * Perfect for homepage and archive layouts
 * 
 * Save this as: src/components/home/PastShowVideo.tsx
 */

import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface PastShow {
  id: number;
  title: string;
  speakerName: string;
  date: string;
  year: number;
  description?: string;
  videoId?: string;
  isPublished?: boolean;
  slug?: string;
  duration?: number;
  topic?: string;
  views?: number;
  thumbnailUrl?: string;
  speakerBio?: string;
  speakerCompany?: string;
  featured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  onClick?: () => void; // ← Added onClick prop for navigation
  compact?: boolean; // ← NEW: Optional prop for even more compact display
}

export const PastShowVideo: React.FC<PastShow> = ({
  id,
  title,
  speakerName,
  date,
  year,
  description,
  videoId,
  slug,
  duration,
  topic,
  views,
  thumbnailUrl,
  tags,
  onClick,
  compact = false // ← NEW: Default to false for normal size
}) => {
  const theme = useTheme();

  // Generate thumbnail URL if not provided
  const thumbnail = thumbnailUrl || (videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : '/api/placeholder/400/225');

  // Handle click - use onClick prop if provided, otherwise default navigation
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Fallback navigation (for backward compatibility)
      if (slug) {
        window.location.hash = `#shows/${slug}`;
      } else {
        window.location.hash = `#past-show-${id}`;
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: compact ? '280px' : '400px', // ← NEW: Smaller for homepage
    boxShadow: theme.shadows.sm
  };

  const thumbnailContainerStyle: React.CSSProperties = {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface
  };

  const thumbnailStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  };

  const playButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '50%',
    width: compact ? '40px' : '60px', // ← NEW: Smaller play button for compact
    height: compact ? '40px' : '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: compact ? '16px' : '24px',
    transition: 'all 0.3s ease',
    border: '3px solid rgba(255, 255, 255, 0.9)'
  };

  const contentStyle: React.CSSProperties = {
    padding: compact ? theme.spacing.sm : theme.spacing.md, // ← NEW: Less padding for compact
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: compact ? theme.typography.sizes.base : theme.typography.sizes.lg, // ← NEW: Smaller title
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: compact ? 2 : 2, // ← NEW: 2 lines max for compact
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const speakerStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.xs
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 1.4,
    marginBottom: theme.spacing.xs,
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: compact ? 2 : 3, // ← NEW: Fewer lines for compact
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: compact ? theme.spacing.xs : theme.spacing.sm
  };

  const tagsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: 'auto'
  };

  const tagStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    padding: `2px 6px`,
    borderRadius: '10px',
    fontSize: theme.typography.sizes.xs,
    border: `1px solid ${theme.colors.border}`
  };

  return (
    <div
      style={containerStyle}
      onClick={handleClick} // ← NEW: Use our click handler
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = theme.shadows.md;
        const img = e.currentTarget.querySelector('img') as HTMLElement;
        const playButton = e.currentTarget.querySelector('[data-play-button]') as HTMLElement;
        if (img) img.style.transform = 'scale(1.05)';
        if (playButton) {
          playButton.style.transform = 'translate(-50%, -50%) scale(1.1)';
          playButton.style.backgroundColor = theme.colors.primary;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        const img = e.currentTarget.querySelector('img') as HTMLElement;
        const playButton = e.currentTarget.querySelector('[data-play-button]') as HTMLElement;
        if (img) img.style.transform = 'scale(1)';
        if (playButton) {
          playButton.style.transform = 'translate(-50%, -50%) scale(1)';
          playButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }
      }}
    >
      {/* Video Thumbnail */}
      <div style={thumbnailContainerStyle}>
        <img
          src={thumbnail}
          alt={title}
          style={thumbnailStyle}
          onError={(e) => {
            // Fallback if thumbnail fails to load
            e.currentTarget.src = '/api/placeholder/400/225';
          }}
        />
        
        {/* Play Button Overlay */}
        <div style={playButtonStyle} data-play-button>
          ▶
        </div>

        {/* Topic Badge */}
        {topic && (
          <div style={{
            position: 'absolute',
            top: theme.spacing.sm,
            left: theme.spacing.sm,
            backgroundColor: theme.colors.primary,
            color: '#ffffff',
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            borderRadius: '12px',
            fontSize: theme.typography.sizes.xs,
            fontWeight: theme.typography.weights.semibold
          }}>
            📂 {topic}
          </div>
        )}

        {/* Duration Badge */}
        {duration && (
          <div style={{
            position: 'absolute',
            bottom: theme.spacing.sm,
            right: theme.spacing.sm,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            borderRadius: '8px',
            fontSize: theme.typography.sizes.xs,
            fontWeight: theme.typography.weights.semibold
          }}>
            ⏱️ {duration}m
          </div>
        )}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <h3 style={titleStyle}>{title}</h3>
        
        <p style={speakerStyle}>🎤 {speakerName}</p>
        
        {description && (
          <p style={descriptionStyle}>{description}</p>
        )}
        
        <div style={metaStyle}>
          <span>📅 {new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}</span>
          {views && (
            <span>👁️ {views.toLocaleString()} views</span>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div style={tagsStyle}>
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} style={tagStyle}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
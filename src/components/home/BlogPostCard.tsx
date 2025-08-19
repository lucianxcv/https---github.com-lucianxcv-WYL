/**
 * BLOG POST CARD COMPONENT
 * 
 * Save this file as: src/components/home/BlogPostCard.tsx
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt: string;
  author: {
    id: string;
    name?: string;
    email: string;
  };
  views: number;
}

interface BlogPostCardProps extends BlogPost {
  onClick?: () => void;
  showFullContent?: boolean;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  createdAt,
  author,
  views,
  onClick,
  showFullContent = false
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate reading time (rough estimate)
  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: isHovered ? theme.shadows.lg : theme.shadows.md,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    fontFamily: theme.typography.fontFamily
  };

  const imageContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
  };

  const imagePlaceholderStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    color: theme.colors.textSecondary,
    fontSize: '3rem'
  };

  const contentStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const excerptStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    lineHeight: 1.6,
    marginBottom: theme.spacing.md,
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 'auto'
  };

  const authorStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: theme.typography.sizes.xs
  };

  const readMoreStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: theme.spacing.md,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '20px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none'
  };

  const newBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    backgroundColor: theme.colors.accent,
    color: '#ffffff',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '12px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    zIndex: 2
  };

  // Check if post is new (published within last 7 days)
  const isNew = () => {
    const publishDate = new Date(publishedAt || createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return publishDate > weekAgo;
  };

  return (
    <article
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      aria-label={`Blog post: ${title}`}
    >
      {/* New Badge */}
      {isNew() && <div style={newBadgeStyle}>🆕 New</div>}

      {/* Cover Image */}
      <div style={imageContainerStyle}>
        {coverImage && !imageError ? (
          <img
            src={coverImage}
            alt={title}
            style={imageStyle}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div style={imagePlaceholderStyle}>
            📝
          </div>
        )}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        <h3 style={titleStyle}>{title}</h3>
        
        {excerpt && (
          <p style={excerptStyle}>{excerpt}</p>
        )}

        <div style={metaStyle}>
          <div style={authorStyle}>
            <span>👤</span>
            <span>{author.name || author.email}</span>
          </div>
          
          <div style={statsStyle}>
            <span>👁️ {views}</span>
            <span>•</span>
            <span>📅 {formatDate(publishedAt || createdAt)}</span>
            {excerpt && (
              <>
                <span>•</span>
                <span>⏱️ {getReadingTime(excerpt)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Read More Button (appears on hover) */}
      {onClick && <div style={readMoreStyle}>Read More →</div>}
    </article>
  );
};
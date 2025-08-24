/**
 * ENHANCED BLOG POST CARD COMPONENT - SLUG-BASED NAVIGATION
 * 
 * Updated to use slug-based URLs for SEO-friendly navigation
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export interface BlogPostCardProps {
  id: string;
  title: string;
  slug?: string; // Added slug support
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  author?: string | {
    id: string;
    name?: string;
    email: string;
  };
  authorAvatar?: string;
  publishedAt?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  featured?: boolean;
  onClick?: () => void;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  id,
  title,
  slug,
  excerpt,
  content,
  imageUrl,
  author,
  authorAvatar,
  publishedAt,
  category,
  tags = [],
  readTime,
  featured = false,
  onClick
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Calculate read time if not provided
  const estimatedReadTime = readTime || Math.max(1, Math.ceil((content?.length || excerpt?.length || 500) / 200));

  // Get author name safely
  const getAuthorName = () => {
    if (typeof author === 'string') return author;
    if (typeof author === 'object' && author) return author.name || author.email;
    return 'Maritime Editor';
  };

  const authorName = getAuthorName();

  // Handle card click - use slug-based navigation
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation behavior using slug or fallback to ID
      if (slug) {
        window.location.href = `/posts/${slug}`;
      } else {
        console.warn('⚠️ No slug available for post, using ID fallback:', id);
        window.location.href = `/blog-post-${id}`;
      }
    }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: featured ? '24px' : '20px',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: isHovered ? theme.shadows.xl : theme.shadows.md,
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
    cursor: 'pointer',
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    height: featured ? '300px' : '200px',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
  };

  const imagePlaceholderStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    color: theme.colors.textSecondary,
    fontSize: featured ? '4rem' : '3rem'
  };

  const contentStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    flex: 1
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm
  };

  const categoryStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '20px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const featuredBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.accent,
    color: '#ffffff',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '20px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    zIndex: 2,
    boxShadow: theme.shadows.sm
  };

  const titleStyle: React.CSSProperties = {
    fontSize: featured ? theme.typography.sizes['2xl'] : theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    lineHeight: 1.3,
    marginBottom: theme.spacing.sm,
    display: '-webkit-box',
    WebkitLineClamp: featured ? 3 : 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const excerptStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    lineHeight: 1.6,
    marginBottom: theme.spacing.md,
    display: '-webkit-box',
    WebkitLineClamp: featured ? 4 : 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    flex: 1
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.border}`,
    marginTop: 'auto'
  };

  const authorStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const authorAvatarStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `2px solid ${theme.colors.border}`
  };

  const authorInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  };

  const authorNameStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text
  };

  const metaInfoStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs
  };

  const tagsStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.xs,
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm
  };

  const tagStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '12px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.2s ease'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${theme.colors.primary}08, ${theme.colors.secondary}08)`,
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const generateExcerpt = () => {
    if (excerpt) return excerpt;
    if (content) {
      // Strip HTML tags and get first 150 characters
      const plainText = content.replace(/<[^>]*>/g, '');
      return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
    }
    return 'Read this fascinating maritime article to learn more about the latest developments in the industry.';
  };

  return (
    <article
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Featured Badge */}
      {featured && (
        <div style={featuredBadgeStyle}>
          ⭐ Featured
        </div>
      )}

      {/* Image Section */}
      <div style={imageContainerStyle}>
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={title}
            style={imageStyle}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={imagePlaceholderStyle}>
            📰
          </div>
        )}
        
        {/* Gradient overlay on hover */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }} />
      </div>

      {/* Content Section */}
      <div style={contentStyle}>
        {/* Header with Category */}
        <div style={headerStyle}>
          {category && (
            <span style={categoryStyle}>
              {category}
            </span>
          )}
          <div style={metaInfoStyle}>
            📖 {estimatedReadTime} min read
          </div>
        </div>

        {/* Title */}
        <h3 style={titleStyle}>{title}</h3>

        {/* Excerpt */}
        <p style={excerptStyle}>
          {generateExcerpt()}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={tagsStyle}>
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                style={tagStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primary;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.surface;
                  e.currentTarget.style.color = theme.colors.text;
                }}
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span style={{...tagStyle, opacity: 0.7}}>
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer with Author and Date */}
        <div style={footerStyle}>
          <div style={authorStyle}>
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                style={authorAvatarStyle}
              />
            ) : (
              <div style={{
                ...authorAvatarStyle,
                backgroundColor: theme.colors.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}>
                👤
              </div>
            )}
            <div style={authorInfoStyle}>
              <div style={authorNameStyle}>
                {authorName}
              </div>
              {publishedAt && (
                <div style={metaInfoStyle}>
                  📅 {formatDate(publishedAt)}
                </div>
              )}
            </div>
          </div>

          {/* Read More Button */}
          <button
            style={{
              backgroundColor: theme.colors.primary,
              color: '#ffffff',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              border: 'none',
              borderRadius: '20px',
              fontSize: theme.typography.sizes.xs,
              fontWeight: theme.typography.weights.semibold,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: isHovered ? 1 : 0.8,
              transform: isHovered ? 'translateX(5px)' : 'translateX(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            Read More →
          </button>
        </div>
      </div>

      {/* Hover Overlay */}
      <div style={overlayStyle} />
    </article>
  );
};
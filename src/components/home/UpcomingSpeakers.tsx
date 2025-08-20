/**
 * ENHANCED UPCOMING SPEAKERS COMPONENT
 * 
 * Major improvements:
 * - Modern card grid layout
 * - Enhanced speaker mini-cards with better visuals
 * - Loading skeleton animation
 * - Better responsive design
 * - Interactive hover effects
 * - Enhanced empty states
 * - Better date formatting and presentation
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { useSpeakers } from '../../hooks/useSpeakers';

interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  nextPresentationDate?: string;
  topic?: string;
  presentationTitle?: string;
  company?: string;
}

interface UpcomingSpeakersProps {
  maxSpeakers?: number;
  showEmptyState?: boolean;
}

export const UpcomingSpeakers: React.FC<UpcomingSpeakersProps> = ({
  maxSpeakers = 3,
  showEmptyState = true
}) => {
  const theme = useTheme();
  const { upcomingSpeakers, loading, error } = useSpeakers();

  const sectionStyle: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderRadius: '24px',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.md
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: '20px',
    border: `2px dashed ${theme.colors.border}`,
    color: theme.colors.textSecondary
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.textSecondary
  };

  // Loading skeleton component
  const LoadingSkeleton: React.FC = () => (
    <div style={gridStyle}>
      {[...Array(maxSpeakers)].map((_, index) => (
        <div key={index} style={{
          backgroundColor: theme.colors.surface,
          borderRadius: '20px',
          padding: theme.spacing.lg,
          border: `1px solid ${theme.colors.border}`,
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: theme.colors.border,
            margin: '0 auto 16px auto'
          }} />
          <div style={{
            height: '20px',
            backgroundColor: theme.colors.border,
            borderRadius: '10px',
            marginBottom: '12px'
          }} />
          <div style={{
            height: '16px',
            backgroundColor: theme.colors.border,
            borderRadius: '8px',
            marginBottom: '12px',
            width: '80%',
            margin: '0 auto 12px auto'
          }} />
          <div style={{
            height: '14px',
            backgroundColor: theme.colors.border,
            borderRadius: '7px',
            width: '60%',
            margin: '0 auto'
          }} />
        </div>
      ))}
    </div>
  );

  // Enhanced speaker mini card component
  const SpeakerMiniCard: React.FC<{ speaker: Speaker; index: number }> = ({ speaker, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    const cardStyle: React.CSSProperties = {
      backgroundColor: theme.colors.surface,
      borderRadius: '20px',
      padding: theme.spacing.lg,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: isHovered ? theme.shadows.lg : theme.shadows.sm,
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
    };

    const photoStyle: React.CSSProperties = {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `3px solid ${theme.colors.accent}`,
      marginBottom: theme.spacing.md,
      transition: 'transform 0.3s ease',
      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
    };

    const photoPlaceholderStyle: React.CSSProperties = {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: theme.colors.background,
      border: `3px solid ${theme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md
    };

    const nameStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: 1.2
    };

    const titleStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
      fontWeight: theme.typography.weights.semibold
    };

    const companyStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.secondary,
      marginBottom: theme.spacing.sm,
      fontWeight: theme.typography.weights.medium
    };

    const topicStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
      fontStyle: 'italic',
      marginBottom: theme.spacing.md,
      lineHeight: 1.4,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    };

    const dateContainerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.accent,
      color: '#ffffff',
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: '20px',
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.bold,
      marginTop: 'auto'
    };

    const statusBadgeStyle: React.CSSProperties = {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      color: '#ffffff',
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: '12px',
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.semibold
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays < 7) return `${diffDays} days`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    };

    const getStatusBadge = () => {
      if (!speaker.nextPresentationDate) return null;
      
      const date = new Date(speaker.nextPresentationDate);
      const now = new Date();
      const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) return "Coming Soon";
      if (diffDays <= 30) return "This Month";
      return "Upcoming";
    };

    return (
      <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Status Badge */}
        {getStatusBadge() && (
          <div style={statusBadgeStyle}>
            {getStatusBadge()}
          </div>
        )}

        {/* Card Content */}
        <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Photo */}
          {speaker.photoUrl && !imageError ? (
            <img
              src={speaker.photoUrl}
              alt={speaker.name}
              style={photoStyle}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={photoPlaceholderStyle}>
              👤
            </div>
          )}

          {/* Speaker Info */}
          <h4 style={nameStyle}>{speaker.name}</h4>
          <p style={titleStyle}>{speaker.title}</p>
          {speaker.company && (
            <p style={companyStyle}>🏢 {speaker.company}</p>
          )}

          {/* Topic */}
          {speaker.topic && (
            <p style={topicStyle}>"{speaker.topic}"</p>
          )}

          {/* Date */}
          {speaker.nextPresentationDate && (
            <div style={dateContainerStyle}>
              📅 {formatDate(speaker.nextPresentationDate)}
            </div>
          )}
        </div>

        {/* Hover overlay effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.secondary}10)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          borderRadius: '20px'
        }} />
      </div>
    );
  };

  // CSS animations
  const animations = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  if (loading) {
    return (
      <>
        <style>{animations}</style>
        <section style={sectionStyle}>
          <h2 style={titleStyle}>📅 Coming Up Next</h2>
          <LoadingSkeleton />
        </section>
      </>
    );
  }

  if (error) {
    return (
      <section style={sectionStyle}>
        <h2 style={titleStyle}>📅 Coming Up Next</h2>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>⚠️</div>
          <h3 style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
            Unable to Load Speakers
          </h3>
          <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.md }}>
            We're having trouble loading the upcoming speakers. Please try again later.
          </p>
          <button
            style={{
              backgroundColor: theme.colors.primary,
              color: '#ffffff',
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.semibold
            }}
            onClick={() => window.location.reload()}
          >
            🔄 Try Again
          </button>
        </div>
      </section>
    );
  }

  const displaySpeakers = upcomingSpeakers.slice(0, maxSpeakers);

  if (displaySpeakers.length === 0) {
    if (!showEmptyState) return null;

    return (
      <>
        <style>{animations}</style>
        <section style={sectionStyle}>
          <h2 style={titleStyle}>📅 Coming Up Next</h2>
          <div style={emptyStateStyle}>
            <div style={{ fontSize: '4rem', marginBottom: theme.spacing.md }}>📋</div>
            <h3 style={{ 
              color: theme.colors.text, 
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.sizes.xl
            }}>
              More Speakers Coming Soon
            </h3>
            <p style={{ 
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.lg,
              fontSize: theme.typography.sizes.md,
              lineHeight: 1.6
            }}>
              We're always booking exciting new speakers for upcoming luncheons.
              Our team is working to finalize the next lineup of maritime experts.
            </p>
            <div style={{
              display: 'flex',
              gap: theme.spacing.sm,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#ffffff',
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.semibold,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondary;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primary;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                📧 Get Notified
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  color: theme.colors.primary,
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  border: `2px solid ${theme.colors.primary}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.semibold,
                  transition: 'all 0.3s ease'
                }}
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
                🎤 Suggest a Speaker
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{animations}</style>
      <section style={sectionStyle}>
        <h2 style={titleStyle}>📅 Coming Up Next</h2>
        <div style={gridStyle}>
          {displaySpeakers.map((speaker, index) => (
            <SpeakerMiniCard key={speaker.id} speaker={speaker} index={index} />
          ))}
        </div>
        
        {/* View All Button */}
        {upcomingSpeakers.length > maxSpeakers && (
          <div style={{ textAlign: 'center', marginTop: theme.spacing.xl }}>
            <button
              style={{
                backgroundColor: theme.colors.secondary,
                color: '#ffffff',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                border: 'none',
                borderRadius: '25px',
                fontSize: theme.typography.sizes.md,
                fontWeight: theme.typography.weights.semibold,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: theme.shadows.sm
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.secondary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.shadows.sm;
              }}
            >
              👥 View All Upcoming Speakers ({upcomingSpeakers.length})
            </button>
          </div>
        )}
      </section>
    </>
  );
};
/**
 * UPCOMING SPEAKERS COMPONENT
 * 
 * Save this file as: src/components/home/UpcomingSpeakers.tsx
 */

import React from 'react';
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
    marginBottom: theme.spacing.xl
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing.lg
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.textSecondary
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.textSecondary
  };

  // Mini speaker card for upcoming speakers (smaller than main speaker card)
  const SpeakerMiniCard: React.FC<{ speaker: Speaker }> = ({ speaker }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const cardStyle: React.CSSProperties = {
      backgroundColor: theme.colors.background,
      borderRadius: '12px',
      padding: theme.spacing.md,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: isHovered ? theme.shadows.md : theme.shadows.sm,
      transition: 'all 0.3s ease',
      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      cursor: 'pointer'
    };

    const photoStyle: React.CSSProperties = {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `2px solid ${theme.colors.secondary}`,
      marginBottom: theme.spacing.sm
    };

    const photoPlaceholderStyle: React.CSSProperties = {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: theme.colors.surface,
      border: `2px solid ${theme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm
    };

    const nameStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: 1.2
    };

    const titleStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
      fontWeight: theme.typography.weights.medium
    };

    const topicStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: theme.spacing.sm
    };

    const dateStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.accent,
      fontWeight: theme.typography.weights.semibold,
      backgroundColor: theme.colors.surface,
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: '20px',
      display: 'inline-block'
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ textAlign: 'center' }}>
          {speaker.photoUrl ? (
            <img
              src={speaker.photoUrl}
              alt={speaker.name}
              style={photoStyle}
            />
          ) : (
            <div style={photoPlaceholderStyle}>
              👤
            </div>
          )}
          
          <h4 style={nameStyle}>{speaker.name}</h4>
          <p style={titleStyle}>{speaker.title}</p>
          
          {speaker.topic && (
            <p style={topicStyle}>"{speaker.topic}"</p>
          )}
          
          {speaker.nextPresentationDate && (
            <span style={dateStyle}>
              📅 {formatDate(speaker.nextPresentationDate)}
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section style={sectionStyle}>
        <h2 style={titleStyle}>📅 Coming Up Next</h2>
        <div style={loadingStyle}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>⏳</div>
          <p>Loading upcoming speakers...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={sectionStyle}>
        <h2 style={titleStyle}>📅 Coming Up Next</h2>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>⚠️</div>
          <p>Unable to load upcoming speakers.</p>
        </div>
      </section>
    );
  }

  const displaySpeakers = upcomingSpeakers.slice(0, maxSpeakers);

  if (displaySpeakers.length === 0) {
    if (!showEmptyState) return null;
    
    return (
      <section style={sectionStyle}>
        <h2 style={titleStyle}>📅 Coming Up Next</h2>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📋</div>
          <h3 style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
            More Speakers Coming Soon
          </h3>
          <p style={{ color: theme.colors.textSecondary }}>
            We're always booking exciting new speakers for upcoming luncheons. 
            Check back soon for updates!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>📅 Coming Up Next</h2>
      <div style={gridStyle}>
        {displaySpeakers.map((speaker) => (
          <SpeakerMiniCard key={speaker.id} speaker={speaker} />
        ))}
      </div>
    </section>
  );
};
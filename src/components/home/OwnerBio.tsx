/**
 * OWNER BIOGRAPHY COMPONENT
 * 
 * Displays Ron's biography, photo, and achievements.
 * Features a two-column layout with professional styling.
 */

import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { sampleData } from '../../data/sampleData';

export const OwnerBio: React.FC = () => {
  const theme = useTheme();
  const owner = sampleData.owner;

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '20px',
    padding: theme.spacing['2xl'],
    margin: `${theme.spacing.xl} 0`,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    gap: theme.spacing['2xl'],
    alignItems: 'flex-start',
    fontFamily: theme.typography.fontFamily
  };

  // Executive Producer's photo styling
  const photoStyle: React.CSSProperties = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: `4px solid ${theme.colors.primary}`,
    flexShrink: 0,
    backgroundColor: theme.colors.surface,
    // Gradient background as fallback
    backgroundImage: 'linear-gradient(45deg, #87ceeb, #4682b4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    boxShadow: theme.shadows.md,
    overflow: 'hidden'
  };

  const textStyle: React.CSSProperties = {
    flex: 1
  };

  const nameStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    margin: `0 0 ${theme.spacing.sm} 0`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const bioStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    lineHeight: 1.6,
    fontSize: theme.typography.sizes.lg,
    marginBottom: theme.spacing.lg
  };

  const achievementsStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`
  };

  return (
    <section style={containerStyle}>
      {/* Executive Producer's photo */}
      <div style={photoStyle}>
        {owner.photoUrl ? (
          <img 
            src={owner.photoUrl} 
            alt={owner.name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover' as const
            }}
            onError={(e) => {
              // TypeScript-safe fallback to emoji if image fails to load
              const target = e.currentTarget;
              const parent = target.parentElement;
              if (parent) {
                target.style.display = 'none';
                parent.innerHTML = '👨‍💼';
              }
            }}
          />
        ) : (
          '👨‍💼'
        )}
      </div>

      {/* Biography text and achievements */}
      <div style={textStyle}>
        <h2 style={nameStyle}>
            {owner.name}
        </h2>
        <p style={bioStyle}>{owner.bio}</p>
        
        {/* Achievements section */}
        <div style={achievementsStyle}>
          <h3 style={{
            fontSize: theme.typography.sizes.xl,
            color: theme.colors.primary,
            marginBottom: theme.spacing.md
          }}>
            🏆 Achievements & Recognition
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {owner.achievements.map((achievement, index) => (
              <li key={index} style={{
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.sm,
                paddingLeft: theme.spacing.lg,
                position: 'relative'
              }}>
                {/* Achievement icon */}
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: theme.colors.gold
                }}>🎖️</span>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
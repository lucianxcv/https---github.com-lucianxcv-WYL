// ==================== src/components/home/CommentsSection.tsx ====================
/**
 * COMMENTS & SUGGESTIONS SECTION
 *
 * Now connected to real authentication system!
 * Users can log in and access commenting features.
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../utils/useAuth';

export const CommentsSection: React.FC = () => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  const sectionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    padding: theme.spacing.xl,
    margin: `${theme.spacing.xl} 0`,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const placeholderStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: '12px',
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    border: 'none',
    borderRadius: '8px',
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: theme.spacing.md,
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center'
  };

  const formStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: '12px',
    marginTop: theme.spacing.lg
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: theme.typography.sizes.base,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
    color: theme.colors.text
  };

  // Mock comment data to show what the section will look like
  const mockComments = [
    {
      id: 1,
      author: "Sarah M.",
      content: "Captain Johnson's presentation on deep-sea exploration was absolutely fascinating! The underwater footage was breathtaking.",
      date: "2025-08-07",
      showTitle: "Mysteries of the Mariana Trench"
    },
    {
      id: 2,
      author: "Mike R.",
      content: "I'd love to see a speaker about sustainable fishing practices. This topic is becoming increasingly important.",
      date: "2025-08-06",
      showTitle: "Speaker Suggestion"
    }
  ];

  return (
    <section style={sectionStyle} id="comments">
      <h2 style={titleStyle}>
        💬 Comments & Suggestions
      </h2>

      {/*
        PLACEHOLDER NOTICE - Updated for authentication
      */}
      <div style={placeholderStyle}>
        <p style={{ marginBottom: theme.spacing.md }}>
          {isAuthenticated ? '🎉 Welcome! You can now:' : '🚧 Coming Soon! 🚧'}
        </p>
        <p style={{ marginBottom: theme.spacing.md }}>
          {isAuthenticated ? 'Participate in discussions:' : 'This section will allow logged-in users to:'}
        </p>
        <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
          <li>📝 Comment on luncheon presentations</li>
          <li>🎤 Suggest speakers for future events</li>
          <li>⭐ Rate presentations and speakers</li>
          <li>💬 Discuss maritime topics with other attendees</li>
        </ul>
      </div>

      {/*
        AUTHENTICATION BUTTONS - Now working!
      */}
      {!isAuthenticated ? (
        <div style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
          <a
            href="#auth"
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
          >
            🔐 Login to Comment
          </a>
          <a
            href="#auth"
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
          >
            ✍️ Sign Up
          </a>
        </div>
      ) : (
        /*
          LOGGED-IN USER INTERFACE
          This is what users will see after authentication
        */
        <div>
          <div style={{ marginBottom: theme.spacing.lg, textAlign: 'center' }}>
            <p style={{ color: theme.colors.primary, marginBottom: theme.spacing.md }}>
              👋 Welcome back, {user?.name || user?.email}!
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.lg, justifyContent: 'center' }}>
            <button
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
              onClick={() => {
                // TODO: Implement comment posting
                alert('Comment form will be implemented with backend integration');
              }}
            >
              💭 Add Comment
            </button>
            <button
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
              onClick={() => setShowSuggestionForm(!showSuggestionForm)}
            >
              🎤 Suggest Speaker
            </button>
          </div>

          {/*
            SPEAKER SUGGESTION FORM
            This form will eventually submit to your backend API
          */}
          {showSuggestionForm && (
            <div style={formStyle}>
              <h3 style={{ marginBottom: theme.spacing.md, color: theme.colors.primary }}>
                🎤 Suggest a Speaker
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                // TODO: Submit to backend API
                alert('Form submission will be connected to backend API');
              }}>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Speaker Name"
                  required
                />
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Suggested Topic"
                  required
                />
                <textarea
                  style={{...inputStyle, height: '100px', resize: 'vertical'}}
                  placeholder="Why would this speaker be interesting? What's their background?"
                  required
                />
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="Speaker's Contact Email (if known)"
                />
                <button type="submit" style={buttonStyle}>
                  📤 Submit Suggestion
                </button>
                <button
                  type="button"
                  style={{...buttonStyle, backgroundColor: theme.colors.textSecondary}}
                  onClick={() => setShowSuggestionForm(false)}
                >
                  ❌ Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/*
        MOCK COMMENTS PREVIEW
        Shows what the comments will look like when real data is connected
      */}
      <div>
        <h3 style={{
          color: theme.colors.primary,
          marginBottom: theme.spacing.md,
          fontSize: theme.typography.sizes.lg
        }}>
          📖 Recent Comments {isAuthenticated ? '' : '(Preview)'}
        </h3>
        {mockComments.map((comment) => (
          <div key={comment.id} style={{
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            borderRadius: '8px',
            marginBottom: theme.spacing.md,
            borderLeft: `4px solid ${theme.colors.accent}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing.xs
            }}>
              <strong style={{ color: theme.colors.primary }}>
                {comment.author}
              </strong>
              <span style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textSecondary
              }}>
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </div>
            <p style={{
              color: theme.colors.text,
              margin: `${theme.spacing.xs} 0`,
              lineHeight: 1.5
            }}>
              {comment.content}
            </p>
            <small style={{
              color: theme.colors.textSecondary,
              fontStyle: 'italic'
            }}>
              Re: {comment.showTitle}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
};
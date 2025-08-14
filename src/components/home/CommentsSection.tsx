// ==================== src/components/home/CommentsSection.tsx ====================
/**
 * COMMENTS & SUGGESTIONS SECTION (PLACEHOLDER)
 * 
 * This is a placeholder for future functionality where logged-in users can:
 * - Post comments about luncheons
 * - Suggest speakers for future events
 * - View and interact with other users' comments
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change the placeholder text and styling
 * - Add mock comment data to show what it will look like
 * - Modify the form fields (add rating, categories, etc.)
 * - Change the layout and visual design
 * 
 * FUTURE BACKEND INTEGRATION POINTS:
 * - Replace mock data with API calls to fetch real comments
 * - Add form submission handlers that send data to your backend
 * - Implement user authentication checks
 * - Add real-time comment updates
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export const CommentsSection: React.FC = () => {
  const theme = useTheme();
  // These will eventually be replaced with real user authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    marginRight: theme.spacing.md
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
      date: "2025-08-08",
      showTitle: "Mysteries of the Mariana Trench"
    },
    {
      id: 2,
      author: "Mike R.",
      content: "I'd love to see a speaker about sustainable fishing practices. This topic is becoming increasingly important.",
      date: "2025-08-07",
      showTitle: "Speaker Suggestion"
    }
  ];

  return (
    <section style={sectionStyle} id="comments">
      <h2 style={titleStyle}>
        💬 Comments & Suggestions
      </h2>

      {/* 
        PLACEHOLDER NOTICE
        This explains to users what this section will become
      */}
      <div style={placeholderStyle}>
        <p style={{ marginBottom: theme.spacing.md }}>
          🚧 <strong>Coming Soon!</strong> 🚧
        </p>
        <p style={{ marginBottom: theme.spacing.md }}>
          This section will allow logged-in users to:
        </p>
        <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
          <li>📝 Comment on luncheon presentations</li>
          <li>🎤 Suggest speakers for future events</li>
          <li>⭐ Rate presentations and speakers</li>
          <li>💬 Discuss maritime topics with other attendees</li>
        </ul>
      </div>

      {/* 
        AUTHENTICATION BUTTONS
        These will eventually connect to real login system
      */}
      {!isLoggedIn ? (
        <div style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
          <button 
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
            onClick={() => {
              // TODO: Connect to real authentication system
              alert('Login functionality will be connected to backend authentication');
            }}
          >
            🔐 Login to Comment
          </button>
          <button 
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
            onClick={() => {
              // TODO: Connect to real authentication system  
              alert('Signup functionality will be connected to backend authentication');
            }}
          >
            ✍️ Sign Up
          </button>
        </div>
      ) : (
        /* 
          LOGGED-IN USER INTERFACE
          This is what users will see after authentication
        */
        <div>
          <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
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
          📖 Recent Comments (Preview)
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

      {/* 
        DEVELOPMENT NOTES
        Hidden in production, helpful during development
      */}
      <details style={{ marginTop: theme.spacing.lg }}>
        <summary style={{ 
          cursor: 'pointer', 
          color: theme.colors.secondary,
          fontWeight: theme.typography.weights.semibold 
        }}>
          🛠️ Developer Notes (Click to expand)
        </summary>
        <div style={{
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.md,
          borderRadius: '8px',
          marginTop: theme.spacing.sm,
          fontSize: theme.typography.sizes.sm,
          lineHeight: 1.6
        }}>
          <p><strong>Backend Integration Checklist:</strong></p>
          <ul>
            <li>✅ User authentication (login/signup)</li>
            <li>✅ Comment posting and retrieval</li>
            <li>✅ Speaker suggestion submission</li>
            <li>✅ User permission checking</li>
            <li>✅ Real-time comment updates</li>
            <li>✅ Content moderation</li>
          </ul>
          <p style={{ marginTop: theme.spacing.sm }}>
            <strong>API Endpoints Needed:</strong>
          </p>
          <ul>
            <li><code>POST /api/auth/login</code></li>
            <li><code>POST /api/auth/register</code></li>
            <li><code>GET /api/comments</code></li>
            <li><code>POST /api/comments</code></li>
            <li><code>POST /api/speaker-suggestions</code></li>
          </ul>
        </div>
      </details>
    </section>
  );
};


/**
 * SIMPLIFIED COMMENTS SECTION COMPONENT - REAL API INTEGRATION
 * 
 * Updated to match the simplified backend:
 * - No reactions system
 * - No nested replies  
 * - Simple comment posting with authentication
 * - Edit and delete own comments
 */

import React, { useState, useRef } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../utils/useAuth';
import { useComments } from '../../hooks/useComments';

// Simplified TypeScript interfaces to match our backend
interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
}

interface Comment {
  id: string;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  updatedAt: string;
  status: 'approved' | 'pending' | 'rejected';
  showId?: string;
  postId?: string;
}

interface CommentsSectionProps {
  showId?: string;
  postId?: string;
  maxComments?: number;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  showId,
  postId,
  maxComments = 10
}) => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  
  // Use the simplified comments hook
  const {
    comments,
    totalComments,
    totalParticipants,
    loading,
    submitting,
    error,
    loadComments,
    submitComment,
    editComment,
    deleteComment,
    clearError
  } = useComments({ showId, postId, user });

  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest'); // Removed 'popular' since no reactions
  const [expandedComments, setExpandedComments] = useState<number>(maxComments);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Styling (keeping your existing styles)
  const sectionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '24px',
    padding: theme.spacing.xl,
    margin: `${theme.spacing.xl} auto`,
    maxWidth: '1200px',
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
    gap: theme.spacing.md
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary
  };

  const sortControlStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const selectStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '12px',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const commentFormStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: '20px',
    padding: theme.spacing.lg,
    border: `2px solid ${theme.colors.border}`,
    marginBottom: theme.spacing.xl,
    transition: 'all 0.3s ease',
    transform: showCommentForm ? 'scale(1)' : 'scale(0.98)',
    opacity: showCommentForm ? 1 : 0.9
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '120px',
    padding: theme.spacing.md,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '12px',
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    resize: 'vertical',
    transition: 'all 0.3s ease',
    lineHeight: 1.6
  };

  const formActionsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    flexWrap: 'wrap',
    gap: theme.spacing.sm
  };

  const buttonStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: '25px',
    border: 'none',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.primary,
    color: '#ffffff'
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: theme.colors.textSecondary,
    border: `1px solid ${theme.colors.border}`
  };

  // Error display component
  const ErrorBanner: React.FC<{ error: string; onDismiss: () => void }> = ({ error, onDismiss }) => (
    <div style={{
      backgroundColor: '#fee2e2',
      border: '1px solid #fca5a5',
      borderRadius: '12px',
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
        <span style={{ color: '#dc2626', fontSize: '1.2rem' }}>⚠️</span>
        <span style={{ color: '#dc2626', fontSize: theme.typography.sizes.sm }}>
          {error}
        </span>
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#dc2626',
          cursor: 'pointer',
          fontSize: '1.2rem',
          padding: '4px'
        }}
      >
        ✕
      </button>
    </div>
  );

  // Simplified comment component (no reactions, no replies)
  const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
    const isOwner = user?.id === comment.author.id;
    const isAdmin = user?.role === 'ADMIN';
    const canEditDelete = isOwner || isAdmin;

    const commentStyle: React.CSSProperties = {
      backgroundColor: theme.colors.surface,
      borderRadius: '16px',
      padding: theme.spacing.lg,
      border: `1px solid ${theme.colors.border}`,
      marginBottom: theme.spacing.md,
      transition: 'all 0.3s ease'
    };

    const authorStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md
    };

    const avatarPlaceholderStyle: React.CSSProperties = {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: theme.colors.primary,
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      fontWeight: theme.typography.weights.bold
    };

    const authorInfoStyle: React.CSSProperties = {
      flex: 1
    };

    const authorNameStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
      marginBottom: '2px'
    };

    const commentMetaStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm
    };

    const contentStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.base,
      color: theme.colors.text,
      lineHeight: 1.6,
      marginBottom: theme.spacing.md,
      whiteSpace: 'pre-wrap'
    };

    const actionsStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
      flexWrap: 'wrap'
    };

    const actionButtonStyle: React.CSSProperties = {
      background: 'none',
      border: 'none',
      color: theme.colors.textSecondary,
      cursor: 'pointer',
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    };

    const roleBadgeStyle: React.CSSProperties = {
      backgroundColor: comment.author.role === 'ADMIN' ? '#e74c3c' : 
                       comment.author.role === 'MODERATOR' ? '#f39c12' : theme.colors.accent,
      color: '#ffffff',
      padding: `2px ${theme.spacing.xs}`,
      borderRadius: '8px',
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.bold
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    };

    const handleEdit = () => {
      setEditingComment(comment.id);
      setEditText(comment.content);
    };

    const handleSaveEdit = async () => {
      if (!editText.trim()) return;
      
      const success = await editComment(comment.id, editText.trim());
      if (success) {
        setEditingComment(null);
        setEditText('');
      }
    };

    const handleCancelEdit = () => {
      setEditingComment(null);
      setEditText('');
    };

    const handleDelete = async () => {
      if (!window.confirm('Are you sure you want to delete this comment?')) return;
      
      await deleteComment(comment.id);
    };

    return (
      <div style={commentStyle}>
        {/* Author Info */}
        <div style={authorStyle}>
          {comment.author.avatar ? (
            <img 
              src={comment.author.avatar} 
              alt={comment.author.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `2px solid ${theme.colors.border}`
              }}
            />
          ) : (
            <div style={avatarPlaceholderStyle}>
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div style={authorInfoStyle}>
            <div style={authorNameStyle}>
              {comment.author.name}
              {comment.author.role && comment.author.role !== 'USER' && (
                <span style={{...roleBadgeStyle, marginLeft: theme.spacing.sm}}>
                  {comment.author.role}
                </span>
              )}
            </div>
            <div style={commentMetaStyle}>
              <span>📅 {formatDate(comment.createdAt)}</span>
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span>✏️ Edited</span>
              )}
            </div>
          </div>
        </div>

        {/* Comment Content */}
        {editingComment === comment.id ? (
          <div style={{ marginBottom: theme.spacing.md }}>
            <textarea
              style={{...textareaStyle, minHeight: '100px'}}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              maxLength={1000}
            />
            <div style={{...formActionsStyle, marginTop: theme.spacing.sm}}>
              <div style={{fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary}}>
                {editText.length}/1000
              </div>
              <div style={{display: 'flex', gap: theme.spacing.sm}}>
                <button
                  style={secondaryButtonStyle}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...primaryButtonStyle,
                    opacity: (!editText.trim() || editText.length > 1000) ? 0.6 : 1
                  }}
                  onClick={handleSaveEdit}
                  disabled={!editText.trim() || editText.length > 1000}
                >
                  💾 Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={contentStyle}>
            {comment.content}
          </div>
        )}

        {/* Actions */}
        <div style={actionsStyle}>
          {/* Edit (only for comment author) */}
          {canEditDelete && editingComment !== comment.id && (
            <button
              style={actionButtonStyle}
              onClick={handleEdit}
            >
              ✏️ Edit
            </button>
          )}

          {/* Delete (only for comment author or admin) */}
          {canEditDelete && (
            <button
              style={actionButtonStyle}
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          )}

          {/* Report */}
          <button
            style={actionButtonStyle}
            onClick={() => {
              alert('Comment reported for review. Thank you for helping keep our community safe.');
            }}
          >
            🚨 Report
          </button>
        </div>
      </div>
    );
  };

  // Submit main comment
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isAuthenticated || submitting) return;

    try {
      const result = await submitComment({
        content: newComment.trim(),
        showId,
        postId
      });

      if (result) {
        setNewComment('');
        setShowCommentForm(false);
        console.log('✅ Comment posted successfully!');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  // Sort comments (simplified - no popularity)
  const sortedComments: Comment[] = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  const displayComments: Comment[] = sortedComments.slice(0, expandedComments);

  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>💬 Comments & Discussion</h2>

      {/* Error Display */}
      {error && (
        <ErrorBanner error={error} onDismiss={clearError} />
      )}

      {/* Header */}
      <div style={headerStyle}>
        <div style={statsStyle}>
          <span>📊 {totalComments} comment{totalComments !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>👥 {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}</span>
        </div>

        <div style={sortControlStyle}>
          <label style={{fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary}}>
            Sort by:
          </label>
          <select
            style={selectStyle}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
            onBlur={(e) => e.target.style.borderColor = theme.colors.border}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

// Enhanced Comment Form Section (for your CommentsSection.tsx)
// This replaces your existing comment form

{/* Enhanced Comment Form with Validation */}
{isAuthenticated ? (
  <div style={commentFormStyle} ref={formRef}>
    {!showCommentForm ? (
      <button
        style={{
          width: '100%',
          padding: theme.spacing.md,
          backgroundColor: 'transparent',
          border: `2px dashed ${theme.colors.border}`,
          borderRadius: '12px',
          color: theme.colors.textSecondary,
          fontSize: theme.typography.sizes.base,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textAlign: 'left'
        }}
        onClick={() => {
          setShowCommentForm(true);
          setTimeout(() => commentInputRef.current?.focus(), 100);
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.colors.primary;
          e.currentTarget.style.backgroundColor = `${theme.colors.primary}05`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.colors.border;
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        💭 Share your thoughts about {showId ? 'this presentation' : postId ? 'this article' : 'today\'s discussion'}...
      </button>
    ) : (
      <>
        <div style={{marginBottom: theme.spacing.md}}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.sm
          }}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover'
              }} />
            ) : (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: theme.colors.primary,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: theme.typography.weights.bold
              }}>
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
            <span style={{
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.medium,
              color: theme.colors.text
            }}>
              Commenting as {user?.name}
            </span>
          </div>
          
          <textarea
            ref={commentInputRef}
            style={{
              ...textareaStyle,
              borderColor: newComment.length < 10 && newComment.length > 0 
                ? '#ef4444' 
                : newComment.length >= 10 
                  ? '#10b981' 
                  : theme.colors.border
            }}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, ask questions, or suggest topics for future sessions..."
            maxLength={1000}
            onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
            onBlur={(e) => e.target.style.borderColor = 
              newComment.length < 10 && newComment.length > 0 
                ? '#ef4444' 
                : newComment.length >= 10 
                  ? '#10b981' 
                  : theme.colors.border
            }
          />
          
          {/* 🔧 NEW: Validation Message */}
          {newComment.length > 0 && newComment.length < 10 && (
            <div style={{
              marginTop: theme.spacing.xs,
              fontSize: theme.typography.sizes.xs,
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs
            }}>
              <span>⚠️</span>
              <span>
                Comment must be at least 10 characters long 
                ({10 - newComment.length} more needed)
              </span>
            </div>
          )}
          
          {/* 🔧 NEW: Success Message */}
          {newComment.length >= 10 && (
            <div style={{
              marginTop: theme.spacing.xs,
              fontSize: theme.typography.sizes.xs,
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs
            }}>
              <span>✅</span>
              <span>Ready to post!</span>
            </div>
          )}
        </div>

        <div style={formActionsStyle}>
          <div style={{
            fontSize: theme.typography.sizes.xs,
            color: theme.colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
          }}>
            <span style={{ 
              color: newComment.length > 900 
                ? '#ef4444' 
                : newComment.length > 800 
                  ? '#f59e0b' 
                  : theme.colors.textSecondary 
            }}>
              {newComment.length}/1000
            </span>
            <span>•</span>
            <span>💡 Be respectful and constructive</span>
            {newComment.length < 10 && (
              <>
                <span>•</span>
                <span style={{ color: '#ef4444' }}>
                  Min: 10 characters
                </span>
              </>
            )}
          </div>

          <div style={{display: 'flex', gap: theme.spacing.sm}}>
            <button
              style={secondaryButtonStyle}
              onClick={() => {
                setShowCommentForm(false);
                setNewComment('');
              }}
            >
              Cancel
            </button>

            <button
              style={{
                ...primaryButtonStyle,
                opacity: (!newComment.trim() || newComment.length < 10 || newComment.length > 1000 || submitting) ? 0.6 : 1,
                cursor: (!newComment.trim() || newComment.length < 10 || newComment.length > 1000 || submitting) ? 'not-allowed' : 'pointer'
              }}
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || newComment.length < 10 || newComment.length > 1000 || submitting}
              title={
                !newComment.trim() 
                  ? 'Please enter a comment' 
                  : newComment.length < 10 
                    ? `Comment must be at least 10 characters (${10 - newComment.length} more needed)`
                    : newComment.length > 1000 
                      ? 'Comment is too long' 
                      : 'Post your comment'
              }
            >
              {submitting ? '⏳ Posting...' : '💬 Post Comment'}
            </button>
          </div>
        </div>
      </>
    )}
  </div>
) : (
  <div style={{
    ...commentFormStyle,
    textAlign: 'center',
    backgroundColor: `${theme.colors.primary}10`
  }}>
    <p style={{
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      fontSize: theme.typography.sizes.base
    }}>
      🔐 Please sign in to join the discussion
    </p>
    <a
      href="#auth"
      style={primaryButtonStyle}
      onClick={(e) => {
        e.preventDefault();
        window.location.hash = '#auth';
      }}
    >
      🔑 Sign In to Comment
    </a>
  </div>
)}
      {/* Comments List */}
      {loading ? (
        <div style={{textAlign: 'center', padding: theme.spacing.xl}}>
          <div style={{fontSize: '2rem', marginBottom: theme.spacing.md}}>⏳</div>
          <p>Loading comments...</p>
        </div>
      ) : displayComments.length > 0 ? (
        <>
          <div>
            {displayComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>

          {/* Load More Button */}
          {comments.length > expandedComments && (
            <div style={{textAlign: 'center', marginTop: theme.spacing.lg}}>
              <button
                style={secondaryButtonStyle}
                onClick={() => setExpandedComments(prev => prev + maxComments)}
              >
                📄 Load More Comments ({comments.length - expandedComments} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: theme.spacing.xl,
          backgroundColor: theme.colors.surface,
          borderRadius: '20px',
          border: `2px dashed ${theme.colors.border}`
        }}>
          <div style={{fontSize: '3rem', marginBottom: theme.spacing.md}}>💭</div>
          <h3 style={{
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text,
            marginBottom: theme.spacing.sm
          }}>
            Start the Conversation
          </h3>
          <p style={{
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
            fontSize: theme.typography.sizes.base
          }}>
            Be the first to share your thoughts!
          </p>
          {isAuthenticated && (
            <button
              style={primaryButtonStyle}
              onClick={() => {
                setShowCommentForm(true);
                setTimeout(() => commentInputRef.current?.focus(), 100);
              }}
            >
              💬 Write First Comment
            </button>
          )}
        </div>
      )}

      {/* Community Guidelines */}
      <div style={{
        marginTop: theme.spacing.xl,
        padding: theme.spacing.md,
        backgroundColor: `${theme.colors.accent}15`,
        borderRadius: '12px',
        border: `1px solid ${theme.colors.accent}30`
      }}>
        <h4 style={{
          fontSize: theme.typography.sizes.md,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.text,
          marginBottom: theme.spacing.sm,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs
        }}>
          📋 Community Guidelines
        </h4>
        <ul style={{
          fontSize: theme.typography.sizes.sm,
          color: theme.colors.textSecondary,
          lineHeight: 1.6,
          paddingLeft: theme.spacing.lg,
          margin: 0
        }}>
          <li>Keep discussions respectful and professional</li>
          <li>Stay on topic related to maritime subjects</li>
          <li>No spam, self-promotion, or off-topic content</li>
          <li>Use constructive language when providing feedback</li>
          <li>Report inappropriate content to help maintain our community</li>
        </ul>
      </div>
    </section>
  );
};
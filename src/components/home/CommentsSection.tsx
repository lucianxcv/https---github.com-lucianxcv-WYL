/**
 * ENHANCED COMMENTS SECTION COMPONENT - REAL API INTEGRATION
 * 
 * Major improvements:
 * - Real API integration with useComments hook
 * - Error handling and loading states
 * - Proper form validation
 * - Optimistic UI updates
 * - Better accessibility
 * - Fixed TypeScript interfaces
 */

import React, { useState, useRef } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../utils/useAuth';
import { useComments } from '../../hooks/useComments';

// Define proper TypeScript interfaces
interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
}

interface CommentReactions {
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike' | null;
}

interface Comment {
  id: string;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
  reactions?: CommentReactions;
  status: 'approved' | 'pending' | 'rejected';
  showId?: string;
}

interface CommentsSectionProps {
  showId?: string;
  maxComments?: number;
  allowReplies?: boolean;
  requireAuth?: boolean;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  showId,
  maxComments = 10,
  allowReplies = true,
  requireAuth = false
}) => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  
  // Use the real comments hook
  const {
    comments,
    totalComments,
    totalParticipants,
    loading,
    submitting,
    error,
    loadComments,
    submitComment,
    updateReaction,
    deleteComment,
    clearError
  } = useComments({ showId });

  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [expandedComments, setExpandedComments] = useState<number>(maxComments);
  
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

  // Comment component
  const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({ comment, depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');

    const commentStyle: React.CSSProperties = {
      backgroundColor: depth === 0 ? theme.colors.surface : theme.colors.background,
      borderRadius: '16px',
      padding: theme.spacing.lg,
      border: `1px solid ${theme.colors.border}`,
      marginBottom: theme.spacing.md,
      marginLeft: depth > 0 ? `${depth * 24}px` : '0',
      transition: 'all 0.3s ease',
      position: 'relative'
    };

    const authorStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md
    };

    const avatarStyle: React.CSSProperties = {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `2px solid ${theme.colors.border}`
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

    const actionButtonStyle = (isActive: boolean): React.CSSProperties => ({
      background: 'none',
      border: 'none',
      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
      cursor: 'pointer',
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    });

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

    const handleReaction = async (type: 'like' | 'dislike') => {
      if (!isAuthenticated) return;
      
      try {
        await updateReaction(comment.id, type);
        // The hook handles optimistic updates
      } catch (error) {
        console.error('Failed to update reaction:', error);
      }
    };

    const handleReply = async () => {
      if (!replyText.trim() || !isAuthenticated || submitting) return;

      try {
        const newReply = await submitComment({
          content: replyText.trim(),
          showId,
          parentId: comment.id
        });

        if (newReply) {
          setReplyText('');
          setShowReplyForm(false);
        }
      } catch (error) {
        console.error('Failed to post reply:', error);
      }
    };

    const handleDelete = async () => {
      if (!confirm('Are you sure you want to delete this comment?')) return;
      
      try {
        await deleteComment(comment.id);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    };

    return (
      <div style={commentStyle}>
        {/* Author Info */}
        <div style={authorStyle}>
          {comment.author.avatar ? (
            <img 
              src={comment.author.avatar} 
              alt={comment.author.name}
              style={avatarStyle}
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
              {comment.status === 'pending' && (
                <span style={{ color: '#f39c12' }}>⏳ Pending approval</span>
              )}
            </div>
          </div>

          {/* Collapse button */}
          {comment.replies && comment.replies.length > 0 && (
            <button
              style={actionButtonStyle(false)}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '▼' : '▶'} {comment.replies.length}
            </button>
          )}
        </div>

        {/* Comment Content */}
        <div style={contentStyle}>
          {comment.content}
        </div>

        {/* Actions */}
        <div style={actionsStyle}>
          {/* Reactions */}
          <button
            style={actionButtonStyle(comment.reactions?.userReaction === 'like')}
            onClick={() => handleReaction('like')}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? 'Sign in to react' : ''}
          >
            👍 {comment.reactions?.likes || 0}
          </button>

          <button
            style={actionButtonStyle(comment.reactions?.userReaction === 'dislike')}
            onClick={() => handleReaction('dislike')}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? 'Sign in to react' : ''}
          >
            👎 {comment.reactions?.dislikes || 0}
          </button>

          {/* Reply */}
          {allowReplies && depth < 3 && isAuthenticated && (
            <button
              style={actionButtonStyle(showReplyForm)}
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              💬 Reply
            </button>
          )}

          {/* Delete (only for comment author or admin) */}
          {isAuthenticated && (user?.id === comment.author.id || user?.role === 'ADMIN') && (
            <button
              style={actionButtonStyle(false)}
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          )}

          {/* Report */}
          <button
            style={actionButtonStyle(false)}
            onClick={() => {
              // TODO: Implement proper report functionality
              alert('Comment reported for review. Thank you for helping keep our community safe.');
            }}
          >
            🚨 Report
          </button>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div style={{
            marginTop: theme.spacing.md,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.background,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <textarea
              style={{...textareaStyle, minHeight: '80px'}}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.author.name}...`}
              maxLength={500}
              onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
              onBlur={(e) => e.target.style.borderColor = theme.colors.border}
            />
            <div style={{...formActionsStyle, marginTop: theme.spacing.sm}}>
              <div style={{fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary}}>
                {replyText.length}/500
              </div>
              <div style={{display: 'flex', gap: theme.spacing.sm}}>
                <button
                  style={secondaryButtonStyle}
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...primaryButtonStyle,
                    opacity: (!replyText.trim() || replyText.length > 500 || submitting) ? 0.6 : 1
                  }}
                  onClick={handleReply}
                  disabled={!replyText.trim() || replyText.length > 500 || submitting}
                  onMouseEnter={(e) => {
                    if (!(!replyText.trim() || replyText.length > 500 || submitting)) {
                      e.currentTarget.style.backgroundColor = theme.colors.secondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!replyText.trim() || replyText.length > 500 || submitting)) {
                      e.currentTarget.style.backgroundColor = theme.colors.primary;
                    }
                  }}
                >
                  {submitting ? '⏳ Posting...' : '💬 Reply'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {isExpanded && comment.replies && comment.replies.length > 0 && (
          <div style={{marginTop: theme.spacing.md}}>
            {comment.replies.map((reply: Comment) => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                depth={depth + 1} 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Submit main comment
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isAuthenticated || submitting) return;

    try {
      const result = await submitComment({
        content: newComment.trim(),
        showId
      });

      if (result) {
        setNewComment('');
        setShowCommentForm(false);
        
        // Show success message
        console.log('✅ Comment posted successfully!');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  // Sort comments
  const sortedComments: Comment[] = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        const aScore = (a.reactions?.likes || 0) - (a.reactions?.dislikes || 0);
        const bScore = (b.reactions?.likes || 0) - (b.reactions?.dislikes || 0);
        return bScore - aScore;
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
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Comment Form */}
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
              💭 Share your thoughts about {showId ? 'this presentation' : 'today\'s presentation'}...
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
                  style={textareaStyle}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about the presentation, ask questions, or suggest topics for future sessions..."
                  maxLength={1000}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                />
              </div>

              <div style={formActionsStyle}>
                <div style={{
                  fontSize: theme.typography.sizes.xs,
                  color: theme.colors.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm
                }}>
                  <span>{newComment.length}/1000</span>
                  <span>•</span>
                  <span>💡 Be respectful and constructive</span>
                </div>

                <div style={{display: 'flex', gap: theme.spacing.sm}}>
                  <button
                    style={secondaryButtonStyle}
                    onClick={() => {
                      setShowCommentForm(false);
                      setNewComment('');
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.surface;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    style={{
                      ...primaryButtonStyle,
                      opacity: (!newComment.trim() || newComment.length > 1000 || submitting) ? 0.6 : 1
                    }}
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || newComment.length > 1000 || submitting}
                    onMouseEnter={(e) => {
                      if (!(!newComment.trim() || newComment.length > 1000 || submitting)) {
                        e.currentTarget.style.backgroundColor = theme.colors.secondary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!(!newComment.trim() || newComment.length > 1000 || submitting)) {
                        e.currentTarget.style.backgroundColor = theme.colors.primary;
                      }
                    }}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primary;
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.colors.textSecondary;
                  e.currentTarget.style.borderColor = theme.colors.border;
                }}
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
            Be the first to share your thoughts about {showId ? 'this presentation' : 'today\'s presentation'} or ask questions for future sessions.
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
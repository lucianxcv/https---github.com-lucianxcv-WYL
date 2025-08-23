/**
 * COMMENTS HOOK - Real API Integration
 * 
 * Custom hook for managing comments with real API calls
 * Supports general comments and show-specific comments
 */

import { useState, useEffect, useCallback } from 'react';
import { commentsApi } from '../utils/apiService';

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

interface CreateCommentData {
  content: string;
  showId?: string;
  parentId?: string;
}

interface UseCommentsOptions {
  showId?: string;
  autoLoad?: boolean;
}

export const useComments = (options: UseCommentsOptions = {}) => {
  const { showId, autoLoad = true } = options;
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load comments from API
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (showId) {
        // Load comments for specific show
        response = await commentsApi.getByShow(showId);
      } else {
        // Load general comments (homepage/community)
        response = await commentsApi.getAll();
      }
      
      // Transform API response to match our Comment interface
      const transformedComments = response.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        author: {
          id: comment.author?.id || comment.authorId || 'unknown',
          name: comment.author?.name || comment.authorName || 'Anonymous',
          avatar: comment.author?.avatar || comment.authorAvatar,
          role: comment.author?.role || 'USER'
        },
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        replies: comment.replies?.map((reply: any) => ({
          id: reply.id,
          content: reply.content,
          author: {
            id: reply.author?.id || reply.authorId || 'unknown',
            name: reply.author?.name || reply.authorName || 'Anonymous',
            avatar: reply.author?.avatar || reply.authorAvatar,
            role: reply.author?.role || 'USER'
          },
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          reactions: {
            likes: reply.likes || 0,
            dislikes: reply.dislikes || 0,
            userReaction: reply.userReaction || null
          },
          status: reply.status || 'approved'
        })) || [],
        reactions: {
          likes: comment.likes || 0,
          dislikes: comment.dislikes || 0,
          userReaction: comment.userReaction || null
        },
        status: comment.status || 'approved',
        showId: comment.showId
      }));
      
      setComments(transformedComments);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load comments');
      
      // Fallback to mock data if API fails (for development)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Using mock data as fallback');
        setComments(getMockComments());
      }
    } finally {
      setLoading(false);
    }
  }, [showId]);

  // Submit new comment
  const submitComment = useCallback(async (commentData: CreateCommentData): Promise<Comment | null> => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await commentsApi.create({
        content: commentData.content,
        showId: commentData.showId || showId,
        parentId: commentData.parentId,
        status: 'pending' // Comments start as pending for moderation
      });
      
      // Transform response to match our interface
      const newComment: Comment = {
        id: response.id,
        content: response.content,
        author: {
          id: response.author?.id || response.authorId,
          name: response.author?.name || response.authorName,
          avatar: response.author?.avatar || response.authorAvatar,
          role: response.author?.role || 'USER'
        },
        createdAt: response.createdAt,
        reactions: {
          likes: 0,
          dislikes: 0,
          userReaction: null
        },
        status: response.status || 'pending',
        showId: response.showId,
        replies: []
      };
      
      // Add to local state if it's a top-level comment
      if (!commentData.parentId) {
        setComments(prev => [newComment, ...prev]);
      } else {
        // Handle reply - update the parent comment's replies
        setComments(prev => prev.map(comment => {
          if (comment.id === commentData.parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            };
          }
          return comment;
        }));
      }
      
      return newComment;
    } catch (err) {
      console.error('Failed to submit comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit comment');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [showId]);

  // Update comment reaction (like/dislike)
  const updateReaction = useCallback(async (commentId: string, reaction: 'like' | 'dislike') => {
    try {
      // Optimistically update UI
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          const currentReaction = comment.reactions?.userReaction;
          const likes = comment.reactions?.likes || 0;
          const dislikes = comment.reactions?.dislikes || 0;
          
          let newLikes = likes;
          let newDislikes = dislikes;
          let newUserReaction: 'like' | 'dislike' | null = reaction;
          
          // Handle reaction logic
          if (reaction === 'like') {
            if (currentReaction === 'like') {
              // Remove like
              newLikes = Math.max(0, likes - 1);
              newUserReaction = null;
            } else {
              // Add like, remove dislike if exists
              newLikes = likes + 1;
              if (currentReaction === 'dislike') {
                newDislikes = Math.max(0, dislikes - 1);
              }
            }
          } else { // dislike
            if (currentReaction === 'dislike') {
              // Remove dislike
              newDislikes = Math.max(0, dislikes - 1);
              newUserReaction = null;
            } else {
              // Add dislike, remove like if exists
              newDislikes = dislikes + 1;
              if (currentReaction === 'like') {
                newLikes = Math.max(0, likes - 1);
              }
            }
          }
          
          return {
            ...comment,
            reactions: {
              likes: newLikes,
              dislikes: newDislikes,
              userReaction: newUserReaction
            }
          };
        }
        
        // Also check replies
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                const currentReaction = reply.reactions?.userReaction;
                const likes = reply.reactions?.likes || 0;
                const dislikes = reply.reactions?.dislikes || 0;
                
                let newLikes = likes;
                let newDislikes = dislikes;
                let newUserReaction: 'like' | 'dislike' | null = reaction;
                
                if (reaction === 'like') {
                  if (currentReaction === 'like') {
                    newLikes = Math.max(0, likes - 1);
                    newUserReaction = null;
                  } else {
                    newLikes = likes + 1;
                    if (currentReaction === 'dislike') {
                      newDislikes = Math.max(0, dislikes - 1);
                    }
                  }
                } else {
                  if (currentReaction === 'dislike') {
                    newDislikes = Math.max(0, dislikes - 1);
                    newUserReaction = null;
                  } else {
                    newDislikes = dislikes + 1;
                    if (currentReaction === 'like') {
                      newLikes = Math.max(0, likes - 1);
                    }
                  }
                }
                
                return {
                  ...reply,
                  reactions: {
                    likes: newLikes,
                    dislikes: newDislikes,
                    userReaction: newUserReaction
                  }
                };
              }
              return reply;
            })
          };
        }
        
        return comment;
      }));
      
      // Make API call to persist reaction
      await commentsApi.updateReaction(commentId, reaction);
    } catch (err) {
      console.error('Failed to update reaction:', err);
      // Revert optimistic update on error
      await loadComments();
    }
  }, [loadComments]);

  // Delete comment
  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    try {
      await commentsApi.delete(commentId);
      
      // Remove from local state
      setComments(prev => prev.filter(comment => {
        if (comment.id === commentId) return false;
        
        // Also remove from replies
        if (comment.replies) {
          comment.replies = comment.replies.filter(reply => reply.id !== commentId);
        }
        
        return true;
      }));
      
      return true;
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
      return false;
    }
  }, []);

  // Load comments on mount
  useEffect(() => {
    if (autoLoad) {
      loadComments();
    }
  }, [loadComments, autoLoad]);

  // Calculate stats
  const totalComments = comments.reduce((count, comment) => {
    return count + 1 + (comment.replies?.length || 0);
  }, 0);

  const totalParticipants = new Set(
    comments.flatMap(comment => [
      comment.author.id,
      ...(comment.replies?.map(reply => reply.author.id) || [])
    ])
  ).size;

  return {
    // Data
    comments,
    totalComments,
    totalParticipants,
    
    // States
    loading,
    submitting,
    error,
    
    // Actions
    loadComments,
    submitComment,
    updateReaction,
    deleteComment,
    
    // Helpers
    clearError: () => setError(null)
  };
};

// Mock data for development/fallback
const getMockComments = (): Comment[] => [
  {
    id: '1',
    content: 'What an incredible presentation! Captain Rodriguez really knows how to explain complex maritime navigation in simple terms. Looking forward to more sessions like this.',
    author: {
      id: '1',
      name: 'Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c93b?w=150',
      role: 'USER'
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reactions: { likes: 12, dislikes: 0, userReaction: null },
    status: 'approved',
    replies: [
      {
        id: '2',
        content: 'I completely agree! The safety protocols section was particularly enlightening.',
        author: {
          id: '2',
          name: 'Mike Chen',
          role: 'MODERATOR'
        },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        reactions: { likes: 5, dislikes: 0 },
        status: 'approved'
      }
    ]
  },
  {
    id: '3',
    content: 'The weather conditions today were perfect for discussing storm navigation techniques. Great timing!',
    author: {
      id: '3',
      name: 'Captain James Wilson',
      role: 'ADMIN'
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    reactions: { likes: 8, dislikes: 0 },
    status: 'approved'
  },
  {
    id: '4',
    content: 'Could we get the slides from today\'s presentation? I\'d love to review the cargo handling procedures again.',
    author: {
      id: '4',
      name: 'Lisa Thompson',
      role: 'USER'
    },
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    reactions: { likes: 3, dislikes: 0 },
    status: 'approved'
  }
];
/**
 * COMMENTS HOOK - Updated for Simple Auth System
 * 
 * Updated to work with new user authentication and simplified backend
 */

import { useState, useEffect, useCallback } from 'react';
import { commentsApi } from '../utils/apiService';

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

interface CreateCommentData {
  content: string;
  showId?: string;
  postId?: string;
}

interface UseCommentsOptions {
  showId?: string;
  postId?: string;
  autoLoad?: boolean;
  user?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
  } | null;
}

export const useComments = (options: UseCommentsOptions = {}) => {
  const { showId, postId, autoLoad = true, user } = options;
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load comments from API
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading comments...', { showId, postId });
      
      let response: any;
      if (showId) {
        response = await commentsApi.getByShow(showId);
      } else {
        response = await commentsApi.getAll({
          showId,
          postId,
          limit: 50
        });
      }
      
      console.log('📡 Raw API response:', response);
      
      // Handle different response formats
      let commentsArray: any[] = [];
      
      if (Array.isArray(response)) {
        commentsArray = response;
      } else if (response?.data && Array.isArray(response.data)) {
        commentsArray = response.data;
      } else if (response === null || response === undefined) {
        commentsArray = [];
        console.log('📝 No comments found, using empty array');
      } else {
        console.warn('⚠️ Unexpected response format:', typeof response, response);
        commentsArray = [];
      }
      
      console.log('📊 Processing comments array:', commentsArray.length, 'items');
      
      if (!Array.isArray(commentsArray)) {
        console.error('❌ Expected array but got:', typeof commentsArray);
        setComments([]);
        return;
      }
      
      // Transform API response to match our Comment interface
      const transformedComments: Comment[] = commentsArray.map((comment: any, index: number) => {
        try {
          return {
            id: comment.id?.toString() || `temp-${index}`,
            content: comment.content || 'No content',
            author: {
              id: comment.author?.id || 'unknown',
              name: comment.author?.name || 'Anonymous User',
              avatar: comment.author?.avatar,
              role: comment.author?.role || 'USER'
            },
            createdAt: comment.createdAt || new Date().toISOString(),
            updatedAt: comment.updatedAt || comment.createdAt || new Date().toISOString(),
            status: comment.status || 'approved',
            showId: comment.showId?.toString(),
            postId: comment.postId
          };
        } catch (transformError) {
          console.error('❌ Error transforming comment:', transformError, comment);
          return {
            id: `error-${index}`,
            content: 'Error loading comment',
            author: { 
              id: 'unknown', 
              name: 'Unknown User', 
              role: 'USER' as const 
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'approved' as const
          };
        }
      });
      
      console.log('✅ Transformed comments:', transformedComments.length);
      setComments(transformedComments);
      
    } catch (err) {
      console.error('❌ Failed to load comments:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load comments';
      setError(errorMessage);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [showId, postId]);

  // Submit new comment
  const submitComment = useCallback(async (commentData: CreateCommentData): Promise<Comment | null> => {
    try {
      setSubmitting(true);
      setError(null);
      
      console.log('📝 Submitting comment:', commentData);
      
      if (!user?.id) {
        throw new Error('You must be signed in to post comments');
      }

      // Ensure we have a name (fallback to email or 'User')
      const userName = user.name || user.email || 'Anonymous User';
      
      // Prepare request data for backend
      const requestData = {
        content: commentData.content,
        showId: commentData.showId ? parseInt(commentData.showId) : undefined,
        postId: commentData.postId || undefined
      };
      
      console.log('📤 Sending request data:', requestData);
      
      const response = await commentsApi.create(requestData);
      
      console.log('✅ Comment submission response:', response);
      
      // Handle backend response format
      let commentResult = response;
      if (response?.data) {
        commentResult = response.data;
      }
      
      // Transform response to match our interface
      const createdComment: Comment = {
        id: commentResult.id?.toString() || `temp-${Date.now()}`,
        content: commentResult.content || commentData.content,
        author: {
          id: commentResult.author?.id || user.id,
          name: commentResult.author?.name || userName,
          avatar: commentResult.author?.avatar || user.avatar,
          role: (commentResult.author?.role || user.role || 'USER') as 'USER' | 'ADMIN' | 'MODERATOR'
        },
        createdAt: commentResult.createdAt || new Date().toISOString(),
        updatedAt: commentResult.updatedAt || new Date().toISOString(),
        status: commentResult.status || 'approved',
        showId: commentResult.showId?.toString() || commentData.showId,
        postId: commentResult.postId || commentData.postId
      };
      
      // Add to local state
      setComments(prev => [createdComment, ...prev]);
      
      return createdComment;
    } catch (err) {
      console.error('❌ Failed to submit comment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit comment';
      setError(errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [user]);

  // Edit comment
  const editComment = useCallback(async (commentId: string, content: string): Promise<boolean> => {
    try {
      console.log('✏️ Editing comment:', commentId);
      
      const response = await commentsApi.update(commentId, { content });
      
      // Update local state
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            content: content,
            updatedAt: new Date().toISOString()
          };
        }
        return comment;
      }));
      
      return true;
    } catch (err) {
      console.error('❌ Failed to edit comment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to edit comment';
      setError(errorMessage);
      return false;
    }
  }, []);

  // Delete comment
  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting comment:', commentId);
      
      await commentsApi.delete(commentId);
      
      // Remove from local state
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      return true;
    } catch (err) {
      console.error('❌ Failed to delete comment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(errorMessage);
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
  const totalComments = comments.length;

  const totalParticipants = new Set(
    comments.map(comment => comment.author.id)
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
    editComment,
    deleteComment,
    
    // Helpers
    clearError: () => setError(null)
  };
};
/**
 * BLOG POST MANAGEMENT COMPONENT
 * 
 * Save this file as: src/components/admin/BlogPostManagement.tsx
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Post, CreatePostData, UpdatePostData } from '../../data/types';
import { adminApi } from '../../utils/apiService';

interface BlogPostManagementProps {
  onPostUpdate?: () => void;
}

interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
}

const initialFormData: PostFormData = {
  title: '',
  content: '',
  excerpt: '',
  coverImage: '',
  published: false
};

export const BlogPostManagement: React.FC<BlogPostManagementProps> = ({ onPostUpdate }) => {
  const theme = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<PostFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '12px',
    padding: theme.spacing.lg,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: theme.spacing.md,
    boxShadow: theme.shadows.md
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    transition: 'all 0.3s ease'
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.border}`
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.sm,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: theme.typography.sizes.sm,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    boxSizing: 'border-box' as const
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical' as const,
    fontFamily: 'monospace'
  };

  // Load posts from API
  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const publishedFilter = filterPublished === 'all' ? undefined : filterPublished === 'published';
      const response = await adminApi.posts.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        published: publishedFilter
      });

      if (response.success && response.data) {
        setPosts(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError('Failed to load posts');
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [currentPage, searchTerm, filterPublished]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      if (editingPost) {
        // Update existing post - create proper UpdatePostData
        const updateData: UpdatePostData = {
          id: editingPost.id,
          ...formData
        };
        const response = await adminApi.posts.update(editingPost.id, updateData);
        if (response.success) {
          setEditingPost(null);
          setFormData(initialFormData);
          loadPosts();
          onPostUpdate?.();
        } else {
          setError(response.error || 'Failed to update post');
        }
      } else {
        // Create new post - use CreatePostData
        const createData: CreatePostData = {
          ...formData
        };
        const response = await adminApi.posts.create(createData);
        if (response.success) {
          setShowCreateForm(false);
          setFormData(initialFormData);
          loadPosts();
          onPostUpdate?.();
        } else {
          setError(response.error || 'Failed to create post');
        }
      }
    } catch (error) {
      console.error('Failed to save post:', error);
      setError('Failed to save post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete post
  const handleDelete = async (postId: string) => {
    setShowDeleteConfirm(postId);
  };

  // Confirm delete post
  const confirmDelete = async (postId: string) => {
    try {
      const response = await adminApi.posts.delete(postId);
      if (response.success) {
        loadPosts();
        onPostUpdate?.();
      } else {
        setError(response.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      setError('Failed to delete post. Please try again.');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  // Handle publish/unpublish
  const handleTogglePublish = async (post: Post) => {
    try {
      // Create proper UpdatePostData with id
      const updateData: UpdatePostData = {
        id: post.id,
        published: !post.published
      };
      const response = await adminApi.posts.update(post.id, updateData);
      if (response.success) {
        loadPosts();
        onPostUpdate?.();
      } else {
        setError(response.error || 'Failed to update post status');
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      setError('Failed to update post status. Please try again.');
    }
  };

  // Start editing
  const startEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      coverImage: post.coverImage || '',
      published: post.published
    });
    setShowCreateForm(true);
    setError(null);
  };

  // Cancel form
  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingPost(null);
    setFormData(initialFormData);
    setError(null);
  };

  // Clear search and filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterPublished('all');
    setCurrentPage(1);
  };

  // Render error message
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div style={{
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: theme.spacing.md,
        borderRadius: '8px',
        marginBottom: theme.spacing.md,
        border: '1px solid #fecaca'
      }}>
        ⚠️ {error}
      </div>
    );
  };

  // Render delete confirmation modal
  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;

    const postToDelete = posts.find(p => p.id === showDeleteConfirm);
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: theme.colors.background,
          padding: theme.spacing.xl,
          borderRadius: '12px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: theme.shadows.lg,
          border: `1px solid ${theme.colors.border}`
        }}>
          <h3 style={{
            color: '#dc2626',
            marginBottom: theme.spacing.md,
            fontSize: theme.typography.sizes.lg
          }}>
            🗑️ Delete Post
          </h3>
          
          <p style={{
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
            lineHeight: 1.5
          }}>
            Are you sure you want to delete <strong>"{postToDelete?.title}"</strong>?
          </p>
          
          <p style={{
            color: '#dc2626',
            marginBottom: theme.spacing.lg,
            fontSize: theme.typography.sizes.sm
          }}>
            ⚠️ This action cannot be undone.
          </p>

          <div style={{
            display: 'flex',
            gap: theme.spacing.sm,
            justifyContent: 'flex-end'
          }}>
            <button
              style={secondaryButtonStyle}
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </button>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: '#dc2626'
              }}
              onClick={() => confirmDelete(showDeleteConfirm)}
            >
              🗑️ Delete Post
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render post form
  const renderPostForm = () => (
    <div style={cardStyle}>
      <h3 style={{
        color: theme.colors.primary,
        marginBottom: theme.spacing.lg,
        fontSize: theme.typography.sizes.xl
      }}>
        {editingPost ? '✏️ Edit Post' : '➕ Create New Post'}
      </h3>

      {renderError()}

      <div>
        <div style={{ marginBottom: theme.spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            Title *
          </label>
          <input
            type="text"
            style={inputStyle}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter post title..."
            disabled={submitting}
          />
        </div>

        <div style={{ marginBottom: theme.spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            Excerpt (Optional)
          </label>
          <textarea
            style={{ ...textareaStyle, minHeight: '80px' }}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Brief description of the post (recommended for SEO)..."
            disabled={submitting}
          />
        </div>

        <div style={{ marginBottom: theme.spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            Cover Image URL (Optional)
          </label>
          <input
            type="url"
            style={inputStyle}
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
            disabled={submitting}
          />
          {formData.coverImage && (
            <div style={{ marginTop: theme.spacing.xs }}>
              <img
                src={formData.coverImage}
                alt="Cover preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '100px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: `1px solid ${theme.colors.border}`
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: theme.spacing.md }}>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            Content *
          </label>
          <textarea
            style={{ ...textareaStyle, minHeight: '300px' }}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write your post content here... (Supports HTML formatting)"
            disabled={submitting}
          />
          <div style={{
            fontSize: theme.typography.sizes.xs,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.xs
          }}>
            💡 <strong>Formatting Tips:</strong> Use HTML tags like &lt;h2&gt;Heading&lt;/h2&gt;, &lt;p&gt;paragraph&lt;/p&gt;, 
            &lt;strong&gt;bold&lt;/strong&gt;, &lt;em&gt;italic&lt;/em&gt;, &lt;a href="url"&gt;link&lt;/a&gt;, 
            &lt;ul&gt;&lt;li&gt;list&lt;/li&gt;&lt;/ul&gt;
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.sm,
          backgroundColor: theme.colors.surface,
          borderRadius: '8px',
          border: `1px solid ${theme.colors.border}`
        }}>
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            style={{ marginRight: theme.spacing.sm }}
            disabled={submitting}
          />
          <label htmlFor="published" style={{
            color: theme.colors.text,
            fontWeight: theme.typography.weights.semibold,
            cursor: 'pointer'
          }}>
            📢 Publish immediately (make visible to public)
          </label>
        </div>

        <div style={{
          display: 'flex',
          gap: theme.spacing.sm,
          justifyContent: 'flex-end'
        }}>
          <button
            style={secondaryButtonStyle}
            onClick={cancelForm}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            style={{
              ...buttonStyle,
              opacity: (submitting || !formData.title.trim() || !formData.content.trim()) ? 0.6 : 1
            }}
            onClick={handleSubmit}
            disabled={submitting || !formData.title.trim() || !formData.content.trim()}
          >
            {submitting ? '⏳ Saving...' : (editingPost ? '💾 Update Post' : '✨ Create Post')}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Delete Confirmation Modal */}
      {renderDeleteConfirmation()}
      
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.lg
        }}>
          <h2 style={{
            fontSize: theme.typography.sizes['2xl'],
            color: theme.colors.primary,
            margin: 0
          }}>
            📝 Blog Post Management
          </h2>
          {!showCreateForm && (
            <button
              style={buttonStyle}
              onClick={() => setShowCreateForm(true)}
            >
              ➕ New Post
            </button>
          )}
        </div>

        {/* Global Error Display */}
        {!showCreateForm && renderError()}

        {/* Filters */}
        {!showCreateForm && (
          <div style={cardStyle}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: theme.spacing.md,
              alignItems: 'end'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: theme.spacing.xs,
                  fontWeight: theme.typography.weights.semibold,
                  color: theme.colors.text
                }}>
                  🔍 Search Posts
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or content..."
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: theme.spacing.xs,
                  fontWeight: theme.typography.weights.semibold,
                  color: theme.colors.text
                }}>
                  📊 Filter by Status
                </label>
                <select
                  style={inputStyle}
                  value={filterPublished}
                  onChange={(e) => setFilterPublished(e.target.value as any)}
                >
                  <option value="all">All Posts</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Drafts Only</option>
                </select>
              </div>

              <button
                style={secondaryButtonStyle}
                onClick={clearFilters}
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && renderPostForm()}

        {/* Posts List */}
        {!showCreateForm && (
          <>
            {loading ? (
              <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>⏳</div>
                <p>Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div style={{
                ...cardStyle,
                textAlign: 'center',
                padding: theme.spacing.xl
              }}>
                <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📝</div>
                <h3 style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
                  No posts found
                </h3>
                <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
                  {searchTerm || filterPublished !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'Create your first blog post to get started!'}
                </p>
                <button
                  style={buttonStyle}
                  onClick={() => setShowCreateForm(true)}
                >
                  ➕ Create First Post
                </button>
              </div>
            ) : (
              <div>
                {posts.map((post) => (
                  <div key={post.id} style={cardStyle}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: theme.spacing.md,
                      alignItems: 'start'
                    }}>
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: theme.spacing.sm,
                          marginBottom: theme.spacing.sm
                        }}>
                          <h3 style={{
                            margin: 0,
                            color: theme.colors.text,
                            fontSize: theme.typography.sizes.lg
                          }}>
                            {post.title}
                          </h3>
                          <span style={{
                            fontSize: theme.typography.sizes.xs,
                            padding: `2px 8px`,
                            borderRadius: '12px',
                            backgroundColor: post.published ? '#22c55e' : '#f59e0b',
                            color: 'white',
                            fontWeight: theme.typography.weights.semibold
                          }}>
                            {post.published ? '✅ Published' : '📄 Draft'}
                          </span>
                        </div>

                        {post.excerpt && (
                          <p style={{
                            color: theme.colors.textSecondary,
                            marginBottom: theme.spacing.sm,
                            lineHeight: 1.5
                          }}>
                            {post.excerpt}
                          </p>
                        )}

                        <div style={{
                          fontSize: theme.typography.sizes.xs,
                          color: theme.colors.textSecondary,
                          display: 'flex',
                          gap: theme.spacing.md,
                          flexWrap: 'wrap'
                        }}>
                          <span>👁️ {post.views || 0} views</span>
                          <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                          <span>👤 {post.author?.name || post.author?.email}</span>
                          {post.publishedAt && (
                            <span>📢 Published {new Date(post.publishedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        gap: theme.spacing.xs,
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          style={{
                            ...secondaryButtonStyle,
                            padding: `4px 8px`,
                            fontSize: theme.typography.sizes.xs
                          }}
                          onClick={() => startEdit(post)}
                          title="Edit post"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          style={{
                            ...secondaryButtonStyle,
                            padding: `4px 8px`,
                            fontSize: theme.typography.sizes.xs,
                            backgroundColor: post.published ? '#f59e0b' : '#22c55e',
                            color: 'white'
                          }}
                          onClick={() => handleTogglePublish(post)}
                          title={post.published ? 'Unpublish post' : 'Publish post'}
                        >
                          {post.published ? '📤 Unpublish' : '📢 Publish'}
                        </button>

                        <button
                          style={{
                            ...secondaryButtonStyle,
                            padding: `4px 8px`,
                            fontSize: theme.typography.sizes.xs,
                            backgroundColor: '#ef4444',
                            color: 'white'
                          }}
                          onClick={() => handleDelete(post.id)}
                          title="Delete post permanently"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    marginTop: theme.spacing.lg
                  }}>
                    <button
                      style={{
                        ...secondaryButtonStyle,
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        opacity: currentPage === 1 ? 0.5 : 1
                      }}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>

                    <span style={{
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.sizes.sm,
                      padding: `0 ${theme.spacing.md}`
                    }}>
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      style={{
                        ...secondaryButtonStyle,
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        opacity: currentPage === totalPages ? 0.5 : 1
                      }}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}

                {/* Results summary */}
                <div style={{
                  textAlign: 'center',
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.sm,
                  marginTop: theme.spacing.lg,
                  padding: theme.spacing.md
                }}>
                  📊 Showing {posts.length} posts {totalPages > 1 ? `(page ${currentPage} of ${totalPages})` : ''}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
/**
 * PAST SHOW MANAGEMENT COMPONENT - WITH THUMBNAIL FIELD (STEP 3)
 * 
 * This version includes the thumbnail URL field for custom thumbnails
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { showsApi } from '../../utils/apiService'; // Using showsApi

// PastShow types matching your backend (integer IDs)
interface PastShow {
  id: number; // Note: Your backend uses integer IDs for shows
  title: string;
  speakerName: string;
  date: string;
  year: number;
  description?: string;
  videoId?: string;
  thumbnailUrl?: string; // ← ADDED: Thumbnail URL field
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  comments?: any[];
}

interface PastShowFormData {
  title: string;
  speakerName: string;
  date: string;
  description: string;
  videoId: string;
  thumbnailUrl: string; // ← ADDED: Thumbnail URL field
}

interface PastShowManagementProps {
  onShowUpdate?: () => void;
}

const initialFormData: PastShowFormData = {
  title: '',
  speakerName: '',
  date: '',
  description: '',
  videoId: '',
  thumbnailUrl: '' // ← ADDED: Empty thumbnail field
};

export const PastShowManagement: React.FC<PastShowManagementProps> = ({ onShowUpdate }) => {
  const theme = useTheme();
  const [shows, setShows] = useState<PastShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingShow, setEditingShow] = useState<PastShow | null>(null);
  const [formData, setFormData] = useState<PastShowFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Styles
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
    fontFamily: 'inherit'
  };

  // Load past shows from real backend API
  const loadPastShows = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📹 Loading past shows from backend...');
      
      const response = await showsApi.getAll();
      console.log('✅ Shows loaded:', response);

      // Handle response format - your showsApi returns { success: boolean, data: [] }
      let showsData: PastShow[] = [];
      
      if (response && typeof response === 'object') {
        if ('success' in response && response.success && 'data' in response) {
          // Type assertion to ensure data is treated as PastShow array
          showsData = Array.isArray(response.data) ? response.data as PastShow[] : [];
        } else if (Array.isArray(response)) {
          showsData = response as PastShow[];
        }
      }
      
      setShows(showsData);
    } catch (error) {
      console.error('❌ Failed to load past shows:', error);
      setError(`Failed to load past shows: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPastShows();
  }, []);

  // Get unique years for filter
  const availableYears = [...new Set(shows.map(show => show.year))].sort((a, b) => b - a);

  // Filter shows
  const filteredShows = shows.filter(show => {
    const matchesSearch = searchTerm === '' ||
      show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.speakerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (show.description && show.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && show.isPublished) ||
      (filterStatus === 'draft' && !show.isPublished);

    const matchesYear = filterYear === 'all' || show.year.toString() === filterYear;

    return matchesSearch && matchesStatus && matchesYear;
  });

  // Handle form submission with real API calls
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.speakerName.trim() || !formData.date) {
      setError('Title, speaker name, and date are required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log(`🚀 ${editingShow ? 'Updating' : 'Creating'} show...`, formData);

      if (editingShow) {
        // Update existing show - convert ID to string for API
        const response = await showsApi.update(editingShow.id.toString(), formData);
        console.log('✅ Show updated successfully');
        
        // Reload shows to get fresh data
        loadPastShows();
        setEditingShow(null);
      } else {
        // Create new show
        const response = await showsApi.create(formData);
        console.log('✅ Show created successfully');
        
        // Reload shows to get fresh data
        loadPastShows();
      }

      setShowCreateForm(false);
      setFormData(initialFormData);
      onShowUpdate?.();
    } catch (error) {
      console.error('❌ Failed to save show:', error);
      setError(`Failed to save show: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete with real API call
  const handleDelete = (showId: number) => setShowDeleteConfirm(showId);

  const confirmDelete = async (showId: number) => {
    try {
      console.log('🗑️ Deleting show:', showId);
      await showsApi.delete(showId.toString()); // Convert to string for API
      
      // Reload shows to get fresh data
      loadPastShows();
      onShowUpdate?.();
      console.log('✅ Show deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete show:', error);
      setError(`Failed to delete show: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  // Toggle status with real API call
  const handleToggleStatus = async (show: PastShow, field: 'isPublished') => {
    try {
      console.log(`🔄 Toggling ${field} for show:`, show.id);
      
      const updateData = { ...show, [field]: !show[field] };
      delete updateData.comments; // Remove comments from update data
      
      // Convert ID to string for API
      const response = await showsApi.update(show.id.toString(), updateData);
      
      // Reload shows to get fresh data
      loadPastShows();
      onShowUpdate?.();
      console.log(`✅ ${field} toggled successfully`);
    } catch (error) {
      console.error(`❌ Failed to toggle ${field}:`, error);
      setError(`Failed to update show: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Start editing
  const startEdit = (show: PastShow) => {
    setEditingShow(show);
    setFormData({
      title: show.title,
      speakerName: show.speakerName,
      date: show.date.split('T')[0], // Extract date part for input field
      description: show.description || '',
      videoId: show.videoId || '',
      thumbnailUrl: show.thumbnailUrl || '' // ← ADDED: Include thumbnail in edit
    });
    setShowCreateForm(true);
    setError(null);
  };

  // Cancel form
  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingShow(null);
    setFormData(initialFormData);
    setError(null);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterYear('all');
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : url;
  };

  // Handle video URL change
  const handleVideoUrlChange = (value: string) => {
    const videoId = extractYouTubeId(value);
    setFormData({ ...formData, videoId });
  };

  // Render error
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

  // Render delete confirmation
  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;
    const showToDelete = shows.find(s => s.id === showDeleteConfirm);

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
            🗑️ Delete Past Show
          </h3>
          <p style={{
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
            lineHeight: 1.5
          }}>
            Are you sure you want to delete <strong>"{showToDelete?.title}"</strong>?
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
            <button style={secondaryButtonStyle} onClick={() => setShowDeleteConfirm(null)}>
              Cancel
            </button>
            <button
              style={{ ...buttonStyle, backgroundColor: '#dc2626' }}
              onClick={() => confirmDelete(showDeleteConfirm)}
            >
              🗑️ Delete Show
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 🔥 UPDATED: Render form with thumbnail field
  const renderShowForm = () => (
    <div style={cardStyle}>
      <h3 style={{
        color: theme.colors.primary,
        marginBottom: theme.spacing.lg,
        fontSize: theme.typography.sizes.xl
      }}>
        {editingShow ? '✏️ Edit Past Show' : '➕ Add New Past Show'}
      </h3>

      {renderError()}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md
      }}>
        <div>
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
            placeholder="Presentation title"
            disabled={submitting}
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            Speaker *
          </label>
          <input
            type="text"
            style={inputStyle}
            value={formData.speakerName}
            onChange={(e) => setFormData({ ...formData, speakerName: e.target.value })}
            placeholder="Speaker's name"
            disabled={submitting}
          />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            Date *
          </label>
          <input
            type="date"
            style={inputStyle}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            disabled={submitting}
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            Custom Thumbnail URL
          </label>
          <input
            type="url"
            style={inputStyle}
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            placeholder="https://example.com/thumbnail.jpg (optional)"
            disabled={submitting}
          />
          <div style={{
            fontSize: theme.typography.sizes.xs,
            color: theme.colors.textSecondary
          }}>
            💡 Leave empty to auto-generate from YouTube video
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            YouTube Video URL
          </label>
          <input
            type="url"
            style={inputStyle}
            value={formData.videoId}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            disabled={submitting}
          />
          <div style={{
            fontSize: theme.typography.sizes.xs,
            color: theme.colors.textSecondary
          }}>
            💡 Paste full YouTube URL - we'll extract the video ID automatically
          </div>
        </div>
      </div>

      <div style={{ marginBottom: theme.spacing.md }}>
        <label style={{
          display: 'block',
          marginBottom: theme.spacing.xs,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.text
        }}>
          Description
        </label>
        <textarea
          style={textareaStyle}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description of the presentation..."
          disabled={submitting}
        />
      </div>

      <div style={{
        display: 'flex',
        gap: theme.spacing.sm,
        justifyContent: 'flex-end'
      }}>
        <button style={secondaryButtonStyle} onClick={cancelForm} disabled={submitting}>
          Cancel
        </button>
        <button
          style={{
            ...buttonStyle,
            opacity: (submitting || !formData.title.trim() || !formData.speakerName.trim() || !formData.date) ? 0.6 : 1
          }}
          onClick={handleSubmit}
          disabled={submitting || !formData.title.trim() || !formData.speakerName.trim() || !formData.date}
        >
          {submitting ? '⏳ Saving...' : (editingShow ? '💾 Update Show' : '✨ Add Show')}
        </button>
      </div>
    </div>
  );

  return (
    <>
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
            📹 Past Shows Management
          </h2>
          {!showCreateForm && (
            <button style={buttonStyle} onClick={() => setShowCreateForm(true)}>
              ➕ Add Show
            </button>
          )}
        </div>

        {!showCreateForm && renderError()}

        {!showCreateForm && (
          <div style={cardStyle}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto auto',
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
                  🔍 Search Shows
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, speaker..."
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: theme.spacing.xs,
                  fontWeight: theme.typography.weights.semibold,
                  color: theme.colors.text
                }}>
                  📊 Status
                </label>
                <select
                  style={inputStyle}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">All Shows</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: theme.spacing.xs,
                  fontWeight: theme.typography.weights.semibold,
                  color: theme.colors.text
                }}>
                  📅 Year
                </label>
                <select
                  style={inputStyle}
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <option value="all">All Years</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button style={secondaryButtonStyle} onClick={clearFilters}>
                🗑️ Clear
              </button>
            </div>
          </div>
        )}

        {showCreateForm && renderShowForm()}

        {!showCreateForm && (
          <>
            {loading ? (
              <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>⏳</div>
                <p>Loading past shows from backend...</p>
              </div>
            ) : filteredShows.length === 0 ? (
              <div style={{
                ...cardStyle,
                textAlign: 'center',
                padding: theme.spacing.xl
              }}>
                <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📹</div>
                <h3 style={{
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.sm
                }}>
                  No past shows found
                </h3>
                <p style={{
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.lg
                }}>
                  {searchTerm || filterStatus !== 'all' || filterYear !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'Add your first past show to get started!'}
                </p>
                <button style={buttonStyle} onClick={() => setShowCreateForm(true)}>
                  ➕ Add First Show
                </button>
              </div>
            ) : (
              <div>
                {filteredShows.map((show) => (
                  <div key={show.id} style={cardStyle}>
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
                          marginBottom: theme.spacing.xs
                        }}>
                          <h3 style={{
                            margin: 0,
                            color: theme.colors.text,
                            fontSize: theme.typography.sizes.lg
                          }}>
                            {show.title}
                          </h3>
                          <span style={{
                            fontSize: theme.typography.sizes.xs,
                            padding: '2px 6px',
                            borderRadius: '10px',
                            backgroundColor: show.isPublished ? '#22c55e' : '#6b7280',
                            color: 'white',
                            fontWeight: theme.typography.weights.semibold
                          }}>
                            {show.isPublished ? '📢 Published' : '📄 Draft'}
                          </span>
                        </div>

                        <p style={{
                          color: theme.colors.primary,
                          fontSize: theme.typography.sizes.sm,
                          fontWeight: theme.typography.weights.semibold,
                          marginBottom: theme.spacing.sm
                        }}>
                          🎤 {show.speakerName}
                        </p>

                        {show.description && (
                          <p style={{
                            color: theme.colors.textSecondary,
                            marginBottom: theme.spacing.sm,
                            lineHeight: 1.5
                          }}>
                            {show.description.length > 150
                              ? `${show.description.substring(0, 150)}...`
                              : show.description}
                          </p>
                        )}

                        <div style={{
                          display: 'flex',
                          gap: theme.spacing.md,
                          fontSize: theme.typography.sizes.sm,
                          color: theme.colors.textSecondary,
                          marginBottom: theme.spacing.sm
                        }}>
                          <span>📅 {new Date(show.date).toLocaleDateString()}</span>
                          <span>📆 {show.year}</span>
                        </div>

                        <div style={{
                          display: 'flex',
                          gap: theme.spacing.sm,
                          flexWrap: 'wrap',
                          fontSize: theme.typography.sizes.xs
                        }}>
                          {show.videoId && (
                            <a
                              href={`https://www.youtube.com/watch?v=${show.videoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: theme.colors.primary,
                                textDecoration: 'none',
                                padding: '2px 6px',
                                backgroundColor: theme.colors.surface,
                                borderRadius: '4px',
                                border: `1px solid ${theme.colors.border}`
                              }}
                            >
                              📺 Watch Video
                            </a>
                          )}
                          {show.thumbnailUrl && (
                            <a
                              href={show.thumbnailUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: theme.colors.secondary,
                                textDecoration: 'none',
                                padding: '2px 6px',
                                backgroundColor: theme.colors.surface,
                                borderRadius: '4px',
                                border: `1px solid ${theme.colors.border}`
                              }}
                            >
                              🖼️ Custom Thumbnail
                            </a>
                          )}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: theme.spacing.xs
                      }}>
                        <button
                          style={{
                            ...secondaryButtonStyle,
                            padding: '4px 8px',
                            fontSize: theme.typography.sizes.xs
                          }}
                          onClick={() => startEdit(show)}
                          title="Edit show"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          style={{
                            ...secondaryButtonStyle,
                            padding: '4px 8px',
                            fontSize: theme.typography.sizes.xs,
                            backgroundColor: show.isPublished ? '#f59e0b' : '#22c55e',
                            color: 'white'
                          }}
                          onClick={() => handleToggleStatus(show, 'isPublished')}
                          title={show.isPublished ? 'Unpublish show' : 'Publish show'}
                        >
                          {show.isPublished ? '📤 Unpublish' : '📢 Publish'}
                        </button>
                        <button
                          style={{
                            ...secondaryButtonStyle,
                            padding: '4px 8px',
                            fontSize: theme.typography.sizes.xs,
                            backgroundColor: '#ef4444',
                            color: 'white'
                          }}
                          onClick={() => handleDelete(show.id)}
                          title="Delete show permanently"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{
                  textAlign: 'center',
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.sm,
                  marginTop: theme.spacing.lg,
                  padding: theme.spacing.md
                }}>
                  📹 Showing {filteredShows.length} of {shows.length} past shows
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
/**
 * PAST SHOW MANAGEMENT COMPONENT - FIXED SEMICOLONS
 * 
 * Save this file as: src/components/admin/PastShowManagement.tsx
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { adminApi } from '../../utils/apiService';

interface PastShow {
  id: string;
  title: string;
  speakerName: string;
  date: string;
  year: number;
  description: string;
  videoId?: string;
  thumbnailUrl?: string;
  duration: number;
  topic: string;
  views?: number;
  downloadUrl?: string;
  speakerBio?: string;
  speakerCompany?: string;
  featured?: boolean;
  tags: string[];
  isPublished: boolean;
  videoStatus: 'available' | 'processing' | 'coming_soon';
  createdAt: string;
  updatedAt: string;
}

interface PastShowFormData {
  title: string;
  speakerName: string;
  date: string;
  description: string;
  videoId: string;
  thumbnailUrl: string;
  duration: number;
  topic: string;
  downloadUrl: string;
  speakerBio: string;
  speakerCompany: string;
  featured: boolean;
  tags: string;
  isPublished: boolean;
  videoStatus: 'available' | 'processing' | 'coming_soon';
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
  thumbnailUrl: '',
  duration: 45,
  topic: '',
  downloadUrl: '',
  speakerBio: '',
  speakerCompany: '',
  featured: false,
  tags: '',
  isPublished: true,
  videoStatus: 'coming_soon'
};

const topics = [
  'Technology', 'Navigation', 'Safety', 'History', 'Environment', 
  'Business', 'Innovation', 'Racing', 'Weather', 'Maritime Law'
];

export const PastShowManagement: React.FC<PastShowManagementProps> = ({ onShowUpdate }) => {
  const theme = useTheme();
  const [shows, setShows] = useState<PastShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingShow, setEditingShow] = useState<PastShow | null>(null);
  const [formData, setFormData] = useState<PastShowFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'featured' | 'video_ready'>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
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

  // Load past shows
  const loadPastShows = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockShows: PastShow[] = [
        {
          id: '1',
          title: 'The Future of Autonomous Shipping',
          speakerName: 'Captain Sarah Johnson',
          date: '2024-03-13',
          year: 2024,
          description: 'Exploring the latest developments in autonomous vessel technology and their impact on maritime safety and efficiency.',
          videoId: 'dQw4w9WgXcQ',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
          duration: 45,
          topic: 'Technology',
          views: 1247,
          downloadUrl: '/presentations/autonomous-shipping-2024.pdf',
          speakerBio: 'Captain Johnson is a maritime technology expert with 20 years of experience.',
          speakerCompany: 'Maritime Innovation Institute',
          featured: true,
          tags: ['Autonomous Vessels', 'AI', 'Innovation'],
          isPublished: true,
          videoStatus: 'available',
          createdAt: '2024-03-13T10:00:00Z',
          updatedAt: '2024-03-13T10:00:00Z'
        },
        {
          id: '2',
          title: 'Sustainable Maritime Practices',
          speakerName: 'Dr. Michael Chen',
          date: '2024-03-06',
          year: 2024,
          description: 'How the shipping industry is adopting environmentally friendly technologies.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          duration: 38,
          topic: 'Environment',
          views: 892,
          speakerBio: 'Dr. Chen is an environmental engineer specializing in maritime sustainability.',
          speakerCompany: 'Green Marine Solutions',
          featured: false,
          tags: ['Sustainability', 'Environment', 'Green Technology'],
          isPublished: true,
          videoStatus: 'processing',
          createdAt: '2024-03-06T10:00:00Z',
          updatedAt: '2024-03-06T10:00:00Z'
        },
        {
          id: '3',
          title: 'Advanced Weather Routing Techniques',
          speakerName: 'Captain Emma Rodriguez',
          date: '2024-02-28',
          year: 2024,
          description: 'Presentation coming soon - video is currently being edited.',
          thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          duration: 42,
          topic: 'Weather',
          speakerBio: 'Captain Rodriguez specializes in meteorological navigation.',
          speakerCompany: 'Pacific Weather Systems',
          featured: false,
          tags: ['Weather', 'Navigation', 'Safety'],
          isPublished: false,
          videoStatus: 'coming_soon',
          createdAt: '2024-02-28T10:00:00Z',
          updatedAt: '2024-02-28T10:00:00Z'
        }
      ];

      setShows(mockShows);
    } catch (error) {
      console.error('Failed to load past shows:', error);
      setError('Failed to load past shows. Please try again.');
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
      show.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && show.isPublished) ||
      (filterStatus === 'draft' && !show.isPublished) ||
      (filterStatus === 'featured' && show.featured) ||
      (filterStatus === 'video_ready' && show.videoStatus === 'available');
    
    const matchesYear = filterYear === 'all' || show.year.toString() === filterYear;
    
    return matchesSearch && matchesStatus && matchesYear;
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.speakerName.trim() || !formData.date) {
      setError('Title, speaker name, and date are required');
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const showData: PastShow = {
        id: editingShow?.id || Date.now().toString(),
        ...formData,
        year: new Date(formData.date).getFullYear(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        views: editingShow?.views || 0,
        createdAt: editingShow?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingShow) {
        setShows(prevShows => 
          prevShows.map(show => 
            show.id === editingShow.id ? showData : show
          )
        );
      } else {
        setShows(prevShows => [showData, ...prevShows]);
      }

      setShowCreateForm(false);
      setEditingShow(null);
      setFormData(initialFormData);
      onShowUpdate?.();
    } catch (error) {
      console.error('Failed to save past show:', error);
      setError('Failed to save past show. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = (showId: string) => setShowDeleteConfirm(showId);

  const confirmDelete = (showId: string) => {
    setShows(prevShows => prevShows.filter(show => show.id !== showId));
    setShowDeleteConfirm(null);
    onShowUpdate?.();
  };

  // Toggle status
  const handleToggleStatus = (show: PastShow, field: 'isPublished' | 'featured') => {
    setShows(prevShows =>
      prevShows.map(s =>
        s.id === show.id
          ? { ...s, [field]: !s[field], updatedAt: new Date().toISOString() }
          : s
      )
    );
    onShowUpdate?.();
  };

  // Start editing
  const startEdit = (show: PastShow) => {
    setEditingShow(show);
    setFormData({
      title: show.title,
      speakerName: show.speakerName,
      date: show.date,
      description: show.description,
      videoId: show.videoId || '',
      thumbnailUrl: show.thumbnailUrl || '',
      duration: show.duration,
      topic: show.topic,
      downloadUrl: show.downloadUrl || '',
      speakerBio: show.speakerBio || '',
      speakerCompany: show.speakerCompany || '',
      featured: show.featured || false,
      tags: show.tags.join(', '),
      isPublished: show.isPublished,
      videoStatus: show.videoStatus
    });
    setShowCreateForm(true);
    setError(null);
  };

  // Create from speaker template
  const createFromSpeaker = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      ...initialFormData,
      date: today,
      videoStatus: 'coming_soon',
      description: 'Video coming soon - currently being edited and processed.',
      isPublished: false
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

  // Get status badge style
  const getStatusBadgeStyle = (status: string) => {
    const baseStyle = {
      fontSize: theme.typography.sizes.xs,
      padding: '2px 8px',
      borderRadius: '12px',
      fontWeight: theme.typography.weights.semibold
    };

    switch (status) {
      case 'available':
        return { ...baseStyle, backgroundColor: '#22c55e', color: 'white' };
      case 'processing':
        return { ...baseStyle, backgroundColor: '#f59e0b', color: 'white' };
      case 'coming_soon':
        return { ...baseStyle, backgroundColor: '#6b7280', color: 'white' };
      default:
        return baseStyle;
    }
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

  // Render form
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
        gridTemplateColumns: '1fr 1fr 1fr',
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
            Topic
          </label>
          <select
            style={inputStyle}
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            disabled={submitting}
          >
            <option value="">Select topic</option>
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            Duration (min)
          </label>
          <input
            type="number"
            style={inputStyle}
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
            placeholder="45"
            disabled={submitting}
          />
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
        <div>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            Thumbnail URL
          </label>
          <input
            type="url"
            style={inputStyle}
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            placeholder="https://example.com/thumbnail.jpg"
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
            Speaker Company
          </label>
          <input
            type="text"
            style={inputStyle}
            value={formData.speakerCompany}
            onChange={(e) => setFormData({ ...formData, speakerCompany: e.target.value })}
            placeholder="Company or organization"
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
            Download URL
          </label>
          <input
            type="url"
            style={inputStyle}
            value={formData.downloadUrl}
            onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
            placeholder="Link to presentation PDF"
            disabled={submitting}
          />
        </div>
      </div>

      <div style={{ marginBottom: theme.spacing.md }}>
        <label style={{
          display: 'block',
          marginBottom: theme.spacing.xs,
          fontWeight: theme.typography.weights.semibold,
          color: theme.colors.text
        }}>
          Speaker Bio
        </label>
        <textarea
          style={{ ...textareaStyle, minHeight: '80px' }}
          value={formData.speakerBio}
          onChange={(e) => setFormData({ ...formData, speakerBio: e.target.value })}
          placeholder="Brief biography of the speaker..."
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
          Tags
        </label>
        <input
          type="text"
          style={inputStyle}
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="Technology, Innovation, AI (comma separated)"
          disabled={submitting}
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: '8px',
        border: `1px solid ${theme.colors.border}`
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text
          }}>
            Video Status
          </label>
          <select
            style={inputStyle}
            value={formData.videoStatus}
            onChange={(e) => setFormData({ 
              ...formData, 
              videoStatus: e.target.value as 'available' | 'processing' | 'coming_soon' 
            })}
            disabled={submitting}
          >
            <option value="coming_soon">🎬 Coming Soon</option>
            <option value="processing">⏳ Processing</option>
            <option value="available">✅ Available</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="published"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            style={{ marginRight: theme.spacing.sm }}
            disabled={submitting}
          />
          <label htmlFor="published" style={{
            color: theme.colors.text,
            fontWeight: theme.typography.weights.semibold,
            cursor: 'pointer'
          }}>
            📢 Published
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            style={{ marginRight: theme.spacing.sm }}
            disabled={submitting}
          />
          <label htmlFor="featured" style={{
            color: theme.colors.text,
            fontWeight: theme.typography.weights.semibold,
            cursor: 'pointer'
          }}>
            ⭐ Featured
          </label>
        </div>
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
            <div style={{ display: 'flex', gap: theme.spacing.sm }}>
              <button
                style={{
                  ...secondaryButtonStyle,
                  backgroundColor: theme.colors.secondary,
                  color: '#ffffff'
                }}
                onClick={createFromSpeaker}
              >
                🎤 From Speaker
              </button>
              <button style={buttonStyle} onClick={() => setShowCreateForm(true)}>
                ➕ Add Show
              </button>
            </div>
          )}
        </div>

        {!showCreateForm && renderError()}

        {!showCreateForm && (
          <div style={cardStyle}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto auto auto',
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
                  placeholder="Search by title, speaker, or topic..."
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
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft' | 'featured' | 'video_ready')}
                >
                  <option value="all">All Shows</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                  <option value="featured">Featured</option>
                  <option value="video_ready">Video Ready</option>
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
                <p>Loading past shows...</p>
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
                <div style={{
                  display: 'flex',
                  gap: theme.spacing.sm,
                  justifyContent: 'center'
                }}>
                  <button
                    style={{
                      ...secondaryButtonStyle,
                      backgroundColor: theme.colors.secondary,
                      color: '#ffffff'
                    }}
                    onClick={createFromSpeaker}
                  >
                    🎤 From Speaker
                  </button>
                  <button style={buttonStyle} onClick={() => setShowCreateForm(true)}>
                    ➕ Add First Show
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {filteredShows.map((show) => (
                  <div key={show.id} style={cardStyle}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: theme.spacing.md,
                      alignItems: 'start'
                    }}>
                      <div style={{
                        width: '120px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: theme.colors.surface,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${theme.colors.border}`
                      }}>
                        {show.thumbnailUrl ? (
                          <img
                            src={show.thumbnailUrl}
                            alt={show.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <span style={{
                            fontSize: '2rem',
                            color: theme.colors.textSecondary
                          }}>
                            🎬
                          </span>
                        )}
                      </div>

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
                          {show.featured && (
                            <span style={{
                              fontSize: theme.typography.sizes.xs,
                              padding: '2px 6px',
                              borderRadius: '10px',
                              backgroundColor: '#f59e0b',
                              color: 'white',
                              fontWeight: theme.typography.weights.semibold
                            }}>
                              ⭐ Featured
                            </span>
                          )}
                          <span style={getStatusBadgeStyle(show.videoStatus)}>
                            {show.videoStatus === 'available' ? '✅ Available' : 
                             show.videoStatus === 'processing' ? '⏳ Processing' : 
                             '🎬 Coming Soon'}
                          </span>
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
                          🎤 {show.speakerName} {show.speakerCompany && `• ${show.speakerCompany}`}
                        </p>
                        
                        <p style={{
                          color: theme.colors.textSecondary,
                          marginBottom: theme.spacing.sm,
                          lineHeight: 1.5
                        }}>
                          {show.description.length > 150
                            ? `${show.description.substring(0, 150)}...`
                            : show.description}
                        </p>

                        <div style={{
                          display: 'flex',
                          gap: theme.spacing.md,
                          fontSize: theme.typography.sizes.sm,
                          color: theme.colors.textSecondary,
                          marginBottom: theme.spacing.sm
                        }}>
                          <span>📅 {new Date(show.date).toLocaleDateString()}</span>
                          <span>🏷️ {show.topic}</span>
                          <span>⏱️ {show.duration} min</span>
                          {show.views !== undefined && <span>👁️ {show.views} views</span>}
                        </div>

                        {show.tags.length > 0 && (
                          <div style={{
                            display: 'flex',
                            gap: theme.spacing.xs,
                            flexWrap: 'wrap',
                            marginBottom: theme.spacing.sm
                          }}>
                            {show.tags.map((tag, index) => (
                              <span
                                key={index}
                                style={{
                                  fontSize: theme.typography.sizes.xs,
                                  padding: '2px 6px',
                                  backgroundColor: theme.colors.surface,
                                  borderRadius: '12px',
                                  border: `1px solid ${theme.colors.border}`,
                                  color: theme.colors.textSecondary
                                }}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

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
                          {show.downloadUrl && (
                            <a
                              href={show.downloadUrl}
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
                              📄 Download
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
                            backgroundColor: show.featured ? '#6b7280' : '#f59e0b',
                            color: 'white'
                          }}
                          onClick={() => handleToggleStatus(show, 'featured')}
                          title={show.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          {show.featured ? '⭐ Unfeature' : '⭐ Feature'}
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
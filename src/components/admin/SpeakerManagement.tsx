/**
 * SPEAKER MANAGEMENT COMPONENT - REAL API INTEGRATION
 * 
 * Save this file as: src/components/admin/SpeakerManagement.tsx
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { speakersApi } from '../../utils/apiService'; // ← Using real API

// Speaker types (matching your database schema)
interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  nextPresentationDate?: string;
  topic?: string;
  presentationTitle?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SpeakerFormData {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  email: string;
  website: string;
  linkedin: string;
  twitter: string;
  nextPresentationDate: string;
  topic: string;
  presentationTitle: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface SpeakerManagementProps {
  onSpeakerUpdate?: () => void;
}

const initialFormData: SpeakerFormData = {
  name: '',
  title: '',
  bio: '',
  photoUrl: '',
  email: '',
  website: '',
  linkedin: '',
  twitter: '',
  nextPresentationDate: '',
  topic: '',
  presentationTitle: '',
  isActive: true,
  isFeatured: false
};

export const SpeakerManagement: React.FC<SpeakerManagementProps> = ({ onSpeakerUpdate }) => {
  const theme = useTheme();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [formData, setFormData] = useState<SpeakerFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');
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
    fontFamily: 'inherit'
  };

  // 🔥 FIXED: Load speakers from real backend API
  const loadSpeakers = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🎤 Loading speakers from backend...');
      
      const response = await speakersApi.getAll();
      console.log('✅ Speakers loaded:', response);

      // Handle response format - similar to shows API
      let speakersData: Speaker[] = [];
      
      if (response && typeof response === 'object') {
        if ('success' in response && response.success && 'data' in response) {
          speakersData = Array.isArray(response.data) ? response.data as Speaker[] : [];
        } else if (Array.isArray(response)) {
          speakersData = response as Speaker[];
        }
      }
      
      setSpeakers(speakersData);
    } catch (error) {
      console.error('❌ Failed to load speakers:', error);
      setError(`Failed to load speakers: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback to empty array instead of mock data
      setSpeakers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpeakers();
  }, []);

  // Filter speakers
  const filteredSpeakers = speakers.filter(speaker => {
    const matchesSearch = searchTerm === '' || 
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && speaker.isActive) ||
      (filterStatus === 'inactive' && !speaker.isActive) ||
      (filterStatus === 'featured' && speaker.isFeatured);
    
    return matchesSearch && matchesFilter;
  });

  // 🔥 FIXED: Handle form submission with real API calls
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.title.trim() || !formData.bio.trim()) {
      setError('Name, title, and bio are required');
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      console.log(`🚀 ${editingSpeaker ? 'Updating' : 'Creating'} speaker...`, formData);

      if (editingSpeaker) {
        // Update existing speaker
        const response = await speakersApi.update(editingSpeaker.id, formData);
        console.log('✅ Speaker updated successfully');
        
        // Reload speakers to get fresh data
        loadSpeakers();
        setEditingSpeaker(null);
      } else {
        // Create new speaker
        const response = await speakersApi.create(formData);
        console.log('✅ Speaker created successfully');
        
        // Reload speakers to get fresh data
        loadSpeakers();
      }

      setShowCreateForm(false);
      setFormData(initialFormData);
      onSpeakerUpdate?.();
    } catch (error) {
      console.error('❌ Failed to save speaker:', error);
      setError(`Failed to save speaker: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  // 🔥 FIXED: Handle delete with real API call
  const handleDelete = (speakerId: string) => setShowDeleteConfirm(speakerId);

  const confirmDelete = async (speakerId: string) => {
    try {
      console.log('🗑️ Deleting speaker:', speakerId);
      await speakersApi.delete(speakerId);
      
      // Reload speakers to get fresh data
      loadSpeakers();
      onSpeakerUpdate?.();
      console.log('✅ Speaker deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete speaker:', error);
      setError(`Failed to delete speaker: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  // 🔥 FIXED: Toggle status with real API call
  const handleToggleStatus = async (speaker: Speaker, field: 'isActive' | 'isFeatured') => {
    try {
      console.log(`🔄 Toggling ${field} for speaker:`, speaker.id);
      
      const updateData = { ...speaker, [field]: !speaker[field] };
      
      const response = await speakersApi.update(speaker.id, updateData);
      
      // Reload speakers to get fresh data
      loadSpeakers();
      onSpeakerUpdate?.();
      console.log(`✅ ${field} toggled successfully`);
    } catch (error) {
      console.error(`❌ Failed to toggle ${field}:`, error);
      setError(`Failed to update speaker: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Start editing
  const startEdit = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setFormData({
      name: speaker.name,
      title: speaker.title,
      bio: speaker.bio,
      photoUrl: speaker.photoUrl || '',
      email: speaker.email || '',
      website: speaker.website || '',
      linkedin: speaker.linkedin || '',
      twitter: speaker.twitter || '',
      nextPresentationDate: speaker.nextPresentationDate ? speaker.nextPresentationDate.split('T')[0] : '',
      topic: speaker.topic || '',
      presentationTitle: speaker.presentationTitle || '',
      isActive: speaker.isActive,
      isFeatured: speaker.isFeatured
    });
    setShowCreateForm(true);
    setError(null);
  };

  // Cancel form
  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingSpeaker(null);
    setFormData(initialFormData);
    setError(null);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
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
        <button
          style={{
            marginLeft: theme.spacing.sm,
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            fontSize: theme.typography.sizes.sm,
            cursor: 'pointer'
          }}
          onClick={loadSpeakers}
        >
          🔄 Retry
        </button>
      </div>
    );
  };

  // Render delete confirmation
  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;
    const speakerToDelete = speakers.find(s => s.id === showDeleteConfirm);
    
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000
      }}>
        <div style={{
          backgroundColor: theme.colors.background, padding: theme.spacing.xl,
          borderRadius: '12px', maxWidth: '500px', width: '90%',
          boxShadow: theme.shadows.lg, border: `1px solid ${theme.colors.border}`
        }}>
          <h3 style={{ color: '#dc2626', marginBottom: theme.spacing.md, fontSize: theme.typography.sizes.lg }}>
            🗑️ Delete Speaker
          </h3>
          <p style={{ color: theme.colors.text, marginBottom: theme.spacing.md, lineHeight: 1.5 }}>
            Are you sure you want to delete <strong>"{speakerToDelete?.name}"</strong>?
          </p>
          <p style={{ color: '#dc2626', marginBottom: theme.spacing.lg, fontSize: theme.typography.sizes.sm }}>
            ⚠️ This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end' }}>
            <button style={secondaryButtonStyle} onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
            <button style={{ ...buttonStyle, backgroundColor: '#dc2626' }} onClick={() => confirmDelete(showDeleteConfirm)}>
              🗑️ Delete Speaker
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render form
  const renderSpeakerForm = () => (
    <div style={cardStyle}>
      <h3 style={{ color: theme.colors.primary, marginBottom: theme.spacing.lg, fontSize: theme.typography.sizes.xl }}>
        {editingSpeaker ? '✏️ Edit Speaker' : '➕ Add New Speaker'}
      </h3>
      {renderError()}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>Name *</label>
          <input type="text" style={inputStyle} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Speaker's full name" disabled={submitting} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>Title *</label>
          <input type="text" style={inputStyle} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Professional title or role" disabled={submitting} />
        </div>
      </div>

      <div style={{ marginBottom: theme.spacing.md }}>
        <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>Bio *</label>
        <textarea style={textareaStyle} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Brief biography and expertise description..." disabled={submitting} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>Photo URL</label>
          <input type="url" style={inputStyle} value={formData.photoUrl} onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })} placeholder="https://example.com/photo.jpg" disabled={submitting} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>Email</label>
          <input type="email" style={inputStyle} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="speaker@example.com" disabled={submitting} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>Website</label>
          <input type="url" style={inputStyle} value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://website.com" disabled={submitting} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>LinkedIn</label>
          <input type="text" style={inputStyle} value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} placeholder="username" disabled={submitting} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>Twitter</label>
          <input type="text" style={inputStyle} value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} placeholder="@username" disabled={submitting} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>Next Presentation Date</label>
          <input type="date" style={inputStyle} value={formData.nextPresentationDate} onChange={(e) => setFormData({ ...formData, nextPresentationDate: e.target.value })} disabled={submitting} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>Topic</label>
          <input type="text" style={inputStyle} value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} placeholder="Presentation topic" disabled={submitting} />
        </div>
      </div>

      <div style={{ marginBottom: theme.spacing.md }}>
        <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>Presentation Title</label>
        <input type="text" style={inputStyle} value={formData.presentationTitle} onChange={(e) => setFormData({ ...formData, presentationTitle: e.target.value })} placeholder="Full presentation title" disabled={submitting} />
      </div>

      <div style={{ display: 'flex', gap: theme.spacing.lg, marginBottom: theme.spacing.lg, padding: theme.spacing.md, backgroundColor: theme.colors.surface, borderRadius: '8px', border: `1px solid ${theme.colors.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ marginRight: theme.spacing.sm }} disabled={submitting} />
          <label htmlFor="isActive" style={{ color: theme.colors.text, fontWeight: theme.typography.weights.semibold, cursor: 'pointer' }}>✅ Active Speaker</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} style={{ marginRight: theme.spacing.sm }} disabled={submitting} />
          <label htmlFor="isFeatured" style={{ color: theme.colors.text, fontWeight: theme.typography.weights.semibold, cursor: 'pointer' }}>⭐ Featured Speaker</label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end' }}>
        <button style={secondaryButtonStyle} onClick={cancelForm} disabled={submitting}>Cancel</button>
        <button style={{ ...buttonStyle, opacity: (submitting || !formData.name.trim() || !formData.title.trim() || !formData.bio.trim()) ? 0.6 : 1 }} onClick={handleSubmit} disabled={submitting || !formData.name.trim() || !formData.title.trim() || !formData.bio.trim()}>
          {submitting ? '⏳ Saving...' : (editingSpeaker ? '💾 Update Speaker' : '✨ Add Speaker')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {renderDeleteConfirmation()}
      
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
          <h2 style={{ fontSize: theme.typography.sizes['2xl'], color: theme.colors.primary, margin: 0 }}>🎤 Speaker Management</h2>
          {!showCreateForm && <button style={buttonStyle} onClick={() => setShowCreateForm(true)}>➕ Add Speaker</button>}
        </div>

        {!showCreateForm && renderError()}

        {!showCreateForm && (
          <div style={cardStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: theme.spacing.md, alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>🔍 Search Speakers</label>
                <input type="text" style={inputStyle} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name, title, or topic..." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: theme.spacing.xs, fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>📊 Filter by Status</label>
                <select style={inputStyle} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                  <option value="all">All Speakers</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                  <option value="featured">Featured Only</option>
                </select>
              </div>
              <button style={secondaryButtonStyle} onClick={clearFilters}>🗑️ Clear</button>
            </div>
          </div>
        )}

        {showCreateForm && renderSpeakerForm()}

        {!showCreateForm && (
          <>
            {loading ? (
              <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>⏳</div>
                <p>Loading speakers from backend...</p>
              </div>
            ) : filteredSpeakers.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: theme.spacing.xl }}>
                <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🎤</div>
                <h3 style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>No speakers found</h3>
                <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
                  {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'Add your first speaker to get started!'}
                </p>
                <button style={buttonStyle} onClick={() => setShowCreateForm(true)}>➕ Add First Speaker</button>
              </div>
            ) : (
              <div>
                {filteredSpeakers.map((speaker) => (
                  <div key={speaker.id} style={cardStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: theme.spacing.md, alignItems: 'start' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', backgroundColor: theme.colors.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${theme.colors.border}` }}>
                        {speaker.photoUrl ? (
                          <img src={speaker.photoUrl} alt={speaker.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '2rem', color: theme.colors.textSecondary }}>👤</span>
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.xs }}>
                          <h3 style={{ margin: 0, color: theme.colors.text, fontSize: theme.typography.sizes.lg }}>{speaker.name}</h3>
                          {speaker.isFeatured && (
                            <span style={{ fontSize: theme.typography.sizes.xs, padding: `2px 6px`, borderRadius: '10px', backgroundColor: '#f59e0b', color: 'white', fontWeight: theme.typography.weights.semibold }}>⭐ Featured</span>
                          )}
                          <span style={{ fontSize: theme.typography.sizes.xs, padding: `2px 6px`, borderRadius: '10px', backgroundColor: speaker.isActive ? '#22c55e' : '#6b7280', color: 'white', fontWeight: theme.typography.weights.semibold }}>
                            {speaker.isActive ? '✅ Active' : '❌ Inactive'}
                          </span>
                        </div>

                        <p style={{ color: theme.colors.primary, fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.semibold, marginBottom: theme.spacing.sm }}>{speaker.title}</p>
                        <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm, lineHeight: 1.5 }}>
                          {speaker.bio.length > 150 ? `${speaker.bio.substring(0, 150)}...` : speaker.bio}
                        </p>

                        {speaker.nextPresentationDate && (
                          <div style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.sm, borderRadius: '6px', marginBottom: theme.spacing.sm, border: `1px solid ${theme.colors.border}` }}>
                            <p style={{ margin: 0, fontSize: theme.typography.sizes.sm, color: theme.colors.text }}>
                              <strong>📅 Next Presentation:</strong> {new Date(speaker.nextPresentationDate).toLocaleDateString()}
                            </p>
                            {speaker.topic && (
                              <p style={{ margin: 0, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
                                <strong>🎯 Topic:</strong> {speaker.topic}
                              </p>
                            )}
                            {speaker.presentationTitle && (
                              <p style={{ margin: 0, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
                                <strong>📝 Title:</strong> {speaker.presentationTitle}
                              </p>
                            )}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: theme.spacing.sm, flexWrap: 'wrap', fontSize: theme.typography.sizes.xs }}>
                          {speaker.email && <a href={`mailto:${speaker.email}`} style={{ color: theme.colors.primary, textDecoration: 'none', padding: '2px 6px', backgroundColor: theme.colors.surface, borderRadius: '4px', border: `1px solid ${theme.colors.border}` }}>📧 Email</a>}
                          {speaker.website && <a href={speaker.website} target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.primary, textDecoration: 'none', padding: '2px 6px', backgroundColor: theme.colors.surface, borderRadius: '4px', border: `1px solid ${theme.colors.border}` }}>🌐 Website</a>}
                          {speaker.linkedin && <a href={`https://linkedin.com/in/${speaker.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.primary, textDecoration: 'none', padding: '2px 6px', backgroundColor: theme.colors.surface, borderRadius: '4px', border: `1px solid ${theme.colors.border}` }}>💼 LinkedIn</a>}
                          {speaker.twitter && <a href={`https://twitter.com/${speaker.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.primary, textDecoration: 'none', padding: '2px 6px', backgroundColor: theme.colors.surface, borderRadius: '4px', border: `1px solid ${theme.colors.border}` }}>🐦 Twitter</a>}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
                        <button style={{ ...secondaryButtonStyle, padding: `4px 8px`, fontSize: theme.typography.sizes.xs }} onClick={() => startEdit(speaker)} title="Edit speaker">✏️ Edit</button>
                        <button style={{ ...secondaryButtonStyle, padding: `4px 8px`, fontSize: theme.typography.sizes.xs, backgroundColor: speaker.isActive ? '#f59e0b' : '#22c55e', color: 'white' }} onClick={() => handleToggleStatus(speaker, 'isActive')} title={speaker.isActive ? 'Deactivate speaker' : 'Activate speaker'}>
                          {speaker.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                        </button>
                        <button style={{ ...secondaryButtonStyle, padding: `4px 8px`, fontSize: theme.typography.sizes.xs, backgroundColor: speaker.isFeatured ? '#6b7280' : '#f59e0b', color: 'white' }} onClick={() => handleToggleStatus(speaker, 'isFeatured')} title={speaker.isFeatured ? 'Remove from featured' : 'Add to featured'}>
                          {speaker.isFeatured ? '⭐ Unfeature' : '⭐ Feature'}
                        </button>
                        <button style={{ ...secondaryButtonStyle, padding: `4px 8px`, fontSize: theme.typography.sizes.xs, backgroundColor: '#ef4444', color: 'white' }} onClick={() => handleDelete(speaker.id)} title="Delete speaker permanently">
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ textAlign: 'center', color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm, marginTop: theme.spacing.lg, padding: theme.spacing.md }}>
                  🎤 Showing {filteredSpeakers.length} of {speakers.length} speakers
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
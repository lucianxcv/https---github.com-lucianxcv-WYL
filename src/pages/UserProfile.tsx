// Replace your existing src/pages/UserProfile.tsx with this SIMPLE version:

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../utils/useAuth';
import { profileApi } from '../utils/apiService';

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinedDate: string;
  bio?: string;
  location?: string;
  website?: string;
  preferences: {
    emailNotifications: boolean;
    weeklyDigest: boolean;
    commentReplies: boolean;
  };
  stats: {
    commentsCount: number;
    articlesRead: number;
    showsWatched: number;
    memberSince: string;
  };
}

export const UserProfile: React.FC = () => {
  const { user, isAuthenticated, updateProfile, signOut } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    emailNotifications: true,
    weeklyDigest: true,
    commentReplies: true
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/profile');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Handle URL tab parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['profile', 'settings'].includes(tab)) {
      setActiveTab(tab as 'profile' | 'settings');
    }
  }, []);

  // Load user profile data
  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load basic profile data
      const [profile, stats] = await Promise.all([
        profileApi.getUserProfile(user.id),
        profileApi.getUserStats(user.id)
      ]);

      const fullProfile: UserProfileData = {
        ...profile,
        stats
      };

      setProfileData(fullProfile);
      
      // Update form data
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        emailNotifications: profile.preferences.emailNotifications,
        weeklyDigest: profile.preferences.weeklyDigest,
        commentReplies: profile.preferences.commentReplies
      });
      
    } catch (error: any) {
      console.error('Failed to load profile data:', error);
      setError('Failed to load profile data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    setError(null);
    
    try {
      // Update profile data
      const updatedProfile = await profileApi.updateUserProfile(user.id, {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        website: formData.website
      });

      // Update preferences
      await profileApi.updateUserPreferences(user.id, {
        emailNotifications: formData.emailNotifications,
        weeklyDigest: formData.weeklyDigest,
        commentReplies: formData.commentReplies
      });

      // Update local state
      setProfileData(prev => ({
        ...prev!,
        ...updatedProfile,
        preferences: {
          emailNotifications: formData.emailNotifications,
          weeklyDigest: formData.weeklyDigest,
          commentReplies: formData.commentReplies
        }
      }));

      setIsEditing(false);
      
      // Update auth context
      updateProfile({
        name: formData.name
      });
      
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    
    try {
      await signOut();
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const handleTabChange = (newTab: 'profile' | 'settings') => {
    setActiveTab(newTab);
    const url = new URL(window.location.href);
    if (newTab === 'profile') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', newTab);
    }
    window.history.replaceState({}, '', url.toString());
  };

  // Styles
  const pageStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    minHeight: '100vh',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '120px 24px 60px 24px'
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: theme.spacing.md,
    borderRadius: '8px',
    marginBottom: theme.spacing.md,
    textAlign: 'center'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '48px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '40px',
    borderBottom: `2px solid ${theme.colors.border}`,
    paddingBottom: '0'
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: isActive ? theme.colors.primary : 'transparent',
    color: isActive ? '#ffffff' : theme.colors.textSecondary,
    border: 'none',
    borderRadius: '8px 8px 0 0',
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '-2px'
  });

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.md
  };

  const avatarPlaceholderStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primary,
    border: `4px solid ${theme.colors.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    color: '#ffffff',
    marginBottom: theme.spacing.md
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: theme.typography.sizes.base,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    marginBottom: theme.spacing.md
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: theme.typography.fontFamily
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: theme.spacing.sm
  };

  const secondaryButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: theme.colors.textSecondary,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '8px',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const checkboxStyle: React.CSSProperties = {
    width: '18px',
    height: '18px',
    marginRight: theme.spacing.sm,
    accentColor: theme.colors.primary
  };

  const statCardStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`
  };

  // Loading state
  if (loading) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: theme.spacing.md }}>👤</div>
            <p style={{ fontSize: '1.2rem', color: theme.colors.textSecondary }}>
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: theme.spacing.md }}>❌</div>
            <h2>Profile Not Found</h2>
            <p>Unable to load your profile information.</p>
            <button 
              style={buttonStyle}
              onClick={() => window.location.reload()}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <main style={containerStyle}>
        {/* Error Display */}
        {error && (
          <div style={errorStyle}>
            {error}
            <button 
              style={{ 
                marginLeft: theme.spacing.sm,
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* Header */}
        <header style={headerStyle}>
          <h1 style={titleStyle}>⚓ Your Profile</h1>
          <p style={{ 
            fontSize: theme.typography.sizes.lg, 
            color: theme.colors.textSecondary 
          }}>
            Manage your account information
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav style={tabsStyle}>
          <button
            style={tabStyle(activeTab === 'profile')}
            onClick={() => handleTabChange('profile')}
          >
            👤 Profile
          </button>
          <button
            style={tabStyle(activeTab === 'settings')}
            onClick={() => handleTabChange('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div style={cardStyle}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: theme.spacing.lg 
              }}>
                <h2 style={{ 
                  fontSize: theme.typography.sizes.xl, 
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.text,
                  margin: 0
                }}>
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    style={buttonStyle}
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div>
                    <button
                      style={buttonStyle}
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? '💾 Saving...' : '💾 Save Changes'}
                    </button>
                    <button
                      style={secondaryButtonStyle}
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: profileData.name,
                          bio: profileData.bio || '',
                          location: profileData.location || '',
                          website: profileData.website || '',
                          emailNotifications: profileData.preferences.emailNotifications,
                          weeklyDigest: profileData.preferences.weeklyDigest,
                          commentReplies: profileData.preferences.commentReplies
                        });
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr', 
                gap: theme.spacing.xl,
                alignItems: 'start'
              }}>
                {/* Avatar */}
                <div style={{ textAlign: 'center' }}>
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt={profileData.name} 
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `4px solid ${theme.colors.primary}`,
                        marginBottom: theme.spacing.md
                      }}
                    />
                  ) : (
                    <div style={avatarPlaceholderStyle}>
                      {profileData.name.charAt(0).toUpperCase() || '👤'}
                    </div>
                  )}
                </div>

                {/* Profile Form */}
                <div>
                  <div style={{ marginBottom: theme.spacing.md }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: theme.spacing.xs,
                      fontWeight: theme.typography.weights.semibold,
                      color: theme.colors.text
                    }}>
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        style={inputStyle}
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your full name"
                        required
                      />
                    ) : (
                      <p style={{ 
                        fontSize: theme.typography.sizes.lg,
                        color: theme.colors.text,
                        margin: 0
                      }}>
                        {profileData.name}
                      </p>
                    )}
                  </div>

                  <div style={{ marginBottom: theme.spacing.md }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: theme.spacing.xs,
                      fontWeight: theme.typography.weights.semibold,
                      color: theme.colors.text
                    }}>
                      Email & Role
                    </label>
                    <p style={{ 
                      fontSize: theme.typography.sizes.base,
                      color: theme.colors.textSecondary,
                      margin: 0
                    }}>
                      {profileData.email} • {profileData.role}
                    </p>
                    <p style={{ 
                      fontSize: theme.typography.sizes.sm,
                      color: theme.colors.textSecondary,
                      margin: `${theme.spacing.xs} 0 0 0`
                    }}>
                      Member since {new Date(profileData.joinedDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ marginBottom: theme.spacing.md }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: theme.spacing.xs,
                      fontWeight: theme.typography.weights.semibold,
                      color: theme.colors.text
                    }}>
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        style={textareaStyle}
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        maxLength={500}
                      />
                    ) : (
                      <p style={{ 
                        fontSize: theme.typography.sizes.base,
                        color: theme.colors.text,
                        lineHeight: 1.6,
                        margin: 0
                      }}>
                        {profileData.bio || 'No bio provided yet.'}
                      </p>
                    )}
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
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          style={inputStyle}
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="San Francisco, CA"
                        />
                      ) : (
                        <p style={{ 
                          fontSize: theme.typography.sizes.base,
                          color: theme.colors.text,
                          margin: 0
                        }}>
                          {profileData.location ? `📍 ${profileData.location}` : 'Location not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: theme.spacing.xs,
                        fontWeight: theme.typography.weights.semibold,
                        color: theme.colors.text
                      }}>
                        Website
                      </label>
                      {isEditing ? (
                        <input
                          style={inputStyle}
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          placeholder="https://yourwebsite.com"
                        />
                      ) : (
                        <p style={{ 
                          fontSize: theme.typography.sizes.base,
                          color: theme.colors.text,
                          margin: 0
                        }}>
                          {profileData.website ? (
                            <a 
                              href={profileData.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ color: theme.colors.primary }}
                            >
                              🌐 Visit Website
                            </a>
                          ) : (
                            'No website provided'
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Stats */}
            <div style={cardStyle}>
              <h2 style={{ 
                fontSize: theme.typography.sizes.xl, 
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.text,
                marginBottom: theme.spacing.lg,
                textAlign: 'center'
              }}>
                📊 Your Activity
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: theme.spacing.md 
              }}>
                <div style={statCardStyle}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: theme.spacing.sm 
                  }}>💬</div>
                  <div style={{ 
                    fontSize: theme.typography.sizes.xl, 
                    fontWeight: theme.typography.weights.bold,
                    color: theme.colors.primary,
                    marginBottom: theme.spacing.xs
                  }}>
                    {profileData.stats.commentsCount}
                  </div>
                  <div style={{ 
                    fontSize: theme.typography.sizes.sm, 
                    color: theme.colors.textSecondary 
                  }}>
                    Comments Posted
                  </div>
                </div>

                <div style={statCardStyle}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: theme.spacing.sm 
                  }}>⚓</div>
                  <div style={{ 
                    fontSize: theme.typography.sizes.lg, 
                    fontWeight: theme.typography.weights.bold,
                    color: theme.colors.primary,
                    marginBottom: theme.spacing.xs
                  }}>
                    {profileData.stats.memberSince}
                  </div>
                  <div style={{ 
                    fontSize: theme.typography.sizes.sm, 
                    color: theme.colors.textSecondary 
                  }}>
                    Member Since
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div style={cardStyle}>
            <h2 style={{ 
              fontSize: theme.typography.sizes.xl, 
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.lg
            }}>
              ⚙️ Account Settings
            </h2>

            {/* Notification Preferences */}
            <div style={{ marginBottom: theme.spacing.xl }}>
              <h3 style={{ 
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.semibold,
                color: theme.colors.text,
                marginBottom: theme.spacing.md
              }}>
                📧 Notification Preferences
              </h3>

              <div style={{ marginBottom: theme.spacing.md }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: theme.typography.sizes.base
                }}>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={formData.emailNotifications}
                    onChange={(e) => setFormData({
                      ...formData,
                      emailNotifications: e.target.checked
                    })}
                  />
                  Email notifications for new content
                </label>
              </div>

              <div style={{ marginBottom: theme.spacing.md }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: theme.typography.sizes.base
                }}>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={formData.weeklyDigest}
                    onChange={(e) => setFormData({
                      ...formData,
                      weeklyDigest: e.target.checked
                    })}
                  />
                  Weekly digest email
                </label>
              </div>

              <div style={{ marginBottom: theme.spacing.md }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: theme.typography.sizes.base
                }}>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={formData.commentReplies}
                    onChange={(e) => setFormData({
                      ...formData,
                      commentReplies: e.target.checked
                    })}
                  />
                  Notifications for comment replies
                </label>
              </div>
            </div>

            {/* Account Actions */}
            <div style={{ 
              borderTop: `2px solid ${theme.colors.border}`,
              paddingTop: theme.spacing.lg
            }}>
              <h3 style={{ 
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.semibold,
                color: theme.colors.text,
                marginBottom: theme.spacing.md
              }}>
                🔐 Account Actions
              </h3>

              <div style={{ 
                display: 'flex', 
                gap: theme.spacing.md,
                flexWrap: 'wrap'
              }}>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: theme.colors.secondary
                  }}
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? '💾 Saving...' : '💾 Save Settings'}
                </button>

                <button
                  style={{
                    ...secondaryButtonStyle,
                    borderColor: '#dc3545',
                    color: '#dc3545'
                  }}
                  onClick={handleSignOut}
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: theme.spacing.md,
          marginTop: theme.spacing.xl,
          paddingTop: theme.spacing.xl,
          borderTop: `2px solid ${theme.colors.border}`,
          flexWrap: 'wrap'
        }}>
          <button
            style={buttonStyle}
            onClick={() => navigate('/articles')}
          >
            📚 Browse Articles
          </button>
          <button
            style={buttonStyle}
            onClick={() => navigate('/past-shows')}
          >
            🎬 Watch Shows
          </button>
          <button
            style={secondaryButtonStyle}
            onClick={() => navigate('/')}
          >
            🏠 Back to Home
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
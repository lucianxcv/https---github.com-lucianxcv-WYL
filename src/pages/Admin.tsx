/**
 * ADMIN DASHBOARD PAGE - WITH BLOG AND SPEAKER MANAGEMENT
 *
 * Complete admin dashboard with all management systems
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../utils/useAuth';
import { UserManagement } from '../components/admin/UserManagement';
import { BlogPostManagement } from '../components/admin/BlogPostManagement';
import { SpeakerManagement } from '../components/admin/SpeakerManagement';
import { Post, User } from '../data/types';
import { adminApi } from '../utils/apiService';

export const Admin: React.FC = () => {
  const theme = useTheme();
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0
  });
  const [loading, setLoading] = useState(true);

  const pageStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    minHeight: '100vh',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text
  };

  const mainStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing.xl,
    marginTop: '80px'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: theme.spacing.lg
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
    marginRight: theme.spacing.sm,
    transition: 'all 0.3s ease'
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    ...buttonStyle,
    backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
    color: isActive ? '#ffffff' : theme.colors.text,
    border: `2px solid ${isActive ? theme.colors.primary : theme.colors.border}`
  });

  // Load admin data
  useEffect(() => {
    const loadAdminData = async () => {
      if (!isAuthenticated || !isAdmin) return;

      setLoading(true);
      try {
        // Load stats, users, and posts
        const [statsResponse, usersResponse, postsResponse] = await Promise.all([
          adminApi.getStats(),
          adminApi.users.getAll({ limit: 5 }), // Just get first 5 for stats
          adminApi.posts.getAll({ limit: 5 })   // Just get first 5 for stats
        ]);

        if (statsResponse.success) {
          const serverStats = statsResponse.data;
          setStats({
            totalUsers: serverStats?.totalUsers || 0,
            totalPosts: serverStats?.totalPosts || 0,
            publishedPosts: serverStats?.publishedPosts || 0,
            draftPosts: (serverStats?.totalPosts || 0) - (serverStats?.publishedPosts || 0)
          });
        }
        if (usersResponse.success) setUsers(usersResponse.data || []);
        if (postsResponse.success) setPosts(postsResponse.data || []);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [isAuthenticated, isAdmin]);

  // Refresh stats when data is updated
  const handleDataUpdate = async () => {
    try {
      const statsResponse = await adminApi.getStats();
      if (statsResponse.success) {
        const serverStats = statsResponse.data;
        setStats({
          totalUsers: serverStats?.totalUsers || 0,
          totalPosts: serverStats?.totalPosts || 0,
          publishedPosts: serverStats?.publishedPosts || 0,
          draftPosts: (serverStats?.totalPosts || 0) - (serverStats?.publishedPosts || 0)
        });
      }
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <main style={mainStyle}>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <h2>Loading...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <main style={mainStyle}>
          <div style={{
            ...cardStyle,
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h1 style={{
              fontSize: theme.typography.sizes['3xl'],
              color: theme.colors.primary,
              marginBottom: theme.spacing.lg
            }}>
              🔐 Please Log In
            </h1>
            <p style={{
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xl,
              lineHeight: 1.6
            }}>
              You need to be logged in to access the admin dashboard.
            </p>
            <a
              href="#auth"
              style={{
                ...buttonStyle,
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              🔐 Go to Login
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <main style={mainStyle}>
          <div style={{
            ...cardStyle,
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h1 style={{
              fontSize: theme.typography.sizes['3xl'],
              color: theme.colors.primary,
              marginBottom: theme.spacing.lg
            }}>
              ⚠️ Admin Access Required
            </h1>
            <p style={{
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xl,
              lineHeight: 1.6
            }}>
              Hi {user?.name || user?.email}! You don't have admin privileges to access this dashboard.
            </p>
            <a
              href="#home"
              style={{
                ...buttonStyle,
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              🏠 Go to Home
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Admin dashboard
  return (
    <div style={pageStyle}>
      <Navbar />
      <main style={mainStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl }}>
          <h1 style={{
            fontSize: theme.typography.sizes['4xl'],
            color: theme.colors.text,
            margin: 0
          }}>
            ⚙️ Admin Dashboard
          </h1>
          <div style={{ color: theme.colors.textSecondary }}>
            Welcome, {user?.name || user?.email}
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: theme.spacing.lg,
          marginBottom: theme.spacing.xl
        }}>
          <div style={{
            backgroundColor: theme.colors.background,
            padding: theme.spacing.lg,
            borderRadius: '12px',
            textAlign: 'center',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.md
          }}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>👥</div>
            <h3 style={{ color: theme.colors.primary, margin: 0 }}>Total Users</h3>
            <p style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.bold,
              margin: theme.spacing.xs
            }}>
              {stats.totalUsers}
            </p>
          </div>

          <div style={{
            backgroundColor: theme.colors.background,
            padding: theme.spacing.lg,
            borderRadius: '12px',
            textAlign: 'center',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.md
          }}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>📝</div>
            <h3 style={{ color: theme.colors.primary, margin: 0 }}>Total Posts</h3>
            <p style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.bold,
              margin: theme.spacing.xs
            }}>
              {stats.totalPosts}
            </p>
          </div>

          <div style={{
            backgroundColor: theme.colors.background,
            padding: theme.spacing.lg,
            borderRadius: '12px',
            textAlign: 'center',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.md
          }}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>✅</div>
            <h3 style={{ color: theme.colors.primary, margin: 0 }}>Published</h3>
            <p style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.bold,
              margin: theme.spacing.xs
            }}>
              {stats.publishedPosts}
            </p>
          </div>

          <div style={{
            backgroundColor: theme.colors.background,
            padding: theme.spacing.lg,
            borderRadius: '12px',
            textAlign: 'center',
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.md
          }}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>📄</div>
            <h3 style={{ color: theme.colors.primary, margin: 0 }}>Drafts</h3>
            <p style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.bold,
              margin: theme.spacing.xs
            }}>
              {stats.draftPosts}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.xl,
          flexWrap: 'wrap'
        }}>
          <button
            style={tabButtonStyle(activeTab === 'users')}
            onClick={() => setActiveTab('users')}
            onMouseEnter={(e) => {
              if (activeTab !== 'users') {
                e.currentTarget.style.backgroundColor = theme.colors.border;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'users') {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }
            }}
          >
            👥 User Management
          </button>

          <button
            style={tabButtonStyle(activeTab === 'posts')}
            onClick={() => setActiveTab('posts')}
            onMouseEnter={(e) => {
              if (activeTab !== 'posts') {
                e.currentTarget.style.backgroundColor = theme.colors.border;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'posts') {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }
            }}
          >
            📝 Blog Management
          </button>

          <button
            style={tabButtonStyle(activeTab === 'speakers')}
            onClick={() => setActiveTab('speakers')}
            onMouseEnter={(e) => {
              if (activeTab !== 'speakers') {
                e.currentTarget.style.backgroundColor = theme.colors.border;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'speakers') {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }
            }}
          >
            🎤 Speaker Management
          </button>
        </div>

        {/* Tab Content - ALL MANAGEMENT SYSTEMS */}
        {activeTab === 'users' && (
          <UserManagement onUserUpdate={handleDataUpdate} />
        )}

        {activeTab === 'posts' && (
          <BlogPostManagement onPostUpdate={handleDataUpdate} />
        )}

        {activeTab === 'speakers' && (
          <SpeakerManagement onSpeakerUpdate={handleDataUpdate} />
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <p>Loading admin data...</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};
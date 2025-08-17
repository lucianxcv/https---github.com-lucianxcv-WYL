// ==================== src/pages/Admin.tsx ====================
/**
 * ADMIN DASHBOARD PAGE - REAL AUTHENTICATION
 *
 * Now connected to real authentication system and backend APIs
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../utils/useAuth';
import { adminApi } from '../utils/apiService';

export const Admin: React.FC = () => {
  const theme = useTheme();
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('speakers');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
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
    marginTop: '80px' // Account for fixed navbar
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

  // Load admin data
  useEffect(() => {
    const loadAdminData = async () => {
      if (!isAuthenticated || !isAdmin) return;
      
      setLoading(true);
      try {
        // Load stats, users, and posts
        const [statsResponse, usersResponse, postsResponse] = await Promise.all([
          adminApi.getStats(),
          adminApi.users.getAll(),
          adminApi.posts.getAll()
        ]);

        if (statsResponse.success) setStats(statsResponse.data || stats);
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
            border: `1px solid ${theme.colors.border}`
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
            border: `1px solid ${theme.colors.border}`
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
            border: `1px solid ${theme.colors.border}`
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
            border: `1px solid ${theme.colors.border}`
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

        {/* Quick Actions */}
        <div style={cardStyle}>
          <h2 style={{
            fontSize: theme.typography.sizes['2xl'],
            color: theme.colors.primary,
            marginBottom: theme.spacing.lg
          }}>
            🚀 Quick Actions
          </h2>
          
          <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap' }}>
            <button
              style={{...buttonStyle, backgroundColor: theme.colors.secondary}}
              onClick={() => setActiveTab('speakers')}
            >
              🎤 Add New Speaker
            </button>
            
            <button
              style={{...buttonStyle, backgroundColor: theme.colors.accent}}
              onClick={() => setActiveTab('posts')}
            >
              📝 Create Blog Post
            </button>
            
            <button
              style={buttonStyle}
              onClick={() => setActiveTab('users')}
            >
              👥 Manage Users
            </button>
          </div>
        </div>

        {/* Content Area - We'll add tabs here next */}
        <div style={cardStyle}>
          <h2 style={{
            fontSize: theme.typography.sizes['2xl'],
            color: theme.colors.primary,
            marginBottom: theme.spacing.lg
          }}>
            📋 Management Tools
          </h2>
          
          <p style={{ color: theme.colors.textSecondary }}>
            Content management tabs will be added next. For now, you can:
          </p>
          
          <ul style={{ color: theme.colors.text, lineHeight: 1.6 }}>
            <li>View real user and post statistics above</li>
            <li>Access is restricted to admin users only</li>
            <li>Authentication is working with your backend</li>
          </ul>
          
          <div style={{
            marginTop: theme.spacing.lg,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            borderRadius: '8px'
          }}>
            <strong>Next steps:</strong>
            <ul style={{ marginTop: theme.spacing.sm }}>
              <li>Add speaker creation form</li>
              <li>Add blog post editor</li>
              <li>Add user management interface</li>
            </ul>
          </div>
        </div>

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
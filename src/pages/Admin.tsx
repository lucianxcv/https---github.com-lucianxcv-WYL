/**
 * ADMIN DASHBOARD PAGE - UPDATED STATS LAYOUT
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../utils/useAuth';
import { UserManagement } from '../components/admin/UserManagement';
import { BlogPostManagement } from '../components/admin/BlogPostManagement';
import { SpeakerManagement } from '../components/admin/SpeakerManagement';
import { PastShowManagement } from '../components/admin/PastShowManagement';
import { Post, User } from '../data/types';
import { adminApi } from '../utils/apiService';

// 🔥 UPDATED: Admin stats interface to match backend
interface AdminStats {
  totalUsers: number;
  totalComments: number;
  publishedPosts: number;
  draftPosts: number;        // ← ADDED
  totalSpeakers: number;     // ← ADDED
  totalShows: number;
  pendingComments: number;
}

// 🔥 UPDATED: Normalize API data safely
const normalizeStats = (data: Partial<AdminStats>): AdminStats => ({
  totalUsers: data.totalUsers ?? 0,
  totalComments: data.totalComments ?? 0,
  publishedPosts: data.publishedPosts ?? 0,
  draftPosts: data.draftPosts ?? 0,           // ← ADDED
  totalSpeakers: data.totalSpeakers ?? 0,     // ← ADDED
  totalShows: data.totalShows ?? 0,
  pendingComments: data.pendingComments ?? 0
});

export const Admin: React.FC = () => {
  const theme = useTheme();
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'speakers' | 'past-shows'>('users');
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats>(normalizeStats({}));
  const [loading, setLoading] = useState(true);

  const pageStyle: React.CSSProperties = { fontFamily: theme.typography.fontFamily, minHeight: '100vh', backgroundColor: theme.colors.surface, color: theme.colors.text };
  const mainStyle: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto', padding: theme.spacing.xl, marginTop: '80px' };
  const cardStyle: React.CSSProperties = { backgroundColor: theme.colors.background, borderRadius: '16px', padding: theme.spacing.xl, boxShadow: theme.shadows.md, border: `1px solid ${theme.colors.border}`, marginBottom: theme.spacing.lg };
  const buttonStyle: React.CSSProperties = { backgroundColor: theme.colors.primary, color: '#fff', padding: `${theme.spacing.sm} ${theme.spacing.md}`, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.semibold, marginRight: theme.spacing.sm, transition: 'all 0.3s ease' };
  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({ ...buttonStyle, backgroundColor: isActive ? theme.colors.primary : theme.colors.surface, color: isActive ? '#fff' : theme.colors.text, border: `2px solid ${isActive ? theme.colors.primary : theme.colors.border}` });

  // Load admin data
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes, postsRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.users.getAll({}),
          adminApi.posts.getAll({})
        ]);

        setStats(normalizeStats(statsRes.data ?? {}));
        if (usersRes.success) setUsers(usersRes.data ?? []);
        if (postsRes.success) setPosts(postsRes.data ?? []);

      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [isAuthenticated, isAdmin]);

  // Refresh stats
  const handleDataUpdate = async () => {
    try {
      const [statsRes, usersRes, postsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.users.getAll({}),
        adminApi.posts.getAll({})
      ]);

      setStats(normalizeStats(statsRes.data ?? {}));
      if (usersRes.success) setUsers(usersRes.data ?? []);
      if (postsRes.success) setPosts(postsRes.data ?? []);

    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  };

  // Loading / auth checks
  if (isLoading) return <div style={pageStyle}><Navbar /><main style={mainStyle}><h2>Loading Admin Dashboard...</h2></main><Footer /></div>;
  if (!isAuthenticated) return <div style={pageStyle}><Navbar /><main style={mainStyle}><div style={{...cardStyle,textAlign:'center'}}><h1>🔐 Please Log In</h1></div></main><Footer /></div>;
  if (!isAdmin) return <div style={pageStyle}><Navbar /><main style={mainStyle}><div style={{...cardStyle,textAlign:'center'}}><h1>⚠️ Admin Access Required</h1></div></main><Footer /></div>;

  return (
    <div style={pageStyle}>
      <Navbar />
      <main style={mainStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl, flexWrap: 'wrap', gap: theme.spacing.md }}>
          <h1 style={{ fontSize: theme.typography.sizes['4xl'], color: theme.colors.text, margin: 0 }}>⚙️ Admin Dashboard</h1>
          <div style={{ color: theme.colors.textSecondary }}>{loading && <span>🔄</span>}👋 {user?.name || user?.email}</div>
        </div>

        {/* 🔥 UPDATED: Stats Cards - Clean Layout */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:theme.spacing.lg, marginBottom:theme.spacing.xl }}>
          {[
            { icon:'👥', label:'Total Users', value: stats.totalUsers, color: theme.colors.primary },
            { icon:'✅', label:'Published Posts', value: stats.publishedPosts, color: '#22c55e' },
            { icon:'📄', label:'Draft Posts', value: stats.draftPosts, color: '#f59e0b' },
            { icon:'🎤', label:'Total Speakers', value: stats.totalSpeakers, color: '#8b5cf6' },
            { icon:'📹', label:'Past Shows', value: stats.totalShows, color: '#ef4444' }
          ].map((card, i) => (
            <div 
              key={i} 
              style={{ 
                backgroundColor: theme.colors.background, 
                padding: theme.spacing.lg, 
                borderRadius: '12px', 
                textAlign: 'center', 
                border: `1px solid ${theme.colors.border}`, 
                boxShadow: theme.shadows.md,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = theme.shadows.lg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
            >
              <div style={{ fontSize:'2rem', marginBottom:theme.spacing.sm }}>{card.icon}</div>
              <h3 style={{ color: card.color, margin:0, fontSize: theme.typography.sizes.sm }}>{card.label}</h3>
              <p style={{ 
                fontSize: theme.typography.sizes.xl, 
                fontWeight: theme.typography.weights.bold, 
                margin: theme.spacing.xs,
                color: theme.colors.text
              }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:theme.spacing.sm, marginBottom:theme.spacing.xl, flexWrap:'wrap' }}>
          {[
            { key:'users', label:'👥 User Management' },
            { key:'posts', label:'📝 Blog Management' },
            { key:'speakers', label:'🎤 Speaker Management' },
            { key:'past-shows', label:'📹 Past Shows' }
          ].map(tab => (
            <button key={tab.key} style={tabButtonStyle(activeTab===tab.key as any)} onClick={()=>setActiveTab(tab.key as any)}>{tab.label}</button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab==='users' && <UserManagement onUserUpdate={handleDataUpdate} />}
        {activeTab==='posts' && <BlogPostManagement onPostUpdate={handleDataUpdate} />}
        {activeTab==='speakers' && <SpeakerManagement onSpeakerUpdate={handleDataUpdate} />}
        {activeTab==='past-shows' && <PastShowManagement onShowUpdate={handleDataUpdate} />}

        {loading && <div style={{textAlign:'center',padding:theme.spacing.xl}}><div style={{fontSize:'2rem', marginBottom:theme.spacing.sm}}>⏳</div><p>Loading admin data...</p></div>}
      </main>
      <Footer />
    </div>
  );
};
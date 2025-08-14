// ==================== src/pages/Admin.tsx ====================
/**
 * ADMIN DASHBOARD PAGE (PLACEHOLDER)
 * 
 * This page will eventually allow administrators to:
 * - Add, edit, and delete luncheon posts/speakers
 * - Manage user comments and speaker suggestions
 * - Upload images and media files
 * - Manage newsletter subscribers
 * - View analytics and attendance data
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change the dashboard layout and styling
 * - Add more admin sections or remove ones you don't need
 * - Modify the mock data to show different content
 * - Change colors and typography
 * 
 * FUTURE BACKEND INTEGRATION POINTS:
 * - Replace all mock data with real API calls
 * - Add form submission handlers for CRUD operations
 * - Implement file upload functionality
 * - Add user role/permission checking
 * - Connect to real database for data persistence
 */

import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const Admin: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('speakers');
  
  // Mock admin authentication - will be replaced with real auth
  const [isAdmin, setIsAdmin] = useState(false);

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

  const tabStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderBottom: `2px solid ${theme.colors.border}`,
    paddingBottom: theme.spacing.sm
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    backgroundColor: isActive ? theme.colors.primary : 'transparent',
    color: isActive ? '#ffffff' : theme.colors.text,
    border: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    transition: 'all 0.3s ease'
  });

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

  // Mock data for demonstration
  const mockSpeakers = [
    {
      id: 1,
      name: "Captain Sarah Johnson",
      topic: "Mysteries of the Mariana Trench",
      date: "2025-08-14",
      status: "confirmed"
    },
    {
      id: 2,
      name: "Dr. Marine Explorer",
      topic: "Climate Change and Ocean Currents",
      date: "2025-08-21",
      status: "pending"
    }
  ];

  const mockComments = [
    {
      id: 1,
      author: "John D.",
      content: "Great presentation on ocean exploration!",
      date: "2025-08-08",
      status: "approved"
    },
    {
      id: 2,
      author: "Anonymous",
      content: "This comment needs moderation review",
      date: "2025-08-08",
      status: "pending"
    }
  ];

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
              🔐 Admin Access Required
            </h1>
            <p style={{
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xl,
              lineHeight: 1.6
            }}>
              This page is restricted to administrators only.
              Please log in with admin credentials to access the dashboard.
            </p>
            <button
              style={buttonStyle}
              onClick={() => {
                // TODO: Connect to real admin authentication
                const password = prompt('Enter admin password:');
                if (password === 'admin123') { // Demo only - never do this in production!
                  setIsAdmin(true);
                } else {
                  alert('Incorrect password. In a real app, this would use secure authentication.');
                }
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
            >
              🗝️ Admin Login (Demo: password is "admin123")
            </button>
            <div style={{
              marginTop: theme.spacing.xl,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.surface,
              borderRadius: '8px',
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.textSecondary
            }}>
              <strong>🛠️ Developer Note:</strong> In production, this would integrate with your 
              authentication system to verify admin permissions securely.
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <main style={mainStyle}>
        <h1 style={{
          fontSize: theme.typography.sizes['4xl'],
          color: theme.colors.text,
          marginBottom: theme.spacing.xl,
          textAlign: 'center'
        }}>
          ⚙️ Admin Dashboard
        </h1>

        {/* Tab navigation */}
        <div style={tabStyle}>
          <button
            style={tabButtonStyle(activeTab === 'speakers')}
            onClick={() => setActiveTab('speakers')}
            onMouseEnter={(e) => {
              if (activeTab !== 'speakers') {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'speakers') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            🎤 Manage Speakers
          </button>
          <button
            style={tabButtonStyle(activeTab === 'comments')}
            onClick={() => setActiveTab('comments')}
            onMouseEnter={(e) => {
              if (activeTab !== 'comments') {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'comments') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            💬 Moderate Comments
          </button>
          <button
            style={tabButtonStyle(activeTab === 'media')}
            onClick={() => setActiveTab('media')}
            onMouseEnter={(e) => {
              if (activeTab !== 'media') {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'media') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            📸 Media Library
          </button>
          <button
            style={tabButtonStyle(activeTab === 'analytics')}
            onClick={() => setActiveTab('analytics')}
            onMouseEnter={(e) => {
              if (activeTab !== 'analytics') {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'analytics') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            📊 Analytics
          </button>
        </div>

        {/* Speakers Management Tab */}
        {activeTab === 'speakers' && (
          <div>
            <div style={cardStyle}>
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
                  🎤 Speaker Management
                </h2>
                <button
                  style={{...buttonStyle, backgroundColor: theme.colors.secondary}}
                  onClick={() => {
                    // TODO: Open add speaker form/modal
                    alert('Add Speaker form will be implemented with backend integration');
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
                >
                  ➕ Add New Speaker
                </button>
              </div>

              {/* Speaker list */}
              {mockSpeakers.map((speaker) => (
                <div key={speaker.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.surface,
                  borderRadius: '8px',
                  marginBottom: theme.spacing.md
                }}>
                  <div>
                    <h3 style={{ 
                      color: theme.colors.text,
                      margin: `0 0 ${theme.spacing.xs} 0`,
                      fontSize: theme.typography.sizes.lg
                    }}>
                      {speaker.name}
                    </h3>
                    <p style={{ 
                      color: theme.colors.textSecondary,
                      margin: `0 0 ${theme.spacing.xs} 0`,
                      fontSize: theme.typography.sizes.sm
                    }}>
                      Topic: {speaker.topic}
                    </p>
                    <p style={{ 
                      color: theme.colors.textSecondary,
                      margin: 0,
                      fontSize: theme.typography.sizes.sm
                    }}>
                      Date: {speaker.date} | Status: 
                      <span style={{ 
                        color: speaker.status === 'confirmed' ? '#10b981' : '#f59e0b',
                        fontWeight: theme.typography.weights.semibold,
                        marginLeft: theme.spacing.xs
                      }}>
                        {speaker.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <button
                      style={buttonStyle}
                      onClick={() => {
                        // TODO: Open edit speaker form
                        alert(`Edit Speaker functionality will be implemented. Speaker ID: ${speaker.id}`);
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      style={{...buttonStyle, backgroundColor: '#ef4444'}}
                      onClick={() => {
                        // TODO: Implement speaker deletion with confirmation
                        if (window.confirm(`Are you sure you want to delete ${speaker.name}?`)) {
                          alert(`Delete functionality will be implemented. Speaker ID: ${speaker.id}`);
                        }
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Backend integration notes */}
              <div style={{
                marginTop: theme.spacing.xl,
                padding: theme.spacing.md,
                backgroundColor: theme.colors.surface,
                borderRadius: '8px',
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textSecondary
              }}>
                <strong>🔧 Implementation Notes:</strong>
                <ul style={{ marginTop: theme.spacing.sm, lineHeight: 1.6 }}>
                  <li><strong>Add Speaker:</strong> Form will submit to <code>POST /api/admin/speakers</code></li>
                  <li><strong>Edit Speaker:</strong> Form will submit to <code>PUT /api/admin/speakers/:id</code></li>
                  <li><strong>Delete Speaker:</strong> Will call <code>DELETE /api/admin/speakers/:id</code></li>
                  <li><strong>Speaker List:</strong> Data loaded from <code>GET /api/admin/speakers</code></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Comments Moderation Tab */}
        {activeTab === 'comments' && (
          <div style={cardStyle}>
            <h2 style={{ 
              fontSize: theme.typography.sizes['2xl'],
              color: theme.colors.primary,
              marginBottom: theme.spacing.lg
            }}>
              💬 Comment Moderation
            </h2>

            {mockComments.map((comment) => (
              <div key={comment.id} style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.surface,
                borderRadius: '8px',
                marginBottom: theme.spacing.md,
                borderLeft: `4px solid ${comment.status === 'pending' ? '#f59e0b' : '#10b981'}`
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: theme.spacing.sm
                }}>
                  <div>
                    <strong style={{ color: theme.colors.text }}>
                      {comment.author}
                    </strong>
                    <span style={{ 
                      marginLeft: theme.spacing.sm,
                      fontSize: theme.typography.sizes.sm,
                      color: theme.colors.textSecondary
                    }}>
                      {comment.date}
                    </span>
                  </div>
                  <span style={{
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    backgroundColor: comment.status === 'pending' ? '#fef3c7' : '#d1fae5',
                    color: comment.status === 'pending' ? '#92400e' : '#065f46',
                    borderRadius: '4px',
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.semibold
                  }}>
                    {comment.status}
                  </span>
                </div>
                <p style={{ 
                  color: theme.colors.text,
                  margin: `${theme.spacing.sm} 0`,
                  lineHeight: 1.5
                }}>
                  {comment.content}
                </p>
                <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                  {comment.status === 'pending' && (
                    <>
                      <button
                        style={{...buttonStyle, backgroundColor: '#10b981'}}
                        onClick={() => {
                          // TODO: Approve comment
                          alert(`Approve comment functionality will be implemented. Comment ID: ${comment.id}`);
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                      >
                        ✅ Approve
                      </button>
                      <button
                        style={{...buttonStyle, backgroundColor: '#ef4444'}}
                        onClick={() => {
                          // TODO: Reject comment
                          alert(`Reject comment functionality will be implemented. Comment ID: ${comment.id}`);
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  <button
                    style={{...buttonStyle, backgroundColor: '#6b7280'}}
                    onClick={() => {
                      // TODO: Delete comment
                      if (window.confirm('Are you sure you want to delete this comment?')) {
                        alert(`Delete comment functionality will be implemented. Comment ID: ${comment.id}`);
                      }
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}

            {/* Backend integration notes */}
            <div style={{
              marginTop: theme.spacing.xl,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.surface,
              borderRadius: '8px',
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.textSecondary
            }}>
              <strong>🔧 Implementation Notes:</strong>
              <ul style={{ marginTop: theme.spacing.sm, lineHeight: 1.6 }}>
                <li><strong>Load Comments:</strong> <code>GET /api/admin/comments</code></li>
                <li><strong>Approve Comment:</strong> <code>PUT /api/admin/comments/:id/approve</code></li>
                <li><strong>Reject Comment:</strong> <code>PUT /api/admin/comments/:id/reject</code></li>
                <li><strong>Delete Comment:</strong> <code>DELETE /api/admin/comments/:id</code></li>
              </ul>
            </div>
          </div>
        )}

        {/* Media Library Tab */}
        {activeTab === 'media' && (
          <div style={cardStyle}>
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
                📸 Media Library
              </h2>
              <button
                style={{...buttonStyle, backgroundColor: theme.colors.secondary}}
                onClick={() => {
                  // TODO: Open file upload interface
                  alert('File upload functionality will be implemented with backend integration');
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
              >
                📤 Upload Files
              </button>
            </div>

            <div style={{
              textAlign: 'center',
              padding: theme.spacing.xl,
              color: theme.colors.textSecondary
            }}>
              <div style={{ fontSize: '4rem', marginBottom: theme.spacing.lg }}>📁</div>
              <h3>Media Library Coming Soon</h3>
              <p style={{ lineHeight: 1.6, maxWidth: '500px', margin: '0 auto' }}>
                This section will allow you to upload and manage images, videos, and documents 
                for your luncheon presentations and website content.
              </p>
            </div>

            {/* Backend integration notes */}
            <div style={{
              marginTop: theme.spacing.xl,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.surface,
              borderRadius: '8px',
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.textSecondary
            }}>
              <strong>🔧 Implementation Notes:</strong>
              <ul style={{ marginTop: theme.spacing.sm, lineHeight: 1.6 }}>
                <li><strong>File Upload:</strong> <code>POST /api/admin/media/upload</code> (with multipart/form-data)</li>
                <li><strong>List Files:</strong> <code>GET /api/admin/media</code></li>
                <li><strong>Delete File:</strong> <code>DELETE /api/admin/media/:id</code></li>
                <li><strong>Storage:</strong> Consider using cloud storage (AWS S3, Cloudinary) for scalability</li>
              </ul>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div style={cardStyle}>
            <h2 style={{
              fontSize: theme.typography.sizes['2xl'],
              color: theme.colors.primary,
              marginBottom: theme.spacing.lg
            }}>
              📊 Analytics Dashboard
            </h2>

            {/* Mock analytics cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: theme.spacing.lg,
              marginBottom: theme.spacing.xl
            }}>
              <div style={{
                backgroundColor: theme.colors.surface,
                padding: theme.spacing.lg,
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>👥</div>
                <h3 style={{ color: theme.colors.primary, margin: 0 }}>Total Visitors</h3>
                <p style={{ fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, margin: theme.spacing.xs }}>
                  2,847
                </p>
                <small style={{ color: theme.colors.textSecondary }}>This month</small>
              </div>
              
              <div style={{
                backgroundColor: theme.colors.surface,
                padding: theme.spacing.lg,
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>🎥</div>
                <h3 style={{ color: theme.colors.primary, margin: 0 }}>Video Views</h3>
                <p style={{ fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, margin: theme.spacing.xs }}>
                  1,203
                </p>
                <small style={{ color: theme.colors.textSecondary }}>Past presentations</small>
              </div>

              <div style={{
                backgroundColor: theme.colors.surface,
                padding: theme.spacing.lg,
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>💬</div>
                <h3 style={{ color: theme.colors.primary, margin: 0 }}>Comments</h3>
                <p style={{ fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, margin: theme.spacing.xs }}>
                  89
                </p>
                <small style={{ color: theme.colors.textSecondary }}>Total comments</small>
              </div>

              <div style={{
                backgroundColor: theme.colors.surface,
                padding: theme.spacing.lg,
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>🎤</div>
                <h3 style={{ color: theme.colors.primary, margin: 0 }}>Suggestions</h3>
                <p style={{ fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, margin: theme.spacing.xs }}>
                  23
                </p>
                <small style={{ color: theme.colors.textSecondary }}>Speaker suggestions</small>
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: theme.spacing.xl,
              color: theme.colors.textSecondary
            }}>
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.lg }}>📈</div>
              <h3>Detailed Analytics Coming Soon</h3>
              <p style={{ lineHeight: 1.6, maxWidth: '500px', margin: '0 auto' }}>
                Charts, graphs, and detailed visitor analytics will be implemented 
                with backend data collection and visualization libraries.
              </p>
            </div>

            {/* Backend integration notes */}
            <div style={{
              marginTop: theme.spacing.xl,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.surface,
              borderRadius: '8px',
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.textSecondary
            }}>
              <strong>🔧 Implementation Notes:</strong>
              <ul style={{ marginTop: theme.spacing.sm, lineHeight: 1.6 }}>
                <li><strong>Analytics Data:</strong> <code>GET /api/admin/analytics</code></li>
                <li><strong>Visitor Tracking:</strong> Implement with Google Analytics or custom solution</li>
                <li><strong>Charts:</strong> Use libraries like Chart.js, D3.js, or Recharts</li>
                <li><strong>Real-time Updates:</strong> Consider WebSocket for live data</li>
              </ul>
            </div>
          </div>
        )}

        {/* Global admin notes */}
        <div style={{
          backgroundColor: theme.colors.background,
          borderRadius: '12px',
          padding: theme.spacing.lg,
          border: `2px solid ${theme.colors.gold}`,
          marginTop: theme.spacing.xl
        }}>
          <h3 style={{ 
            color: theme.colors.gold,
            marginBottom: theme.spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
          }}>
            🚀 Ready for Backend Integration
          </h3>
          <p style={{ color: theme.colors.textSecondary, lineHeight: 1.6 }}>
            All admin functionality is designed and ready for backend implementation. 
            Mock data and placeholder functions show exactly what needs to be built.
            API endpoints are documented throughout for easy implementation.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

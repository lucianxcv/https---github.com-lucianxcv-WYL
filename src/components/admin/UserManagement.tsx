// ==================== src/components/admin/UserManagement.tsx - DEBUG VERSION ====================
/**
 * USER MANAGEMENT COMPONENT - DEBUG VERSION
 * 
 * Complete user management interface for admin dashboard
 * Features: View users, change roles, search, pagination, delete users
 * ADDED: Extensive debugging to find the user count issue
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { adminApi } from '../../utils/apiService';
import { User, UserRole } from '../../data/types';

interface UserManagementProps {
  onUserUpdate?: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onUserUpdate }) => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null); // DEBUG

  const usersPerPage = 10;

  // Styles (same as before)
  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: theme.spacing.lg
  };

  const headerStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    fontWeight: theme.typography.weights.bold
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  const inputStyle: React.CSSProperties = {
    padding: theme.spacing.sm,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: theme.typography.sizes.base,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    transition: 'border-color 0.3s ease',
    minWidth: '200px'
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    minWidth: '150px'
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: theme.colors.surface,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: theme.shadows.sm
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    padding: theme.spacing.md,
    textAlign: 'left',
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.sm
  };

  const tdStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: theme.typography.sizes.sm
  };

  const buttonStyle: React.CSSProperties = {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    transition: 'all 0.3s ease',
    marginRight: theme.spacing.xs
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.primary,
    color: '#ffffff'
  };

  const dangerButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
    color: '#ffffff'
  };

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg
  };

  const roleTagStyle = (role: UserRole): React.CSSProperties => ({
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '12px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    backgroundColor: role === UserRole.ADMIN ? '#e74c3c' : 
                     role === UserRole.MODERATOR ? '#f39c12' : '#27ae60',
    color: '#ffffff'
  });

  // DEBUG: Test all user-fetching methods
  const testAllUserMethods = async () => {
    console.log('🧪 TESTING ALL USER FETCHING METHODS:');
    
    try {
      // Method 1: With current params
      console.log('1️⃣ Testing with current params...');
      const currentParams = {
        page: currentPage,
        limit: usersPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedRole !== 'all' && { role: selectedRole })
      };
      const method1 = await adminApi.users.getAll(currentParams);
      console.log('Method 1 result:', method1);
      
      // Method 2: With no params (should get all)
      console.log('2️⃣ Testing with NO params...');
      const method2 = await adminApi.users.getAll({});
      console.log('Method 2 result:', method2);
      
      // Method 3: With just a high limit
      console.log('3️⃣ Testing with high limit...');
      const method3 = await adminApi.users.getAll({ limit: 100 });
      console.log('Method 3 result:', method3);
      
      // Method 4: Different page
      console.log('4️⃣ Testing page 1 specifically...');
      const method4 = await adminApi.users.getAll({ page: 1, limit: 50 });
      console.log('Method 4 result:', method4);
      
      setDebugInfo({
        method1Count: method1.data?.length || 0,
        method2Count: method2.data?.length || 0,
        method3Count: method3.data?.length || 0,
        method4Count: method4.data?.length || 0,
        method1Pagination: method1.pagination,
        method2Pagination: method2.pagination,
        currentParams,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('🚨 Error in testing methods:', error);
      setDebugInfo({ error: error instanceof Error ? error.message : String(error) });
    }
  };

  // ENHANCED Load users with extensive debugging
  const loadUsers = async () => {
    console.log('📥 LOADING USERS - START');
    console.log('Current state:', { currentPage, usersPerPage, searchTerm, selectedRole });
    
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        limit: usersPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedRole !== 'all' && { role: selectedRole })
      };

      console.log('📤 API Request params:', params);
      const response = await adminApi.users.getAll(params);
      console.log('📨 API Response:', response);
      
      if (response.success) {
        const userData = response.data || [];
        console.log('✅ Users loaded:', userData.length);
        console.log('👥 User details:', userData.map(u => ({ id: u.id.slice(0,8), email: u.email, role: u.role })));
        
        setUsers(userData);
        
        if (response.pagination) {
          console.log('📊 Pagination info:', response.pagination);
          setTotalPages(response.pagination.totalPages);
        } else {
          console.log('⚠️ No pagination info received');
        }
      } else {
        console.error('❌ API returned success=false:', response);
        setError('Failed to load users');
      }
    } catch (err: any) {
      console.error('🚨 Error loading users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
      console.log('📥 LOADING USERS - END');
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    setUpdatingUser(userId);
    
    try {
      const response = await adminApi.users.updateRole(userId, newRole);
      
      if (response.success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        
        if (onUserUpdate) {
          onUserUpdate();
        }
      } else {
        alert('Failed to update user role');
      }
    } catch (err: any) {
      console.error('Error updating user role:', err);
      alert(err.message || 'Failed to update user role');
    } finally {
      setUpdatingUser(null);
    }
  };

  // Delete user
  const deleteUser = async (userId: string, userEmail: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) {
      return;
    }

    setUpdatingUser(userId);
    
    try {
      const response = await adminApi.users.delete(userId);
      
      if (response.success) {
        // Remove from local state
        setUsers(prev => prev.filter(user => user.id !== userId));
        
        if (onUserUpdate) {
          onUserUpdate();
        }
      } else {
        alert('Failed to delete user');
      }
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert(err.message || 'Failed to delete user');
    } finally {
      setUpdatingUser(null);
    }
  };

  // Effects
  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, selectedRole]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page
  };

  // Handle role filter
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1); // Reset to first page
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>👥 User Management</h2>

      {/* DEBUG INFO SECTION */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        fontSize: theme.typography.sizes.sm
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#6c757d' }}>🐛 Debug Information:</h4>
        <p><strong>Users currently shown:</strong> {users.length}</p>
        <p><strong>Current page:</strong> {currentPage} of {totalPages}</p>
        <p><strong>Search term:</strong> "{searchTerm}" | <strong>Role filter:</strong> {selectedRole}</p>
        
        <button
          style={{...primaryButtonStyle, marginBottom: theme.spacing.sm}}
          onClick={testAllUserMethods}
        >
          🧪 Test All API Methods
        </button>
        
        {debugInfo && (
          <div style={{ 
            backgroundColor: '#fff3cd', 
            padding: theme.spacing.sm, 
            borderRadius: '4px',
            marginTop: theme.spacing.sm,
            border: '1px solid #ffeaa7'
          }}>
            <h5>Test Results:</h5>
            <pre style={{ fontSize: '10px', overflow: 'auto' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={filterContainerStyle}>
        <input
          style={inputStyle}
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
          onBlur={(e) => e.target.style.borderColor = theme.colors.border}
        />
        
        <select
          style={selectStyle}
          value={selectedRole}
          onChange={(e) => handleRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="USER">Users</option>
          <option value="MODERATOR">Moderators</option>
          <option value="ADMIN">Admins</option>
        </select>

        <button
          style={primaryButtonStyle}
          onClick={() => loadUsers()}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: theme.spacing.xl,
          color: theme.colors.textSecondary
        }}>
          Loading users...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          padding: theme.spacing.md,
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          border: '1px solid rgba(231, 76, 60, 0.3)',
          borderRadius: '8px',
          color: '#e74c3c',
          marginBottom: theme.spacing.lg
        }}>
          ❌ {error}
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Joined</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                        {user.avatar && (
                          <img
                            src={user.avatar}
                            alt={user.name || 'User'}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: theme.typography.weights.semibold }}>
                            {user.name || 'No Name'}
                          </div>
                          <div style={{ fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary }}>
                            ID: {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={tdStyle}>
                      <span style={roleTagStyle(user.role as UserRole)}>
                        {user.role}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {formatDate(user.createdAt)}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
                        {/* Role Change Buttons */}
                        {user.role !== UserRole.ADMIN && (
                          <button
                            style={primaryButtonStyle}
                            onClick={() => updateUserRole(user.id, UserRole.ADMIN)}
                            disabled={updatingUser === user.id}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
                          >
                            Make Admin
                          </button>
                        )}
                        
                        {user.role !== UserRole.MODERATOR && (
                          <button
                            style={{...primaryButtonStyle, backgroundColor: '#f39c12'}}
                            onClick={() => updateUserRole(user.id, UserRole.MODERATOR)}
                            disabled={updatingUser === user.id}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e22'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f39c12'}
                          >
                            Make Mod
                          </button>
                        )}
                        
                        {user.role !== UserRole.USER && (
                          <button
                            style={{...primaryButtonStyle, backgroundColor: '#27ae60'}}
                            onClick={() => updateUserRole(user.id, UserRole.USER)}
                            disabled={updatingUser === user.id}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2ecc71'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
                          >
                            Make User
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          style={dangerButtonStyle}
                          onClick={() => deleteUser(user.id, user.email)}
                          disabled={updatingUser === user.id}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                      
                      {updatingUser === user.id && (
                        <div style={{
                          fontSize: theme.typography.sizes.xs,
                          color: theme.colors.textSecondary,
                          marginTop: theme.spacing.xs
                        }}>
                          Updating...
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={paginationStyle}>
              <button
                style={{...buttonStyle, backgroundColor: theme.colors.surface, color: theme.colors.text}}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              
              <span style={{ color: theme.colors.textSecondary }}>
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                style={{...buttonStyle, backgroundColor: theme.colors.surface, color: theme.colors.text}}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}

          {/* Empty State */}
          {users.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: theme.spacing.xl,
              color: theme.colors.textSecondary
            }}>
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>👥</div>
              <h3>No users found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
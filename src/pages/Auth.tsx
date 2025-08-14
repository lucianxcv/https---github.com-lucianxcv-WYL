// ==================== src/pages/Auth.tsx ====================
/**
 * AUTHENTICATION PAGE
 * 
 * Standalone page for user login and registration.
 * Currently uses mock authentication that will be replaced with real backend integration.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change page layout and styling
 * - Add forgot password functionality
 * - Modify form fields or validation
 * - Add social login options
 * - Change success/error messages
 */

import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AuthForm } from '../components/forms/AuthForm';

export const Auth: React.FC = () => {
  const theme = useTheme();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const pageStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    minHeight: '100vh',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    display: 'flex',
    flexDirection: 'column'
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    marginTop: '80px' // Account for fixed navbar
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    // TODO: In real implementation, this would:
    // - Store authentication token
    // - Redirect user to intended page
    // - Update global auth state
  };

  const handleSwitchMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <main style={mainStyle}>
        {!isAuthenticated ? (
          <AuthForm 
            mode={authMode}
            onSuccess={handleAuthSuccess}
            onSwitchMode={handleSwitchMode}
          />
        ) : (
          // Success state after authentication
          <div style={{
            backgroundColor: theme.colors.background,
            borderRadius: '16px',
            padding: theme.spacing.xl,
            boxShadow: theme.shadows.lg,
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <h2 style={{
              fontSize: theme.typography.sizes['2xl'],
              color: theme.colors.primary,
              marginBottom: theme.spacing.lg
            }}>
              ✅ Authentication Successful!
            </h2>
            <p style={{
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.lg,
              lineHeight: 1.6
            }}>
              Welcome! You can now participate in discussions and suggest speakers.
              In a real implementation, you would be automatically redirected.
            </p>
            <button
              style={{
                backgroundColor: theme.colors.primary,
                color: '#ffffff',
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                border: 'none',
                borderRadius: '8px',
                fontSize: theme.typography.sizes.base,
                fontWeight: theme.typography.weights.semibold,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary}
              onClick={() => window.location.href = '#home'}
            >
              🏠 Return to Homepage
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

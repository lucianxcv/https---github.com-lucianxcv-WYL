// ==================== src/pages/Auth.tsx ====================
/**
 * AUTHENTICATION PAGE
 *
 * Standalone page for user login and registration.
 * Now properly integrated with global auth state.
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AuthForm } from '../components/forms/AuthForm';
import { useAuth } from '../utils/useAuth';

export const Auth: React.FC = () => {
  const theme = useTheme();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      window.location.hash = '#home';
    }
  }, [isAuthenticated, isLoading]);

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
    // The useAuth hook will handle the state update
    // and the useEffect above will handle the redirect
    console.log('Auth success - redirect will happen automatically');
  };

  const handleSwitchMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  // Don't render anything if already authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <main style={mainStyle}>
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
              ✅ Already Logged In!
            </h2>
            <p style={{
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.lg,
              lineHeight: 1.6
            }}>
              Redirecting you to the homepage...
            </p>
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
        <AuthForm
          mode={authMode}
          onSuccess={handleAuthSuccess}
          onSwitchMode={handleSwitchMode}
        />
      </main>

      <Footer />
    </div>
  );
};
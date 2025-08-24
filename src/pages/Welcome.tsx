// ==================== src/pages/Welcome.tsx ====================
/**
 * WELCOME PAGE - EMAIL CONFIRMATION
 * 
 * Handles Supabase email confirmation tokens and welcomes new users
 * Simple, professional, and functional
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { supabase } from '../utils/supabase';

export const Welcome: React.FC = () => {
  const theme = useTheme();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    handleEmailConfirmation();
  }, []);

  const handleEmailConfirmation = async () => {
    try {
      // Get the URL parameters for confirmation
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const type = urlParams.get('type');

      if (!token || type !== 'signup') {
        // No token means user navigated here directly
        setStatus('success');
        setMessage('Welcome! Your account is all set. Explore the Wednesday Yachting Luncheon community and join us as we celebrate sailing, yachting, and great company.');
        return;
      }

      // Verify the email confirmation token
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('This confirmation link is invalid or has expired. Please try signing up again.');
        return;
      }

      if (data.user) {
        setStatus('success');
        setUserEmail(data.user.email || '');
        setMessage('🎉 Email confirmed successfully! Your account is now active.');
        
        // User is automatically logged in after confirmation
        console.log('User confirmed and logged in:', data.user);
      }

    } catch (error) {
      console.error('Unexpected error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again or contact support.');
    }
  };

  const handleContinue = () => {
    // Redirect to home page
    window.location.href = '/';
  };

  const handleResendConfirmation = () => {
    // Redirect back to signup
    window.location.href = '/auth';
  };

  // Styles
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

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%'
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#27ae60';
      case 'error':
        return '#e74c3c';
      default:
        return theme.colors.primary;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return '🔄';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '🔄';
    }
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['3xl'],
    color: getStatusColor(),
    marginBottom: theme.spacing.lg,
    fontWeight: theme.typography.weights.bold
  };

  const messageStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    lineHeight: 1.6
  };

  const emailStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    fontStyle: 'italic'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: 'none',
    borderRadius: '8px',
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: theme.typography.fontFamily,
    marginRight: theme.spacing.md
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: theme.colors.primary,
    border: `2px solid ${theme.colors.primary}`
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <main style={mainStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>
            {getStatusIcon()} {status === 'loading' ? 'Confirming...' : 
                                status === 'success' ? 'Welcome!' : 'Oops!'}
          </h1>
          
          <p style={messageStyle}>
            {message}
          </p>

          {userEmail && (
            <p style={emailStyle}>
              Account: {userEmail}
            </p>
          )}

          <div>
            {status === 'success' && (
              <button
                style={buttonStyle}
                onClick={handleContinue}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primary;
                }}
              >
                 Continue to WYL
              </button>
            )}

            {status === 'error' && (
              <>
                <button
                  style={buttonStyle}
                  onClick={handleResendConfirmation}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary;
                  }}
                >
                  🔄 Try Again
                </button>
                
                <button
                  style={secondaryButtonStyle}
                  onClick={handleContinue}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary;
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.primary;
                  }}
                >
                  🏠 Go to Home
                </button>
              </>
            )}

            {status === 'loading' && (
              <div style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.sizes.base
              }}>
                Please wait while we verify your email...
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
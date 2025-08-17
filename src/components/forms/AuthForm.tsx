// ==================== src/components/forms/AuthForm.tsx ====================
/**
 * AUTHENTICATION FORM COMPONENT
 *
 * Now connected to real backend API!
 * Provides login and signup forms with real authentication.
 */
import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../utils/useAuth';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess: () => void;
  onSwitchMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess, onSwitchMode }) => {
  const theme = useTheme();
  const { signIn, signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Signup-specific validation
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      if (mode === 'signup') {
        // Register new user using useAuth hook
        await signUp(formData.email, formData.password, formData.name);
        alert('Account created successfully! Please check your email to verify your account.');
        onSwitchMode(); // Switch to login mode
      } else {
        // Login existing user using useAuth hook
        await signIn(formData.email, formData.password);
        alert('Login successful!');
        onSuccess();
        
        // Redirect based on user role
        // Note: We'll need to wait a moment for auth state to update
        setTimeout(() => {
          // This will be set by useAuth hook after successful login
          window.location.hash = '#home'; // Default redirect
        }, 1000);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setErrors({ 
        general: error.message || 'Authentication failed. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const formStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    borderRadius: '12px',
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    maxWidth: '400px',
    margin: '0 auto'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    fontWeight: theme.typography.weights.bold
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: theme.typography.sizes.base,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    transition: 'border-color 0.3s ease'
  };

  const errorStyle: React.CSSProperties = {
    color: '#e74c3c',
    fontSize: theme.typography.sizes.sm,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.xs,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: '4px',
    border: '1px solid rgba(231, 76, 60, 0.3)'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    padding: theme.spacing.md,
    border: 'none',
    borderRadius: '8px',
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: theme.spacing.md,
    opacity: isSubmitting ? 0.7 : 1,
    fontFamily: theme.typography.fontFamily
  };

  const switchButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.primary,
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fontFamily
  };

  const centerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: theme.colors.textSecondary
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={titleStyle}>
        {mode === 'login' ? '🔐 Login' : '✍️ Sign Up'}
      </h2>

      {errors.general && (
        <div style={errorStyle}>{errors.general}</div>
      )}

      {/* Name field for signup only */}
      {mode === 'signup' && (
        <>
          <input
            style={inputStyle}
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
            onBlur={(e) => e.target.style.borderColor = theme.colors.border}
          />
          {errors.name && <div style={errorStyle}>{errors.name}</div>}
        </>
      )}

      {/* Email field */}
      <input
        style={inputStyle}
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
        onBlur={(e) => e.target.style.borderColor = theme.colors.border}
        autoComplete="email"
      />
      {errors.email && <div style={errorStyle}>{errors.email}</div>}

      {/* Password field */}
      <input
        style={inputStyle}
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
        onBlur={(e) => e.target.style.borderColor = theme.colors.border}
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
      />
      {errors.password && <div style={errorStyle}>{errors.password}</div>}

      {/* Confirm password field for signup only */}
      {mode === 'signup' && (
        <>
          <input
            style={inputStyle}
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
            onBlur={(e) => e.target.style.borderColor = theme.colors.border}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}
        </>
      )}

      {/* Submit button */}
      <button
        type="submit"
        style={buttonStyle}
        disabled={isSubmitting}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.backgroundColor = theme.colors.secondary;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
          }
        }}
      >
        {isSubmitting 
          ? (mode === 'login' ? '🔄 Logging in...' : '🔄 Creating account...') 
          : (mode === 'login' ? '🔐 Login' : '✍️ Create Account')
        }
      </button>

      {/* Switch mode button */}
      <div style={centerStyle}>
        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          style={switchButtonStyle}
          onClick={onSwitchMode}
        >
          {mode === 'login' ? 'Sign up here' : 'Login here'}
        </button>
      </div>
    </form>
  );
};
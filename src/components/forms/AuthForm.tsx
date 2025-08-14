// ==================== src/components/forms/AuthForm.tsx ====================
/**
 * AUTHENTICATION FORM COMPONENT
 * 
 * Provides login and signup forms with form validation and error handling.
 * Currently uses mock authentication - will be connected to real backend later.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change form styling and layout
 * - Add more form fields (name, phone, etc.)
 * - Modify validation rules
 * - Change error message styling
 * - Add social login buttons (Google, Facebook)
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess: () => void;
  onSwitchMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess, onSwitchMode }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    maxWidth: '400px',
    margin: '0 auto'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: theme.typography.sizes.base,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    boxSizing: 'border-box'
  };

  const errorStyle: React.CSSProperties = {
    color: '#ef4444',
    fontSize: theme.typography.sizes.sm,
    marginBottom: theme.spacing.md,
    marginTop: `-${theme.spacing.xs}`
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
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: theme.spacing.md,
    opacity: isSubmitting ? 0.7 : 1
  };

  const linkStyle: React.CSSProperties = {
    color: theme.colors.secondary,
    textDecoration: 'none',
    fontWeight: theme.typography.weights.medium,
    cursor: 'pointer'
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!formData.username) {
        newErrors.username = 'Username is required';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // TODO: Replace with real API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful authentication
      console.log(`${mode} attempt:`, formData);
      alert(`${mode === 'login' ? 'Login' : 'Signup'} successful! (This is just a demo)`);
      
      onSuccess();
    } catch (error) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={titleStyle}>
        {mode === 'login' ? '🔐 Login' : '✍️ Sign Up'}
      </h2>

      {errors.general && (
        <div style={errorStyle}>{errors.general}</div>
      )}

      {/* Username field for signup only */}
      {mode === 'signup' && (
        <>
          <input
            style={inputStyle}
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
          />
          {errors.username && <div style={errorStyle}>{errors.username}</div>}
        </>
      )}

      {/* Email field */}
      <input
        style={inputStyle}
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
      />
      {errors.email && <div style={errorStyle}>{errors.email}</div>}

      {/* Password field */}
      <input
        style={inputStyle}
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
      />
      {errors.password && <div style={errorStyle}>{errors.password}</div>}

      {/* Confirm password for signup only */}
      {mode === 'signup' && (
        <>
          <input
            style={inputStyle}
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
        {isSubmitting ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}
      </button>

      {/* Switch between login/signup */}
      <p style={{ textAlign: 'center', color: theme.colors.textSecondary }}>
        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        <span style={linkStyle} onClick={onSwitchMode}>
          {mode === 'login' ? 'Sign up here' : 'Login here'}
        </span>
      </p>

      {/* Developer note */}
      <div style={{
        marginTop: theme.spacing.lg,
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderRadius: '8px',
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary
      }}>
        <strong>🛠️ Developer Note:</strong> This form currently uses mock authentication. 
        It will be connected to your backend authentication system during implementation.
      </div>
    </form>
  );
};


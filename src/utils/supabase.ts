// ==================== src/utils/supabase.ts - IMPROVED ====================
/**
 * SUPABASE CLIENT CONFIGURATION
 * 
 * Enhanced configuration with proper auth settings and redirect handling
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables with your actual values
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fpuihryuqxaauymcgszd.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdWlocnl1cXhhYXV5bWNnc3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1NDYsImV4cCI6MjA3MDgwMjU0Nn0.gh7nbV9fRPna5l2XBlQnmfs4Qd8kVFnKs9ReWfh1IaA';

// Get the current origin for redirects
const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    // Production URL for Vercel
    if (window.location.hostname.includes('vercel.app')) {
      return 'https://wyl-miron-lucians-projects.vercel.app/#home';
    }
    // For custom domain or other deployments
    return `${window.location.origin}/#home`;
  }
  // Fallback for server-side or local development
  return 'http://localhost:3000/#home';
};

// Create Supabase client with enhanced auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Auto refresh tokens before they expire
    autoRefreshToken: true,
    
    // Persist session in localStorage
    persistSession: true,
    
    // Detect session from URL (important for email confirmations)
    detectSessionInUrl: true,
    
    // Storage key for session data
    storageKey: 'wyl-auth-token',
    
    // Auth flow type
    flowType: 'pkce',
    
    // Debug mode for development
    debug: process.env.NODE_ENV === 'development'
  },
  
  // Global settings
  global: {
    headers: {
      'x-application-name': 'St Francis Yacht Club'
    }
  }
});

// Enhanced auth event handling
export const setupAuthListeners = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔔 Supabase auth event:', event, session?.user?.email);
    
    // Handle specific auth events
    switch (event) {
      case 'SIGNED_IN':
        console.log('✅ User signed in successfully');
        break;
        
      case 'SIGNED_OUT':
        console.log('👋 User signed out');
        // Clear any local storage or cache if needed
        break;
        
      case 'TOKEN_REFRESHED':
        console.log('🔄 Auth token refreshed');
        break;
        
      case 'PASSWORD_RECOVERY':
        console.log('🔑 Password recovery initiated');
        break;
        
      default:
        console.log(`🔔 Auth event: ${event}`);
    }
  });
};

// Helper functions for auth operations
export const authHelpers = {
  // Check if user email is confirmed
  isEmailConfirmed: (user: any) => {
    return user?.email_confirmed_at !== null;
  },
  
  // Get user metadata safely
  getUserMetadata: (user: any) => {
    return {
      name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
      avatar: user?.user_metadata?.avatar_url,
      ...user?.user_metadata
    };
  },
  
  // Format user for your app
  formatUserForApp: (supabaseUser: any) => {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: authHelpers.getUserMetadata(supabaseUser).name,
      avatar: authHelpers.getUserMetadata(supabaseUser).avatar,
      emailConfirmed: authHelpers.isEmailConfirmed(supabaseUser),
      createdAt: supabaseUser.created_at,
      lastSignIn: supabaseUser.last_sign_in_at
    };
  }
};

// Types for better TypeScript support
export type SupabaseUser = {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  created_at?: string;
  last_sign_in_at?: string;
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: SupabaseUser;
};

// Error handling utilities
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  // Common error messages mapping
  const errorMessages: { [key: string]: string } = {
    'Invalid login credentials': 'Invalid email or password. Please try again.',
    'Email not confirmed': 'Please check your email and click the confirmation link.',
    'User already registered': 'An account with this email already exists.',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
    'Invalid email': 'Please enter a valid email address.',
    'Signup requires a valid password': 'Please enter a valid password.',
  };
  
  return errorMessages[error.message] || error.message || 'An unexpected error occurred.';
};

// Initialize auth listeners when module loads
if (typeof window !== 'undefined') {
  setupAuthListeners();
}
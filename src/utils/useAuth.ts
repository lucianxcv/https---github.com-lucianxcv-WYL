// ==================== src/utils/useAuth.ts ====================
/**
 * AUTHENTICATION HOOK
 * 
 * Custom React hook for managing authentication state with Supabase
 * and syncing with your backend
 */

import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { authApi } from './apiService';
import { User, UserRole } from '../data/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    isModerator: false,
  });

  // Load user profile from backend
  const loadUserProfile = async () => {
    try {
      const response = await authApi.getMe();
      if (response.success && response.data) {
        const user = response.data;
        setAuthState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isAdmin: user.role === UserRole.ADMIN,
          isModerator: user.role === UserRole.MODERATOR || user.role === UserRole.ADMIN,
          isLoading: false,
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isModerator: false,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isModerator: false,
        isLoading: false,
      }));
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserProfile();
      } else {
        setAuthState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isModerator: false,
          isLoading: false,
        }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile();
        } else if (event === 'SIGNED_OUT') {
          setAuthState(prev => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isModerator: false,
            isLoading: false,
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Auth actions
  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // User profile will be loaded by the auth state change listener
      console.log('Sign in successful:', data.user?.email);
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // First, create account with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0], // Use email prefix as default name
          }
        }
      });

      if (error) throw error;

      // Then, create user profile in backend
      if (data.user) {
        try {
          await authApi.register({
            email,
            name: name || email.split('@')[0],
          });
        } catch (backendError) {
          console.warn('Backend user creation failed, but Supabase account exists:', backendError);
          // Don't throw here - the user can still sign in later and we'll create the profile then
        }
      }

      console.log('Sign up successful:', data.user?.email);
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!authState.user) throw new Error('Not authenticated');

    try {
      const response = await authApi.updateProfile(profileData);
      if (response.success && response.data) {
        const updatedUser = response.data;
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
          isAdmin: updatedUser.role === UserRole.ADMIN,
          isModerator: updatedUser.role === UserRole.MODERATOR || updatedUser.role === UserRole.ADMIN,
        }));
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (authState.isAuthenticated) {
      await loadUserProfile();
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser,
  };
}
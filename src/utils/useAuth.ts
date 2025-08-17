// ==================== src/utils/useAuth.ts ====================
/**
 * AUTHENTICATION HOOK
 *
 * Custom React hook for managing authentication state with Supabase
 * and syncing with your backend. Now includes fallback for backend failures.
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
  backendError: boolean; // Track if backend is failing
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
    backendError: false,
  });

  // Load user profile from backend with fallback
  const loadUserProfile = async () => {
    try {
      console.log('🔄 Loading user profile from backend...');
      
      // Get current Supabase user first
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (!supabaseUser) {
        console.log('❌ No Supabase user found');
        setAuthState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isModerator: false,
          isLoading: false,
          backendError: false,
        }));
        return;
      }

      try {
        // Try to get user from backend
        const response = await authApi.getMe();

        if (response.success && response.data) {
          console.log('✅ User profile found:', response.data);
          const user = response.data;
          setAuthState(prev => ({
            ...prev,
            user,
            isAuthenticated: true,
            isAdmin: user.role === UserRole.ADMIN,
            isModerator: user.role === UserRole.MODERATOR || user.role === UserRole.ADMIN,
            isLoading: false,
            backendError: false,
          }));
          return;
        }
      } catch (backendError) {
        console.warn('⚠️ Backend unavailable, using Supabase fallback:', backendError);
        
        // Backend is down, create a fallback user from Supabase data
        const fallbackUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          role: UserRole.USER, // Default role when backend is unavailable
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setAuthState(prev => ({
          ...prev,
          user: fallbackUser,
          isAuthenticated: true,
          isAdmin: false, // Can't verify admin status without backend
          isModerator: false,
          isLoading: false,
          backendError: true,
        }));
        return;
      }

      // If we get here, user exists in Supabase but not in backend
      console.log('❌ User profile not found in backend, attempting to create...');

      try {
        const createResponse = await authApi.register({
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User'
        });

        if (createResponse.success) {
          console.log('✅ User profile created successfully');
          // Try to load profile again after creation
          const retryResponse = await authApi.getMe();

          if (retryResponse.success && retryResponse.data) {
            const user = retryResponse.data;
            setAuthState(prev => ({
              ...prev,
              user,
              isAuthenticated: true,
              isAdmin: user.role === UserRole.ADMIN,
              isModerator: user.role === UserRole.MODERATOR || user.role === UserRole.ADMIN,
              isLoading: false,
              backendError: false,
            }));
            return;
          }
        }
      } catch (registrationError) {
        console.error('❌ Failed to create user profile:', registrationError);
        
        // Fall back to Supabase-only auth
        const fallbackUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          role: UserRole.USER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setAuthState(prev => ({
          ...prev,
          user: fallbackUser,
          isAuthenticated: true,
          isAdmin: false,
          isModerator: false,
          isLoading: false,
          backendError: true,
        }));
        return;
      }

      // Final fallback - something went wrong
      console.log('❌ Could not create or load user profile, using Supabase fallback');
      const fallbackUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAuthState(prev => ({
        ...prev,
        user: fallbackUser,
        isAuthenticated: true,
        isAdmin: false,
        isModerator: false,
        isLoading: false,
        backendError: true,
      }));

    } catch (error) {
      console.error('❌ Failed to load user profile:', error);
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isModerator: false,
        isLoading: false,
        backendError: true,
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
          backendError: false,
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
            backendError: false,
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

      // Backend profile creation will be handled by loadUserProfile when they sign in
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

    if (authState.backendError) {
      console.warn('Cannot update profile: backend unavailable');
      throw new Error('Backend unavailable - cannot update profile');
    }

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
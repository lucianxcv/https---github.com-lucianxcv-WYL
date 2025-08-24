// ==================== src/utils/useAuth.ts - UPDATED VERSION ====================
import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { authApi } from './apiService';
import { User, UserRole } from '../data/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  backendError: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ data: any; error: null }>;
}

// Cache for user data to reduce API calls
let userCache: User | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useAuth(): AuthState & AuthActions {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    isModerator: false,
    backendError: false,
  });

  // Enhanced user profile loading with better error handling
  const loadUserProfile = useCallback(async (retryCount = 0) => {
    try {
      console.log('🔄 Loading user profile from backend...');

      // Get current Supabase user first
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();

      if (!supabaseUser) {
        console.log('❌ No Supabase user found');
        userCache = null;
        cacheTimestamp = 0;
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

      // Check if email is confirmed
      if (!supabaseUser.email_confirmed_at) {
        console.log('📧 Email not confirmed yet');
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
          backendError: false,
        }));
        return;
      }

      // Check cache first
      const now = Date.now();
      if (userCache && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('📋 Using cached user profile');
        setAuthState(prev => ({
          ...prev,
          user: userCache,
          isAuthenticated: true,
          isAdmin: userCache?.role === UserRole.ADMIN,
          isModerator: userCache?.role === UserRole.MODERATOR || userCache?.role === UserRole.ADMIN,
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
          
          // Update cache
          userCache = user;
          cacheTimestamp = now;
          
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
      } catch (backendError: any) {
        console.warn('⚠️ Backend unavailable or user not found:', backendError.message);

        // If it's a 404 (user not found), try to create the profile
        if (backendError.message.includes('404') || backendError.message.includes('not found')) {
          console.log('🔄 User not found in backend, creating profile...');
          
          try {
            const createResponse = await authApi.register({
              email: supabaseUser.email!,
              name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User'
            });

            if (createResponse.success && createResponse.data) {
              console.log('✅ User profile created successfully');
              const newUser = createResponse.data;
              
              userCache = newUser;
              cacheTimestamp = now;
              
              setAuthState(prev => ({
                ...prev,
                user: newUser,
                isAuthenticated: true,
                isAdmin: newUser.role === UserRole.ADMIN,
                isModerator: newUser.role === UserRole.MODERATOR || newUser.role === UserRole.ADMIN,
                isLoading: false,
                backendError: false,
              }));
              return;
            }
          } catch (createError) {
            console.error('❌ Failed to create user profile:', createError);
          }
        }

        // Retry logic for transient failures
        if (retryCount < 2) {
          console.log(`🔄 Retrying... (${retryCount + 1}/2)`);
          setTimeout(() => loadUserProfile(retryCount + 1), 1000 * (retryCount + 1));
          return;
        }

        // Final fallback with graceful degradation
        console.log('🆘 Using fallback user profile');
        const fallbackUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          role: UserRole.USER,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        userCache = fallbackUser;
        cacheTimestamp = now - (CACHE_DURATION / 2); // Shorter cache for fallback

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
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

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
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeAuth();

    // Listen for auth changes with debouncing
    let authChangeTimeout: NodeJS.Timeout;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔔 Auth state changed:', event, session?.user?.email);

        // Clear existing timeout
        if (authChangeTimeout) {
          clearTimeout(authChangeTimeout);
        }

        // Debounce auth state changes
        authChangeTimeout = setTimeout(async () => {
          if (!mounted) return;

          if (event === 'SIGNED_IN' && session?.user) {
            // Wait a bit for the database trigger to complete
            setTimeout(() => loadUserProfile(), 1000);
          } else if (event === 'SIGNED_OUT') {
            userCache = null;
            cacheTimestamp = 0;
            setAuthState(prev => ({
              ...prev,
              user: null,
              isAuthenticated: false,
              isAdmin: false,
              isModerator: false,
              isLoading: false,
              backendError: false,
            }));
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            // Refresh user profile on token refresh
            await loadUserProfile();
          }
        }, 500);
      }
    );

    return () => {
      mounted = false;
      if (authChangeTimeout) {
        clearTimeout(authChangeTimeout);
      }
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  // Enhanced signup with better profile creation
  const signUp = async (email: string, password: string, name?: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
          // UPDATED: Redirect to /welcome page for email confirmation
          emailRedirectTo: `${window.location.origin}/welcome`
        }
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        // User needs to confirm email
        console.log('📧 Please check email for confirmation');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      console.log('✅ Sign up successful:', data.user?.email);
      // Profile will be created by database trigger
      // User profile loading will happen via auth state change listener
      
    } catch (error) {
      console.error('❌ Sign up error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // NEW: Check if email is verified - prevents unverified login
      if (data.user && !data.user.email_confirmed_at) {
        // Sign out the user if email is not verified
        await supabase.auth.signOut();
        throw new Error('Please verify your email address before signing in. Check your inbox for a confirmation link.');
      }

      console.log('✅ Sign in successful:', data.user?.email);
      // User profile will be loaded by the auth state change listener
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Clear cache
      userCache = null;
      cacheTimestamp = 0;

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
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
        
        // Update cache
        userCache = updatedUser;
        cacheTimestamp = Date.now();
        
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
      // Clear cache to force refresh
      userCache = null;
      cacheTimestamp = 0;
      await loadUserProfile();
    }
  };

  // NEW: Resend confirmation email function
  const resendConfirmation = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Resend confirmation error:', error);
      throw error;
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser,
    resendConfirmation, // NEW: Added resend confirmation function
  };
}
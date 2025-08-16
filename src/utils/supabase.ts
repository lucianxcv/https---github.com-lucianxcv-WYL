// ==================== src/utils/supabase.ts ====================
/**
 * SUPABASE CLIENT CONFIGURATION
 * 
 * This file configures the Supabase client for authentication and database access.
 * The client is used throughout the app for auth operations and API calls.
 */

import { createClient } from '@supabase/supabase-js';

// These will come from your Supabase project settings
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types for Supabase auth
export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  user: SupabaseUser;
};
// ==================== src/utils/apiService.ts ====================
/**
 * ENHANCED API SERVICE
 * 
 * Complete API service with authentication, posts, and admin functionality
 */

import { supabase } from './supabase';
import { 
  Post, CreatePostData, UpdatePostData, User, AdminStats,
  Comment, CreateCommentData, ApiResponse, PaginatedResponse
} from '../data/types';

const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// API Base URL configuration
const API_BASE_URL = isDevelopment || isLocalhost
  ? 'http://localhost:5000'
  : 'https://wyl-backend.vercel.app';

console.log('🌍 API Base URL:', API_BASE_URL);
console.log('🔍 Environment:', { isDevelopment, isLocalhost });

// Generic API request function with auth support
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`🚀 API Request: ${options.method || 'GET'} ${url}`);

  // Get auth token from Supabase session
  const { data: { session } } = await supabase.auth.getSession();
  const authToken = session?.access_token;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Response Data:', data);
    return data;
  } catch (error) {
    console.error('🚨 API Request Failed:', error);
    throw error;
  }
}

// ==================== AUTHENTICATION API ====================
export const authApi = {
  // Get current user profile
  getMe: () => apiRequest<ApiResponse<User>>('/api/auth/me'),

  // Register user (creates profile in backend after Supabase signup)
  register: (userData: { email: string; name?: string }) => 
    apiRequest<ApiResponse<User>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Update user profile
  updateProfile: (profileData: Partial<User>) =>
    apiRequest<ApiResponse<User>>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Delete user account
  deleteAccount: () =>
    apiRequest<ApiResponse<null>>('/api/auth/delete-account', {
      method: 'DELETE',
    }),
};

// ==================== POSTS/BLOG API ====================
export const postsApi = {
  // Get all published posts (public)
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    published?: boolean;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.published !== undefined) query.set('published', params.published.toString());
    
    return apiRequest<PaginatedResponse<Post>>(`/api/posts?${query.toString()}`);
  },

  // Get single post by ID
  getById: (id: string) => 
    apiRequest<ApiResponse<Post>>(`/api/posts/${id}`),

  // Get single post by slug (SEO-friendly)
  getBySlug: (slug: string) =>
    apiRequest<ApiResponse<Post>>(`/api/posts/slug/${slug}`),

  // Create new post (requires auth)
  create: (postData: CreatePostData) =>
    apiRequest<ApiResponse<Post>>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

  // Update existing post (requires auth + ownership/admin)
  update: (id: string, postData: UpdatePostData) =>
    apiRequest<ApiResponse<Post>>(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),

  // Delete post (requires auth + ownership/admin)
  delete: (id: string) =>
    apiRequest<ApiResponse<null>>(`/api/posts/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== ADMIN API ====================
export const adminApi = {
  // Get admin dashboard statistics
  getStats: () =>
    apiRequest<ApiResponse<AdminStats>>('/api/admin/stats'),

  // User management
  users: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', params.page.toString());
      if (params?.limit) query.set('limit', params.limit.toString());
      if (params?.search) query.set('search', params.search);
      if (params?.role) query.set('role', params.role);
      
      return apiRequest<PaginatedResponse<User>>(`/api/admin/users?${query.toString()}`);
    },

    getById: (id: string) =>
      apiRequest<ApiResponse<User>>(`/api/admin/users/${id}`),

    updateRole: (id: string, role: string) =>
      apiRequest<ApiResponse<User>>(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      }),

    delete: (id: string) =>
      apiRequest<ApiResponse<null>>(`/api/admin/users/${id}`, {
        method: 'DELETE',
      }),
  },

  // Post management (admin can see/edit all posts)
  posts: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      published?: boolean;
    }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', params.page.toString());
      if (params?.limit) query.set('limit', params.limit.toString());
      if (params?.search) query.set('search', params.search);
      if (params?.published !== undefined) query.set('published', params.published.toString());
      
      return apiRequest<PaginatedResponse<Post>>(`/api/admin/posts?${query.toString()}`);
    },

    create: (postData: CreatePostData) =>
      apiRequest<ApiResponse<Post>>('/api/admin/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      }),

    update: (id: string, postData: UpdatePostData) =>
      apiRequest<ApiResponse<Post>>(`/api/admin/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData),
      }),

    delete: (id: string) =>
      apiRequest<ApiResponse<null>>(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      }),
  },

  // Comment moderation
  comments: {
    getPending: () =>
      apiRequest<ApiResponse<Comment[]>>('/api/admin/comments/pending'),

    approve: (id: string) =>
      apiRequest<ApiResponse<Comment>>(`/api/admin/comments/${id}/approve`, {
        method: 'PUT',
      }),

    reject: (id: string) =>
      apiRequest<ApiResponse<Comment>>(`/api/admin/comments/${id}/reject`, {
        method: 'PUT',
      }),

    delete: (id: string) =>
      apiRequest<ApiResponse<null>>(`/api/admin/comments/${id}`, {
        method: 'DELETE',
      }),
  },
};

// ==================== EXISTING API FUNCTIONS ====================

// Weather API functions - matching your weatherService.ts imports
export const weatherAPI = {
  getAllLocations: () => apiRequest<any[]>('/api/weather/locations'),
  getLocation: (locationId: string) => apiRequest<any>(`/api/weather/location/${locationId}`),
  updateWeather: () => apiRequest<any>('/api/weather/update', { method: 'POST' }),
  getCurrentWeather: (lat: number, lon: number) =>
    apiRequest<any>(`/api/weather/current?lat=${lat}&lon=${lon}`),
  getForecast: (lat: number, lon: number) =>
    apiRequest<any>(`/api/weather/forecast?lat=${lat}&lon=${lon}`),
};

// Also export as weatherApi for consistency
export const weatherApi = weatherAPI;

// Speakers API functions
export const speakersApi = {
  getAll: () => apiRequest<any[]>('/api/speakers'),
  getById: (id: string) => apiRequest<any>(`/api/speakers/${id}`),
  create: (speaker: any) => apiRequest<any>('/api/speakers', {
    method: 'POST',
    body: JSON.stringify(speaker),
  }),
  update: (id: string, speaker: any) => apiRequest<any>(`/api/speakers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(speaker),
  }),
  delete: (id: string) => apiRequest<any>(`/api/speakers/${id}`, {
    method: 'DELETE',
  }),
};

// Shows API functions
export const showsApi = {
  getAll: () => apiRequest<any[]>('/api/shows'),
  getById: (id: string) => apiRequest<any>(`/api/shows/${id}`),
  create: (show: any) => apiRequest<any>('/api/shows', {
    method: 'POST',
    body: JSON.stringify(show),
  }),
  update: (id: string, show: any) => apiRequest<any>(`/api/shows/${id}`, {
    method: 'PUT',
    body: JSON.stringify(show),
  }),
  delete: (id: string) => apiRequest<any>(`/api/shows/${id}`, {
    method: 'DELETE',
  }),
};

// Comments API functions
export const commentsApi = {
  getAll: () => apiRequest<any[]>('/api/comments'),
  getById: (id: string) => apiRequest<any>(`/api/comments/${id}`),
  getByShow: (showId: string) => apiRequest<any[]>(`/api/comments/show/${showId}`),
  create: (comment: any) => apiRequest<any>('/api/comments', {
    method: 'POST',
    body: JSON.stringify(comment),
  }),
  update: (id: string, comment: any) => apiRequest<any>(`/api/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(comment),
  }),
  delete: (id: string) => apiRequest<any>(`/api/comments/${id}`, {
    method: 'DELETE',
  }),
};

// Owner API functions
export const ownerApi = {
  getProfile: () => apiRequest<any>('/api/owner/profile'),
  updateProfile: (profile: any) => apiRequest<any>('/api/owner/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  }),
  getStats: () => apiRequest<any>('/api/owner/stats'),
};
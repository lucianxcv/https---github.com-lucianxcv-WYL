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

// Generic API request function with IMPROVED error handling
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
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      
      try {
        // 🔧 IMPROVED: Try to extract the actual error message from JSON response
        const errorData = await response.json();
        console.log('❌ API Error Response:', errorData);
        
        // Use the specific error message from backend if available
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        // Handle common HTTP status codes with better messages
        if (response.status === 401) {
          errorMessage = errorData.error || 'Authentication required. Please sign in.';
        } else if (response.status === 403) {
          errorMessage = errorData.error || 'Permission denied. You do not have access to this resource.';
        } else if (response.status === 404) {
          errorMessage = errorData.error || 'The requested resource was not found.';
        } else if (response.status === 429) {
          errorMessage = errorData.error || 'Too many requests. Please try again later.';
        } else if (response.status >= 500) {
          errorMessage = errorData.error || 'Server error. Please try again later.';
        }
        
      } catch (parseError) {
        // If we can't parse JSON, fall back to text or generic message
        try {
          const errorText = await response.text();
          console.error('❌ API Error Response (text):', errorText);
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (textError) {
          // Keep the original generic message
          console.error('❌ Could not parse error response:', textError);
        }
      }
      
      throw new Error(errorMessage);
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
      category?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', params.page.toString());
      if (params?.limit) query.set('limit', params.limit.toString());
      if (params?.search) query.set('search', params.search);
      if (params?.published !== undefined) query.set('published', params.published.toString());
      if (params?.category) query.set('category', params.category);
      
      return apiRequest<PaginatedResponse<Post>>(`/api/admin/posts?${query.toString()}`);
    },

    getById: (id: string) =>
      apiRequest<ApiResponse<Post>>(`/api/admin/posts/${id}`),

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

    publish: (id: string) =>
      apiRequest<ApiResponse<Post>>(`/api/admin/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'published' }),
      }),

    unpublish: (id: string) =>
      apiRequest<ApiResponse<Post>>(`/api/admin/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'draft' }),
      }),
  },

  // Speakers management (using posts with speaker category)
  speakers: {
    getAll: () => 
      apiRequest<PaginatedResponse<Post>>('/api/admin/posts?category=speaker'),
      
    create: (speakerData: {
      title: string;
      content: string;
      topic?: string;
      presentationDate?: string;
      status?: 'upcoming' | 'past';
    }) =>
      apiRequest<ApiResponse<Post>>('/api/admin/posts', {
        method: 'POST',
        body: JSON.stringify({
          ...speakerData,
          category: 'speaker',
          type: 'speaker'
        })
      }),
      
    update: (id: string, speakerData: any) =>
      apiRequest<ApiResponse<Post>>(`/api/admin/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(speakerData)
      }),
      
    delete: (id: string) =>
      apiRequest<ApiResponse<null>>(`/api/admin/posts/${id}`, {
        method: 'DELETE'
      })
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

// ==================== WEATHER API ====================
export const weatherApi = {
  getAllLocations: () => apiRequest<any[]>('/api/weather/locations'),
  getLocation: (locationId: string) => apiRequest<any>(`/api/weather/location/${locationId}`),
  updateWeather: () => apiRequest<any>('/api/weather/update', { method: 'POST' }),
  getCurrentWeather: (lat: number, lon: number) =>
    apiRequest<any>(`/api/weather/current?lat=${lat}&lon=${lon}`),
  getForecast: (lat: number, lon: number) =>
    apiRequest<any>(`/api/weather/forecast?lat=${lat}&lon=${lon}`),
};

// ==================== OTHER EXISTING APIS ====================

// Speakers API functions (legacy - will be replaced by adminApi.speakers)
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

// ==================== UPDATED COMMENTS API ====================
// Simple comments API that matches the new backend structure

export const commentsApi = {
  // Get all comments (general or filtered)
  getAll: (params?: {
    showId?: string;
    postId?: string;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.showId) query.set('showId', params.showId);
    if (params?.postId) query.set('postId', params.postId);
    if (params?.limit) query.set('limit', params.limit.toString());
    
    return apiRequest<any[]>(`/api/comments?${query.toString()}`);
  },

  // Get comment by ID
  getById: (id: string) => 
    apiRequest<any>(`/api/comments/${id}`),

  // Get comments for specific show
  getByShow: (showId: string) => 
    apiRequest<any[]>(`/api/comments/show/${showId}`),

  // Create new comment (simplified - no author field needed)
  create: (commentData: {
    content: string;
    showId?: number;    // Backend expects number
    postId?: string;
  }) => 
    apiRequest<any>('/api/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),

  // Update comment (edit own comments)
  update: (id: string, commentData: {
    content: string;
  }) => 
    apiRequest<any>(`/api/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    }),

  // Delete comment
  delete: (id: string) => 
    apiRequest<any>(`/api/comments/${id}`, {
      method: 'DELETE',
    }),

  // Remove these unsupported methods:
  // updateReaction - not supported by backend yet
  // removeReaction - not supported by backend yet  
  // report - not supported by backend yet
  // getReactions - not supported by backend yet
};
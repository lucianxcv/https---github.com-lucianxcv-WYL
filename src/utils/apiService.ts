const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// API Base URL configuration - using main domain
const API_BASE_URL = isDevelopment || isLocalhost 
  ? 'http://localhost:3000'
  : 'https://wyl-backend.vercel.app';

console.log('🌍 API Base URL:', API_BASE_URL);
console.log('🔍 Environment:', { isDevelopment, isLocalhost });

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🚀 API Request: ${options.method || 'GET'} ${url}`);
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
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
// ==================== src/data/types.ts ====================
/**
 * TYPE DEFINITIONS
 *
 * This file contains all the TypeScript types used throughout the project.
 * Think of types as "blueprints" that tell TypeScript what shape our data should have.
 *
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Add new fields to existing types (e.g., add 'email' to Speaker type)
 * - Create new types for new features (e.g., Comment type, User type)
 * - Change optional fields by adding/removing the '?' after field names
 */

// ============== AUTH & USER TYPES ==============

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: AuthUser;
  session: any; // Supabase session object
}

// ============== CONTENT TYPES ==============

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: User;
  categories: Category[];
  tags: Tag[];
  comments: Comment[];
  views: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

// ============== ENHANCED SPEAKER TYPES ==============

export interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  nextPresentationDate?: string;
  topic?: string;
  presentationTitle?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  presentations: Presentation[];
}

export interface CreateSpeakerData {
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  nextPresentationDate?: string;
  topic?: string;
  presentationTitle?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  videoUrl?: string;
  slidesUrl?: string;
  duration?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  speakerId: string;
  speaker: Speaker;
}

// ============== ENHANCED COMMENT TYPES ==============

export interface Comment {
  id: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: User;
  postId?: string;
  post?: Post;
  parentId?: string;
  parent?: Comment;
  replies: Comment[];
}

export enum CommentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SPAM = 'SPAM'
}

export interface CreateCommentData {
  content: string;
  postId?: string;
  parentId?: string;
}

// ============== EXISTING TYPES (Enhanced) ==============

// Past show/video information
export interface PastShow {
  id: number;
  title: string;
  speakerName: string;
  videoId: string; // YouTube video ID
  date: string; // ISO date string
  year: number;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Owner/Captain information
export interface Owner {
  id: string;
  name: string;
  title: string;
  bio: string;
  achievements: string[]; // JSON string of achievements array
  photoUrl?: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// Weather data types
export interface WeatherData {
  id?: number;
  location: string;
  temperature: number;
  windSpeed: number;
  windDirection: number;
  windDirectionText: string;
  description: string;
  icon: string;
  visibility: number;
  humidity: number;
  pressure: number;
  sailingCondition: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  sailingDifficulty: 'Beginner' | 'Intermediate' | 'Expert' | 'Dangerous';
  locationId: string;
  lastUpdated: string;
}

export interface SailingLocation {
  id: string;
  name: string;
  shortName: string;
  coordinates: { lat: number; lon: number };
  description: string;
  skillLevel: "Beginner" | "Intermediate" | "Expert" | "All Levels" | string;
  features: string[];
  weather?: WeatherData;
}

export interface TideData {
  nextHigh: {
    time: string;
    height: number;
  };
  nextLow: {
    time: string;
    height: number;
  };
}

export interface SailingConditions {
  weather: WeatherData;
  tides: TideData;
  memberReports: MemberReport[];
}

export interface MemberReport {
  id: string;
  memberName: string;
  location: string;
  conditions: string;
  photoUrl?: string;
  timestamp: string;
  isVerified: boolean;
}

// ============== THEME TYPES ==============

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  gold: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
}

export interface Theme {
  colors: ThemeColors;
  shadows: ThemeShadows;
  typography: any;
  spacing: any;
  isDark: boolean;
  toggleTheme: () => void;
}

// ============== API RESPONSE TYPES ==============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============== FORM TYPES ==============

export interface FormErrors {
  [key: string]: string;
}

export interface FormState<T> {
  data: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isValid: boolean;
}

// ============== ADMIN TYPES ==============

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalSpeakers: number;
  pendingComments: number;
  publishedPosts: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentComments: Comment[];
  recentPosts: Post[];
  recentUsers: User[];
}

// ============== LEGACY TYPES (Keep for compatibility) ==============

export interface SpeakerSuggestion {
  id: number;
  suggestedBy: string;
  speakerName: string;
  topic: string;
  reason: string;
  contactInfo?: string;
  status: 'pending' | 'approved' | 'declined';
}
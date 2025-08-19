/**
 * BLOG POSTS HOOK
 * 
 * Save this file as: src/hooks/useBlogPosts.ts
 */

import { useState, useEffect } from 'react';
import { adminApi } from '../utils/apiService';

interface BlogPost {
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
  author: {
    id: string;
    name?: string;
    email: string;
  };
  views: number;
}

interface UseBlogPostsReturn {
  posts: BlogPost[];
  latestPosts: BlogPost[];
  featuredPosts: BlogPost[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useBlogPosts = (): UseBlogPostsReturn => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from your blog API
      const response = await adminApi.posts.getAll({ 
        published: true, 
        limit: 10 
      });

      if (response.success && response.data) {
        setPosts(response.data);
      } else {
        // Fallback to mock data if API isn't ready
        const mockPosts: BlogPost[] = [
          {
            id: '1',
            title: 'Maritime Weather Patterns in San Francisco Bay',
            slug: 'maritime-weather-patterns-sf-bay',
            content: '<p>Understanding the unique weather patterns of San Francisco Bay is crucial for safe and enjoyable sailing...</p>',
            excerpt: 'A comprehensive guide to understanding and predicting weather patterns in the San Francisco Bay area for optimal sailing conditions.',
            coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
            published: true,
            publishedAt: '2024-12-20T10:00:00Z',
            createdAt: '2024-12-20T09:00:00Z',
            updatedAt: '2024-12-20T10:00:00Z',
            authorId: 'admin',
            author: {
              id: 'admin',
              name: 'Captain WYL',
              email: 'admin@wyl.com'
            },
            views: 245
          },
          {
            id: '2',
            title: 'The Art of Celestial Navigation',
            slug: 'art-of-celestial-navigation',
            content: '<p>Before GPS revolutionized navigation, sailors relied on the stars, sun, and moon to find their way across vast oceans...</p>',
            excerpt: 'Exploring the timeless techniques of celestial navigation and their relevance in modern sailing.',
            coverImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
            published: true,
            publishedAt: '2024-12-18T14:00:00Z',
            createdAt: '2024-12-18T13:00:00Z',
            updatedAt: '2024-12-18T14:00:00Z',
            authorId: 'admin',
            author: {
              id: 'admin',
              name: 'Captain WYL',
              email: 'admin@wyl.com'
            },
            views: 189
          },
          {
            id: '3',
            title: 'Speaker Spotlight: Captain Sarah Johnson',
            slug: 'speaker-spotlight-captain-sarah-johnson',
            content: '<p>Meet Captain Sarah Johnson, our featured speaker for this week\'s Wednesday Yachting Luncheon...</p>',
            excerpt: 'Get to know Captain Sarah Johnson, maritime expert and this week\'s featured speaker.',
            coverImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=800',
            published: true,
            publishedAt: '2024-12-22T16:00:00Z',
            createdAt: '2024-12-22T15:00:00Z',
            updatedAt: '2024-12-22T16:00:00Z',
            authorId: 'admin',
            author: {
              id: 'admin',
              name: 'Captain WYL',
              email: 'admin@wyl.com'
            },
            views: 156
          }
        ];
        setPosts(mockPosts);
      }
    } catch (err) {
      setError('Failed to load blog posts');
      console.error('Error fetching blog posts:', err);
      
      // Even on error, show mock data for development
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Welcome to the WYL Blog',
          slug: 'welcome-wyl-blog',
          content: '<p>Welcome to our new blog...</p>',
          excerpt: 'Introduction to our maritime blog and what to expect.',
          published: true,
          publishedAt: '2024-12-20T10:00:00Z',
          createdAt: '2024-12-20T09:00:00Z',
          updatedAt: '2024-12-20T10:00:00Z',
          authorId: 'admin',
          author: {
            id: 'admin',
            name: 'Captain WYL',
            email: 'admin@wyl.com'
          },
          views: 0
        }
      ];
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Helper to get latest posts (most recent 3-4)
  const getLatestPosts = (): BlogPost[] => {
    return posts
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
      .slice(0, 3);
  };

  // Helper to get featured posts (could be based on views or manual curation)
  const getFeaturedPosts = (): BlogPost[] => {
    return posts
      .sort((a, b) => b.views - a.views)
      .slice(0, 4);
  };

  return {
    posts,
    latestPosts: getLatestPosts(),
    featuredPosts: getFeaturedPosts(),
    loading,
    error,
    refetch: fetchBlogPosts
  };
};
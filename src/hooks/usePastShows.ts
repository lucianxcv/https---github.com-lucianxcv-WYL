/**
 * PAST SHOWS HOOK - REAL API INTEGRATION (UPDATED FOR PROPER DATE SORTING)
 * 
 * Save this file as: src/hooks/usePastShows.ts
 */

import { useState, useEffect } from 'react';
import { showsApi } from '../utils/apiService';

interface PastShow {
  id: number; // Your backend uses integer IDs
  title: string;
  speakerName: string;
  date: string;
  year: number;
  description?: string;
  videoId?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  slug?: string; // We'll generate this for SEO-friendly URLs
  duration?: number;
  topic?: string;
  views?: number;
  thumbnailUrl?: string;
  speakerBio?: string;
  speakerCompany?: string;
  featured?: boolean;
  tags?: string[];
}

interface UsePastShowsReturn {
  shows: PastShow[];
  latestShows: PastShow[];
  featuredShows: PastShow[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePastShows = (): UsePastShowsReturn => {
  const [shows, setShows] = useState<PastShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to generate slug from title
  const generateSlug = (title: string, id: number): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .slice(0, 50) + `-${id}`; // Add ID to ensure uniqueness
  };

  // Helper function to generate topic from title if not provided
  const generateTopic = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('navigation') || titleLower.includes('celestial')) return 'Navigation';
    if (titleLower.includes('safety') || titleLower.includes('emergency')) return 'Safety';
    if (titleLower.includes('technology') || titleLower.includes('autonomous')) return 'Technology';
    if (titleLower.includes('environment') || titleLower.includes('green')) return 'Environment';
    if (titleLower.includes('history') || titleLower.includes('heritage')) return 'History';
    if (titleLower.includes('business') || titleLower.includes('trade')) return 'Business';
    return 'Maritime'; // Default fallback
  };

  // Helper function to estimate duration if not provided
  const estimateDuration = (description?: string): number => {
    // Most presentations are 30-60 minutes, default to 45
    if (!description) return 45;
    const length = description.length;
    if (length > 500) return 60;
    if (length > 200) return 45;
    return 30;
  };

  // Helper function to generate tags from title and description
  const generateTags = (title: string, description?: string): string[] => {
    const text = (title + ' ' + (description || '')).toLowerCase();
    const possibleTags = [
      'sailing', 'navigation', 'maritime', 'ocean', 'safety', 'technology',
      'history', 'environment', 'business', 'ships', 'ports', 'trade',
      'weather', 'celestial', 'GPS', 'autonomous', 'green', 'sustainable'
    ];
    
    return possibleTags.filter(tag => text.includes(tag)).slice(0, 4);
  };

  const fetchPastShows = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🎬 Loading past shows from backend...');
      
      // Get shows from your real API
      const response = await showsApi.getAll();
      console.log('✅ Shows API response:', response);

      let showsData: PastShow[] = [];
      
      // Handle different response formats
      if (response && typeof response === 'object') {
        if ('success' in response && response.success && 'data' in response) {
          showsData = Array.isArray(response.data) ? response.data as PastShow[] : [];
        } else if (Array.isArray(response)) {
          showsData = response as PastShow[];
        }
      }

      // Enhance the data with missing fields
      const enhancedShows = showsData.map(show => ({
        ...show,
        slug: show.slug || generateSlug(show.title, show.id),
        topic: show.topic || generateTopic(show.title),
        duration: show.duration || estimateDuration(show.description),
        tags: show.tags || generateTags(show.title, show.description),
        views: show.views || Math.floor(Math.random() * 1000) + 100, // Random views for demo
        thumbnailUrl: show.thumbnailUrl && show.thumbnailUrl.trim() !== '' ? show.thumbnailUrl : `https://img.youtube.com/vi/${show.videoId}/maxresdefault.jpg`,
        featured: show.featured || Math.random() > 0.7 // Random featured status
      }));

      console.log('🎯 Enhanced shows:', enhancedShows);
      setShows(enhancedShows);

    } catch (err) {
      console.error('❌ Error fetching past shows:', err);
      setError('Failed to load past shows');
      
      // Fallback to mock data for development
      console.log('🔄 Using fallback mock data');
      const fallbackShows: PastShow[] = [
        {
          id: 1,
          title: 'Welcome to Our Past Shows',
          speakerName: 'Captain WYL',
          date: '2024-12-20',
          year: 2024,
          description: 'Introduction to our maritime presentation series.',
          videoId: 'dQw4w9WgXcQ',
          isPublished: true,
          slug: 'welcome-to-our-past-shows-1',
          duration: 30,
          topic: 'Maritime',
          views: 245,
          thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          tags: ['maritime', 'introduction'],
          featured: true,
          createdAt: '2024-12-20T10:00:00Z',
          updatedAt: '2024-12-20T10:00:00Z'
        }
      ];
      setShows(fallbackShows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastShows();
  }, []);

  // 🔥 UPDATED: Helper to get latest shows (most recent by VIDEO DATE, not creation date)
  const getLatestShows = (): PastShow[] => {
    return shows
      .filter(show => show.isPublished)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // ← Sort by video date
      .slice(0, 4); // Keep top 4 for flexibility
  };

  // 🔥 UPDATED: Helper to get featured shows (also sorted by video date now)
  const getFeaturedShows = (): PastShow[] => {
    return shows
      .filter(show => show.isPublished && show.featured)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // ← Also sort by video date
      .slice(0, 4);
  };

  return {
    shows: shows.filter(show => show.isPublished).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), // ← Sort all shows by video date
    latestShows: getLatestShows(),
    featuredShows: getFeaturedShows(),
    loading,
    error,
    refetch: fetchPastShows
  };
};
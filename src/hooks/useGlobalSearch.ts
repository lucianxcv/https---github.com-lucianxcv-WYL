/**
 * GLOBAL SEARCH HOOK
 * 
 * Save this file as: src/hooks/useGlobalSearch.ts
 */

import { useState, useMemo } from 'react';
import { useSpeakers } from './useSpeakers';
import { useBlogPosts } from './useBlogPosts';

type SearchResultType = 'speaker' | 'blog' | 'presentation';

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  date?: string;
  metadata?: any;
}

interface UseGlobalSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  results: SearchResult[];
  loading: boolean;
  resultCounts: {
    speakers: number;
    blogs: number;
    presentations: number;
    total: number;
  };
  filterByType: (type: SearchResultType | 'all') => SearchResult[];
}

export const useGlobalSearch = (): UseGlobalSearchReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const { speakers, loading: speakersLoading } = useSpeakers();
  const { posts, loading: postsLoading } = useBlogPosts();

  const loading = speakersLoading || postsLoading;

  // Combine all searchable content
  const allResults = useMemo((): SearchResult[] => {
    const results: SearchResult[] = [];

    // Add speakers to search results
    speakers.forEach(speaker => {
      const searchableText = `${speaker.name} ${speaker.title} ${speaker.bio} ${speaker.topic || ''}`.toLowerCase();
      if (searchTerm === '' || searchableText.includes(searchTerm.toLowerCase())) {
        results.push({
          id: speaker.id,
          type: 'speaker',
          title: speaker.name,
          description: `${speaker.title} - ${speaker.topic || 'Maritime Expert'}`,
          url: `#speaker-${speaker.id}`,
          imageUrl: speaker.photoUrl,
          date: speaker.nextPresentationDate,
          metadata: speaker
        });
      }
    });

    // Add blog posts to search results
    posts.forEach(post => {
      const searchableText = `${post.title} ${post.excerpt || ''} ${post.content}`.toLowerCase();
      if (searchTerm === '' || searchableText.includes(searchTerm.toLowerCase())) {
        results.push({
          id: post.id,
          type: 'blog',
          title: post.title,
          description: post.excerpt || post.content.substring(0, 150) + '...',
          url: `#blog-${post.slug}`,
          imageUrl: post.coverImage,
          date: post.publishedAt || post.createdAt,
          metadata: post
        });
      }
    });

    // TODO: Add past presentations when integrated
    // presentations.forEach(presentation => { ... });

    return results.sort((a, b) => {
      // Sort by relevance (exact matches first) then by date
      const aRelevance = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
      const bRelevance = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
      
      if (aRelevance !== bRelevance) {
        return bRelevance - aRelevance;
      }
      
      // Then sort by date (newest first)
      const aDate = new Date(a.date || 0).getTime();
      const bDate = new Date(b.date || 0).getTime();
      return bDate - aDate;
    });
  }, [speakers, posts, searchTerm]);

  // Calculate result counts by type
  const resultCounts = useMemo(() => {
    const counts = {
      speakers: allResults.filter(r => r.type === 'speaker').length,
      blogs: allResults.filter(r => r.type === 'blog').length,
      presentations: allResults.filter(r => r.type === 'presentation').length,
      total: allResults.length
    };
    return counts;
  }, [allResults]);

  // Filter results by type
  const filterByType = (type: SearchResultType | 'all'): SearchResult[] => {
    if (type === 'all') return allResults;
    return allResults.filter(result => result.type === type);
  };

  return {
    searchTerm,
    setSearchTerm,
    results: allResults,
    loading,
    resultCounts,
    filterByType
  };
};
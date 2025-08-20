// Fix your useGlobalSearch hook in hooks/useGlobalSearch.ts

import { useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  type: 'speaker' | 'blog' | 'presentation' | 'weather';
  excerpt?: string;
  category?: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
}

interface UseGlobalSearchReturn {
  searchResults: SearchResult[];
  loading: boolean;
  search: (query: string) => Promise<void>;
}

export const useGlobalSearch = (): UseGlobalSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call with sample data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Captain Rodriguez Maritime Safety',
          type: 'speaker' as const,
          excerpt: 'Expert in maritime safety protocols and navigation',
          category: 'Safety',
          date: '2024-01-15'
        },
        {
          id: '2',
          title: 'Understanding Weather Patterns',
          type: 'blog' as const,
          excerpt: 'Learn how to read maritime weather conditions',
          category: 'Weather',
          date: '2024-01-10'
        },
        {
          id: '3',
          title: 'Storm Navigation Techniques',
          type: 'presentation' as const,
          excerpt: 'Advanced techniques for navigating in storms',
          category: 'Navigation',
          date: '2024-01-08'
        },
        {
          id: '4',
          title: 'San Francisco Bay Weather',
          type: 'weather' as const,
          excerpt: 'Current weather conditions in the bay area',
          category: 'Weather',
          date: '2024-01-20'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchResults,
    loading,
    search
  };
};
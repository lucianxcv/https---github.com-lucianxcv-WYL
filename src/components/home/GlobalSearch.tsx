/**
 * FUNCTIONAL GLOBAL SEARCH COMPONENT
 * 
 * Simple search for show titles and article titles
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { showsApi, postsApi } from '../../utils/apiService';


interface SearchResult {
  id: string;
  title: string;
  type: 'show' | 'article';
  description?: string;
  speakerName?: string; // For shows
  author?: string;      // For articles
  date?: string;
  slug?: string;
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onResultClick }) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 3) {
        performSearch(query);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const performSearch = async (searchQuery: string) => {
  if (!searchQuery || searchQuery.length < 3) return;

  setLoading(true);
  try {
    console.log('🔍 Searching for:', searchQuery);

    // Search both shows and posts
    const [showsResponse, postsResponse] = await Promise.all([
      showsApi.getAll() as any, // Cast to any to handle the type mismatch
      postsApi.getAll({ search: searchQuery, limit: 3, published: true })
    ]);

    console.log('📊 Raw API responses:', { 
      showsResponse, 
      postsResponse 
    });

    // Extract arrays from response objects - handle multiple possible formats
    let allShows: any[] = [];
    if (Array.isArray(showsResponse)) {
      // If it's already an array
      allShows = showsResponse;
    } else if (showsResponse && Array.isArray(showsResponse.data)) {
      // If it's wrapped in {data: [...]}
      allShows = showsResponse.data;
    } else if (showsResponse) {
      // Log what we actually got to debug
      console.log('🤔 Unexpected shows response format:', showsResponse);
    }

    const allPosts = postsResponse?.data || [];

    console.log('📊 Extracted arrays:', { 
      shows: allShows.length,
      posts: allPosts.length
    });

    // Filter shows client-side (since showsApi doesn't support search)
    const filteredShows = allShows.filter((show: any) =>
      show.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.speakerName?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3); // Limit to 3 results

    // Posts are already filtered server-side
    const filteredPosts = Array.isArray(allPosts) ? allPosts : [];

    console.log('📊 Filtered results:', { 
      shows: filteredShows.length, 
      posts: filteredPosts.length 
    });

    const searchResults: SearchResult[] = [];

    // Add show results
    filteredShows.forEach((show: any) => {
      searchResults.push({
        id: show.id.toString(),
        title: show.title,
        type: 'show',
        description: show.description,
        speakerName: show.speakerName,
        date: show.date,
        slug: `show-${show.id}`
      });
    });

    // Add article results  
    filteredPosts.forEach((post: any) => {
      searchResults.push({
        id: post.id,
        title: post.title,
        type: 'article',
        description: post.excerpt || post.description,
        author: post.author?.name,
        date: post.publishedAt || post.createdAt,
        slug: post.slug
      });
    });

    setResults(searchResults);
    setShowResults(searchResults.length > 0);

  } catch (error) {
    console.error('❌ Search error:', error);
    setResults([]);
    setShowResults(false);
  } finally {
    setLoading(false);
  }
};

  const handleResultClick = (result: SearchResult) => {
    console.log('🎯 Search result clicked:', result);
    
    // Navigate to the content
    if (result.type === 'show') {
      window.location.hash = `#shows/${result.slug}`;
    } else if (result.type === 'article') {
      window.location.hash = `#posts/${result.slug}`;
    }
    
    // Clear search
    setQuery('');
    setShowResults(false);
    
    // Call optional callback
    if (onResultClick) {
      onResultClick(result);
    }
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Styling
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto'   // centers within parent
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    fontSize: theme.typography.sizes.base,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '25px',
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    outline: 'none',
    transition: 'all 0.3s ease',
    paddingRight: '50px' // Space for search icon
  };

  const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.colors.textSecondary,
    fontSize: '1.2rem',
    pointerEvents: 'none'
  };

  const resultsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    boxShadow: theme.shadows.lg,
    zIndex: 1000,
    marginTop: '4px',
    maxHeight: '400px',
    overflowY: 'auto'
  };

  const resultItemStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.colors.border}`,
    transition: 'all 0.2s ease'
  };

  const resultTypeStyle = (type: 'show' | 'article'): React.CSSProperties => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    backgroundColor: type === 'show' ? '#3b82f6' : '#10b981',
    color: '#ffffff',
    marginBottom: '4px'
  });

  const noResultsStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm
  };

  return (
    <div ref={searchRef} style={containerStyle}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search presentations and articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleInputFocus}
        style={{
          ...inputStyle,
          borderColor: showResults ? theme.colors.primary : theme.colors.border
        }}
      />
      
      <div style={searchIconStyle}>
        {loading ? '⏳' : '🔍'}
      </div>

      {showResults && (
        <div style={resultsStyle}>
          {results.length > 0 ? (
            <>
              {results.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  style={resultItemStyle}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.surface;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={resultTypeStyle(result.type)}>
                    {result.type === 'show' ? '🎥 Show' : '📄 Article'}
                  </div>
                  
                  <div style={{
                    fontSize: theme.typography.sizes.md,
                    fontWeight: theme.typography.weights.semibold,
                    color: theme.colors.text,
                    marginBottom: '4px'
                  }}>
                    {result.title}
                  </div>
                  
                  {result.description && (
                    <div style={{
                      fontSize: theme.typography.sizes.sm,
                      color: theme.colors.textSecondary,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {result.description}
                    </div>
                  )}
                  
                  <div style={{
                    fontSize: theme.typography.sizes.xs,
                    color: theme.colors.textSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm
                  }}>
                    {result.speakerName && (
                      <span>👤 {result.speakerName}</span>
                    )}
                    {result.author && (
                      <span>✍️ {result.author}</span>
                    )}
                    {result.date && (
                      <span>📅 {formatDate(result.date)}</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={noResultsStyle}>
              {loading ? (
                <div>🔍 Searching...</div>
              ) : (
                <div>
                  No results found for "{query}"
                  <br />
                  <small>Try searching for presentation titles or article names</small>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
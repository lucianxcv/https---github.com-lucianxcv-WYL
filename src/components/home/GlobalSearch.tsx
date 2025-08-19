/**
 * GLOBAL SEARCH COMPONENT
 * 
 * Save this file as: src/components/home/GlobalSearch.tsx
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';

interface GlobalSearchProps {
  placeholder?: string;
  showFilters?: boolean;
  onResultClick?: (result: any) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  placeholder = "🔍 Search speakers, articles, presentations...",
  showFilters = true,
  onResultClick
}) => {
  const theme = useTheme();
  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'speaker' | 'blog' | 'presentation'>('all');
  
  const {
    searchTerm,
    setSearchTerm,
    loading,
    resultCounts,
    filterByType
  } = useGlobalSearch();

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show results when user types
  useEffect(() => {
    setIsOpen(searchTerm.length > 0);
  }, [searchTerm]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const searchBarStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '25px',
    fontSize: theme.typography.sizes.md,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: isOpen ? theme.shadows.md : theme.shadows.sm
  };

  const resultsContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '16px',
    boxShadow: theme.shadows.lg,
    zIndex: 1000,
    maxHeight: '400px',
    overflowY: 'auto',
    marginTop: theme.spacing.xs
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    borderRadius: '16px 16px 0 0'
  };

  const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    border: 'none',
    borderRadius: '20px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
    color: isActive ? '#ffffff' : theme.colors.textSecondary
  });

  const resultsListStyle: React.CSSProperties = {
    padding: 0,
    margin: 0,
    listStyle: 'none'
  };

  const resultItemStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.border}`,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.md
  };

  const noResultsStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    textAlign: 'center',
    color: theme.colors.textSecondary
  };

  const loadingStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    textAlign: 'center',
    color: theme.colors.textSecondary
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle result item click
  const handleResultClick = (result: any) => {
    setIsOpen(false);
    setSearchTerm('');
    onResultClick?.(result);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      searchRef.current?.blur();
    }
  };

  // Get filtered results based on active filter
  const filteredResults = filterByType(activeFilter);

  // Get icon for result type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speaker': return '🎤';
      case 'blog': return '📝';
      case 'presentation': return '🎥';
      default: return '📄';
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div style={containerStyle}>
      {/* Search Input */}
      <input
        ref={searchRef}
        type="text"
        style={searchBarStyle}
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onFocus={() => searchTerm.length > 0 && setIsOpen(true)}
      />

      {/* Search Results */}
      {isOpen && (
        <div ref={resultsRef} style={resultsContainerStyle}>
          {/* Filter Tabs */}
          {showFilters && (
            <div style={filtersStyle}>
              <button
                style={filterButtonStyle(activeFilter === 'all')}
                onClick={() => setActiveFilter('all')}
              >
                All ({resultCounts.total})
              </button>
              <button
                style={filterButtonStyle(activeFilter === 'speaker')}
                onClick={() => setActiveFilter('speaker')}
              >
                🎤 Speakers ({resultCounts.speakers})
              </button>
              <button
                style={filterButtonStyle(activeFilter === 'blog')}
                onClick={() => setActiveFilter('blog')}
              >
                📝 Articles ({resultCounts.blogs})
              </button>
              <button
                style={filterButtonStyle(activeFilter === 'presentation')}
                onClick={() => setActiveFilter('presentation')}
              >
                🎥 Videos ({resultCounts.presentations})
              </button>
            </div>
          )}

          {/* Results List */}
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {loading ? (
              <div style={loadingStyle}>
                <div style={{ fontSize: '1.5rem', marginBottom: theme.spacing.sm }}>⏳</div>
                <p>Searching...</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div style={noResultsStyle}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>🔍</div>
                <p>No results found for "{searchTerm}"</p>
                <p style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
                  Try different keywords or check the spelling
                </p>
              </div>
            ) : (
              <ul style={resultsListStyle}>
                {filteredResults.slice(0, 10).map((result) => (
                  <li
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
                    {/* Result Icon/Image */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: theme.colors.surface,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      {result.imageUrl ? (
                        <img
                          src={result.imageUrl}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      ) : (
                        getTypeIcon(result.type)
                      )}
                    </div>

                    {/* Result Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.xs,
                        marginBottom: theme.spacing.xs
                      }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: theme.typography.sizes.md,
                          fontWeight: theme.typography.weights.semibold,
                          color: theme.colors.text,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {result.title}
                        </h4>
                        <span style={{
                          fontSize: theme.typography.sizes.xs,
                          color: theme.colors.textSecondary,
                          textTransform: 'capitalize'
                        }}>
                          {result.type}
                        </span>
                      </div>
                      
                      <p style={{
                        margin: 0,
                        fontSize: theme.typography.sizes.sm,
                        color: theme.colors.textSecondary,
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {result.description}
                      </p>
                      
                      {result.date && (
                        <div style={{
                          fontSize: theme.typography.sizes.xs,
                          color: theme.colors.textSecondary,
                          marginTop: theme.spacing.xs
                        }}>
                          📅 {formatDate(result.date)}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
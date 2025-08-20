/**
 * ENHANCED GLOBAL SEARCH COMPONENT
 * 
 * Major improvements:
 * - Modern search UI with better UX
 * - Real-time search suggestions
 * - Category filtering
 * - Search history
 * - Enhanced results display
 * - Keyboard navigation
 * - Loading states and animations
 * - Better mobile responsiveness
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';

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

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  maxResults?: number;
  showCategories?: boolean;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onResultClick,
  placeholder = "Search speakers, articles, presentations...",
  maxResults = 8,
  showCategories = true
}) => {
  const theme = useTheme();
  const { searchResults, loading, search } = useGlobalSearch();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search categories
  const categories = [
    { id: 'all', label: 'All', icon: '🔍' },
    { id: 'speaker', label: 'Speakers', icon: '🎤' },
    { id: 'blog', label: 'Articles', icon: '📝' },
    { id: 'presentation', label: 'Presentations', icon: '🎥' },
    { id: 'weather', label: 'Weather', icon: '🌊' }
  ];

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const searchBoxStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: theme.colors.background,
    borderRadius: '20px',
    border: `2px solid ${isOpen ? theme.colors.primary : theme.colors.border}`,
    boxShadow: isOpen ? theme.shadows.lg : theme.shadows.md,
    transition: 'all 0.3s ease',
    overflow: 'hidden'
  };

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.md
  };

  const searchIconStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    marginRight: theme.spacing.sm,
    color: theme.colors.textSecondary
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: theme.typography.sizes.lg,
    backgroundColor: 'transparent',
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.medium
  };

  const clearButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: theme.spacing.xs,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.textSecondary,
    transition: 'all 0.2s ease'
  };

  const categoriesStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.xs,
    padding: `0 ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md}`,
    borderTop: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface
  };

  const categoryButtonStyle = (isActive: boolean): React.CSSProperties => ({
    backgroundColor: isActive ? theme.colors.primary : 'transparent',
    color: isActive ? '#ffffff' : theme.colors.textSecondary,
    border: `1px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
    borderRadius: '20px',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    whiteSpace: 'nowrap'
  });

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderRadius: '16px',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.xl,
    zIndex: 1000,
    marginTop: theme.spacing.xs,
    maxHeight: '400px',
    overflowY: 'auto',
    animation: 'slideDown 0.2s ease-out'
  };

  const resultItemStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.border}`,
    cursor: 'pointer',
    backgroundColor: isSelected ? theme.colors.surface : 'transparent',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md
  });

  const resultIconStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    flexShrink: 0
  };

  const resultContentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0
  };

  const resultTitleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  const resultExcerptStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const resultMetaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary
  };

  const noResultsStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    textAlign: 'center',
    color: theme.colors.textSecondary
  };

  const historyItemStyle: React.CSSProperties = {
    padding: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colors.border}`,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.2s ease'
  };

  // Get icon for result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'speaker': return '🎤';
      case 'blog': return '📝';
      case 'presentation': return '🎥';
      case 'weather': return '🌊';
      default: return '📄';
    }
  };

  // Handle search
  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      await search(searchQuery);
      setIsOpen(true);
      setShowHistory(false);
    } else {
      setIsOpen(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      handleSearch(value);
    } else {
      setIsOpen(false);
      setShowHistory(true);
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    // Add to search history
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    setQuery(result.title);
    setIsOpen(false);
    onResultClick?.(result);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
          handleResultClick(filteredResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Filter results by category
  const filteredResults = selectedCategory === 'all' 
    ? searchResults.slice(0, maxResults)
    : searchResults.filter(result => result.type === selectedCategory).slice(0, maxResults);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load search history
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const animations = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <div style={containerStyle} ref={searchRef}>
        {/* Search Input */}
        <div style={searchBoxStyle}>
          <div style={inputContainerStyle}>
            <div style={searchIconStyle}>🔍</div>
            <input
              ref={inputRef}
              style={inputStyle}
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (query.trim()) {
                  setIsOpen(true);
                } else {
                  setShowHistory(searchHistory.length > 0);
                }
              }}
            />
            {query && (
              <button
                style={clearButtonStyle}
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                  setShowHistory(false);
                  inputRef.current?.focus();
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.surface;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Categories */}
          {showCategories && isOpen && !showHistory && (
            <div style={categoriesStyle}>
              {categories.map(category => (
                <button
                  key={category.id}
                  style={categoryButtonStyle(selectedCategory === category.id)}
                  onClick={() => setSelectedCategory(category.id)}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.backgroundColor = theme.colors.surface;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {(isOpen || showHistory) && (
          <div style={dropdownStyle}>
            {showHistory && searchHistory.length > 0 ? (
              // Search History
              <>
                <div style={{
                  padding: theme.spacing.md,
                  borderBottom: `1px solid ${theme.colors.border}`,
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.semibold,
                  color: theme.colors.textSecondary
                }}>
                  Recent Searches
                </div>
                {searchHistory.map((historyItem, index) => (
                  <div
                    key={index}
                    style={historyItemStyle}
                    onClick={() => {
                      setQuery(historyItem);
                      handleSearch(historyItem);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.surface;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                      <span>🕒</span>
                      <span>{historyItem}</span>
                    </div>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme.colors.textSecondary,
                        cursor: 'pointer',
                        padding: theme.spacing.xs
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newHistory = searchHistory.filter((_, i) => i !== index);
                        setSearchHistory(newHistory);
                        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </>
            ) : (
              // Search Results
              <>
                {loading ? (
                  <div style={noResultsStyle}>
                    <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>⏳</div>
                    <p>Searching...</p>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <>
                    {filteredResults.map((result, index) => (
                      <div
                        key={result.id}
                        style={resultItemStyle(index === selectedIndex)}
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div style={resultIconStyle}>
                          {getResultIcon(result.type)}
                        </div>
                        <div style={resultContentStyle}>
                          <div style={resultTitleStyle}>{result.title}</div>
                          {result.excerpt && (
                            <div style={resultExcerptStyle}>{result.excerpt}</div>
                          )}
                          <div style={resultMetaStyle}>
                            <span style={{ textTransform: 'capitalize' }}>{result.type}</span>
                            {result.date && <span>📅 {result.date}</span>}
                            {result.category && <span>🏷️ {result.category}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : query.trim() ? (
                  <div style={noResultsStyle}>
                    <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🔍</div>
                    <h3 style={{ marginBottom: theme.spacing.sm }}>No results found</h3>
                    <p>Try adjusting your search terms or browse our categories.</p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
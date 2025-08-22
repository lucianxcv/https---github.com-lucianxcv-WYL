/**
 * PAST SHOWS ARCHIVE PAGE - REAL API INTEGRATION (COMPLETE)
 * 
 * Features:
 * - Real backend API integration via usePastShows hook
 * - Slug-based navigation to individual episodes
 * - Search and filter functionality
 * - Pagination and sorting
 * - Professional archive layout
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { PastShowVideo } from '../components/home/PastShowVideo';
import { usePastShows } from '../hooks/usePastShows'; // ← Using our new hook

export const PastShowsArchivePage: React.FC = () => {
  const theme = useTheme();
  
  // 🔥 FIXED: Use real API data instead of mock data
  const { shows, loading, error, refetch } = usePastShows();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // ← Already correct: defaults to date sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [showsPerPage] = useState(12);

  const topics = ['All', 'Technology', 'Navigation', 'Safety', 'History', 'Environment', 'Business', 'Innovation', 'Maritime'];
  
  // Get unique years from actual data
  const availableYears = ['All', ...Array.from(new Set(shows.map(show => show.year))).sort((a, b) => b - a)];

  // Filter and sort shows - UPDATED: Always sort by video date primarily
  const filteredShows = shows
    .filter(show => {
      const matchesSearch = show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           show.speakerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (show.description && show.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTopic = selectedTopic === 'all' || 
                          (show.topic && show.topic.toLowerCase() === selectedTopic.toLowerCase());
      const matchesYear = selectedYear === 'all' || 
                         show.year.toString() === selectedYear;
      return matchesSearch && matchesTopic && matchesYear && show.isPublished;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          // Primary sort: video date (newest first)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'popularity':
          // Secondary consideration: if same views, fall back to date
          const viewDiff = (b.views || 0) - (a.views || 0);
          return viewDiff !== 0 ? viewDiff : new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title':
          // Alphabetical, but with date as tiebreaker
          const titleCompare = a.title.localeCompare(b.title);
          return titleCompare !== 0 ? titleCompare : new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'duration':
          // Duration, but with date as tiebreaker
          const durationDiff = (a.duration || 45) - (b.duration || 45);
          return durationDiff !== 0 ? durationDiff : new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  // Pagination
  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = filteredShows.slice(indexOfFirstShow, indexOfLastShow);
  const totalPages = Math.ceil(filteredShows.length / showsPerPage);

  const featuredShows = shows.filter(show => show.featured);

  // 🔥 FIXED: Handle show click with slug-based navigation
  const handleShowClick = (show: any) => {
    // Navigate to individual episode page using slug
    if (show.slug) {
      window.location.hash = `#shows/${show.slug}`;
    } else {
      // Fallback to ID if no slug available
      console.warn('⚠️ No slug available for show, using ID fallback:', show.id);
      window.location.hash = `#past-show-${show.id}`;
    }
  };

  const pageStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    minHeight: '100vh',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    paddingTop: '80px'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing.xl
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: theme.spacing.xl
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['4xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md
  };

  const filtersStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`
  };

  const inputStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: theme.typography.sizes.base,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.xl
  };

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl
  };

  const pageButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
    color: isActive ? '#ffffff' : theme.colors.text,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium
  });

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTopic('all');
    setSelectedYear('all');
    setCurrentPage(1);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTopic, selectedYear, sortBy]);

  // Render error
  const renderError = () => {
    if (!error) return null;
    return (
      <div style={{
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: theme.spacing.md,
        borderRadius: '8px',
        marginBottom: theme.spacing.md,
        border: '1px solid #fecaca',
        textAlign: 'center'
      }}>
        ⚠️ {error}
        <button
          style={{
            marginLeft: theme.spacing.sm,
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            fontSize: theme.typography.sizes.sm,
            cursor: 'pointer'
          }}
          onClick={refetch}
        >
          🔄 Retry
        </button>
      </div>
    );
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div style={paginationStyle}>
        {/* Previous button */}
        <button
          style={pageButtonStyle(false)}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          onMouseEnter={(e) => {
            if (currentPage > 1) {
              e.currentTarget.style.backgroundColor = theme.colors.background;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.surface;
          }}
        >
          ← Previous
        </button>

        {/* First page if not visible */}
        {startPage > 1 && (
          <>
            <button
              style={pageButtonStyle(false)}
              onClick={() => setCurrentPage(1)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }}
            >
              1
            </button>
            {startPage > 2 && <span style={{ color: theme.colors.textSecondary }}>...</span>}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            style={pageButtonStyle(pageNum === currentPage)}
            onClick={() => setCurrentPage(pageNum)}
            onMouseEnter={(e) => {
              if (pageNum !== currentPage) {
                e.currentTarget.style.backgroundColor = theme.colors.background;
              }
            }}
            onMouseLeave={(e) => {
              if (pageNum !== currentPage) {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }
            }}
          >
            {pageNum}
          </button>
        ))}

        {/* Last page if not visible */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={{ color: theme.colors.textSecondary }}>...</span>}
            <button
              style={pageButtonStyle(false)}
              onClick={() => setCurrentPage(totalPages)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          style={pageButtonStyle(false)}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          onMouseEnter={(e) => {
            if (currentPage < totalPages) {
              e.currentTarget.style.backgroundColor = theme.colors.background;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.surface;
          }}
        >
          Next →
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🎬</div>
            <p>Loading presentation archive from backend...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalViews = shows.reduce((sum, show) => sum + (show.views || 0), 0);
  const totalHours = Math.round(shows.reduce((sum, show) => sum + (show.duration || 45), 0) / 60);

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <main style={containerStyle}>
        {/* Header */}
        <header style={headerStyle}>
          <h1 style={titleStyle}>🎬 Presentation Archive</h1>
          <p style={{
            fontSize: theme.typography.sizes.lg,
            color: theme.colors.textSecondary,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Explore our extensive collection of maritime presentations from industry leaders, experts, and innovators.
          </p>
          
          {/* Archive Stats */}
          {shows.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: theme.spacing.md,
              maxWidth: '600px',
              margin: `${theme.spacing.lg} auto 0`,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background,
              borderRadius: '12px',
              border: `1px solid ${theme.colors.border}`
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: theme.typography.sizes.xl, 
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.primary 
                }}>
                  {shows.length}
                </div>
                <div style={{ 
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.textSecondary 
                }}>
                  Episodes
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: theme.typography.sizes.xl, 
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.primary 
                }}>
                  {totalHours}
                </div>
                <div style={{ 
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.textSecondary 
                }}>
                  Hours
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: theme.typography.sizes.xl, 
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.primary 
                }}>
                  {totalViews.toLocaleString()}
                </div>
                <div style={{ 
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.textSecondary 
                }}>
                  Views
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Error Display */}
        {renderError()}

        {/* Search and Filters */}
        <div style={filtersStyle}>
          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.text,
              marginBottom: theme.spacing.xs
            }}>
              🔍 Search Presentations
            </label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Search by title, speaker, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.text,
              marginBottom: theme.spacing.xs
            }}>
              📂 Topic
            </label>
            <select
              style={inputStyle}
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              {topics.map(topic => (
                <option key={topic} value={topic.toLowerCase()}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.text,
              marginBottom: theme.spacing.xs
            }}>
              📅 Year
            </label>
            <select
              style={inputStyle}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {availableYears.map(year => (
                <option key={year} value={year.toString().toLowerCase()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.text,
              marginBottom: theme.spacing.xs
            }}>
              📊 Sort By
            </label>
            <select
              style={inputStyle}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Latest First (by Video Date)</option>
              <option value="popularity">Most Popular</option>
              <option value="title">Title A-Z</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.lg,
          flexWrap: 'wrap',
          gap: theme.spacing.md
        }}>
          <p style={{
            fontSize: theme.typography.sizes.base,
            color: theme.colors.textSecondary
          }}>
            🎥 Showing {indexOfFirstShow + 1}-{Math.min(indexOfLastShow, filteredShows.length)} of {filteredShows.length} presentations
          </p>
          
          {(searchTerm || selectedTopic !== 'all' || selectedYear !== 'all') && (
            <button
              style={{
                backgroundColor: 'transparent',
                color: theme.colors.textSecondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '20px',
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                fontSize: theme.typography.sizes.sm,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={clearFilters}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        {/* Featured Shows Section */}
        {featuredShows.length > 0 && searchTerm === '' && selectedTopic === 'all' && selectedYear === 'all' && (
          <section style={{ marginBottom: theme.spacing.xl }}>
            <h2 style={{
              fontSize: theme.typography.sizes['2xl'],
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.lg,
              textAlign: 'center'
            }}>
              ⭐ Featured Presentations
            </h2>
            <div style={gridStyle}>
              {featuredShows.slice(0, 4).map((show) => (
                <PastShowVideo 
                  key={show.id} 
                  {...show} 
                  onClick={() => handleShowClick(show)}
                />
              ))}
            </div>
            <div style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${theme.colors.border}, transparent)`,
              margin: `${theme.spacing.xl} 0`
            }} />
          </section>
        )}

        {/* Main Shows Grid */}
        {currentShows.length === 0 ? (
          <div style={{
            backgroundColor: theme.colors.background,
            borderRadius: '16px',
            padding: theme.spacing.xl,
            textAlign: 'center',
            border: `1px solid ${theme.colors.border}`
          }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🎬</div>
            <h3 style={{
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.sizes.lg
            }}>
              No presentations found
            </h3>
            <p style={{
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.lg,
              fontSize: theme.typography.sizes.base
            }}>
              {searchTerm || selectedTopic !== 'all' || selectedYear !== 'all'
                ? 'Try adjusting your search criteria or clearing filters to see more results.'
                : 'Check back soon for new maritime presentations!'}
            </p>
            {(searchTerm || selectedTopic !== 'all' || selectedYear !== 'all') && (
              <button
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#ffffff',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: theme.typography.sizes.base,
                  fontWeight: theme.typography.weights.semibold,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={clearFilters}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🗑️ Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={gridStyle}>
              {currentShows.map((show) => (
                <PastShowVideo 
                  key={show.id} 
                  {...show} 
                  onClick={() => handleShowClick(show)}
                />
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}

        {/* Call to Action */}
        {shows.length > 0 && (
          <section style={{
            backgroundColor: theme.colors.background,
            borderRadius: '16px',
            padding: theme.spacing.xl,
            marginTop: theme.spacing.xl,
            textAlign: 'center',
            border: `1px solid ${theme.colors.border}`
          }}>
            <h3 style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.md
            }}>
              📺 Enjoying Our Presentations?
            </h3>
            <p style={{
              fontSize: theme.typography.sizes.base,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.lg,
              maxWidth: '500px',
              margin: `0 auto ${theme.spacing.lg} auto`
            }}>
              Join us every Wednesday at the St. Francis Yacht Club for live presentations, 
              networking, and fine dining with stunning bay views.
            </p>
            <div style={{
              display: 'flex',
              gap: theme.spacing.md,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#ffffff',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: theme.typography.sizes.base,
                  fontWeight: theme.typography.weights.semibold,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => window.location.hash = '#home'}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🏠 Back to Home
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  color: theme.colors.primary,
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: `2px solid ${theme.colors.primary}`,
                  borderRadius: '25px',
                  fontSize: theme.typography.sizes.base,
                  fontWeight: theme.typography.weights.semibold,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => window.location.hash = '#articles'}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primary;
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.colors.primary;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                📚 Read Articles
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};
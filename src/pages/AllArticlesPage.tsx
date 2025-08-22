/**
 * ALL ARTICLES PAGE - BACKEND CONNECTED VERSION WITH SLUG NAVIGATION
 * 
 * This version connects to your real backend API and uses slug-based navigation
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { BlogPostCard } from '../components/home/BlogPostCard';
import { postsApi } from '../utils/apiService';

// Post types matching your backend
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
  views?: number;
  author?: {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
  };
  categories?: any[];
  tags?: any[];
  _count?: {
    comments: number;
  };
}

export const AllArticlesPage: React.FC = () => {
  const theme = useTheme();
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const articlesPerPage = 9;

  const categories = ['All', 'Technology', 'Safety', 'Sustainability', 'Navigation', 'Industry News', 'Events'];

  // 🔥 FIXED: Load articles from real backend API
  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📚 Loading articles from backend...');
      
      const response = await postsApi.getAll({
        page: currentPage,
        limit: articlesPerPage,
        search: searchTerm || undefined,
        published: true // Only show published articles
      });

      console.log('✅ Articles loaded:', response);
      
      if (response.success && response.data) {
        setArticles(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError('Failed to load articles');
        setArticles([]);
      }
    } catch (error) {
      console.error('❌ Failed to load articles:', error);
      setError(`Failed to load articles: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [currentPage, searchTerm]);

  // Filter and sort articles (client-side for categories and sorting)
  const filteredArticles = articles
    .filter(article => {
      const matchesCategory = selectedCategory === 'all' || 
                             (article.categories && article.categories.some(cat => 
                               cat.category?.name?.toLowerCase() === selectedCategory.toLowerCase()
                             ));
      return matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Handle article click - UPDATED FOR SLUG NAVIGATION
  const handleArticleClick = (article: BlogPost) => {
    // Navigate to individual blog post using slug
    if (article.slug) {
      window.location.hash = `#posts/${article.slug}`;
    } else {
      console.warn('⚠️ No slug available for article, using ID fallback:', article.id);
      window.location.hash = `#blog-post-${article.id}`;
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('date');
    setCurrentPage(1);
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: theme.spacing.lg,
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
      </div>
    );
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📚</div>
            <p>Loading articles from backend...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <main style={containerStyle}>
        {/* Header */}
        <header style={headerStyle}>
          <h1 style={titleStyle}>📚 Maritime Articles & Insights</h1>
          <p style={{
            fontSize: theme.typography.sizes.lg,
            color: theme.colors.textSecondary,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Discover the latest insights, innovations, and stories from the world of maritime industry and yachting.
          </p>
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
              🔍 Search Articles
            </label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Search by title, content, or author..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
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
              📂 Category
            </label>
            <select
              style={inputStyle}
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
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
              <option value="date">Latest First</option>
              <option value="popularity">Most Popular</option>
              <option value="title">Title A-Z</option>
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
            📄 Showing {filteredArticles.length} of {articles.length} articles
            {totalPages > 1 && ` (page ${currentPage} of ${totalPages})`}
          </p>
          
          {(searchTerm || selectedCategory !== 'all') && (
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

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div style={gridStyle}>
            {filteredArticles.map((article) => (
              <BlogPostCard
                key={article.id}
                id={article.id}
                title={article.title}
                slug={article.slug} // ← IMPORTANT: Pass slug for navigation
                excerpt={article.excerpt}
                content={article.content}
                imageUrl={article.coverImage}
                author={article.author?.name || article.author?.email}
                authorAvatar={article.author?.avatar}
                publishedAt={article.publishedAt}
                category={article.categories?.[0]?.category?.name}
                tags={article.tags?.map(tag => tag.tag?.name || tag)}
                readTime={Math.ceil(article.content.length / 1000)}
                onClick={() => handleArticleClick(article)}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: theme.spacing.xl,
            backgroundColor: theme.colors.background,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>
              {articles.length === 0 ? '📝' : '🔍'}
            </div>
            <h3 style={{ 
              color: theme.colors.textSecondary, 
              marginBottom: theme.spacing.sm 
            }}>
              {articles.length === 0 ? 'No Articles Published Yet' : 'No Articles Found'}
            </h3>
            <p style={{ color: theme.colors.textSecondary }}>
              {articles.length === 0 
                ? 'Check back soon for new maritime articles and insights!'
                : 'Try adjusting your search criteria or browse different categories.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={paginationStyle}>
            <button
              style={pageButtonStyle(false)}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = theme.colors.background;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = theme.colors.surface;
                }
              }}
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === totalPages || 
                Math.abs(page - currentPage) <= 2
              )
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] < page - 1 && (
                    <span style={{ color: theme.colors.textSecondary }}>...</span>
                  )}
                  <button
                    style={pageButtonStyle(page === currentPage)}
                    onClick={() => setCurrentPage(page)}
                    onMouseEnter={(e) => {
                      if (page !== currentPage) {
                        e.currentTarget.style.backgroundColor = theme.colors.background;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (page !== currentPage) {
                        e.currentTarget.style.backgroundColor = theme.colors.surface;
                      }
                    }}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              style={pageButtonStyle(false)}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = theme.colors.background;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = theme.colors.surface;
                }
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Newsletter Signup */}
        <section style={{
          marginTop: theme.spacing.xl,
          padding: theme.spacing.xl,
          backgroundColor: theme.colors.background,
          borderRadius: '12px',
          border: `1px solid ${theme.colors.border}`,
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: theme.typography.sizes.xl,
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
            marginBottom: theme.spacing.md
          }}>
            📧 Stay Updated
          </h3>
          <p style={{
            fontSize: theme.typography.sizes.base,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
            maxWidth: '500px',
            margin: `0 auto ${theme.spacing.lg} auto`
          }}>
            Subscribe to our newsletter to receive the latest maritime articles and industry insights directly in your inbox.
          </p>
          <div style={{
            display: 'flex',
            gap: theme.spacing.sm,
            maxWidth: '400px',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            <input
              type="email"
              style={{
                ...inputStyle,
                flex: 1,
                minWidth: '250px'
              }}
              placeholder="Enter your email address"
            />
            <button
              style={{
                backgroundColor: theme.colors.primary,
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                fontSize: theme.typography.sizes.base,
                fontWeight: theme.typography.weights.semibold,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.secondary;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📧 Subscribe
            </button>
          </div>
        </section>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: theme.spacing.xl }}>
          <button
            style={{
              backgroundColor: theme.colors.secondary,
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
        </div>
      </main>

      <Footer />
    </div>
  );
};
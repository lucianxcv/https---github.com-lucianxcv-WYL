/**
 * ALL ARTICLES PAGE
 * 
 * Features:
 * - Grid layout of all blog posts
 * - Search and filter functionality
 * - Category filtering
 * - Pagination
 * - Sort by date, popularity, etc.
 * - Featured articles section
 * - Archive organization
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { BlogPostCard } from '../components/home/BlogPostCard';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  imageUrl?: string;
  featured?: boolean;
  views?: number;
}

export const AllArticlesPage: React.FC = () => {
  const theme = useTheme();
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(9);

  const categories = ['All', 'Technology', 'Safety', 'Sustainability', 'Navigation', 'Industry News', 'Events'];

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample articles data - replace with actual data fetching
      const sampleArticles: BlogPost[] = [
        {
          id: '1',
          title: 'The Future of Maritime Technology: AI and Autonomous Vessels',
          excerpt: 'Exploring how artificial intelligence and autonomous vessels are revolutionizing the maritime industry, from navigation to environmental sustainability.',
          author: 'Dr. Michael Chen',
          date: '2024-03-15',
          category: 'Technology',
          tags: ['AI', 'Autonomous Vessels', 'Innovation'],
          readTime: 8,
          featured: true,
          views: 1247,
          imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'
        },
        {
          id: '2',
          title: 'Sustainable Shipping: Green Technologies in Modern Vessels',
          excerpt: 'How the maritime industry is adopting eco-friendly technologies to reduce environmental impact and meet global sustainability goals.',
          author: 'Captain Lisa Rodriguez',
          date: '2024-03-10',
          category: 'Sustainability',
          tags: ['Green Technology', 'Environment', 'Sustainability'],
          readTime: 6,
          views: 892,
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
        },
        {
          id: '3',
          title: 'Navigation Safety: Lessons from Modern Maritime Accidents',
          excerpt: 'Analyzing recent maritime incidents to improve safety protocols and prevent future accidents in commercial shipping.',
          author: 'Admiral James Wright',
          date: '2024-03-08',
          category: 'Safety',
          tags: ['Safety', 'Navigation', 'Risk Management'],
          readTime: 5,
          featured: true,
          views: 1156,
          imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'
        },
        {
          id: '4',
          title: 'Port Automation: The Digital Revolution in Cargo Handling',
          excerpt: 'Examining how automated port systems are transforming global trade and improving efficiency in maritime logistics.',
          author: 'Dr. Sarah Kim',
          date: '2024-03-05',
          category: 'Technology',
          tags: ['Automation', 'Ports', 'Logistics'],
          readTime: 7,
          views: 734,
          imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400'
        },
        {
          id: '5',
          title: 'Ocean Conservation and Maritime Industry Collaboration',
          excerpt: 'How shipping companies are partnering with environmental organizations to protect marine ecosystems.',
          author: 'Marine Biologist Dr. Elena Vasquez',
          date: '2024-03-02',
          category: 'Sustainability',
          tags: ['Conservation', 'Environment', 'Collaboration'],
          readTime: 6,
          views: 623,
          imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400'
        },
        {
          id: '6',
          title: 'Maritime Cybersecurity: Protecting Connected Vessels',
          excerpt: 'Understanding the growing cybersecurity threats facing modern ships and how to defend against digital attacks.',
          author: 'Cybersecurity Expert Tom Bradley',
          date: '2024-02-28',
          category: 'Technology',
          tags: ['Cybersecurity', 'Digital Security', 'Technology'],
          readTime: 9,
          views: 1089,
          imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400'
        },
        {
          id: '7',
          title: 'The Economics of Modern Shipping: Supply Chain Innovations',
          excerpt: 'How digital technologies are optimizing global supply chains and reducing costs in maritime transportation.',
          author: 'Economic Analyst Robert Chang',
          date: '2024-02-25',
          category: 'Industry News',
          tags: ['Economics', 'Supply Chain', 'Innovation'],
          readTime: 8,
          views: 945,
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
        },
        {
          id: '8',
          title: 'Weather Routing: Advanced Meteorology for Safer Voyages',
          excerpt: 'Utilizing cutting-edge weather prediction technology to optimize ship routes and improve safety at sea.',
          author: 'Meteorologist Dr. Patricia Wells',
          date: '2024-02-22',
          category: 'Navigation',
          tags: ['Weather', 'Navigation', 'Safety'],
          readTime: 5,
          views: 567,
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
        },
        {
          id: '9',
          title: 'St. Francis Yacht Club Annual Regatta Highlights',
          excerpt: 'Celebrating another successful year of competitive sailing and maritime tradition at our historic club.',
          author: 'Commodore William Harper',
          date: '2024-02-20',
          category: 'Events',
          tags: ['Regatta', 'Sailing', 'Club Events'],
          readTime: 4,
          views: 1234,
          imageUrl: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=400'
        }
      ];
      
      setArticles(sampleArticles);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort articles
  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             article.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readTime':
          return a.readTime - b.readTime;
        default:
          return 0;
      }
    });

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const featuredArticles = articles.filter(article => article.featured);

  const handleArticleClick = (article: BlogPost) => {
    // Navigate to individual blog post
    window.location.hash = `blog-post-${article.id}`;
  };

  const pageStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    minHeight: '100vh',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    paddingTop: '80px' // Account for fixed navbar
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

  if (loading) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📚</div>
            <p>Loading articles...</p>
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

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section style={{ marginBottom: theme.spacing.xl }}>
            <h2 style={{
              fontSize: theme.typography.sizes['2xl'],
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.lg,
              textAlign: 'center'
            }}>
              ⭐ Featured Articles
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: theme.spacing.lg,
              marginBottom: theme.spacing.xl
            }}>
              {featuredArticles.slice(0, 3).map((article) => (
                <div
                  key={article.id}
                  style={{
                    position: 'relative',
                    backgroundColor: theme.colors.background,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `2px solid ${theme.colors.primary}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleArticleClick(article)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = theme.shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: theme.spacing.md,
                    left: theme.spacing.md,
                    backgroundColor: theme.colors.primary,
                    color: '#ffffff',
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    borderRadius: '20px',
                    fontSize: theme.typography.sizes.xs,
                    fontWeight: theme.typography.weights.semibold,
                    zIndex: 2
                  }}>
                    ⭐ Featured
                  </div>
                  <BlogPostCard
                    {...article}
                    onClick={() => handleArticleClick(article)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

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
              📂 Category
            </label>
            <select
              style={inputStyle}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              <option value="readTime">Reading Time</option>
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
            📄 Showing {indexOfFirstArticle + 1}-{Math.min(indexOfLastArticle, filteredArticles.length)} of {filteredArticles.length} articles
          </p>
          
          {searchTerm && (
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
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
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
        {currentArticles.length > 0 ? (
          <div style={gridStyle}>
            {currentArticles.map((article) => (
              <BlogPostCard
                key={article.id}
                {...article}
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
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🔍</div>
            <h3 style={{ 
              color: theme.colors.textSecondary, 
              marginBottom: theme.spacing.sm 
            }}>
              No Articles Found
            </h3>
            <p style={{ color: theme.colors.textSecondary }}>
              Try adjusting your search criteria or browse different categories.
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
            onClick={() => window.location.hash = 'home'}
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
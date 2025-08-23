/**
 * ENHANCED HOMEPAGE COMPONENT - REACT ROUTER VERSION
 * 
 * Updated to use React Router navigation instead of hash-based routing:
 * - useNavigate() for programmatic navigation
 * - Clean URL navigation for blog posts and shows
 * - Backwards compatible with existing functionality
 */

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Hero } from '../components/home/Hero';
import { SpeakerCard } from '../components/home/SpeakerCard';
import { BlogPostCard } from '../components/home/BlogPostCard';
import { UpcomingSpeakers } from '../components/home/UpcomingSpeakers';
import { GlobalSearch } from '../components/home/GlobalSearch';
import { PastShowVideo } from '../components/home/PastShowVideo';
import { OwnerBio } from '../components/home/OwnerBio';
import { CommentsSection } from '../components/home/CommentsSection';
import { MultiLocationWeather } from '../components/home/MultiLocationWeather';
import { useSpeakers } from '../hooks/useSpeakers';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { usePastShows } from '../hooks/usePastShows';

export const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get dynamic data from our hooks
  const { thisWeekSpeaker, upcomingSpeakers, loading: speakersLoading } = useSpeakers();
  const { latestPosts, loading: postsLoading } = useBlogPosts();
  const { latestShows, loading: showsLoading } = usePastShows();

  // Handle URL parameters for smooth scrolling to sections
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);

  // Global page styling with theme support
  const pageStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    minHeight: '100vh',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    transition: 'all 0.3s ease'
  };

  // Main content container
  const mainContentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing.xl
  };

  // Section styling for consistent spacing
  const sectionStyle: React.CSSProperties = {
    margin: `${theme.spacing['2xl']} 0`
  };

  // Section title styling
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['3xl'],
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    fontWeight: theme.typography.weights.bold
  };

  // Helper function to calculate read time from content
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Helper function to get author name from the actual data structure
  const getAuthorName = (author: { id: string; name?: string; email: string }): string => {
    return author.name || author.email;
  };

  // Helper function to get a default category
  const getDefaultCategory = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('weather') || titleLower.includes('forecast')) return 'Weather';
    if (titleLower.includes('navigation') || titleLower.includes('celestial')) return 'Navigation';
    if (titleLower.includes('speaker') || titleLower.includes('spotlight')) return 'Events';
    if (titleLower.includes('safety') || titleLower.includes('emergency')) return 'Safety';
    if (titleLower.includes('technology') || titleLower.includes('tech')) return 'Technology';
    return 'Maritime';
  };

  // Helper function to extract tags from content/title
  const getDefaultTags = (title: string, content: string): string[] => {
    const text = (title + ' ' + content).toLowerCase();
    const possibleTags = [
      'sailing', 'navigation', 'weather', 'safety', 'technology', 
      'maritime', 'ocean', 'bay', 'captain', 'yacht', 'boat',
      'wind', 'tide', 'storm', 'forecast', 'GPS', 'celestial'
    ];
    
    return possibleTags.filter(tag => text.includes(tag)).slice(0, 3);
  };

  // UPDATED: Handle search result clicks with React Router
  const handleSearchResultClick = (result: any) => {
    if (result.type === 'speaker') {
      const speakerSection = document.getElementById('upcoming');
      speakerSection?.scrollIntoView({ behavior: 'smooth' });
    } else if (result.type === 'blog' || result.type === 'article') {
      if (result.slug) {
        navigate(`/posts/${result.slug}`);
      } else {
        console.warn('⚠️ No slug available for post, using ID fallback:', result.id);
        navigate(`/blog-post-${result.id}`);
      }
    } else if (result.type === 'presentation' || result.type === 'show') {
      if (result.slug) {
        navigate(`/shows/${result.slug}`);
      } else {
        navigate('/past-shows');
      }
    }
  };

  // UPDATED: Handle blog post clicks with React Router
  const handleBlogPostClick = (post: any) => {
    if (post.slug) {
      navigate(`/posts/${post.slug}`);
    } else {
      console.warn('⚠️ No slug available for post, using ID fallback:', post.id);
      navigate(`/blog-post-${post.id}`);
    }
  };

  // UPDATED: Handle past show clicks with React Router
  const handlePastShowClick = (show: any) => {
    if (show.slug) {
      navigate(`/shows/${show.slug}`);
    } else {
      console.warn('⚠️ No slug available for show, using ID fallback:', show.id);
      navigate(`/past-show-${show.id}`);
    }
  };

  // UPDATED: Navigate to all articles page with React Router
  const handleViewAllArticles = () => {
    navigate('/articles');
  };

  // UPDATED: Navigate to past shows archive with React Router
  const handleViewAllPresentations = () => {
    navigate('/past-shows');
  };

  return (
    <div style={pageStyle}>
      {/* CSS for responsive design */}
      <style>
        {`
          @media (max-width: 768px) {
            .hero-content h1 {
              font-size: 2.5rem !important;
            }
            .speaker-card {
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
            }
            .blog-grid {
              grid-template-columns: 1fr !important;
            }
            .upcoming-speakers-grid {
              grid-template-columns: 1fr !important;
            }
            .past-shows-grid {
              grid-template-columns: 1fr !important;
            }
          }
          
          @media (max-width: 480px) {
            .search-container {
              padding: 0 16px !important;
            }
          }
        `}
      </style>

      {/* Navigation bar */}
      <Navbar />

      {/* Hero section with countdown */}
      <Hero />

      {/* Weather Dashboard */}
      <MultiLocationWeather />

      {/* Global Search Section */}
      <section style={{
        ...sectionStyle,
        backgroundColor: theme.colors.background,
        borderRadius: '20px',
        padding: theme.spacing.xl,
        margin: `${theme.spacing.xl} auto`,
        maxWidth: '1200px',
        boxShadow: theme.shadows.md,
        border: `1px solid ${theme.colors.border}`
      }}>
        <div className="search-container">
          <h2 style={{
            ...sectionTitleStyle,
            marginBottom: theme.spacing.lg,
            fontSize: theme.typography.sizes.xl
          }}>
            🔍 Find Speakers, Articles & Presentations
          </h2>
          <GlobalSearch onResultClick={handleSearchResultClick} />
        </div>
      </section>

      {/* Main page content */}
      <main style={mainContentStyle}>
        {/* This Week's Featured Speaker */}
        <section style={sectionStyle} id="upcoming">
          <h2 style={sectionTitleStyle}>🎤 This Week's Featured Speaker</h2>
          
          {speakersLoading ? (
            <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
              <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>⏳</div>
              <p>Loading this week's speaker...</p>
            </div>
          ) : thisWeekSpeaker ? (
            <SpeakerCard {...thisWeekSpeaker} />
          ) : (
            <div style={{
              textAlign: 'center',
              padding: theme.spacing.xl,
              backgroundColor: theme.colors.background,
              borderRadius: '16px',
              border: `1px solid ${theme.colors.border}`
            }}>
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📅</div>
              <h3 style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
                Speaker Coming Soon
              </h3>
              <p style={{ color: theme.colors.textSecondary }}>
                We're finalizing this week's speaker. Check back soon for updates!
              </p>
            </div>
          )}
        </section>

        {/* Latest Blog Posts */}
        <section style={sectionStyle} id="blog">
          <h2 style={sectionTitleStyle}>📝 Latest Maritime Articles</h2>
          
          {postsLoading ? (
            <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
              <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>⏳</div>
              <p>Loading latest articles...</p>
            </div>
          ) : latestPosts.length > 0 ? (
            <>
              <div 
                className="blog-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: theme.spacing.lg,
                  marginBottom: theme.spacing.lg
                }}
              >
                {latestPosts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt}
                    content={post.content}
                    imageUrl={post.coverImage}
                    author={getAuthorName(post.author)}
                    authorAvatar={undefined}
                    publishedAt={post.publishedAt || post.createdAt}
                    category={getDefaultCategory(post.title)}
                    tags={getDefaultTags(post.title, post.content)}
                    readTime={calculateReadTime(post.content)}
                    onClick={() => handleBlogPostClick(post)}
                  />
                ))}
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <button
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: '#ffffff',
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: theme.typography.sizes.md,
                    fontWeight: theme.typography.weights.semibold,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: theme.shadows.sm
                  }}
                  onClick={handleViewAllArticles}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.shadows.sm;
                  }}
                >
                  📚 View All Articles
                </button>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: theme.spacing.xl,
              backgroundColor: theme.colors.background,
              borderRadius: '16px',
              border: `1px solid ${theme.colors.border}`
            }}>
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📝</div>
              <h3 style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
                Articles Coming Soon
              </h3>
              <p style={{ color: theme.colors.textSecondary }}>
                We're preparing exciting maritime content. Stay tuned!
              </p>
            </div>
          )}
        </section>

        {/* Latest Presentations */}
        <section style={sectionStyle} id="past-shows">
          <h2 style={sectionTitleStyle}>🎥 Latest Presentations</h2>
          
          {showsLoading ? (
            <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
              <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>⏳</div>
              <p>Loading latest presentations...</p>
            </div>
          ) : latestShows.length > 0 ? (
            <>
              <div 
                className="past-shows-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: latestShows.length === 1 
                    ? '1fr' 
                    : 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: theme.spacing.xl,
                  marginBottom: theme.spacing.lg,
                  maxWidth: '900px',
                  margin: `0 auto ${theme.spacing.lg} auto`
                }}
              >
                {latestShows.slice(0, 2).map((show) => (
                  <PastShowVideo 
                    key={show.id} 
                    {...show} 
                    compact={false}
                    onClick={() => handlePastShowClick(show)}
                  />
                ))}
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <button
                  style={{
                    backgroundColor: theme.colors.secondary,
                    color: '#ffffff',
                    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: theme.typography.sizes.md,
                    fontWeight: theme.typography.weights.semibold,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: theme.shadows.sm
                  }}
                  onClick={handleViewAllPresentations}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.shadows.sm;
                  }}
                >
                  🎬 View Full Archive
                </button>
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: theme.spacing.xl,
              backgroundColor: theme.colors.background,
              borderRadius: '16px',
              border: `1px solid ${theme.colors.border}`
            }}>
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🎬</div>
              <h3 style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
                Presentations Coming Soon
              </h3>
              <p style={{ color: theme.colors.textSecondary }}>
                We're preparing exciting maritime presentations. Check back soon!
              </p>
            </div>
          )}
        </section>

        {/* Upcoming Speakers - Next Few Weeks */}
        <UpcomingSpeakers maxSpeakers={3} />

        {/* Comments & Suggestions Section */}
        <CommentsSection />

        {/* Owner Bio Section */}
        <section style={sectionStyle} id="owner">
          <h2 style={sectionTitleStyle}>👨‍✈️ Meet Our Captain</h2>
          <OwnerBio />
        </section>

        {/* Club Information */}
        <section style={sectionStyle}>
          <div style={{
            backgroundColor: theme.colors.background,
            borderRadius: '16px',
            padding: theme.spacing.xl,
            boxShadow: theme.shadows.md,
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: theme.typography.sizes['2xl'],
              color: theme.colors.primary,
              marginBottom: theme.spacing.lg
            }}>
              🏛️ St. Francis Yacht Club
            </h3>
            <p style={{
              fontSize: theme.typography.sizes.lg,
              color: theme.colors.textSecondary,
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto',
              marginBottom: theme.spacing.lg
            }}>
              Located on the stunning San Francisco Bay, the historic St. Francis Yacht Club has been
              the home of maritime excellence since 1927. Our weekly luncheons combine world-class
              dining with fascinating maritime presentations in one of the city's most prestigious venues.
            </p>
            
            {/* Quick Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: theme.spacing.md,
              marginTop: theme.spacing.lg
            }}>
              <div style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.surface,
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>📅</div>
                <div style={{ fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>
                  Every Wednesday
                </div>
                <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
                  12:00 PM
                </div>
              </div>
              
              <div style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.surface,
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>🎤</div>
                <div style={{ fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>
                  Expert Speakers
                </div>
                <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
                  Maritime Leaders
                </div>
              </div>
              
              <div style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.surface,
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>🍽️</div>
                <div style={{ fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>
                  Fine Dining
                </div>
                <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
                  Premium Cuisine
                </div>
              </div>
              
              <div style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.surface,
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>🌊</div>
                <div style={{ fontWeight: theme.typography.weights.semibold, color: theme.colors.text }}>
                  Bay Views
                </div>
                <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
                  Stunning Location
                </div>
              </div>
            </div>
          </div>
        </section>

{/* Call to Action Section */}
<section style={sectionStyle}>
  <div style={{
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    borderRadius: '20px',
    padding: theme.spacing.xl,
    textAlign: 'center',
    color: '#ffffff'
  }}>
    <h3 style={{
      fontSize: theme.typography.sizes['2xl'],
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    }}>
      ⛵ Join the WEDNESDAY YACHTING LUNCHEON Community
    </h3>
    
    <p style={{
      fontSize: theme.typography.sizes.lg,
      marginBottom: theme.spacing.xl,
      opacity: 0.95,
      maxWidth: '600px',
      margin: `0 auto ${theme.spacing.xl} auto`
    }}>
      A long-standing weekly tradition at the St. Francis Yacht Club, bringing together sailors, adventurers, and maritime experts. 
      Connect with fellow enthusiasts, learn from experts, and enjoy exceptional cuisine.
    </p>
    
    <div style={{
      display: 'flex',
      gap: theme.spacing.md,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      <button
        style={{
          backgroundColor: '#ffffff',
          color: theme.colors.primary,
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          border: 'none',
          borderRadius: '25px',
          fontSize: theme.typography.sizes.md,
          fontWeight: theme.typography.weights.semibold,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
        onClick={() => window.open('https://www.stfyc.com/wyl', '_blank')}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        }}
      >
        📧 Learn About Attending
      </button>
      
      <button
        style={{
          backgroundColor: 'transparent',
          color: '#ffffff',
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          border: '2px solid #ffffff',
          borderRadius: '25px',
          fontSize: theme.typography.sizes.md,
          fontWeight: theme.typography.weights.semibold,
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => window.open('mailto:Ron@ronaldyoung.com', '_blank')}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.color = theme.colors.primary;
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        🎤 Become a Speaker
      </button>
    </div>
  </div>
</section>

        {/* Quick Navigation Links */}
        <section style={sectionStyle}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: theme.spacing.lg,
            marginTop: theme.spacing.xl
          }}>
            {/* Articles Link */}
            <div
              style={{
                backgroundColor: theme.colors.background,
                borderRadius: '16px',
                padding: theme.spacing.lg,
                textAlign: 'center',
                border: `1px solid ${theme.colors.border}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={handleViewAllArticles}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.sm }}>📚</div>
              <h4 style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.semibold,
                color: theme.colors.text,
                marginBottom: theme.spacing.xs
              }}>
                All Articles
              </h4>
              <p style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textSecondary,
                margin: 0
              }}>
                Browse our complete collection of maritime insights
              </p>
            </div>

            {/* Past Shows Link */}
            <div
              style={{
                backgroundColor: theme.colors.background,
                borderRadius: '16px',
                padding: theme.spacing.lg,
                textAlign: 'center',
                border: `1px solid ${theme.colors.border}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={handleViewAllPresentations}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.sm }}>🎬</div>
              <h4 style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.semibold,
                color: theme.colors.text,
                marginBottom: theme.spacing.xs
              }}>
                Presentation Archive
              </h4>
              <p style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textSecondary,
                margin: 0
              }}>
                Watch recordings of past presentations
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Site footer */}
      <Footer />
    </div>
  );
};
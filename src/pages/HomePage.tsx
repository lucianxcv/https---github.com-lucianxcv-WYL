/**
 * ENHANCED HOMEPAGE COMPONENT WITH PROPER NAVIGATION
 * 
 * Replace your existing src/pages/HomePage.tsx with this version
 */

import React, { useState } from 'react';
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
import { sampleData } from '../data/sampleData';
import { PastShow } from '../data/types';
import { useSpeakers } from '../hooks/useSpeakers';
import { useBlogPosts } from '../hooks/useBlogPosts';

export const HomePage: React.FC = () => {
  const theme = useTheme();
  const [filteredShows, setFilteredShows] = useState<PastShow[]>(sampleData.pastShows);
  
  // Get dynamic data from our hooks
  const { thisWeekSpeaker, upcomingSpeakers, loading: speakersLoading } = useSpeakers();
  const { latestPosts, loading: postsLoading } = useBlogPosts();

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

  // Handle search result clicks
  const handleSearchResultClick = (result: any) => {
    // Navigate to the appropriate content
    if (result.type === 'speaker') {
      // Scroll to speaker section or navigate to speaker details
      const speakerSection = document.getElementById('upcoming');
      speakerSection?.scrollIntoView({ behavior: 'smooth' });
    } else if (result.type === 'blog') {
      // Navigate to specific blog post
      window.location.hash = `#blog-post-${result.id}`;
    } else if (result.type === 'presentation') {
      // Navigate to past shows archive
      window.location.hash = '#past-shows';
    }
  };

  // Handle blog post clicks
  const handleBlogPostClick = (post: any) => {
    // Navigate to individual blog post page
    window.location.hash = `#blog-post-${post.id}`;
  };

  // Navigate to all articles page
  const handleViewAllArticles = () => {
    window.location.hash = '#articles';
  };

  // Navigate to past shows archive
  const handleViewAllPresentations = () => {
    window.location.hash = '#past-shows';
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
                    {...post}
                    onClick={() => handleBlogPostClick(post)}
                  />
                ))}
              </div>
              
              {/* View All Blog Posts Button */}
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

        {/* Past Presentations - Featured 4 */}
        <section style={sectionStyle} id="past-shows">
          <h2 style={sectionTitleStyle}>🎥 Featured Past Presentations</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: theme.spacing.xl,
            marginBottom: theme.spacing.lg
          }}>
            {filteredShows.slice(0, 4).map((show) => (
              <PastShowVideo key={show.id} {...show} />
            ))}
          </div>
          
          {/* View All Presentations Button */}
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
            backgroundColor: `linear-gradient(135deg, ${theme.colors.primary}ee, ${theme.colors.secondary}dd)`,
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
              🚀 Join the Maritime Community
            </h3>
            
            <p style={{
              fontSize: theme.typography.sizes.lg,
              marginBottom: theme.spacing.xl,
              opacity: 0.95,
              maxWidth: '600px',
              margin: `0 auto ${theme.spacing.xl} auto`
            }}>
              Be part of San Francisco's premier maritime dining experience. 
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
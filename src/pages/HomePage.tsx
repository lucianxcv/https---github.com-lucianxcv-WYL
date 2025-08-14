// ==================== src/pages/HomePage.tsx ====================
/**
 * HOMEPAGE COMPONENT
 * 
 * The main homepage that combines all the individual components.
 * Manages the overall layout and state for the homepage.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Rearrange component order (move sections up/down)
 * - Add or remove sections
 * - Change the max-width and spacing of the main content
 * - Add new sections like testimonials or news
 * - Modify the responsive breakpoints
 */

import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Hero } from '../components/home/Hero';
import { SpeakerCard } from '../components/home/SpeakerCard';
import { PastShowVideo } from '../components/home/PastShowVideo';
import { SearchAndFilter } from '../components/home/SearchAndFilter';
import { OwnerBio } from '../components/home/OwnerBio';
import { CommentsSection } from '../components/home/CommentsSection';
import { sampleData } from '../data/sampleData';
import { PastShow } from '../data/types';
import { MultiLocationWeather } from '../components/home/MultiLocationWeather';

export const HomePage: React.FC = () => {
  const theme = useTheme();
  // State for filtered past shows (controlled by SearchAndFilter component)
  const [filteredShows, setFilteredShows] = useState<PastShow[]>(sampleData.pastShows);
  
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
    maxWidth: '1200px', // Keeps content centered and readable
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
            .owner-bio {
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
            }
            .footer-content {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* Navigation bar */}
      <Navbar />

      {/* Hero section with countdown */}
      <Hero />
      
     <MultiLocationWeather />

      {/* Main page content */}
      <main style={mainContentStyle}>
        {/* Upcoming Speaker Section */}
        <section style={sectionStyle} id="upcoming">
          <h2 style={sectionTitleStyle}>🎤 This Week's Featured Speaker</h2>
          <SpeakerCard {...sampleData.speakers[0]} />
        </section>

        {/* Past Shows Section with Search */}
        <section style={sectionStyle} id="past-shows">
          <h2 style={sectionTitleStyle}>🎥 Past Presentations</h2>
          <SearchAndFilter 
            shows={sampleData.pastShows} 
            onFilter={setFilteredShows}
          />
          {/* Grid layout for video cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: theme.spacing.xl
          }}>
            {filteredShows.map((show) => (
              <PastShowVideo key={show.id} {...show} />
            ))}
          </div>
        </section>

        {/* Comments & Suggestions Section (Placeholder) */}
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
              margin: '0 auto'
            }}>
              Located on the stunning San Francisco Bay, the historic St. Francis Yacht Club has been 
              the home of maritime excellence since 1927. Our weekly luncheons combine world-class 
              dining with fascinating maritime presentations in one of the city's most prestigious venues.
            </p>
          </div>
        </section>
      </main>

      {/* Site footer */}
      <Footer />
    </div>
  );
};


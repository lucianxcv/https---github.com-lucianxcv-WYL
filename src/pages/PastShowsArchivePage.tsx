/**
 * PAST SHOWS ARCHIVE PAGE - COMPLETE VERSION
 * 
 * Features:
 * - Grid layout of all past presentations
 * - Search and filter functionality
 * - YouTube video integration
 * - Pagination and sorting
 * - Professional archive layout
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { PastShowVideo } from '../components/home/PastShowVideo';
import { PastShow } from '../data/types'; // Import from types file

export const PastShowsArchivePage: React.FC = () => {
  const theme = useTheme();
  const [shows, setShows] = useState<PastShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [showsPerPage] = useState(12);

  const topics = ['All', 'Technology', 'Navigation', 'Safety', 'History', 'Environment', 'Business', 'Innovation'];
  const years = ['All', '2024', '2023', '2022', '2021', '2020'];

  useEffect(() => {
    loadPastShows();
  }, []);

  const loadPastShows = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample past shows data with all required fields - replace with actual data fetching
      const sampleShows: PastShow[] = [
        {
          id: '1',
          title: 'The Future of Autonomous Shipping',
          speakerName: 'Captain Sarah Johnson',
          date: '2024-03-13',
          year: 2024,
          isPublished: true,
          createdAt: '2024-03-13T10:00:00Z',
          updatedAt: '2024-03-13T10:00:00Z',
          description: 'Exploring the latest developments in autonomous vessel technology and their impact on maritime safety and efficiency.',
          videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
          thumbnailUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
          duration: 45,
          topic: 'Technology',
          views: 1247,
          downloadUrl: '/presentations/autonomous-shipping-2024.pdf',
          speakerBio: 'Captain Johnson is a maritime technology expert with 20 years of experience in commercial shipping.',
          speakerCompany: 'Maritime Innovation Institute',
          featured: true,
          tags: ['Autonomous Vessels', 'AI', 'Innovation']
        },
        {
          id: '2',
          title: 'Sustainable Maritime Practices: Green Shipping Revolution',
          speakerName: 'Dr. Michael Chen',
          date: '2024-03-06',
          year: 2024,
          isPublished: true,
          createdAt: '2024-03-06T10:00:00Z',
          updatedAt: '2024-03-06T10:00:00Z',
          description: 'How the shipping industry is adopting environmentally friendly technologies to reduce carbon footprint.',
          videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
          thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          duration: 38,
          topic: 'Environment',
          views: 892,
          downloadUrl: '/presentations/green-shipping-2024.pdf',
          speakerBio: 'Dr. Chen is an environmental engineer specializing in maritime sustainability.',
          speakerCompany: 'Green Marine Solutions',
          tags: ['Sustainability', 'Environment', 'Green Technology']
        },
        {
          id: '3',
          title: 'Navigation Safety in the Digital Age',
          speakerName: 'Admiral James Wright',
          date: '2024-02-28',
          year: 2024,
          isPublished: true,
          createdAt: '2024-02-28T10:00:00Z',
          updatedAt: '2024-02-28T10:00:00Z',
          description: 'Modern navigation systems and safety protocols that are revolutionizing maritime operations.',
          videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
          thumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
          duration: 42,
          topic: 'Safety',
          views: 1156,
          downloadUrl: '/presentations/navigation-safety-2024.pdf',
          speakerBio: 'Admiral Wright brings 30 years of naval experience to civilian maritime safety.',
          speakerCompany: 'Maritime Safety Council',
          featured: true,
          tags: ['Safety', 'Navigation', 'Digital Systems']
        },
        {
          id: '4',
          title: 'The History of San Francisco Bay Maritime Trade',
          speakerName: 'Dr. Patricia Martinez',
          date: '2024-02-21',
          year: 2024,
          isPublished: true,
          createdAt: '2024-02-21T10:00:00Z',
          updatedAt: '2024-02-21T10:00:00Z',
          description: 'A fascinating journey through the maritime history that shaped San Francisco and the West Coast.',
          videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
          thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          duration: 35,
          topic: 'History',
          views: 734,
          downloadUrl: '/presentations/sf-bay-history-2024.pdf',
          speakerBio: 'Dr. Martinez is a maritime historian and author of several books on Pacific Coast shipping.',
          speakerCompany: 'UC San Francisco Maritime Studies',
          tags: ['History', 'San Francisco Bay', 'Trade']
        },
        {
          id: '5',
          title: 'Port Automation and Digital Logistics',
          speakerName: 'Roberto Silva',
          date: '2024-02-14',
          year: 2024,
          isPublished: true,
          createdAt: '2024-02-14T10:00:00Z',
          updatedAt: '2024-02-14T10:00:00Z',
          description: 'How automated port systems are transforming global trade and improving efficiency.',
          videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
          thumbnailUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
          duration: 40,
          topic: 'Technology',
          views: 623,
          downloadUrl: '/presentations/port-automation-2024.pdf',
          speakerBio: 'Roberto Silva is the CTO of West Coast Port Systems.',
          speakerCompany: 'Port Tech Solutions',
          tags: ['Automation', 'Logistics', 'Ports']
        },
        {
          id: '6',
          title: 'Maritime Cybersecurity: Protecting Connected Fleets',
          speakerName: 'Lisa Chang',
          date: '2024-02-07',
          year: 2024,
          isPublished: true,
          createdAt: '2024-02-07T10:00:00Z',
          updatedAt: '2024-02-07T10:00:00Z',
          description: 'Understanding and defending against cyber threats in modern maritime operations.',
          videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
          thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400',
          duration: 47,
          topic: 'Technology',
          views: 1089,
          downloadUrl: '/presentations/maritime-cybersecurity-2024.pdf',
          speakerBio: 'Lisa Chang is a cybersecurity expert specializing in maritime systems.',
          speakerCompany: 'SecureMarine Technologies',
          tags: ['Cybersecurity', 'Technology', 'Risk Management']
        }
      ];
      
      setShows(sampleShows);
    } catch (error) {
      console.error('Failed to load past shows:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort shows
  const filteredShows = shows
    .filter(show => {
      const matchesSearch = show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           show.speakerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           show.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTopic = selectedTopic === 'all' || 
                          show.topic.toLowerCase() === selectedTopic.toLowerCase();
      const matchesYear = selectedYear === 'all' || 
                         show.year.toString() === selectedYear;
      return matchesSearch && matchesTopic && matchesYear && show.isPublished;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });

  // Pagination
  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = filteredShows.slice(indexOfFirstShow, indexOfLastShow);
  const totalPages = Math.ceil(filteredShows.length / showsPerPage);

  const featuredShows = shows.filter(show => show.featured);

  const handleShowClick = (show: PastShow) => {
    // Open YouTube video in a modal or new tab
    if (show.videoId) {
      window.open(`https://www.youtube.com/watch?v=${show.videoId}`, '_blank');
    }
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

  if (loading) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🎬</div>
            <p>Loading presentation archive...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalViews = shows.reduce((sum, show) => sum + (show.views || 0), 0);
  const totalHours = Math.round(shows.reduce((sum, show) => sum + show.duration, 0) / 60);

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
        </header>

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
              {years.map(year => (
                <option key={year} value={year.toLowerCase()}>
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
              <option value="date">Latest First</option>
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
              onClick={() => {
                setSearchTerm('');
                setSelectedTopic('all');
                setSelectedYear('all');
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

        {/* Shows Grid */}
        {currentShows.length > 0 ? (
          <div style={gridStyle}>
            {currentShows.map((show) => (
              <PastShowVideo
                key={show.id}
                {...show}
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
              No Presentations Found
            </h3>
            <p style={{ color: theme.colors.textSecondary }}>
              Try adjusting your search criteria or browse different topics and years.
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
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              style={pageButtonStyle(false)}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}

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
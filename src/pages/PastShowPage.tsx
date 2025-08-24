/**
 * INDIVIDUAL PAST SHOW PAGE - REACT ROUTER VERSION
 * 
 * Updated for React Router:
 * - Uses useParams() instead of props
 * - Uses navigate() instead of window.location.hash
 * - Clean URL navigation throughout
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { showsApi } from '../utils/apiService';

interface PastShowData {
  id: number;
  title: string;
  speakerName: string;
  date: string;
  year: number;
  description?: string;
  videoId?: string;
  isPublished: boolean;
  slug?: string;
  duration?: number;
  topic?: string;
  views?: number;
  thumbnailUrl?: string;
  speakerBio?: string;
  speakerCompany?: string;
  featured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const PastShowPage: React.FC = () => {
  const { slug, showId } = useParams(); // Get slug from URL params
  const navigate = useNavigate();
  const theme = useTheme();
  const [show, setShow] = useState<PastShowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedShows, setRelatedShows] = useState<PastShowData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadShowBySlug(slug);
    } else if (showId) {
      loadShowById(showId);
    } else {
      setError('No episode identifier provided');
      setLoading(false);
    }
  }, [slug, showId]);

  const loadShowBySlug = async (showSlug: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🎬 Loading show by slug:', showSlug);
      
      // Since your API doesn't have getBySlug yet, we'll get all shows and find by slug
      const response = await showsApi.getAll();
      let showsData: PastShowData[] = [];
      
      if (response && typeof response === 'object') {
        if ('success' in response && response.success && 'data' in response) {
          showsData = Array.isArray(response.data) ? response.data as PastShowData[] : [];
        } else if (Array.isArray(response)) {
          showsData = response as PastShowData[];
        }
      }

      // Generate slugs and find matching show
      const enhancedShows = showsData.map(show => ({
        ...show,
        slug: show.slug || generateSlug(show.title, show.id)
      }));

      const foundShow = enhancedShows.find(show => show.slug === showSlug);
      
      if (foundShow) {
        const enhancedShow = {
          ...foundShow,
          topic: foundShow.topic || generateTopic(foundShow.title),
          duration: foundShow.duration || estimateDuration(foundShow.description),
          tags: foundShow.tags || generateTags(foundShow.title, foundShow.description),
          views: foundShow.views || Math.floor(Math.random() * 1000) + 100,
          thumbnailUrl: foundShow.thumbnailUrl || `https://img.youtube.com/vi/${foundShow.videoId || 'dQw4w9WgXcQ'}/maxresdefault.jpg`
        };
        
        setShow(enhancedShow);
        await loadRelatedShows(enhancedShow, enhancedShows);
      } else {
        setError('Episode not found');
      }
    } catch (error) {
      console.error('❌ Failed to load show:', error);
      setError(`Failed to load episode: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadShowById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🎬 Loading show by ID:', id);
      
      const response = await showsApi.getAll();
      let showsData: PastShowData[] = [];
      
      if (response && typeof response === 'object') {
        if ('success' in response && response.success && 'data' in response) {
          showsData = Array.isArray(response.data) ? response.data as PastShowData[] : [];
        } else if (Array.isArray(response)) {
          showsData = response as PastShowData[];
        }
      }

      const foundShow = showsData.find(show => show.id.toString() === id);
      
      if (foundShow) {
        const enhancedShow = {
          ...foundShow,
          slug: foundShow.slug || generateSlug(foundShow.title, foundShow.id),
          topic: foundShow.topic || generateTopic(foundShow.title),
          duration: foundShow.duration || estimateDuration(foundShow.description),
          tags: foundShow.tags || generateTags(foundShow.title, foundShow.description),
          views: foundShow.views || Math.floor(Math.random() * 1000) + 100,
          thumbnailUrl: foundShow.thumbnailUrl || `https://img.youtube.com/vi/${foundShow.videoId || 'dQw4w9WgXcQ'}/maxresdefault.jpg`
        };
        
        setShow(enhancedShow);
        
        // Redirect to slug-based URL for SEO
        if (enhancedShow.slug) {
          console.log('🔄 Redirecting to slug-based URL:', enhancedShow.slug);
          navigate(`/shows/${enhancedShow.slug}`, { replace: true });
          return;
        }
        
        await loadRelatedShows(enhancedShow, showsData);
      } else {
        setError('Episode not found');
      }
    } catch (error) {
      console.error('❌ Failed to load show:', error);
      setError(`Failed to load episode: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedShows = async (currentShow: PastShowData, allShows: PastShowData[]) => {
    try {
      // Get related shows (same topic or recent shows)
      const related = allShows
        .filter(s => s.id !== currentShow.id && s.isPublished)
        .map(show => ({
          ...show,
          slug: show.slug || generateSlug(show.title, show.id),
          topic: show.topic || generateTopic(show.title)
        }))
        .sort((a, b) => {
          // Prioritize same topic, then by date
          const topicMatch = (a.topic === currentShow.topic ? 1 : 0) - (b.topic === currentShow.topic ? 1 : 0);
          if (topicMatch !== 0) return topicMatch;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        .slice(0, 3);
      
      setRelatedShows(related);
    } catch (error) {
      console.error('Failed to load related shows:', error);
    }
  };

  // Helper functions (same as in usePastShows)
  const generateSlug = (title: string, id: number): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .slice(0, 50) + `-${id}`;
  };

  const generateTopic = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('navigation') || titleLower.includes('celestial')) return 'Navigation';
    if (titleLower.includes('safety') || titleLower.includes('emergency')) return 'Safety';
    if (titleLower.includes('technology') || titleLower.includes('autonomous')) return 'Technology';
    if (titleLower.includes('environment') || titleLower.includes('green')) return 'Environment';
    if (titleLower.includes('history') || titleLower.includes('heritage')) return 'History';
    if (titleLower.includes('business') || titleLower.includes('trade')) return 'Business';
    return 'Maritime';
  };

  const estimateDuration = (description?: string): number => {
    if (!description) return 45;
    const length = description.length;
    if (length > 500) return 60;
    if (length > 200) return 45;
    return 30;
  };

  const generateTags = (title: string, description?: string): string[] => {
    const text = (title + ' ' + (description || '')).toLowerCase();
    const possibleTags = [
      'sailing', 'navigation', 'maritime', 'ocean', 'safety', 'technology',
      'history', 'environment', 'business', 'ships', 'ports', 'trade'
    ];
    
    return possibleTags.filter(tag => text.includes(tag)).slice(0, 4);
  };

  const handleShare = (platform: string) => {
    if (!show) return;
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(show.title);
    const text = encodeURIComponent(show.description || `Watch "${show.title}" by ${show.speakerName}`);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${title}&body=${text}%0A%0A${url}`
    };
    
    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  const handleRelatedShowClick = (relatedShow: PastShowData) => {
    // Navigate to related show using React Router
    navigate(`/shows/${relatedShow.slug}`);
  };

  const pageStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    minHeight: '100vh',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    paddingTop: '80px'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: theme.spacing.xl
  };

  const breadcrumbStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
    textAlign: 'center'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['4xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 1.2
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap'
  };

  const videoContainerStyle: React.CSSProperties = {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
    borderRadius: '12px',
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surface
  };

  const contentStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.lg,
    lineHeight: 1.8,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl
  };

  // Loading state
  if (loading) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🎬</div>
            <p>Loading episode...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !show) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>❌</div>
            <h2>Episode Not Found</h2>
            <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.md }}>
              {error || 'The requested episode could not be found.'}
            </p>
            <button
              style={{
                backgroundColor: theme.colors.primary,
                color: '#ffffff',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                border: 'none',
                borderRadius: '8px',
                fontSize: theme.typography.sizes.base,
                cursor: 'pointer',
                marginRight: theme.spacing.sm
              }}
              onClick={() => navigate('/past-shows')}
            >
              🎬 Browse All Episodes
            </button>
            <button
              style={{
                backgroundColor: theme.colors.secondary,
                color: '#ffffff',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                border: 'none',
                borderRadius: '8px',
                fontSize: theme.typography.sizes.base,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              🏠 Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Navbar />
      
      <main style={containerStyle}>
        {/* Breadcrumb Navigation */}
        <nav style={breadcrumbStyle}>
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: theme.colors.textSecondary, 
              textDecoration: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            onClick={() => navigate('/')}
          >
            🏠 Home
          </button>
          <span>→</span>
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: theme.colors.textSecondary, 
              textDecoration: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            onClick={() => navigate('/past-shows')}
          >
            🎬 Past Shows
          </button>
          <span>→</span>
          <span style={{ color: theme.colors.text }}>{show.title}</span>
        </nav>

        {/* Episode Header */}
        <header style={headerStyle}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: theme.spacing.xs,
            backgroundColor: theme.colors.primary,
            color: '#ffffff',
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            borderRadius: '20px',
            fontSize: theme.typography.sizes.sm,
            fontWeight: theme.typography.weights.semibold,
            marginBottom: theme.spacing.md
          }}>
            📂 {show.topic}
          </div>
          
          <h1 style={titleStyle}>{show.title}</h1>
          
          <div style={metaStyle}>
            <span style={{ color: theme.colors.textSecondary }}>
              🎤 {show.speakerName}
            </span>
            <span style={{ color: theme.colors.textSecondary }}>
              📅 {new Date(show.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span style={{ color: theme.colors.textSecondary }}>
              ⏱️ {show.duration} min
            </span>
            {show.views && (
              <span style={{ color: theme.colors.textSecondary }}>
                👁️ {show.views} views
              </span>
            )}
          </div>
        </header>

        {/* Video Player */}
        {show.videoId && (
          <div style={videoContainerStyle}>
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              src={`https://www.youtube.com/embed/${show.videoId}?rel=0&modestbranding=1`}
              title={show.title}
              allowFullScreen
            />
          </div>
        )}

        {/* Episode Description */}
        {show.description && (
          <div style={contentStyle}>
            <h3 style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.text,
              marginBottom: theme.spacing.md
            }}>
              📝 About This Episode
            </h3>
            <p>{show.description}</p>
          </div>
        )}

        {/* Speaker Information */}
        <div style={{
          backgroundColor: theme.colors.background,
          borderRadius: '12px',
          padding: theme.spacing.lg,
          border: `1px solid ${theme.colors.border}`,
          marginBottom: theme.spacing.xl
        }}>
          <h3 style={{
            fontSize: theme.typography.sizes.xl,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text,
            marginBottom: theme.spacing.md
          }}>
            🎤 About the Speaker
          </h3>
          <h4 style={{
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.primary,
            marginBottom: theme.spacing.sm
          }}>
            {show.speakerName}
          </h4>
          {show.speakerCompany && (
            <p style={{
              fontSize: theme.typography.sizes.base,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.sm
            }}>
              {show.speakerCompany}
            </p>
          )}
          <p style={{
            fontSize: theme.typography.sizes.base,
            color: theme.colors.text,
            lineHeight: 1.6
          }}>
            {show.speakerBio || `${show.speakerName} presented this fascinating maritime topic at the Wednesday Yachting Luncheon.`}
          </p>
        </div>

        {/* Tags */}
        {show.tags && show.tags.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.xl
          }}>
            <span style={{ 
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.textSecondary,
              marginRight: theme.spacing.sm
            }}>
              🏷️ Tags:
            </span>
            {show.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  borderRadius: '20px',
                  fontSize: theme.typography.sizes.xs,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Social Sharing */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
          marginBottom: theme.spacing.xl,
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background,
          borderRadius: '12px',
          border: `1px solid ${theme.colors.border}`
        }}>
          <span style={{ fontWeight: theme.typography.weights.semibold }}>
            📤 Share this episode:
          </span>
          <button
            style={{
              backgroundColor: '#1DA1F2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.sizes.sm,
              cursor: 'pointer'
            }}
            onClick={() => handleShare('twitter')}
          >
            🐦 Twitter
          </button>
          <button
            style={{
              backgroundColor: '#4267B2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.sizes.sm,
              cursor: 'pointer'
            }}
            onClick={() => handleShare('facebook')}
          >
            📘 Facebook
          </button>
          <button
            style={{
              backgroundColor: '#0077B5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.sizes.sm,
              cursor: 'pointer'
            }}
            onClick={() => handleShare('linkedin')}
          >
            💼 LinkedIn
          </button>
          <button
            style={{
              backgroundColor: theme.colors.textSecondary,
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.sizes.sm,
              cursor: 'pointer'
            }}
            onClick={() => handleShare('email')}
          >
            ✉️ Email
          </button>
        </div>

        {/* Related Episodes */}
        {relatedShows.length > 0 && (
          <section style={{ marginBottom: theme.spacing.xl }}>
            <h3 style={{
              fontSize: theme.typography.sizes['2xl'],
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.lg,
              textAlign: 'center'
            }}>
              🎬 Related Episodes
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: theme.spacing.lg
            }}>
              {relatedShows.map((relatedShow) => (
                <div
                  key={relatedShow.id}
                  style={{
                    backgroundColor: theme.colors.background,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `1px solid ${theme.colors.border}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleRelatedShowClick(relatedShow)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {relatedShow.thumbnailUrl && (
                    <img
                      src={relatedShow.thumbnailUrl}
                      alt={relatedShow.title}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div style={{ padding: theme.spacing.md }}>
                    <h4 style={{
                      fontSize: theme.typography.sizes.lg,
                      fontWeight: theme.typography.weights.semibold,
                      color: theme.colors.text,
                      marginBottom: theme.spacing.sm,
                      lineHeight: 1.3
                    }}>
                      {relatedShow.title}
                    </h4>
                    <p style={{
                      fontSize: theme.typography.sizes.sm,
                      color: theme.colors.primary,
                      marginBottom: theme.spacing.sm,
                      fontWeight: theme.typography.weights.semibold
                    }}>
                      🎤 {relatedShow.speakerName}
                    </p>
                    {relatedShow.description && (
                      <p style={{
                        fontSize: theme.typography.sizes.sm,
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing.sm,
                        lineHeight: 1.5
                      }}>
                        {relatedShow.description.length > 100 
                          ? `${relatedShow.description.substring(0, 100)}...` 
                          : relatedShow.description}
                      </p>
                    )}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: theme.typography.sizes.xs,
                      color: theme.colors.textSecondary
                    }}>
                      <span>📅 {new Date(relatedShow.date).toLocaleDateString()}</span>
                      <span>⏱️ {relatedShow.duration || 45} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Navigation Back */}
        <div style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
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
            onClick={() => navigate('/past-shows')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🎬 Back to All Episodes
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
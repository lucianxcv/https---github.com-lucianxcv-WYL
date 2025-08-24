/**
 * MODERN CINEMA-THEMED PAST SHOW PAGE 🎬
 * 
 * Features:
 * - Modern Netflix/Disney+ inspired design
 * - Sleek dark theme with contemporary colors
 * - Large video player with smooth interactions
 * - Clean typography and modern animations
 * - Responsive design with cinema atmosphere
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CommentsSection } from '../components/home/CommentsSection';
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
  const { slug, showId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [show, setShow] = useState<PastShowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedShows, setRelatedShows] = useState<PastShowData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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
      console.log('🎬 Loading modern cinema experience for:', showSlug);
      
      const response = await showsApi.getAll();
      let showsData: PastShowData[] = [];
      
      if (response && typeof response === 'object') {
        if ('success' in response && response.success && 'data' in response) {
          showsData = Array.isArray(response.data) ? response.data as PastShowData[] : [];
        } else if (Array.isArray(response)) {
          showsData = response as PastShowData[];
        }
      }

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
      console.error('❌ Cinema experience error:', error);
      setError(`Failed to load episode: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadShowById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
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
        
        if (enhancedShow.slug) {
          navigate(`/shows/${enhancedShow.slug}`, { replace: true });
          return;
        }
        
        await loadRelatedShows(enhancedShow, showsData);
      } else {
        setError('Episode not found');
      }
    } catch (error) {
      console.error('❌ Cinema experience error:', error);
      setError(`Failed to load episode: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedShows = async (currentShow: PastShowData, allShows: PastShowData[]) => {
    try {
      const related = allShows
        .filter(s => s.id !== currentShow.id && s.isPublished)
        .map(show => ({
          ...show,
          slug: show.slug || generateSlug(show.title, show.id),
          topic: show.topic || generateTopic(show.title)
        }))
        .sort((a, b) => {
          const topicMatch = (a.topic === currentShow.topic ? 1 : 0) - (b.topic === currentShow.topic ? 1 : 0);
          if (topicMatch !== 0) return topicMatch;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        .slice(0, 2);
      
      setRelatedShows(related);
    } catch (error) {
      console.error('Failed to load related shows:', error);
    }
  };

  // Helper functions
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
    navigate(`/shows/${relatedShow.slug}`);
  };

  // 🎬 MODERN CINEMA STYLING
  const modernCinemaPageStyle: React.CSSProperties = {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#0d1117', // GitHub dark theme inspired
    background: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
    color: '#f0f6fc',
    position: 'relative'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '100px 24px 0 24px'
  };

  const heroSectionStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '60px',
    position: 'relative'
  };

  const modernTitleStyle: React.CSSProperties = {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    color: '#f0f6fc',
    marginBottom: '24px',
    lineHeight: 1.1,
    background: 'linear-gradient(135deg, #58a6ff 0%, #79c0ff 50%, #a5a5ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: '#8b949e',
    marginBottom: '32px',
    fontWeight: '500'
  };

  const metaBarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    marginBottom: '48px'
  };

  const metaBadgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(88, 166, 255, 0.1)',
    padding: '12px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(88, 166, 255, 0.2)',
    color: '#79c0ff',
    fontSize: '0.95rem',
    fontWeight: '500'
  };

  // Large Video Player (Netflix style)
  const videoPlayerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto 80px auto',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
    background: '#161b22'
  };

  const videoContainerStyle: React.CSSProperties = {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9
    height: 0
  };

  const videoOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isVideoPlaying 
      ? 'transparent' 
      : 'linear-gradient(45deg, rgba(13, 17, 23, 0.4) 0%, rgba(88, 166, 255, 0.1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.4s ease',
    cursor: isVideoPlaying ? 'default' : 'pointer'
  };

  const playButtonStyle: React.CSSProperties = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: 'rgba(88, 166, 255, 0.95)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: '#0d1117',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(88, 166, 255, 0.3)',
    opacity: isVideoPlaying ? 0 : 1,
    transform: 'scale(1)'
  };

  // Modern Info Section
  const infoSectionStyle: React.CSSProperties = {
    backgroundColor: 'rgba(22, 27, 34, 0.6)',
    borderRadius: '20px',
    padding: '48px',
    margin: '60px 0',
    border: '1px solid rgba(88, 166, 255, 0.1)',
    backdropFilter: 'blur(10px)'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '2.2rem',
    color: '#f0f6fc',
    marginBottom: '24px',
    fontWeight: '700',
    textAlign: 'center'
  };

  const speakerInfoStyle: React.CSSProperties = {
    textAlign: 'center'
  };

  const speakerNameStyle: React.CSSProperties = {
    fontSize: '2rem',
    color: '#79c0ff',
    fontWeight: '600',
    marginBottom: '12px'
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    color: '#c9d1d9',
    lineHeight: 1.6,
    maxWidth: '900px',
    margin: '0 auto'
  };

  // Related Shows Section
  const relatedSectionStyle: React.CSSProperties = {
    margin: '80px 0',
    backgroundColor: 'rgba(22, 27, 34, 0.4)',
    borderRadius: '20px',
    padding: '48px 32px',
    border: '1px solid rgba(88, 166, 255, 0.08)'
  };

  const relatedGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
    marginTop: '32px'
  };

  const relatedCardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(13, 17, 23, 0.8)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(88, 166, 255, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  // Tags Modern Style
  const tagsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    margin: '40px 0'
  };

  const tagStyle: React.CSSProperties = {
    backgroundColor: 'rgba(121, 192, 255, 0.15)',
    color: '#79c0ff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    border: '1px solid rgba(121, 192, 255, 0.2)',
    fontWeight: '500'
  };

  // Social Sharing Modern
  const socialSharingStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    margin: '60px 0',
    flexWrap: 'wrap'
  };

  const socialButtonStyle: React.CSSProperties = {
    backgroundColor: 'rgba(88, 166, 255, 0.1)',
    color: '#79c0ff',
    border: '1px solid rgba(88, 166, 255, 0.3)',
    borderRadius: '12px',
    padding: '12px 20px',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  // CSS Animations
  const animations = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.05); opacity: 1; }
    }
    
    .fade-in { animation: fadeInUp 0.8s ease-out; }
    
    .play-button:hover {
      transform: scale(1.1);
      background-color: rgba(88, 166, 255, 1);
      box-shadow: 0 12px 40px rgba(88, 166, 255, 0.4);
    }
    
    .related-card:hover {
      transform: translateY(-8px);
      border-color: rgba(88, 166, 255, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    
    .social-btn:hover {
      background-color: rgba(88, 166, 255, 0.2);
      border-color: rgba(88, 166, 255, 0.5);
      transform: translateY(-2px);
    }
    
    .nav-btn:hover {
      background-color: rgba(88, 166, 255, 1);
      color: #0d1117;
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(88, 166, 255, 0.3);
    }
    
    @media (max-width: 768px) {
      .meta-bar { flex-direction: column; align-items: center; }
      .related-grid { grid-template-columns: 1fr; }
      .social-sharing { flex-direction: column; align-items: center; }
    }
  `;

  // Loading state
  if (loading) {
    return (
      <div style={modernCinemaPageStyle}>
        <style>{animations}</style>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '120px 0' }}>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #58a6ff 0%, #79c0ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>🎬</div>
            <p style={{ fontSize: '1.3rem', color: '#8b949e' }}>Loading your episode...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !show) {
    return (
      <div style={modernCinemaPageStyle}>
        <style>{animations}</style>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '120px 0' }}>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '24px',
              color: '#f85149' 
            }}>❌</div>
            <h2 style={{ 
              color: '#f0f6fc', 
              fontSize: '2.5rem', 
              marginBottom: '20px',
              fontWeight: '700' 
            }}>Episode Not Found</h2>
            <p style={{ 
              color: '#8b949e', 
              marginBottom: '40px', 
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto 40px auto'
            }}>
              {error || 'The requested episode could not be found in our archive.'}
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                style={{
                  backgroundColor: 'rgba(88, 166, 255, 1)',
                  color: '#0d1117',
                  padding: '16px 32px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/past-shows')}
                className="nav-btn"
              >
                🎬 Browse All Episodes
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  color: '#79c0ff',
                  padding: '16px 32px',
                  border: '2px solid rgba(88, 166, 255, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/')}
                className="nav-btn"
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={modernCinemaPageStyle}>
      <style>{animations}</style>
      
      <Navbar />
      
      <main style={containerStyle}>
        {/* Modern Hero Section */}
        <header style={heroSectionStyle} className="fade-in">
          <h1 style={modernTitleStyle}>{show.title}</h1>
          <div style={subtitleStyle}>
            Featuring {show.speakerName}
          </div>
          
          <div style={metaBarStyle} className="meta-bar">
            <div style={metaBadgeStyle}>
              📅 {new Date(show.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div style={metaBadgeStyle}>
              ⏱️ {show.duration} minutes
            </div>
            <div style={metaBadgeStyle}>
              🎭 {show.topic}
            </div>
            {show.views && (
              <div style={metaBadgeStyle}>
                👥 {show.views.toLocaleString()} viewers
              </div>
            )}
          </div>
        </header>

        {/* Large Featured Video Player */}
        <div style={videoPlayerStyle} className="fade-in">
          <div style={videoContainerStyle}>
            {show.videoId ? (
              <>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  src={`https://www.youtube.com/embed/${show.videoId}?rel=0&modestbranding=1&autoplay=${isVideoPlaying ? 1 : 0}`}
                  title={show.title}
                  allowFullScreen
                />
                <div style={videoOverlayStyle} onClick={() => setIsVideoPlaying(true)}>
                  <button style={playButtonStyle} className="play-button">
                    ▶️
                  </button>
                </div>
              </>
            ) : (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#161b22',
                color: '#6e7681'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎬</div>
                  <p style={{ fontSize: '1.1rem' }}>Video coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About the Show Section */}
        <section style={infoSectionStyle} className="fade-in">
          <div style={speakerInfoStyle}>
            <h2 style={sectionTitleStyle}>📋 About the Show</h2>
            <h3 style={speakerNameStyle}>{show.speakerName}</h3>
            {show.speakerCompany && (
              <p style={{
                fontSize: '1.2rem',
                color: '#8b949e',
                marginBottom: '24px',
                fontStyle: 'italic'
              }}>
                {show.speakerCompany}
              </p>
            )}
            <p style={descriptionStyle}>
              {show.speakerBio || show.description || 
                `${show.speakerName} delivered an outstanding presentation on maritime topics at the Wednesday Yachting Luncheon, sharing valuable insights with our distinguished audience.`}
            </p>
          </div>
        </section>

        {/* Tags */}
        {show.tags && show.tags.length > 0 && (
          <div style={tagsContainerStyle}>
            {show.tags.map((tag, index) => (
              <span key={index} style={tagStyle}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Social Sharing */}
        <div style={socialSharingStyle} className="social-sharing">
          <span style={{ 
            color: '#f0f6fc', 
            fontSize: '1.1rem', 
            fontWeight: '600',
            alignSelf: 'center',
            marginRight: '16px'
          }}>
            Share this episode:
          </span>
          <button
            style={socialButtonStyle}
            className="social-btn"
            onClick={() => handleShare('twitter')}
          >
            🐦 Twitter
          </button>
          <button
            style={socialButtonStyle}
            className="social-btn"
            onClick={() => handleShare('facebook')}
          >
            📘 Facebook
          </button>
          <button
            style={socialButtonStyle}
            className="social-btn"
            onClick={() => handleShare('linkedin')}
          >
            💼 LinkedIn
          </button>
          <button
            style={socialButtonStyle}
            className="social-btn"
            onClick={() => handleShare('email')}
          >
            ✉️ Email
          </button>
        </div>

        {/* Related Episodes */}
        {relatedShows.length > 0 && (
          <section style={relatedSectionStyle} className="fade-in">
            <h3 style={sectionTitleStyle}>🔗 Related Episodes</h3>
            <div style={relatedGridStyle} className="related-grid">
              {relatedShows.map((relatedShow) => (
                <div
                  key={relatedShow.id}
                  style={relatedCardStyle}
                  className="related-card"
                  onClick={() => handleRelatedShowClick(relatedShow)}
                >
                  {relatedShow.thumbnailUrl && (
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={relatedShow.thumbnailUrl}
                        alt={relatedShow.title}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(13, 17, 23, 0.9)',
                        color: '#79c0ff',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {relatedShow.duration || 45}m
                      </div>
                    </div>
                  )}
                  <div style={{ padding: '24px' }}>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      color: '#f0f6fc',
                      marginBottom: '12px',
                      lineHeight: 1.3
                    }}>
                      {relatedShow.title}
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#79c0ff',
                      marginBottom: '16px',
                      fontWeight: '500'
                    }}>
                      🎤 {relatedShow.speakerName}
                    </p>
                    {relatedShow.description && (
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#8b949e',
                        marginBottom: '16px',
                        lineHeight: 1.4
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
                      fontSize: '0.8rem',
                      color: '#6e7681'
                    }}>
                      <span>📅 {new Date(relatedShow.date).getFullYear()}</span>
                      <span style={{
                        backgroundColor: 'rgba(88, 166, 255, 0.15)',
                        color: '#79c0ff',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {relatedShow.topic}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Comments Section */}
        <section style={{
          backgroundColor: 'rgba(22, 27, 34, 0.6)',
          borderRadius: '20px',
          padding: '48px 24px',
          margin: '80px 0',
          border: '1px solid rgba(88, 166, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }} className="fade-in">
          <div style={{
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <CommentsSection />
          </div>
        </section>

        {/* Navigation Back */}
        <div style={{ 
          textAlign: 'center', 
          margin: '80px 0 60px 0',
          paddingTop: '60px',
          borderTop: '1px solid rgba(88, 166, 255, 0.1)'
        }}>
          <button
            style={{
              backgroundColor: 'rgba(88, 166, 255, 1)',
              color: '#0d1117',
              padding: '18px 36px',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(88, 166, 255, 0.2)'
            }}
            onClick={() => navigate('/past-shows')}
            className="nav-btn"
          >
            🎬 Back to All Episodes
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
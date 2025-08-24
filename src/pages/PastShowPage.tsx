/**
 * CINEMA-THEMED PAST SHOW PAGE 🎬
 * 
 * Features:
 * - Dark cinema atmosphere with theater styling
 * - Movie poster-style header with spotlight effects
 * - Large featured video player like Netflix
 * - Velvet red accents with gold details
 * - Film strip decorations and cinema elements
 * - Compact related episodes (2 max)
 * - Comments section for audience engagement
 * - Smooth curtain-opening animations
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
  const [showCurtains, setShowCurtains] = useState(true);

  // Cinema entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCurtains(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
      console.log('🎬 Loading cinema experience for:', showSlug);
      
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
        .slice(0, 2); // Only 2 related shows for cinema layout
      
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

  // 🎬 CINEMA STYLING
  const cinemaPageStyle: React.CSSProperties = {
    fontFamily: '"Crimson Text", "Times New Roman", serif', // Elegant cinema font
    minHeight: '100vh',
    backgroundColor: '#0a0a0a', // Deep theater black
    background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 70%)', // Spotlight effect
    color: '#f5f5f5',
    position: 'relative',
    overflow: 'hidden'
  };

  // Film strip decoration
  const filmStripStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '20px',
    background: `repeating-linear-gradient(
      90deg,
      #2c2c2c 0px,
      #2c2c2c 10px,
      #1a1a1a 10px,
      #1a1a1a 20px
    )`,
    zIndex: 1
  };

  const curtainStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: showCurtains ? '0%' : '-100%',
    width: '50%',
    height: '100vh',
    background: 'linear-gradient(90deg, #8B0000 0%, #A0522D 100%)', // Rich velvet red
    zIndex: 9999,
    transition: 'left 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: showCurtains ? 'inset -20px 0 40px rgba(0,0,0,0.5)' : 'none'
  };

  const curtainRightStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: showCurtains ? '0%' : '-100%',
    width: '50%',
    height: '100vh',
    background: 'linear-gradient(270deg, #8B0000 0%, #A0522D 100%)',
    zIndex: 9999,
    transition: 'right 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: showCurtains ? 'inset 20px 0 40px rgba(0,0,0,0.5)' : 'none'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '100px 20px 0 20px',
    position: 'relative',
    zIndex: 2
  };

  const cinemaHeaderStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '40px',
    position: 'relative'
  };

  const moviePosterStyle: React.CSSProperties = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #DAA520, #FFD700, #DAA520)', // Gold accent
    padding: '3px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(218, 165, 32, 0.3)'
  };

  const nowPlayingBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#DC143C', // Cinema red
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '16px',
    boxShadow: '0 4px 15px rgba(220, 20, 60, 0.4)'
  };

  const cinemaTitle: React.CSSProperties = {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    color: '#FFD700', // Gold title
    marginBottom: '16px',
    textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
    lineHeight: 1.1,
    fontFamily: '"Playfair Display", serif'
  };

  const cinemaSubtitle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: '#f5f5f5',
    marginBottom: '20px',
    fontStyle: 'italic',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  };

  const cinemaMetaStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    marginBottom: '40px',
    fontSize: '16px'
  };

  const metaBadgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    color: '#FFD700'
  };

  // Featured video player (Netflix style)
  const featuredVideoStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto 60px auto',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
    border: '4px solid #DAA520' // Gold frame
  };

  const videoContainerStyle: React.CSSProperties = {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9
    height: 0,
    backgroundColor: '#000'
  };

  const videoOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isVideoPlaying 
      ? 'transparent' 
      : 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(220,20,60,0.1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    cursor: isVideoPlaying ? 'default' : 'pointer'
  };

  const playButtonStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(220, 20, 60, 0.9)',
    border: '4px solid #FFD700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(220, 20, 60, 0.4)',
    opacity: isVideoPlaying ? 0 : 1
  };

  // Theater seating style for speaker info
  const theaterSectionStyle: React.CSSProperties = {
    backgroundColor: 'rgba(139, 0, 0, 0.1)', // Subtle velvet background
    borderRadius: '16px',
    padding: '40px',
    margin: '40px 0',
    border: '2px solid rgba(255, 215, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden'
  };

  const spotlightEffectStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-50%',
    left: '50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.05) 0%, transparent 70%)',
    transform: 'translateX(-50%)',
    pointerEvents: 'none'
  };

  const speakerInfoStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center'
  };

  const speakerNameStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: '12px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  };

  // Compact related shows (cinema lobby style)
  const lobbyStyle: React.CSSProperties = {
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    borderRadius: '16px',
    padding: '30px',
    margin: '40px 0',
    border: '1px solid rgba(255, 215, 0, 0.2)'
  };

  const lobbySectionTitle: React.CSSProperties = {
    fontSize: '2rem',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: 'bold'
  };

  const relatedShowsGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  };

  const relatedShowCard: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const socialSharingStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    margin: '40px 0',
    flexWrap: 'wrap'
  };

  const socialButtonStyle: React.CSSProperties = {
    backgroundColor: 'rgba(220, 20, 60, 0.8)',
    color: '#fff',
    border: '2px solid #FFD700',
    borderRadius: '25px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  // CSS Animations
  const animations = `
    @keyframes curtainOpen {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
    
    @keyframes spotlight {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.7; }
    }
    
    @keyframes filmRoll {
      from { transform: translateX(-20px); }
      to { transform: translateX(0px); }
    }
    
    @keyframes goldShimmer {
      0% { text-shadow: 3px 3px 6px rgba(0,0,0,0.7); }
      50% { text-shadow: 3px 3px 15px rgba(255,215,0,0.5), -3px -3px 15px rgba(255,215,0,0.3); }
      100% { text-shadow: 3px 3px 6px rgba(0,0,0,0.7); }
    }
    
    .cinema-title {
      animation: goldShimmer 3s ease-in-out infinite;
    }
    
    .play-button:hover {
      transform: scale(1.1);
      background-color: rgba(220, 20, 60, 1);
      box-shadow: 0 12px 35px rgba(220, 20, 60, 0.6);
    }
    
    .related-card:hover {
      transform: translateY(-5px);
      border-color: rgba(255, 215, 0, 0.6);
      box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
    }
    
    .social-btn:hover {
      background-color: rgba(255, 215, 0, 0.9);
      color: #000;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
    }
    
    @media (max-width: 768px) {
      .cinema-title { font-size: 2.5rem !important; }
      .cinema-meta { flex-direction: column !important; align-items: center !important; }
      .related-shows-grid { grid-template-columns: 1fr !important; }
    }
  `;

  // Loading state
  if (loading) {
    return (
      <div style={cinemaPageStyle}>
        <style>{animations}</style>
        {/* Theater curtains */}
        <div style={curtainStyle}></div>
        <div style={curtainRightStyle}></div>
        
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#FFD700' }}>🎬</div>
            <p style={{ fontSize: '1.5rem', color: '#f5f5f5' }}>Preparing your cinema experience...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !show) {
    return (
      <div style={cinemaPageStyle}>
        <style>{animations}</style>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#DC143C' }}>🎭</div>
            <h2 style={{ color: '#FFD700', fontSize: '2.5rem', marginBottom: '20px' }}>Show Not Found</h2>
            <p style={{ color: '#f5f5f5', marginBottom: '30px', fontSize: '1.2rem' }}>
              {error || 'The requested episode could not be found in our cinema archive.'}
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                style={{
                  backgroundColor: '#DC143C',
                  color: '#fff',
                  padding: '15px 30px',
                  border: '2px solid #FFD700',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/past-shows')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD700';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC143C';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                🎬 Browse All Episodes
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  color: '#FFD700',
                  padding: '15px 30px',
                  border: '2px solid #FFD700',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD700';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FFD700';
                }}
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
    <div style={cinemaPageStyle}>
      <style>{animations}</style>
      
      {/* Theater curtains */}
      <div style={curtainStyle}></div>
      <div style={curtainRightStyle}></div>
      
      {/* Film strip decoration */}
      <div style={filmStripStyle}></div>
      
      <Navbar />
      
      <main style={containerStyle}>
        {/* Cinema Header */}
        <header style={cinemaHeaderStyle}>
          <div style={moviePosterStyle}>
            <div style={nowPlayingBadgeStyle}>⭐ Now Playing</div>
          </div>
          
          <h1 style={cinemaTitle} className="cinema-title">{show.title}</h1>
          
          <div style={cinemaSubtitle}>
            Featuring {show.speakerName}
          </div>
          
          <div style={cinemaMetaStyle} className="cinema-meta">
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

        {/* Featured Video Player */}
        <div style={featuredVideoStyle}>
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
                  <div style={playButtonStyle} className="play-button">
                    ▶️
                  </div>
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
                backgroundColor: '#1a1a1a',
                color: '#666'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎬</div>
                  <p>Video coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Speaker Spotlight Section */}
        <section style={theaterSectionStyle}>
          <div style={spotlightEffectStyle}></div>
          <div style={speakerInfoStyle}>
            <h2 style={speakerNameStyle}>🎤 {show.speakerName}</h2>
            {show.speakerCompany && (
              <p style={{
                fontSize: '1.3rem',
                color: '#f5f5f5',
                marginBottom: '20px',
                fontStyle: 'italic'
              }}>
                {show.speakerCompany}
              </p>
            )}
            <p style={{
              fontSize: '1.1rem',
              color: '#e0e0e0',
              lineHeight: 1.6,
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {show.speakerBio || show.description || 
                `${show.speakerName} delivered an outstanding presentation on maritime topics at the Wednesday Yachting Luncheon, sharing valuable insights with our distinguished audience.`}
            </p>
          </div>
        </section>

        {/* Tags Cinema Style */}
        {show.tags && show.tags.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            margin: '30px 0'
          }}>
            {show.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: 'rgba(220, 20, 60, 0.2)',
                  color: '#FFD700',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  fontWeight: 'bold'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Social Sharing Cinema Style */}
        <div style={socialSharingStyle}>
          <span style={{ 
            color: '#FFD700', 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            alignSelf: 'center'
          }}>
            🎬 Share This Feature:
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

        {/* Coming Soon in Our Cinema - Related Shows */}
        {relatedShows.length > 0 && (
          <section style={lobbyStyle}>
            <h3 style={lobbySectionTitle}>🍿 Coming Soon in Our Cinema</h3>
            <div style={relatedShowsGrid}>
              {relatedShows.map((relatedShow) => (
                <div
                  key={relatedShow.id}
                  style={relatedShowCard}
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
                          height: '160px',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(220, 20, 60, 0.9)',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {relatedShow.duration || 45}m
                      </div>
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <h4 style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#FFD700',
                      marginBottom: '8px',
                      lineHeight: 1.3
                    }}>
                      {relatedShow.title}
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      color: '#f5f5f5',
                      marginBottom: '12px',
                      fontWeight: 'bold'
                    }}>
                      🎤 {relatedShow.speakerName}
                    </p>
                    {relatedShow.description && (
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#cccccc',
                        marginBottom: '12px',
                        lineHeight: 1.4
                      }}>
                        {relatedShow.description.length > 80 
                          ? `${relatedShow.description.substring(0, 80)}...` 
                          : relatedShow.description}
                      </p>
                    )}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: '#aaaaaa'
                    }}>
                      <span>📅 {new Date(relatedShow.date).getFullYear()}</span>
                      <span style={{
                        backgroundColor: 'rgba(255, 215, 0, 0.2)',
                        color: '#FFD700',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.75rem'
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

        {/* Audience Reviews - Comments Section */}
        <section style={{
          backgroundColor: 'rgba(26, 26, 46, 0.3)',
          borderRadius: '16px',
          padding: '40px 20px',
          margin: '50px 0',
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <h3 style={{
            fontSize: '2.5rem',
            color: '#FFD700',
            textAlign: 'center',
            marginBottom: '30px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            🎭 Audience Reviews
          </h3>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <CommentsSection />
          </div>
        </section>

        {/* Cinema Navigation */}
        <div style={{ 
          textAlign: 'center', 
          margin: '60px 0 40px 0',
          padding: '40px 0',
          borderTop: '2px solid rgba(255, 215, 0, 0.3)'
        }}>
          <button
            style={{
              backgroundColor: '#DC143C',
              color: '#fff',
              padding: '18px 35px',
              border: '3px solid #FFD700',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 8px 25px rgba(220, 20, 60, 0.3)'
            }}
            onClick={() => navigate('/past-shows')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFD700';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#DC143C';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 20, 60, 0.3)';
            }}
          >
            🎬 Back to Cinema Archive
          </button>
        </div>

        {/* Cinema Credits */}
        <div style={{
          textAlign: 'center',
          padding: '30px 0',
          borderTop: '1px solid rgba(255, 215, 0, 0.2)',
          color: '#888',
          fontSize: '0.9rem'
        }}>
          <p style={{ marginBottom: '10px', color: '#FFD700' }}>
            ⭐ Wednesday Yachting Luncheon Cinema Experience ⭐
          </p>
          <p>
            Featuring maritime excellence since 1927 • St. Francis Yacht Club
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
/**
 * NEWSPAPER-THEMED BLOG POST PAGE 📰
 * 
 * Features:
 * - Classic newspaper layout with modern touches
 * - Serif typography for authentic journalism feel
 * - Multi-column text layout like real newspapers
 * - Drop caps and pull quotes
 * - Print-style margins and spacing
 * - Byline and dateline styling
 * - Classic newspaper section headers
 * - Modern responsive design
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CommentsSection } from '../components/home/CommentsSection';
import { postsApi } from '../utils/apiService';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
  };
  publishedAt?: string;
  createdAt: string;
  coverImage?: string;
  categories?: any[];
  tags?: any[];
  readTime?: number;
  views?: number;
}

export const BlogPostPage: React.FC = () => {
  const { slug, postId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadBlogPostBySlug(slug);
    } else if (postId) {
      loadBlogPostById(postId);
    } else {
      setError('No post identifier provided');
      setLoading(false);
    }
  }, [slug, postId]);

  const loadBlogPostBySlug = async (postSlug: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📰 Loading newspaper article:', postSlug);
      
      const response = await postsApi.getBySlug(postSlug);
      
      if (response.success && response.data) {
        setPost(response.data);
        await loadRelatedPosts(response.data);
      } else {
        setError('Article not found');
      }
    } catch (error) {
      console.error('❌ Failed to load article:', error);
      setError(`Failed to load article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadBlogPostById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📰 Loading article by ID:', id);
      
      const response = await postsApi.getById(id);
      
      if (response.success && response.data) {
        const postData = response.data;
        setPost(postData);
        
        if (postData.slug) {
          navigate(`/posts/${postData.slug}`, { replace: true });
          return;
        }
        
        await loadRelatedPosts(postData);
      } else {
        setError('Article not found');
      }
    } catch (error) {
      console.error('❌ Failed to load article:', error);
      setError(`Failed to load article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async (currentPost: BlogPostData) => {
    try {
      const response = await postsApi.getAll({
        limit: 4,
        published: true
      });

      if (response.success && response.data) {
        const related = response.data
          .filter(p => p.id !== currentPost.id)
          .slice(0, 3);
        
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Failed to load related posts:', error);
    }
  };

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleShare = (platform: string) => {
    if (!post) return;
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.excerpt || post.content.substring(0, 150) + '...');
    
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

  const handleRelatedPostClick = (relatedPost: BlogPostData) => {
    navigate(`/posts/${relatedPost.slug}`);
  };

  // 📰 NEWSPAPER STYLING
  const newspaperPageStyle: React.CSSProperties = {
    fontFamily: '"Crimson Text", "Times New Roman", Georgia, serif',
    minHeight: '100vh',
    backgroundColor: '#fefefe', // Slightly off-white like newsprint
    background: `
      radial-gradient(circle at 20% 50%, rgba(0,0,0,0.02) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0,0,0,0.02) 0%, transparent 50%),
      linear-gradient(90deg, transparent 49%, rgba(0,0,0,0.03) 50%, transparent 51%)
    `,
    color: '#1a1a1a',
    lineHeight: 1.7
  };

  const newspaperContainerStyle: React.CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '120px 40px 60px 40px',
    position: 'relative'
  };

  // Newspaper masthead style
  const mastheadStyle: React.CSSProperties = {
    borderTop: '4px solid #1a1a1a',
    borderBottom: '1px solid #1a1a1a',
    textAlign: 'center',
    padding: '20px 0',
    marginBottom: '40px',
    position: 'relative'
  };

  const mastheadTitleStyle: React.CSSProperties = {
    fontFamily: '"Playfair Display", "Times New Roman", serif',
    fontSize: '2.8rem',
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    margin: '0',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  };

  const mastheadSubtitleStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: '#666',
    letterSpacing: '1px',
    marginTop: '8px',
    fontWeight: '400',
    textTransform: 'uppercase'
  };

  const datelineStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '40px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '15px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  };

  // Article header styles
  const headlineStyle: React.CSSProperties = {
    fontFamily: '"Playfair Display", "Times New Roman", serif',
    fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
    fontWeight: '900',
    color: '#1a1a1a',
    lineHeight: 1.1,
    marginBottom: '16px',
    textAlign: 'center',
    letterSpacing: '-0.5px'
  };

  const subheadlineStyle: React.CSSProperties = {
    fontSize: '1.4rem',
    color: '#444',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: '32px',
    lineHeight: 1.3,
    fontWeight: '400',
    maxWidth: '700px',
    margin: '0 auto 32px auto'
  };

  const bylineStyle: React.CSSProperties = {
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
    padding: '20px 0',
    marginBottom: '32px',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#666',
    backgroundColor: 'rgba(0,0,0,0.02)'
  };

  const authorInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '12px'
  };

  const authorNameStyle: React.CSSProperties = {
    fontWeight: '600',
    color: '#1a1a1a',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const publishInfoStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    fontSize: '0.85rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  // Article content styles with newspaper columns
  const articleContentStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    lineHeight: 1.8,
    color: '#1a1a1a',
    marginBottom: '48px',
    textAlign: 'justify',
    columnCount: 1, // Will change to 2 on larger screens
    columnGap: '40px',
    columnRule: '1px solid #ddd'
  };

  // Featured image newspaper style
  const featuredImageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    marginBottom: '16px',
    border: '2px solid #1a1a1a',
    borderRadius: '4px'
  };

  const imageCaptionStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: '32px',
    padding: '8px 16px',
    backgroundColor: 'rgba(0,0,0,0.02)',
    border: '1px solid #eee'
  };

  // Pull quote style
  const pullQuoteStyle: React.CSSProperties = {
    fontSize: '1.3rem',
    fontStyle: 'italic',
    color: '#1a1a1a',
    textAlign: 'center',
    margin: '32px 0',
    padding: '24px',
    border: '2px solid #1a1a1a',
    backgroundColor: 'rgba(0,0,0,0.02)',
    position: 'relative',
    breakInside: 'avoid'
  };

  // Tags newspaper style
  const tagsStyle: React.CSSProperties = {
    borderTop: '2px solid #1a1a1a',
    borderBottom: '1px solid #ddd',
    padding: '20px 0',
    marginBottom: '32px'
  };

  const tagItemStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '4px 12px',
    margin: '4px 8px 4px 0',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  // Related articles (sidebar style)
  const sidebarStyle: React.CSSProperties = {
    borderTop: '3px solid #1a1a1a',
    padding: '32px 0',
    marginTop: '48px'
  };

  const sidebarTitleStyle: React.CSSProperties = {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.8rem',
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: '24px',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const relatedArticleStyle: React.CSSProperties = {
    borderBottom: '1px solid #ddd',
    padding: '20px 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const relatedTitleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
    lineHeight: 1.3
  };

  const relatedMetaStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  // Share buttons newspaper style
  const shareBoxStyle: React.CSSProperties = {
    border: '2px solid #1a1a1a',
    padding: '24px',
    marginBottom: '40px',
    backgroundColor: 'rgba(0,0,0,0.02)',
    textAlign: 'center'
  };

  const shareButtonStyle: React.CSSProperties = {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    margin: '4px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  // CSS animations and responsive design
  const animations = `
    @media (min-width: 768px) {
      .newspaper-content {
        column-count: 2;
      }
      
      .newspaper-container {
        padding-left: 60px;
        padding-right: 60px;
      }
    }
    
    @media (max-width: 767px) {
      .masthead-title {
        font-size: 2rem !important;
      }
      
      .headline {
        font-size: 2.2rem !important;
      }
      
      .newspaper-container {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
    
    .drop-cap::first-letter {
      float: left;
      font-family: "Playfair Display", serif;
      font-size: 4.5rem;
      line-height: 3.5rem;
      padding-right: 8px;
      padding-top: 4px;
      font-weight: 900;
      color: #1a1a1a;
    }
    
    .related-article:hover {
      background-color: rgba(0,0,0,0.02);
      padding-left: 16px;
    }
    
    .share-btn:hover {
      background-color: #444;
      transform: translateY(-1px);
    }
    
    .pull-quote::before {
      content: """;
      position: absolute;
      top: -10px;
      left: 16px;
      font-size: 3rem;
      color: #1a1a1a;
      line-height: 1;
    }
    
    .pull-quote::after {
      content: """;
      position: absolute;
      bottom: -20px;
      right: 16px;
      font-size: 3rem;
      color: #1a1a1a;
      line-height: 1;
    }
  `;

  // Loading state
  if (loading) {
    return (
      <div style={newspaperPageStyle}>
        <style>{animations}</style>
        <Navbar />
        <div style={newspaperContainerStyle}>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>📰</div>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading article from the archives...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div style={newspaperPageStyle}>
        <style>{animations}</style>
        <Navbar />
        <div style={newspaperContainerStyle}>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>📰</div>
            <h2 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '20px',
              fontFamily: '"Playfair Display", serif',
              fontWeight: '900'
            }}>Article Not Found</h2>
            <p style={{ 
              color: '#666', 
              marginBottom: '40px', 
              fontSize: '1.1rem'
            }}>
              {error || 'The requested article could not be found in our archives.'}
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  padding: '16px 32px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onClick={() => navigate('/articles')}
              >
                📚 Browse All Articles
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  color: '#1a1a1a',
                  padding: '16px 32px',
                  border: '2px solid #1a1a1a',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onClick={() => navigate('/')}
              >
                🏠 Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const readTime = post.readTime || calculateReadTime(post.content);
  const authorName = post.author?.name || post.author?.email || 'Maritime Editor';
  const publishDate = post.publishedAt || post.createdAt;
  const categoryName = post.categories?.[0]?.category?.name || 'Maritime Affairs';
  const tags = post.tags?.map(tag => tag.tag?.name || tag) || [];

  // Create pull quote from content if available
  const contentText = post.content.replace(/<[^>]*>/g, '');
  const sentences = contentText.split(/[.!?]+/).filter(s => s.trim().length > 50);
  const pullQuoteText = sentences.length > 2 ? sentences[1].trim() + '.' : '';

  return (
    <div style={newspaperPageStyle}>
      <style>{animations}</style>
      
      <Navbar />
      
      <main style={newspaperContainerStyle} className="newspaper-container">
        {/* Newspaper Masthead */}
        <header style={mastheadStyle}>
          <h1 style={mastheadTitleStyle} className="masthead-title">
            The Maritime Herald
          </h1>
          <p style={mastheadSubtitleStyle}>
            Est. 1927 • Wednesday Yachting Luncheon • San Francisco Bay
          </p>
        </header>

        {/* Dateline */}
        <div style={datelineStyle}>
          {new Date(publishDate).toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }).toUpperCase()} • LATEST EDITION
        </div>

        {/* Article Header */}
        <article>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.02)',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid #ddd',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#1a1a1a',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {categoryName}
            </div>
          </div>

          <h1 style={headlineStyle} className="headline">{post.title}</h1>
          
          {post.excerpt && (
            <div style={subheadlineStyle}>
              {post.excerpt}
            </div>
          )}

          {/* Byline */}
          <div style={bylineStyle}>
            <div style={authorInfoStyle}>
              {post.author?.avatar && (
                <img
                  src={post.author.avatar}
                  alt={authorName}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #1a1a1a'
                  }}
                />
              )}
              <div>
                <div style={authorNameStyle}>By {authorName}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Maritime Correspondent</div>
              </div>
            </div>
            <div style={publishInfoStyle}>
              <span>Published: {new Date(publishDate).toLocaleDateString()}</span>
              <span>•</span>
              <span>{readTime} min read</span>
              {post.views && (
                <>
                  <span>•</span>
                  <span>{post.views} readers</span>
                </>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {post.coverImage && (
            <div style={{ marginBottom: '32px' }}>
              <img
                src={post.coverImage}
                alt={post.title}
                style={featuredImageStyle}
              />
              <div style={imageCaptionStyle}>
                Maritime scene related to: {post.title}
              </div>
            </div>
          )}

          {/* Article Content with Drop Cap */}
          <div 
            style={articleContentStyle}
            className="newspaper-content drop-cap"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Pull Quote */}
          {pullQuoteText && (
            <div style={pullQuoteStyle} className="pull-quote">
              {pullQuoteText}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div style={tagsStyle}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Related Topics:
              </div>
              {tags.map((tag, index) => (
                <span key={index} style={tagItemStyle}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Box */}
          <div style={shareBoxStyle}>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Share This Article
            </div>
            <button
              style={shareButtonStyle}
              className="share-btn"
              onClick={() => handleShare('twitter')}
            >
              Twitter
            </button>
            <button
              style={shareButtonStyle}
              className="share-btn"
              onClick={() => handleShare('facebook')}
            >
              Facebook
            </button>
            <button
              style={shareButtonStyle}
              className="share-btn"
              onClick={() => handleShare('linkedin')}
            >
              LinkedIn
            </button>
            <button
              style={shareButtonStyle}
              className="share-btn"
              onClick={() => handleShare('email')}
            >
              Email
            </button>
          </div>
        </article>

        {/* Related Articles Sidebar */}
        {relatedPosts.length > 0 && (
          <aside style={sidebarStyle}>
            <h2 style={sidebarTitleStyle}>More From Our Archives</h2>
            {relatedPosts.map((relatedPost) => (
              <div
                key={relatedPost.id}
                style={relatedArticleStyle}
                className="related-article"
                onClick={() => handleRelatedPostClick(relatedPost)}
              >
                <h3 style={relatedTitleStyle}>{relatedPost.title}</h3>
                <div style={relatedMetaStyle}>
                  By {relatedPost.author?.name || relatedPost.author?.email} • 
                  {' '}{calculateReadTime(relatedPost.content)} min read
                </div>
              </div>
            ))}
          </aside>
        )}

        {/* Comments Section */}
        <section style={{
          borderTop: '3px solid #1a1a1a',
          paddingTop: '48px',
          marginTop: '48px'
        }}>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.8rem',
            fontWeight: '900',
            color: '#1a1a1a',
            marginBottom: '32px',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Letters to the Editor
          </h2>
          <CommentsSection />
        </section>

        {/* Navigation */}
        <div style={{ 
          textAlign: 'center', 
          margin: '60px 0',
          borderTop: '1px solid #ddd',
          paddingTop: '40px'
        }}>
          <button
            style={{
              backgroundColor: '#1a1a1a',
              color: '#fff',
              padding: '16px 32px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate('/articles')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
            }}
          >
            📰 Back to All Articles
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
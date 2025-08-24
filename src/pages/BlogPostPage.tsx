/**
 * INDIVIDUAL BLOG POST PAGE - REACT ROUTER VERSION
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
  const { slug, postId } = useParams(); // Get slug from URL params
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
      console.log('📖 Loading blog post by slug:', postSlug);
      
      const response = await postsApi.getBySlug(postSlug);
      
      if (response.success && response.data) {
        setPost(response.data);
        
        // Load related posts
        await loadRelatedPosts(response.data);
      } else {
        setError('Article not found');
      }
    } catch (error) {
      console.error('❌ Failed to load blog post:', error);
      setError(`Failed to load article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadBlogPostById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📖 Loading blog post by ID:', id);
      
      const response = await postsApi.getById(id);
      
      if (response.success && response.data) {
        const postData = response.data;
        setPost(postData);
        
        // Redirect to slug-based URL for SEO
        if (postData.slug) {
          console.log('🔄 Redirecting to slug-based URL:', postData.slug);
          navigate(`/posts/${postData.slug}`, { replace: true });
          return;
        }
        
        // Load related posts
        await loadRelatedPosts(postData);
      } else {
        setError('Article not found');
      }
    } catch (error) {
      console.error('❌ Failed to load blog post:', error);
      setError(`Failed to load article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async (currentPost: BlogPostData) => {
    try {
      // Get related posts (same category or recent posts)
      const response = await postsApi.getAll({
        limit: 4,
        published: true
      });

      if (response.success && response.data) {
        // Filter out current post and get up to 3 related posts
        const related = response.data
          .filter(p => p.id !== currentPost.id)
          .slice(0, 3);
        
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Failed to load related posts:', error);
      // Don't show error for related posts failure
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
    // Navigate to related post using React Router
    navigate(`/posts/${relatedPost.slug}`);
  };

  const pageStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    minHeight: '100vh',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    paddingTop: '80px'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
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

  const authorSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: '12px',
    border: `1px solid ${theme.colors.border}`
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
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📖</div>
            <p>Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>❌</div>
            <h2>Article Not Found</h2>
            <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.md }}>
              {error || 'The requested article could not be found.'}
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
              onClick={() => navigate('/articles')}
            >
              📚 Browse All Articles
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

  const readTime = post.readTime || calculateReadTime(post.content);
  const authorName = post.author?.name || post.author?.email || 'Maritime Editor';
  const publishDate = post.publishedAt || post.createdAt;
  const categoryName = post.categories?.[0]?.category?.name || 'General';
  const tags = post.tags?.map(tag => tag.tag?.name || tag) || [];

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
            onClick={() => navigate('/articles')}
          >
            📚 Articles
          </button>
          <span>→</span>
          <span style={{ color: theme.colors.text }}>{post.title}</span>
        </nav>

        {/* Article Header */}
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
            📂 {categoryName}
          </div>
          
          <h1 style={titleStyle}>{post.title}</h1>
          
          <div style={metaStyle}>
            <span style={{ color: theme.colors.textSecondary }}>
              📅 {new Date(publishDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span style={{ color: theme.colors.textSecondary }}>
              ⏱️ {readTime} min read
            </span>
            {post.views && (
              <span style={{ color: theme.colors.textSecondary }}>
                👁️ {post.views} views
              </span>
            )}
          </div>

          {/* Featured Image */}
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '12px',
                marginBottom: theme.spacing.lg
              }}
            />
          )}
        </header>

        {/* Author Section */}
        {post.author && (
          <div style={authorSectionStyle}>
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={authorName}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            )}
            <div>
              <h3 style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.semibold,
                color: theme.colors.text,
                marginBottom: theme.spacing.xs
              }}>
                ✍️ {authorName}
              </h3>
              <p style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textSecondary,
                margin: 0
              }}>
                Maritime content contributor
              </p>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div 
          style={contentStyle}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {tags.length > 0 && (
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
            {tags.map((tag, index) => (
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
            📤 Share this article:
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

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section style={{ marginBottom: theme.spacing.xl }}>
            <h3 style={{
              fontSize: theme.typography.sizes['2xl'],
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.text,
              marginBottom: theme.spacing.lg,
              textAlign: 'center'
            }}>
              📖 Related Articles
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: theme.spacing.lg
            }}>
              {relatedPosts.map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  style={{
                    backgroundColor: theme.colors.background,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `1px solid ${theme.colors.border}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleRelatedPostClick(relatedPost)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {relatedPost.coverImage && (
                    <img
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      style={{
                        width: '100%',
                        height: '200px',
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
                      {relatedPost.title}
                    </h4>
                    <p style={{
                      fontSize: theme.typography.sizes.sm,
                      color: theme.colors.textSecondary,
                      marginBottom: theme.spacing.sm,
                      lineHeight: 1.5
                    }}>
                      {relatedPost.excerpt || relatedPost.content.substring(0, 100) + '...'}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: theme.typography.sizes.xs,
                      color: theme.colors.textSecondary
                    }}>
                      <span>👤 {relatedPost.author?.name || relatedPost.author?.email}</span>
                      <span>⏱️ {calculateReadTime(relatedPost.content)} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Comments Section */}
        <CommentsSection />

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
            onClick={() => navigate('/articles')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            📚 Back to All Articles
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
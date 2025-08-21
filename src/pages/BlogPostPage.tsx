/**
 * INDIVIDUAL BLOG POST PAGE
 * 
 * Features:
 * - Full blog post display
 * - Author information
 * - Publication date
 * - Tags and categories
 * - Comments section
 * - Related articles
 * - Social sharing
 * - Navigation back to articles
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CommentsSection } from '../components/home/CommentsSection';

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  imageUrl?: string;
  authorBio?: string;
  authorAvatar?: string;
}

interface BlogPostPageProps {
  postId: string;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId }) => {
  const theme = useTheme();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);

  useEffect(() => {
    loadBlogPost(postId);
  }, [postId]);

  const loadBlogPost = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sample blog post data - replace with actual data fetching
      const samplePost: BlogPostData = {
        id: id,
        title: 'The Future of Maritime Technology: AI and Autonomous Vessels',
        content: `
          <h2>Introduction to Maritime AI</h2>
          <p>The maritime industry stands at the threshold of a technological revolution. As we navigate into the future, artificial intelligence and autonomous vessels are reshaping how we think about ocean transportation, safety, and efficiency.</p>
          
          <h3>Current State of Technology</h3>
          <p>Today's maritime vessels are already incorporating sophisticated AI systems for navigation assistance, predictive maintenance, and route optimization. Companies like Maersk and MSC are investing heavily in digital transformation initiatives that promise to revolutionize global shipping.</p>
          
          <blockquote>
            "The integration of AI in maritime operations isn't just about efficiency—it's about creating a safer, more sustainable future for ocean transportation." - Captain Sarah Johnson, Maritime Technology Institute
          </blockquote>
          
          <h3>Autonomous Navigation Systems</h3>
          <p>Autonomous vessels represent the next frontier in maritime technology. These ships use a combination of:</p>
          <ul>
            <li>Advanced radar and lidar systems</li>
            <li>Computer vision and image recognition</li>
            <li>Machine learning algorithms for decision making</li>
            <li>Satellite connectivity for real-time data exchange</li>
          </ul>
          
          <h3>Environmental Impact</h3>
          <p>One of the most promising aspects of AI-driven maritime technology is its potential environmental benefits. Optimized routing can reduce fuel consumption by up to 15%, while predictive maintenance prevents unnecessary emissions from inefficient engines.</p>
          
          <h3>Challenges and Considerations</h3>
          <p>Despite the exciting possibilities, several challenges remain:</p>
          <ul>
            <li>Regulatory frameworks need updating</li>
            <li>Cybersecurity concerns must be addressed</li>
            <li>Maritime workforce will require retraining</li>
            <li>International cooperation is essential</li>
          </ul>
          
          <h3>Looking Ahead</h3>
          <p>The next decade will be crucial for maritime AI adoption. As technology matures and regulations evolve, we can expect to see the first fully autonomous commercial vessels entering service, marking the beginning of a new era in maritime history.</p>
          
          <p>The St. Francis Yacht Club has always been at the forefront of maritime innovation, and we're excited to continue hosting speakers who are shaping the future of our industry.</p>
        `,
        excerpt: 'Exploring how artificial intelligence and autonomous vessels are revolutionizing the maritime industry, from navigation to environmental sustainability.',
        author: 'Dr. Michael Chen',
        date: '2024-03-15',
        category: 'Technology',
        tags: ['AI', 'Autonomous Vessels', 'Maritime Technology', 'Innovation', 'Sustainability'],
        readTime: 8,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        authorBio: 'Dr. Michael Chen is a maritime technology researcher and former naval engineer with over 20 years of experience in autonomous systems development.',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      };
      
      setPost(samplePost);
      
      // Load related posts
      const related: BlogPostData[] = [
        {
          id: '2',
          title: 'Sustainable Shipping: Green Technologies in Modern Vessels',
          excerpt: 'How the maritime industry is adopting eco-friendly technologies...',
          author: 'Captain Lisa Rodriguez',
          date: '2024-03-10',
          category: 'Sustainability',
          tags: ['Green Technology', 'Sustainability'],
          readTime: 6,
          content: '',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
        },
        {
          id: '3',
          title: 'Navigation Safety: Lessons from Modern Maritime Accidents',
          excerpt: 'Analyzing recent maritime incidents to improve safety protocols...',
          author: 'Admiral James Wright',
          date: '2024-03-08',
          category: 'Safety',
          tags: ['Safety', 'Navigation'],
          readTime: 5,
          content: '',
          imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'
        }
      ];
      
      setRelatedPosts(related);
    } catch (error) {
      console.error('Failed to load blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    if (!post) return;
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.excerpt);
    
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

  const pageStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    minHeight: '100vh',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    paddingTop: '80px' // Account for fixed navbar
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

  const sidebarStyle: React.CSSProperties = {
    position: 'sticky',
    top: '100px',
    backgroundColor: theme.colors.background,
    borderRadius: '12px',
    padding: theme.spacing.lg,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: theme.spacing.xl
  };

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

  if (!post) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>❌</div>
            <h2>Article Not Found</h2>
            <p>The requested article could not be found.</p>
            <button
              style={{
                backgroundColor: theme.colors.primary,
                color: '#ffffff',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                border: 'none',
                borderRadius: '8px',
                fontSize: theme.typography.sizes.base,
                cursor: 'pointer',
                marginTop: theme.spacing.md
              }}
              onClick={() => window.history.back()}
            >
              ← Go Back
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
          <a 
            href="#home" 
            style={{ color: theme.colors.textSecondary, textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'home';
            }}
          >
            🏠 Home
          </a>
          <span>→</span>
          <a 
            href="#articles" 
            style={{ color: theme.colors.textSecondary, textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'articles';
            }}
          >
            📚 Articles
          </a>
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
            📂 {post.category}
          </div>
          
          <h1 style={titleStyle}>{post.title}</h1>
          
          <div style={metaStyle}>
            <span style={{ color: theme.colors.textSecondary }}>
              📅 {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span style={{ color: theme.colors.textSecondary }}>
              ⏱️ {post.readTime} min read
            </span>
          </div>

          {/* Featured Image */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
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
        <div style={authorSectionStyle}>
          {post.authorAvatar && (
            <img
              src={post.authorAvatar}
              alt={post.author}
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
              ✍️ {post.author}
            </h3>
            {post.authorBio && (
              <p style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textSecondary,
                margin: 0
              }}>
                {post.authorBio}
              </p>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div 
          style={contentStyle}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
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
          {post.tags.map((tag, index) => (
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
                  onClick={() => {
                    // Navigate to related post
                    window.location.hash = `blog-post-${relatedPost.id}`;
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {relatedPost.imageUrl && (
                    <img
                      src={relatedPost.imageUrl}
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
                      {relatedPost.excerpt}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: theme.typography.sizes.xs,
                      color: theme.colors.textSecondary
                    }}>
                      <span>👤 {relatedPost.author}</span>
                      <span>⏱️ {relatedPost.readTime} min</span>
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
            onClick={() => window.location.hash = 'articles'}
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
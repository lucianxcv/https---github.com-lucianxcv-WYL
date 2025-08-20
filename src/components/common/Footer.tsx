/**
 * ENHANCED FOOTER COMPONENT
 * 
 * Major improvements:
 * - Modern multi-section layout
 * - Enhanced contact information
 * - Social media integration
 * - Newsletter signup
 * - Quick links and navigation
 * - Location and venue details
 * - Better responsive design
 * - Brand consistency
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface FooterProps {
  showNewsletter?: boolean;
  showSocialLinks?: boolean;
  showLocationInfo?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  showNewsletter = true,
  showSocialLinks = true,
  showLocationInfo = true
}) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const footerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderTop: `1px solid ${theme.colors.border}`,
    marginTop: theme.spacing['3xl']
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${theme.spacing['2xl']} ${theme.spacing.lg}`
  };

  const topSectionStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderBottom: `1px solid ${theme.colors.border}`
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const linkStyle: React.CSSProperties = {
    color: theme.colors.textSecondary,
    textDecoration: 'none',
    fontSize: theme.typography.sizes.base,
    lineHeight: 1.6,
    transition: 'all 0.3s ease',
    display: 'block',
    marginBottom: theme.spacing.sm
  };

  const socialButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
    textDecoration: 'none',
    fontSize: '1.5rem',
    transition: 'all 0.3s ease',
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm
  };

  const newsletterFormStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: '16px',
    padding: theme.spacing.lg,
    border: `1px solid ${theme.colors.border}`
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '12px',
    fontSize: theme.typography.sizes.base,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
    transition: 'all 0.3s ease'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm
  };

  const bottomSectionStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg
  };

  const copyrightStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: theme.colors.accent,
    color: '#ffffff',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '20px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs
  };

  // Quick navigation links
  const quickLinks = [
    { label: 'Home', href: '#home', icon: '🏠' },
    { label: 'Upcoming Speakers', href: '#upcoming', icon: '🎤' },
    { label: 'Articles', href: '#blog', icon: '📝' },
    { label: 'Weather', href: '#weather', icon: '🌊' },
    { label: 'About', href: '#owner', icon: 'ℹ️' },
    { label: 'Contact', href: '#contact', icon: '📧' }
  ];

  // Maritime resources
  const resources = [
    { label: 'Maritime News', href: '#news', icon: '📰' },
    { label: 'Safety Guidelines', href: '#safety', icon: '⚠️' },
    { label: 'Navigation Tools', href: '#tools', icon: '🧭' },
    { label: 'Weather Reports', href: '#weather', icon: '🌦️' },
    { label: 'Event Calendar', href: '#calendar', icon: '📅' },
    { label: 'Member Directory', href: '#directory', icon: '👥' }
  ];

  // Social media links
  const socialLinks = [
    { platform: 'Facebook', icon: '📘', url: 'https://facebook.com/sfyc', color: '#4267B2' },
    { platform: 'Instagram', icon: '📷', url: 'https://instagram.com/sfyc', color: '#E4405F' },
    { platform: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/company/sfyc', color: '#0077B5' },
    { platform: 'YouTube', icon: '📺', url: 'https://youtube.com/sfyc', color: '#FF0000' },
    { platform: 'Twitter', icon: '🐦', url: 'https://twitter.com/sfyc', color: '#1DA1F2' }
  ];

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubscribing) return;

    setIsSubscribing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubscriptionStatus('success');
      setEmail('');
      
      // Reset status after 3 seconds
      setTimeout(() => setSubscriptionStatus('idle'), 3000);
    } catch (error) {
      setSubscriptionStatus('error');
      setTimeout(() => setSubscriptionStatus('idle'), 3000);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      window.location.hash = href;
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        {/* Top Section */}
        <div style={topSectionStyle}>
          {/* About Section */}
          <div>
            <h3 style={sectionTitleStyle}>
              ⛵ Wednesday Yachting Luncheon
            </h3>
            <p style={{
              color: theme.colors.textSecondary,
              lineHeight: 1.6,
              marginBottom: theme.spacing.md,
              fontSize: theme.typography.sizes.base
            }}>
              San Francisco's premier maritime dining and speaker experience. Join us every Wednesday 
              at the historic St. Francis Yacht Club for inspiring presentations and exceptional cuisine.
            </p>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm}}>
              <span style={badgeStyle}>
                🏆 Since 1927
              </span>
              <span style={{...badgeStyle, backgroundColor: theme.colors.secondary}}>
                📍 SF Bay Area
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={sectionTitleStyle}>
              🧭 Quick Links
            </h3>
            <nav>
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  style={linkStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.paddingLeft = theme.spacing.sm;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  <span style={{marginRight: theme.spacing.sm}}>{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 style={sectionTitleStyle}>
              📚 Maritime Resources
            </h3>
            <nav>
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.href}
                  style={linkStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(resource.href);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.paddingLeft = theme.spacing.sm;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  <span style={{marginRight: theme.spacing.sm}}>{resource.icon}</span>
                  {resource.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter Signup */}
          {showNewsletter && (
            <div>
              <h3 style={sectionTitleStyle}>
                📧 Stay Informed
              </h3>
              <div style={newsletterFormStyle}>
                <p style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.sm,
                  marginBottom: theme.spacing.md,
                  lineHeight: 1.5
                }}>
                  Get weekly updates about upcoming speakers, maritime news, and exclusive club events.
                </p>
                
                {subscriptionStatus === 'success' ? (
                  <div style={{
                    textAlign: 'center',
                    padding: theme.spacing.md,
                    backgroundColor: '#22c55e20',
                    borderRadius: '12px',
                    border: '1px solid #22c55e',
                    color: '#22c55e'
                  }}>
                    ✅ Successfully subscribed!
                  </div>
                ) : subscriptionStatus === 'error' ? (
                  <div style={{
                    textAlign: 'center',
                    padding: theme.spacing.md,
                    backgroundColor: '#ef444420',
                    borderRadius: '12px',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    marginBottom: theme.spacing.md
                  }}>
                    ❌ Failed to subscribe. Try again.
                  </div>
                ) : null}

                {subscriptionStatus !== 'success' && (
                  <form onSubmit={handleNewsletterSubmit}>
                    <input
                      type="email"
                      style={inputStyle}
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                      onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                    />
                    <button
                      type="submit"
                      style={buttonStyle}
                      disabled={isSubscribing || !email.trim()}
                      onMouseEnter={(e) => {
                        if (!isSubscribing && email.trim()) {
                          e.currentTarget.style.backgroundColor = theme.colors.secondary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubscribing && email.trim()) {
                          e.currentTarget.style.backgroundColor = theme.colors.primary;
                        }
                      }}
                    >
                      {isSubscribing ? '⏳ Subscribing...' : '📧 Subscribe'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Location & Contact Info */}
        {showLocationInfo && (
          <div style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '16px',
            padding: theme.spacing.lg,
            border: `1px solid ${theme.colors.border}`,
            marginBottom: theme.spacing.xl
          }}>
            <h3 style={{...sectionTitleStyle, marginBottom: theme.spacing.lg}}>
              📍 St. Francis Yacht Club
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: theme.spacing.lg
            }}>
              {/* Address */}
              <div>
                <h4 style={{
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.semibold,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs
                }}>
                  🏢 Address
                </h4>
                <address style={{
                  fontStyle: 'normal',
                  color: theme.colors.textSecondary,
                  lineHeight: 1.6
                }}>
                  700 Marina Blvd<br />
                  San Francisco, CA 94123<br />
                  United States
                </address>
              </div>

              {/* Contact */}
              <div>
                <h4 style={{
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.semibold,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs
                }}>
                  📞 Contact
                </h4>
                <div style={{color: theme.colors.textSecondary, lineHeight: 1.6}}>
                  <a 
                    href="tel:+14155631234" 
                    style={{...linkStyle, marginBottom: '4px'}}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.textSecondary}
                  >
                    📞 (415) 563-1234
                  </a>
                  <a 
                    href="mailto:info@stfyc.com" 
                    style={{...linkStyle, marginBottom: '4px'}}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.textSecondary}
                  >
                    ✉️ info@stfyc.com
                  </a>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h4 style={{
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.semibold,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs
                }}>
                  ⏰ Luncheon Schedule
                </h4>
                <div style={{color: theme.colors.textSecondary, lineHeight: 1.6}}>
                  <div>📅 Every Wednesday</div>
                  <div>🕐 12:00 PM - 2:00 PM</div>
                  <div>🎤 Speaker: 12:30 PM</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Media & Bottom Section */}
        <div style={bottomSectionStyle}>
          {/* Copyright */}
          <div style={copyrightStyle}>
            <span>⛵</span>
            <span>© 2024 Wednesday Yachting Luncheon</span>
            <span>•</span>
            <span>St. Francis Yacht Club</span>
          </div>

          {/* Social Media Links */}
          {showSocialLinks && (
            <div style={{display: 'flex', alignItems: 'center', gap: theme.spacing.sm}}>
              <span style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textSecondary,
                marginRight: theme.spacing.sm
              }}>
                Follow us:
              </span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  style={socialButtonStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Follow us on ${social.platform}`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.surface;
                    e.currentTarget.style.color = theme.colors.text;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Legal Links */}
        <div style={{
          borderTop: `1px solid ${theme.colors.border}`,
          paddingTop: theme.spacing.md,
          marginTop: theme.spacing.lg,
          display: 'flex',
          justifyContent: 'center',
          gap: theme.spacing.lg,
          flexWrap: 'wrap'
        }}>
          {['Privacy Policy', 'Terms of Service', 'Accessibility', 'Sitemap'].map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{
                ...linkStyle,
                fontSize: theme.typography.sizes.sm,
                marginBottom: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.textSecondary}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
/**
 * CLASSIC ELEGANT FOOTER COMPONENT
 * 
 * Sophisticated yacht club styling:
 * - Deep navy and maritime colors
 * - Classic typography and spacing
 * - Refined, timeless design
 * - Premium yacht club aesthetic
 * - Traditional maritime elegance
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
    backgroundColor: '#0f172a', // Slate 900 - deep navy
    marginTop: theme.spacing['3xl'],
    borderTop: '1px solid #1e293b' // Subtle border
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
    borderBottom: '1px solid #1e293b'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.lg,
    fontWeight: 600,
    color: '#f8fafc', // Slate 50
    marginBottom: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontFamily: 'serif'
  };

  const linkStyle: React.CSSProperties = {
    color: '#94a3b8', // Slate 400
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
    borderRadius: '6px',
    backgroundColor: '#1e293b', // Slate 800
    border: '1px solid #334155', // Slate 700
    color: '#cbd5e1', // Slate 300
    textDecoration: 'none',
    fontSize: '1.5rem',
    transition: 'all 0.3s ease',
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm
  };

  const newsletterFormStyle: React.CSSProperties = {
    backgroundColor: '#1e293b', // Slate 800
    borderRadius: '8px',
    padding: theme.spacing.lg,
    border: '1px solid #334155' // Slate 700
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    border: '1px solid #475569', // Slate 600
    borderRadius: '6px',
    fontSize: theme.typography.sizes.base,
    backgroundColor: '#334155', // Slate 700
    color: '#f8fafc',
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
    transition: 'all 0.3s ease'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#3b82f6', // Classic blue
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    fontWeight: 600,
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
    color: '#64748b', // Slate 500
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '4px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    border: '1px solid #334155'
  };

  // Quick navigation links
  const quickLinks = [
    { label: 'Home', href: '#home', icon: '⌂' },
    { label: 'Upcoming Speakers', href: '#upcoming', icon: '◉' },
    { label: 'Articles', href: '#blog', icon: '※' },
    { label: 'Conditions', href: '#weather', icon: '⚓' },
    { label: 'About', href: '#owner', icon: '◈' },
    { label: 'Contact', href: '#contact', icon: '✉' }
  ];

  // Maritime resources
  const resources = [
    { label: 'Maritime News', href: '#news', icon: '※' },
    { label: 'Safety Guidelines', href: '#safety', icon: '⚠' },
    { label: 'Navigation Tools', href: '#tools', icon: '⚓' },
    { label: 'Weather Reports', href: '#weather', icon: '◈' },
    { label: 'Event Calendar', href: '#calendar', icon: '◉' },
    { label: 'Member Directory', href: '#directory', icon: '⌂' }
  ];

  // Social media links
  const socialLinks = [
    { platform: 'Facebook', icon: '◉', url: 'https://facebook.com/sfyc', color: '#4267B2' },
    { platform: 'Instagram', icon: '◈', url: 'https://instagram.com/sfyc', color: '#E4405F' },
    { platform: 'LinkedIn', icon: '※', url: 'https://linkedin.com/company/sfyc', color: '#0077B5' },
    { platform: 'YouTube', icon: '⚓', url: 'https://youtube.com/sfyc', color: '#FF0000' },
    { platform: 'Twitter', icon: '⌂', url: 'https://twitter.com/sfyc', color: '#1DA1F2' }
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
          {/* Newsletter Signup */}
          {showNewsletter && (
            <div>
              <h3 style={sectionTitleStyle}>
                ✉ Member Updates
              </h3>
              <div style={newsletterFormStyle}>
                <p style={{
                  color: '#94a3b8',
                  fontSize: theme.typography.sizes.sm,
                  marginBottom: theme.spacing.md,
                  lineHeight: 1.6
                }}>
                  Receive weekly updates about upcoming speakers, maritime events, and exclusive club announcements.
                </p>
                
                {subscriptionStatus === 'success' ? (
                  <div style={{
                    textAlign: 'center',
                    padding: theme.spacing.md,
                    backgroundColor: '#166534', // Green 800
                    borderRadius: '6px',
                    border: '1px solid #22c55e',
                    color: '#dcfce7'
                  }}>
                    ✓ Successfully subscribed to member updates
                  </div>
                ) : subscriptionStatus === 'error' ? (
                  <div style={{
                    textAlign: 'center',
                    padding: theme.spacing.md,
                    backgroundColor: '#991b1b', // Red 800
                    borderRadius: '6px',
                    border: '1px solid #ef4444',
                    color: '#fecaca',
                    marginBottom: theme.spacing.md
                  }}>
                    ✗ Subscription failed. Please try again.
                  </div>
                ) : null}

                {subscriptionStatus !== 'success' && (
                  <form onSubmit={handleNewsletterSubmit}>
                    <input
                      type="email"
                      style={inputStyle}
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#475569'}
                    />
                    <button
                      type="submit"
                      style={buttonStyle}
                      disabled={isSubscribing || !email.trim()}
                      onMouseEnter={(e) => {
                        if (!isSubscribing && email.trim()) {
                          e.currentTarget.style.backgroundColor = '#2563eb';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubscribing && email.trim()) {
                          e.currentTarget.style.backgroundColor = '#3b82f6';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {isSubscribing ? '◉ Subscribing...' : '◉ Subscribe'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div>
            <h3 style={sectionTitleStyle}>
              ⚓ Navigation
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
                    e.currentTarget.style.color = '#f8fafc';
                    e.currentTarget.style.paddingLeft = theme.spacing.sm;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  <span style={{
                    marginRight: theme.spacing.sm,
                    fontSize: '0.9rem',
                    opacity: 0.8
                  }}>
                    {link.icon}
                  </span>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 style={sectionTitleStyle}>
              ◈ Maritime Resources
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
                    e.currentTarget.style.color = '#f8fafc';
                    e.currentTarget.style.paddingLeft = theme.spacing.sm;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  <span style={{
                    marginRight: theme.spacing.sm,
                    fontSize: '0.9rem',
                    opacity: 0.8
                  }}>
                    {resource.icon}
                  </span>
                  {resource.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Location & Contact Info */}
        {showLocationInfo && (
          <div style={{
            backgroundColor: '#1e293b', // Slate 800
            borderRadius: '8px',
            padding: theme.spacing.lg,
            border: '1px solid #334155',
            marginBottom: theme.spacing.xl
          }}>
            <h3 style={{...sectionTitleStyle, marginBottom: theme.spacing.lg}}>
              ⚓ St. Francis Yacht Club
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
                  fontWeight: 600,
                  color: '#e2e8f0', // Slate 200
                  marginBottom: theme.spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs
                }}>
                  ⌂ Address
                </h4>
                <address style={{
                  fontStyle: 'normal',
                  color: '#94a3b8',
                  lineHeight: 1.6
                }}>
                  700 Marina Boulevard<br />
                  San Francisco, California 94123<br />
                  United States of America
                </address>
              </div>

              {/* Contact */}
              <div>
                <h4 style={{
                  fontSize: theme.typography.sizes.md,
                  fontWeight: 600,
                  color: '#e2e8f0',
                  marginBottom: theme.spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs
                }}>
                  ✉ Contact Information
                </h4>
                <div style={{color: '#94a3b8', lineHeight: 1.6}}>
                  <a 
                    href="tel:+14155631234" 
                    style={{...linkStyle, marginBottom: '4px'}}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                  >
                    ◉ (415) 563-1234
                  </a>
                  <a 
                    href="mailto:info@stfyc.com" 
                    style={{...linkStyle, marginBottom: '4px'}}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                  >
                    ✉ info@stfyc.com
                  </a>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h4 style={{
                  fontSize: theme.typography.sizes.md,
                  fontWeight: 600,
                  color: '#e2e8f0',
                  marginBottom: theme.spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs
                }}>
                  ◉ Weekly Luncheon
                </h4>
                <div style={{
                  color: '#94a3b8', 
                  lineHeight: 1.6
                }}>
                  <div>◈ Every Wednesday</div>
                  <div>◉ 12:00 PM – 2:00 PM</div>
                  <div>※ Guest Speaker: 12:30 PM</div>
                  <div style={{ marginTop: theme.spacing.xs, fontSize: theme.typography.sizes.sm }}>
                    <em>Members and guests welcome</em>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Media & Bottom Section */}
        <div style={bottomSectionStyle}>
          {/* Copyright */}
          <div style={copyrightStyle}>
            <span>⚓</span>
            <span>© 2024 Wednesday Yachting Luncheon</span>
            <span>•</span>
            <span>St. Francis Yacht Club</span>
          </div>

          {/* Social Media Links */}
          {showSocialLinks && (
            <div style={{display: 'flex', alignItems: 'center', gap: theme.spacing.sm}}>
              <span style={{
                fontSize: theme.typography.sizes.sm,
                color: '#64748b',
                marginRight: theme.spacing.sm
              }}>
                Connect:
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
                    e.currentTarget.style.backgroundColor = '#334155';
                    e.currentTarget.style.borderColor = '#475569';
                    e.currentTarget.style.color = '#f8fafc';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e293b';
                    e.currentTarget.style.borderColor = '#334155';
                    e.currentTarget.style.color = '#cbd5e1';
                    e.currentTarget.style.transform = 'translateY(0)';
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
          borderTop: '1px solid #1e293b',
          paddingTop: theme.spacing.md,
          marginTop: theme.spacing.lg,
          display: 'flex',
          justifyContent: 'center',
          gap: theme.spacing.lg,
          flexWrap: 'wrap'
        }}>
          {['Privacy Policy', 'Terms of Service', 'Club Rules', 'Accessibility'].map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{
                ...linkStyle,
                fontSize: theme.typography.sizes.sm,
                marginBottom: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748b';
              }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Prestige Badge */}
        <div style={{
          textAlign: 'center',
          marginTop: theme.spacing.lg,
          paddingTop: theme.spacing.lg,
          borderTop: '1px solid #1e293b'
        }}>
          <div style={{
            ...badgeStyle,
            display: 'inline-flex',
            fontSize: theme.typography.sizes.xs,
            color: '#64748b'
          }}>
            <span style={{ marginRight: theme.spacing.xs }}>⚓</span>
            <span>Established 1927 • A Tradition of Maritime Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
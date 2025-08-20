/**
 * ENHANCED FOOTER COMPONENT WITH BEAUTIFUL WAVE BACKGROUND
 * 
 * Major improvements:
 * - Beautiful animated wave background
 * - Ocean-themed gradient colors
 * - Smooth wave animations
 * - Enhanced visual depth
 * - Better contrast and readability
 * - Maritime-themed styling
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
    background: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 40%, #0369a1 70%, #164e63 100%)',
    marginTop: theme.spacing['3xl'],
    position: 'relative',
    overflow: 'hidden'
  };

  // Wave background layers
  const waveLayer1Style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
      linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.03) 25%, 
        rgba(255, 255, 255, 0.08) 50%, 
        rgba(255, 255, 255, 0.03) 75%, 
        transparent 100%
      )
    `,
    animation: 'waveFloat 15s ease-in-out infinite',
    zIndex: 1
  };

  const waveLayer2Style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '150%',
    height: '100%',
    background: `
      repeating-linear-gradient(
        45deg,
        transparent 0px,
        rgba(255, 255, 255, 0.02) 30px,
        rgba(255, 255, 255, 0.06) 60px,
        rgba(255, 255, 255, 0.02) 90px,
        transparent 120px
      )
    `,
    animation: 'waveDrift 25s linear infinite',
    zIndex: 2
  };

  const waveLayer3Style: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '200%',
    height: '60px',
    background: `
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.08) 0px,
        rgba(255, 255, 255, 0.15) 40px,
        rgba(255, 255, 255, 0.08) 80px,
        transparent 120px,
        transparent 160px
      )
    `,
    borderRadius: '50% 50% 0 0',
    animation: 'waveRoll 20s linear infinite',
    zIndex: 3
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${theme.spacing['2xl']} ${theme.spacing.lg}`,
    position: 'relative',
    zIndex: 10
  };

  const topSectionStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: '#ffffff',
    marginBottom: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  const linkStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontSize: theme.typography.sizes.base,
    lineHeight: 1.6,
    transition: 'all 0.3s ease',
    display: 'block',
    marginBottom: theme.spacing.sm,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
  };

  const socialButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1.5rem',
    transition: 'all 0.3s ease',
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  };

  const newsletterFormStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    padding: theme.spacing.lg,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    fontSize: theme.typography.sizes.base,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#0369a1',
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#0369a1',
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
    gap: theme.spacing.sm,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
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
    color: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: '20px',
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
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

  // Wave animations
  const animations = `
    @keyframes waveFloat {
      0%, 100% { transform: translateX(0) translateY(0); }
      25% { transform: translateX(-10px) translateY(-5px); }
      50% { transform: translateX(5px) translateY(5px); }
      75% { transform: translateX(-5px) translateY(-3px); }
    }
    
    @keyframes waveDrift {
      0% { transform: translateX(0); }
      100% { transform: translateX(-120px); }
    }
    
    @keyframes waveRoll {
      0% { transform: translateX(0) scaleY(1); }
      50% { transform: translateX(-80px) scaleY(1.1); }
      100% { transform: translateX(-160px) scaleY(1); }
    }
    
    @keyframes shimmer {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <footer style={footerStyle}>
        {/* Wave Background Layers */}
        <div style={waveLayer1Style} />
        <div style={waveLayer2Style} />
        <div style={waveLayer3Style} />
        
        <div style={containerStyle}>
          {/* Top Section */}
          <div style={topSectionStyle}>
            {/* Newsletter Signup - First Position */}
            {showNewsletter && (
              <div>
                <h3 style={sectionTitleStyle}>
                  📧 Stay Informed
                </h3>
                <div style={newsletterFormStyle}>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: theme.typography.sizes.sm,
                    marginBottom: theme.spacing.md,
                    lineHeight: 1.5,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    Get weekly updates about upcoming speakers, maritime news, and exclusive club events.
                  </p>
                  
                  {subscriptionStatus === 'success' ? (
                    <div style={{
                      textAlign: 'center',
                      padding: theme.spacing.md,
                      backgroundColor: 'rgba(34, 197, 94, 0.3)',
                      borderRadius: '12px',
                      border: '1px solid rgba(34, 197, 94, 0.5)',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)'
                    }}>
                      ✅ Successfully subscribed!
                    </div>
                  ) : subscriptionStatus === 'error' ? (
                    <div style={{
                      textAlign: 'center',
                      padding: theme.spacing.md,
                      backgroundColor: 'rgba(239, 68, 68, 0.3)',
                      borderRadius: '12px',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      color: '#ffffff',
                      marginBottom: theme.spacing.md,
                      backdropFilter: 'blur(10px)'
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
                        onFocus={(e) => e.target.style.borderColor = '#ffffff'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'}
                      />
                      <button
                        type="submit"
                        style={buttonStyle}
                        disabled={isSubscribing || !email.trim()}
                        onMouseEnter={(e) => {
                          if (!isSubscribing && email.trim()) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubscribing && email.trim()) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
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
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.paddingLeft = theme.spacing.sm;
                      e.currentTarget.style.textShadow = '2px 2px 4px rgba(0,0,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.paddingLeft = '0';
                      e.currentTarget.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
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
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.paddingLeft = theme.spacing.sm;
                      e.currentTarget.style.textShadow = '2px 2px 4px rgba(0,0,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.paddingLeft = '0';
                      e.currentTarget.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
                    }}
                  >
                    <span style={{marginRight: theme.spacing.sm}}>{resource.icon}</span>
                    {resource.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Location & Contact Info */}
          {showLocationInfo && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: theme.spacing.lg,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              marginBottom: theme.spacing.xl,
              backdropFilter: 'blur(15px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
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
                    color: '#ffffff',
                    marginBottom: theme.spacing.sm,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    🏢 Address
                  </h4>
                  <address style={{
                    fontStyle: 'normal',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.6,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
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
                    color: '#ffffff',
                    marginBottom: theme.spacing.sm,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    📞 Contact
                  </h4>
                  <div style={{color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6}}>
                    <a 
                      href="tel:+14155631234" 
                      style={{...linkStyle, marginBottom: '4px'}}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                    >
                      📞 (415) 563-1234
                    </a>
                    <a 
                      href="mailto:info@stfyc.com" 
                      style={{...linkStyle, marginBottom: '4px'}}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
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
                    color: '#ffffff',
                    marginBottom: theme.spacing.sm,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    ⏰ Luncheon Schedule
                  </h4>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.9)', 
                    lineHeight: 1.6,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
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
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginRight: theme.spacing.sm,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
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
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
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
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.textShadow = '2px 2px 4px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};
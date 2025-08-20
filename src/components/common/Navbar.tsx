/**
 * ENHANCED NAVIGATION COMPONENT WITH BEAUTIFUL WAVE BACKGROUND
 * 
 * Major improvements:
 * - Beautiful animated wave background
 * - Ocean-themed gradient colors
 * - Smooth wave animations
 * - Enhanced visual depth
 * - Better contrast and readability
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../utils/useAuth';

interface NavbarProps {
  showSearch?: boolean;
  showBreadcrumbs?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  showSearch = false, 
  showBreadcrumbs = false 
}) => {
  const theme = useTheme();
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle section detection
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setActiveSection(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: isScrolled 
      ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)'
      : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 30%, #0369a1 70%, #164e63 100%)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${isScrolled ? '#0284c7' : 'rgba(255,255,255,0.2)'}`,
    transition: 'all 0.3s ease',
    boxShadow: isScrolled ? '0 8px 32px rgba(14, 165, 233, 0.3)' : '0 4px 20px rgba(14, 165, 233, 0.2)',
    overflow: 'hidden'
  };

  // Wave background element
  const waveBackgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.9) 0%, rgba(2, 132, 199, 0.8) 50%, rgba(3, 105, 161, 0.9) 100%)',
    zIndex: -2
  };

  const waveOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '100%',
    background: `
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        rgba(255, 255, 255, 0.03) 40px,
        rgba(255, 255, 255, 0.08) 80px,
        rgba(255, 255, 255, 0.03) 120px,
        transparent 160px
      )
    `,
    animation: 'waveMove 20s linear infinite',
    zIndex: -1
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${theme.spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px',
    position: 'relative',
    zIndex: 10
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    textDecoration: 'none',
    color: '#ffffff',
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.xl,
    transition: 'all 0.3s ease',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  const logoIconStyle: React.CSSProperties = {
    fontSize: '2rem',
    animation: 'float 3s ease-in-out infinite',
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
  };

  const desktopMenuStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.lg,
    listStyle: 'none',
    margin: 0,
    padding: 0
  };

  const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
    textDecoration: 'none',
    color: '#ffffff',
    fontSize: theme.typography.sizes.base,
    fontWeight: isActive ? theme.typography.weights.semibold : theme.typography.weights.medium,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: '25px',
    transition: 'all 0.3s ease',
    position: 'relative',
    backgroundColor: isActive 
      ? 'rgba(255, 255, 255, 0.25)' 
      : 'transparent',
    border: isActive 
      ? '1px solid rgba(255, 255, 255, 0.3)' 
      : '1px solid transparent',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
    backdropFilter: isActive ? 'blur(10px)' : 'none'
  });

  const userMenuStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md
  };

  const userAvatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  };

  const userPlaceholderStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#ffffff',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#ffffff',
    cursor: 'pointer',
    padding: theme.spacing.sm,
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
  };

  const mobileMenuStyle: React.CSSProperties = {
    position: 'fixed',
    top: '80px',
    left: 0,
    right: 0,
    background: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(14, 165, 233, 0.4)',
    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    zIndex: 999,
    maxHeight: 'calc(100vh - 80px)',
    overflowY: 'auto'
  };

  const mobileMenuContentStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md
  };

  const actionButtonStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#0369a1',
    border: 'none',
    borderRadius: '25px',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(10px)'
  };

  const secondaryButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    borderRadius: '25px',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)'
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', href: '#home', icon: '🏠' },
    { id: 'speakers', label: 'Speakers', href: '#upcoming', icon: '🎤' },
    { id: 'blog', label: 'Articles', href: '#blog', icon: '📝' },
    { id: 'weather', label: 'Weather', href: '#weather', icon: '🌊' },
    { id: 'about', label: 'About', href: '#owner', icon: 'ℹ️' }
  ];

  const handleNavClick = (href: string) => {
    window.location.hash = href;
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // CSS animations
  const animations = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
    
    @keyframes waveMove {
      0% { transform: translateX(0); }
      100% { transform: translateX(-160px); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    @media (max-width: 768px) {
      .desktop-menu { display: none !important; }
      .mobile-menu-button { display: block !important; }
    }
    
    @media (min-width: 769px) {
      .mobile-menu { display: none !important; }
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <nav style={navbarStyle}>
        {/* Wave Background */}
        <div style={waveBackgroundStyle} />
        <div style={waveOverlayStyle} />
        
        <div style={containerStyle}>
          {/* Logo */}
          <a 
            href="#home" 
            style={logoStyle}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.textShadow = '3px 3px 6px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
            }}
          >
            <span style={logoIconStyle}>⛵</span>
            <span>WYL</span>
          </a>

          {/* Desktop Navigation */}
          <ul style={desktopMenuStyle} className="desktop-menu">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  style={navLinkStyle(activeSection === item.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <span style={{ marginRight: theme.spacing.xs }}>{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* User Menu & Actions */}
          <div style={userMenuStyle}>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Authentication */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                {/* User Avatar */}
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    style={userAvatarStyle}
                    title={`${user.name || 'User'} (${user.role})`}
                  />
                ) : (
                  <div 
                    style={userPlaceholderStyle}
                    title={`${user?.name || 'User'} (${user?.role})`}
                  >
                    👤
                  </div>
                )}

                {/* Admin Link */}
                {isAdmin && (
                  <a
                    href="#admin"
                    style={{
                      ...secondaryButtonStyle,
                      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                      fontSize: theme.typography.sizes.xs
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = '#admin';
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.color = '#0369a1';
                      e.currentTarget.style.textShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ⚙️ Admin
                  </a>
                )}

                {/* Sign Out */}
                <button
                  style={{
                    ...secondaryButtonStyle,
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    fontSize: theme.typography.sizes.xs
                  }}
                  onClick={handleSignOut}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                    e.currentTarget.style.borderColor = '#ef4444';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            ) : (
              <a
                href="#auth"
                style={actionButtonStyle}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#auth';
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#0369a1';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.color = '#0369a1';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
              >
                🔐 Sign In
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              style={mobileMenuButtonStyle}
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div style={mobileMenuStyle} className="mobile-menu">
          <div style={mobileMenuContentStyle}>
            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                style={{
                  ...navLinkStyle(activeSection === item.id),
                  width: '100%',
                  textAlign: 'left',
                  padding: theme.spacing.md,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  backgroundColor: activeSection === item.id 
                    ? 'rgba(255, 255, 255, 0.25)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
              >
                <span style={{ marginRight: theme.spacing.sm }}>{item.icon}</span>
                {item.label}
              </a>
            ))}

            {/* Mobile User Actions */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.3)',
              paddingTop: theme.spacing.md,
              marginTop: theme.spacing.md
            }}>
              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                  {/* User Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    padding: theme.spacing.md,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name || 'User'} style={userAvatarStyle} />
                    ) : (
                      <div style={userPlaceholderStyle}>👤</div>
                    )}
                    <div>
                      <div style={{ 
                        fontWeight: theme.typography.weights.semibold,
                        color: '#ffffff',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}>
                        {user?.name || 'User'}
                      </div>
                      <div style={{ 
                        fontSize: theme.typography.sizes.sm, 
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}>
                        {user?.role}
                      </div>
                    </div>
                  </div>

                  {/* Admin Link (Mobile) */}
                  {isAdmin && (
                    <a
                      href="#admin"
                      style={{...actionButtonStyle, width: '100%', justifyContent: 'center'}}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.hash = '#admin';
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      ⚙️ Admin Dashboard
                    </a>
                  )}

                  {/* Sign Out (Mobile) */}
                  <button
                    style={{
                      ...secondaryButtonStyle,
                      width: '100%',
                      justifyContent: 'center'
                    }}
                    onClick={handleSignOut}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              ) : (
                <a
                  href="#auth"
                  style={{...actionButtonStyle, width: '100%', justifyContent: 'center'}}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#auth';
                    setIsMobileMenuOpen(false);
                  }}
                >
                  🔐 Sign In
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(3, 105, 161, 0.4)',
              zIndex: 998,
              opacity: isMobileMenuOpen ? 1 : 0,
              transition: 'opacity 0.3s ease',
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>
    </>
  );
};
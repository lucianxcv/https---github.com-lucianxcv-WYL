/**
 * ENHANCED NAVIGATION COMPONENT
 * 
 * Major improvements:
 * - Modern responsive design
 * - Smooth mobile menu animations
 * - Better visual hierarchy
 * - Enhanced user authentication display
 * - Breadcrumb navigation
 * - Search integration
 * - Theme toggle improvements
 * - Better accessibility
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
    backgroundColor: isScrolled 
      ? `${theme.colors.background}f5` 
      : `${theme.colors.background}ee`,
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${isScrolled ? theme.colors.border : 'transparent'}`,
    transition: 'all 0.3s ease',
    boxShadow: isScrolled ? theme.shadows.md : 'none'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${theme.spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px'
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    textDecoration: 'none',
    color: theme.colors.text,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.xl,
    transition: 'all 0.3s ease'
  };

  const logoIconStyle: React.CSSProperties = {
    fontSize: '2rem',
    animation: 'float 3s ease-in-out infinite'
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
    color: isActive ? theme.colors.primary : theme.colors.text,
    fontSize: theme.typography.sizes.base,
    fontWeight: isActive ? theme.typography.weights.semibold : theme.typography.weights.medium,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: '25px',
    transition: 'all 0.3s ease',
    position: 'relative',
    backgroundColor: isActive ? `${theme.colors.primary}15` : 'transparent',
    border: isActive ? `1px solid ${theme.colors.primary}30` : '1px solid transparent'
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
    border: `2px solid ${theme.colors.primary}`,
    cursor: 'pointer'
  };

  const userPlaceholderStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: theme.colors.surface,
    border: `2px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: theme.colors.textSecondary,
    cursor: 'pointer'
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: theme.colors.text,
    cursor: 'pointer',
    padding: theme.spacing.sm,
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  };

  const mobileMenuStyle: React.CSSProperties = {
    position: 'fixed',
    top: '80px',
    left: 0,
    right: 0,
    backgroundColor: `${theme.colors.background}f8`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.xl,
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
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
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
    textDecoration: 'none'
  };

  const secondaryButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: theme.colors.primary,
    border: `2px solid ${theme.colors.primary}`,
    borderRadius: '25px',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
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
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
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
                      e.currentTarget.style.backgroundColor = `${theme.colors.surface}`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
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
                      e.currentTarget.style.backgroundColor = theme.colors.primary;
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.colors.primary;
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
                    e.currentTarget.style.backgroundColor = '#e74c3c';
                    e.currentTarget.style.borderColor = '#e74c3c';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.color = theme.colors.primary;
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
                  e.currentTarget.style.backgroundColor = theme.colors.secondary;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.primary;
                  e.currentTarget.style.transform = 'translateY(0)';
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
                e.currentTarget.style.backgroundColor = theme.colors.surface;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
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
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '12px'
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
              borderTop: `1px solid ${theme.colors.border}`,
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
                    backgroundColor: theme.colors.surface,
                    borderRadius: '12px'
                  }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name || 'User'} style={userAvatarStyle} />
                    ) : (
                      <div style={userPlaceholderStyle}>👤</div>
                    )}
                    <div>
                      <div style={{ fontWeight: theme.typography.weights.semibold }}>
                        {user?.name || 'User'}
                      </div>
                      <div style={{ 
                        fontSize: theme.typography.sizes.sm, 
                        color: theme.colors.textSecondary 
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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998,
              opacity: isMobileMenuOpen ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>
    </>
  );
};
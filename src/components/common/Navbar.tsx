/**
 * CLASSIC SIMPLE NAVIGATION COMPONENT WITH SCROLL HIDE
 * 
 * Maintained original design with:
 * - Original emoji icons
 * - Clean, simple structure
 * - Elegant navy background
 * - Original navigation items
 * - Simple, readable layout
 * - NEW: Hide navbar on scroll down, show on scroll up
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
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Handle scroll effect with hide/show functionality
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state
      setIsScrolled(currentScrollY > 20);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY < 50) {
        // Always show at top of page
        setIsVisible(true);
      } else if (currentScrollY > prevScrollY) {
        // Scrolling down - hide navbar
        setIsVisible(false);
        setIsMobileMenuOpen(false); // Close mobile menu when hiding
      } else if (prevScrollY - currentScrollY > 5) {
        // Scrolling up - show navbar (with small threshold to prevent jitter)
        setIsVisible(true);
      }
      
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

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
      ? '#1e293b' // Slate 800 - elegant dark
      : '#0f172a', // Slate 900 - deep navy
    backdropFilter: 'blur(12px)',
    borderBottom: isScrolled 
      ? '1px solid #334155' // Subtle slate border
      : '1px solid rgba(51, 65, 85, 0.3)',
    transition: 'all 0.4s ease',
    boxShadow: isScrolled 
      ? '0 4px 20px rgba(15, 23, 42, 0.4)' 
      : '0 2px 10px rgba(15, 23, 42, 0.2)',
    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
    opacity: isVisible ? 1 : 0
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
    color: '#f8fafc', // Slate 50 - elegant white
    fontWeight: 600,
    fontSize: theme.typography.sizes.lg,
    transition: 'all 0.3s ease'
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
    color: isActive ? '#e2e8f0' : '#cbd5e1', // Slate variations
    fontSize: theme.typography.sizes.base,
    fontWeight: isActive ? 600 : 500,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    position: 'relative',
    borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent' // Blue accent for active
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
    border: '2px solid #64748b', // Slate 500
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const userPlaceholderStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#334155', // Slate 700
    border: '2px solid #64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#f8fafc',
    cursor: 'pointer',
    padding: theme.spacing.sm,
    borderRadius: '6px',
    transition: 'all 0.3s ease'
  };

  const mobileMenuStyle: React.CSSProperties = {
    position: 'fixed',
    top: '80px',
    left: 0,
    right: 0,
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    boxShadow: '0 10px 40px rgba(15, 23, 42, 0.6)',
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
    backgroundColor: '#3b82f6', // Classic blue
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    fontSize: theme.typography.sizes.sm,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    textDecoration: 'none'
  };

  const secondaryButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#e2e8f0',
    border: '1px solid #64748b',
    borderRadius: '6px',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    fontSize: theme.typography.sizes.sm,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
  };

  // Original navigation items with emojis
  const navItems = [
    { id: 'home', label: 'Home', href: '#home', icon: '🏠' },
    { id: 'speakers', label: 'Upcoming Speakers', href: '#upcoming', icon: '🎤' },
    { id: 'past-shows', label: 'Past Shows', href: '#past-shows', icon: '🎥' }
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
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🛥️</span>
            <span>Wednesday Yachting Luncheon</span>
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
                      e.currentTarget.style.color = '#f8fafc';
                      e.currentTarget.style.backgroundColor = '#334155';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.color = '#cbd5e1';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ marginRight: theme.spacing.xs }}>
                    {item.icon}
                  </span>
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#64748b';
                    }}
                  />
                ) : (
                  <div 
                    style={userPlaceholderStyle}
                    title={`${user?.name || 'User'} (${user?.role})`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.backgroundColor = '#475569';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#64748b';
                      e.currentTarget.style.backgroundColor = '#334155';
                    }}
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
                      e.currentTarget.style.backgroundColor = '#475569';
                      e.currentTarget.style.borderColor = '#94a3b8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = '#64748b';
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
                    e.currentTarget.style.backgroundColor = '#dc2626';
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#64748b';
                    e.currentTarget.style.color = '#e2e8f0';
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
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🔐 Login
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              style={mobileMenuButtonStyle}
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
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
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  backgroundColor: activeSection === item.id 
                    ? '#334155' 
                    : 'transparent'
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
              borderTop: '1px solid #334155',
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
                    backgroundColor: '#334155',
                    borderRadius: '6px'
                  }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name || 'User'} style={userAvatarStyle} />
                    ) : (
                      <div style={userPlaceholderStyle}>👤</div>
                    )}
                    <div>
                      <div style={{ 
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        {user?.name || 'User'}
                      </div>
                      <div style={{ 
                        fontSize: theme.typography.sizes.sm, 
                        color: '#94a3b8'
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
                  🔐 Login
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
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
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
/**
 * NAVBAR COMPONENT - REACT ROUTER VERSION
 * 
 * Updated to use React Router Links instead of hash navigation:
 * - Link components instead of <a> tags
 * - useLocation for active state detection
 * - useNavigate for programmatic navigation
 * - Clean URL navigation
 * - Logo as home button with image
 * - Home changed to Journal (articles)
 * - Direct profile link (no dropdown)
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active section based on current route
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path === '/upcoming') return 'speakers';
    if (path === '/past-shows') return 'past-shows';
    if (path.startsWith('/posts/') || path === '/articles') return 'articles'; // Updated for Journal
    if (path.startsWith('/shows/')) return 'past-shows';
    if (path === '/profile') return 'profile'; // Add profile detection
    return 'home';
  };

  const activeSection = getActiveSection();

  // Handle scroll effect with hide/show functionality
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state
      setIsScrolled(currentScrollY > 20);
      
      // Hide/show navbar - only show when at the very top
      if (currentScrollY <= 10) {
        // Only show when at top of page (within 10px)
        setIsVisible(true);
      } else {
        // Hide navbar when scrolled down
        setIsVisible(false);
        setIsMobileMenuOpen(false); // Close mobile menu when hiding
      }
      
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

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
    borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent', // Blue accent for active
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs
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

  // Updated navigation items - Home changed to Journal
  const navItems = [
    { id: 'articles', label: 'Journal', href: '/articles', icon: '📚' }, // Changed from Home to Journal
    { id: 'speakers', label: 'Upcoming Speakers', href: '/?section=upcoming', icon: '🎤' },
    { id: 'past-shows', label: 'Past Shows', href: '/past-shows', icon: '🎥' }
  ];

  // Handle navigation with smooth scrolling for same-page sections
  const handleNavClick = (href: string, itemId: string) => {
    setIsMobileMenuOpen(false);
    
    // Special handling for upcoming speakers (same page section)
    if (itemId === 'speakers' && location.pathname === '/') {
      const element = document.getElementById('upcoming');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    // For other routes, use React Router navigation
    navigate(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
      navigate('/');
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
          {/* Logo - Now clickable home button with image */}
          <Link 
            to="/" 
            style={logoStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <img 
              src="https://fpuihryuqxaauymcgszd.supabase.co/storage/v1/object/public/logos/home.png"
              alt="Wednesday Yachting Luncheon"
              style={{
                height: '50px',
                width: 'auto',
                transition: 'all 0.3s ease'
              }}
            />
            <span>Wednesday Yachting Luncheon</span>
          </Link>

          {/* Desktop Navigation */}
          <ul style={desktopMenuStyle} className="desktop-menu">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.id === 'speakers' ? (
                  // Special case: Upcoming speakers - handle as button for smooth scroll
                  <button
                    style={{
                      ...navLinkStyle(activeSection === item.id),
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleNavClick(item.href, item.id)}
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
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ) : (
                  // Regular React Router Links
                  <Link
                    to={item.href}
                    style={navLinkStyle(activeSection === item.id)}
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
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
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
                {/* Direct Profile Link - No Dropdown */}
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    textDecoration: 'none',
                    padding: theme.spacing.xs,
                    borderRadius: '6px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title={`Go to Profile - ${user?.name || 'User'} (${user?.role})`}
                >
                  {/* User Avatar */}
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #64748b'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#334155',
                      border: '2px solid #64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      color: '#e2e8f0'
                    }}>
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || '👤'}
                    </div>
                  )}
                  
                  {/* User Name */}
                  <span style={{ 
                    fontSize: theme.typography.sizes.sm, 
                    color: '#e2e8f0',
                    fontWeight: 500 
                  }}>
                    {user?.name || user?.email}
                  </span>
                </Link>

                {/* Admin Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    style={{
                      ...secondaryButtonStyle,
                      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                      fontSize: theme.typography.sizes.xs
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
                  </Link>
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
              <Link
                to="/auth"
                style={actionButtonStyle}
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
              </Link>
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
              <div key={item.id}>
                {item.id === 'speakers' ? (
                  <button
                    style={{
                      ...navLinkStyle(activeSection === item.id),
                      width: '100%',
                      textAlign: 'left',
                      padding: theme.spacing.md,
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      backgroundColor: activeSection === item.id 
                        ? '#334155' 
                        : 'transparent',
                      justifyContent: 'flex-start'
                    }}
                    onClick={() => handleNavClick(item.href, item.id)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    to={item.href}
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
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile User Actions */}
            <div style={{
              borderTop: '1px solid #334155',
              paddingTop: theme.spacing.md,
              marginTop: theme.spacing.md
            }}>
              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                  {/* User Info - Now clickable to go to profile */}
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.md,
                      padding: theme.spacing.md,
                      backgroundColor: '#334155',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#f8fafc'
                    }}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name || 'User'} style={userAvatarStyle} />
                    ) : (
                      <div style={userPlaceholderStyle}>
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || '👤'}
                      </div>
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
                        {user?.role} • Click for Profile
                      </div>
                    </div>
                  </Link>

                  {/* Admin Link (Mobile) */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{...actionButtonStyle, width: '100%', justifyContent: 'center'}}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ⚙️ Admin Dashboard
                    </Link>
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
                <Link
                  to="/auth"
                  style={{...actionButtonStyle, width: '100%', justifyContent: 'center'}}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🔐 Login
                </Link>
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
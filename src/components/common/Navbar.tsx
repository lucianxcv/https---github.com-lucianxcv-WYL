/**
 * VISUALLY ENHANCED NAVIGATION COMPONENT
 * 
 * Enhanced with modern visual improvements:
 * - Sophisticated glass morphism effect
 * - Smooth micro-animations and transitions
 * - Dynamic gradient backgrounds
 * - Enhanced hover states with scale and glow effects
 * - Improved typography with better spacing
 * - Modern shadow and lighting effects
 * - Responsive visual indicators
 * - Enhanced mobile experience
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle scroll effect with more sophisticated detection
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

  // Enhanced navbar with glass morphism and dynamic effects
  const navbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: isScrolled 
      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderBottom: isScrolled 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : '1px solid rgba(148, 163, 184, 0.1)',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isScrolled 
      ? '0 8px 32px rgba(15, 23, 42, 0.4), 0 2px 16px rgba(59, 130, 246, 0.1)' 
      : '0 4px 20px rgba(15, 23, 42, 0.3)',
    transform: isScrolled ? 'translateY(0)' : 'translateY(0)',
    willChange: 'transform, backdrop-filter'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${theme.spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: isScrolled ? '70px' : '80px',
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  // Enhanced logo with gradient and animation
  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    textDecoration: 'none',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 700,
    fontSize: isScrolled ? '1.1rem' : '1.2rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '-0.025em',
    position: 'relative'
  };

  const desktopMenuStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    listStyle: 'none',
    margin: 0,
    padding: 0
  };

  // Enhanced nav links with modern hover effects
  const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
    textDecoration: 'none',
    color: isActive ? '#f8fafc' : '#cbd5e1',
    fontSize: theme.typography.sizes.base,
    fontWeight: isActive ? 600 : 500,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    background: isActive 
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)'
      : 'transparent',
    backdropFilter: isActive ? 'blur(10px)' : 'none',
    border: isActive 
      ? '1px solid rgba(59, 130, 246, 0.3)' 
      : '1px solid transparent',
    boxShadow: isActive 
      ? '0 4px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
      : 'none',
    transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
    letterSpacing: '0.025em'
  });

  const userMenuStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md
  };

  // Enhanced user avatar with glow effect
  const userAvatarStyle: React.CSSProperties = {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(148, 163, 184, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative'
  };

  const userPlaceholderStyle: React.CSSProperties = {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
    border: '2px solid rgba(148, 163, 184, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    position: 'relative'
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    display: 'none',
    background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(71, 85, 105, 0.6) 100%)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    fontSize: '1.2rem',
    color: '#f8fafc',
    cursor: 'pointer',
    padding: theme.spacing.sm,
    borderRadius: '10px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  // Enhanced mobile menu with better animations
  const mobileMenuStyle: React.CSSProperties = {
    position: 'fixed',
    top: isScrolled ? '70px' : '80px',
    left: 0,
    right: 0,
    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.6)',
    transform: isMobileMenuOpen 
      ? 'translateY(0) scale(1)' 
      : 'translateY(-20px) scale(0.95)',
    opacity: isMobileMenuOpen ? 1 : 0,
    visibility: isMobileMenuOpen ? 'visible' : 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 999,
    maxHeight: 'calc(100vh - 80px)',
    overflowY: 'auto'
  };

  const mobileMenuContentStyle: React.CSSProperties = {
    padding: `${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.xl}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md
  };

  // Enhanced action buttons with gradients
  const actionButtonStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    fontSize: theme.typography.sizes.sm,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  };

  const secondaryButtonStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(71, 85, 105, 0.6) 100%)',
    color: '#e2e8f0',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    borderRadius: '10px',
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    fontSize: theme.typography.sizes.sm,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative'
  };

  // Navigation items with enhanced icons
  const navItems = [
    { id: 'home', label: 'Home', href: '#home', icon: '🏠' },
    { id: 'speakers', label: 'Upcoming Speakers', href: '#upcoming', icon: '🎤' },
    { id: 'past-shows', label: 'Past Shows', href: '#past-shows', icon: '🎥' }
  ];

  const handleNavClick = (href: string) => {
    window.location.hash = href;
    setIsMobileMenuOpen(false);
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Enhanced CSS animations and effects
  const animations = `
    @media (max-width: 768px) {
      .desktop-menu { display: none !important; }
      .mobile-menu-button { display: flex !important; }
    }
    
    @media (min-width: 769px) {
      .mobile-menu { display: none !important; }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3); }
      50% { box-shadow: 0 6px 24px rgba(59, 130, 246, 0.5); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }
    
    .nav-item-hover {
      position: relative;
      overflow: hidden;
    }
    
    .nav-item-hover::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s ease;
    }
    
    .nav-item-hover:hover::before {
      left: 100%;
    }
  `;

  return (
    <>
      <style>{animations}</style>
      <nav style={navbarStyle}>
        <div style={containerStyle}>
          {/* Enhanced Logo */}
          <a 
            href="#home" 
            style={logoStyle}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-1px)';
              e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.filter = 'none';
            }}
          >
            <span style={{ 
              fontSize: '1.8rem',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              transition: 'all 0.3s ease'
            }}>🛥️</span>
            <span>Wednesday Yachting Luncheon</span>
          </a>

          {/* Enhanced Desktop Navigation */}
          <ul style={desktopMenuStyle} className="desktop-menu">
            {navItems.map((item, index) => (
              <li key={item.id} style={{ 
                animation: `float 3s ease-in-out ${index * 0.2}s infinite` 
              }}>
                <a
                  href={item.href}
                  style={navLinkStyle(activeSection === item.id)}
                  className="nav-item-hover"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.color = '#f8fafc';
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.15)';
                      e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== item.id) {
                      e.currentTarget.style.color = '#cbd5e1';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.border = '1px solid transparent';
                    }
                  }}
                >
                  <span style={{ 
                    marginRight: theme.spacing.xs,
                    fontSize: '1.1rem',
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                  }}>
                    {item.icon}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Enhanced User Menu & Actions */}
          <div style={userMenuStyle}>
            {/* Theme Toggle with enhanced styling */}
            <div style={{ 
              padding: theme.spacing.xs,
              borderRadius: '8px',
              background: 'rgba(51, 65, 85, 0.5)',
              backdropFilter: 'blur(10px)'
            }}>
              <ThemeToggle />
            </div>

            {/* Enhanced Authentication */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                {/* Enhanced User Avatar */}
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    style={userAvatarStyle}
                    title={`${user.name || 'User'} (${user.role})`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.8)';
                      e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                  />
                ) : (
                  <div 
                    style={userPlaceholderStyle}
                    title={`${user?.name || 'User'} (${user?.role})`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.8)';
                      e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, #475569 0%, #64748b 100%)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, #334155 0%, #475569 100%)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                  >
                    👤
                  </div>
                )}

                {/* Enhanced Admin Link */}
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
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(59, 130, 246, 0.6) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.8)';
                      e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(71, 85, 105, 0.6) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    ⚙️ Admin
                  </a>
                )}

                {/* Enhanced Sign Out */}
                <button
                  style={{
                    ...secondaryButtonStyle,
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    fontSize: theme.typography.sizes.xs
                  }}
                  onClick={handleSignOut}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(220, 38, 38, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(71, 85, 105, 0.6) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                    e.currentTarget.style.color = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
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
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
                }}
              >
                🔐 Login
              </a>
            )}

            {/* Enhanced Mobile Menu Button */}
            <button
              style={mobileMenuButtonStyle}
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(71, 85, 105, 0.9) 0%, rgba(100, 116, 139, 0.7) 100%)';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(71, 85, 105, 0.6) 100%)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <span style={{ 
                transition: 'transform 0.3s ease',
                transform: isMobileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                display: 'inline-block'
              }}>
                {isMobileMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div style={mobileMenuStyle} className="mobile-menu">
          <div style={mobileMenuContentStyle}>
            {/* Enhanced Mobile Navigation Items */}
            {navItems.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                style={{
                  ...navLinkStyle(activeSection === item.id),
                  width: '100%',
                  textAlign: 'left',
                  padding: theme.spacing.lg,
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  backgroundColor: activeSection === item.id 
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)'
                    : 'rgba(51, 65, 85, 0.3)',
                  backdropFilter: 'blur(10px)',
                  animation: `float 3s ease-in-out ${index * 0.1}s infinite`,
                  marginBottom: theme.spacing.xs
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span style={{ 
                  marginRight: theme.spacing.sm,
                  fontSize: '1.2rem',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
                }}>
                  {item.icon}
                </span>
                {item.label}
              </a>
            ))}

            {/* Enhanced Mobile User Actions */}
            <div style={{
              borderTop: '1px solid rgba(148, 163, 184, 0.2)',
              paddingTop: theme.spacing.lg,
              marginTop: theme.spacing.lg
            }}>
              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                  {/* Enhanced User Info Card */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    padding: theme.spacing.lg,
                    background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(71, 85, 105, 0.6) 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}>
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || 'User'} 
                        style={{
                          ...userAvatarStyle,
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                        }} 
                      />
                    ) : (
                      <div style={{
                        ...userPlaceholderStyle,
                        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                      }}>
                        👤
                      </div>
                    )}
                    <div>
                      <div style={{ 
                        fontWeight: 700,
                        color: '#f8fafc',
                        fontSize: theme.typography.sizes.base,
                        marginBottom: '2px',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {user?.name || 'User'}
                      </div>
                      <div style={{ 
                        fontSize: theme.typography.sizes.sm, 
                        color: '#94a3b8',
                        fontWeight: 500,
                        letterSpacing: '0.025em'
                      }}>
                        {user?.role}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Admin Link (Mobile) */}
                  {isAdmin && (
                    <a
                      href="#admin"
                      style={{
                        ...actionButtonStyle, 
                        width: '100%', 
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.hash = '#admin';
                        setIsMobileMenuOpen(false);
                      }}
                      onTouchStart={(e) => {
                        e.currentTarget.style.transform = 'scale(0.98)';
                      }}
                      onTouchEnd={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      ⚙️ Admin Dashboard
                    </a>
                  )}

                  {/* Enhanced Sign Out (Mobile) */}
                  <button
                    style={{
                      ...secondaryButtonStyle,
                      width: '100%',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)',
                      borderColor: 'rgba(220, 38, 38, 0.3)',
                      color: '#fca5a5'
                    }}
                    onClick={handleSignOut}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              ) : (
                <a
                  href="#auth"
                  style={{
                    ...actionButtonStyle, 
                    width: '100%', 
                    justifyContent: 'center',
                    padding: theme.spacing.lg,
                    fontSize: theme.typography.sizes.base,
                    borderRadius: '12px'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#auth';
                    setIsMobileMenuOpen(false);
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = 'scale(0.98)';
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  🔐 Login
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              backdropFilter: 'blur(8px)',
              zIndex: 998,
              opacity: isMobileMenuOpen ? 1 : 0,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'fadeIn 0.4s ease-out'
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Additional CSS for enhanced animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideInFromTop {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          /* Enhanced scrollbar for mobile menu */
          .mobile-menu::-webkit-scrollbar {
            width: 4px;
          }
          
          .mobile-menu::-webkit-scrollbar-track {
            background: rgba(51, 65, 85, 0.3);
            border-radius: 2px;
          }
          
          .mobile-menu::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 2px;
          }
          
          .mobile-menu::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          }
          
          /* Enhanced focus states for accessibility */
          .nav-link:focus,
          .action-button:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
          }
          
          /* Smooth transitions for all interactive elements */
          * {
            -webkit-tap-highlight-color: rgba(59, 130, 246, 0.2);
          }
          
          /* Enhanced glass morphism effect */
          .glass-effect {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          /* Improved text rendering */
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }
        `}</style>
      </nav>
    </>
  );
};
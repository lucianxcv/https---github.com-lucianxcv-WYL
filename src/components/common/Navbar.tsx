// ==================== src/components/common/Navbar.tsx ====================
/**
 * NAVIGATION BAR COMPONENT
 *
 * The top navigation that appears on every page.
 * Changes appearance when user scrolls and includes responsive mobile menu.
 *
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Add or remove navigation items in the navItems array
 * - Change the logo text or add an image logo
 * - Modify colors, fonts, or spacing
 * - Add dropdown menus or additional navigation levels
 * - Change the scroll threshold that triggers style changes
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../utils/useAuth';

export const Navbar: React.FC = () => {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();

  // Listen for scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      // If user has scrolled more than 20px, add blur/transparency effect
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    // Cleanup: remove event listener when component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation menu items - easy to modify!
  const navItems = [
    { href: '#home', label: 'Home', icon: '🏠' },
    { href: '#upcoming', label: 'Upcoming Speakers', icon: '🎤' },
    { href: '#past-shows', label: 'Past Shows', icon: '🎥' }
  ];

  // Main navbar styling
  const navbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // High z-index so navbar stays on top
    // Background changes when scrolled for better readability
    backgroundColor: scrolled
      ? `rgba(30, 58, 95, 0.95)` // Semi-transparent when scrolled
      : theme.colors.primary,     // Solid when at top
    backdropFilter: scrolled ? 'blur(10px)' : 'none', // Blur effect when scrolled
    transition: 'all 0.3s ease',
    borderBottom: `1px solid ${theme.colors.border}`,
    fontFamily: theme.typography.fontFamily
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logoStyle: React.CSSProperties = {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    transition: 'transform 0.3s ease'
  };

  const desktopMenuStyle: React.CSSProperties = {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: theme.spacing.lg,
    alignItems: 'center'
  };

  const linkStyle: React.CSSProperties = {
    color: '#ffffff',
    textDecoration: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs
  };

  const authButtonStyle: React.CSSProperties = {
    ...linkStyle,
    backgroundColor: theme.colors.accent,
    border: 'none',
    cursor: 'pointer',
    fontFamily: theme.typography.fontFamily
  };

  const userInfoStyle: React.CSSProperties = {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.sm,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  return (
    <nav style={navbarStyle} role="navigation" aria-label="Main navigation">
      <div style={containerStyle}>
        {/* Logo/Home link */}
        <a
          href="#home"
          style={logoStyle}
          // Hover effect: slightly scale up the logo
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Wednesday Yachting Luncheon Home"
        >
          🛥️ Wednesday Yachting Luncheon
        </a>

        {/* Navigation menu */}
        <ul style={desktopMenuStyle}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                style={linkStyle}
                // Hover effects for each menu item
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.backgroundColor = 'rgba(135, 206, 235, 0.2)';
                  target.style.transform = 'translateY(-3px)';
                  target.style.boxShadow = '0 4px 12px rgba(135, 206, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.backgroundColor = 'transparent';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
                aria-label={item.label}
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
          
          {/* Authentication Section */}
          <li>
            {isAuthenticated ? (
              <div style={userInfoStyle}>
                <span>Welcome, {user?.name || user?.email}</span>
                <button
                  style={authButtonStyle}
                  onClick={signOut}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent}
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <a
                href="#auth"
                style={authButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.secondary}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent}
              >
                🔐 Login
              </a>
            )}
          </li>
          
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};
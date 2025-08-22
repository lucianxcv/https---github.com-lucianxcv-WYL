/**
 * MODERN & REFINED NAVIGATION COMPONENT
 *
 * This refactored version features:
 * - Separation of concerns with CSS Modules for styling.
 * - Cleaner, more readable JSX structure.
 * - Enhanced UI with smoother animations and hover effects.
 * - Improved accessibility for interactive elements.
 * - Simplified logic by leveraging CSS capabilities.
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../utils/useAuth';
import styles from '/home/lucian/projects/wyl/src/components/common/Navbar.module.css'; // ✨ Import CSS module

interface NavbarProps {
  showSearch?: boolean;
  showBreadcrumbs?: boolean;
}

// ✨ SVG Icon for the mobile menu toggle for better accessibility and style
const MenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={styles.hamburger}
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    height="24px"
    width="24px"
    fill="none"
  >
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${styles.line} ${styles.top}`}
      d={isOpen ? "M6 18L18 6" : "M4 6h16"}
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${styles.line} ${styles.middle}`}
      d="M4 12h16"
      style={{ opacity: isOpen ? 0 : 1 }}
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${styles.line} ${styles.bottom}`}
      d={isOpen ? "M6 6l12 12" : "M4 18h16"}
    />
  </svg>
);


export const Navbar: React.FC<NavbarProps> = ({
  showSearch = false,
  showBreadcrumbs = false,
}) => {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Effect for scroll-based styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect for active section highlighting
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1) || 'home';
      setActiveSection(hash);
    };
    handleHashChange(); // Set initial state
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', href: '#home', icon: '🏠' },
    { id: 'speakers', label: 'Upcoming Speakers', href: '#upcoming', icon: '🎤' },
    { id: 'past-shows', label: 'Past Shows', href: '#past-shows', icon: '🎥' }
  ];

  // Combine class names conditionally
  const navbarClasses = `${styles.navbar} ${isScrolled ? styles.scrolled : ''}`;
  const mobileMenuClasses = `${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`;

  return (
    <>
      <nav className={navbarClasses}>
        <div className={styles.container}>
          {/* Logo */}
          <a href="#home" className={styles.logo} onClick={() => handleNavClick('#home')}>
            <span className={styles.logoIcon}>🛥️</span>
            <span>Wednesday Yachting Luncheon</span>
          </a>

          {/* Desktop Navigation */}
          <ul className={styles.desktopMenu}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={activeSection === item.id ? styles.active : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                >
                  <span>{item.icon}</span> {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* User Menu & Actions */}
          <div className={styles.userMenu}>
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name || 'User'} className={styles.userAvatar} />
                ) : (
                  <div className={styles.userPlaceholder}>👤</div>
                )}
                {isAdmin && <a href="#admin" className={styles.adminButton}>⚙️ Admin</a>}
                <button onClick={signOut} className={styles.signOutButton}>🚪 Sign Out</button>
              </>
            ) : (
              <a href="#auth" className={styles.actionButton}>🔐 Login</a>
            )}
            
            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <MenuIcon isOpen={isMobileMenuOpen} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={mobileMenuClasses}>
        <div className={styles.mobileMenuContent}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={activeSection === item.id ? styles.active : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
            >
              <span>{item.icon}</span> {item.label}
            </a>
          ))}
          <hr className={styles.divider} />
          {isAuthenticated ? (
            <>
              {isAdmin && <a href="#admin" className={styles.actionButton}>⚙️ Admin Dashboard</a>}
              <button onClick={signOut} className={styles.secondaryButton}>🚪 Sign Out</button>
            </>
          ) : (
            <a href="#auth" className={styles.actionButton}>🔐 Login</a>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
};
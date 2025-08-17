// ==================== src/App.tsx ====================
/**
 * MAIN APPLICATION COMPONENT
 *
 * This is the root component that sets up routing and provides global theme context.
 * Now includes proper authentication-aware routing.
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { HomePage } from './pages/HomePage';
import { Admin } from './pages/Admin';
import { Auth } from './pages/Auth';
import { useAuth } from './utils/useAuth';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Listen for URL hash changes to handle routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      setCurrentPage(hash || 'home'); // Default to 'home' if no hash
    };

    // Set initial page based on current URL
    handleHashChange();

    // Listen for hash changes (when user clicks links or uses back/forward)
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup: remove event listener when component unmounts
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle authentication-based redirects
  useEffect(() => {
    if (!isLoading) {
      // If user is on auth page but already authenticated, redirect to home
      if (currentPage === 'auth' && isAuthenticated) {
        window.location.hash = '#home';
        return;
      }

      // If user tries to access admin page but is not admin, redirect to home
      if (currentPage === 'admin' && (!isAuthenticated || !isAdmin)) {
        window.location.hash = '#home';
        return;
      }
    }
  }, [currentPage, isAuthenticated, isAdmin, isLoading]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <ThemeProvider>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif'
        }}>
          🔄 Loading...
        </div>
      </ThemeProvider>
    );
  }

  // Render the appropriate page based on current route
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin':
        // Only render admin if user is authenticated and is admin
        if (isAuthenticated && isAdmin) {
          return <Admin />;
        }
        // Otherwise redirect to home (handled by useEffect above)
        return <HomePage />;
        
      case 'auth':
        // If already authenticated, redirect to home (handled by useEffect above)
        if (isAuthenticated) {
          return <HomePage />;
        }
        return <Auth />;
        
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider>
      {renderCurrentPage()}
    </ThemeProvider>
  );
};

export default App;
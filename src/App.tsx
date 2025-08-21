/**
 * MAIN APPLICATION COMPONENT - ENHANCED ROUTING
 *
 * This is the root component that sets up routing and provides global theme context.
 * Now includes routing for all pages: Home, Auth, Admin, Articles, Blog Posts, and Past Shows Archive.
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { HomePage } from './pages/HomePage';
import { Admin } from './pages/Admin';
import { Auth } from './pages/Auth';
import { AllArticlesPage } from './pages/AllArticlesPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { PastShowsArchivePage } from './pages/PastShowsArchivePage';
import { useAuth } from './utils/useAuth';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [routeParams, setRouteParams] = useState<{[key: string]: string}>({});
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Parse the URL hash to extract page and parameters
  const parseRoute = (hash: string): { page: string; params: {[key: string]: string} } => {
    const route = hash.slice(1); // Remove the '#'
    
    // Handle different route patterns
    if (route.startsWith('blog-post-')) {
      const postId = route.replace('blog-post-', '');
      return { page: 'blog-post', params: { postId } };
    }
    
    if (route.startsWith('articles')) {
      return { page: 'articles', params: {} };
    }
    
    if (route.startsWith('past-shows') || route.startsWith('archive')) {
      return { page: 'past-shows', params: {} };
    }
    
    // Handle simple routes
    switch (route) {
      case 'home':
      case '':
        return { page: 'home', params: {} };
      case 'auth':
      case 'login':
        return { page: 'auth', params: {} };
      case 'admin':
        return { page: 'admin', params: {} };
      default:
        return { page: 'home', params: {} };
    }
  };

  // Listen for URL hash changes to handle routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const { page, params } = parseRoute(hash);
      setCurrentPage(page);
      setRouteParams(params);
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
          fontFamily: 'Arial, sans-serif',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ fontSize: '3rem' }}>⚓</div>
          <div>🔄 Loading...</div>
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

      case 'articles':
        return <AllArticlesPage />;

      case 'blog-post':
        // Extract post ID from route params
        const postId = routeParams.postId || '1';
        return <BlogPostPage postId={postId} />;

      case 'past-shows':
        return <PastShowsArchivePage />;
        
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
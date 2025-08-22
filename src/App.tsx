/**
 * MAIN APPLICATION COMPONENT - ENHANCED ROUTING WITH SHOW SUPPORT
 *
 * Now includes both blog posts and show episodes with slug-based routing:
 * - #posts/{slug} for blog articles
 * - #shows/{slug} for past show episodes
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { HomePage } from './pages/HomePage';
import { Admin } from './pages/Admin';
import { Auth } from './pages/Auth';
import { AllArticlesPage } from './pages/AllArticlesPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { PastShowsArchivePage } from './pages/PastShowsArchivePage';
import { PastShowPage } from './pages/PastShowPage'; // ← New import
import { useAuth } from './utils/useAuth';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [routeParams, setRouteParams] = useState<{[key: string]: string}>({});
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Parse the URL hash to extract page and parameters
  const parseRoute = (hash: string): { page: string; params: {[key: string]: string} } => {
    const route = hash.slice(1); // Remove the '#'
    
    // Handle different route patterns
    if (route.startsWith('posts/')) {
      // Blog post slug routing: #posts/my-article-slug
      const slug = route.replace('posts/', '');
      return { page: 'blog-post', params: { slug } };
    }
    
    if (route.startsWith('post/')) {
      // Alternative blog post format: #post/my-article-slug
      const slug = route.replace('post/', '');
      return { page: 'blog-post', params: { slug } };
    }

    if (route.startsWith('shows/')) {
      // Show episode slug routing: #shows/my-episode-slug
      const slug = route.replace('shows/', '');
      return { page: 'past-show', params: { slug } };
    }

    if (route.startsWith('show/')) {
      // Alternative show format: #show/my-episode-slug  
      const slug = route.replace('show/', '');
      return { page: 'past-show', params: { slug } };
    }
    
    if (route.startsWith('blog-post-')) {
      // Legacy blog post ID routing: #blog-post-123 (backward compatibility)
      const postId = route.replace('blog-post-', '');
      return { page: 'blog-post', params: { postId } };
    }

    if (route.startsWith('past-show-')) {
      // Legacy show ID routing: #past-show-123 (backward compatibility)
      const showId = route.replace('past-show-', '');
      return { page: 'past-show', params: { showId } };
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
      console.log('🧭 Route changed:', { hash, page, params });
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
        // Extract slug or fallback to ID from route params
        const slug = routeParams.slug;
        const postId = routeParams.postId;
        
        if (slug) {
          // Use slug-based BlogPostPage
          return <BlogPostPage slug={slug} />;
        } else if (postId) {
          // Legacy support: use ID to look up slug, then redirect
          console.log('⚠️ Legacy blog post ID-based route detected, should redirect to slug');
          return <BlogPostPage postId={postId} />;
        } else {
          // No valid identifier, redirect to articles
          console.log('❌ No valid blog post identifier found');
          setTimeout(() => window.location.hash = '#articles', 0);
          return <AllArticlesPage />;
        }

      case 'past-show':
        // Extract slug or fallback to ID from route params
        const showSlug = routeParams.slug;
        const showId = routeParams.showId;
        
        if (showSlug) {
          // Use slug-based PastShowPage
          return <PastShowPage slug={showSlug} />;
        } else if (showId) {
          // Legacy support: use ID to look up slug, then redirect
          console.log('⚠️ Legacy show ID-based route detected, should redirect to slug');
          return <PastShowPage showId={showId} />;
        } else {
          // No valid identifier, redirect to past shows
          console.log('❌ No valid show identifier found');
          setTimeout(() => window.location.hash = '#past-shows', 0);
          return <PastShowsArchivePage />;
        }

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
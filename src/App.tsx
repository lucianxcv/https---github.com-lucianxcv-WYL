/**
 * MAIN APPLICATION COMPONENT - REACT ROUTER VERSION
 *
 * Migrated from hash-based routing to React Router:
 * - Clean URLs: /posts/slug instead of #posts/slug
 * - Automatic scroll to top on navigation
 * - Better SEO and sharing
 * - Professional URL structure
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { HomePage } from './pages/HomePage';
import { Admin } from './pages/Admin';
import { Auth } from './pages/Auth';
import { AllArticlesPage } from './pages/AllArticlesPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { PastShowsArchivePage } from './pages/PastShowsArchivePage';
import { PastShowPage } from './pages/PastShowPage';
import { useAuth } from './utils/useAuth';
import { Welcome } from './pages/Welcome';

// Component to handle scroll to top on route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Component to handle hash URL redirects for backwards compatibility
const HashRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle old hash URLs for backwards compatibility
    const hash = window.location.hash;
    if (hash) {
      console.log('🔄 Redirecting hash URL:', hash);
      
      // Remove the hash from URL and navigate to clean path
      let newPath = hash.slice(1); // Remove the '#'
      
      // Handle specific hash patterns
      if (newPath === '' || newPath === 'home') {
        newPath = '/';
      } else if (newPath === 'upcoming') {
        newPath = '/?scroll=upcoming'; // Special case for sections
      } else if (!newPath.startsWith('/')) {
        newPath = '/' + newPath; // Ensure it starts with '/'
      }
      
      // Clear the hash and navigate
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      navigate(newPath);
    }
  }, [navigate]);

  return null;
};

// Protected Route wrapper for admin pages
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
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
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Auth Route wrapper - redirects to home if already authenticated
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
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
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Main App Router Component
const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Home Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      
      {/* Content Routes */}
      <Route path="/articles" element={<AllArticlesPage />} />
      <Route path="/posts/:slug" element={<BlogPostPage />} />
      <Route path="/past-shows" element={<PastShowsArchivePage />} />
      <Route path="/shows/:slug" element={<PastShowPage />} />
      
      {/* Legacy ID-based routes (backwards compatibility) */}
      <Route path="/blog-post-:postId" element={<BlogPostPage />} />
      <Route path="/past-show-:showId" element={<PastShowPage />} />
      
      {/* Auth Routes */}
      <Route 
        path="/auth" 
        element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        } 
      />
      
      {/* NEW: Welcome Page for Email Confirmation */}
      <Route path="/welcome" element={<Welcome />} />
      
      {/* Protected Admin Route */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <Admin />
          </ProtectedRoute>
        } 
      />
      
      {/* Special routes for homepage sections */}
      <Route path="/upcoming" element={<Navigate to="/?section=upcoming" replace />} />
      
      {/* Catch-all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  const { isLoading } = useAuth();

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

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <HashRedirect />
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
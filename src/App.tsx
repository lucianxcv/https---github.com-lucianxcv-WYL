// ==================== src/App.tsx ====================
/**
 * MAIN APPLICATION COMPONENT
 * 
 * This is the root component that sets up routing and provides global theme context.
 * Currently uses hash-based routing for simplicity - can be upgraded to React Router later.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Add new routes/pages by extending the route handling
 * - Change the default page (currently homepage)
 * - Add global loading states or error boundaries
 * - Modify the theme provider setup
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { HomePage } from './pages/HomePage';
import { Admin } from './pages/Admin';
import { Auth } from './pages/Auth';

const App: React.FC = () => {
  // Simple routing state - tracks current page
  const [currentPage, setCurrentPage] = useState('home');

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

  // Render the appropriate page based on current route
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin':
        return <Admin />;
      case 'auth':
        return <Auth />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    // Wrap entire app in theme provider so all components can access theme
    <ThemeProvider>
      {renderCurrentPage()}
    </ThemeProvider>
  );
};

export default App;
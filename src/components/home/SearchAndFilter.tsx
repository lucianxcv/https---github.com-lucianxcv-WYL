// ==================== src/components/home/SearchAndFilter.tsx ====================
/**
 * SEARCH AND FILTER COMPONENT
 * 
 * Provides search and year filtering functionality for past shows.
 * Updates results in real-time as user types or selects filters.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Add more filter options (speaker, topic, duration)
 * - Change search behavior (search descriptions, add fuzzy search)
 * - Modify styling of input fields
 * - Add sort options (date, alphabetical, popularity)
 * - Add clear/reset buttons
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { PastShow } from '../../data/types';

interface SearchAndFilterProps {
  shows: PastShow[];                    // All available shows
  onFilter: (filtered: PastShow[]) => void; // Callback to update filtered results
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ shows, onFilter }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  // Get unique years from all shows for the filter dropdown
  const years = Array.from(new Set(shows.map(show => show.year))).sort((a, b) => b - a);

  // Filter shows whenever search term or year selection changes
  useEffect(() => {
    const filtered = shows.filter(show => {
      // Check if show matches search term (in title or speaker name)
      const matchesSearch = show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           show.speakerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Check if show matches selected year
      const matchesYear = selectedYear === 'all' || show.year.toString() === selectedYear;
      
      // Show must match both search and year criteria
      return matchesSearch && matchesYear;
    });
    
    // Send filtered results back to parent component
    onFilter(filtered);
  }, [searchTerm, selectedYear, shows, onFilter]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  // Shared styling for both input fields
  const inputStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    borderRadius: '8px',
    border: `2px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.base,
    flex: 1,
    minWidth: '200px',
    transition: 'all 0.3s ease'
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    flex: 'none', // Don't grow like the search input
    minWidth: '120px'
  };

  return (
    <div style={containerStyle}>
      {/* Search input */}
      <input
        type="text"
        placeholder="🔍 Search shows or speakers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={inputStyle}
        // Focus styling
        onFocus={(e) => e.currentTarget.style.borderColor = theme.colors.secondary}
        onBlur={(e) => e.currentTarget.style.borderColor = theme.colors.border}
      />
      
      {/* Year filter dropdown */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        style={selectStyle}
      >
        <option value="all">All Years</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

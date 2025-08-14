/**
 * WEATHER DASHBOARD COMPONENT
 * 
 * Real-time sailing conditions display for San Francisco Bay.
 * Shows wind, weather, and sailing difficulty to help members decide when to sail.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change the layout and styling
 * - Add more weather parameters (UV index, wave height)
 * - Customize sailing condition algorithms
 * - Add different locations
 * - Change update intervals
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { WeatherData } from '../../data/types';
import { fetchWeatherData, getMockTideData } from '../../utils/weatherService';

export const WeatherDashboard: React.FC = () => {
  const theme = useTheme();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch weather data when component mounts and every 5 minutes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const weatherData = await fetchWeatherData();
        setWeather(weatherData);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchData();

    // Set up interval to fetch every 5 minutes (300,000 ms)
    const interval = setInterval(fetchData, 300000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Get condition color based on sailing conditions
  const getConditionColor = (condition: WeatherData['sailingCondition']) => {
    switch (condition) {
      case 'Excellent': return '#10b981'; // Green
      case 'Good': return '#3b82f6'; // Blue
      case 'Fair': return '#f59e0b'; // Yellow
      case 'Poor': return '#ef4444'; // Red
      default: return theme.colors.textSecondary;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: WeatherData['sailingDifficulty']) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981'; // Green
      case 'Intermediate': return '#f59e0b'; // Yellow
      case 'Expert': return '#f97316'; // Orange
      case 'Dangerous': return '#ef4444'; // Red
      default: return theme.colors.textSecondary;
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '20px',
    padding: theme.spacing.xl,
    margin: `${theme.spacing.xl} 0`,
    boxShadow: theme.shadows.lg,
    border: `2px solid ${theme.colors.border}`,
    position: 'relative',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: '12px',
    textAlign: 'center',
    border: `1px solid ${theme.colors.border}`
  };

  const valueStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.xs
  };

  const labelStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const conditionBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: '25px',
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    textTransform: 'uppercase'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing.md }}>🌊</div>
          <p>Loading current sailing conditions...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
          <p>Unable to load weather data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const tideData = getMockTideData();

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          ⛵ Live Sailing Conditions
        </h2>
        <div style={{ 
          fontSize: theme.typography.sizes.sm, 
          color: theme.colors.textSecondary 
        }}>
          Updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Overall Conditions */}
      <div style={{ 
        display: 'flex', 
        gap: theme.spacing.md, 
        marginBottom: theme.spacing.lg,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{
          ...conditionBadgeStyle,
          backgroundColor: getConditionColor(weather.sailingCondition) + '20',
          color: getConditionColor(weather.sailingCondition),
          border: `2px solid ${getConditionColor(weather.sailingCondition)}`
        }}>
          🌊 {weather.sailingCondition} Conditions
        </div>
        <div style={{
          ...conditionBadgeStyle,
          backgroundColor: getDifficultyColor(weather.sailingDifficulty) + '20',
          color: getDifficultyColor(weather.sailingDifficulty),
          border: `2px solid ${getDifficultyColor(weather.sailingDifficulty)}`
        }}>
          🎯 {weather.sailingDifficulty} Level
        </div>
      </div>

      {/* Weather Grid */}
      <div style={gridStyle}>
        {/* Wind */}
        <div style={cardStyle}>
          <div style={{ ...valueStyle, color: theme.colors.primary }}>
            {weather.windSpeed} <small style={{ fontSize: '1rem' }}>mph</small>
          </div>
          <div style={labelStyle}>Wind Speed</div>
          <div style={{ 
            marginTop: theme.spacing.xs, 
            color: theme.colors.text,
            fontSize: theme.typography.sizes.base 
          }}>
            {weather.windDirectionText} ({weather.windDirection}°)
          </div>
        </div>

        {/* Temperature */}
        <div style={cardStyle}>
          <div style={{ ...valueStyle, color: theme.colors.secondary }}>
            {weather.temperature}°F
          </div>
          <div style={labelStyle}>Temperature</div>
          <div style={{ 
            marginTop: theme.spacing.xs, 
            color: theme.colors.text,
            textTransform: 'capitalize'
          }}>
            {weather.description}
          </div>
        </div>

        {/* Visibility */}
        <div style={cardStyle}>
          <div style={{ ...valueStyle, color: theme.colors.accent }}>
            {Math.round(weather.visibility / 5280)} <small style={{ fontSize: '1rem' }}>mi</small>
          </div>
          <div style={labelStyle}>Visibility</div>
        </div>

        {/* Next High Tide */}
        <div style={cardStyle}>
          <div style={{ ...valueStyle, color: theme.colors.gold }}>
            {tideData.nextHigh.time}
          </div>
          <div style={labelStyle}>Next High Tide</div>
          <div style={{ 
            marginTop: theme.spacing.xs, 
            color: theme.colors.text 
          }}>
            {tideData.nextHigh.height} ft
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{
        backgroundColor: theme.colors.primary,
        color: '#ffffff',
        padding: theme.spacing.lg,
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          margin: `0 0 ${theme.spacing.sm} 0`,
          fontSize: theme.typography.sizes.lg 
        }}>
          {weather.sailingCondition === 'Excellent' || weather.sailingCondition === 'Good' 
            ? '🚢 Great conditions for sailing!' 
            : '⚠️ Check conditions before heading out'
          }
        </h3>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Join us at the club or share your own sailing reports!
        </p>
      </div>
    </div>
  );
};

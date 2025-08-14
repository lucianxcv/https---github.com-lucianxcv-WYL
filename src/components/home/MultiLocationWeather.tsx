/**
 * MULTI-LOCATION WEATHER DASHBOARD
 * 
 * Shows weather conditions for multiple sailing locations around SF Bay.
 * Allows sailors to quickly compare conditions and choose the best spot.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change the layout (grid vs list)
 * - Add more weather parameters
 * - Customize the "best location" algorithm
 * - Add filtering by skill level
 * - Change update intervals
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { SailingLocation } from '../../data/types';
import { fetchAllLocationWeather, findBestSailingLocation } from '../../utils/weatherService';

export const MultiLocationWeather: React.FC = () => {
  const theme = useTheme();
  const [locations, setLocations] = useState<SailingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('sf-bay-central');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch weather data for all locations
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const locationsWithWeather = await fetchAllLocationWeather();
        setLocations(locationsWithWeather);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return '#10b981';
      case 'Good': return '#3b82f6';
      case 'Fair': return '#f59e0b';
      case 'Poor': return '#ef4444';
      default: return theme.colors.textSecondary;
    }
  };

  const getSkillLevelColor = (skillLevel: string) => {
    switch (skillLevel) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Expert': return '#ef4444';
      case 'All Levels': return '#3b82f6';
      default: return theme.colors.textSecondary;
    }
  };

  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);
  const bestLocation = findBestSailingLocation(locations);

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '20px',
    padding: theme.spacing.xl,
    margin: `${theme.spacing.xl} 0`,
    boxShadow: theme.shadows.lg,
    border: `2px solid ${theme.colors.border}`
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: theme.spacing.lg
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm
  };

  const locationGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl
  };

  const locationCardStyle = (isSelected: boolean, condition?: string): React.CSSProperties => ({
    backgroundColor: isSelected ? theme.colors.primary + '10' : theme.colors.surface,
    border: `2px solid ${isSelected ? theme.colors.primary : (condition ? getConditionColor(condition) + '40' : theme.colors.border)}`,
    borderRadius: '12px',
    padding: theme.spacing.lg,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative'
  });

  const detailCardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: '16px',
    padding: theme.spacing.xl,
    border: `1px solid ${theme.colors.border}`
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
          <div style={{ fontSize: '2rem', marginBottom: theme.spacing.md }}>🗺️</div>
          <p>Loading conditions for all sailing locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          🗺️ SF Bay Sailing Conditions
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <p style={{ color: theme.colors.textSecondary, margin: 0 }}>
            Compare conditions across {locations.length} popular sailing locations
          </p>
          <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
            Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Best Location Alert */}
      {bestLocation && bestLocation.weather && (
        <div style={{
          backgroundColor: getConditionColor(bestLocation.weather.sailingCondition) + '20',
          border: `2px solid ${getConditionColor(bestLocation.weather.sailingCondition)}`,
          borderRadius: '12px',
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: `0 0 ${theme.spacing.sm} 0`,
            color: getConditionColor(bestLocation.weather.sailingCondition)
          }}>
            🏆 Best Conditions Right Now
          </h3>
          <p style={{ margin: 0, fontSize: theme.typography.sizes.lg }}>
            <strong>{bestLocation.name}</strong> - {bestLocation.weather.windSpeed} mph winds, {bestLocation.weather.sailingCondition.toLowerCase()} conditions
          </p>
        </div>
      )}

      {/* Location Cards Grid */}
      <div style={locationGridStyle}>
        {locations.map((location) => (
          <div
            key={location.id}
            style={locationCardStyle(selectedLocation === location.id, location.weather?.sailingCondition)}
            onClick={() => setSelectedLocation(location.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Best location badge */}
            {bestLocation && bestLocation.id === location.id && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '16px',
                backgroundColor: theme.colors.gold,
                color: theme.colors.primary,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: '20px',
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.bold
              }}>
                🏆 BEST
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: theme.spacing.md }}>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.bold
                }}>
                  {location.name}
                </h3>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: getSkillLevelColor(location.skillLevel) + '20',
                  color: getSkillLevelColor(location.skillLevel),
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  borderRadius: '12px',
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.semibold,
                  marginTop: theme.spacing.xs
                }}>
                  {location.skillLevel}
                </div>
              </div>
            </div>

            {location.weather ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
                  <div>
                    <div style={{ 
                      fontSize: theme.typography.sizes.xl, 
                      fontWeight: theme.typography.weights.bold,
                      color: theme.colors.primary
                    }}>
                      {location.weather.windSpeed} mph
                    </div>
                    <div style={{ 
                      fontSize: theme.typography.sizes.sm, 
                      color: theme.colors.textSecondary 
                    }}>
                      {location.weather.windDirectionText}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: theme.typography.sizes.lg, 
                      color: theme.colors.text 
                    }}>
                      {location.weather.temperature}°F
                    </div>
                    <div style={{ 
                      fontSize: theme.typography.sizes.sm, 
                      color: theme.colors.textSecondary,
                      textTransform: 'capitalize'
                    }}>
                      {location.weather.description}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'inline-block',
                  backgroundColor: getConditionColor(location.weather.sailingCondition) + '20',
                  color: getConditionColor(location.weather.sailingCondition),
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  borderRadius: '20px',
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.semibold
                }}>
                  {location.weather.sailingCondition} Conditions
                </div>
              </>
            ) : (
              <div style={{ color: theme.colors.textSecondary }}>
                Weather data unavailable
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ================= Detailed View of Selected Location (Updated) ================= */}
      {selectedLocationData && selectedLocationData.weather && (
        <div style={detailCardStyle}>
          {/* Title */}
          <h3 style={{ 
            margin: `0 0 ${theme.spacing.md} 0`,
            color: theme.colors.primary,
            fontSize: theme.typography.sizes.xl
          }}>
            📍 {selectedLocationData.name} Details
          </h3>
          
          {/* Description */}
          <p style={{ 
            color: theme.colors.textSecondary, 
            marginBottom: theme.spacing.lg,
            lineHeight: 1.6
          }}>
            {selectedLocationData.description}
          </p>

          {/* Weather Stats Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: theme.spacing.md
          }}>
            {/* Wind Speed */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: theme.typography.sizes['2xl'], 
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.primary
              }}>
                {selectedLocationData.weather.windSpeed} mph
              </div>
              <div style={{ color: theme.colors.textSecondary }}>Wind Speed</div>
            </div>

            {/* Wind Direction */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: theme.typography.sizes['2xl'], 
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.secondary
              }}>
                {selectedLocationData.weather.windDirectionText}
              </div>
              <div style={{ color: theme.colors.textSecondary }}>Wind Direction</div>
            </div>

            {/* Visibility */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: theme.typography.sizes['2xl'], 
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.accent
              }}>
                {Math.round(selectedLocationData.weather.visibility / 5280)} mi
              </div>
              <div style={{ color: theme.colors.textSecondary }}>Visibility</div>
            </div>

            {/* Humidity */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: theme.typography.sizes['2xl'], 
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.gold
              }}>
                {selectedLocationData.weather.humidity}%
              </div>
              <div style={{ color: theme.colors.textSecondary }}>Humidity</div>
            </div>
          </div>
        </div>
      )}
      {/* ================= End of Updated Detailed View ================= */}
    </div>
  );
};

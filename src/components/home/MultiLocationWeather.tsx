/**
 * ENHANCED WEATHER DASHBOARD COMPONENT
 * 
 * Fixed version with proper grid layout and clickable cards
 * - 6 cards per row on large screens, responsive down to 1 on mobile
 * - Clickable cards to show individual location details
 * - Proper filtering and individual location view
 * - Enhanced visual design
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { weatherApi } from '../../utils/apiService';
import { sailingLocations } from '../../data/sailingLocations';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  tideHigh?: string;
  tideLow?: string;
  sunrise?: string;
  sunset?: string;
  icon?: string;
}

interface WeatherLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  featured?: boolean;
}

export const MultiLocationWeather: React.FC = () => {
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [singleLocationData, setSingleLocationData] = useState<WeatherData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Featured locations for the dashboard
  const featuredLocations: WeatherLocation[] = [
    { id: 'sf-bay', name: 'San Francisco Bay', lat: 37.7749, lon: -122.4194, featured: true },
    { id: 'golden-gate', name: 'Golden Gate', lat: 37.8199, lon: -122.4783, featured: true },
    { id: 'alcatraz', name: 'Alcatraz Island', lat: 37.8267, lon: -122.4230, featured: true },
    { id: 'sausalito', name: 'Sausalito', lat: 37.8590, lon: -122.4852, featured: true },
    { id: 'angel-island', name: 'Angel Island', lat: 37.8625, lon: -122.4319, featured: true },
    { id: 'tiburon', name: 'Tiburon', lat: 37.8736, lon: -122.4486, featured: true }
  ];

  const sectionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    borderRadius: '24px',
    padding: theme.spacing.xl,
    margin: `${theme.spacing.xl} auto`,
    maxWidth: '1400px',
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
    gap: theme.spacing.md
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs
  };

  const backButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme.colors.secondary
  };

  // FIXED: Proper grid layout for 6 cards per row
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)', // 6 columns on large screens
    gap: theme.spacing.md
  };

  const lastUpdatedStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md
  };

  // Enhanced weather card component with click functionality
  const WeatherCard: React.FC<{ data: WeatherData; index: number; onClick?: () => void }> = ({ 
    data, 
    index, 
    onClick 
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle: React.CSSProperties = {
      backgroundColor: theme.colors.surface,
      borderRadius: '16px',
      padding: theme.spacing.md,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: isHovered ? theme.shadows.md : theme.shadows.sm,
      transition: 'all 0.4s ease',
      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      position: 'relative',
      overflow: 'hidden',
      animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
      cursor: onClick ? 'pointer' : 'default',
      minHeight: '180px'
    };

    const locationNameStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: 1.2
    };

    const temperatureStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs
    };

    const conditionStyle: React.CSSProperties = {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      fontWeight: theme.typography.weights.medium
    };

    const detailsStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.xs,
      fontSize: theme.typography.sizes.xs
    };

    const detailItemStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.text
    };

    const getWeatherIcon = (condition: string) => {
      const conditionLower = condition.toLowerCase();
      if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️';
      if (conditionLower.includes('cloud')) return '☁️';
      if (conditionLower.includes('rain')) return '🌧️';
      if (conditionLower.includes('storm')) return '⛈️';
      if (conditionLower.includes('snow')) return '❄️';
      if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
      if (conditionLower.includes('wind')) return '💨';
      return '🌤️';
    };

    return (
      <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Header */}
        <div style={{ marginBottom: theme.spacing.xs }}>
          <h3 style={locationNameStyle}>{data.location}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
            <span style={{ fontSize: '1rem' }}>{getWeatherIcon(data.condition)}</span>
            <span style={temperatureStyle}>{Math.round(data.temperature)}°</span>
          </div>
          <p style={conditionStyle}>{data.condition}</p>
        </div>

        {/* Compact Details */}
        <div style={detailsStyle}>
          <div style={detailItemStyle}>
            <span>💧 Humidity</span>
            <span>{data.humidity}%</span>
          </div>
          <div style={detailItemStyle}>
            <span>💨 Wind</span>
            <span>{data.windSpeed}mph</span>
          </div>
          <div style={detailItemStyle}>
            <span>👁️ Visibility</span>
            <span>{data.visibility}mi</span>
          </div>
        </div>

        {/* Click indicator */}
        {onClick && (
          <div style={{
            position: 'absolute',
            bottom: theme.spacing.xs,
            right: theme.spacing.xs,
            fontSize: '0.75rem',
            color: theme.colors.textSecondary,
            opacity: isHovered ? 1 : 0.5,
            transition: 'opacity 0.3s ease'
          }}>
            👆 Click for details
          </div>
        )}

        {/* Hover effect overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${theme.colors.primary}05, ${theme.colors.secondary}05)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          borderRadius: '16px'
        }} />
      </div>
    );
  };

  // Single location detailed view
  const SingleLocationView: React.FC<{ data: WeatherData }> = ({ data }) => {
    const getWindDirection = (degrees: number) => {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(degrees / 22.5) % 16;
      return directions[index];
    };

    const getUVLevel = (uvIndex: number) => {
      if (uvIndex <= 2) return { level: 'Low', color: '#22c55e' };
      if (uvIndex <= 5) return { level: 'Moderate', color: '#f59e0b' };
      if (uvIndex <= 7) return { level: 'High', color: '#ef4444' };
      if (uvIndex <= 10) return { level: 'Very High', color: '#dc2626' };
      return { level: 'Extreme', color: '#7c2d12' };
    };

    const uvInfo = getUVLevel(data.uvIndex);

    return (
      <div style={{
        backgroundColor: theme.colors.surface,
        borderRadius: '20px',
        padding: theme.spacing.xl,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.md
      }}>
        <div style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
          <h3 style={{
            fontSize: theme.typography.sizes['2xl'],
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
            marginBottom: theme.spacing.sm
          }}>
            {data.location}
          </h3>
          <div style={{
            fontSize: theme.typography.sizes['4xl'],
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.primary,
            marginBottom: theme.spacing.sm
          }}>
            {Math.round(data.temperature)}°F
          </div>
          <p style={{
            fontSize: theme.typography.sizes.lg,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg
          }}>
            {data.condition}
          </p>
        </div>

        {/* Detailed weather grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: theme.spacing.lg
        }}>
          <div style={{
            backgroundColor: theme.colors.background,
            padding: theme.spacing.md,
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>💨</div>
            <div style={{ fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.bold, color: theme.colors.text }}>
              {data.windSpeed} mph
            </div>
            <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              {getWindDirection(data.windDirection)} ({data.windDirection}°)
            </div>
          </div>

          <div style={{
            backgroundColor: theme.colors.background,
            padding: theme.spacing.md,
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>💧</div>
            <div style={{ fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.bold, color: theme.colors.text }}>
              {data.humidity}%
            </div>
            <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              Humidity
            </div>
          </div>

          <div style={{
            backgroundColor: theme.colors.background,
            padding: theme.spacing.md,
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>👁️</div>
            <div style={{ fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.bold, color: theme.colors.text }}>
              {data.visibility} mi
            </div>
            <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              Visibility
            </div>
          </div>

          <div style={{
            backgroundColor: theme.colors.background,
            padding: theme.spacing.md,
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>🌡️</div>
            <div style={{ fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.bold, color: theme.colors.text }}>
              {data.pressure} mb
            </div>
            <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              Pressure
            </div>
          </div>

          <div style={{
            backgroundColor: theme.colors.background,
            padding: theme.spacing.md,
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>☀️</div>
            <div style={{ 
              fontSize: theme.typography.sizes.lg, 
              fontWeight: theme.typography.weights.bold, 
              color: uvInfo.color 
            }}>
              {data.uvIndex}
            </div>
            <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              UV Index ({uvInfo.level})
            </div>
          </div>

          {data.tideHigh && (
            <div style={{
              backgroundColor: theme.colors.background,
              padding: theme.spacing.md,
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: theme.spacing.xs }}>🌊</div>
              <div style={{ fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.bold, color: theme.colors.text }}>
                {data.tideHigh}
              </div>
              <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
                High Tide
              </div>
            </div>
          )}
        </div>

        {/* Additional info if available */}
        {(data.sunrise || data.sunset) && (
          <div style={{
            marginTop: theme.spacing.lg,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.background,
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            {data.sunrise && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: theme.spacing.xs }}>🌅</div>
                <div style={{ fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.semibold }}>
                  {data.sunrise}
                </div>
                <div style={{ fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary }}>
                  Sunrise
                </div>
              </div>
            )}
            {data.sunset && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: theme.spacing.xs }}>🌇</div>
                <div style={{ fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.semibold }}>
                  {data.sunset}
                </div>
                <div style={{ fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary }}>
                  Sunset
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Loading skeleton
  const LoadingSkeleton: React.FC = () => (
    <div style={gridStyle}>
      {[...Array(6)].map((_, index) => (
        <div key={index} style={{
          backgroundColor: theme.colors.surface,
          borderRadius: '16px',
          padding: theme.spacing.md,
          border: `1px solid ${theme.colors.border}`,
          animation: 'pulse 2s ease-in-out infinite',
          minHeight: '180px'
        }}>
          <div style={{
            height: '14px',
            backgroundColor: theme.colors.border,
            borderRadius: '8px',
            marginBottom: theme.spacing.xs,
            width: '70%'
          }} />
          <div style={{
            height: '20px',
            backgroundColor: theme.colors.border,
            borderRadius: '8px',
            marginBottom: theme.spacing.xs,
            width: '50%'
          }} />
          <div style={{
            height: '10px',
            backgroundColor: theme.colors.border,
            borderRadius: '6px',
            marginBottom: theme.spacing.sm,
            width: '80%'
          }} />
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              height: '8px',
              backgroundColor: theme.colors.border,
              borderRadius: '4px',
              marginBottom: '4px'
            }} />
          ))}
        </div>
      ))}
    </div>
  );

  // Load weather data
  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with sample data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sampleWeatherData: WeatherData[] = [
        {
          location: 'San Francisco Bay',
          temperature: 68,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          windDirection: 270,
          visibility: 10,
          pressure: 1013,
          uvIndex: 6,
          tideHigh: '2:30 PM',
          tideLow: '8:45 PM',
          sunrise: '6:42 AM',
          sunset: '7:23 PM'
        },
        {
          location: 'Golden Gate',
          temperature: 62,
          condition: 'Foggy',
          humidity: 85,
          windSpeed: 18,
          windDirection: 315,
          visibility: 3,
          pressure: 1015,
          uvIndex: 3,
          sunrise: '6:42 AM',
          sunset: '7:23 PM'
        },
        {
          location: 'Alcatraz Island',
          temperature: 66,
          condition: 'Clear',
          humidity: 58,
          windSpeed: 8,
          windDirection: 225,
          visibility: 15,
          pressure: 1012,
          uvIndex: 7,
          tideHigh: '2:15 PM',
          tideLow: '8:30 PM'
        },
        {
          location: 'Sausalito',
          temperature: 70,
          condition: 'Sunny',
          humidity: 55,
          windSpeed: 6,
          windDirection: 180,
          visibility: 12,
          pressure: 1014,
          uvIndex: 8,
          sunrise: '6:43 AM',
          sunset: '7:22 PM'
        },
        {
          location: 'Angel Island',
          temperature: 64,
          condition: 'Partly Cloudy',
          humidity: 70,
          windSpeed: 14,
          windDirection: 290,
          visibility: 8,
          pressure: 1011,
          uvIndex: 5,
          tideHigh: '2:45 PM',
          tideLow: '9:00 PM'
        },
        {
          location: 'Tiburon',
          temperature: 72,
          condition: 'Sunny',
          humidity: 52,
          windSpeed: 7,
          windDirection: 200,
          visibility: 14,
          pressure: 1016,
          uvIndex: 9,
          sunrise: '6:44 AM',
          sunset: '7:21 PM'
        }
      ];

      setWeatherData(sampleWeatherData);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError('Failed to load weather data');
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle card click to show single location
  const handleCardClick = (data: WeatherData) => {
    setSingleLocationData(data);
    setViewMode('single');
  };

  // Handle back to grid view
  const handleBackToGrid = () => {
    setViewMode('grid');
    setSingleLocationData(null);
    setSelectedLocation('all');
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  // Responsive CSS
  const animations = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .weather-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: ${theme.spacing.md};
    }
    
    @media (max-width: 1400px) {
      .weather-grid {
        grid-template-columns: repeat(4, 1fr) !important;
      }
    }
    
    @media (max-width: 1000px) {
      .weather-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }
    
    @media (max-width: 768px) {
      .weather-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: ${theme.spacing.sm} !important;
      }
    }
    
    @media (max-width: 480px) {
      .weather-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  const filteredData = selectedLocation === 'all' 
    ? weatherData 
    : weatherData.filter(data => data.location.toLowerCase().includes(selectedLocation.toLowerCase()));

  if (error) {
    return (
      <section style={sectionStyle}>
        <h2 style={titleStyle}>🌊 Bay Area Marine Conditions</h2>
        <div style={{
          textAlign: 'center',
          padding: theme.spacing.xl,
          backgroundColor: theme.colors.surface,
          borderRadius: '20px',
          border: `2px dashed ${theme.colors.border}`
        }}>
          <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>⚠️</div>
          <h3 style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
            Weather Data Unavailable
          </h3>
          <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.md }}>
            Unable to load current weather conditions. Please try again.
          </p>
          <button style={buttonStyle} onClick={loadWeatherData}>
            🔄 Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{animations}</style>
      <section style={sectionStyle}>
        <h2 style={titleStyle}>🌊 Bay Area Marine Conditions</h2>
        
        {/* Header with Controls */}
        <div style={headerStyle}>
          <div style={controlsStyle}>
            {viewMode === 'single' ? (
              <button
                style={backButtonStyle}
                onClick={handleBackToGrid}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.accent;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondary;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ← Back to All Locations
              </button>
            ) : (
              <>
                <select
                  style={{
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    border: `2px solid ${theme.colors.border}`,
                    borderRadius: '12px',
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.medium,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                >
                  <option value="all">All Locations</option>
                  <option value="san francisco">San Francisco Bay</option>
                  <option value="golden gate">Golden Gate</option>
                  <option value="alcatraz">Alcatraz Island</option>
                  <option value="sausalito">Sausalito</option>
                  <option value="angel">Angel Island</option>
                  <option value="tiburon">Tiburon</option>
                </select>

                <button
                  style={buttonStyle}
                  onClick={loadWeatherData}
                  disabled={loading}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = theme.colors.secondary;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = theme.colors.primary;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {loading ? '⏳' : '🔄'} {loading ? 'Updating...' : 'Refresh'}
                </button>
              </>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            fontSize: theme.typography.sizes.sm,
            color: theme.colors.textSecondary
          }}>
            <span>🕒</span>
            <span>Live Data</span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : viewMode === 'single' && singleLocationData ? (
          <SingleLocationView data={singleLocationData} />
        ) : (
          <>
            <div style={gridStyle} className="weather-grid">
              {filteredData.map((data, index) => (
                <WeatherCard 
                  key={data.location} 
                  data={data} 
                  index={index}
                  onClick={() => handleCardClick(data)}
                />
              ))}
            </div>

            {filteredData.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: theme.spacing.xl,
                color: theme.colors.textSecondary
              }}>
                <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🔍</div>
                <p>No weather data found for the selected location.</p>
              </div>
            )}
          </>
        )}

        {/* Footer with last updated time */}
        <div style={lastUpdatedStyle}>
          📡 Last updated: {lastUpdated.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>

        {/* Weather Alert Banner (if needed) */}
        <div style={{
          marginTop: theme.spacing.lg,
          padding: theme.spacing.md,
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          fontSize: theme.typography.sizes.sm,
          color: '#92400e'
        }}>
          <span>⚠️</span>
          <span><strong>Marine Advisory:</strong> Small craft advisory in effect. Winds 15-25 knots with gusts to 30 knots expected.</span>
        </div>
      </section>
    </>
  );
};
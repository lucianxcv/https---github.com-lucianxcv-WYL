// ==================== src/components/home/CountdownTimer.tsx ====================
/**
 * COUNTDOWN TIMER COMPONENT
 * 
 * Shows time remaining until the next luncheon event with animated number boxes.
 * Updates every second to show live countdown.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change the styling of the number boxes (colors, borders, shadows)
 * - Add or remove time units (add weeks, remove seconds)
 * - Modify the update interval (currently updates every second)
 * - Change what happens when the countdown reaches zero
 * - Add sound effects or animations when numbers change
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { calculateTimeLeft } from '../../utils/dateUtils';

interface CountdownTimerProps {
  targetDate: string; // ISO date string of the target event
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const theme = useTheme();
  // State to hold the current time remaining
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Effect that runs when component mounts and updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate new time remaining
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
    }, 1000); // Update every 1000ms (1 second)

    // Cleanup: clear the timer when component unmounts
    return () => clearInterval(timer);
  }, [targetDate]);

  // Container for all the time boxes
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    justifyContent: 'center',
    margin: `${theme.spacing.xl} 0`,
    flexWrap: 'wrap' // Wrap on smaller screens
  };

  // Individual time box styling
  const timeBoxStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    border: `2px solid ${theme.colors.secondary}`,
    borderRadius: '12px',
    padding: theme.spacing.md,
    textAlign: 'center',
    minWidth: '80px',
    boxShadow: theme.shadows.md
  };

  // Large number styling
  const numberStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    display: 'block',
    lineHeight: 1
  };

  // Label under each number
  const labelStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs
  };

  return (
    <div style={containerStyle}>
      <div style={timeBoxStyle}>
        <span style={numberStyle}>{timeLeft.days}</span>
        <span style={labelStyle}>Days</span>
      </div>
      <div style={timeBoxStyle}>
        <span style={numberStyle}>{timeLeft.hours}</span>
        <span style={labelStyle}>Hours</span>
      </div>
      <div style={timeBoxStyle}>
        <span style={numberStyle}>{timeLeft.minutes}</span>
        <span style={labelStyle}>Minutes</span>
      </div>
      <div style={timeBoxStyle}>
        <span style={numberStyle}>{timeLeft.seconds}</span>
        <span style={labelStyle}>Seconds</span>
      </div>
    </div>
  );
};

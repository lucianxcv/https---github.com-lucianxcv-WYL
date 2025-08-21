// ==================== src/components/home/CountdownTimer.tsx ====================
/**
 * COUNTDOWN TIMER COMPONENT
 * 
 * Updated: Supports auto-reset based on repeatInterval prop (daily, weekly, monthly)
 * This makes the countdown restart automatically when it reaches zero.
 * Now displays as a compact single row format: "[6 days 14 hours 27 min etc]"
 */

import React, { useState as useReactState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { calculateTimeLeft as calcTimeLeft } from '../../utils/dateUtils';

interface CountdownProps {
  targetDate: string; // ISO date string of the target event
  repeatInterval?: 'daily' | 'weekly' | 'monthly'; // Optional auto-reset interval
  compact?: boolean; // New prop to enable compact row display
}

const CountdownTimerComponent: React.FC<CountdownProps> = ({ 
  targetDate, 
  repeatInterval, 
  compact = false 
}) => {
  const theme = useTheme();

  // State to track the current target date (changes on reset)
  const [currentTargetDate, setCurrentTargetDate] = useReactState(targetDate);
  // State to track time left
  const [timeLeft, setTimeLeft] = useReactState(calcTimeLeft(targetDate));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTimeLeft = calcTimeLeft(currentTargetDate);

      // Check if countdown finished
      const isFinished =
        newTimeLeft.days <= 0 &&
        newTimeLeft.hours <= 0 &&
        newTimeLeft.minutes <= 0 &&
        newTimeLeft.seconds <= 0;

      if (isFinished && repeatInterval) {
        // Calculate next occurrence based on repeatInterval
        const nextDate = new Date(currentTargetDate);

        if (repeatInterval === 'daily') {
          nextDate.setDate(nextDate.getDate() + 1);
        } else if (repeatInterval === 'weekly') {
          nextDate.setDate(nextDate.getDate() + 7);
        } else if (repeatInterval === 'monthly') {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }

        setCurrentTargetDate(nextDate.toISOString());
        setTimeLeft(calcTimeLeft(nextDate.toISOString()));
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [currentTargetDate, repeatInterval]);

  // Compact row display
  if (compact) {
    const compactStyle: React.CSSProperties = {
      color: '#ffffff',
      fontSize: '0.85rem',
      fontWeight: theme.typography.weights.medium,
      textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
      letterSpacing: '0.5px'
    };

    // Build the compact string
    const parts: string[] = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days} days`);
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours} hours`);
    if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes} min`);
    if (timeLeft.seconds > 0 && timeLeft.days === 0 && timeLeft.hours === 0) {
      parts.push(`${timeLeft.seconds} sec`);
    }

    const timeString = parts.length > 0 ? parts.join(' ') : 'Starting soon';

    return (
      <div style={compactStyle}>
        {timeString}
      </div>
    );
  }

  // Original box layout for non-compact display
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  const timeBoxStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    border: `2px solid ${theme.colors.secondary}`,
    borderRadius: '12px',
    padding: theme.spacing.md,
    textAlign: 'center',
    minWidth: '80px',
    boxShadow: theme.shadows.md
  };

  const numberStyle: React.CSSProperties = {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    display: 'block',
    lineHeight: 1
  };

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

// Export the component with a clean name
export const CountdownTimer = CountdownTimerComponent;
export type { CountdownProps as CountdownTimerProps };
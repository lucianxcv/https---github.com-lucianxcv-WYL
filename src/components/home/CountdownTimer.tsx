// ==================== src/components/home/CountdownTimer.tsx ====================
/**
 * COUNTDOWN TIMER COMPONENT
 * 
 * Updated: Supports auto-reset based on repeatInterval prop (daily, weekly, monthly)
 * This makes the countdown restart automatically when it reaches zero.
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { calculateTimeLeft } from '../../utils/dateUtils';

interface CountdownTimerProps {
  targetDate: string; // ISO date string of the target event
  repeatInterval?: 'daily' | 'weekly' | 'monthly'; // Optional auto-reset interval
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, repeatInterval }) => {
  const theme = useTheme();

  // State to track the current target date (changes on reset)
  const [currentTargetDate, setCurrentTargetDate] = useState(targetDate);
  // State to track time left
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(currentTargetDate);

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
        setTimeLeft(calculateTimeLeft(nextDate.toISOString()));
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, [currentTargetDate, repeatInterval]);

  // Styling for the countdown boxes
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

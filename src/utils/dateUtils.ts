// ==================== src/utils/dateUtils.ts ====================
/**
 * DATE UTILITY FUNCTIONS
 * 
 * Helper functions for working with dates throughout the application.
 * Keeping these separate makes them reusable and testable.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change date formats (e.g., use European date format)
 * - Add new date formatting functions
 * - Change timezone handling
 */

/**
 * Format a date string for display
 * Takes an ISO date string and returns a human-readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',     // "Wednesday"
    year: 'numeric',     // "2025"  
    month: 'long',       // "August"
    day: 'numeric',      // "14"
    hour: 'numeric',     // "12"
    minute: '2-digit'    // "00"
  });
};

/**
 * Calculate time remaining until a target date
 * Returns an object with days, hours, minutes, and seconds
 */
export const calculateTimeLeft = (targetDate: string) => {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const difference = target - now;

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  }
  
  // Return zeros if the target date has passed
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};


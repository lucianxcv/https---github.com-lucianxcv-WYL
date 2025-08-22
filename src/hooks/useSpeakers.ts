/**
 * SPEAKERS HOOK - REAL API INTEGRATION
 * 
 * Save this file as: src/hooks/useSpeakers.ts
 */

import { useState, useEffect } from 'react';
import { speakersApi } from '../utils/apiService'; // ← Using real API

interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  nextPresentationDate?: string;
  topic?: string;
  presentationTitle?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseSpeakersReturn {
  speakers: Speaker[];
  featuredSpeakers: Speaker[];
  upcomingSpeakers: Speaker[];
  thisWeekSpeaker: Speaker | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSpeakers = (): UseSpeakersReturn => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 FIXED: Fetch speakers from real backend API
  const fetchSpeakers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🎤 Loading speakers from backend...');
      
      const response = await speakersApi.getAll();
      console.log('✅ Speakers API response:', response);

      // Handle different response formats
      let speakersData: Speaker[] = [];
      
      if (response && typeof response === 'object') {
        if ('success' in response && response.success && 'data' in response) {
          speakersData = Array.isArray(response.data) ? response.data as Speaker[] : [];
        } else if (Array.isArray(response)) {
          speakersData = response as Speaker[];
        }
      }

      console.log('🎯 Processed speakers data:', speakersData);
      setSpeakers(speakersData);

    } catch (err) {
      console.error('❌ Error fetching speakers:', err);
      setError('Failed to load speakers');
      
      // Fallback to empty array instead of mock data
      setSpeakers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  // 🔥 ENHANCED: Helper function to get this week's speaker (smart date logic)
  const getThisWeekSpeaker = (): Speaker | null => {
    const activeSpeakers = speakers.filter(s => s.isActive && s.nextPresentationDate);
    if (activeSpeakers.length === 0) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Find speakers with future presentation dates
    const futureSpeakers = activeSpeakers.filter(speaker => {
      const presentationDate = new Date(speaker.nextPresentationDate!);
      return presentationDate >= today;
    });

    if (futureSpeakers.length === 0) return null;

    // Sort by presentation date and get the next one (closest to today)
    const sortedSpeakers = futureSpeakers.sort((a, b) => 
      new Date(a.nextPresentationDate!).getTime() - new Date(b.nextPresentationDate!).getTime()
    );

    const nextSpeaker = sortedSpeakers[0];
    const presentationDate = new Date(nextSpeaker.nextPresentationDate!);
    const dayOfWeek = now.getDay(); // 0 = Sunday, 3 = Wednesday
    const daysUntilPresentation = Math.ceil((presentationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    console.log('🎯 This week speaker logic:', {
      today: today.toDateString(),
      dayOfWeek,
      nextPresentation: presentationDate.toDateString(),
      daysUntil: daysUntilPresentation,
      speaker: nextSpeaker.name
    });

    // Show as "this week's speaker" if:
    // 1. Presentation is within next 7 days, OR
    // 2. It's Monday-Wednesday and presentation is this week, OR  
    // 3. It's Thursday-Sunday and presentation is next week
    if (daysUntilPresentation <= 7) {
      return nextSpeaker;
    }

    return nextSpeaker; // For now, always show the next speaker
  };

  // 🔥 ENHANCED: Helper function to get upcoming speakers (next 2-3 after "this week")
  const getUpcomingSpeakers = (): Speaker[] => {
    const activeSpeakers = speakers.filter(s => s.isActive && s.nextPresentationDate);
    const today = new Date();
    
    // Find speakers with future presentation dates
    const futureSpeakers = activeSpeakers.filter(speaker => {
      const presentationDate = new Date(speaker.nextPresentationDate!);
      return presentationDate >= today;
    });

    // Sort by presentation date
    const sortedSpeakers = futureSpeakers.sort((a, b) => 
      new Date(a.nextPresentationDate!).getTime() - new Date(b.nextPresentationDate!).getTime()
    );

    // Skip the first one (that's "this week's speaker") and return next 3
    return sortedSpeakers.slice(1, 4);
  };

  // Helper to get featured speakers (for potential future use)
  const getFeaturedSpeakers = (): Speaker[] => {
    return speakers.filter(s => s.isActive && s.isFeatured);
  };

  return {
    speakers: speakers.filter(s => s.isActive), // Only return active speakers
    featuredSpeakers: getFeaturedSpeakers(),
    upcomingSpeakers: getUpcomingSpeakers(),
    thisWeekSpeaker: getThisWeekSpeaker(),
    loading,
    error,
    refetch: fetchSpeakers
  };
};
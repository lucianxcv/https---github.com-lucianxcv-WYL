/**
 * SPEAKERS HOOK
 * 
 * Save this file as: src/hooks/useSpeakers.ts
 */

import { useState, useEffect } from 'react';
// import { adminApi } from '../utils/apiService'; // TODO: Uncomment when ready to use real API

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

  const fetchSpeakers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, use mock data since speaker API might not be fully ready
      // TODO: Replace with actual API call when ready
      // const response = await adminApi.speakers.getAll();
      
      // Mock data matching your speaker management structure
      const mockSpeakers: Speaker[] = [
        {
          id: '1',
          name: 'Captain Sarah Johnson',
          title: 'Master Sailor & Weather Expert',
          bio: 'With over 20 years of sailing experience around San Francisco Bay, Captain Sarah specializes in weather pattern analysis and safe sailing practices.',
          photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400',
          email: 'sarah@sailing.com',
          website: 'https://sarahjohnson-sailing.com',
          linkedin: 'sarah-johnson-sailing',
          twitter: 'sarahsails',
          nextPresentationDate: '2024-12-25T12:00:00',
          topic: 'Reading Wind Patterns',
          presentationTitle: 'Mastering Bay Area Wind Patterns for Optimal Sailing',
          isActive: true,
          isFeatured: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Admiral Mike Chen',
          title: 'Racing Champion & Instructor',
          bio: 'Three-time regatta champion and certified sailing instructor. Mike teaches advanced racing techniques and competitive sailing strategies.',
          photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
          email: 'mike@racingsails.com',
          nextPresentationDate: '2025-01-01T12:00:00',
          topic: 'Racing Strategies',
          presentationTitle: 'Winning Tactics for Competitive Sailing',
          isActive: true,
          isFeatured: false,
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z'
        },
        {
          id: '3',
          name: 'Dr. Elena Rodriguez',
          title: 'Marine Conservationist',
          bio: 'Leading marine biologist and ocean conservation advocate. Dr. Rodriguez has spent over 15 years studying Pacific marine ecosystems.',
          photoUrl: 'https://images.unsplash.com/photo-1559209172-8c0ed52177c1?w=400',
          nextPresentationDate: '2025-01-08T12:00:00',
          topic: 'Ocean Conservation',
          presentationTitle: 'Protecting Our Pacific: Modern Conservation Strategies',
          isActive: true,
          isFeatured: true,
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-18T00:00:00Z'
        }
      ];

      setSpeakers(mockSpeakers);
    } catch (err) {
      setError('Failed to load speakers');
      console.error('Error fetching speakers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  // Helper function to get this week's speaker (next presentation)
  const getThisWeekSpeaker = (): Speaker | null => {
    const activeSpeakers = speakers.filter(s => s.isActive && s.nextPresentationDate);
    if (activeSpeakers.length === 0) return null;

    // Sort by presentation date and get the next one
    const sortedSpeakers = activeSpeakers.sort((a, b) => 
      new Date(a.nextPresentationDate!).getTime() - new Date(b.nextPresentationDate!).getTime()
    );

    return sortedSpeakers[0];
  };

  // Helper function to get upcoming speakers (next 2-3 weeks)
  const getUpcomingSpeakers = (): Speaker[] => {
    const activeSpeakers = speakers.filter(s => s.isActive && s.nextPresentationDate);
    
    // Sort by presentation date and skip the first one (this week's speaker)
    const sortedSpeakers = activeSpeakers.sort((a, b) => 
      new Date(a.nextPresentationDate!).getTime() - new Date(b.nextPresentationDate!).getTime()
    );

    return sortedSpeakers.slice(1, 4); // Next 3 speakers
  };

  return {
    speakers: speakers.filter(s => s.isActive),
    featuredSpeakers: speakers.filter(s => s.isActive && s.isFeatured),
    upcomingSpeakers: getUpcomingSpeakers(),
    thisWeekSpeaker: getThisWeekSpeaker(),
    loading,
    error,
    refetch: fetchSpeakers
  };
};
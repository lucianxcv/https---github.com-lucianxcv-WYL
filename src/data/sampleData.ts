// ==================== src/data/sampleData.ts ====================
/**
 * SAMPLE DATA FOR DEVELOPMENT
 * 
 * This file contains all the mock data used to populate your website during development.
 * When you connect to a real database later, this data will come from there instead.
 * 
 * BEGINNER MODIFICATIONS YOU CAN MAKE:
 * - Change speaker names, titles, bios, and topics
 * - Update past show information and descriptions
 * - Modify Captain Ted's bio and achievements
 * - Add more sample speakers or shows to test with
 * - Change dates to see how the countdown timer works
 */

import { Speaker, PastShow, Owner } from './types';

export const sampleData = {
  speakers: [
    {
      id: "1",
      name: "Captain Sarah Johnson",
      title: "Deep Sea Explorer & Marine Biologist",
      bio: "Renowned ocean explorer with over 20 years of experience in deep-sea research. Led expeditions to the most remote corners of our oceans and discovered several new species of marine life.",
      photoUrl: "https://via.placeholder.com/150/4682b4/ffffff?text=SJ",
      nextPresentationDate: "2025-08-20T12:00:00",
      topic: "Mysteries of the Mariana Trench",
      isActive: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      presentations: []
    }
  ] as Speaker[],

  pastShows: [
    {
      id: "1",
      title: "Navigation by the Stars: Ancient Techniques",
      speakerName: "Admiral Sarah Chen",
      videoId: "dQw4w9WgXcQ",
      date: "2025-08-07",
      year: 2025,
      description: "Fascinating exploration of celestial navigation methods used by Pacific islanders."
    },
    {
      id: 2,
      title: "The Franklin Expedition: New Evidence",
      speakerName: "Dr. Erik Nordstrom",
      videoId: "dQw4w9WgXcQ",
      date: "2025-07-31",
      year: 2025,
      description: "Latest archaeological discoveries from the Arctic expedition that vanished in 1845."
    }
  ] as PastShow[],

owner: {
  name: "Ronald Young",
  title: "Executive Producer & Chairman",
  bio: "For over five decades, Ron has been the heart and soul of the Wednesday Yachting Luncheon. What started as informal gatherings has grown into San Francisco's premier maritime dining experience. As Executive Producer and Chairman, he continues to bring together sailing enthusiasts, maritime experts, and distinguished speakers for this beloved weekly tradition at the St. Francis Yacht Club.",
  achievements: [
    // Add Ron's actual achievements here, for example:
    "Chairman of the Wednesday Yachting Luncheon lecture series",
    "Sailed 3,000+ races and six America’s Cup campaigns",
    "Founded the Golden Gate Challenge, raising $8.7 M",
    "Led three tech startups with exits nearing $1 billion",
    // Add any other real achievements Ron has
  ],
  photoUrl: "https://media.licdn.com/dms/image/v2/C5603AQHAN1pB7GDZFA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1583800290606?e=1758758400&v=beta&t=DDp6DFkmkauRARgfaOZmeKtwsTkrblu8swtykP2SmWM"
}}
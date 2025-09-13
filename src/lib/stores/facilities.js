import { writable } from 'svelte/store';

// Mock data for development
export const facilitiesData = [
  {
    id: 1,
    name: 'CLUB_ROOM',
    displayName: 'Club Room',
    description: 'Perfect for birthdays and celebrations, the Club Room features a bar, music system, and plenty of space for parties with friends.',
    maxDays: 2,
    requiresApproval: true,
    depositEur: 200,
    termsNote: 'A €200 deposit is required when picking up the key. Terms of Use contract must be signed at key pickup.',
    images: [
      { url: '/club-room.jpg', alt: 'Club Room - Main Area' }
    ]
  },
  {
    id: 2,
    name: 'GAMES_ROOM',
    displayName: 'Games Room',
    description: 'Entertainment hub with gaming consoles, board games, a pool table, and more — perfect for relaxation and fun with friends.',
    maxDays: 1,
    requiresApproval: true,
    depositEur: 200,
    termsNote: 'A €200 deposit is required when picking up the key. Terms of Use contract must be signed at key pickup.',
    images: [
      { url: '/games-room.jpg', alt: 'Games Room - Gaming Setup' }
    ]
  },
  {
    id: 3,
    name: 'BBQ_AREA',
    displayName: 'BBQ Area',
    description: 'Outdoor barbecue area with grill, seating, and dining space. Ideal for outdoor cooking and social gatherings.',
    maxDays: 1,
    requiresApproval: false,
    depositEur: null,
    termsNote: null,
    images: [
      { url: '/bbq-area.jpg', alt: 'BBQ Area - Grilling Space' }
    ]
  }
];

// Mock availability data
export const mockAvailability = {
  days: [
    { date: '2025-09-13', status: 'free' },
    { date: '2025-09-14', status: 'booked' },
    { date: '2025-09-15', status: 'free' },
    { date: '2025-09-16', status: 'pending' },
    { date: '2025-09-17', status: 'free' },
    { date: '2025-09-18', status: 'blackout' },
    { date: '2025-09-19', status: 'free' },
    { date: '2025-09-20', status: 'free' }
  ]
};

// Stores
export const facilities = writable(facilitiesData);
export const selectedFacility = writable(null);
export const availability = writable(mockAvailability);
export const selectedDates = writable({ start: null, end: null });

// Helper functions
export function getFacilityById(id) {
  return facilitiesData.find(f => f.id === id);
}

export function getFacilityByName(name) {
  return facilitiesData.find(f => f.name === name);
}


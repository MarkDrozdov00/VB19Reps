// src/lib/stores/facilities.ts
import { writable } from 'svelte/store';
import { base } from '$app/paths';

// ---------- types ----------
export type FacilityName = 'CLUB_ROOM' | 'GAMES_ROOM' | 'BBQ_AREA';
export type DayStatus = 'free' | 'pending' | 'booked' | 'blackout';

export type Facility = {
  id: number | string;
  name: FacilityName;                 // API enum
  displayName: string;
  description?: string;
  maxDays: number;                    // Club: 2, Games/BBQ: 1
  requiresApproval: boolean;          // Club/Games true, BBQ false
  depositEur?: number | null;         // 200 for Club/Games, null for BBQ
  termsNote?: string | null;
  overnight?: boolean;                // if you ever need it in the calendar note
  images?: { url: string; alt?: string }[];
  slug?: string; key?: string;
};

// ---------- helpers ----------
function withBase(url?: string) {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;      // leave external/absolute/data/blob alone
  if (url.startsWith(base + '/')) return url;               // avoid double prefixing
  if (url.startsWith('/')) return `${base}${url}`;
  return `${base}/${url}`;
}

// ---------- data ----------
export const facilitiesData: Facility[] = [
  {
    id: 1,
    name: 'CLUB_ROOM',
    displayName: 'Club Room',
    description:
      'Perfect for birthdays and celebrations, the Club Room features a bar, music system, and plenty of space for parties with friends.',
    maxDays: 2,
    requiresApproval: true,
    depositEur: 200,
    termsNote:
      'A €200 deposit is required when picking up the key. Terms of Use contract must be signed at key pickup.',
    images: [{ url: withBase('/club-room.jpg'), alt: 'Club Room - Main Area' }]
  },
  {
    id: 2,
    name: 'GAMES_ROOM',
    displayName: 'Games Room',
    description:
      'Entertainment hub with gaming consoles, board games, a pool table, and more — perfect for relaxation and fun with friends.',
    maxDays: 1,
    requiresApproval: true,
    depositEur: 200,
    termsNote:
      'A €200 deposit is required when picking up the key. Terms of Use contract must be signed at key pickup.',
    images: [{ url: withBase('/games-room.jpg'), alt: 'Games Room - Gaming Setup' }]
  },
  {
    id: 3,
    name: 'BBQ_AREA',
    displayName: 'BBQ Area',
    description:
      'Outdoor barbecue area with grill, seating, and dining space. Ideal for outdoor cooking and social gatherings.',
    maxDays: 1,
    requiresApproval: false,
    depositEur: null,
    termsNote: null,
    images: [{ url: withBase('/bbq-area.jpg'), alt: 'BBQ Area - Grilling Space' }]
  }
];

// ---------- stores ----------
export const facilities = writable<Facility[]>(facilitiesData);
export const selectedFacility = writable<Facility | null>(null);

// Availability that the calendar/booking will read.
// Initialize empty; the calendar will load live data from the API.
export type AvailabilityDay = { date: string; status: DayStatus };
export const availability = writable<{ days: AvailabilityDay[] }>({ days: [] });

export const selectedDates = writable<{ start: Date | null; end: Date | null }>({
  start: null,
  end: null
});

// ---------- helpers ----------
export function getFacilityById(id: Facility['id']) {
  return facilitiesData.find((f) => f.id === id) ?? null;
}
export function getFacilityByName(name: FacilityName) {
  return facilitiesData.find((f) => f.name === name) ?? null;
}

import { w as writable } from "./index.js";
const facilitiesData = [
  {
    id: 1,
    name: "CLUB_ROOM",
    displayName: "Club Room",
    description: "Spacious room perfect for meetings, events, and social gatherings. Features comfortable seating, presentation equipment, and a welcoming atmosphere.",
    maxDays: 2,
    requiresApproval: true,
    depositEur: 200,
    termsNote: "A €200 deposit is required when picking up the key. Terms of Use contract must be signed at key pickup.",
    images: [
      { url: "/images/club1.jpg", alt: "Club Room - Main Area" },
      { url: "/images/club2.jpg", alt: "Club Room - Seating Area" }
    ]
  },
  {
    id: 2,
    name: "GAMES_ROOM",
    displayName: "Games Room",
    description: "Entertainment hub with gaming consoles, board games, and recreational equipment. Perfect for relaxation and fun with friends.",
    maxDays: 1,
    requiresApproval: true,
    depositEur: 200,
    termsNote: "A €200 deposit is required when picking up the key. Terms of Use contract must be signed at key pickup.",
    images: [
      { url: "/images/games1.jpg", alt: "Games Room - Gaming Setup" },
      { url: "/images/games2.jpg", alt: "Games Room - Board Games Area" }
    ]
  },
  {
    id: 3,
    name: "BBQ_AREA",
    displayName: "BBQ Area",
    description: "Outdoor barbecue area with grills, seating, and dining space. Ideal for outdoor cooking and social gatherings.",
    maxDays: 1,
    requiresApproval: false,
    depositEur: null,
    termsNote: null,
    images: [
      { url: "/images/bbq1.jpg", alt: "BBQ Area - Grilling Space" },
      { url: "/images/bbq2.jpg", alt: "BBQ Area - Dining Area" }
    ]
  }
];
const selectedFacility = writable(facilitiesData[0]);
export {
  facilitiesData as f,
  selectedFacility as s
};

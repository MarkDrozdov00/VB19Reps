export interface Event {
  id: number;
  poster: string;
  title: string;
  shortDescription: string;
  date?: string;
  location?: string;
  upcoming: boolean;
}

export const events: Event[] = [
  {
    id: 1,
    poster: "/posters/1.jpg",
    title: "Beach Night",
    shortDescription: "Tropical decorations, summer beats, and beach-themed fun to wrap up the semester.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 2,
    poster: "/posters/2.jpg",
    title: "Games Night",
    shortDescription: "Cards, board games, pool, and friendly competition in a relaxed social atmosphere.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 3,
    poster: "/posters/3.jpg",
    title: "90s Opening Party",
    shortDescription: "Travel back to the 90s with retro music, colorful outfits, and nostalgic games.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 4,
    poster: "/posters/4.jpg",
    title: "Halloween Fright Night",
    shortDescription: "Costumes, spooky decorations, music, and Halloween-themed activities at the Club Room.",
    location: "Club Room",
    upcoming: false
  },
  {
    id: 5,
    poster: "/posters/5.jpg",
    title: "Gluhwein Booth",
    shortDescription: "Warm drinks, winter atmosphere, and festive conversations to celebrate the holiday season together.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 6,
    poster: "/posters/6.jpg",
    title: "Semester Closing Party",
    shortDescription: "Celebrate the end of the semester with costumes, music, and one final night together before the break.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 7,
    poster: "/posters/7.jpg",
    title: "Semester Opening",
    shortDescription: "Kick off the new semester by meeting fellow residents, making friends, and enjoying a fun evening together.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 8,
    poster: "/posters/8.jpg",
    title: "Flea Market",
    shortDescription: "Residents sold, swapped, and discovered hidden treasures while enjoying a relaxed afternoon together.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 9,
    poster: "/posters/9.jpg",
    title: "BBQ Together",
    shortDescription: "An afternoon of grilled food, good conversations, and community in the ViennaBase19 garden.",
    location: "ViennaBase19 Garden",
    upcoming: false
  },
  {
    id: 10,
    poster: "/posters/10.jpg",
    title: "Volleyball Tournament",
    shortDescription: "A friendly outdoor volleyball tournament bringing residents together for some healthy competition.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 11,
    poster: "/posters/11.jpg",
    title: "Latino Night",
    shortDescription: "An evening of Latin music, dancing, and summer vibes to celebrate the end of the semester.",
    location: "ViennaBase19",
    upcoming: false
  }
];

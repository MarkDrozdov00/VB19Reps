import { existsSync, readFileSync } from 'node:fs';

function loadEnvFile(path) {
  if (!existsSync(path)) return;

  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const rawValue = trimmed.slice(eqIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.DB_SERVICE_ROLE;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    [
      'Missing Supabase credentials.',
      'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your shell, .env, or .env.local before running this script.',
      'Example:',
      '  SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_ROLE_KEY=... npm run seed:events'
    ].join('\n')
  );
  process.exit(1);
}

// Approximate archive dates. Edit these dates if exact event dates become available.
const events = [
  {
    poster_url: '/posters/1.webp',
    title: 'Beach Night',
    event_date: '2025-06-21',
    description: 'A tropical end-of-semester night with drum\'n\'bass, beach vibes, and summer energy in the Club Room.'
  },
  {
    poster_url: '/posters/2.webp',
    title: 'Games Night',
    event_date: '2025-09-19',
    description: 'A relaxed evening of cards, dice, pool, and friendly competition in the Games Room.'
  },
  {
    poster_url: '/posters/3.webp',
    title: '90s Opening Party',
    event_date: '2025-10-03',
    description: 'Kick off the semester with 90s music, nostalgic outfits, games, and a free welcome shot.'
  },
  {
    poster_url: '/posters/4.webp',
    title: 'Halloween Fright Night',
    event_date: '2025-10-31',
    description: 'A Halloween celebration with costumes, spooky decorations, music, and hauntingly good vibes.'
  },
  {
    poster_url: '/posters/5.webp',
    title: 'Glühwein Booth',
    event_date: '2025-12-13',
    description: 'A cozy winter gathering in the garden with Glühwein, festive atmosphere, and good conversations.'
  },
  {
    poster_url: '/posters/6.webp',
    title: 'Semester Closing Party',
    event_date: '2026-01-31',
    description: 'Celebrate the end of the semester with costumes, music, and one final night together before the break.'
  },
  {
    poster_url: '/posters/7.webp',
    title: 'Semester Opening',
    event_date: '2026-03-20',
    description: 'A space-themed semester opening event welcoming residents into the new semester.'
  },
  {
    poster_url: '/posters/8.webp',
    title: 'Flea Market',
    event_date: '2026-05-03',
    description: 'Declutter, discover hidden gems, sell your items, and meet fellow residents at our community flea market.'
  },
  {
    poster_url: '/posters/9.webp',
    title: 'BBQ Together',
    event_date: '2026-05-23',
    description: 'A relaxed community BBQ in the ViennaBase19 garden with food, drinks, and great company.'
  },
  {
    poster_url: '/posters/10.webp',
    title: 'Volleyball Tournament',
    event_date: '2026-06-07',
    description: 'A friendly volleyball tournament bringing residents together for an afternoon of sport, teamwork, and fun.'
  },
  {
    poster_url: '/posters/11.webp',
    title: 'Latino Night',
    event_date: '2026-06-27',
    description: 'A vibrant evening of Latin music, dancing, and summer vibes to celebrate together at ViennaBase19.'
  }
];

const endpoint = new URL('/rest/v1/events', SUPABASE_URL);
endpoint.searchParams.set('on_conflict', 'poster_url');

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=representation'
  },
  body: JSON.stringify(events)
});

const payload = await response.json().catch(() => null);

if (!response.ok) {
  console.error('Failed to seed events.');
  if (payload?.code === 'PGRST205') {
    console.error(
      [
        'The public.events table does not exist in Supabase yet.',
        'Apply the events migrations first, then run npm run seed:events again:',
        '  supabase/migrations/20260708120000_events_management.sql',
        '  supabase/migrations/20260708123000_events_poster_url_unique.sql'
      ].join('\n')
    );
  }
  if (payload?.code === '42501') {
    console.error(
      [
        'The service_role does not have permission to write to public.events yet.',
        'Apply this grant migration, then run npm run seed:events again:',
        '  supabase/migrations/20260708124500_events_service_role_grants.sql'
      ].join('\n')
    );
  }
  console.error(payload ?? `${response.status} ${response.statusText}`);
  process.exit(1);
}

console.log(`Seeded ${Array.isArray(payload) ? payload.length : events.length} event archive rows.`);

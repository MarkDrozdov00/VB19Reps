Readme

## Seed Existing Event Posters

The existing poster archive in `static/posters/` can be imported into the Supabase `events` table with:

```bash
npm run seed:events
```

The script automatically reads `.env` and `.env.local`. You can also pass credentials inline:

```bash
SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
npm run seed:events
```

`SUPABASE_URL` is your Supabase project URL.

`SUPABASE_SERVICE_ROLE_KEY` is the service role key from Supabase project settings. Keep it private and do not expose it in frontend code.

The seed data lives in `scripts/seed-events.js`. The script upserts by `poster_url`, so running it multiple times updates the same rows instead of creating duplicates.

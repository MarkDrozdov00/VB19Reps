alter table public.reservations
  add column if not exists source text not null default 'public',
  add column if not exists type text not null default 'booking',
  add column if not exists admin_note text;

alter table public.blackouts
  add column if not exists source text not null default 'admin',
  add column if not exists type text not null default 'disabled',
  add column if not exists admin_note text;

create index if not exists reservations_admin_calendar_idx
  on public.reservations (facility_id, start_date, end_date, status);

create index if not exists blackouts_admin_calendar_idx
  on public.blackouts (facility_id, start_date, end_date);

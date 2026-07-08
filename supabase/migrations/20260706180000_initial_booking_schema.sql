create extension if not exists pgcrypto;

create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  display_name text not null,
  description text,
  max_days integer not null default 1,
  requires_approval boolean not null default true,
  deposit_amount integer default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  room_number text not null,
  resident_name text not null,
  resident_email text not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table if not exists public.blackouts (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists reservations_facility_dates_idx
  on public.reservations (facility_id, start_date, end_date);

create index if not exists reservations_status_idx
  on public.reservations (status);

create index if not exists blackouts_facility_dates_idx
  on public.blackouts (facility_id, start_date, end_date);

insert into public.facilities (
  name,
  display_name,
  max_days,
  requires_approval,
  deposit_amount
) values
  ('CLUB_ROOM', 'Club Room', 2, true, 200),
  ('GAMES_ROOM', 'Games Room', 1, true, 0),
  ('BBQ_AREA', 'BBQ Area', 1, false, 0)
on conflict (name) do nothing;

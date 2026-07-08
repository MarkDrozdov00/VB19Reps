// src/lib/api.ts

import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
} from '$env/static/public';

if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY. Check your .env file."
  );
}

const BASE_URL = `${PUBLIC_SUPABASE_URL}/functions/v1`;

function functionHeaders(authToken = PUBLIC_SUPABASE_ANON_KEY) {
  return {
    Authorization: `Bearer ${authToken}`,
    apikey: PUBLIC_SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  };
}

function functionAuthHeaders(authToken = PUBLIC_SUPABASE_ANON_KEY) {
  return {
    Authorization: `Bearer ${authToken}`,
    apikey: PUBLIC_SUPABASE_ANON_KEY,
  };
}

// --- helper: turn inclusive UI end-date into exclusive API end-date
export function exclusiveEnd(endDate: string): string {
  const d = new Date(endDate);
  d.setDate(d.getDate() + 1); // move forward 1 day
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

type ReservationPayload = {
  facilityName: "CLUB_ROOM" | "GAMES_ROOM" | "BBQ_AREA";
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD (exclusive!)
  roomNumber: string;
  name: string;
  email: string;
};

type ReservationResponse = {
  id: number;
  status: "CONFIRMED" | "PENDING";
};

export async function createReservation(
  payload: ReservationPayload
): Promise<ReservationResponse> {
  const res = await fetch(`${BASE_URL}/create-reservation`, {
    method: "POST",
    headers: functionHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { error: "UNKNOWN_ERROR" };
    }
    throw err;
  }
  return res.json();
}

type AvailabilityDay = { date: string; status: "free" | "pending" | "booked" | "blackout" };

export async function getAvailability(
  facilityName: string,
  from: string,
  to: string
): Promise<AvailabilityDay[]> {
  const url = new URL(`${BASE_URL}/availability`);
  url.searchParams.set("facilityName", facilityName);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  const res = await fetch(url.toString(), {
    headers: functionHeaders(),
  });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.days as AvailabilityDay[];
}

export type AdminCalendarItem = {
  id: string;
  facilityName: "CLUB_ROOM" | "GAMES_ROOM";
  facilityDisplayName: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "CONFIRMED" | "DISABLED" | string;
  type: "booking" | "disabled";
  source?: string;
  roomNumber?: string;
  residentName?: string;
  residentEmail?: string;
  adminNote?: string;
};

export type AdminActionPayload = {
  facilityName: "CLUB_ROOM" | "GAMES_ROOM";
  startDate: string;
  endDate: string;
  action: "book" | "disable";
  residentName?: string;
  residentEmail?: string;
  roomNumber?: string;
  adminNote?: string;
};

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/admin-auth`, {
    method: "POST",
    headers: functionHeaders(),
    body: JSON.stringify({ password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) throw data || { error: "AUTH_FAILED" };
  return data.token as string;
}

export async function getAdminCalendar(
  token: string,
  from: string,
  to: string
): Promise<AdminCalendarItem[]> {
  const url = new URL(`${BASE_URL}/admin-reservations`);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  const res = await fetch(url.toString(), {
    headers: functionHeaders(token),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data || { error: "ADMIN_CALENDAR_FAILED" };
  return data.items as AdminCalendarItem[];
}

export async function createAdminCalendarEntry(
  token: string,
  payload: AdminActionPayload
): Promise<{ success: true; id?: string }> {
  const res = await fetch(`${BASE_URL}/admin-reservations`, {
    method: "POST",
    headers: functionHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data || { error: "ADMIN_ACTION_FAILED" };
  return data;
}

export async function deleteAdminCalendarEntry(
  token: string,
  payload: { id: string; type: "booking" | "disabled" }
): Promise<{ success: true }> {
  const res = await fetch(`${BASE_URL}/admin-reservations`, {
    method: "DELETE",
    headers: functionHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data || { error: "ADMIN_DELETE_FAILED" };
  return data;
}

export type EventItem = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  posterUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

type EventRow = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  poster_url: string;
  created_at?: string;
  updated_at?: string;
};

function mapEvent(row: EventRow): EventItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    eventDate: row.event_date,
    posterUrl: row.poster_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getEvents(): Promise<EventItem[]> {
  const res = await fetch(`${BASE_URL}/admin-events`, {
    headers: functionHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data || { error: "EVENTS_FAILED" };
  return ((data.events ?? []) as EventRow[]).map(mapEvent);
}

export async function createAdminEvent(
  token: string,
  payload: {
    title: string;
    description: string;
    eventDate: string;
    poster: File;
  }
): Promise<{ success: true; event: EventItem }> {
  const body = new FormData();
  body.set("title", payload.title);
  body.set("description", payload.description);
  body.set("eventDate", payload.eventDate);
  body.set("poster", payload.poster);

  const res = await fetch(`${BASE_URL}/admin-events`, {
    method: "POST",
    headers: functionAuthHeaders(token),
    body,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data || { error: "EVENT_CREATE_FAILED" };
  return { success: true, event: mapEvent(data.event as EventRow) };
}

export async function deleteAdminEvent(
  token: string,
  id: string
): Promise<{ success: true }> {
  const url = new URL(`${BASE_URL}/admin-events`);
  url.searchParams.set("id", id);

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: functionHeaders(token),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data || { error: "EVENT_DELETE_FAILED" };
  return data;
}

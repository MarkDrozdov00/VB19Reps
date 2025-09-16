// src/lib/api.ts

const BASE_URL = "https://ewibwyoytreosqqaaakf.supabase.co/functions/v1";

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
    headers: { "Content-Type": "application/json" },
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

  const res = await fetch(url.toString());
  if (!res.ok) throw await res.json();
  const data = await res.json();
  return data.days as AvailabilityDay[];
}

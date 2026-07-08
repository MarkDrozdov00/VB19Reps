import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminToken } from "../_shared/admin-auth.ts";

const SUPABASE_URL = Deno.env.get("DB_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("DB_SERVICE_ROLE")!;
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

const ADMIN_FACILITIES = new Set(["CLUB_ROOM", "GAMES_ROOM"]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function exclusiveEnd(inclusiveEnd: string) {
  const d = new Date(inclusiveEnd + "T00:00:00");
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function displayName(name: string) {
  if (name === "CLUB_ROOM") return "Club Room";
  if (name === "GAMES_ROOM") return "Games Room";
  return name;
}

function validDate(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function facilityMap() {
  const { data, error } = await sb
    .from("facilities")
    .select("id, name")
    .in("name", ["CLUB_ROOM", "GAMES_ROOM"]);

  if (error) throw error;

  const byId = new Map<number | string, string>();
  const byName = new Map<string, number | string>();
  for (const facility of data ?? []) {
    byId.set(facility.id, facility.name);
    byName.set(facility.name, facility.id);
  }
  return { byId, byName };
}

async function listAdminCalendar(req: Request) {
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (!validDate(from) || !validDate(to)) {
    return json({ error: "BAD_INPUT" }, 400);
  }

  const { byId } = await facilityMap();
  const facilityIds = Array.from(byId.keys());

  const { data: reservations, error: resErr } = await sb
    .from("reservations")
    .select("id, facility_id, start_date, end_date, status, room_number, resident_name, resident_email, source, type, admin_note")
    .in("facility_id", facilityIds)
    .or("status.eq.PENDING,status.eq.CONFIRMED")
    .lt("start_date", to)
    .gt("end_date", from)
    .order("start_date", { ascending: true });

  if (resErr) {
    console.error("admin reservations query error", resErr);
    return json({ error: "RESERVATIONS_QUERY_FAILED" }, 500);
  }

  const { data: blackouts, error: blackoutErr } = await sb
    .from("blackouts")
    .select("id, facility_id, start_date, end_date, source, type, admin_note")
    .in("facility_id", facilityIds)
    .lt("start_date", to)
    .gt("end_date", from)
    .order("start_date", { ascending: true });

  if (blackoutErr) {
    console.error("admin blackouts query error", blackoutErr);
    return json({ error: "BLACKOUTS_QUERY_FAILED" }, 500);
  }

  const reservationItems = (reservations ?? []).map((row) => {
    const facilityName = byId.get(row.facility_id) ?? "UNKNOWN";
    return {
      id: `reservation:${row.id}`,
      facilityName,
      facilityDisplayName: displayName(facilityName),
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      type: "booking",
      source: row.source,
      roomNumber: row.room_number,
      residentName: row.resident_name,
      residentEmail: row.resident_email,
      adminNote: row.admin_note
    };
  });

  const blackoutItems = (blackouts ?? []).map((row) => {
    const facilityName = byId.get(row.facility_id) ?? "UNKNOWN";
    return {
      id: `blackout:${row.id}`,
      facilityName,
      facilityDisplayName: displayName(facilityName),
      startDate: row.start_date,
      endDate: row.end_date,
      status: "DISABLED",
      type: "disabled",
      source: row.source,
      roomNumber: "",
      residentName: "",
      residentEmail: "",
      adminNote: row.admin_note
    };
  });

  return json({ items: [...reservationItems, ...blackoutItems] }, 200);
}

async function createAdminEntry(req: Request) {
  const body = await req.json();
  const { facilityName, startDate, endDate, action, residentName, residentEmail, roomNumber, adminNote } = body;

  if (!ADMIN_FACILITIES.has(facilityName) || !validDate(startDate) || !validDate(endDate)) {
    return json({ error: "BAD_INPUT" }, 400);
  }

  const start = new Date(startDate + "T00:00:00");
  const endInclusive = new Date(endDate + "T00:00:00");
  if (endInclusive < start) return json({ error: "BAD_DATES" }, 400);

  const { byName } = await facilityMap();
  const facilityId = byName.get(facilityName);
  if (!facilityId) return json({ error: "UNKNOWN_FACILITY" }, 400);

  const endExclusive = exclusiveEnd(endDate);

  if (action === "book") {
    if (!residentName?.trim() || !residentEmail?.trim() || !roomNumber?.trim()) {
      return json({ error: "MISSING_BOOKING_FIELDS" }, 400);
    }

    const { data, error } = await sb
      .from("reservations")
      .insert({
        facility_id: facilityId,
        start_date: startDate,
        end_date: endExclusive,
        room_number: roomNumber.trim(),
        resident_name: residentName.trim(),
        resident_email: residentEmail.trim(),
        status: "CONFIRMED",
        source: "admin",
        type: "booking",
        admin_note: adminNote?.trim() || null
      })
      .select("id")
      .single();

    if (error) {
      console.error("admin reservation insert error", error);
      return json({ error: "INSERT_FAILED" }, 500);
    }

    return json({ success: true, id: data.id }, 200);
  }

  if (action === "disable") {
    const { data, error } = await sb
      .from("blackouts")
      .insert({
        facility_id: facilityId,
        start_date: startDate,
        end_date: endExclusive,
        source: "admin",
        type: "disabled",
        admin_note: adminNote?.trim() || null
      })
      .select("id")
      .single();

    if (error) {
      console.error("admin blackout insert error", error);
      return json({ error: "INSERT_FAILED" }, 500);
    }

    return json({ success: true, id: data.id }, 200);
  }

  return json({ error: "BAD_ACTION" }, 400);
}

function rawId(id: string, type: "booking" | "disabled") {
  if (type === "booking") return id.replace(/^reservation:/, "");
  return id.replace(/^blackout:/, "");
}

async function deleteAdminEntry(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { id, type } = body;

  if (typeof id !== "string" || (type !== "booking" && type !== "disabled")) {
    return json({ error: "BAD_INPUT" }, 400);
  }

  const table = type === "booking" ? "reservations" : "blackouts";
  const idToDelete = rawId(id, type);

  const { error, count } = await sb
    .from(table)
    .delete({ count: "exact" })
    .eq("id", idToDelete);

  if (error) {
    console.error("admin delete error", { table, id: idToDelete, error });
    return json({ error: "DELETE_FAILED" }, 500);
  }

  if (count === 0) {
    return json({ error: "NOT_FOUND" }, 404);
  }

  return json({ success: true }, 200);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!(await verifyAdminToken(req))) {
      return json({ error: "UNAUTHORIZED" }, 401);
    }

    if (req.method === "GET") return await listAdminCalendar(req);
    if (req.method === "POST") return await createAdminEntry(req);
    if (req.method === "DELETE") return await deleteAdminEntry(req);

    return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  } catch (e) {
    console.error("admin reservations error", e);
    return json({ error: "SERVER" }, 500);
  }
});

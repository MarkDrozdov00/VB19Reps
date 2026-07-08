// supabase/functions/create-reservation/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("DB_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("DB_SERVICE_ROLE")!;
const TIMEZONE = Deno.env.get("TIMEZONE") || "Europe/Vienna";
const BASE_REPS_MAILER_URL = Deno.env.get("BASE_REPS_MAILER_URL") || "";

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sendBaseRepsReservationEmailsSafe(payload: {
  customerEmail: string;
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  reservationName: string;
}) {
  if (!BASE_REPS_MAILER_URL) {
    console.error("Base Reps email error: BASE_REPS_MAILER_URL is not configured");
    return;
  }

  try {
    const resp = await fetch(BASE_REPS_MAILER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const text = await resp.text();
    if (!resp.ok) {
      console.error("Base Reps email error:", resp.status, text);
    }
  } catch (e) {
    console.error("Base Reps email error:", e);
  }
}

function exclusiveEnd(inclusiveEnd: string) {
  const d = new Date(inclusiveEnd + "T00:00:00");
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function prettyFacility(name: string): string {
  switch (name) {
    case "CLUB_ROOM":  return "Club Room";
    case "GAMES_ROOM": return "Games Room";
    case "BBQ_AREA":   return "BBQ Area";
    default:           return name;
  }
}

function prettyDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TIMEZONE
  }).formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const year = parts.find((part) => part.type === "year")?.value;
  return `${day}-${month}-${year}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);

  try {
    const { facilityName, startDate, endDate, roomNumber, name, email } = await req.json();

    // 1) facility lookup by enum name
    const { data: fac, error: facErr } = await sb
      .from("facilities")
      .select("id, name, requires_approval, max_days")
      .eq("name", facilityName)
      .maybeSingle();

    if (facErr) {
      console.error("facilities lookup error:", facErr);
      return json({ error: "SERVER", detail: "FACILITY_QUERY_FAILED" }, 500);
    }
    if (!fac) {
      console.warn("facility not found for", facilityName);
      return json({ error: "UNKNOWN_FACILITY", facilityName }, 400);
    }

    const prettyName = prettyFacility(fac.name);

    // 2) range and policy checks
    const start = new Date(startDate + "T00:00:00");
    const endEx = new Date((endDate ?? exclusiveEnd(startDate)) + "T00:00:00");
    const diffDays = Math.ceil((+endEx - +start) / 86400000);
    if (diffDays < 1 || diffDays > (fac.max_days ?? 1)) {
      return json({ error: "TOO_LONG" }, 400);
    }

    // 3) conflict check (PENDING or CONFIRMED block)
    const { data: conflict, error: confErr } = await sb
      .from("reservations")
      .select("id")
      .eq("facility_id", fac.id)
      .or("status.eq.PENDING,status.eq.CONFIRMED")
      .lt("start_date", endEx.toISOString().slice(0, 10)) // start < endEx
      .gt("end_date", startDate)                           // end > start
      .maybeSingle();

    if (confErr) {
      console.error("conflict query error:", confErr);
      return json({ error: "SERVER", detail: "CONFLICT_QUERY_FAILED" }, 500);
    }
    if (conflict) {
      return json({ error: "UNAVAILABLE" }, 409);
    }

    const { data: blackout, error: blackoutErr } = await sb
      .from("blackouts")
      .select("id")
      .eq("facility_id", fac.id)
      .lt("start_date", endEx.toISOString().slice(0, 10))
      .gt("end_date", startDate)
      .maybeSingle();

    if (blackoutErr) {
      console.error("blackout query error:", blackoutErr);
      return json({ error: "SERVER", detail: "BLACKOUT_QUERY_FAILED" }, 500);
    }
    if (blackout) {
      return json({ error: "UNAVAILABLE_BLACKOUT" }, 409);
    }

    // 4) insert reservation
    const status: "PENDING" | "CONFIRMED" = fac.requires_approval ? "PENDING" : "CONFIRMED";
    const { data: ins, error: insErr } = await sb
    .from("reservations")
    .insert({
      facility_id: fac.id,
      start_date: startDate,
      end_date: endEx.toISOString().slice(0, 10),  // exclusive
      room_number: roomNumber,
      resident_name: name,                          // ✅ matches schema
      resident_email: email,                        // ✅ matches schema
      status,
      source: "public",
      type: "booking"
    })
    .select("id,status")
    .single();

  if (insErr) {
    console.error("insert error:", insErr); // <— will show in Function logs
    return json({ error: "SERVER", detail: "INSERT_FAILED", db: insErr }, 500); // TEMPORARY: expose error
  }


    // 5) emails (do not fail the request if emails fail)
    const prettyStart = prettyDate(start);
    const prettyEndInc = prettyDate(new Date(endEx.getTime() - 86400000));
    const prettyDates = diffDays === 1 ? prettyStart : `${prettyStart} - ${prettyEndInc}`;

    await sendBaseRepsReservationEmailsSafe({
      customerEmail: email,
      customerName: name,
      reservationDate: prettyDates,
      reservationTime: "All day",
      reservationName: prettyName
    });
    

    return json({ id: ins.id, status: ins.status }, 200);
  } catch (e) {
    console.error("unhandled error:", e);
    return json({ error: "SERVER" }, 500);
  }
});

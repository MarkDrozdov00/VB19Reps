// supabase/functions/availability/index.ts
// No external deps; plain Deno.serve

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("DB_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("DB_SERVICE_ROLE")!;
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// CORS allowlist (NO paths, NO trailing slashes)
const ALLOWED = new Set<string>([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://markdrozdov00.github.io"
]);

function corsHeaders(origin: string | null) {
  const h = new Headers({ "Vary": "Origin" });
  if (origin && ALLOWED.has(origin)) {
    h.set("Access-Control-Allow-Origin", origin);
    h.set("Access-Control-Allow-Credentials", "true");
  }
  h.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  h.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  return h;
}

// normalize to midnight local (then use ISO yyyy-mm-dd)
function atMidnightISO(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}
function asMidnightDate(isoYYYYMMDD: string) {
  const d = new Date(isoYYYYMMDD + "T00:00:00");
  d.setHours(0, 0, 0, 0);
  return d;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  const headers = corsHeaders(origin);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const url = new URL(req.url);
    const facilityName = url.searchParams.get("facilityName"); // 'CLUB_ROOM' | 'GAMES_ROOM' | 'BBQ_AREA'
    const from = url.searchParams.get("from");                  // YYYY-MM-DD inclusive
    const to   = url.searchParams.get("to");                    // YYYY-MM-DD exclusive

    if (!facilityName || !from || !to) {
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ error: "BAD_INPUT" }), { status: 400, headers });
    }

    // Resolve facility id
    const { data: fac, error: facErr } = await sb
      .from("facilities")
      .select("id")
      .eq("name", facilityName)
      .maybeSingle();

    if (facErr || !fac) {
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ error: "UNKNOWN_FACILITY" }), { status: 400, headers });
    }

    // Overlapping blackouts: start_date < to AND end_date > from
    const { data: blackoutRows, error: be } = await sb
      .from("blackouts")
      .select("start_date, end_date")
      .eq("facility_id", fac.id)
      .lt("start_date", to)
      .gt("end_date", from);

    if (be) {
      console.error("availability blackouts error", be);
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ error: "BLACKOUTS_QUERY_FAILED" }), { status: 500, headers });
    }

    // Overlapping reservations (PENDING + CONFIRMED)
    const { data: resRows, error: re } = await sb
      .from("reservations")
      .select("start_date, end_date, status")
      .eq("facility_id", fac.id)
      .or("status.eq.PENDING,status.eq.CONFIRMED")
      .lt("start_date", to)
      .gt("end_date", from);

    if (re) {
      console.error("availability reservations error", re);
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ error: "RESERVATIONS_QUERY_FAILED" }), { status: 500, headers });
    }

    const bRanges = (blackoutRows ?? []).map((r) => ({
      s: asMidnightDate(r.start_date),
      e: asMidnightDate(r.end_date),
    }));
    const rRanges = (resRows ?? []).map((r) => ({
      s: asMidnightDate(r.start_date),
      e: asMidnightDate(r.end_date),
      st: r.status as "PENDING" | "CONFIRMED" | string,
    }));

    const start = asMidnightDate(from);
    const endEx = asMidnightDate(to);
    const days: Array<{ date: string; status: "free" | "pending" | "booked" | "blackout" }> = [];

    for (let d = new Date(start); d < endEx; d.setDate(d.getDate() + 1)) {
      const iso = atMidnightISO(d);

      const isBlackout = bRanges.some((r) => r.s <= d && d < r.e);

      let status: "free" | "pending" | "booked" | "blackout" = "free";
      if (isBlackout) {
        status = "blackout";
      } else {
        const anyBooked  = rRanges.some((r) => r.st === "CONFIRMED" && r.s <= d && d < r.e);
        const anyPending = rRanges.some((r) => r.st === "PENDING"   && r.s <= d && d < r.e);
        if (anyBooked) status = "booked";
        else if (anyPending) status = "pending";
      }

      days.push({ date: iso, status });
    }

    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ days }), {
      status: 200,
      headers, // pass the Headers object directly
    });
  } catch (e) {
    console.error("availability server error", e);
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ error: "SERVER" }), { status: 500, headers });
  }
});

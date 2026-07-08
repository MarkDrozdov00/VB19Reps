// supabase/functions/availability/index.ts
// No external deps; plain Deno.serve

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("DB_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("DB_SERVICE_ROLE")!;
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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const facilityName = url.searchParams.get("facilityName"); // 'CLUB_ROOM' | 'GAMES_ROOM' | 'BBQ_AREA'
    const from = url.searchParams.get("from");                  // YYYY-MM-DD inclusive
    const to   = url.searchParams.get("to");                    // YYYY-MM-DD exclusive
    console.log("availability received facilityName", facilityName);

    if (!facilityName || !from || !to) {
      return json({ error: "BAD_INPUT" }, 400);
    }

    // Resolve facility id
    const { data: fac, error: facErr } = await sb
      .from("facilities")
      .select("id")
      .eq("name", facilityName)
      .maybeSingle();
    console.log("availability facility query result", fac);
    console.error("availability facility query error", facErr);

    if (facErr || !fac) {
      return json({
        error: "UNKNOWN_FACILITY",
        requestedFacility: facilityName,
        queryError: facErr,
        queryResult: fac,
      }, 400);
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
      return json({ error: "BLACKOUTS_QUERY_FAILED" }, 500);
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
      return json({ error: "RESERVATIONS_QUERY_FAILED" }, 500);
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

    return json({ days }, 200);
  } catch (e) {
    console.error("availability server error", e);
    return json({ error: "SERVER" }, 500);
  }
});

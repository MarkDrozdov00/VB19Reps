// supabase/functions/create-reservation/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@3";

const SUPABASE_URL = Deno.env.get("DB_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("DB_SERVICE_ROLE")!;
const REPS_EMAIL = Deno.env.get("REPS_EMAIL")!;
const TIMEZONE = Deno.env.get("TIMEZONE") || "Europe/Vienna";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_SENDER =
  Deno.env.get("FROM_SENDER") || "VB19 Bookings <onboarding@resend.dev>";

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
const resend = new Resend(RESEND_API_KEY);


async function sendEmailSafe(tag: string, msg: any) {
  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ from: FROM_SENDER, ...msg })
    });
    const text = await resp.text();
    if (!resp.ok) {
      console.error(`email ${tag} FAIL`, resp.status, text);
    } else {
      console.log(`email ${tag} OK`, text);
    }
  } catch (e) {
    console.error(`email ${tag} EXCEPTION`, e);
  }
}

function corsHeaders(origin: string | null) {
  const h = new Headers();
  h.set("Vary", "Origin");
  h.set("Access-Control-Allow-Origin", origin ?? "*");
  h.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  return h;
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

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST")   return new Response("Method Not Allowed", { status: 405, headers });

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
      return new Response(JSON.stringify({ error: "SERVER", detail: "FACILITY_QUERY_FAILED" }), { status: 500, headers });
    }
    if (!fac) {
      console.warn("facility not found for", facilityName);
      return new Response(JSON.stringify({ error: "UNKNOWN_FACILITY", facilityName }), { status: 400, headers });
    }

    const prettyName = prettyFacility(fac.name);

    // 2) range and policy checks
    const start = new Date(startDate + "T00:00:00");
    const endEx = new Date((endDate ?? exclusiveEnd(startDate)) + "T00:00:00");
    const diffDays = Math.ceil((+endEx - +start) / 86400000);
    if (diffDays < 1 || diffDays > (fac.max_days ?? 1)) {
      return new Response(JSON.stringify({ error: "TOO_LONG" }), { status: 400, headers });
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
      return new Response(JSON.stringify({ error: "SERVER", detail: "CONFLICT_QUERY_FAILED" }), { status: 500, headers });
    }
    if (conflict) {
      return new Response(JSON.stringify({ error: "UNAVAILABLE" }), { status: 409, headers });
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
      source: "PUBLIC_FORM"                         // optional, matches your non-null default anyway
    })
    .select("id,status")
    .single();

  if (insErr) {
    console.error("insert error:", insErr); // <— will show in Function logs
    return new Response(
      JSON.stringify({ error: "SERVER", detail: "INSERT_FAILED", db: insErr }), // TEMPORARY: expose error
      { status: 500, headers }
    );
  }


    // 5) emails (do not fail the request if emails fail)
    const prettyStart = start.toLocaleDateString("en-GB", { timeZone: TIMEZONE });
    const prettyEndInc = new Date(endEx.getTime() - 86400000).toLocaleDateString("en-GB", { timeZone: TIMEZONE });
    const prettyDates = diffDays === 1 ? prettyStart : `${prettyStart} – ${prettyEndInc}`;

    // resident
    // try {
    //   await resend.emails.send({
    //     from: FROM_SENDER, // must be verified in Resend
    //     to: email,
    //     subject: status === "CONFIRMED"
    //       ? `Your ${prettyName} booking is confirmed`
    //       : `We received your ${prettyName} request`,
    //     html:
    //       status === "CONFIRMED"
    //         ? `<p>Hi ${name},</p><p>Your booking for <b>${prettyName}</b> on <b>${prettyDates}</b> is confirmed.</p>`
    //         : `<p>Hi ${name},</p><p>We received your request for <b>${prettyName}</b> on <b>${prettyDates}</b>. A representative will contact you for key pickup. €200 deposit applies.</p>`
    //   });
    // } catch (e) {
    //   console.error("resend resident email error:", e);
    // }
    await sendEmailSafe("resident", {
      to: email,
      subject: status === "CONFIRMED"
          ? `Your ${prettyName} booking is pending`
          : `We received your ${prettyName} request`,
        html:
          status === "CONFIRMED"
            ? `<p>Hi ${name},</p><p>Your booking for <b>${prettyName}</b> on <b>${prettyDates}</b> is confirmed.</p>`
            : `<p>Hi ${name},</p><p>We received your request for <b>${prettyName}</b> on <b>${prettyDates}</b>. A representative will contact you for key pickup. €200 deposit applies.</p>`
    });
    

    // reps (only for approvals)
    // if (status === "PENDING") {
    //   try {
    //     await resend.emails.send({
    //       from: FROM_SENDER,
    //       to: REPS_EMAIL,
    //       subject: `[VB19] New ${prettyName} request — ${prettyDates}`,
    //       html: `
    //         <p>New request for <b>${prettyName}</b>.</p>
    //         <ul>
    //           <li>Dates: <b>${prettyDates}</b></li>
    //           <li>Name: ${name}</li>
    //           <li>Room: ${roomNumber}</li>
    //           <li>Email: ${email}</li>
    //         </ul>
    //         <p>Reply to the resident and arrange key pickup. Approve/decline in Supabase.</p>`
    //     });
    //   } catch (e) {
    //     console.error("resend reps email error:", e);
    //   }
    // }
    await sendEmailSafe("reps", {
      to: REPS_EMAIL,
      subject: `[VB19] New ${prettyName} request — ${prettyDates}`,
          html: `
            <p>New request for <b>${prettyName}</b>.</p>
            <ul>
              <li>Dates: <b>${prettyDates}</b></li>
              <li>Name: ${name}</li>
              <li>Room: ${roomNumber}</li>
              <li>Email: ${email}</li>
            </ul>
            <p>Reply to the resident and arrange key pickup. Approve/decline in Supabase.</p>`
        });
    

    return new Response(JSON.stringify({ id: ins.id, status: ins.status }), { status: 200, headers });
  } catch (e) {
    console.error("unhandled error:", e);
    return new Response(JSON.stringify({ error: "SERVER" }), { status: 500, headers });
  }
});

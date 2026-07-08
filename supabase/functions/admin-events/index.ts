import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyAdminTokenDetailed } from "../_shared/admin-auth.ts";

const SUPABASE_URL = Deno.env.get("DB_URL")!;
const SUPABASE_SERVICE_ROLE = Deno.env.get("DB_SERVICE_ROLE")!;
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
const BUCKET = "event-posters";

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

function validDate(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "poster";
}

async function listEvents() {
  const { data, error } = await sb
    .from("events")
    .select("id, title, description, event_date, poster_url, created_at, updated_at")
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("events list error", error);
    return json({ error: "EVENTS_QUERY_FAILED" }, 500);
  }

  return json({ events: data ?? [] }, 200);
}

async function createEvent(req: Request) {
  const form = await req.formData();
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const eventDate = String(form.get("eventDate") ?? "").trim();
  const poster = form.get("poster");

  if (!title || !description || !validDate(eventDate) || !(poster instanceof File)) {
    return json({ error: "BAD_INPUT" }, 400);
  }

  if (!poster.type.startsWith("image/")) {
    return json({ error: "POSTER_MUST_BE_IMAGE" }, 400);
  }

  const extension = poster.name.includes(".") ? poster.name.split(".").pop() : "jpg";
  const path = `${eventDate}/${crypto.randomUUID()}-${sanitizeFileName(title)}.${extension}`;

  const { error: uploadError } = await sb.storage
    .from(BUCKET)
    .upload(path, poster, {
      contentType: poster.type || "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    console.error("event poster upload error", uploadError);
    return json({ error: "POSTER_UPLOAD_FAILED" }, 500);
  }

  const { data: publicUrlData } = sb.storage.from(BUCKET).getPublicUrl(path);
  const posterUrl = publicUrlData.publicUrl;

  const { data, error } = await sb
    .from("events")
    .insert({
      title,
      description,
      event_date: eventDate,
      poster_url: posterUrl,
    })
    .select("id, title, description, event_date, poster_url, created_at, updated_at")
    .single();

  if (error) {
    console.error("event insert error", error);
    await sb.storage.from(BUCKET).remove([path]);
    return json({ error: "INSERT_FAILED" }, 500);
  }

  return json({ success: true, event: data }, 200);
}

async function deleteEvent(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "BAD_INPUT" }, 400);

  const { error } = await sb.from("events").delete().eq("id", id);
  if (error) {
    console.error("event delete error", error);
    return json({ error: "DELETE_FAILED" }, 500);
  }

  return json({ success: true }, 200);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method === "GET") return await listEvents();

    const authResult = await verifyAdminTokenDetailed(req);
    if (!authResult.ok) {
      console.warn("admin-events auth failed", {
        reason: authResult.reason,
        hasAuthorizationHeader: Boolean(req.headers.get("Authorization")),
      });
      return json({ error: "UNAUTHORIZED", reason: authResult.reason }, 401);
    }

    if (req.method === "POST") return await createEvent(req);
    if (req.method === "DELETE") return await deleteEvent(req);

    return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  } catch (e) {
    console.error("admin events error", e);
    return json({ error: "SERVER" }, 500);
  }
});

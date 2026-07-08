import { createAdminToken } from "../_shared/admin-auth.ts";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  }

  try {
    const { password } = await req.json();
    const expected = Deno.env.get("ADMIN_PASSWORD");

    if (!expected) {
      console.error("ADMIN_PASSWORD is not configured");
      return json({ error: "SERVER" }, 500);
    }

    if (typeof password !== "string" || password !== expected) {
      return json({ error: "INVALID_PASSWORD" }, 401);
    }

    const token = await createAdminToken();
    return json({ token }, 200);
  } catch (e) {
    console.error("admin auth error", e);
    return json({ error: "SERVER" }, 500);
  }
});

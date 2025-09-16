export function corsHeaders(origin = "*") {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
  }
  export function handleOptions(request: Request, origin = "*") {
    if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
    return null;
  }
  
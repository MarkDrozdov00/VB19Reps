const encoder = new TextEncoder();
const SESSION_MS = 8 * 60 * 60 * 1000;

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(
    Math.ceil(value.length / 4) * 4,
    "="
  );
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(message: string, secret: string) {
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return base64Url(new Uint8Array(signature));
}

export async function createAdminToken() {
  const secret = Deno.env.get("ADMIN_PASSWORD");
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured");

  const expiresAt = Date.now() + SESSION_MS;
  const message = String(expiresAt);
  const signature = await sign(message, secret);
  return `${message}.${signature}`;
}

export async function verifyAdminToken(req: Request) {
  const result = await verifyAdminTokenDetailed(req);
  return result.ok;
}

export async function verifyAdminTokenDetailed(req: Request): Promise<
  | { ok: true; reason: "valid" }
  | { ok: false; reason: string }
> {
  const secret = Deno.env.get("ADMIN_PASSWORD");
  if (!secret) return { ok: false, reason: "ADMIN_PASSWORD is not configured" };

  const auth = req.headers.get("Authorization");
  if (!auth) return { ok: false, reason: "missing Authorization header" };
  if (!auth.startsWith("Bearer ")) return { ok: false, reason: "Authorization header is not Bearer token" };

  const token = auth.slice(7);
  if (!token) return { ok: false, reason: "missing bearer token" };

  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!expiresAt || !signature) return { ok: false, reason: "malformed admin token" };
  if (expiresAt < Date.now()) return { ok: false, reason: "expired admin token" };

  const key = await hmacKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(signature),
    encoder.encode(expiresAtRaw)
  );

  if (!valid) return { ok: false, reason: "invalid admin token signature" };
  return { ok: true, reason: "valid" };
}

export function adminCorsHeaders(origin: string | null, methods = "GET,POST,OPTIONS") {
  const h = new Headers();
  h.set("Vary", "Origin");
  h.set("Access-Control-Allow-Origin", origin ?? "*");
  h.set("Access-Control-Allow-Methods", methods);
  h.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  return h;
}

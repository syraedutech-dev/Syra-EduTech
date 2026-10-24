import { getStore } from "@netlify/blobs";
import { platformKind } from "@/lib/platform";
import { ADMIN_EMAIL, SESSION_COOKIE, createSession, loginConfigured, verifyPassword } from "../../../../lib/admin-session";
import { sameOrigin } from "../../../../lib/content-server";
export async function POST(request: Request) {
  if (platformKind !== "netlify") return Response.json({ error: "Use Sign in with ChatGPT on this host." }, { status: 400 });
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin" }, { status: 403 });
  if (!loginConfigured()) return Response.json({ error: "Admin login is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Netlify's environment variables." }, { status: 503 });
  try {
    const raw = await request.text(); if (raw.length > 4096) return Response.json({ error: "Request too large" }, { status: 413 });
    const { email, password } = JSON.parse(raw);
    if (typeof email !== "string" || typeof password !== "string") return Response.json({ error: "Enter your administrator email and password." }, { status: 400 });
    // Netlify supplies the connection IP. Hash it so raw IP addresses are not stored.
    const ip = request.headers.get("x-nf-client-connection-ip") || "unknown";
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip)));
    const bucket = Array.from(digest, v => v.toString(16).padStart(2, "0")).join("");
    const attempts = getStore({ name: "syra-login-attempts", consistency: "strong" });
    const { blobs } = await attempts.list({ prefix: `${bucket}/` });
    const cutoff = Date.now() - 15 * 60000;
    const recent = blobs.filter(blob => Number(blob.key.split("/")[1]) > cutoff);
    if (recent.length >= 10) return Response.json({ error: "Too many login attempts. Please try again in 15 minutes." }, { status: 429, headers: { "Retry-After": "900" } });
    const passwordMatches = await verifyPassword(password);
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || !passwordMatches) {
      await attempts.set(`${bucket}/${Date.now()}/${crypto.randomUUID()}`, "failed");
      return Response.json({ error: "Access denied. The administrator email or password is incorrect." }, { status: 401 });
    }
    await Promise.all(blobs.map(blob => attempts.delete(blob.key)));
    const response = Response.json({ ok: true });
    response.headers.set("Set-Cookie", `${SESSION_COOKIE}=${await createSession()}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch { return Response.json({ error: "Unable to sign in. Please try again later." }, { status: 503 }); }
}

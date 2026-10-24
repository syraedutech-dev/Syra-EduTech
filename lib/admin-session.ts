import { cookies } from "next/headers";
export const SESSION_COOKIE = "syra_admin_session";
export const ADMIN_EMAIL = "syraedutech@gmail.com";
const encoder = new TextEncoder();
function base64(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function decode(value: string) { return Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)); }
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("Set ADMIN_SESSION_SECRET to a random secret of at least 32 characters in Netlify.");
  return value;
}
async function key() { return crypto.subtle.importKey("raw", encoder.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]); }
export function loginConfigured() { return !!process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 16 && !!process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32; }
export async function verifyPassword(value: string) {
  if (!loginConfigured()) return false;
  const expected = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(process.env.ADMIN_PASSWORD!)));
  const actual = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  let difference = 0; for (let i = 0; i < expected.length; i++) difference |= expected[i] ^ actual[i];
  return difference === 0;
}
export async function createSession() {
  const payload = base64(encoder.encode(JSON.stringify({ email: ADMIN_EMAIL, expires: Date.now() + 8 * 3600000 })));
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", await key(), encoder.encode(payload)));
  return payload + "." + base64(signature);
}
export async function sessionUser() {
  try {
    if (!loginConfigured()) return null;
    const value = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!value || value.length > 2048) return null;
    const parts = value.split("."); if (parts.length !== 2) return null;
    if (!await crypto.subtle.verify("HMAC", await key(), decode(parts[1]), encoder.encode(parts[0]))) return null;
    const payload = JSON.parse(new TextDecoder().decode(decode(parts[0])));
    if (payload.email !== ADMIN_EMAIL || typeof payload.expires !== "number" || payload.expires <= Date.now()) return null;
    return { userId: "syra-admin", email: ADMIN_EMAIL, displayName: "Syra administrator", fullName: null };
  } catch { return null; }
}

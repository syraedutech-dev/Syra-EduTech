import { env } from "cloudflare:workers";
import { isAdmin, readContent, sameOrigin } from "../../../../lib/content-server";
export const dynamic = "force-dynamic";
const validKey = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|gif|webp)$/;
export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!validKey.test(key)) return new Response("Not found", { status: 404 });
  if (!env.BUCKET) return new Response("Image storage unavailable", { status: 503 });
  const object = await env.BUCKET.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers(); object.writeHttpMetadata(headers);
  headers.set("ETag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Content-Security-Policy", "default-src 'none'; sandbox");
  return new Response(object.body, { headers });
}
export async function DELETE(request: Request, { params }: { params: Promise<{ key: string }> }) {
  if (!sameOrigin(request) || !await isAdmin()) return Response.json({ error: "Admin access required" }, { status: 403 });
  const { key } = await params;
  if (!validKey.test(key)) return Response.json({ error: "Invalid image" }, { status: 400 });
  if (!env.BUCKET) return Response.json({ error: "Image storage unavailable" }, { status: 503 });
  const records = await readContent(true);
  if (records.some(row => row.payload.image === `/api/media/${key}`)) return Response.json({ error: "This image is used by website content." }, { status: 409 });
  await env.BUCKET.delete(key);
  return Response.json({ ok: true });
}

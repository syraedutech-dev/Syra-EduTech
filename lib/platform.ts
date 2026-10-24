import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { content } from "../db/schema";
import type { ContentRecord } from "./content-types";
export const platformKind: "cloudflare" | "netlify" = "cloudflare";
export async function listRecords(): Promise<ContentRecord[]> {
  return (await getDb().select().from(content)).map(row => ({ ...row, kind: row.kind as ContentRecord["kind"], payload: JSON.parse(row.payload) }));
}
export async function saveRecord(row: ContentRecord) {
  await getDb().insert(content).values({ ...row, payload: JSON.stringify(row.payload) }).onConflictDoUpdate({ target: content.id, set: { payload: JSON.stringify(row.payload), published: row.published } });
}
export async function deleteRecord(id: string) { await getDb().delete(content).where(eq(content.id, id)); }
export async function putImage(key: string, bytes: Uint8Array, type: string) {
  if (!env.BUCKET) throw new Error("Image storage unavailable");
  await env.BUCKET.put(key, bytes, { httpMetadata: { contentType: type } });
}
export async function getImage(key: string) {
  if (!env.BUCKET) throw new Error("Image storage unavailable");
  const image = await env.BUCKET.get(key);
  return image ? { body: image.body, type: image.httpMetadata?.contentType || "application/octet-stream", etag: image.httpEtag } : null;
}
export async function deleteImage(key: string) {
  if (!env.BUCKET) throw new Error("Image storage unavailable");
  await env.BUCKET.delete(key);
}

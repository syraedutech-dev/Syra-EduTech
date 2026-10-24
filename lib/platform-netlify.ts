import { getStore } from "@netlify/blobs";
import type { ContentRecord } from "./content-types";
export const platformKind: "cloudflare" | "netlify" = "netlify";
async function uncachedFetch(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, { ...init, cache: "no-store" });
  // Drain missing-object responses before the SDK cancels them. Canceling a
  // Next.js wrapped response stream can otherwise leave the request pending.
  if (response.status === 404) {
    await response.arrayBuffer();
    return new Response(null, { status: 404, headers: response.headers });
  }
  return response;
}
function store(name: string) { return getStore({ name, consistency: "strong", fetch: uncachedFetch }); }
export async function listRecords(): Promise<ContentRecord[]> {
  const records = store("syra-content");
  const { blobs } = await records.list();
  const rows = await Promise.all(blobs.map(blob => records.get(blob.key, { type: "json" }) as Promise<ContentRecord | null>));
  return rows.filter((row): row is ContentRecord => !!row);
}
export async function saveRecord(row: ContentRecord) { await store("syra-content").setJSON(row.id, row); }
export async function deleteRecord(id: string) { await store("syra-content").delete(id); }
export async function putImage(key: string, bytes: Uint8Array, type: string) {
  await store("syra-images").set(key, new Blob([new Uint8Array(bytes)]), { metadata: { contentType: type } });
}
export async function getImage(key: string) {
  const image = await store("syra-images").getWithMetadata(key, { type: "arrayBuffer" });
  return image ? { body: image.data, type: String(image.metadata.contentType || "application/octet-stream"), etag: image.etag || "" } : null;
}
export async function deleteImage(key: string) { await store("syra-images").delete(key); }

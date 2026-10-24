import { getChatGPTUser } from "../app/chatgpt-auth";
import { listRecords } from "@/lib/platform";
import { trainers, studentTestimonials } from "../app/data";
import type { ContentRecord } from "./content-types";
export async function isAdmin() {
  const user = await getChatGPTUser();
  return !!user && (user.email.toLowerCase() === "syraedutech@gmail.com" || (process.env.NODE_ENV === "development" && user.userId === "local_seedy"));
}
export async function readContent(admin = false): Promise<ContentRecord[]> {
  const records = await listRecords();
  const defaults: ContentRecord[] = trainers.map(t => ({ id: `trainer-${t.slug}`, kind: "trainer", published: true, createdAt: "", payload: Object.fromEntries(Object.entries(t).map(([key, value]) => [key, String(value)])) }));
  defaults.push(...studentTestimonials.map((t, i) => ({ id: `testimonial-${i + 1}`, kind: "testimonial" as const, published: true, createdAt: "", payload: { ...t, consent: "true" } })));
  const combined = [...defaults.filter(t => !records.some(r => r.id === t.id)), ...records];
  return admin ? combined : combined.filter(r => r.published && r.kind !== "feedback");
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const source = new URL(origin);
    if (!["http:", "https:"].includes(source.protocol) || source.origin !== origin) return false;
    // Next.js may use an internal request URL behind a hosting proxy.
    return origin === new URL(request.url).origin || source.host === request.headers.get("host");
  } catch { return false; }
}

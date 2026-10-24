import { z } from "zod";
import { saveRecord, deleteRecord } from "@/lib/platform";
import { isAdmin, readContent, sameOrigin } from "../../../lib/content-server";
import { isImageUrl } from "../../../lib/content-types";
export const dynamic = "force-dynamic";
const field = z.string().trim().max(2000);
const payloads = {
  trainer: z.object({ name: field.min(1).max(100), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100), role: field.min(1), image: field.refine(isImageUrl, "Use an HTTPS image URL or a local /image path"), experience: field.min(1), credential: field.min(1), specialties: field.min(1), initials: field.min(1).max(4), isLead: z.enum(["true", "false"]), learners: field.optional(), institutions: field.optional() }),
  testimonial: z.object({ name: field.min(1).max(100), track: field.min(1).max(150), quote: field.min(1), consent: z.literal("true") }),
  gallery: z.object({ title: field.min(1).max(150), image: field.refine(isImageUrl, "Use an HTTPS image URL or a local /image path"), caption: field }),
  feedback: z.object({ name: field.min(1), email: z.string().email(), message: field.min(1), rating: z.enum(["1", "2", "3", "4", "5"]) }),
};
export async function GET(request: Request) {
  const admin = new URL(request.url).searchParams.get("admin") === "1";
  if (admin && !await isAdmin()) return Response.json({ error: "Admin access required" }, { status: 403 });
  try { return Response.json(await readContent(admin), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "Content storage is unavailable. Please try again later." }, { status: 503 }); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin" }, { status: 403 });
  if (!await isAdmin()) return Response.json({ error: "Admin access required" }, { status: 403 });
  try {
    if (Number(request.headers.get("content-length")) > 20000) return Response.json({ error: "Request too large" }, { status: 413 });
    const parsed = z.object({ id: z.string().max(150).optional(), kind: z.enum(["trainer", "testimonial", "gallery", "feedback"]), published: z.boolean(), payload: z.record(z.string(), z.string()) }).parse(await request.json());
    const payload = payloads[parsed.kind].parse(parsed.payload);
    if (parsed.kind === "feedback" && parsed.published) return Response.json({ error: "Visitor feedback must remain private. Add a testimonial separately with permission." }, { status: 400 });
    const id = parsed.id || crypto.randomUUID();
    if (parsed.kind === "trainer") {
      const rows = await readContent(true);
      if (rows.some(row => row.id !== id && row.kind === "trainer" && row.payload.slug === (payload as { slug: string }).slug)) return Response.json({ error: "This trainer URL is already in use." }, { status: 409 });
    }
    await saveRecord({ id, kind: parsed.kind, payload, published: parsed.published, createdAt: new Date().toISOString() });
    return Response.json({ id });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) return Response.json({ error: error instanceof z.ZodError ? error.issues[0]?.message : "Invalid request" }, { status: 400 });
    return Response.json({ error: "Unable to save. Please try again." }, { status: 503 });
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request) || !await isAdmin()) return Response.json({ error: "Admin access required" }, { status: 403 });
  try {
    const { id } = z.object({ id: z.string().min(1).max(150) }).parse(await request.json());
    // Keep default-trainer overrides as unpublished records so removed profiles do not reappear.
    if (id.startsWith("trainer-") || id.startsWith("testimonial-")) {
      const row = (await readContent(true)).find(r => r.id === id);
      if (row) await saveRecord({ ...row, published: false });
    } else await deleteRecord(id);
    return Response.json({ ok: true });
  } catch { return Response.json({ error: "Unable to remove item" }, { status: 400 }); }
}

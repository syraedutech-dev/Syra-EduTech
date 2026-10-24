import { z } from "zod";
import { and, eq, gt, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { content } from "../../../db/schema";
import { sameOrigin } from "../../../lib/content-server";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin" }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 12000) return Response.json({ error: "Request too large" }, { status: 413 });
  try {
    const parsed = z.object({ name: z.string().trim().min(1).max(100), email: z.string().email().max(254), message: z.string().trim().min(10).max(2000), rating: z.enum(["1", "2", "3", "4", "5"]), website: z.string().max(0), consent: z.literal(true) }).parse(await request.json());
    const db = getDb();
    const recent = await db.select({ count: sql<number>`count(*)` }).from(content).where(and(eq(content.kind, "feedback"), gt(content.createdAt, new Date(Date.now() - 3600000).toISOString()), sql`json_extract(${content.payload}, '$.email') = ${parsed.email.toLowerCase()}`));
    if (recent[0].count >= 3) return Response.json({ error: "You have already submitted feedback recently. Please try again in an hour." }, { status: 429 });
    const { name, email, message, rating } = parsed;
    await db.insert(content).values({ id: crypto.randomUUID(), kind: "feedback", payload: JSON.stringify({ name, email: email.toLowerCase(), message, rating }), published: false, createdAt: new Date().toISOString() });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof z.ZodError ? error.issues[0]?.message : "We could not save your feedback. Please try again later." }, { status: error instanceof z.ZodError ? 400 : 503 });
  }
}

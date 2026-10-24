import { putImage } from "@/lib/platform";
import { isAdmin, sameOrigin } from "../../../lib/content-server";
export const dynamic = "force-dynamic";
const MAX_FILE = 5 * 1024 * 1024;
const MAX_BODY = MAX_FILE + 65536;
export async function POST(request: Request) {
  if (!sameOrigin(request) || !await isAdmin()) return Response.json({ error: "Admin access required" }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) return Response.json({ error: "Choose an image file to upload." }, { status: 400 });
  if (Number(request.headers.get("content-length")) > MAX_BODY) return Response.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });
  try {
    const reader = request.body?.getReader();
    if (!reader) return Response.json({ error: "No image received." }, { status: 400 });
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) { await reader.cancel(); return Response.json({ error: "Images must be 5 MB or smaller." }, { status: 413 }); }
      chunks.push(value);
    }
    const body = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    const form = await new Response(body, { headers: { "Content-Type": request.headers.get("content-type")! } }).formData();
    const file = form.get("file");
    if (!file || typeof file === "string" || file.size === 0) return Response.json({ error: "Choose a non-empty image." }, { status: 400 });
    if (file.size > MAX_FILE) return Response.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });
    const bytes = new Uint8Array(await file.arrayBuffer());
    let ext = ""; let type = "";
    if ([137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v)) { ext = "png"; type = "image/png"; }
    else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) { ext = "jpg"; type = "image/jpeg"; }
    else if (new TextDecoder().decode(bytes.slice(0,6)).match(/^GIF8[79]a$/)) { ext = "gif"; type = "image/gif"; }
    else if (new TextDecoder().decode(bytes.slice(0,4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8,12)) === "WEBP") { ext = "webp"; type = "image/webp"; }
    if (!ext) return Response.json({ error: "Use a JPG, PNG, WebP or GIF image. SVG files are not supported." }, { status: 400 });
    const key = `${crypto.randomUUID()}.${ext}`;
    await putImage(key, bytes, type);
    return Response.json({ url: `/api/media/${key}` }, { status: 201 });
  } catch { return Response.json({ error: "Upload failed. Please choose the image again and retry." }, { status: 400 }); }
}

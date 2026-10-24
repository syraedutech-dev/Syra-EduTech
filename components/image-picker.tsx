"use client";
import { useEffect, useRef, useState } from "react";
import { Check, ImagePlus } from "lucide-react";
export default function ImagePicker({ initialUrl = "", disabled, onUploadingChange }: { initialUrl?: string; disabled?: boolean; onUploadingChange: (uploading: boolean) => void }) {
  const [url, setUrl] = useState(initialUrl);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => { controller.current?.abort(); }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  async function upload(file: File) {
    setError("");
    if (file.size > 5 * 1024 * 1024) { setError("Choose an image of 5 MB or smaller."); return; }
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) { setError("Choose a JPG, PNG, WebP or GIF image."); return; }
    setPreview(URL.createObjectURL(file)); setFileName(file.name); setUrl(""); setUploading(true); onUploadingChange(true);
    const abort = new AbortController(); controller.current = abort;
    try {
      const form = new FormData(); form.set("file", file);
      const response = await fetch("/api/uploads", { method: "POST", body: form, signal: abort.signal });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "Upload failed. Please try again.");
      setUrl(result.url); setPreview("");
    } catch (e) { if (!abort.signal.aborted) { setError(e instanceof Error ? e.message : "Upload failed. Please try again."); setPreview(""); } }
    finally { if (!abort.signal.aborted) { setUploading(false); onUploadingChange(false); } }
  }
  return <div className="space-y-3"><span className="block text-xs text-slate-400">Image</span>
    {(preview || url) && <img src={preview || url} alt="Selected image preview" className="max-h-56 w-full rounded-xl border border-white/10 object-contain bg-[#07111f]" />}
    <label className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-[#72a8ff]/40 bg-[#72a8ff]/5 px-4 py-6 text-center ${uploading || disabled ? "opacity-50" : "hover:bg-[#72a8ff]/10"}`}><ImagePlus size={24} className="text-[#8db7ff]" /><span className="text-sm font-medium text-[#8db7ff]">{uploading ? "Uploading image..." : "Choose image from your computer"}</span><span className="text-xs text-slate-400">JPG, PNG, WebP or GIF ? up to 5 MB</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" aria-label="Choose image from your computer" disabled={uploading || disabled} className="mt-2 block w-full max-w-xs text-xs text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-[#72a8ff] file:px-4 file:py-2 file:font-semibold file:text-[#07111f]" onChange={event => { const file = event.currentTarget.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} /></label>
    {uploading && <p role="status" className="text-xs text-[#8db7ff]">Uploading {fileName}. Please wait before saving.</p>}
    {!uploading && fileName && url && <p role="status" className="flex items-center gap-1 text-xs text-emerald-300"><Check size={13} />{fileName} uploaded. Save changes to use it.</p>}
    {error && <p role="alert" className="text-xs leading-5 text-red-300">{error}</p>}
    <label className="block text-xs text-slate-500">Or use an image URL<input name="image" required value={url} disabled={uploading || disabled} onChange={event => { setUrl(event.target.value); setFileName(""); setError(""); setPreview(""); }} placeholder="https://example.com/photo.jpg" maxLength={2000} className="admin-input mt-2" /></label>
  </div>;
}

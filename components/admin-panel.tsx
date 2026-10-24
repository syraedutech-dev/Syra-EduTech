"use client";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Check, ImagePlus, LogOut, MessageSquare, Plus, Save, Trash2, Users } from "lucide-react";
import ImagePicker from "./image-picker";
import type { ContentRecord, Kind } from "../lib/content-types";
type EditableKind = Exclude<Kind, "feedback">;
const tabs: { kind: Kind; label: string }[] = [{ kind: "feedback", label: "General feedback" }, { kind: "testimonial", label: "Student testimonials" }, { kind: "gallery", label: "Gallery" }, { kind: "trainer", label: "Trainers" }];
const fields: Record<EditableKind, { key: string; label: string; hint?: string; multiline?: boolean; optional?: boolean }[]> = {
  testimonial: [{ key: "name", label: "Student name" }, { key: "track", label: "Course / cohort" }, { key: "quote", label: "Student feedback", multiline: true }],
  gallery: [{ key: "title", label: "Image title / alt text" }, { key: "image", label: "Image URL", hint: "Use an https:// image URL or a local path such as /hero-learning.png." }, { key: "caption", label: "Caption", multiline: true, optional: true }],
  trainer: [{ key: "name", label: "Trainer name" }, { key: "slug", label: "Profile URL", hint: "Lowercase letters, numbers and hyphens, e.g. surya-kumar." }, { key: "role", label: "Role / company" }, { key: "image", label: "Photo URL", hint: "Use an https:// image URL or a local /image.png path." }, { key: "experience", label: "Experience" }, { key: "credential", label: "Credentials" }, { key: "specialties", label: "Specialties", multiline: true }, { key: "initials", label: "Initials" }, { key: "learners", label: "Learner impact", optional: true }, { key: "institutions", label: "Institution work", optional: true }],
};
export default function AdminPanel({ email }: { email: string }) {
  const [tab, setTab] = useState<Kind>("feedback");
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [editing, setEditing] = useState<ContentRecord | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  async function refresh() {
    setLoading(true);
    try { const response = await fetch("/api/content?admin=1", { cache: "no-store" }); const data = await response.json() as ContentRecord[] & { error?: string }; if (!response.ok) throw new Error(data.error); setRecords(data); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load content"); }
    finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);
  function selectTab(kind: Kind) { setUploading(false); setTab(kind); setEditing(null); setStatus(""); setError(""); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (tab === "feedback" || uploading) return;
    setBusy(true); setError(""); setStatus("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(fields[tab].map(field => [field.key, String(form.get(field.key) || "").trim()]));
    if (tab === "trainer") payload.isLead = form.has("isLead") ? "true" : "false";
    if (tab === "testimonial") payload.consent = form.has("consent") ? "true" : "false";
    try {
      const response = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing?.id || undefined, kind: tab, payload, published: form.has("published") }) });
      const result = await response.json() as { error?: string }; if (!response.ok) throw new Error(result.error);
      setEditing(null); await refresh(); setStatus(form.has("published") ? "Changes published on the website." : "Draft saved. This item is hidden from the website.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save"); }
    finally { setBusy(false); }
  }
  async function remove(record: ContentRecord) {
    if (!window.confirm(record.id.startsWith("trainer-") ? "Unpublish this trainer profile?" : "Permanently delete this item?")) return;
    setBusy(true); setError(""); setStatus("");
    try {
      const response = await fetch("/api/content", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: record.id }) });
      const result = await response.json() as { error?: string }; if (!response.ok) throw new Error(result.error);
      if (editing?.id === record.id) setEditing(null); await refresh(); setStatus("Item removed.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete"); }
    finally { setBusy(false); }
  }
  const visible = records.filter(record => record.kind === tab);
  return <main className="min-h-screen bg-[#07111f] px-5 py-8 text-slate-100 sm:px-10"><div className="mx-auto max-w-6xl">
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6"><a href="/" className="inline-flex items-center gap-2 text-sm text-slate-400"><ArrowLeft size={16} /> Website</a><a href="/signout-with-chatgpt?return_to=/admin" target="_top" className="inline-flex items-center gap-2 text-sm text-slate-400"><LogOut size={16} /> Sign out</a></nav>
    <p className="eyebrow mt-10 text-[#8db7ff]">Syra workspace</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Content administration</h1><p className="mt-3 text-sm text-slate-400">Manage your website and review private visitor feedback. Signed in as {email}.</p>
    <div className="my-8 grid gap-3 sm:grid-cols-3">{[{ icon: MessageSquare, text: "Visitor feedback", value: records.filter(r => r.kind === "feedback").length }, { icon: ImagePlus, text: "Gallery images", value: records.filter(r => r.kind === "gallery" && r.published).length }, { icon: Users, text: "Published trainers", value: records.filter(r => r.kind === "trainer" && r.published).length }].map(item => <div key={item.text} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><item.icon size={19} className="text-[#8db7ff]" /><p className="mt-4 text-3xl font-semibold">{item.value}</p><p className="mt-1 text-xs text-slate-400">{item.text}</p></div>)}</div>
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Content types">{tabs.map(item => <button key={item.kind} role="tab" aria-selected={tab === item.kind} onClick={() => selectTab(item.kind)} className={`rounded-full px-4 py-2.5 text-sm ${tab === item.kind ? "bg-[#72a8ff] text-[#07111f]" : "border border-white/15 text-slate-300"}`}>{item.label}</button>)}</div>
    {error && <p role="alert" className="mt-5 rounded-xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-200">{error} <button onClick={() => void refresh()} className="ml-2 underline">Retry loading</button></p>}{status && <p role="status" className="mt-5 flex items-center gap-2 text-sm text-emerald-300"><Check size={16} />{status}</p>}
    <div className={`mt-7 grid gap-6 ${tab !== "feedback" ? "lg:grid-cols-2" : ""}`}>
      <section aria-label={tabs.find(t => t.kind === tab)?.label} className="space-y-3">
        {loading ? <p className="py-8 text-slate-400">Loading content?</p> : !visible.length ? <div className="rounded-2xl border border-dashed border-white/15 p-10 text-sm text-slate-400">{tab === "feedback" ? "No feedback yet. New submissions will appear here." : "No items yet. Add your first item using the form."}</div> : visible.map(record => <article key={record.id} className="rounded-2xl border border-white/10 bg-[#0d1c31] p-5">
          <div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold">{record.payload.name || record.payload.title}</h2><p className="mt-1 text-xs text-slate-400">{record.kind === "feedback" ? `${record.payload.email} ? ${record.payload.rating}/5` : record.kind === "trainer" ? record.payload.role : record.payload.track || record.payload.caption}</p></div><span className="shrink-0 rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase text-slate-400">{record.kind === "feedback" ? "Private" : record.published ? "Published" : "Draft"}</span></div>
          {(record.kind === "feedback" || record.kind === "testimonial") && <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">{record.payload.message || record.payload.quote}</p>}
          {record.payload.image && <img src={record.payload.image} alt={record.payload.title || record.payload.name} className="mt-4 h-36 w-full rounded-xl object-cover" loading="lazy" />}
          <div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs text-slate-500">{record.createdAt ? new Date(record.createdAt).toLocaleDateString("en-IN") : "Existing website content"}</span><div className="flex gap-3">{tab !== "feedback" && <button disabled={busy} onClick={() => { setUploading(false); setEditing(record); setStatus(""); }} className="text-sm text-[#8db7ff]">Edit</button>}<button disabled={busy} onClick={() => void remove(record)} aria-label={`Remove ${record.payload.name || record.payload.title}`} className="p-2 text-red-300"><Trash2 size={15} /></button></div></div>
        </article>)}
      </section>
      {tab !== "feedback" && <section className="h-fit rounded-2xl border border-white/10 bg-[#0d1c31] p-6 lg:sticky lg:top-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">{editing ? "Edit item" : "Add new item"}</h2>{editing && <button onClick={() => { setUploading(false); setEditing(null); }} className="inline-flex items-center gap-1 text-xs text-[#8db7ff]"><Plus size={14} /> New item</button>}</div>
        <form key={`${tab}-${editing?.id || "new"}-${status}`} onSubmit={save} className="space-y-4">{fields[tab].map(field => field.key === "image" ? <ImagePicker key={`${tab}-${editing?.id || "new"}-image`} initialUrl={editing?.payload.image || ""} disabled={busy} onUploadingChange={setUploading} /> : <label key={field.key} className="block"><span className="mb-2 block text-xs text-slate-400">{field.label}{field.optional ? " (optional)" : ""}</span>{field.multiline ? <textarea name={field.key} required={!field.optional} maxLength={2000} defaultValue={editing?.payload[field.key] || ""} rows={4} className="admin-input" /> : <input name={field.key} required={!field.optional} maxLength={field.key === "initials" ? 4 : field.key === "slug" || field.key === "name" ? 100 : 2000} pattern={field.key === "slug" ? "[a-z0-9]+(-[a-z0-9]+)*" : undefined} defaultValue={editing?.payload[field.key] || ""} className="admin-input" />}{field.hint && <span className="mt-1 block text-xs leading-5 text-slate-500">{field.hint}</span>}</label>)}
          {tab === "trainer" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isLead" defaultChecked={editing?.payload.isLead === "true"} /> Lead trainer</label>}
          {tab === "testimonial" && <label className="flex items-start gap-2 text-xs leading-5 text-slate-300"><input required type="checkbox" name="consent" defaultChecked={editing?.payload.consent === "true"} className="mt-1" /> I have permission from the student to publish this testimonial.</label>}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={editing?.published ?? true} /> Publish on the website</label>
          <button disabled={busy || uploading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#72a8ff] px-5 py-3 text-sm font-semibold text-[#07111f] disabled:opacity-50"><Save size={16} />{uploading ? "Uploading image..." : busy ? "Saving..." : "Save changes"}</button>
        </form></section>}
    </div>
  </div></main>;
}

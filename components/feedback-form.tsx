"use client";
import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
export default function FeedbackForm() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setBusy(true); setError("");
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), email: data.get("email"), rating: data.get("rating"), message: data.get("message"), website: data.get("website"), consent: data.has("consent") }) });
      const result = await response.json() as { error?: string }; if (!response.ok) throw new Error(result.error); form.reset(); setSent(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to submit feedback. Please try again."); }
    finally { setBusy(false); }
  }
  if (sent) return <div role="status" className="rounded-3xl border border-emerald-300/20 bg-[#0d1c31] p-9"><CheckCircle2 className="text-emerald-300" size={36} /><h2 className="mt-5 text-2xl font-semibold">Thank you for your feedback.</h2><p className="mt-3 text-sm leading-7 text-slate-400">Your message has been saved and shared privately with the Syra EduTech team.</p><button onClick={() => setSent(false)} className="mt-6 text-sm text-[#8db7ff]">Send another message</button></div>;
  return <form onSubmit={submit} className="space-y-5 rounded-3xl border border-white/10 bg-[#0d1c31] p-6 sm:p-9">
    <h2 className="text-2xl font-semibold">Share your experience</h2><p className="text-sm leading-6 text-slate-400">Questions, suggestions or feedback ? we would love to hear from you.</p>
    <label className="block text-xs text-slate-400">Full name<input required name="name" autoComplete="name" maxLength={100} className="admin-input mt-2" /></label>
    <label className="block text-xs text-slate-400">Email address<input required name="email" type="email" autoComplete="email" maxLength={254} className="admin-input mt-2" /></label>
    <label className="block text-xs text-slate-400">Overall experience<select required name="rating" defaultValue="" className="admin-input mt-2"><option value="" disabled>Select a rating</option>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} / 5{n === 5 ? " ? Excellent" : n === 1 ? " ? Needs improvement" : ""}</option>)}</select></label>
    <label className="block text-xs text-slate-400">Your feedback<textarea required name="message" minLength={10} maxLength={2000} rows={5} placeholder="Tell us what worked well or what we could improve?" className="admin-input mt-2" /></label>
    <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="flex items-start gap-3 text-xs leading-6 text-slate-400"><input required type="checkbox" name="consent" className="mt-1.5" />I agree to share these details with Syra EduTech to review and respond to my feedback. My message will not be published automatically.</label>
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    <button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#72a8ff] px-5 py-3.5 text-sm font-semibold text-[#07111f] disabled:opacity-50"><Send size={16} />{busy ? "Submitting?" : "Submit feedback"}</button>
  </form>;
}

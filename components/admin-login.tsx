"use client";
import { FormEvent, useState } from "react";
export default function AdminLogin() {
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Sign-in failed");
      window.location.assign("/admin");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in"); setBusy(false); }
  }
  return <form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-xs text-slate-400">Administrator email<input name="email" type="email" required autoComplete="username" className="admin-input mt-2" /></label><label className="block text-xs text-slate-400">Password<input name="password" type="password" required autoComplete="current-password" className="admin-input mt-2" /></label>{error && <p role="alert" className="text-sm leading-6 text-red-300">{error}</p>}<button disabled={busy} className="w-full rounded-full bg-[#72a8ff] px-6 py-3 text-sm font-semibold text-[#07111f] disabled:opacity-50">{busy ? "Signing in..." : "Admin login"}</button></form>;
}

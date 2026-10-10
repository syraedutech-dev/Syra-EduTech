"use client";

import { ArrowLeft, ArrowUpRight, Check, Mail, Send } from "lucide-react";
import { FormEvent, useState } from "react";

const contactEmail = "syraedutech@gmail.com";

export default function CareersPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const role = String(form.get("role") || "");
    const message = String(form.get("message") || "");
    const subject = `Career enquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nArea of interest: ${role}\n\nMessage:\n${message}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <nav className="mx-auto flex max-w-[1160px] items-center justify-between px-6 py-6 lg:px-10">
        <a href="/" aria-label="Back to SyraEduTech home"><img src="/syra-edutech-logo.png" alt="SyraEduTech" className="h-10 w-auto object-contain sm:h-12" /></a>
        <a href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"><ArrowLeft size={15} /> Back to home</a>
      </nav>

      <section className="mx-auto grid max-w-[1160px] gap-12 px-6 pb-20 pt-14 lg:grid-cols-[.85fr_1.15fr] lg:px-10 lg:pb-28 lg:pt-24">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#6fa3f8]">Careers at Syra</p>
          <h1 className="mt-5 max-w-[520px] text-[clamp(3rem,7vw,6rem)] font-semibold leading-[.92] tracking-[-.075em] text-white">Teach what you&apos;ve <span className="text-[#73a9ff]">built.</span></h1>
          <p className="mt-8 max-w-[450px] text-[17px] leading-8 text-slate-400">We&apos;re building a learning team of practitioners, mentors, and operators who want to make technology careers more accessible.</p>
          <div className="mt-10 space-y-4 text-sm text-slate-300"><p className="flex items-center gap-3"><Check className="text-[#6fa3f8]" size={17} /> Mentor learners through real projects</p><p className="flex items-center gap-3"><Check className="text-[#6fa3f8]" size={17} /> Shape practical, industry-ready curriculum</p><p className="flex items-center gap-3"><Check className="text-[#6fa3f8]" size={17} /> Work with colleges and ambitious teams</p></div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#0d1c31] p-6 shadow-[0_30px_80px_rgba(0,0,0,.25)] sm:p-9">
          <div className="mb-8 flex items-start justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#6fa3f8]">Start a conversation</p><h2 className="mt-3 text-2xl font-semibold tracking-[-.04em] text-white">Tell us where you can make an impact.</h2></div><Mail className="shrink-0 text-[#6fa3f8]" size={24} /></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block"><span className="mb-2 block text-xs font-medium text-slate-400">Your name</span><input required name="name" type="text" placeholder="Full name" className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#6fa3f8]" /></label>
            <label className="block"><span className="mb-2 block text-xs font-medium text-slate-400">Email address</span><input required name="email" type="email" placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#6fa3f8]" /></label>
            <label className="block"><span className="mb-2 block text-xs font-medium text-slate-400">Area of interest</span><select required name="role" defaultValue="" className="w-full rounded-xl border border-white/10 bg-[#122641] px-4 py-3 text-sm text-white outline-none focus:border-[#6fa3f8]"><option value="" disabled>Select one</option><option>Trainer / Mentor</option><option>Curriculum &amp; Content</option><option>Student Success</option><option>Partnerships</option></select></label>
            <label className="block"><span className="mb-2 block text-xs font-medium text-slate-400">A short note</span><textarea required name="message" rows={4} placeholder="Tell us about your experience and what you would like to build with Syra." className="w-full resize-none rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#6fa3f8]" /></label>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#72a8ff] px-6 py-3.5 text-sm font-semibold text-[#07111f] transition-transform hover:-translate-y-0.5">{submitted ? "Email draft ready" : "Send application by email"} {submitted ? <Check size={16} /> : <Send size={16} />}</button>
          </form>
          <p className="mt-4 text-center text-xs leading-5 text-slate-500">This opens your email app with the application addressed to {contactEmail}.</p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-7 lg:px-10"><div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 text-xs text-slate-500"><span>© 2026 Syra Education</span><a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-1 hover:text-white">{contactEmail} <ArrowUpRight size={13} /></a></div></footer>
    </main>
  );
}

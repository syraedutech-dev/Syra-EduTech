import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { readContent } from "../../../lib/content-server";
import { trainers } from "../../data";

const siteUrl = "https://syraedutech.in";
const contactEmail = "syraedutech@gmail.com";
const whatsappHref = "https://wa.me/919363570075?text=" + encodeURIComponent("Hi Syra EduTech, I would like to connect with the training team.");

export const dynamic = "force-dynamic";
async function getTrainer(slug: string) {
  const rows = await readContent();
  const row = rows.find(row => row.kind === "trainer" && row.payload.slug === slug);
  return row ? { ...row.payload, isLead: row.payload.isLead === "true" } as (typeof trainers)[number] : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const trainer = await getTrainer(slug);
  if (!trainer) return { title: "Trainer profile | Syra EduTech" };
  return {
    title: `${trainer.name} | ${trainer.role} | Syra EduTech`,
    description: `${trainer.name} is a ${trainer.role} at Syra EduTech, with ${trainer.experience} of experience in ${trainer.specialties}.`,
    alternates: { canonical: `/trainers/${trainer.slug}` },
    openGraph: { title: `${trainer.name} | Syra EduTech trainer`, description: `${trainer.role}. ${trainer.credential}.`, url: `${siteUrl}/trainers/${trainer.slug}`, type: "profile" },
  };
}

export default async function TrainerProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trainer = await getTrainer(slug);
  if (!trainer) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${trainer.name} | Syra EduTech`,
    url: `${siteUrl}/trainers/${trainer.slug}`,
    mainEntity: {
      "@type": "Person",
      name: trainer.name,
      jobTitle: trainer.role,
      worksFor: { "@type": "Organization", name: "Syra EduTech", url: siteUrl },
      image: trainer.image.startsWith("https://") ? trainer.image : `${siteUrl}${trainer.image}`,
      knowsAbout: trainer.specialties.split(", "),
      description: `${trainer.name} is a ${trainer.credential} trainer with ${trainer.experience} of experience.`,
    },
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="mx-auto flex max-w-[1160px] items-center justify-between px-6 py-6 lg:px-10"><a href="/" aria-label="SyraEduTech home"><img src="/syra-mark.svg" alt="SyraEduTech" width={48} height={48} className="h-11 w-11 rounded-xl object-contain sm:h-12 sm:w-12" /></a><a href="/#outcomes" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={15} /> All trainers</a></nav>
      <section className="mx-auto grid max-w-[1160px] gap-12 px-6 pb-20 pt-12 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-24">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_50%_10%,#dfe8f5_0%,#b7c9de_52%,#7e98b8_100%)] p-5"><div className="absolute left-5 top-5 rounded-full bg-white/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#112844]">{trainer.isLead ? "Lead trainer" : "Trainer profile"}</div><img src={trainer.image} alt={`${trainer.name}, ${trainer.role}`} className="aspect-[4/5] w-full rounded-2xl object-contain object-center drop-shadow-[0_18px_28px_rgba(4,15,31,.28)]" /></div>
        <div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#6fa3f8]">Syra EduTech trainer</p><h1 className="mt-5 text-[clamp(3.3rem,7vw,6rem)] font-semibold leading-[.92] tracking-[-.08em] text-white">{trainer.name}<span className="text-[#73a9ff]">.</span></h1><p className="mt-6 max-w-[620px] text-xl leading-8 text-slate-300">{trainer.role}</p><p className="mt-5 max-w-[620px] text-[16px] leading-7 text-slate-400">A practitioner-led mentor helping learners turn technical foundations into confident, portfolio-ready work.</p><div className="mt-9 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><p className="text-[10px] uppercase tracking-[.14em] text-slate-500">Experience</p><p className="mt-2 text-lg font-semibold text-white">{trainer.experience}</p></div><div className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><p className="text-[10px] uppercase tracking-[.14em] text-slate-500">Credential</p><p className="mt-2 text-lg font-semibold text-white">{trainer.credential}</p></div></div><p className="mt-7 text-sm leading-7 text-slate-400"><span className="font-semibold text-slate-200">Specialties:</span> {trainer.specialties}</p>{trainer.learners && <p className="mt-2 text-sm leading-7 text-slate-400"><span className="font-semibold text-slate-200">Learner impact:</span> {trainer.learners}</p>}{trainer.institutions && <p className="mt-2 text-sm leading-7 text-slate-400"><span className="font-semibold text-slate-200">Institution work:</span> {trainer.institutions}</p>}<div className="mt-9 flex flex-wrap gap-3"><a href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Connect with ${trainer.name}`)}`} className="inline-flex items-center gap-2 rounded-full bg-[#72a8ff] px-5 py-3.5 text-sm font-semibold text-[#07111f]"><Mail size={16} /> Email Syra</a><a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm font-semibold text-white hover:bg-white/10"><MessageCircle size={16} /> WhatsApp <ArrowUpRight size={15} /></a></div></div>
      </section>
      <footer className="border-t border-white/10 px-6 py-7 lg:px-10"><div className="mx-auto flex max-w-[1160px] justify-between gap-4 text-xs text-slate-500"><span>© 2026 Syra Education</span><a href="/about" className="hover:text-white">About Syra EduTech</a></div></footer>
    </main>
  );
}

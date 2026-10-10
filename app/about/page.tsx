import { ArrowLeft, ArrowUpRight, Mail, MessageCircle, Sparkles } from "lucide-react";

const contactEmail = "syraedutech@gmail.com";
const whatsappHref = "https://wa.me/919363570075?text=" + encodeURIComponent("Hi Syra EduTech, I would like to know more about the company and its programs.");

const principles = [
  { title: "Practical by design", description: "Learning is built around projects, guided practice, and the tools teams use in the real world." },
  { title: "People before platforms", description: "Mentors, office hours, feedback, and clear next steps keep learners moving when the work gets difficult." },
  { title: "Built for the next step", description: "Every pathway connects technical foundations to confidence, communication, and career readiness." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <nav className="mx-auto flex max-w-[1160px] items-center justify-between px-6 py-6 lg:px-10">
        <a href="/" aria-label="Back to SyraEduTech home"><img src="/syra-edutech-logo.png" alt="SyraEduTech" className="h-10 w-auto object-contain sm:h-12" /></a>
        <a href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"><ArrowLeft size={15} /> Back to home</a>
      </nav>

      <section className="mx-auto max-w-[1160px] px-6 pb-20 pt-14 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="max-w-[780px]"><p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#6fa3f8]"><Sparkles size={14} /> About Syra EduTech</p><h1 className="mt-6 text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[.9] tracking-[-.08em] text-white">Learning that<br /><span className="text-[#73a9ff]">moves with you.</span></h1><p className="mt-8 max-w-[660px] text-[18px] leading-8 text-slate-400">Syra EduTech helps students, institutions, and teams build practical technology skills through project-led learning, experienced mentors, and career-focused support.</p></div>
        <div className="mt-16 grid gap-3 border-y border-white/10 py-7 sm:grid-cols-3"><div><strong className="block text-4xl font-semibold tracking-[-.07em] text-white">1,200+</strong><span className="text-xs uppercase tracking-[.14em] text-slate-500">students trained</span></div><div><strong className="block text-4xl font-semibold tracking-[-.07em] text-white">20+</strong><span className="text-xs uppercase tracking-[.14em] text-slate-500">colleges reached</span></div><div><strong className="block text-4xl font-semibold tracking-[-.07em] text-white">3</strong><span className="text-xs uppercase tracking-[.14em] text-slate-500">Microsoft-trained mentors</span></div></div>
      </section>

      <section className="bg-[#f4f7fb] px-6 py-20 text-[#081525] lg:px-10 lg:py-28"><div className="mx-auto grid max-w-[1160px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#5a7eae]">What we believe</p><h2 className="mt-4 text-[clamp(2.5rem,5vw,4.6rem)] font-semibold leading-[.95] tracking-[-.07em]">Skills become<br /><em>momentum.</em></h2></div><div className="grid gap-4">{principles.map((principle, index) => <article key={principle.title} className="rounded-2xl border border-[#dce5f0] bg-white p-6"><div className="flex items-start gap-5"><span className="text-sm font-semibold text-[#3b7bed]">0{index + 1}</span><div><h3 className="text-xl font-semibold tracking-[-.03em]">{principle.title}</h3><p className="mt-2 max-w-[560px] text-sm leading-6 text-slate-500">{principle.description}</p></div></div></article>)}</div></div></section>

      <section className="mx-auto grid max-w-[1160px] gap-12 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-10 lg:py-28"><div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#6fa3f8]">How we work</p><h2 className="mt-4 max-w-[620px] text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[.95] tracking-[-.07em] text-white">Learn it.<br /><span className="text-[#73a9ff]">Build it.</span><br />Grow with it.</h2><p className="mt-7 max-w-[530px] text-[16px] leading-7 text-slate-400">Our programs bring together structured curriculum, hands-on projects, trainer feedback, and interview preparation. That combination helps learners move from consuming tutorials to showing what they can do.</p></div><div className="rounded-[26px] border border-white/10 bg-[#0d1c31] p-7"><p className="text-sm font-semibold text-white">Our learning loop</p><div className="mt-6 space-y-5">{["Understand the signal", "Build the proof", "Get expert feedback", "Make the next move"].map((step, index) => <div key={step} className="flex items-center gap-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#193a63] text-xs font-semibold text-[#9fc3ff]">0{index + 1}</span><span className="text-sm text-slate-300">{step}</span></div>)}</div></div></section>

      <section className="px-6 pb-20 lg:px-10 lg:pb-28"><div className="mx-auto flex max-w-[1160px] flex-col justify-between gap-8 rounded-[28px] bg-[#6da4fd] px-7 py-12 text-[#07111f] sm:px-12 lg:flex-row lg:items-center lg:px-16"><div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#173b72]">Let&apos;s connect</p><h2 className="mt-4 max-w-[650px] text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[.95] tracking-[-.07em]">Have a question<br />about Syra?</h2></div><div className="flex flex-wrap gap-3"><a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 rounded-full bg-[#07111f] px-5 py-3.5 text-sm font-semibold text-white"><Mail size={16} /> Email us</a><a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-[#07111f]"><MessageCircle size={16} /> WhatsApp us <ArrowUpRight size={15} /></a></div></div></section>

      <footer className="border-t border-white/10 px-6 py-7 lg:px-10"><div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 text-xs text-slate-500"><span>© 2026 Syra Education</span><a href="/careers" className="inline-flex items-center gap-1 hover:text-white">Work with us <ArrowUpRight size={13} /></a></div></footer>
    </main>
  );
}

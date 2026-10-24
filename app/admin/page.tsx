import { getChatGPTUser, chatGPTSignInPath } from "../chatgpt-auth";
import { isAdmin } from "../../lib/content-server";
import AdminPanel from "../../components/admin-panel";
export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Syra EduTech", robots: { index: false, follow: false } };
export default async function AdminPage() {
  const user = await getChatGPTUser();
  if (user && await isAdmin()) return <AdminPanel email={user.email} />;
  return <main className="grid min-h-screen place-items-center bg-[#07111f] px-6 text-white"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1c31] p-8"><img src="/syra-mark.svg" alt="Syra EduTech" width={56} height={56} className="rounded-xl" /><p className="eyebrow mt-8 text-[#8db7ff]">Admin workspace</p><h1 className="mt-3 text-3xl font-semibold">{user ? "Access denied" : "Admin login"}</h1>{user ? <div role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4"><p className="text-sm font-semibold text-red-200">You do not have permission to access the admin area.</p><p className="mt-2 break-words text-xs leading-6 text-red-200/80">Signed in as {user.email}. Please switch to an authorized administrator account.</p></div> : <p className="mt-4 text-sm leading-7 text-slate-400">Sign in with your authorized administrator account to manage website content. Other accounts cannot access the admin dashboard.</p>}<a href={user ? "/signout-with-chatgpt?return_to=/admin" : chatGPTSignInPath("/admin")} target="_top" className="mt-7 inline-flex rounded-full bg-[#72a8ff] px-6 py-3 text-sm font-semibold text-[#07111f]">{user ? "Switch account" : "Sign in with ChatGPT"}</a><a href="/" className="mt-5 block text-sm text-slate-400">Back to website</a></div></main>;
}

import Home from "../components/home-page";
import { isAdmin, readContent } from "../lib/content-server";
export const dynamic = "force-dynamic";
export default async function Page() {
  const [initialContent, admin] = await Promise.all([readContent(), isAdmin()]);
  return <Home initialContent={initialContent} admin={admin} />;
}

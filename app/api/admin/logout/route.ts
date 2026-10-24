import { platformKind } from "@/lib/platform";
import { SESSION_COOKIE } from "../../../../lib/admin-session";
export async function GET(request: Request) {
  return new Response(null, { status: 303, headers: {
    Location: new URL(platformKind === "netlify" ? "/admin" : "/signout-with-chatgpt?return_to=/admin", request.url).href,
    "Set-Cookie": `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
    "Cache-Control": "no-store",
  } });
}

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  const isLogin = req.nextUrl.pathname === "/admin/login";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const toLogin = () => NextResponse.redirect(new URL("/admin/login", req.url));
  if (!url || !key) return isLogin ? res : toLogin();
  const supabase = createServerClient(url, key, { cookies: {
    getAll: () => req.cookies.getAll(),
    setAll: (list) => list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
  } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && !isLogin) return toLogin();
  return res;
}
export const config = { matcher: ["/admin/:path*"] };

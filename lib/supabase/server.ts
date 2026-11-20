import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
/** Client acting as the signed-in staff user. RLS applies (no service role). */
export async function getUserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const store = await cookies();
  return createServerClient(url, key, { cookies: {
    getAll: () => store.getAll(),
    setAll(list) { try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* server component: ignore */ } },
  } });
}

import "server-only";
import { createClient } from "@supabase/supabase-js";
/** Service-role client. Server-only; bypasses RLS. Used solely for validated public inserts. */
export function getAdminClient() {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

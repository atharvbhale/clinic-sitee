import "server-only";
import { redirect } from "next/navigation";
import { getUserClient } from "@/lib/supabase/server";
/** Defence in depth: every admin page and action verifies a signed-in user who has a staff role. */
export async function requireStaff() {
  const supabase = await getUserClient();
  if (!supabase) redirect("/admin/login");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: role } = await supabase.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (!role) redirect("/admin/login?e=denied");
  return { supabase, user };
}

"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin/auth";
import { STATUSES, TIMES } from "@/lib/validation/enquiry";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function updateEnquiry(fd: FormData) {
  const { supabase } = await requireStaff();
  const id = String(fd.get("id")), status = String(fd.get("status")), date = String(fd.get("preferredDate")), time = String(fd.get("preferredTime"));
  if (!UUID.test(id) || !(STATUSES as readonly string[]).includes(status) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !(TIMES as readonly string[]).includes(time)) redirect(`/admin/enquiries/${UUID.test(id) ? id : ""}?e=invalid`);
  const { error } = await supabase.from("enquiries").update({ status, preferred_date: date, preferred_time: time }).eq("id", id);
  if (error) console.error("admin update failed", error.code);
  revalidatePath("/admin"); redirect(`/admin/enquiries/${id}?${error ? "e=failed" : "ok=1"}`);
}
export async function addNote(fd: FormData) {
  const { supabase, user } = await requireStaff();
  const id = String(fd.get("id")), note = String(fd.get("note") ?? "").trim().slice(0, 2000);
  if (!UUID.test(id) || !note) redirect(`/admin/enquiries/${UUID.test(id) ? id : ""}?e=invalid`);
  const { error } = await supabase.from("enquiry_notes").insert({ enquiry_id: id, author_id: user.id, note });
  if (error) console.error("note failed", error.code);
  redirect(`/admin/enquiries/${id}?${error ? "e=failed" : "ok=1"}`);
}
export async function signOut() {
  const { supabase } = await requireStaff(); await supabase.auth.signOut(); redirect("/admin/login");
}

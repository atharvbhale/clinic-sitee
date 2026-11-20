"use server";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { enquirySchema } from "@/lib/validation/enquiry";
import { getAdminClient } from "@/lib/supabase/admin";
import { sendClinicEmail } from "@/lib/notifications/email";

export type FormState = { status: "idle" | "success" | "error"; ref?: string; message?: string; errors?: Record<string, string>; values?: Record<string, string> };
const FIELDS = ["name", "phone", "category", "preferredDate", "preferredTime", "patientType", "source"] as const;

export async function submitEnquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  if (String(fd.get("website") ?? "") !== "") return { status: "success", ref: "RECEIVED" }; // honeypot: silent
  const raw = Object.fromEntries(FIELDS.map((k) => [k, String(fd.get(k) ?? "")]));
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { status: "error", errors, values: raw, message: "Please check the highlighted fields." };
  }
  const d = parsed.data, phone = `+91${d.phone}`;
  const db = getAdminClient();
  if (!db) return { status: "error", values: raw, message: "Online requests are temporarily unavailable. Please contact the clinic on WhatsApp or by phone." };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const ipHash = createHash("sha256").update(`${process.env.RATE_LIMIT_SALT ?? ""}${ip}`).digest("hex");

  const since10 = new Date(Date.now() - 10 * 60e3).toISOString();
  const { count } = await db.from("enquiries").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since10);
  if ((count ?? 0) >= 3) return { status: "error", values: raw, message: "Too many requests. Please wait a few minutes or contact the clinic directly." };

  // Idempotency: same phone + date in the last 24h returns the existing request.
  const since24 = new Date(Date.now() - 864e5).toISOString();
  const { data: dup } = await db.from("enquiries").select("public_ref").eq("phone_e164", phone).eq("preferred_date", d.preferredDate).neq("status", "cancelled").gte("created_at", since24).limit(1);
  if (dup?.length) return { status: "success", ref: dup[0].public_ref };

  const { data, error } = await db.from("enquiries").insert({
    name: d.name, phone_e164: phone, category: d.category, preferred_date: d.preferredDate, preferred_time: d.preferredTime,
    patient_type: d.patientType, source_page: d.source, channel: "web_form", ip_hash: ipHash,
  }).select("public_ref").single();
  if (error || !data) { console.error("enquiry insert failed", error?.code); return { status: "error", values: raw, message: "We could not save your request. Please try again or contact the clinic directly." }; }

  await sendClinicEmail({ ref: data.public_ref, name: d.name, phone, category: d.category, date: d.preferredDate, time: d.preferredTime, patientType: d.patientType });
  return { status: "success", ref: data.public_ref };
}

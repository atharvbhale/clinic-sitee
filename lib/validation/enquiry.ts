import { z } from "zod";
export const CATEGORIES = ["General consultation", "Skin", "Allergies", "Digestive concerns", "Respiratory concerns", "Joint pains", "Child health", "Follow-up", "Other"] as const;
export const TIMES = ["morning", "afternoon", "evening", "any"] as const;
export const STATUSES = ["new", "reviewed", "contacted", "confirmed", "rescheduled", "cancelled", "completed"] as const;

const clean = (s: string) => s.replace(/[\u0000-\u001F\u007F<>]/g, "").replace(/\s+/g, " ").trim();
export function normalizePhone(raw: string) {
  let d = raw.replace(/[\s\-().]/g, "");
  if (d.startsWith("+91")) d = d.slice(3);
  else if (d.startsWith("91") && d.length === 12) d = d.slice(2);
  else if (d.startsWith("0") && d.length === 11) d = d.slice(1);
  return d;
}
/** Today in IST as YYYY-MM-DD, plus an offset in days. */
export function istDate(offsetDays = 0, now = Date.now()) {
  return new Date(now + 5.5 * 3600e3 + offsetDays * 864e5).toISOString().slice(0, 10);
}
export const enquirySchema = z.object({
  name: z.string({ required_error: "Please enter your name" }).transform(clean).pipe(
    z.string().min(2, "Please enter your name").max(80, "Name is too long")
      .regex(/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u, "Use letters only in your name")),
  phone: z.string({ required_error: "Please enter your mobile number" }).transform(normalizePhone).pipe(
    z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")),
  category: z.enum(CATEGORIES, { message: "Please choose a category" }),
  preferredDate: z.string({ required_error: "Please choose a date" }).regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date")
    .refine((d) => d >= istDate(0), "Date cannot be in the past").refine((d) => d <= istDate(60), "Please choose a date within the next 60 days"),
  preferredTime: z.enum(TIMES, { message: "Please choose a time preference" }),
  patientType: z.enum(["new", "returning"], { message: "Please choose one" }),
  source: z.string().regex(/^\/[a-z0-9/_-]{0,60}$/).catch("/book"),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

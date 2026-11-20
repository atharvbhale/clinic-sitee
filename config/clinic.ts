/**
 * Single source of truth for clinic facts.
 * Every field has a status. Only "verified" values may be shown publicly in production.
 * "pending" = supplied but awaiting clinic confirmation. "unknown" = not yet provided.
 */
export type Status = "verified" | "pending" | "unknown";
export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
/** 24h "HH:MM" ranges that apply to a set of days. */
export interface HoursBlock { days: Day[]; ranges: [string, string][] }
export interface Field<T> { value: T | null; status: Status }

const verified = <T,>(value: T): Field<T> => ({ value, status: "verified" });
const pending = <T,>(value: T): Field<T> => ({ value, status: "pending" });
const unknown = <T,>(): Field<T> => ({ value: null, status: "unknown" });

export const clinic = {
  clinicName: verified("Dr. Atul Bhale's Homeopathic Clinic"),
  doctorName: verified("Dr. Atul Bhale"),
  // Supplied as "BHMS Mumbai": the institution/university is not yet specified, so it is not expanded.
  qualifications: verified("BHMS (Mumbai)"),
  registrationNumber: unknown<string>(),
  registrationAuthority: unknown<string>(),
  yearsOfPractice: unknown<number>(),

  // Confirmed by the requester on the clinic's behalf.
  phone: verified({ e164: "+919326553755", display: "+91 93265 53755" }),
  whatsapp: verified({ e164: "+919326553755" }),
  email: verified("atulbhale755@gmail.com"),

  // From the Google Maps listing; confirmed by the requester on the clinic's behalf.
  address: verified({
    street: "Room 123/8, Jay Bhavani Chowk, Bajaj Nagar, MIDC",
    locality: "Waluj, Wadgaon Kolhati",
    city: "Chhatrapati Sambhajinagar (Aurangabad)",
    state: "Maharashtra",
    postalCode: "431136",
  }),
  googleMapsUrl: verified("https://maps.app.goo.gl/jreE3mBGSzeZitmS8"),
  googleBusinessProfileUrl: unknown<string>(),

  // From the clinic's Google Business Profile (owner view screenshot): daily, two sessions.
  openingHours: verified<HoursBlock[]>([{ days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], ranges: [["09:30", "13:30"], ["17:00", "21:30"]] }]),
  weeklyHolidays: verified<string[]>([]), // none listed on Google profile (open all seven days)
  consultationFee: unknown<string>(),
  consultationDuration: unknown<string>(),
  languagesSpoken: unknown<string[]>(),
  onlineConsultation: unknown<boolean>(),
  socialProfiles: unknown<string[]>(),
} as const;

export type ClinicKey = keyof typeof clinic;

/** Returns a value only if it is safe to show publicly. */
export function publicValue<K extends ClinicKey>(key: K) {
  const f = clinic[key] as Field<unknown>;
  const isProd = process.env.NODE_ENV === "production";
  if (f.value === null) return null;
  if (f.status === "verified") return f.value as NonNullable<(typeof clinic)[K]["value"]>;
  return isProd ? null : (f.value as NonNullable<(typeof clinic)[K]["value"]>);
}

/** Used by the build: fails if any required field is not verified. */
export const REQUIRED_FOR_LAUNCH: ClinicKey[] = [
  "clinicName", "doctorName", "qualifications", "registrationNumber",
  "phone", "whatsapp", "address", "googleMapsUrl", "openingHours",
];
export function assertLaunchReady() {
  const bad = REQUIRED_FOR_LAUNCH.filter((k) => (clinic[k] as Field<unknown>).status !== "verified");
  if (bad.length) throw new Error(`Unverified clinic fields block launch: ${bad.join(", ")}`);
}

/** WhatsApp deep link with a context-aware message. Null until the number is verified (dev shows pending). */
export function whatsappLink(message: string): string | null {
  const num = publicValue("whatsapp");
  if (!num) return null;
  return `https://wa.me/${num.e164.replace("+", "")}?text=${encodeURIComponent(message)}`;
}
export function telLink(): string | null {
  const p = publicValue("phone");
  return p ? `tel:${p.e164}` : null;
}

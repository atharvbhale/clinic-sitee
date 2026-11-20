import Link from "next/link";
import { telLink, whatsappLink } from "@/config/clinic";
import { dict, type Locale } from "@/lib/i18n";
export const WA_GENERAL = "Hello, I would like to enquire about a consultation at Dr. Atul Bhale's clinic.";
export function CallButton({ className = "btn btn-outline", locale = "en" }: { className?: string; locale?: Locale }) {
  const href = telLink(); return href ? <a href={href} className={className}>{dict[locale].call}</a> : null;
}
export function WhatsAppButton({ message = WA_GENERAL, className = "btn btn-outline", locale = "en" }: { message?: string; className?: string; locale?: Locale }) {
  const href = whatsappLink(message);
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{dict[locale].whatsapp}</a> : null;
}
export function BookButton({ className = "btn btn-primary", locale = "en" }: { className?: string; locale?: Locale }) {
  return <Link href="/book" className={className}>{dict[locale].bookLong}</Link>;
}

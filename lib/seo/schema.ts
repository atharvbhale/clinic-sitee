import { clinic, publicValue } from "@/config/clinic";
const FULL = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" } as const;
import { siteUrl } from "@/lib/site";
/** JSON-LD built only from fields that are safe to show publicly (verified in production). No ratings, no reviews. */
export function clinicJsonLd() {
  const name = publicValue("clinicName"), a = publicValue("address"), p = publicValue("phone"), maps = publicValue("googleMapsUrl");
  if (!name) return null;
  const ld: Record<string, unknown> = { "@context": "https://schema.org", "@type": "MedicalClinic", name, url: siteUrl };
  if (p) ld.telephone = p.e164;
  if (maps) ld.hasMap = maps;
  if (a) ld.address = { "@type": "PostalAddress", streetAddress: a.street, addressLocality: a.city.replace(/\s*\(.*\)/, ""), addressRegion: a.state, postalCode: a.postalCode, addressCountry: "IN" };
  const hours = publicValue("openingHours");
  if (hours) ld.openingHoursSpecification = hours.flatMap((b) => b.ranges.map(([opens, closes]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: b.days.map((d) => FULL[d]), opens, closes })));
  return ld;
}
export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: siteUrl + c.href } : {}) })) };
}
/** Only for doctor-approved condition pages. */
export function conditionJsonLd(c: { name: string; slug: string; summary: string; reviewedOn?: string; faqs: { q: string; a: string }[] }) {
  const url = `${siteUrl}/conditions/${c.slug}`;
  return [
    { "@context": "https://schema.org", "@type": "MedicalWebPage", name: c.name, url, description: c.summary, lastReviewed: c.reviewedOn, reviewedBy: { "@type": "Person", name: clinic.doctorName.value } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
}

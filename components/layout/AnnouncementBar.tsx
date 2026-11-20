import { publicValue } from "@/config/clinic";
import { formatHours } from "@/lib/hours";
/** Shows verified opening hours only; renders nothing until they are verified. */
export function AnnouncementBar() {
  const text = formatHours(publicValue("openingHours"));
  if (!text) return null;
  return <p className="bg-emerald-950 px-5 py-2 text-center text-xs text-beige-50"><span aria-hidden className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold-500" />{text} · Waluj</p>;
}

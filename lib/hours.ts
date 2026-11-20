import type { Day, HoursBlock } from "@/config/clinic";
const ALL: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export function to12h(t: string) {
  const [h, m] = t.split(":").map(Number); const ap = h >= 12 ? "pm" : "am"; const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
}
/** Human-readable hours, e.g. "Daily: 9:30 am–1:30 pm, 5:00 pm–9:30 pm". Returns null if hours are not public. */
export function formatHours(blocks: HoursBlock[] | null | undefined): string | null {
  if (!blocks?.length) return null;
  return blocks.map((b) => {
    const label = ALL.every((d) => b.days.includes(d)) ? "Daily" : b.days.join(", ");
    return `${label}: ${b.ranges.map(([a, z]) => `${to12h(a)}–${to12h(z)}`).join(", ")}`;
  }).join(" · ");
}

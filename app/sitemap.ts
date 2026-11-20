import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { conditions } from "@/content/conditions";
import { LOCALES, LOCALE_REVIEWED, localeHome } from "@/lib/i18n";
export default function sitemap(): MetadataRoute.Sitemap {
  const core = ["/", "/about-doctor", "/approach", "/areas-of-practice", "/consultation", "/faqs", "/book", "/contact"];
  const cond = conditions.filter((c) => c.reviewStatus === "approved").map((c) => `/conditions/${c.slug}`);
  const loc = LOCALES.filter((l) => l !== "en" && LOCALE_REVIEWED[l]).map(localeHome);
  return [...core, ...cond, ...loc].map((p) => ({ url: siteUrl + (p === "/" ? "" : p) }));
}

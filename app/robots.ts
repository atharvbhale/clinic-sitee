import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  const preview = process.env.SITE_PRIVATE === "true" || (!!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production");
  if (preview) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin"] }, sitemap: `${siteUrl}/sitemap.xml` };
}

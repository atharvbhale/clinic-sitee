import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "./globals.css";
import { assertLaunchReady } from "@/config/clinic";
import { siteUrl } from "@/lib/site";

// Set LAUNCH_MODE=true for the production build: it fails while any required clinic fact is unverified.
if (process.env.LAUNCH_MODE === "true") assertLaunchReady();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Homeopathic Clinic in Waluj | Dr. Atul Bhale", template: "%s | Dr. Atul Bhale's Homeopathic Clinic" },
  description: "Considered homeopathic care in Waluj, Chhatrapati Sambhajinagar (Aurangabad). Personal consultations with Dr. Atul Bhale.",
  // SITE_PRIVATE=true keeps the whole site out of search engines until launch.
  ...(process.env.SITE_PRIVATE === "true" ? { robots: { index: false, follow: false } } : {}),
  openGraph: { type: "website", siteName: "Dr. Atul Bhale's Homeopathic Clinic", locale: "en_IN" },
};
export const viewport: Viewport = { themeColor: "#12362B", viewportFit: "cover" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { JsonLd } from "@/components/JsonLd";
import { clinicJsonLd } from "@/lib/seo/schema";
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (<div className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0"><JsonLd data={clinicJsonLd()} /><AnnouncementBar /><Header /><main id="main">{children}</main><Footer /><MobileActionBar /></div>);
}

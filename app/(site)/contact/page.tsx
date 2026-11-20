import type { Metadata } from "next";
import { publicValue } from "@/config/clinic";
import { formatHours } from "@/lib/hours";
import { PageHeader, Prose, DraftNotice, show } from "@/components/ui/PageHeader";
import { BookButton, CallButton, WhatsAppButton } from "@/components/layout/ActionLinks";
export const metadata: Metadata = { title: "Contact and Location", description: "Find Dr. Atul Bhale's homeopathic clinic at Bajaj Nagar, Waluj, Chhatrapati Sambhajinagar.", alternates: { canonical: "/contact" } };
export default function Page() {
  const a = publicValue("address"), p = publicValue("phone"), maps = publicValue("googleMapsUrl");
  return (<><PageHeader title="Visit the clinic" crumbs={[{ label: "Contact" }]} /><DraftNotice />
    <Prose>
      <h2>Address</h2>{a ? <address className="not-italic">{a.street}<br />{a.locality}<br />{a.city}, {a.state} {a.postalCode}</address> : <p>{show(null)}</p>}
      <h2>Phone</h2><p>{p?.display ?? show(null)}</p>
      <h2>Opening hours</h2><p>{show(formatHours(publicValue("openingHours")))}</p>
      <div className="flex flex-wrap gap-3">{maps && <a href={maps} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Get directions</a>}<CallButton /><WhatsAppButton message="Hello, I would like to know how to reach the clinic." /><BookButton className="btn btn-outline" /></div>
    </Prose></>);
}

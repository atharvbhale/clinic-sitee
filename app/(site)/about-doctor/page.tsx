import type { Metadata } from "next";
import { clinic, publicValue } from "@/config/clinic";
import { PageHeader, Prose, DraftNotice, show } from "@/components/ui/PageHeader";
import { BookButton } from "@/components/layout/ActionLinks";
export const metadata: Metadata = { title: "About Dr. Atul Bhale", description: "Dr. Atul Bhale, homeopathic doctor in Waluj, Chhatrapati Sambhajinagar (Aurangabad).", alternates: { canonical: "/about-doctor" } };
export default function Page() {
  const rows: [string, string][] = [["Qualifications", show(publicValue("qualifications"))], ["Registration number", show(publicValue("registrationNumber"))], ["Registering authority", show(publicValue("registrationAuthority"))], ["Years in practice", show(publicValue("yearsOfPractice")?.toString())]];
  return (<><PageHeader title={clinic.doctorName.value ?? "Dr. Atul Bhale"} eyebrow="About the doctor" crumbs={[{ label: "About" }]} /><DraftNotice />
    <Prose>
      <div role="img" aria-label="Photograph placeholder" className="flex aspect-[4/3] items-center justify-center border border-sage-100 bg-beige-100 text-sm text-moss">Portrait placeholder</div>
      <p>Dr. Atul Bhale runs a homeopathic practice at Bajaj Nagar, Waluj. A personal biography and philosophy of care will be added once written or approved by the doctor.</p>
      <h2>Credentials</h2>
      <dl className="divide-y divide-sage-100 border-y border-sage-100">{rows.map(([k, v]) => <div key={k} className="grid gap-1 py-3 sm:grid-cols-3"><dt className="text-moss">{k}</dt><dd className="sm:col-span-2">{v}</dd></div>)}</dl>
      <BookButton />
    </Prose></>);
}

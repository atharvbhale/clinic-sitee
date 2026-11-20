import type { Metadata } from "next";
import Link from "next/link";
import { conditions } from "@/content/conditions";
import { PageHeader, DraftNotice } from "@/components/ui/PageHeader";
export const metadata: Metadata = { title: "Areas of Practice", description: "Concerns people commonly consult about at Dr. Atul Bhale's homeopathic clinic in Waluj, Chhatrapati Sambhajinagar.", alternates: { canonical: "/areas-of-practice" } };
export default function Page() {
  return (<><PageHeader title="Areas of practice" crumbs={[{ label: "Conditions" }]} lead="Plain-language guides to concerns people commonly bring to the clinic. They are for information only and do not replace a medical assessment." /><DraftNotice />
    <ul className="mx-auto mt-10 grid max-w-6xl border-t border-gold-600/40 px-5 md:grid-cols-2 md:gap-x-12">
      {conditions.map((c, i) => <li key={c.slug} className="border-b border-sage-100"><Link href={`/conditions/${c.slug}`} className="block py-5 hover:underline"><span className="text-sm text-moss">0{i + 1}</span><span className="block font-display text-2xl text-emerald-900">{c.name}</span><span className="mt-1 block text-base text-moss">{c.summary}</span></Link></li>)}
    </ul></>);
}

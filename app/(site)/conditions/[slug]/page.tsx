import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { conditions, getCondition } from "@/content/conditions";
import { PageHeader } from "@/components/ui/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { conditionJsonLd } from "@/lib/seo/schema";
import { BookButton, WhatsAppButton } from "@/components/layout/ActionLinks";
export const dynamicParams = false;
export const generateStaticParams = () => conditions.map((c) => ({ slug: c.slug }));
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = getCondition((await params).slug); if (!c) return {};
  return { title: c.name, description: c.summary, alternates: { canonical: `/conditions/${c.slug}` }, robots: c.reviewStatus === "approved" ? undefined : { index: false, follow: false } };
}
export default async function ConditionPage({ params }: P) {
  const c = getCondition((await params).slug); if (!c) notFound();
  return (
    <>
      <PageHeader title={c.name} eyebrow="Understanding" lead={c.summary}
        crumbs={[{ label: "Conditions", href: "/areas-of-practice" }, { label: c.name }]} />
      {c.reviewStatus === "approved" && <JsonLd data={conditionJsonLd(c)} />}
      <article className="mx-auto max-w-6xl px-5 py-12"><div className="max-w-[42rem] space-y-5">
        <p className="inline-block border border-gold-600/50 px-3 py-1 text-sm text-moss">Doctor review: {c.reviewStatus === "approved" ? `Reviewed ${c.reviewedOn}` : "Pending review by Dr. Atul Bhale"}</p>
        <h2 className="mt-6 text-2xl">Who may be affected</h2><p>{c.who}</p>
        <h2 className="mt-6 text-2xl">What a consultation involves</h2>
        <p>The doctor listens to your history and how the problem affects you, then explains what he recommends. No outcome is guaranteed, and results differ from person to person.</p>
        <h2 className="mt-6 text-2xl">Limits of this approach</h2>
        <p>Homeopathic care is not a replacement for emergency care or for conventional treatment of serious conditions. Continue any prescribed medicines unless the prescribing doctor advises otherwise.</p>
        <aside className="border-l-4 border-emerald-700 bg-sage-100 p-5" aria-labelledby="rf"><h2 id="rf" className="!mt-0 text-xl">Seek urgent conventional care if</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">{c.redFlags.map((r) => <li key={r}>{r}</li>)}</ul><p className="mt-3 text-sm">In an emergency, call 112 or go to the nearest hospital.</p></aside>
        <h2 className="mt-6 text-2xl">Common questions</h2>
        {c.faqs.map((f) => <details key={f.q} className="border-b border-sage-100 py-3"><summary className="min-h-[44px] cursor-pointer font-medium">{f.q}</summary><p className="mt-2">{f.a}</p></details>)}
        <div className="flex flex-wrap gap-3 pt-6"><BookButton /><WhatsAppButton message={`Hello, I found your website and would like to enquire about a consultation regarding ${c.name.toLowerCase()}.`} /></div>
      </div></article>
    </>
  );
}

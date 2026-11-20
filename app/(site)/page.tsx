import type { Metadata } from "next";
import Link from "next/link";
import { LOCALES, LOCALE_REVIEWED } from "@/lib/i18n";
import { BookButton, CallButton, WhatsAppButton } from "@/components/layout/ActionLinks";
const reviewed = LOCALES.filter((l) => LOCALE_REVIEWED[l]);
export const metadata: Metadata = { alternates: { canonical: "/", ...(reviewed.length > 1 ? { languages: { ...Object.fromEntries(reviewed.map((l) => [l, l === "en" ? "/" : `/${l}`])), "x-default": "/" } } : {}) } };
const areas = [
  ["01","Skin"],["02","Allergies"],["03","Digestive concerns"],["04","Respiratory concerns"],["05","Joint pains"],["06","Common paediatric concerns"],
];
export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pt-12 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-7">
          <p className="eyebrow">Bajaj Nagar · Waluj · Chhatrapati Sambhajinagar</p>
          <h1 className="mt-4 text-5xl md:text-7xl">Considered homeopathic care, in the heart of Waluj.</h1>
          <p className="mt-6 max-w-[34rem] text-moss">Unhurried one-to-one consultations with Dr. Atul Bhale, with time to listen before any treatment is advised.</p>
          <div className="mt-8 flex flex-wrap gap-3"><BookButton /><WhatsAppButton /><CallButton /></div>
        </div>
        <div className="md:col-span-5">
          <div role="img" aria-label="Photograph placeholder" className="flex aspect-[4/5] items-center justify-center border border-sage-100 bg-beige-100 p-6 text-center text-sm text-moss">Photograph placeholder: replace with Dr. Bhale's portrait or the clinic (see photography checklist)</div>
        </div>
      </section>
      <section className="mx-auto mt-24 max-w-6xl px-5" aria-labelledby="areas">
        <p className="eyebrow">Areas of practice (proposed, pending doctor confirmation)</p>
        <h2 id="areas" className="mt-3 text-3xl md:text-4xl">Where we can help you think things through</h2>
        <ul className="mt-8 grid border-t border-gold-600/40 md:grid-cols-2 md:gap-x-12">
          {areas.map(([n, t]) => (
            <li key={n} className="border-b border-sage-100"><Link href="/areas-of-practice" className="flex min-h-[56px] items-baseline gap-4 py-4 hover:underline"><span className="text-sm text-moss">{n}</span><span className="font-display text-2xl text-emerald-900">{t}</span></Link></li>
          ))}
        </ul>
      </section>
      <section className="mt-24 bg-emerald-950 px-5 py-16 text-beige-50">
        <div className="mx-auto max-w-6xl"><span className="block h-px w-12 bg-gold-500" />
          <h2 className="mt-5 max-w-xl !text-beige-50 text-3xl md:text-4xl">Tell us what is troubling you. We will listen.</h2>
          <div className="mt-8 flex flex-wrap gap-3"><BookButton className="btn bg-beige-50 text-emerald-900 hover:bg-beige-100" /><WhatsAppButton className="btn border border-beige-50 text-beige-50 hover:bg-emerald-900" /><CallButton className="btn border border-beige-50 text-beige-50 hover:bg-emerald-900" /></div></div>
      </section>
    </>
  );
}

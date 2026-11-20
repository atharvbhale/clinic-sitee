import type { Metadata } from "next";
import Link from "next/link";
import { dict, LOCALE_REVIEWED, type Locale } from "@/lib/i18n";
import { BookButton, CallButton, WhatsAppButton } from "@/components/layout/ActionLinks";
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const l = (await params).locale as Locale, t = dict[l];
  return { title: t.heroTitle, description: t.heroLead, alternates: { canonical: `/${l}` }, robots: LOCALE_REVIEWED[l] ? undefined : { index: false, follow: false } };
}
export default async function LocaleHome({ params }: P) {
  const l = (await params).locale as Locale, t = dict[l];
  return (<>
    <section className="mx-auto max-w-6xl px-5 pt-12 md:pt-20">
      <h1 className="max-w-3xl text-4xl md:text-6xl">{t.heroTitle}</h1>
      <p className="mt-6 max-w-[34rem] text-moss">{t.heroLead}</p>
      <div className="mt-8 flex flex-wrap gap-3"><BookButton locale={l} /><WhatsAppButton locale={l} /><CallButton locale={l} /></div>
      <p className="mt-8 text-moss">{t.englishNote} <Link href="/" lang="en" className="underline">{t.englishLink}</Link></p>
      {process.env.NODE_ENV !== "production" && <p className="mt-6"><span className="dev-pending">Draft translation, needs native review</span></p>}
    </section>
    <section className="mt-24 bg-emerald-950 px-5 py-16 text-beige-50"><div className="mx-auto max-w-6xl"><span className="block h-px w-12 bg-gold-500" /><h2 className="mt-5 max-w-xl text-3xl !text-beige-50 md:text-4xl">{t.finalCta}</h2></div></section>
  </>);
}

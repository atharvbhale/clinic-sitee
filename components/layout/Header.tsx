import Link from "next/link";
import { dict, localeHome, type Locale } from "@/lib/i18n";
export const navHrefs = [["/about-doctor", "about"], ["/approach", "approach"], ["/areas-of-practice", "conditions"], ["/consultation", "consultation"], ["/faqs", "faqs"], ["/contact", "contact"]] as const;
export function Header({ locale = "en" }: { locale?: Locale }) {
  const t = dict[locale];
  return (
    <header className="sticky top-0 z-40 border-b border-sage-100 bg-beige-50/90 backdrop-blur-sm">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-white focus:p-3">{t.skip}</a>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href={localeHome(locale)} className="font-display text-xl text-emerald-900">Dr. Atul Bhale<span className="block font-sans text-[11px] uppercase tracking-[0.14em] text-moss">Homeopathic Clinic</span></Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 text-sm md:flex">
          {navHrefs.map(([h, k]) => <Link key={h} href={h} className="min-h-[44px] content-center hover:underline">{t[k]}</Link>)}
          <Link href="/book" className="btn btn-primary">{t.book}</Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="btn btn-outline cursor-pointer list-none">{t.menu}</summary>
          <nav aria-label="Mobile" className="absolute right-0 mt-2 w-64 border border-sage-100 bg-cream p-3 shadow-sm">
            {navHrefs.map(([h, k]) => <Link key={h} href={h} className="block min-h-[44px] py-2.5 font-display text-xl">{t[k]}</Link>)}
            <Link href="/book" className="btn btn-primary mt-2 w-full">{t.bookLong}</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

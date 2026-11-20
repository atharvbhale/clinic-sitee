import Link from "next/link";
import { clinic, publicValue } from "@/config/clinic";
import { dict, LOCALES, LOCALE_NAMES, localeHome, type Locale } from "@/lib/i18n";
import { navHrefs } from "./Header";
export function Footer({ locale = "en" }: { locale?: Locale }) {
  const a = publicValue("address"), p = publicValue("phone"), t = dict[locale];
  return (
    <footer className="mt-24 bg-emerald-950 text-beige-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div><p className="font-display text-2xl">{clinic.clinicName.value}</p><span className="mt-3 block h-px w-12 bg-gold-500" />
          {a && <address className="mt-4 text-sm not-italic opacity-90">{a.street}<br />{a.locality}<br />{a.city} {a.postalCode}</address>}
          {p && <p className="mt-3 text-sm">{p.display}</p>}</div>
        <nav aria-label="Footer" className="grid content-start gap-1 text-sm">{navHrefs.map(([h, k]) => <Link key={h} href={h} className="min-h-[44px] content-center hover:underline">{t[k]}</Link>)}</nav>
        <div className="text-sm opacity-90">
          <nav aria-label={t.language}><p className="eyebrow !text-gold-500">{t.language}</p>
            <ul className="mt-2 flex flex-wrap gap-x-4">{LOCALES.map((l) => <li key={l}><Link href={localeHome(l)} lang={l} hrefLang={l} aria-current={l === locale ? "true" : undefined} className={`inline-flex min-h-[44px] items-center hover:underline ${l === locale ? "underline" : ""}`}>{LOCALE_NAMES[l]}</Link></li>)}</ul></nav>
          <p className="mt-4">{t.disclaimer}</p>
          <p className="mt-4"><Link href="/privacy" className="underline">{t.privacy}</Link> · <Link href="/terms" className="underline">{t.terms}</Link></p></div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs opacity-70">© {new Date().getFullYear()} {clinic.clinicName.value}</p>
    </footer>
  );
}

import Link from "next/link";
import { telLink, whatsappLink } from "@/config/clinic";
import { dict, type Locale } from "@/lib/i18n";
import { WA_GENERAL } from "./ActionLinks";
export function MobileActionBar({ locale = "en" }: { locale?: Locale }) {
  const t = dict[locale], tel = telLink(), wa = whatsappLink(WA_GENERAL);
  const cls = "flex min-h-[48px] flex-1 items-center justify-center text-sm font-medium";
  return (
    <nav aria-label={t.quick} className="fixed inset-x-0 bottom-0 z-40 flex border-t border-sage-100 bg-cream pb-[env(safe-area-inset-bottom)] md:hidden">
      {tel && <a href={tel} className={`${cls} text-emerald-900`}>{t.call}</a>}
      {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className={`${cls} text-emerald-900`}>{t.whatsapp}</a>}
      <Link href="/book" className={`${cls} bg-emerald-900 text-white`}>{t.book}</Link>
    </nav>
  );
}

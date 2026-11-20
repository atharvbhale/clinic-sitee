import { notFound } from "next/navigation";
import "@fontsource-variable/noto-serif-devanagari";
import "@fontsource/mukta/400.css";
import "@fontsource/mukta/500.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { LOCALES, type Locale } from "@/lib/i18n";
export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.filter((l) => l !== "en").map((locale) => ({ locale }));
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale === "en" || !(LOCALES as readonly string[]).includes(locale)) notFound();
  const l = locale as Locale;
  // Element-level lang: the document root stays "en"; this subtree is declared in its own language.
  return (<div lang={l} className="lang-deva pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0"><Header locale={l} /><main id="main">{children}</main><Footer locale={l} /><MobileActionBar locale={l} /></div>);
}

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CallButton, WhatsAppButton } from "@/components/layout/ActionLinks";
export default function NotFound() {
  return (<><Header /><main id="main" className="mx-auto max-w-xl px-5 py-24">
    <p className="eyebrow">Error 404</p><h1 className="mt-3 text-4xl">We could not find that page</h1>
    <p className="mt-4 text-moss">The link may be old or mistyped. You can go back to the homepage, or contact the clinic directly.</p>
    <div className="mt-8 flex flex-wrap gap-3"><Link href="/" className="btn btn-primary">Homepage</Link><Link href="/areas-of-practice" className="btn btn-outline">Conditions</Link><CallButton /><WhatsAppButton /></div>
  </main><Footer /></>);
}

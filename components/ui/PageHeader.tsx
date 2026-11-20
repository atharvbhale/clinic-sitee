import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
export type Crumb = { label: string; href?: string };
export function PageHeader({ title, eyebrow, crumbs = [], lead }: { title: string; eyebrow?: string; crumbs?: Crumb[]; lead?: string }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-10 md:pt-16">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <nav aria-label="Breadcrumb" className="text-sm text-moss">
        <Link href="/" className="hover:underline">Home</Link>
        {crumbs.map((c) => <span key={c.label}> / {c.href ? <Link href={c.href} className="hover:underline">{c.label}</Link> : <span aria-current="page">{c.label}</span>}</span>)}
      </nav>
      {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
      <h1 className="mt-3 max-w-3xl text-4xl md:text-6xl">{title}</h1>
      {lead && <p className="mt-6 max-w-[40rem] text-moss">{lead}</p>}
    </div>
  );
}
export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-5 py-12"><div className="max-w-[42rem] space-y-5 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">{children}</div></div>;
}
export function DraftNotice() {
  if (process.env.NODE_ENV === "production") return null;
  return <p className="mx-auto mt-6 max-w-6xl px-5"><span className="dev-pending">Draft copy, pending doctor review</span></p>;
}
export const show = (v: string | null | undefined, fallback = "To be confirmed by the clinic") => v ?? fallback;

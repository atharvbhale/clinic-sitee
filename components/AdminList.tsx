"use client";
import Link from "next/link";
import { useState } from "react";
export type Row = { id: string; public_ref: string; name: string; phone_e164: string; category: string; preferred_date: string; preferred_time: string; status: string };
export function AdminList({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const n = q.trim().toLowerCase(), digits = q.replace(/\D/g, "");
  const shown = rows.filter((r) => !n || r.name.toLowerCase().includes(n) || (digits.length > 2 && r.phone_e164.includes(digits)));
  return (<div>
    <label htmlFor="q" className="text-sm font-medium">Search name or phone</label>
    <input id="q" value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 block min-h-[44px] w-full border border-emerald-700 bg-cream px-3" />
    {shown.length === 0 ? <p className="mt-6 text-moss">No enquiries match.</p> :
      <ul className="mt-4 divide-y divide-sage-100 border-y border-sage-100">{shown.map((r) => (
        <li key={r.id}><Link href={`/admin/enquiries/${r.id}`} className="flex min-h-[56px] flex-wrap items-center justify-between gap-2 py-3 hover:bg-sage-100">
          <span><strong>{r.name}</strong><span className="block text-sm text-moss">{r.public_ref} · {r.category}</span></span>
          <span className="text-right text-sm">{r.preferred_date} · {r.preferred_time}<span className="ml-2 border border-emerald-700 px-2 py-0.5 text-xs uppercase">{r.status}</span></span></Link></li>))}</ul>}
  </div>);
}

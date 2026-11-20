export const dynamic = "force-dynamic";
import { requireStaff } from "@/lib/admin/auth";
import { istDate, STATUSES } from "@/lib/validation/enquiry";
import { AdminList, type Row } from "@/components/AdminList";
const COLS = "id, public_ref, name, phone_e164, category, preferred_date, preferred_time, status, updated_at";
export default async function Dashboard({ searchParams }: { searchParams: Promise<{ status?: string; date?: string }> }) {
  const { supabase } = await requireStaff();
  const sp = await searchParams, today = istDate(0);
  const status = (STATUSES as readonly string[]).includes(sp.status ?? "") ? sp.status! : "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(sp.date ?? "") ? sp.date! : "";
  const count = async (f: (q: any) => any) => (await f(supabase.from("enquiries").select("id", { count: "exact", head: true }))).count ?? 0;
  const [nNew, nToday, nUpcoming, nPending] = await Promise.all([
    count((q) => q.eq("status", "new")),
    count((q) => q.eq("status", "confirmed").eq("preferred_date", today)),
    count((q) => q.eq("status", "confirmed").gt("preferred_date", today)),
    count((q) => q.in("status", ["new", "reviewed", "contacted"])),
  ]);
  let list = supabase.from("enquiries").select(COLS).order("preferred_date", { ascending: true }).limit(200);
  if (status) list = list.eq("status", status); if (date) list = list.eq("preferred_date", date);
  const [{ data: rows }, { data: recent }, { data: upcoming }] = await Promise.all([
    list,
    supabase.from("enquiries").select(COLS).order("updated_at", { ascending: false }).limit(5),
    supabase.from("enquiries").select(COLS).in("status", ["confirmed", "rescheduled"]).gte("preferred_date", today).order("preferred_date").order("preferred_time").limit(50),
  ]);
  const stats: [string, number][] = [["New enquiries", nNew], ["Today's appointments", nToday], ["Upcoming confirmed", nUpcoming], ["Pending confirmation", nPending]];
  const byDate = new Map<string, Row[]>(); for (const r of (upcoming ?? []) as Row[]) byDate.set(r.preferred_date, [...(byDate.get(r.preferred_date) ?? []), r]);
  return (<div className="space-y-12 py-8">
    <dl className="grid grid-cols-2 gap-px border border-sage-100 bg-sage-100 md:grid-cols-4">{stats.map(([l, n]) => <div key={l} className="bg-cream p-4"><dt className="text-sm text-moss">{l}</dt><dd className="font-display text-4xl text-emerald-900">{n}</dd></div>)}</dl>
    <section aria-labelledby="cal"><h2 id="cal" className="text-2xl">Upcoming appointments</h2>
      {byDate.size === 0 ? <p className="mt-3 text-moss">No confirmed appointments yet.</p> : [...byDate].map(([d, rs]) => <div key={d} className="mt-4"><h3 className="text-lg">{d}</h3><AdminList rows={rs} /></div>)}</section>
    <section aria-labelledby="recent"><h2 id="recent" className="text-2xl">Recently updated</h2><AdminList rows={(recent ?? []) as Row[]} /></section>
    <section aria-labelledby="all"><h2 id="all" className="text-2xl">All enquiries</h2>
      <form className="mt-3 flex flex-wrap items-end gap-3"><div><label htmlFor="status" className="text-sm font-medium">Status</label><select id="status" name="status" defaultValue={status} className="mt-1 block min-h-[44px] border border-emerald-700 bg-cream px-3"><option value="">All</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label htmlFor="date" className="text-sm font-medium">Preferred date</label><input id="date" name="date" type="date" defaultValue={date} className="mt-1 block min-h-[44px] border border-emerald-700 bg-cream px-3" /></div><button className="btn btn-primary">Filter</button></form>
      <div className="mt-4"><AdminList rows={(rows ?? []) as Row[]} /></div></section>
  </div>);
}

import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/admin/auth";
import { STATUSES } from "@/lib/validation/enquiry";
import { addNote, updateEnquiry } from "../../actions";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const box = "mt-1 block min-h-[44px] w-full border border-emerald-700 bg-cream px-3";
export default async function Detail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ e?: string; ok?: string }> }) {
  const { id } = await params, sp = await searchParams;
  if (!UUID.test(id)) notFound();
  const { supabase } = await requireStaff();
  const { data: r } = await supabase.from("enquiries").select("id, public_ref, name, phone_e164, category, preferred_date, preferred_time, patient_type, status, source_page, channel, created_at, updated_at").eq("id", id).maybeSingle();
  if (!r) notFound();
  const [{ data: notes }, { data: hist }] = await Promise.all([
    supabase.from("enquiry_notes").select("id, note, created_at").eq("enquiry_id", id).order("created_at", { ascending: false }),
    supabase.from("enquiry_status_history").select("id, from_status, to_status, changed_at").eq("enquiry_id", id).order("changed_at", { ascending: false }),
  ]);
  const wa = `https://wa.me/${r.phone_e164.replace("+", "")}?text=${encodeURIComponent(`Hello ${r.name}, this is Dr. Atul Bhale's clinic regarding your appointment request ${r.public_ref}.`)}`;
  return (<div className="space-y-10 py-8">
    <div><p className="eyebrow">{r.public_ref}</p><h1 className="mt-2 text-3xl">{r.name}</h1>
      {sp.ok && <p role="status" className="mt-3 border border-emerald-700 bg-sage-100 p-3">Saved.</p>}
      {sp.e && <p role="alert" className="mt-3 border border-red-800 p-3 text-red-800">Could not save. Please check the values and try again.</p>}</div>
    <dl className="grid gap-px border border-sage-100 bg-sage-100 sm:grid-cols-2">{([["Phone", r.phone_e164], ["Enquiry", r.category], ["Patient", r.patient_type], ["Source page", r.source_page], ["Channel", r.channel], ["Received", new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })]] as const).map(([k, v]) => <div key={k} className="bg-cream p-3"><dt className="text-sm text-moss">{k}</dt><dd>{v}</dd></div>)}</dl>
    <div className="flex flex-wrap gap-3"><a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">WhatsApp patient</a><a href={`tel:${r.phone_e164}`} className="btn btn-outline">Call</a></div>
    <form action={updateEnquiry} className="space-y-4"><h2 className="text-2xl">Status and schedule</h2><input type="hidden" name="id" value={r.id} />
      <div><label htmlFor="status" className="text-sm font-medium">Status</label><select id="status" name="status" defaultValue={r.status} className={box}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="preferredDate" className="text-sm font-medium">Date</label><input id="preferredDate" name="preferredDate" type="date" defaultValue={r.preferred_date} className={box} /></div>
        <div><label htmlFor="preferredTime" className="text-sm font-medium">Time preference</label><select id="preferredTime" name="preferredTime" defaultValue={r.preferred_time} className={box}>{["morning", "afternoon", "evening", "any"].map((t) => <option key={t}>{t}</option>)}</select></div></div>
      <button className="btn btn-primary">Save</button></form>
    <section><h2 className="text-2xl">Internal notes</h2>
      <form action={addNote} className="mt-3 space-y-3"><input type="hidden" name="id" value={r.id} /><label htmlFor="note" className="text-sm font-medium">Add a note (operational only; no medical details)</label><textarea id="note" name="note" required maxLength={2000} rows={3} className="block w-full border border-emerald-700 bg-cream p-3" /><button className="btn btn-outline">Add note</button></form>
      <ul className="mt-4 divide-y divide-sage-100">{(notes ?? []).map((n) => <li key={n.id} className="py-3"><p>{n.note}</p><p className="text-sm text-moss">{new Date(n.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p></li>)}</ul></section>
    <section><h2 className="text-2xl">Status history</h2>
      <ul className="mt-3 divide-y divide-sage-100">{(hist ?? []).length === 0 ? <li className="py-2 text-moss">No changes yet.</li> : (hist ?? []).map((h) => <li key={h.id} className="py-2 text-sm">{h.from_status} → {h.to_status} · {new Date(h.changed_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</li>)}</ul></section>
  </div>);
}

"use client";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type FormState } from "@/app/(site)/book/actions";
import { CATEGORIES } from "@/lib/validation/enquiry";
import { WhatsAppButton } from "@/components/layout/ActionLinks";

const init: FormState = { status: "idle" };
const input = "mt-1 block min-h-[44px] w-full border border-emerald-700 bg-cream px-3 py-2 text-base";
function Submit() { const { pending } = useFormStatus(); return <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60 sm:w-auto">{pending ? "Sending…" : "Send request"}</button>; }
function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return <div><label htmlFor={id} className="text-sm font-medium">{label}</label>{children}{error && <p id={`${id}-err`} className="mt-1 text-sm text-red-800">{error}</p>}</div>;
}
export function BookingForm() {
  const [state, action] = useActionState(submitEnquiry, init);
  const [range, setRange] = useState<{ min: string; max: string }>();
  useEffect(() => { const f = (n: number) => new Date(Date.now() + n * 864e5).toLocaleDateString("en-CA"); setRange({ min: f(0), max: f(60) }); }, []);
  const e = state.errors ?? {}, v = state.values ?? {};
  const a = (k: string) => ({ "aria-invalid": e[k] ? true : undefined, "aria-describedby": e[k] ? `${k}-err` : undefined });

  if (state.status === "success") return (
    <div role="status" className="border border-emerald-700 bg-sage-100 p-6">
      <h2 className="text-2xl">Request received</h2>
      <p className="mt-3">Your reference is <strong>{state.ref}</strong>. This is a request, not a confirmed appointment. The clinic will contact you to confirm a date and time.</p>
    </div>);
  return (
    <form action={action} className="space-y-5" noValidate>
      {state.status === "error" && state.message && <p role="alert" className="border border-red-800 bg-cream p-3 text-red-800">{state.message}</p>}
      <div aria-hidden="true" className="absolute -left-[9999px]"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <input type="hidden" name="source" value="/book" />
      <Field id="name" label="Patient name" error={e.name}><input id="name" name="name" required autoComplete="name" defaultValue={v.name} className={input} {...a("name")} /></Field>
      <Field id="phone" label="Mobile number" error={e.phone}><input id="phone" name="phone" type="tel" inputMode="numeric" required autoComplete="tel" placeholder="10-digit mobile number" defaultValue={v.phone} className={input} {...a("phone")} /></Field>
      <Field id="category" label="What is your enquiry about?" error={e.category}>
        <select id="category" name="category" required defaultValue={v.category ?? ""} className={input} {...a("category")}><option value="" disabled>Choose one</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="preferredDate" label="Preferred date" error={e.preferredDate}><input id="preferredDate" name="preferredDate" type="date" required min={range?.min} max={range?.max} defaultValue={v.preferredDate} className={input} {...a("preferredDate")} /></Field>
        <Field id="preferredTime" label="Preferred time" error={e.preferredTime}>
          <select id="preferredTime" name="preferredTime" required defaultValue={v.preferredTime ?? ""} className={input} {...a("preferredTime")}><option value="" disabled>Choose one</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option><option value="any">No preference</option></select></Field>
      </div>
      <Field id="patientType" label="Are you a new or returning patient?" error={e.patientType}>
        <select id="patientType" name="patientType" required defaultValue={v.patientType ?? ""} className={input} {...a("patientType")}><option value="" disabled>Choose one</option><option value="new">New patient</option><option value="returning">Returning patient</option></select></Field>
      <p className="text-sm text-moss">Please do not enter symptoms or medical details here. The clinic will contact you on this number about your request.</p>
      <div className="flex flex-wrap items-center gap-3"><Submit /><WhatsAppButton className="btn btn-outline" /></div>
    </form>);
}

import type { Metadata } from "next";
import { publicValue } from "@/config/clinic";
import { formatHours } from "@/lib/hours";
import { PageHeader, Prose, DraftNotice, show } from "@/components/ui/PageHeader";
import { BookButton, WhatsAppButton } from "@/components/layout/ActionLinks";
export const metadata: Metadata = { title: "Consultation", description: "What to expect when you consult Dr. Atul Bhale at the Waluj clinic: the steps, what to bring, fees and timings.", alternates: { canonical: "/consultation" } };
const steps = [["Enquiry", "Contact the clinic by WhatsApp, phone or the request form."], ["Initial consultation", "Meet the doctor and explain what is troubling you."], ["Case-taking", "The doctor asks about your history and how the problem affects you."], ["Doctor's assessment", "The doctor explains his assessment and recommendation."], ["Follow-up", "Review how you are doing and adjust care if needed."]];
export default function Page() {
  const hours = publicValue("openingHours"), fee = publicValue("consultationFee"), dur = publicValue("consultationDuration");
  return (<><PageHeader title="What to expect" crumbs={[{ label: "Consultation" }]} /><DraftNotice />
    <Prose>
      <ol className="space-y-4">{steps.map(([t, d], i) => <li key={t} className="flex gap-4 border-b border-sage-100 pb-4"><span className="font-display text-2xl text-emerald-700">{i + 1}</span><span><strong className="block">{t}</strong>{d}</span></li>)}</ol>
      <h2>Practical details</h2>
      <ul><li>Opening hours: {show(formatHours(hours))}</li><li>Consultation fee: {show(fee)}</li><li>Typical duration: {show(dur)}</li><li>Please bring previous reports and a list of your current medicines.</li></ul>
      <p>Requesting an appointment does not confirm it. The clinic will contact you to confirm.</p>
      <div className="flex flex-wrap gap-3"><BookButton /><WhatsAppButton /></div>
    </Prose></>);
}

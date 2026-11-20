import type { Metadata } from "next";
import { PageHeader, Prose, DraftNotice } from "@/components/ui/PageHeader";
export const metadata: Metadata = { title: "FAQs", description: "Answers to common questions about consulting Dr. Atul Bhale's homeopathic clinic in Waluj.", alternates: { canonical: "/faqs" } };
const faqs = [
  ["How do I request an appointment?", "Use the Book page, message the clinic on WhatsApp or call. A request is not a confirmed appointment; the clinic will contact you to confirm."],
  ["What does a consultation cost?", "The fee is being confirmed by the clinic. Please ask when you contact us."],
  ["Can I continue my current medicines?", "Yes. Do not stop prescribed medicines unless the doctor who prescribed them advises it."],
  ["Is homeopathy suitable for emergencies?", "No. In an emergency go to the nearest hospital or call 112."],
  ["What should I bring?", "Previous reports and a list of current medicines."],
  ["Do you offer online consultations?", "This is not currently listed. Please ask the clinic."],
];
export default function Page() {
  return (<><PageHeader title="Frequently asked questions" crumbs={[{ label: "FAQs" }]} /><DraftNotice />
    <Prose>{faqs.map(([q, a]) => <details key={q} className="border-b border-sage-100 py-3"><summary className="min-h-[44px] cursor-pointer font-medium">{q}</summary><p className="mt-2">{a}</p></details>)}</Prose></>);
}

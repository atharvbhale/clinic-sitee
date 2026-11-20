import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/ui/PageHeader";
export const metadata: Metadata = { title: "Privacy Policy", robots: { index: false }, alternates: { canonical: "/privacy" } };
export default function Page() {
  return (<><PageHeader title="Privacy Policy" crumbs={[{ label: "Privacy Policy" }]} lead="Draft for clinic and legal review before launch. Not yet approved." />
    <Prose>
      <h2>What we ask for</h2><p>For an appointment request we ask only your name, phone number, general enquiry category, preferred date and time, and whether you are a new or returning patient. Please do not send symptoms, medical history or reports through the form.</p>
      <h2>Why</h2><p>To contact you about your appointment request.</p>
      <h2>Your choices</h2><p>Contact the clinic to ask about, correct or delete your enquiry. Retention period and contact details to be completed by the clinic.</p>
    </Prose></>);
}

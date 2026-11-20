import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/ui/PageHeader";
export const metadata: Metadata = { title: "Terms and Conditions", robots: { index: false }, alternates: { canonical: "/terms" } };
export default function Page() {
  return (<><PageHeader title="Terms and Conditions" crumbs={[{ label: "Terms and Conditions" }]} lead="Draft for clinic and legal review before launch. Not yet approved." />
    <Prose>
      <h2>General information only</h2><p>Content on this website is general information and is not medical advice, diagnosis or treatment. It does not replace consultation with a qualified doctor.</p>
      <h2>Emergencies</h2><p>In an emergency go to the nearest hospital or call 112.</p>
      <h2>Appointments</h2><p>An online request is not a confirmed appointment until clinic staff confirm it.</p>
    </Prose></>);
}

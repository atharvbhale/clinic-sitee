import type { Metadata } from "next";
import { PageHeader, Prose, DraftNotice } from "@/components/ui/PageHeader";
export const metadata: Metadata = { title: "Our Approach", description: "How consultations work at Dr. Atul Bhale's homeopathic clinic in Waluj: personal case-taking, honest expectations and respect for conventional care.", alternates: { canonical: "/approach" } };
export default function Page() {
  return (<><PageHeader title="Our approach" crumbs={[{ label: "Approach" }]} lead="Personal, unhurried and honest about what homeopathy can and cannot do." /><DraftNotice />
    <Prose>
      <h2>Listening first</h2><p>Each consultation begins with your story: your symptoms, history and daily life. The doctor uses this to decide what care to recommend.</p>
      <h2>Honest expectations</h2><p>We do not promise cures or guaranteed results. How people respond varies, and scientific opinion on homeopathy is debated. Ask the doctor any questions you have.</p>
      <h2>Alongside conventional care</h2><ul><li>Homeopathy is not a substitute for emergency care.</li><li>Do not stop prescribed medicines without advice from the prescribing doctor.</li><li>Serious or worsening symptoms need prompt conventional evaluation.</li></ul>
    </Prose></>);
}

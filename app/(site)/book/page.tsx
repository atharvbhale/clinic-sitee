import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { BookingForm } from "@/components/BookingForm";
export const metadata: Metadata = { title: "Book an Appointment", description: "Request an appointment at Dr. Atul Bhale's homeopathic clinic in Waluj. The clinic will contact you to confirm.", alternates: { canonical: "/book" } };
export default function Page() {
  return (<><PageHeader title="Request an appointment" crumbs={[{ label: "Book" }]} lead="Send a request and the clinic will contact you to confirm. A request does not reserve a slot until it is confirmed." />
    <div className="mx-auto max-w-6xl px-5 py-10"><div className="max-w-[34rem]"><BookingForm /></div></div></>);
}

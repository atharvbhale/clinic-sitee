export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireStaff } from "@/lib/admin/auth";
import { signOut } from "./actions";
export default async function Protected({ children }: { children: React.ReactNode }) {
  await requireStaff();
  return (<div className="mx-auto max-w-5xl px-5 py-6">
    <header className="flex items-center justify-between border-b border-sage-100 pb-4"><Link href="/admin" className="font-display text-xl text-emerald-900">Clinic admin</Link>
      <form action={signOut}><button className="btn btn-outline">Sign out</button></form></header>{children}</div>);
}

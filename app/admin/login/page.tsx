import { redirect } from "next/navigation";
import { getUserClient } from "@/lib/supabase/server";
async function signIn(fd: FormData) {
  "use server";
  const supabase = await getUserClient();
  if (!supabase) redirect("/admin/login?e=config");
  const { error } = await supabase.auth.signInWithPassword({ email: String(fd.get("email") ?? "").trim(), password: String(fd.get("password") ?? "") });
  redirect(error ? "/admin/login?e=failed" : "/admin");
}
const msg: Record<string, string> = { failed: "Sign-in failed. Check your email and password.", denied: "This account does not have staff access.", config: "Admin sign-in is not configured." };
export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <main className="mx-auto max-w-sm px-5 py-20">
      <h1 className="text-3xl">Staff sign-in</h1>
      {e && msg[e] && <p role="alert" className="mt-4 border border-red-800 p-3 text-red-800">{msg[e]}</p>}
      <form action={signIn} className="mt-6 space-y-4">
        <div><label htmlFor="email" className="text-sm font-medium">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="mt-1 block min-h-[44px] w-full border border-emerald-700 bg-cream px-3" /></div>
        <div><label htmlFor="password" className="text-sm font-medium">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="mt-1 block min-h-[44px] w-full border border-emerald-700 bg-cream px-3" /></div>
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
    </main>);
}

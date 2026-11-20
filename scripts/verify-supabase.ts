// Run against your REAL Supabase project after applying the migration:
//   npx tsx --env-file=.env.local scripts/verify-supabase.ts
// It inserts one test enquiry (then deletes it) and confirms anonymous visitors cannot read or write.
export {};
const url = process.env.SUPABASE_URL, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anon || !svc) { console.error("Set SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY"); process.exit(2); }
const H = (k: string, extra = {}) => ({ apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json", ...extra });
let failed = 0;
const check = (name: string, ok: boolean, info = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${info ? " (" + info + ")" : ""}`); if (!ok) failed++; };

const body = { name: "Verify Script", phone_e164: "+919326553755", category: "Other", preferred_date: "2099-01-01", preferred_time: "any", patient_type: "new" };
const anonRead = await fetch(`${url}/rest/v1/enquiries?select=id`, { headers: H(anon) });
const anonRows = anonRead.ok ? await anonRead.json() : null;
check("anon cannot read enquiries", !anonRead.ok || (Array.isArray(anonRows) && anonRows.length === 0), `HTTP ${anonRead.status}`);
const anonWrite = await fetch(`${url}/rest/v1/enquiries`, { method: "POST", headers: H(anon), body: JSON.stringify(body) });
check("anon cannot insert enquiries", !anonWrite.ok, `HTTP ${anonWrite.status}`);
const roles = await fetch(`${url}/rest/v1/staff_roles?select=*`, { headers: H(anon) });
check("anon cannot read staff_roles", !roles.ok || (await roles.json()).length === 0, `HTTP ${roles.status}`);
const ins = await fetch(`${url}/rest/v1/enquiries`, { method: "POST", headers: H(svc, { Prefer: "return=representation" }), body: JSON.stringify(body) });
const created = ins.ok ? (await ins.json())[0] : null;
check("server (service role) can insert", !!created?.public_ref, created?.public_ref ?? `HTTP ${ins.status}`);
if (created) { const del = await fetch(`${url}/rest/v1/enquiries?id=eq.${created.id}`, { method: "DELETE", headers: H(svc) }); check("test row cleaned up", del.ok); }
console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed"); process.exit(failed ? 1 : 0);

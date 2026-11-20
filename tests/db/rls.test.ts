// Runs the real migration in an in-process Postgres (PGlite) with Supabase-like roles, then tests the security rules.
// This approximates Supabase; it does not replace a check on the real project (see PRE_LAUNCH_CHECKLIST.md).
import test, { before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
const STAFF = "11111111-1111-1111-1111-111111111111", OTHER = "22222222-2222-2222-2222-222222222222";
let enquiryId = "";
const row = (extra = "") => `insert into public.enquiries (name, phone_e164, category, preferred_date, preferred_time, patient_type, ip_hash${extra}) values ('Asha Patil','+919326553755','Skin','2026-12-01','morning','new','hash1'${extra ? "" : ""})`;

async function as<T>(role: string, sub: string | null, fn: () => Promise<T>): Promise<T> {
  await db.exec(`set role ${role}`); await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [sub ?? ""]);
  try { return await fn(); } finally { await db.exec("reset role"); }
}
const denied = async (p: Promise<unknown>, re = /permission denied|row-level security/i) => { await assert.rejects(p, re); };

before(async () => {
  await db.exec(`
    create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
    create schema auth; create table auth.users (id uuid primary key, email text);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated, service_role; grant select on auth.users to service_role;
    grant usage on schema public to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;`);
  await db.exec(readFileSync("supabase/migrations/0001_enquiries.sql", "utf8"));
  await db.exec(`insert into auth.users values ('${STAFF}','staff@x.test'),('${OTHER}','other@x.test'); insert into public.staff_roles values ('${STAFF}','admin');`);
});

test("anon has no access to any table", async () => {
  await as("anon", null, async () => {
    for (const t of ["enquiries", "enquiry_notes", "enquiry_status_history", "staff_roles"]) await denied(db.query(`select * from public.${t}`));
    await denied(db.exec(row()));
  });
});
test("service role can insert; reference ID is generated; constraints hold", async () => {
  await as("service_role", null, async () => {
    const r = await db.query<{ public_ref: string; status: string }>(`${row()} returning public_ref, status`);
    enquiryId = (await db.query<{ id: string }>(`select id from public.enquiries limit 1`)).rows[0].id;
    assert.match(r.rows[0].public_ref, /^ENQ-\d{4}-\d{6}$/); assert.equal(r.rows[0].status, "new");
    await assert.rejects(db.exec(`insert into public.enquiries (name, phone_e164, category, preferred_date, preferred_time, patient_type) values ('A','+911234567890','x','2026-12-01','morning','new')`), /violates check constraint/);
    await assert.rejects(db.exec(`insert into public.enquiries (name, phone_e164, category, preferred_date, preferred_time, patient_type, source_page) values ('Asha','+919326553755','x','2026-12-01','morning','new','http://evil')`), /violates check constraint/);
  });
});
test("signed-in user without a staff role sees nothing and changes nothing", async () => {
  await as("authenticated", OTHER, async () => {
    assert.equal((await db.query(`select id from public.enquiries`)).rows.length, 0);
    const u = await db.query(`update public.enquiries set status = 'confirmed'`); assert.equal(u.affectedRows, 0);
    await assert.rejects(db.exec(`insert into public.enquiry_notes (enquiry_id, author_id, note) values ('${enquiryId}', '${OTHER}', 'x')`), /row-level security/);
  });
});
test("staff can read enquiries but never ip_hash", async () => {
  await as("authenticated", STAFF, async () => {
    assert.equal((await db.query(`select id, name, phone_e164 from public.enquiries`)).rows.length, 1);
    await denied(db.query(`select ip_hash from public.enquiries`));
    await denied(db.query(`select * from public.enquiries`));
  });
});
test("staff can update only status/date/time; cannot delete or insert enquiries", async () => {
  await as("authenticated", STAFF, async () => {
    const u = await db.query(`update public.enquiries set status = 'confirmed', preferred_time = 'evening'`); assert.equal(u.affectedRows, 1);
    await denied(db.exec(`update public.enquiries set name = 'Hacked'`));
    await denied(db.exec(`update public.enquiries set ip_hash = 'x'`));
    await denied(db.exec(`delete from public.enquiries`));
    await denied(db.exec(row()));
    await assert.rejects(db.exec(`update public.enquiries set status = 'bogus'`), /invalid input value for enum/);
  });
});
test("status change is logged with the staff user", async () => {
  await as("authenticated", STAFF, async () => {
    const h = await db.query<{ from_status: string; to_status: string; changed_by: string }>(`select from_status, to_status, changed_by from public.enquiry_status_history`);
    assert.equal(h.rows.length, 1); assert.deepEqual([h.rows[0].from_status, h.rows[0].to_status, h.rows[0].changed_by], ["new", "confirmed", STAFF]);
  });
});
test("notes: staff can add as themselves, not as someone else; history is read-only", async () => {
  await as("authenticated", STAFF, async () => {
    await db.exec(`insert into public.enquiry_notes (enquiry_id, author_id, note) select id, '${STAFF}', 'Called, will visit' from public.enquiries`);
    await assert.rejects(db.exec(`insert into public.enquiry_notes (enquiry_id, author_id, note) select id, '${OTHER}', 'spoof' from public.enquiries`), /row-level security/);
    await denied(db.exec(`update public.enquiry_notes set note = 'edited'`));
    await denied(db.exec(`delete from public.enquiry_notes`));
    await denied(db.exec(`insert into public.enquiry_status_history (enquiry_id, to_status) select id, 'new' from public.enquiries`));
    assert.equal((await db.query(`select id from public.enquiry_notes`)).rows.length, 1);
  });
});
test("staff_roles: users see only their own role and cannot grant themselves access", async () => {
  await as("authenticated", OTHER, async () => {
    assert.equal((await db.query(`select * from public.staff_roles`)).rows.length, 0);
    await denied(db.exec(`insert into public.staff_roles values ('${OTHER}','admin')`));
  });
  await as("authenticated", STAFF, async () => { assert.equal((await db.query(`select * from public.staff_roles`)).rows.length, 1); });
});
test("updated_at moves forward on update", async () => {
  const r = await db.query<{ ok: boolean }>(`select updated_at > created_at as ok from public.enquiries`); assert.equal(r.rows[0].ok, true);
});

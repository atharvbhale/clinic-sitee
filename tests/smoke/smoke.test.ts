// HTTP-level smoke tests against a running production server: `BASE_URL=http://localhost:3113 npm run test:smoke`
import test from "node:test";
import assert from "node:assert/strict";
const BASE = process.env.BASE_URL ?? "http://localhost:3113";
const slugs = ["skin", "allergies", "digestive-concerns", "respiratory-concerns", "joint-pains", "paediatric-concerns"];
const pages = ["/", "/about-doctor", "/approach", "/areas-of-practice", "/consultation", "/faqs", "/book", "/contact", "/privacy", "/terms", "/hi", "/mr", ...slugs.map((s) => `/conditions/${s}`)];
const noindex = new Set(["/privacy", "/terms", "/hi", "/mr", ...slugs.map((s) => `/conditions/${s}`)]);
const cache = new Map<string, { status: number; html: string }>();
async function get(p: string) { if (!cache.has(p)) { const r = await fetch(BASE + p, { redirect: "manual" }); cache.set(p, { status: r.status, html: await r.text() }); } return cache.get(p)!; }

test("every page returns 200 with one h1, a title and a lang", async () => {
  for (const p of pages) { const { status, html } = await get(p);
    assert.equal(status, 200, p); assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, `${p} h1 count`); assert.match(html, /<title>[^<]+<\/title>/, p); assert.match(html, /<html lang="en"/, p); }
});
test("titles are unique", async () => {
  const titles = await Promise.all(pages.map(async (p) => (await get(p)).html.match(/<title>([^<]+)<\/title>/)![1]));
  assert.equal(new Set(titles).size, titles.length, titles.join(" | "));
});
test("every internal link resolves", async () => {
  const links = new Set<string>();
  for (const p of pages) for (const m of (await get(p)).html.matchAll(/href="(\/[^"#?]*)"/g)) links.add(m[1]);
  for (const l of links) { if (/^\/(_next|favicon)/.test(l)) continue; assert.equal((await get(l)).status, 200, `dead link ${l}`); }
});
test("draft and legal pages are noindex; public pages are indexable", async () => {
  for (const p of pages) { const has = /<meta name="robots" content="noindex/.test((await get(p)).html); assert.equal(has, noindex.has(p), `${p} noindex=${has}`); }
});
test("production HTML has no dev-only draft badges; contact links use only the confirmed number", async () => {
  for (const p of pages) { const { html } = await get(p);
    assert.doesNotMatch(html, /Draft copy, pending doctor review|Draft translation/, p);
    for (const m of html.matchAll(/wa\.me\/(\d+)/g)) assert.equal(m[1], "919326553755", `${p} wrong WhatsApp number`);
    for (const m of html.matchAll(/href="tel:([^"]+)"/g)) assert.equal(m[1], "+919326553755", `${p} wrong tel`); }
  assert.match((await get("/")).html, /wa\.me\/919326553755/); assert.match((await get("/contact")).html, /href="tel:\+919326553755"/);
});
test("no secrets in HTML", async () => { for (const p of pages) assert.doesNotMatch((await get(p)).html, /service_role|SUPABASE_SERVICE/i, p); });
test("admin is protected and not indexable", async () => {
  for (const p of ["/admin", "/admin/enquiries/00000000-0000-0000-0000-000000000000"]) { const r = await fetch(BASE + p, { redirect: "manual" }); assert.equal(r.status, 307, p); assert.match(r.headers.get("location") ?? "", /\/admin\/login/); }
  assert.match((await fetch(BASE + "/admin/login")).headers.get("x-robots-tag") ?? "", /noindex/);
});
test("sitemap excludes admin, drafts and noindex pages", async () => {
  const xml = await (await fetch(BASE + "/sitemap.xml")).text();
  for (const bad of ["/admin", "/conditions/", "/privacy", "/terms", "/hi", "/mr"]) assert.ok(!xml.includes(bad), bad);
});
test("unknown route is a 404", async () => { assert.equal((await fetch(BASE + "/nope")).status, 404); });

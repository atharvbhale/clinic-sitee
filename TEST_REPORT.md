# Test report (what was actually executed)
| Test | Result | Notes |
|---|---|---|
| TypeScript strict (`tsc --noEmit`) | Pass | |
| Production build | Pass | 24 pages generated |
| Unit tests: validation (7) | Pass | phone formats, name cleaning, dates, markup, category, source |
| Smoke tests (9) against production server | Pass | 200s, one h1, unique titles, no dead internal links, noindex rules, no dev badges, only the confirmed phone/WhatsApp number in links, no secrets in HTML, admin 307 + noindex header, sitemap exclusions, 404 |
| Launch guard (`LAUNCH_MODE=true` build) | Pass (fails as intended) | Now lists only `registrationNumber` |
| Admin route protection (signed out) | Pass | 307 to `/admin/login` |
| Contrast ratios computed from tokens | Pass | All pairs used meet AA; see below |
| Playwright e2e (written: `tests/e2e/site.spec.ts`) | **Not run** | Browser download is blocked in this environment |
| Lighthouse, device and throttled-network tests | **Not run** | |
| Migration + RLS rules (9) in in-process Postgres (PGlite) | Pass | anon blocked; staff column limits; ip_hash hidden; status history; notes author check; staff_roles self-grant blocked. Mutation-tested: removing a grant, RLS, or adding an anon grant each makes a test fail. Approximates Supabase, not the real project |
| Migration + RLS on the real Supabase project | **Not run** | Use `scripts/verify-supabase.ts` |
| Form submission to DB, rate limit, email | **Not run** | Validation paths covered by unit tests only |
| Admin sign-in, status updates, notes | **Not run** | |
| Screen-reader testing | **Not run** | |

## Contrast (computed)
ink/beige-50 15.22 · moss/beige-50 5.98 · moss/beige-100 5.48 · white/emerald-900 13.22 · white/emerald-700 7.85 · beige-50/emerald-950 14.83 (dossier said 13.58) · gold-500/emerald-950 6.06 · emerald-900/gold-500 5.01 · emerald-700/beige-100 6.67.

## Known finding
Photo placeholder boxes render in production builds. They are listed in the pre-launch checklist and must be replaced.

# Dr. Atul Bhale's Homeopathic Clinic: website and enquiry system

Next.js 15 (App Router), TypeScript strict, Tailwind, Supabase (Postgres + Auth + RLS), Resend (email). Hosting target: Vercel.

## Install and run
```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run typecheck && npm run build
```

## Single source of truth
All clinic facts live in `config/clinic.ts`. Each field is `verified`, `pending` or `unknown`.
- In development, pending values display so pages can be reviewed.
- In production builds, only `verified` values are shown. Unverified phone/WhatsApp links are hidden.
- `LAUNCH_MODE=true npm run build` fails while any required fact is unverified. Use it for the production build.
- To verify a fact: edit its entry from `pending(...)`/`unknown()` to `verified(...)` after the clinic confirms it.
See `CLINIC_DATA_REQUIRED.md` for what is missing.

## Environment variables (`.env.example`)
| Variable | Purpose | Secret |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap | no |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Server-side enquiry inserts | **service key is secret, server only** |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Staff sign-in | no (anon key is public by design) |
| `RATE_LIMIT_SALT` | Salt for hashing IPs | yes |
| `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | Email notification | yes |

## Supabase and database setup
1. Create a Supabase project (choose a region close to India).
2. Run `supabase/migrations/0001_enquiries.sql` in the SQL editor.
3. Follow `supabase/ADMIN_SETUP.md` (disable public sign-ups, create staff users, grant roles).
4. Follow `supabase/SUPABASE_SETUP.md`, then run `npx tsx --env-file=.env.local scripts/verify-supabase.ts` against your project.
5. The rules are also tested offline: `npm run test:db` runs the migration in an in-process Postgres.

## WhatsApp
Links use `wa.me` deep links built from `config/clinic.ts` (`whatsappLink()`), with context-aware prefilled messages. No API setup is needed. The WhatsApp Cloud API (automatic confirmations/reminders) is intentionally not implemented; add it only after the clinic approves message templates, and keep wording as "request received", never "confirmed".

## Email
Set the three Resend variables and verify the sender domain in Resend. If unset, requests are still saved and the notification is skipped. Check Admin regularly in that case.

## Admin
`/admin`: dashboard, appointment list by date, filters, search (in-page, no patient data in URLs), status updates with history, internal notes, WhatsApp/call buttons. Access requires a Supabase Auth user with a row in `staff_roles`.

## Languages
English at `/`; `/hi` and `/mr` hold a draft translated homepage. They stay noindex and out of hreflang until `LOCALE_REVIEWED` in `lib/i18n.ts` is set to `true` for that locale **after a native-speaker review**.

## Testing
```bash
npm run test:unit                                  # validation (node:test)
npm run test:db                                    # migration + row-level-security rules (in-process Postgres)
npm run build && npx next start -p 3113 &
BASE_URL=http://localhost:3113 npm run test:smoke  # HTTP smoke tests
npx playwright install chromium && npm run test:e2e   # browser tests (needs browser download)
```
See `TEST_REPORT.md` for what has actually been run.

## Deployment (Vercel)
1. Import the repo; set env vars (Production and Preview).
2. Set build command to `LAUNCH_MODE=true npm run build` for production only, after facts are verified.
3. Add the domain; set `NEXT_PUBLIC_SITE_URL` to it. Preview deployments are automatically disallowed in `robots.txt`.
4. Submit `/sitemap.xml` in Google Search Console. Claim and align the Google Business Profile (name spelling, address, phone).

## Maintenance
- Content: `content/conditions.ts` (set `reviewStatus: "approved"` and `reviewedOn` only after Dr. Bhale approves each page).
- Review backups (Supabase), delete old enquiries per the privacy policy once finalised, rotate keys when staff leave.
- Report real performance only from field data (Search Console/CrUX) after launch.

# Pre-launch checklist
## Facts (blocks launch; `LAUNCH_MODE=true` build enforces the first group)
- [x] Phone and WhatsApp confirmed
- [x] Address, map link, opening hours, weekly holiday confirmed
- [x] Qualification (BHMS, Mumbai) confirmed; add college/university and year
- [ ] Registration number, authority (and council link) verified. This is the only fact still blocking `LAUNCH_MODE=true`
- [ ] Years of practice, fee, duration, languages, online consultation status confirmed
- [ ] Google Business Profile name typo ("CLNIC") fixed; NAP matches the site
## Content
- [ ] Dr. Bhale reviews and approves each of the six condition pages (red-flag lists included); set `reviewStatus`/`reviewedOn`
- [ ] Approach, FAQs, consultation and About text approved; biography written
- [ ] Legal review of medical-advertising wording, Privacy and Terms (retention period, contact, consent); then remove `noindex` from them
- [ ] Hindi and Marathi reviewed by native speakers; set `LOCALE_REVIEWED`
- [ ] Remove "Photograph placeholder" boxes (they still render in production) and add real photos with alt text: portrait, consulting room, exterior, reception, remedy shelf
## Security (not yet tested)
- [x] Migration and rules pass offline (`npm run test:db`)
- [ ] Run the migration on a real Supabase project and `scripts/verify-supabase.ts` (all PASS)
- [ ] As anon: cannot select/insert/update any table (expect permission denied)
- [ ] As authenticated user without a staff role: reads nothing
- [ ] As staff: can update only status/date/time; cannot read `ip_hash`; status change writes history
- [ ] Public sign-ups disabled; staff accounts use strong passwords/MFA
- [ ] Service role key only in server env; confirm absent from client bundle
- [ ] Submit the form end to end; confirm row saved, duplicate suppressed, rate limit triggers, email arrives
## Quality (not yet done)
- [ ] Playwright suite passes on desktop and mobile projects
- [ ] Lighthouse mobile run; real-device test on mid-range Android and iPhone; throttled network
- [ ] Screen-reader pass (NVDA/VoiceOver); keyboard-only pass
- [ ] Privacy-conscious analytics chosen and events wired (WhatsApp, call, directions, form start/success); no PII sent
- [ ] Social share image added; structured data validated (Rich Results Test)

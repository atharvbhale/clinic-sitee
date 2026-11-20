# Supabase setup (about 15 minutes)
1. supabase.com > New project. Region: Mumbai (ap-south-1) if offered. Save the database password.
2. SQL Editor > New query > paste all of `migrations/0001_enquiries.sql` > Run. Expect "Success".
3. Authentication > Sign In / Providers > Email: turn OFF "Allow new users to sign up".
4. Authentication > Users > Add user: create the staff login (email + strong password; tick auto-confirm).
5. SQL Editor: grant access (replace the email):
   `insert into public.staff_roles (user_id, role) select id, 'admin' from auth.users where email = 'staff@example.com';`
6. Project Settings > API: copy Project URL, the `anon` key and the `service_role` key.
7. Put them in `.env.local` (see `.env.example`). Never commit `.env.local`; add `service_role` to Vercel as a server-only variable.
8. Verify: `npx tsx --env-file=.env.local scripts/verify-supabase.ts` (expects all PASS), then sign in at `/admin/login`.
9. Settings > Database > Backups: confirm the backup option for your plan (free plans have limited backups).

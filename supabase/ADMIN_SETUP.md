# Admin setup
1. Run `supabase/migrations/0001_enquiries.sql` in the Supabase SQL editor.
2. Supabase Auth: disable public sign-ups (Authentication > Providers > Email > turn off "Allow new users to sign up"); create staff users manually (Authentication > Users).
3. Grant staff access (replace the email):
   `insert into public.staff_roles (user_id, role) select id, 'admin' from auth.users where email = 'staff@example.com';`
4. Set the env vars from `.env.example`. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

create type public.enquiry_status as enum ('new','reviewed','contacted','confirmed','rescheduled','cancelled','completed');
create sequence public.enquiry_ref_seq;

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  public_ref text not null unique default ('ENQ-' || to_char(now() at time zone 'Asia/Kolkata','YYYY') || '-' || lpad(nextval('public.enquiry_ref_seq')::text, 6, '0')),
  name text not null check (char_length(name) between 2 and 80),
  phone_e164 text not null check (phone_e164 ~ '^\+91[6-9][0-9]{9}$'),
  category text not null check (char_length(category) <= 60),
  preferred_date date not null,
  preferred_time text not null check (preferred_time in ('morning','afternoon','evening','any')),
  patient_type text not null check (patient_type in ('new','returning')),
  status public.enquiry_status not null default 'new',
  source_page text not null default '/book' check (source_page ~ '^/[a-z0-9/_-]{0,60}$'),
  channel text not null default 'web_form',
  locale text not null default 'en',
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.enquiries (status, preferred_date);
create index on public.enquiries (phone_e164);
create index on public.enquiries (ip_hash, created_at);

create table public.enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  note text not null check (char_length(note) between 1 and 2000),
  created_at timestamptz not null default now()
);
create table public.enquiry_status_history (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  from_status public.enquiry_status, to_status public.enquiry_status not null,
  changed_by uuid, changed_at timestamptz not null default now()
);
create table public.staff_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('staff','admin'))
);

create function public.is_staff() returns boolean language sql stable security definer set search_path = '' as
$$ select exists (select 1 from public.staff_roles where user_id = auth.uid()) $$;

create function public.touch_updated_at() returns trigger language plpgsql as
$$ begin new.updated_at = now(); return new; end $$;
create trigger enquiries_touch before update on public.enquiries for each row execute function public.touch_updated_at();

create function public.log_status_change() returns trigger language plpgsql security definer set search_path = '' as
$$ begin
  if new.status is distinct from old.status then
    insert into public.enquiry_status_history (enquiry_id, from_status, to_status, changed_by) values (new.id, old.status, new.status, auth.uid());
  end if; return new; end $$;
create trigger enquiries_status_log after update on public.enquiries for each row execute function public.log_status_change();

alter table public.enquiries enable row level security;
alter table public.enquiry_notes enable row level security;
alter table public.enquiry_status_history enable row level security;
alter table public.staff_roles enable row level security;

-- Least privilege: nothing for anon; staff get only what the dashboard needs.
revoke all on public.enquiries, public.enquiry_notes, public.enquiry_status_history, public.staff_roles from anon, authenticated;
grant select (id, public_ref, name, phone_e164, category, preferred_date, preferred_time, patient_type, status, source_page, channel, locale, created_at, updated_at) on public.enquiries to authenticated;
grant update (status, preferred_date, preferred_time) on public.enquiries to authenticated;
grant select, insert on public.enquiry_notes to authenticated;
grant select on public.enquiry_status_history to authenticated;
grant select on public.staff_roles to authenticated;

create policy staff_read_enquiries on public.enquiries for select to authenticated using (public.is_staff());
create policy staff_update_enquiries on public.enquiries for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy staff_read_notes on public.enquiry_notes for select to authenticated using (public.is_staff());
create policy staff_add_notes on public.enquiry_notes for insert to authenticated with check (public.is_staff() and author_id = auth.uid());
create policy staff_read_history on public.enquiry_status_history for select to authenticated using (public.is_staff());
create policy own_role on public.staff_roles for select to authenticated using (user_id = auth.uid());
-- Public inserts happen only server-side via the service role after validation (no anon policy exists).

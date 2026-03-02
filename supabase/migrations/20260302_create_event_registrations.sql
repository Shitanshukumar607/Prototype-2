create table if not exists public.event_registrations (
  id bigserial primary key,
  department_id text not null,
  department_name text not null,
  event_key text not null,
  event_name text not null,
  team_size text not null,
  registration_fee numeric null,
  participants jsonb not null,
  submitted_at timestamptz not null default now()
);

create index if not exists idx_event_registrations_event_key
  on public.event_registrations (event_key);

create index if not exists idx_event_registrations_submitted_at
  on public.event_registrations (submitted_at desc);

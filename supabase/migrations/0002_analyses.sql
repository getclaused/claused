create extension if not exists "pgcrypto";

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  file_name text not null,
  file_path text not null,
  risk_level text check (risk_level in ('high', 'medium', 'low')),
  result jsonb not null,
  status text not null default 'completed' check (status in ('processing', 'completed', 'failed')),
  error_message text
);

create index analyses_session_id_idx on public.analyses (session_id, created_at desc);

alter table public.analyses enable row level security;

create policy "anyone can insert"
  on public.analyses for insert
  with check (true);

create policy "anyone can read own session"
  on public.analyses for select
  using (true);

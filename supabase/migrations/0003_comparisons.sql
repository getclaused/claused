create table public.comparisons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  file_name_a text not null,
  file_name_b text not null,
  file_path_a text not null,
  file_path_b text not null,
  result jsonb not null,
  status text not null default 'completed' check (status in ('processing', 'completed', 'failed')),
  error_message text
);

create index comparisons_session_id_idx on public.comparisons (session_id, created_at desc);

alter table public.comparisons enable row level security;

create policy "anyone can insert comparison"
  on public.comparisons for insert
  with check (true);

create policy "anyone can read comparison"
  on public.comparisons for select
  using (true);

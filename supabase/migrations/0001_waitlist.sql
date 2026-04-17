create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  occupation text check (occupation in ('freelancer', 'startup', 'smb', 'inhouse', 'other')),
  source text default 'landing',
  created_at timestamptz default now(),
  confirmed_at timestamptz,
  ip_address inet,
  user_agent text
);

create index idx_waitlist_email on waitlist(email);
create index idx_waitlist_created on waitlist(created_at desc);

alter table waitlist enable row level security;

-- 익명 사용자는 insert만 가능 (중복 방지는 unique 제약으로)
create policy "anon_can_insert_waitlist"
  on waitlist for insert
  to anon
  with check (true);

-- 아무도 읽기 불가 (service_role만 가능)
-- 관리자 대시보드는 service_role로 접근

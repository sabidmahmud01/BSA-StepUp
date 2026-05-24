create table if not exists public.bsa_tracks (
  id text primary key,
  track jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.bsa_participants (
  id text primary key,
  name text not null,
  category text not null,
  miles_passed double precision not null default 0,
  finished boolean not null default false,
  live boolean not null default false,
  position jsonb,
  updated_at timestamptz not null default now()
);

alter table public.bsa_tracks enable row level security;
alter table public.bsa_participants enable row level security;

drop policy if exists "public read tracks" on public.bsa_tracks;
drop policy if exists "public write tracks" on public.bsa_tracks;
drop policy if exists "public read participants" on public.bsa_participants;
drop policy if exists "public write participants" on public.bsa_participants;

create policy "public read tracks"
on public.bsa_tracks for select
using (true);

create policy "public write tracks"
on public.bsa_tracks for all
using (true)
with check (true);

create policy "public read participants"
on public.bsa_participants for select
using (true);

create policy "public write participants"
on public.bsa_participants for all
using (true)
with check (true);

alter publication supabase_realtime add table public.bsa_tracks;
alter publication supabase_realtime add table public.bsa_participants;

-- Run this once in Supabase → SQL Editor
-- Creates the user_data table for syncing app state per user

create table if not exists public.user_data (
  id uuid references auth.users on delete cascade not null primary key,
  data jsonb default '{}'::jsonb not null,
  updated_at timestamptz default now() not null
);

alter table public.user_data enable row level security;

-- Each user can only read/write their own row
drop policy if exists "own_read"   on public.user_data;
drop policy if exists "own_insert" on public.user_data;
drop policy if exists "own_update" on public.user_data;

create policy "own_read"   on public.user_data for select using (auth.uid() = id);
create policy "own_insert" on public.user_data for insert with check (auth.uid() = id);
create policy "own_update" on public.user_data for update using (auth.uid() = id);

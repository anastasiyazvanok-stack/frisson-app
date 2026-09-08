begin;
-- RLS for meditations table
alter table if exists public.meditations enable row level security;

-- Anyone can read active meditations
drop policy if exists "public_read_meditations" on public.meditations;
create policy "public_read_meditations"
  on public.meditations for select
  using (active = true or auth.jwt() ->> 'email' = 'anastasiyazvanok@gmail.com');

-- Only admin can insert/update/delete
drop policy if exists "admin_write_meditations" on public.meditations;
create policy "admin_write_meditations"
  on public.meditations for all
  using (auth.jwt() ->> 'email' = 'anastasiyazvanok@gmail.com')
  with check (auth.jwt() ->> 'email' = 'anastasiyazvanok@gmail.com');

-- RLS for sections table
alter table if exists public.sections enable row level security;

drop policy if exists "public_read_sections" on public.sections;
create policy "public_read_sections"
  on public.sections for select
  using (active = true or auth.jwt() ->> 'email' = 'anastasiyazvanok@gmail.com');

drop policy if exists "admin_write_sections" on public.sections;
create policy "admin_write_sections"
  on public.sections for all
  using (auth.jwt() ->> 'email' = 'anastasiyazvanok@gmail.com')
  with check (auth.jwt() ->> 'email' = 'anastasiyazvanok@gmail.com');

commit;

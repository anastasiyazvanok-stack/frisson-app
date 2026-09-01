-- RLS for meditations table
alter table if exists public.meditations enable row level security;

-- Anyone can read active meditations
create policy if not exists "public_read_meditations"
  on public.meditations for select
  using (true);

-- Only admin can insert/update/delete
create policy if not exists "admin_write_meditations"
  on public.meditations for all
  using (auth.jwt() ->> 'email' = 'anastasiyazvanok@gmail.com')
  with check (auth.jwt() ->> 'email' = 'anastasiyazvanok@gmail.com');

-- RLS for sections table
alter table if exists public.sections enable row level security;

create policy if not exists "public_read_sections"
  on public.sections for select
  using (true);

create policy if not exists "admin_write_sections"
  on public.sections for all
  using (auth.jwt() ->> 'email' = 'anastasiyazvanok@gmail.com')
  with check (auth.jwt() ->> 'email' = 'anastasiyazvanok@gmail.com');

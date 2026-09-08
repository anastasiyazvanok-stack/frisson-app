-- Run in Supabase SQL Editor before enabling the updated AI endpoints.
-- Shared, atomic quota: 20 requests/minute and 100/day per authenticated user.
begin;
create table if not exists public.ai_usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  minute_start timestamptz not null,
  day_start timestamptz not null,
  minute_count integer not null,
  day_count integer not null
);
alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon, authenticated;
create or replace function public.consume_ai_quota() returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  caller uuid := auth.uid();
  current_minute timestamptz := date_trunc('minute', now());
  current_day timestamptz := date_trunc('day', now() at time zone 'UTC') at time zone 'UTC';
  accepted uuid;
begin
  if caller is null then return false; end if;
  insert into public.ai_usage as usage (user_id, minute_start, day_start, minute_count, day_count)
  values (caller, current_minute, current_day, 1, 1)
  on conflict (user_id) do update set
    minute_start = current_minute,
    day_start = current_day,
    minute_count = case when usage.minute_start = current_minute then usage.minute_count + 1 else 1 end,
    day_count = case when usage.day_start = current_day then usage.day_count + 1 else 1 end
  where (usage.minute_start <> current_minute or usage.minute_count < 20)
    and (usage.day_start <> current_day or usage.day_count < 100)
  returning user_id into accepted;
  return accepted is not null;
end;
$$;
revoke all on function public.consume_ai_quota() from public, anon;
grant execute on function public.consume_ai_quota() to authenticated;
commit;

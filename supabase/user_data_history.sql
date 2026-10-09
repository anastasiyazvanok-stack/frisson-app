-- Applied using the Supabase migration API. Daily pre-update account snapshots,
-- retained for 30 days on subsequent writes. This is not an off-site DB backup.
create schema if not exists nectar_internal_history;
revoke all on schema nectar_internal_history from public, anon, authenticated;
create table public.user_data_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  snapshot_day date not null,
  data jsonb not null,
  source_updated_at timestamptz,
  captured_at timestamptz not null default now(),
  primary key (user_id,snapshot_day)
);
alter table public.user_data_history enable row level security;
revoke all on public.user_data_history from public, anon, authenticated;
grant select on public.user_data_history to authenticated;
create policy own_history_read on public.user_data_history for select to authenticated
using ((select auth.uid())=user_id);
create function nectar_internal_history.capture_user_data_history() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is not null and auth.uid() <> old.id then
    raise exception 'Account mismatch' using errcode='42501';
  end if;
  if old.data is distinct from new.data then
    insert into public.user_data_history(user_id,snapshot_day,data,source_updated_at)
    values(old.id,(now() at time zone 'UTC')::date,old.data,old.updated_at)
    on conflict(user_id,snapshot_day) do nothing;
    delete from public.user_data_history where user_id=old.id
      and snapshot_day < (now() at time zone 'UTC')::date - 30;
  end if;
  return new;
end;
$$;
revoke all on function nectar_internal_history.capture_user_data_history() from public,anon,authenticated;
create trigger capture_user_data_history before update on public.user_data
for each row execute function nectar_internal_history.capture_user_data_history();
-- Preserve the current state now, entirely within the database.
insert into public.user_data_history(user_id,snapshot_day,data,source_updated_at)
select id,(now() at time zone 'UTC')::date,data,updated_at from public.user_data
on conflict(user_id,snapshot_day) do nothing;


begin;
create table public.member_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  trial_until timestamptz,
  paid_until timestamptz,
  updated_at timestamptz not null default now()
);
create table public.beta_invitations (
  email text primary key check(email = lower(trim(email))),
  trial_until timestamptz not null,
  claimed_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.member_access enable row level security;
alter table public.beta_invitations enable row level security;
revoke all on public.member_access, public.beta_invitations from public, anon, authenticated;
grant select on public.member_access to authenticated;
create policy member_reads_own_access on public.member_access for select to authenticated
  using ((select auth.uid()) = user_id);
grant all on public.member_access, public.beta_invitations to service_role;

-- Paid entitlement is written only by a trusted backend after payment verification.
-- Invitations never give access to a different account after being claimed.
create function public.get_member_access() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  caller uuid := auth.uid();
  verified_email text;
  membership public.member_access%rowtype;
  invite public.beta_invitations%rowtype;
begin
  if caller is null then raise exception 'Sign in required' using errcode='42501'; end if;
  if exists(select 1 from public.profiles where id=caller and is_admin=true) then
    return jsonb_build_object('active',true,'status','admin','expires_at',null);
  end if;
  select lower(email) into verified_email from auth.users where id=caller and email_confirmed_at is not null;
  select * into invite from public.beta_invitations where email=verified_email for update;
  if found and invite.claimed_by is null then
    update public.beta_invitations set claimed_by=caller where email=verified_email;
    insert into public.member_access(user_id,trial_until) values(caller,invite.trial_until)
      on conflict(user_id) do update set trial_until=greatest(member_access.trial_until,excluded.trial_until),updated_at=now();
  end if;
  select * into membership from public.member_access where user_id=caller;
  if membership.paid_until > now() then
    return jsonb_build_object('active',true,'status','paid','expires_at',membership.paid_until);
  elsif membership.trial_until > now() then
    return jsonb_build_object('active',true,'status','trial','expires_at',membership.trial_until);
  end if;
  return jsonb_build_object('active',false,'status',case when membership.user_id is null then 'invitation_required' else 'expired' end,
    'expires_at',greatest(membership.paid_until,membership.trial_until));
end;
$$;
revoke all on function public.get_member_access() from public,anon;
grant execute on function public.get_member_access() to authenticated;

create function public.grant_beta_access(participant_email text, expires_at timestamptz) returns void
language plpgsql security definer set search_path = '' as $$
declare
  normalized text := lower(trim(participant_email));
  bound_user uuid;
begin
  if not exists(select 1 from public.profiles where id=auth.uid() and is_admin=true) then
    raise exception 'Administrator required' using errcode='42501';
  end if;
  if normalized is null or length(normalized)>254 or normalized !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    or expires_at is null or expires_at<=now() or expires_at>now()+interval '366 days' then
    raise exception 'Valid email and future expiry within 366 days required';
  end if;
  insert into public.beta_invitations(email,trial_until) values(normalized,expires_at)
    on conflict(email) do update set trial_until=excluded.trial_until,updated_at=now()
    returning claimed_by into bound_user;
  if bound_user is not null then
    insert into public.member_access(user_id,trial_until) values(bound_user,expires_at)
      on conflict(user_id) do update set trial_until=excluded.trial_until,updated_at=now();
  end if;
end;
$$;
revoke all on function public.grant_beta_access(text,timestamptz) from public,anon;
grant execute on function public.grant_beta_access(text,timestamptz) to authenticated;
commit;

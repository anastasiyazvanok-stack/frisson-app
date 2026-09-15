alter table public.beta_invitations add column if not exists trial_starts_at timestamptz;
alter table public.member_access add column if not exists trial_starts_at timestamptz;
create or replace function public.get_member_access() returns jsonb
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
  if found and (invite.claimed_by is null or invite.claimed_by=caller) then
    update public.beta_invitations set claimed_by=caller where email=verified_email and claimed_by is null;
    insert into public.member_access(user_id,trial_until,trial_starts_at)
      values(caller,invite.trial_until,invite.trial_starts_at)
      on conflict(user_id) do update set trial_until=excluded.trial_until,trial_starts_at=excluded.trial_starts_at,updated_at=now();
  end if;
  select * into membership from public.member_access where user_id=caller;
  if membership.paid_until > now() then
    return jsonb_build_object('active',true,'status','paid','expires_at',membership.paid_until);
  elsif membership.trial_until > now() then
    return jsonb_build_object('active',membership.trial_starts_at is null or membership.trial_starts_at<=now(),
      'status',case when membership.trial_starts_at>now() then 'scheduled' else 'trial' end,
      'starts_at',membership.trial_starts_at,'expires_at',membership.trial_until);
  end if;
  return jsonb_build_object('active',false,'status',case when membership.user_id is null then 'invitation_required' else 'expired' end,
    'expires_at',greatest(membership.paid_until,membership.trial_until));
end;
$$;
revoke all on function public.get_member_access() from public,anon;
grant execute on function public.get_member_access() to authenticated;

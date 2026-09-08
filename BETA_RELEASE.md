# Beta release

Implemented: permanent account-scoped cloud data, administrator email invitations with explicit expiry, server-derived trial/paid access, a same-origin audio cookie, audio middleware, AI entitlement checks, and continued journal/profile access after expiry. Payments are intentionally unavailable. A future verified payment webhook must write paid_until for the existing user_id; it must never replace user_data.

The beta_access migration was applied and transactionally checked with synthetic users. Expiry and paid reactivation preserved the synthetic user_data row. Unauthenticated grants and direct client entitlement writes are denied. Synthetic test data was rolled back.

Before inviting testers:
1. Verify a preview with the owner account, using Admin to grant a second verified email a future expiry.
2. Check audio, cross-device diary sync, expiry, password recovery, and logout.
3. Confirm Supabase backup retention and recovery in the dashboard; this has not been verified through the available connector.
4. Establish an authenticated audio build source before publishing: the current build fetches missing original recordings from the existing production site. Once middleware protects that site, clean future builds need AUDIO_SOURCE_URL and optionally AUDIO_BUILD_TOKEN, or all verified MP3s present locally. Do not remove protection to make a build succeed.
5. Native iOS and GitHub Pages deployment are not supported by this same-origin web entitlement implementation.

No participant emails have been entered and no invitations have been sent.

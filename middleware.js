import { next } from '@vercel/functions';
import { memberAccess } from './server/member-access.js';

export const config = { matcher: ['/audio/:path*'], runtime: 'nodejs' };
export async function checkAudioRequest(request, check = memberAccess) {
  const token = request.headers.get('authorization')?.match(/^Bearer (\S{1,8192})$/i)?.[1] || request.headers.get('cookie')?.split(';').map(s => s.trim())
    .find(s => s.startsWith('__Secure-frisson-audio='))?.slice('__Secure-frisson-audio='.length);
  const result = await check(token);
  const headers = { 'Cache-Control': 'private, no-store', 'Vercel-CDN-Cache-Control': 'no-store' };
  if (result.status !== 200) return new Response('Sign in or retry', { status: result.status, headers });
  if (!result.access.active) return new Response('Access expired', { status: 403, headers });
  return next({ headers });
}
export default checkAudioRequest;

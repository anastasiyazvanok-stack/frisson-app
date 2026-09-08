import { memberAccess } from '../server/member-access.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  // This web release uses a same-origin HttpOnly audio cookie.
  const origin = req.headers.origin;
  if (origin && origin !== `https://${req.headers.host}`) return res.status(403).end();
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', '__Secure-frisson-audio=; Path=/audio; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).end();
  const token = req.headers.authorization?.match(/^Bearer (\S{1,8192})$/i)?.[1];
  const result = await memberAccess(token);
  if (result.status !== 200) return res.status(result.status).json({ error: 'Access check unavailable' });
  res.setHeader('Set-Cookie', `__Secure-frisson-audio=${result.access.active ? token : ''}; Path=/audio; HttpOnly; Secure; SameSite=Strict; Max-Age=${result.access.active ? 300 : 0}`);
  return res.status(200).json(result.access);
}

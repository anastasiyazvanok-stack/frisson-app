import { readFile, mkdir, writeFile, rename, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
export function verifyRecording(bytes, entry) {
  if (bytes.length !== entry.bytes || createHash('sha256').update(bytes).digest('hex') !== entry.sha256) {
    throw new Error(`Recording integrity check failed: ${entry.file}`);
  }
}

// Preserve audio already served by the production site across Git-based deployments.
// Recordings remain deployment assets, never files committed to the public repository.
export async function ensureAudio() {
  const manifest = JSON.parse(await readFile(path.join(root, 'scripts/audio-manifest.json'), 'utf8'));
  const dir = path.join(root, 'public/audio');
  await mkdir(dir, { recursive: true });
  for (const entry of manifest) {
    if (path.basename(entry.file) !== entry.file) throw new Error('Invalid recording filename');
    const target = path.join(dir, entry.file);
    try {
      verifyRecording(await readFile(target), entry);
      continue;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const source = process.env.AUDIO_SOURCE_URL || 'https://frisson-app.vercel.app/audio';
    if (!source.startsWith('https://')) throw new Error('Audio build source must use HTTPS');
    const response = await fetch(`${source.replace(/\/$/, '')}/${encodeURIComponent(entry.file)}`, {
      signal: AbortSignal.timeout(120000),
      headers: process.env.AUDIO_BUILD_TOKEN ? { Authorization: `Bearer ${process.env.AUDIO_BUILD_TOKEN}` } : {},
    });
    if (!response.ok || !response.headers.get('content-type')?.includes('audio/')) {
      throw new Error(`Cannot preserve recording ${entry.file}: HTTP ${response.status}`);
    }
    const chunks = [];
    let size = 0;
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > entry.bytes) throw new Error(`Recording exceeds expected size: ${entry.file}`);
      chunks.push(chunk);
    }
    const bytes = Buffer.concat(chunks);
    verifyRecording(bytes, entry);
    const temporary = `${target}.${process.pid}.tmp`;
    try {
      await writeFile(temporary, bytes);
      await rename(temporary, target);
    } finally {
      await rm(temporary, { force: true });
    }
  }
}

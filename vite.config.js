import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export default defineConfig(() => {
  const base = process.env.APP_BASE_PATH || '/';
  if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('APP_BASE_PATH must start and end with /');
  const audioDir = path.resolve('public/audio');
  const audioFiles = fs.existsSync(audioDir) ? fs.readdirSync(audioDir) : [];
  return {
    base,
    define: { 'import.meta.env.LOCAL_AUDIO_FILES': JSON.stringify(audioFiles) },
    plugins: [react(), {
      name: 'offline-app-shell',
      writeBundle(options, bundle) {
        const entries = ['index.html', ...Object.keys(bundle).filter(file => /\.(js|css)$/.test(file))];
        const urls = entries.map(file => base + file);
        const version = createHash('sha256').update(JSON.stringify(urls)).digest('hex').slice(0, 12);
        const source = fs.readFileSync('public/sw.js', 'utf8')
          .replace('const PRECACHE = [];', `const PRECACHE = ${JSON.stringify(urls)};`)
          .replace('frisson-shell-development', `frisson-shell-${version}`);
        fs.writeFileSync(path.join(options.dir, 'sw.js'), source);
      },
    }],
  };
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ensureAudio } from './scripts/preserve-audio.mjs';

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  if (command === "build") await ensureAudio();
  return {
  plugins: [react()],
  base: '/',
  };
})

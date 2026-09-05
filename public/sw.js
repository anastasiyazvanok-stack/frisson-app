// Build injects an explicit public app-shell allowlist. Never cache API responses.
const PRECACHE = [];
const CACHE_NAME = 'frisson-shell-development';
const SHELL_URL = new URL('index.html', self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith('frisson-shell-') && key !== CACHE_NAME)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.includes('/api/')) return;
  if (event.request.mode === 'navigate' && url.href.startsWith(self.registration.scope)) {
    event.respondWith(fetch(event.request).catch(() => caches.match(SHELL_URL)));
  } else if (PRECACHE.includes(url.pathname)) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
  }
});

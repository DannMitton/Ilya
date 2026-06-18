const CACHE_VERSION = 'ilya-v1';
const CACHE_STATIC = `${CACHE_VERSION}-static`;

const APP_SHELL = [
  '/',
  '/favicon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('ilya-') && key !== CACHE_STATIC)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Never intercept dictionary files — app manages these in IndexedDB
  if (url.pathname.includes('dictionary.') && url.pathname.endsWith('.json')) return;

  // Network-first for version probe (powers the update notice)
  if (url.pathname.endsWith('/_app/version.json')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Network-first for dictionary manifest
  if (url.pathname.endsWith('dictionary-manifest.json')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Stale-while-revalidate for everything else
  event.respondWith(
    caches.open(CACHE_STATIC).then((cache) =>
      cache.match(request).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            cache.put(request, response.clone());
          }
          return response;
        });
        return cached || networkFetch;
      })
    )
  );
});

// N.72 (Dann's ruling, 2026-08-16). MINIMUM FORM ONLY: a new deploy must be
// able to reach a singer who already has Ilya loaded.
//
// THE BUG THIS ENDS. This was the literal 'ilya-v1' and never changed, so every
// deploy shipped a BYTE-IDENTICAL service worker. The browser only installs a
// new worker when the script's bytes differ, so it never installed one, the old
// worker went on serving `cached || networkFetch`, and the first version a
// tester loaded was the version they kept forever. Dann's words: that is not a
// feature gap, it is a delivery failure, and it grows with every commit.
//
// `__BUILD_VERSION__` is replaced at build time by `scripts/stamp-sw.mjs` with
// SvelteKit's own per-build version. **That script exits non-zero if it cannot
// stamp**, because a silent failure would ship this placeholder to everyone and
// reproduce the exact bug while looking fine.
//
// DELIBERATELY NOT IN THIS: `skipWaiting`, `clients.claim`, and the update
// prompt. Dann ruled them separable polish. The accepted cost is that a new
// worker WAITS until every client is gone, so a singer may need to close the
// tab rather than merely reload.
const CACHE_VERSION = 'ilya-__BUILD_VERSION__';
const CACHE_STATIC = `${CACHE_VERSION}-static`;

const APP_SHELL = [
  '/',
  '/favicon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Row 113 (Dann 2026-10-27 14:58, singers with no data plan or wifi). The HEIC
// decoder is loaded lazily, so a singer who has never opened a HEIC would
// otherwise have none of its files offline. They are fetched once, in the
// background, a few seconds after the app shell is cached, so they never
// compete with the first paint. NOT in APP_SHELL: a failure here must not fail
// the install. Never under /omr/ (the fetch handler refuses that prefix).
// The two chunk URLs are hashed, so scripts/stamp-sw.mjs writes them in at
// build time and fails if it cannot find them.
const DECODER_FILES = [
  '/heif/libheif.wasm',
  '/heif/LICENSE-libheif.txt',
  /*__HEIF_CHUNKS__*/
];
const DECODER_DELAY_MS = 3000;

function cacheDecoderLater(cache) {
  return new Promise((resolve) => setTimeout(resolve, DECODER_DELAY_MS))
    .then(() => Promise.all(DECODER_FILES.map((url) => cache.add(url).catch(() => {}))));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) =>
      cache.addAll(APP_SHELL).then(() => cacheDecoderLater(cache))
    )
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

  // Never intercept the score reader's files (homr's models, about 213 MB, and
  // onnxruntime's WebAssembly): the browser's own HTTP cache keeps them, and
  // copying them into this cache would store them twice.
  if (url.pathname.startsWith('/omr/')) return;

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

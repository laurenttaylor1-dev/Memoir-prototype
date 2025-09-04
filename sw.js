const CACHE = 'memoir-shell-v1';
const ASSETS = [
  '/', '/landing.html', '/index.html',
  '/images/open-book.jpg',
  'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.1/dist/umd/supabase.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const isAPI = request.url.includes('/api/');
  if (isAPI) {
    e.respondWith(fetch(request).catch(() => new Response(JSON.stringify({ error: 'offline' }), { status: 503 })));
    return;
  }
  e.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(request, copy));
      return resp;
    }).catch(() => cached))
  );
});

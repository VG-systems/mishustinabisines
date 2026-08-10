/* =====================================================
   Service Worker — Production Version
   Стратегия:
   - HTML → Network First
   - Остальные ресурсы → Cache First
   ===================================================== */

const CACHE_NAME = 'site-cache-20260219-v3';

// Ядро сайта (минимум)
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/css/cookies.css',
    '/assets/css/fonts/fonts.css',
    '/assets/js/main.js',
    '/assets/js/cookies.js',
    '/assets/css/fonts/CormorantGaramond-400-normal-latin.woff2',
    '/assets/css/fonts/CormorantGaramond-400-italic-latin.woff2',
    '/assets/css/fonts/Manrope-400-normal-latin.woff2',
    '/assets/img/favicon/favicon.svg'
];

/* ================================
   1. INSTALL
   ================================ */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching core assets');
            return cache.addAll(CORE_ASSETS);
        })
    );

    self.skipWaiting(); // Активируем немедленно
});


/* ================================
   2. ACTIVATE
   ================================ */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');

    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});


/* ================================
   3. FETCH
   ================================ */
self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith('http')) return;

    const request = event.request;

    // =============================
    // A. HTML → Network First
    // =============================
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                })
        );
        return;
    }

    // =============================
    // B. Остальное → Cache First
    // =============================
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then((networkResponse) => {

                if (
                    !networkResponse ||
                    networkResponse.status !== 200 ||
                    networkResponse.type !== 'basic'
                ) {
                    return networkResponse;
                }

                const responseToCache = networkResponse.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseToCache);
                });

                return networkResponse;
            });
        })
    );
});

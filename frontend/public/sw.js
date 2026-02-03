// SAHAYAK AI - Service Worker for Offline Support
const CACHE_NAME = 'sahayak-v1';
const DATA_CACHE = 'sahayak-data-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.svg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // API requests - network first, cache fallback
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            caches.open(DATA_CACHE).then(async (cache) => {
                try {
                    const response = await fetch(request);
                    if (response.ok) {
                        cache.put(request, response.clone());
                    }
                    return response;
                } catch {
                    const cached = await cache.match(request);
                    if (cached) {
                        return cached;
                    }
                    // Return offline response for API
                    return new Response(
                        JSON.stringify({ error: 'offline', message: 'You are offline' }),
                        {
                            headers: { 'Content-Type': 'application/json' },
                            status: 503
                        }
                    );
                }
            })
        );
        return;
    }

    // Static assets - cache first, network fallback
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) {
                return cached;
            }
            return fetch(request).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseToCache);
                });
                return response;
            });
        })
    );
});

// Background sync for offline SOS
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-sos') {
        event.waitUntil(syncOfflineSOS());
    }
});

async function syncOfflineSOS() {
    // Get queued SOS from IndexedDB
    // Send to server
    // Clear queue on success
    console.log('Syncing offline SOS requests...');
}

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'SAHAYAK AI';
    const options = {
        body: data.body || 'New notification',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: data.tag || 'notification',
        data: data.url || '/',
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data)
    );
});

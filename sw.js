const CACHE_NAME = 'dmysc-v5';
const ASSETS_TO_CACHE = [
    './?v=4',
    './index.html?v=4',
    './assets/css/home-style.css?v=4',
    './assets/css/admin-style.css?v=4',
    './assets/css/animations.css?v=4',
    './admin/index.html?v=4',
    './assets/js/supabase.js?v=4',
    './assets/images/logo_2.png',
    './manifest.json?v=4',
    './user/index.html?v=4',
    './auth/login.html?v=4'
];

// --- FIREBASE PUSH NOTIFICATION SETUP ---
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBG7AFHcSAZqzTQTT6SZ3wSc3olVJ2TjXs",
    authDomain: "dmy-sc-push.firebaseapp.com",
    projectId: "dmy-sc-push",
    storageBucket: "dmy-sc-push.firebasestorage.app",
    messagingSenderId: "1058857878265",
    appId: "1:1058857878265:web:9cc8d0857bb6ca0d731828",
    measurementId: "G-RLW6SZF3W6"
};

try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Browser handles 'notification' payload automatically. 
        // We do NOT need to call showNotification() here if payload has notification.
        // If you send data-only messages, you might need this, but for now we comment it out to fix duplicates.
        /*
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/assets/images/logo.png',
            badge: '/assets/images/logo.png'
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
        */
    });
} catch (e) {
    console.error("Firebase SW Init Error:", e);
}

// Handle Notification Click
// Handle Notification Click
self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification clicked');
    event.notification.close();

    // Determine target URL based on notification content keywords
    // Determine target URL based on notification content keywords
    let targetUrl = 'user/index.html'; // Default (relative)
    const title = (event.notification.title || '').toLowerCase();
    const body = (event.notification.body || '').toLowerCase();

    // Check for keywords
    if (title.includes('pay') || body.includes('payment') || title.includes('bill') || body.includes('receipt') || title.includes('fee')) {
        targetUrl = 'user/pay.html';
    } else if (title.includes('event') || body.includes('event') || title.includes('match') || body.includes('practice') || title.includes('meeting')) {
        targetUrl = 'user/event.html';
    } else if (title.includes('alert') || title.includes('notice') || title.includes('update')) {
        targetUrl = 'user/notifycation.html';
    }

    // Construct absolute URL based on SW scope
    const absoluteUrl = new URL(targetUrl, self.registration.scope).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // If a window is already open, focus it and navigate
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.includes('user/') && 'focus' in client) {
                    client.focus();
                    if ('navigate' in client) {
                        client.navigate(absoluteUrl);
                    }
                    return;
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow(absoluteUrl);
            }
        })
    );
});
// ----------------------------------------

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all: app shell and content');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // API calls, Firebase, සහ Supabase requests cache කිරීමෙන් වළකින්න
    if (event.request.method !== 'GET' || event.request.url.includes('supabase.co') || event.request.url.includes('firebase')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // ඉන්ටර්නෙට් එකෙන් අලුත් ෆයිල් එක සාර්ථකව ගත්තොත්, Cache එකත් අලුත් කරනවා
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // ඉන්ටර්නෙට් නැත්නම් හෝ ෆේල් වුනොත් විතරක් Cache එකෙන් පෙන්නනවා
                return caches.match(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim()
        ])
    );
});

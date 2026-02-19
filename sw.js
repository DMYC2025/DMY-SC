const CACHE_NAME = 'dmysc-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './assets/css/home-style.css',
    './assets/css/admin-style.css',
    './assets/css/animations.css',
    './admin/index.html',
    './assets/js/supabase.js',
    './assets/images/logo_2.png',
    './manifest.json'
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
    let targetUrl = '/user/index.html'; // Default
    const title = (event.notification.title || '').toLowerCase();
    const body = (event.notification.body || '').toLowerCase();

    // Check for keywords
    if (title.includes('pay') || body.includes('payment') || title.includes('bill') || body.includes('receipt') || title.includes('fee')) {
        targetUrl = '/user/pay.html';
    } else if (title.includes('event') || body.includes('event') || title.includes('match') || body.includes('practice') || title.includes('meeting')) {
        targetUrl = '/user/event.html';
    } else if (title.includes('alert') || title.includes('notice') || title.includes('update')) {
        targetUrl = '/user/notifycation.html';
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // If a window is already open, focus it and navigate
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.includes('user/') && 'focus' in client) {
                    client.focus();
                    if ('navigate' in client) {
                        client.navigate(targetUrl);
                    }
                    return;
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
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
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

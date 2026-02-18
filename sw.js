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

        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/assets/images/logo.png', // Transparent Logo
            badge: '/assets/images/logo.png'
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    });
} catch (e) {
    console.error("Firebase SW Init Error:", e);
}
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

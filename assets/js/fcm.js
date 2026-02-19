// Firebase Cloud Messaging Configuration & Token Management
// This file handles requesting permission and saving the FCM token to Supabase.

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBG7AFHcSAZqzTQTT6SZ3wSc3olVJ2TjXs",
    authDomain: "dmy-sc-push.firebaseapp.com",
    projectId: "dmy-sc-push",
    storageBucket: "dmy-sc-push.firebasestorage.app",
    messagingSenderId: "1058857878265",
    appId: "1:1058857878265:web:9cc8d0857bb6ca0d731828",
    measurementId: "G-RLW6SZF3W6"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    const VAPID_KEY = 'BB4pawo5SVgELPUmlfaCScNFzW5WnRC3xfWnZ_cHmaFaMCey0hDRKctHWTVhaoy2zU7Ei5La2BnPiwaCK828MOE';

    async function initFirebaseMessaging() {
        console.log('Initializing Firebase Messaging...');
        try {
            if (!("Notification" in window)) {
                console.log("This browser does not support desktop notification");
                return;
            }

            if (Notification.permission === 'denied') {
                console.warn('Notification permission is denied. Push notifications will not work.');
                return;
            }

            // If permission is 'default', waiting for user interaction in UI
            if (Notification.permission === 'default') {
                console.log('Notification permission is default. Waiting for user to enable in UI.');
                return;
            }

            // Permission is granted if we are here
            if (Notification.permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                return;
            }

            // Get the Service Worker Registration
            const registration = await navigator.serviceWorker.ready;

            // Get the token
            const token = await messaging.getToken({
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration
            });

            if (token) {
                console.log('FCM Token:', token);
                saveTokenToSupabase(token);
            } else {
                console.log('No registration token available.');
            }

        } catch (error) {
            console.error('An error occurred while retrieving token.', error);
        }
    }

    async function requestAndInitFCM() {
        if (!("Notification" in window)) return false;

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Permission granted by user.');
                initFirebaseMessaging();
                return true;
            } else {
                console.log('Permission denied by user.');
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // Expose for manual trigger
    window.reInitFirebase = initFirebaseMessaging;
    window.requestAndInitFCM = requestAndInitFCM;

    async function saveTokenToSupabase(token) {
        if (typeof _supabase === 'undefined') {
            // Retry once after delay if supabase isn't ready
            setTimeout(() => {
                if (typeof _supabase !== 'undefined') saveTokenToSupabase(token);
            }, 1000);
            return;
        }

        const { data: { session } } = await _supabase.auth.getSession();
        if (session) {
            const { error } = await _supabase
                .from('profiles')
                .update({ fcm_token: token })
                .eq('id', session.user.id);

            if (error) {
                console.error('Error saving FCM token:', error);
            } else {
                console.log('FCM Token saved to database successfully.');
            }
        }
    }

    // Handle foreground messages
    messaging.onMessage((payload) => {
        console.log('Message received in foreground: ', payload);
    });

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        initFirebaseMessaging();
    });

} catch (e) {
    console.error("Firebase Initialization Error:", e);
}

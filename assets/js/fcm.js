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
// Note: firebase-app-compat.js and firebase-messaging-compat.js must be loaded before this file
try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    const VAPID_KEY = 'BB4pawo5SVgELPUmlfaCScNFzW5WnRC3xfWnZ_cHmaFaMCey0hDRKctHWTVhaoy2zU7Ei5La2BnPiwaCK828MOE';

    async function initFirebaseMessaging() {
        console.log('Initializing Firebase Messaging...');
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted.');

                // Get the Service Worker Registration
                // We reuse the existing service worker registration
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
                    console.log('No registration token available. Request permission to generate one.');
                }
            } else {
                console.log('Notification permission denied.');
            }
        } catch (error) {
            console.error('An error occurred while retrieving token.', error);
        }
    }

    async function saveTokenToSupabase(token) {
        // Ensure Supabase is loaded
        if (typeof _supabase === 'undefined') {
            console.warn('Supabase not loaded yet, retrying in 1s...');
            setTimeout(() => saveTokenToSupabase(token), 1000);
            return;
        }

        const { data: { session } } = await _supabase.auth.getSession();
        if (session) {
            // Check if token is different or just update it
            const { error } = await _supabase
                .from('profiles')
                .update({ fcm_token: token })
                .eq('id', session.user.id);

            if (error) {
                console.error('Error saving FCM token to Supabase:', error);
            } else {
                console.log('FCM Token saved to database successfully.');
            }
        }
    }

    // Handle foreground messages (when the page is open)
    messaging.onMessage((payload) => {
        console.log('Message received in foreground: ', payload);
        // You can customize the UI here if you want a toast notification
        // For now, checks if we should show a browser notification even in foreground or just rely on the UI

        // Example: simple alert or custom UI update
        /*
        const { title, body, image } = payload.notification;
        if(Notification.permission === 'granted') {
             new Notification(title, { body, icon: image || '/assets/images/logo_1.png' });
        }
        */
    });

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Delay slightly to ensure SW is ready
        setTimeout(initFirebaseMessaging, 2500);
    });

} catch (e) {
    console.error("Firebase Initialization Error:", e);
}

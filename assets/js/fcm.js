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
        // FCM: Initializing
        try {
            if (!("Notification" in window)) {
                console.log("FCM: Notifications not supported.");
                return;
            }

            if (Notification.permission === 'denied') {
                console.warn('FCM: Permission denied.');
                return;
            }

            if (Notification.permission === 'default') {
                console.log('FCM: Permission default. Waiting for user interaction.');
                return;
            }

            // Ensure Service Worker is ready
            if (!navigator.serviceWorker) {
                console.error('FCM: Service Worker not supported in this browser.');
                return;
            }

            // Ensure Service Worker is ready
            const registration = await navigator.serviceWorker.ready;

            if (!registration) {
                console.error('FCM: Service Worker registration not found.');
                return;
            }

            // Small delay for mobile browsers to ensure internal state is settled
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                console.log('FCM: Mobile detected, adding 2s delay...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            console.log('FCM: Requesting token...');
            const token = await messaging.getToken({
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration
            });

            if (token) {
                saveTokenToSupabase(token);
            } else {
                console.log('FCM: No registration token available.');
            }

        } catch (error) {
            console.error('FCM Error:', error.code || error.message || error);
            if (error.code === 'messaging/permission-blocked') {
                console.warn('FCM: Notifications blocked by browser settings.');
            } else if (error.code === 'messaging/failed-service-worker-registration') {
                console.error('FCM: Service worker registration failed or not found.');
            }
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

    async function saveTokenToSupabase(token, retryCount = 0) {
        if (typeof _supabase === 'undefined') {
            console.warn('Supabase not yet loaded, retrying in 1s...');
            setTimeout(() => saveTokenToSupabase(token, retryCount), 1000);
            return;
        }

        try {
            const { data: { session } } = await _supabase.auth.getSession();
            if (session) {
                const { error } = await _supabase
                    .from('profiles')
                    .update({ fcm_token: token })
                    .eq('id', session.user.id);

                if (error) {
                    console.error('Error saving FCM token:', error);
                } else {
                    console.log('FCM Token synced to database: ' + session.user.id);
                }
            } else {
                if (retryCount < 5) {
                    console.log(`FCM: No active session, retrying in 2s (Attempt ${retryCount + 1}/5)...`);
                    setTimeout(() => saveTokenToSupabase(token, retryCount + 1), 2000);
                } else {
                    console.log('FCM: No active session to save token after retries.');
                }
            }
        } catch (err) {
            console.error('FCM Token Save Error:', err);
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

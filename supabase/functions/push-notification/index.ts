
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ---------------------------
// 1. SETUP FIREBASE JWT LOGIC
// ---------------------------
// We need to sign a JWT using the service account to access FCM V1 API
// This is done manually because there isn't a great library for it in Deno Edge yet
async function getAccessToken(serviceAccount) {
    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const claim = {
        iss: serviceAccount.client_email,
        scope: "https://www.googleapis.com/auth/firebase.messaging",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedClaim = btoa(JSON.stringify(claim));

    // Sign the JWT part
    const keyData = serviceAccount.private_key
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\n/g, "");

    const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));

    const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        binaryKey,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        cryptoKey,
        new TextEncoder().encode(`${encodedHeader}.${encodedClaim}`)
    );

    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const jwt = `${encodedHeader}.${encodedClaim}.${encodedSignature}`;

    // Exchange JWT for access token
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const data = await response.json();
    return data.access_token;
}

// ---------------------------
// 2. MAIN EDGE FUNCTION
// ---------------------------
serve(async (req) => {
    try {
        const { record } = await req.json(); // Payload from Database Webhook

        // If no new record, just exit
        if (!record) {
            return new Response("No record data.", { status: 400 });
        }

        console.log("New Notification Triggered:", record.title);

        // -- Initialize Supabase Admin Client --
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // -- Get Service Account from Env/Secrets --
        // Use `supabase secrets set FCM_SERVICE_ACCOUNT='{"type":...}'` to store this
        const serviceAccountJson = Deno.env.get('FCM_SERVICE_ACCOUNT');
        if (!serviceAccountJson) {
            console.error("Missing FCM_SERVICE_ACCOUNT secret.");
            return new Response("Configuration Error", { status: 500 });
        }
        const serviceAccount = JSON.parse(serviceAccountJson);

        // -- Determine Recipients --
        let tokens = [];

        if (record.user_id) {
            // Send to SPECIFIC USER
            const { data: profile } = await supabase
                .from('profiles')
                .select('fcm_token')
                .eq('id', record.user_id)
                .single();

            if (profile && profile.fcm_token) {
                tokens.push(profile.fcm_token);
            }
        } else {
            // Send to ALL USERS (Broadcast)
            // Limit to 500 for now to avoid timeout on free tier edge function
            const { data: profiles } = await supabase
                .from('profiles')
                .select('fcm_token')
                .not('fcm_token', 'is', null)
                .limit(500);

            if (profiles) {
                tokens = profiles.map(p => p.fcm_token);
            }
        }

        if (tokens.length === 0) {
            console.log("No valid tokens found.");
            return new Response("No recipients found", { status: 200 });
        }

        // -- Get Access Token for FCM --
        const accessToken = await getAccessToken(serviceAccount);

        // -- Send Notifications in Parallel --
        const messagingUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

        const promises = tokens.map(token => {
            const message = {
                message: {
                    token: token,
                    notification: {
                        title: record.title,
                        body: record.message
                    },
                    webpush: {
                        fcm_options: {
                            link: "https://your-app-url.com/user/notifycation.html" // Update this later
                        }
                    },
                    data: {
                        priority: record.priority || 'normal',
                        notification_id: record.id.toString()
                    }
                }
            };

            return fetch(messagingUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            }).then(r => r.json()); // Simple fire-and-forget logging
        });

        await Promise.all(promises);
        console.log(`Sent to ${tokens.length} devices.`);

        return new Response(JSON.stringify({ success: true, count: tokens.length }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});

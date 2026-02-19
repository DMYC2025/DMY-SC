// Supabase Configuration
// මෙම ෆයිල් එක Admin සහ User පිටු සියල්ලටම පොදු වේ.

const supabaseUrl = 'https://tnrqasiiywcvtwkwytqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucnFhc2lpeXdjdnR3a3d5dHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDIxMTEsImV4cCI6MjA4MjkxODExMX0.rd9aKmLa687zMxg8FV5AllgnYkz7wpdXBRi3a5NyXc4';

// Create a single supabase client for interacting with your database
// Configure auth for persistent sessions (prevents frequent logouts)
// සිංහල: ලොග් වූ පසු දින ගණනක් යනතුරු Login වී තිබීමට (Persistent Session) සකසා ඇත.
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true, // Stores the session in local storage (Browser) -> ඕනෑම දවසක නැවත එන විට Login වී ඇත.
        autoRefreshToken: true, // Automatically refreshes the token -> Token එක කල් ඉකුත් වීම වලකයි.
        detectSessionInUrl: true // Detects if the session is in the URL (for OAuth/Magic Links)
    }
});

console.log("Supabase Connected! - Session Persistence Enabled");

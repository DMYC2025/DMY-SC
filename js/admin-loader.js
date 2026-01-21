/**
 * Admin Authentication Loader
 * Automatically checks if the user is logged in AND is an admin.
 * If not, redirects to the appropriate page.
 * * Usage: Include this script in the <head> or bottom of admin pages.
 * Ensure supabase.js is loaded BEFORE this script.
 */

(async function checkAdminAuth() {
    console.log("Verifying Admin Access... - admin-loader.js:10");

    // 1. Check if Supabase client is available
    if (typeof _supabase === 'undefined') {
        console.error("Critical Error: Supabase client not found. Make sure '../js/supabase.js' is included. - admin-loader.js:14");
        alert("System Error: Database connection missing.");
        return;
    }

    try {
        // 2. Get current session
        const { data: { session }, error: sessionError } = await _supabase.auth.getSession();

        // If no session, redirect to login
        if (sessionError || !session) {
            console.warn("No active session found. Redirecting to Login. - admin-loader.js:25");
            window.location.href = '../login.html'; 
            return;
        }

        // 3. Check user role in database
        const { data: profile, error: profileError } = await _supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (profileError || !profile) {
            console.error("Profile fetch error or profile missing. - admin-loader.js:38");
            await _supabase.auth.signOut();
            window.location.href = '../login.html';
            return;
        }

        // 4. Check if role is 'admin'
        if (profile.role !== 'admin') {
            console.warn("Unauthorized access attempt by nonadmin user. - admin-loader.js:46");
            alert("Access Denied: You do not have administrator privileges.");
            window.location.href = '../user/index.html'; // Redirect to User Dashboard
            return;
        }

        // 5. Access Granted
        console.log("Admin Access Granted for: - admin-loader.js:53", session.user.email);

    } catch (err) {
        console.error("Unexpected Auth Error: - admin-loader.js:56", err);
        window.location.href = '../login.html';
    }
})();
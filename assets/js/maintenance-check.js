/**
 * maintenance-check.js
 * Include this in ALL user-facing pages (user/, auth/ etc.)
 * It checks site_settings.maintenance_mode and auto-redirects
 * non-admin visitors to maintenance.html when mode is ON.
 *
 * Usage (add AFTER supabase.js):
 *   <script src="../assets/js/maintenance-check.js"></script>
 */
(async function maintenanceGuard() {
    // 0. Pre-check: skip if already on maintenance page or if it's an iframe
    if (window.location.pathname.endsWith('maintenance.html') || window.top !== window.self) return;

    // Wait for Supabase to be available (max 3s)
    let waited = 0;
    while (typeof _supabase === 'undefined' && waited < 3000) {
        await new Promise(r => setTimeout(r, 100));
        waited += 100;
    }
    if (typeof _supabase === 'undefined') return;

    try {
        // 1. Check maintenance mode
        const { data: settings } = await _supabase
            .from('site_settings')
            .select('maintenance_mode')
            .eq('id', 1)
            .single();

        if (!settings || !settings.maintenance_mode) return;

        // 2. Check admin bypass
        const { data: { session } } = await _supabase.auth.getSession();
        if (session) {
            const { data: profile } = await _supabase
                .from('admins')
                .select('id')
                .eq('id', session.user.id)
                .single();
            if (profile) return;
        }

        // 3. Redirect to maintenance.html (Robust pathing)
        let prefix = '';
        const path = window.location.pathname;
        if (path.includes('/user/') || path.includes('/auth/')) {
            prefix = '../';
        }

        window.location.replace(prefix + 'maintenance.html');

    } catch (e) {
        console.error('Maintenance check failed:', e);
    }
})();

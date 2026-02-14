/**
 * UI Helper Functions for DMYSC
 * Used across User Dashboard, Profile, and Public pages.
 */

// 1. Returns the Verified Badge Icon HTML
function getVerifyIcon() {
    return `<i class="ph-fill ph-seal-check text-blue-500 text-[14px] ml-1 align-middle inline-block drop-shadow-md" title="Verified Member"></i>`;
}

// 2. Simple Date Formatter (e.g., "Jan 1, 2026")
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// 3. Show Loading Spinner in a container
function showLoading(containerId, message = "Loading...") {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 w-full text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mb-3"></div>
                <p class="text-slate-500 text-sm font-medium animate-pulse">${message}</p>
            </div>
        `;
    }
}

// 4. Show Error Message in a container
function showError(containerId, message = "Something went wrong.") {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 w-full text-center text-red-400">
                <i class="ph-duotone ph-warning-circle text-3xl mb-2"></i>
                <p class="text-sm">${message}</p>
            </div>
        `;
    }
}

// 5. Toggle Profile Popup
function toggleProfilePopup() {
    const popup = document.getElementById('profilePopup');
    if (popup) popup.classList.toggle('hidden');
    // Close notif if open
    const notifPopup = document.getElementById('notifPopup');
    if (notifPopup) notifPopup.classList.add('hidden');
}

// 6. Notification Popup Logic
function toggleNotifPopup() {
    const popup = document.getElementById('notifPopup');
    if (!popup) return;

    const isClosing = !popup.classList.contains('hidden');

    // Close profile if open
    const profilePopup = document.getElementById('profilePopup');
    if (profilePopup) profilePopup.classList.add('hidden');

    popup.classList.toggle('hidden');

    if (!isClosing) {
        fetchNotifsForPopup();
        // Reset badge on open
        const badge = document.getElementById('notifBadgeDot');
        if (badge) badge.classList.add('hidden');
    }
}

async function fetchNotifsForPopup() {
    const list = document.getElementById('notifPopupList');
    if (!list) return;

    try {
        if (typeof _supabase === 'undefined') return;

        const { data, error } = await _supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;

        if (!data || data.length === 0) {
            list.innerHTML = `
                <div class="flex flex-col items-center justify-center py-10 opacity-60">
                    <span class="material-symbols-rounded text-3xl mb-2">notifications_off</span>
                    <p class="text-[10px] font-bold uppercase tracking-wider">No Alerts Yet</p>
                </div>
            `;
            return;
        }

        list.innerHTML = data.map(n => {
            const date = new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const isUrgent = n.priority === 'urgent';
            return `
                <div class="p-3 rounded-2xl border ${isUrgent ? 'bg-[#3c2525] border-error/20' : 'bg-[#1E1E1E] border-white/5'} hover:border-primary/30 transition-all cursor-default text-left">
                    <div class="flex gap-3">
                        <div class="w-8 h-8 rounded-full ${isUrgent ? 'bg-error text-[#690005]' : 'bg-primary/10 text-primary'} flex items-center justify-center shrink-0">
                            <span class="material-symbols-rounded text-sm">${isUrgent ? 'warning' : 'info'}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start gap-2">
                                <h4 class="text-xs font-bold text-[#E3E3E3] truncate">${n.title}</h4>
                                <span class="text-[9px] text-[#8e918f] font-mono whitespace-nowrap">${date}</span>
                            </div>
                            <p class="text-[10px] text-[#C4C7C5] line-clamp-2 mt-1 leading-relaxed">${n.message}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error("Popup Notif Error:", err);
        list.innerHTML = `<div class="p-4 text-center text-error text-[10px]">Failed to load alerts</div>`;
    }
}

// 7. Global Click Listener for Popups
document.addEventListener('click', function (event) {
    const profilePopup = document.getElementById('profilePopup');
    const notifPopup = document.getElementById('notifPopup');

    // Check if toggles were clicked
    const profileToggle = document.querySelector('button[onclick="toggleProfilePopup()"]') ||
        document.querySelector('[onclick="toggleProfilePopup()"]');
    const notifToggle = document.querySelector('button[onclick="toggleNotifPopup()"]') ||
        document.querySelector('[onclick="toggleNotifPopup()"]');

    if (profilePopup && !profilePopup.classList.contains('hidden') &&
        !profilePopup.contains(event.target) &&
        (!profileToggle || !profileToggle.contains(event.target))) {
        profilePopup.classList.add('hidden');
    }

    if (notifPopup && !notifPopup.classList.contains('hidden') &&
        !notifPopup.contains(event.target) &&
        (!notifToggle || !notifToggle.contains(event.target))) {
        notifPopup.classList.add('hidden');
    }
});
// 8. Global Logout
async function logout() {
    if (confirm("Are you sure you want to logout?")) {
        if (typeof _supabase === 'undefined') return;
        await _supabase.auth.signOut();
        window.location.href = '../up and in/login.html';
    }
}

// 9. Fetch and Populate Profile Popup Data
async function loadProfilePopupData() {
    if (typeof _supabase === 'undefined') return;
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) return;

    try {
        const { data: profile } = await _supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
            const avatarSrc = (profile.avatar_url && profile.avatar_url.trim() !== "") ? profile.avatar_url : "https://img.freepik.com/premium-vector/green-user-account-profile-flat-icon-apps-websites_1254296-1186.jpg";

            // Update all nav avatars and popup avatars
            const navAvatars = document.querySelectorAll('#navAvatar');
            navAvatars.forEach(img => img.src = avatarSrc);

            const popupAvatar = document.getElementById('popupAvatar');
            if (popupAvatar) popupAvatar.src = avatarSrc;

            const popupName = document.getElementById('popupName');
            if (popupName) popupName.innerText = profile.display_name || profile.full_name;

            const popupEmail = document.getElementById('popupEmail');
            if (popupEmail) popupEmail.innerText = profile.email;

            const popupClubId = document.getElementById('popupClubId');
            if (popupClubId) popupClubId.innerText = profile.member_id || 'PENDING';

            const popupNic = document.getElementById('popupNic');
            if (popupNic) popupNic.innerText = profile.nic || 'N/A';

            // Executive Role
            const { data: exData } = await _supabase.from('executive_committee').select('*').eq('profile_id', session.user.id).single();
            const exEl = document.getElementById('popupExecRole');
            if (exEl) {
                if (exData && exData.term_period) {
                    exEl.classList.remove('hidden');
                    exEl.innerText = `Exec: ${exData.term_period}`;
                } else {
                    exEl.classList.add('hidden');
                }
            }

            // Captain Role
            const { data: sportsData } = await _supabase.from('sports').select('name').eq('captain_id', session.user.id);
            const capEl = document.getElementById('popupCaptainRole');
            if (capEl) {
                if (sportsData && sportsData.length > 0) {
                    capEl.classList.remove('hidden');
                    capEl.innerText = `Captain: ${sportsData.map(t => t.name).join(', ')}`;
                } else {
                    capEl.classList.add('hidden');
                }
            }
        }
    } catch (err) {
        console.error("Profile Popup Error:", err);
    }
}

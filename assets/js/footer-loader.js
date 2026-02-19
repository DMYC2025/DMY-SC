// js/footer-loader.js

async function loadGlobalFooter() {
    // Check if Mobile (less than 768px width)
    if (window.innerWidth < 768) {
        // Hide footer placeholder on mobile
        const footerPlaceholder = document.getElementById('global-footer-placeholder');
        if (footerPlaceholder) footerPlaceholder.style.display = 'none';
        return;
    }

    try {
        // Attempt to fetch footer.html, trying relative paths
        let response = await fetch('../assets/components/footer.html');
        if (!response.ok) {
            response = await fetch('assets/components/footer.html');
        }

        if (!response.ok) throw new Error("Footer template not found");

        const footerHtml = await response.text();

        // Insert into the placeholder div
        const footerPlaceholder = document.getElementById('global-footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHtml;

            // Initialize logic AFTER HTML is inserted
            updateFooterYear();
            loadFooterContactData();
        }
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Function to set the current year
function updateFooterYear() {
    const yearElem = document.getElementById('year');
    if (yearElem) yearElem.innerText = new Date().getFullYear();
}

// Function to fetch contact data from Supabase
async function loadFooterContactData() {
    try {
        // Check if supabase is initialized
        if (typeof _supabase === 'undefined') {
            console.warn('Supabase client not found - footer-loader.js:34');
            return;
        }

        const { data } = await _supabase.from('site_settings').select('address, phone, email').eq('id', 1).single();

        if (data) {
            const addrEl = document.getElementById('footerAddress');
            const phoneEl = document.getElementById('footerPhone');
            const emailEl = document.getElementById('footerEmail');
            const pPhoneEl = document.getElementById('privacyPhone');
            const pEmailEl = document.getElementById('privacyEmail');

            if (addrEl) addrEl.textContent = data.address || 'No. **/*, Dikhengama, Munagama';
            if (phoneEl) phoneEl.textContent = data.phone || '+94 XX XXX XXXX';
            if (emailEl) emailEl.textContent = data.email || 'info@dmysc.lk';

            // Privacy Policy placeholders
            if (pPhoneEl) pPhoneEl.textContent = data.phone || '+94 XX XXX XXXX';
            if (pEmailEl) {
                pEmailEl.textContent = data.email || 'info@dmysc.lk';
                if (pEmailEl.tagName === 'A') pEmailEl.href = `mailto:${data.email || 'info@dmysc.lk'}`;
            }
        }
    } catch (err) { console.error('Supabase footer error: - footer-loader.js:49', err); }
}

// Automatically load on run
loadGlobalFooter();

// --- Modal Logic for Footer ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const backdrop = modal.querySelector('.modal-backdrop');
    const panel = modal.querySelector('.modal-panel');

    modal.classList.remove('hidden');
    setTimeout(() => {
        if(backdrop) backdrop.classList.remove('opacity-0');
        if(panel) {
            panel.classList.remove('scale-95', 'opacity-0');
            panel.classList.add('scale-100', 'opacity-100');
        }
    }, 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const backdrop = modal.querySelector('.modal-backdrop');
    const panel = modal.querySelector('.modal-panel');

    if(backdrop) backdrop.classList.add('opacity-0');
    if(panel) {
        panel.classList.remove('scale-100', 'opacity-100');
        panel.classList.add('scale-95', 'opacity-0');
    }

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal-backdrop')) {
        const modal = event.target.closest('[role="dialog"]');
        if (modal) closeModal(modal.id);
    }
});

window.openModal = openModal;
window.closeModal = closeModal;


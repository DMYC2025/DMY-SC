// js/footer-loader.js

async function loadGlobalFooter() {
    try {
        // 1. Fetch the footer HTML content
        const response = await fetch('footer.html');
        const footerHtml = await response.text();

        // 2. Insert into the placeholder div
        const footerPlaceholder = document.getElementById('global-footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHtml;
            
            // 3. Initialize logic AFTER HTML is inserted
            updateFooterYear();
            loadFooterContactData();
        }
    } catch (error) {
        console.error('Error loading footer: - footer-loader.js:19', error);
    }
}

// Function to set the current year
function updateFooterYear() {
    const yearElem = document.getElementById('year');
    if(yearElem) yearElem.innerText = new Date().getFullYear();
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

            if(addrEl) addrEl.textContent = data.address || 'Dikhengama, Munagama';
            if(phoneEl) phoneEl.textContent = data.phone || '+94 71 615 5666';
            if(emailEl) emailEl.textContent = data.email || 'info@dmysc.lk';
        }
    } catch (err) { console.error('Supabase footer error: - footer-loader.js:49', err); }
}

// Automatically load on run
loadGlobalFooter();
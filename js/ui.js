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
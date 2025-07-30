// sidebar.js

// Make isSidebarOpen globally accessible
window.isSidebarOpen = false; 

// This function will be called by main.js after the HTML is loaded
function initializeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const hexagonButton = document.getElementById("hexagon-button"); // Get button from topbar

    if (sidebar && overlay && hexagonButton) {
        overlay.addEventListener('click', window.toggleSidebar);

        // Close sidebar if clicking anywhere outside sidebar and topbar
        document.body.addEventListener('click', (event) => {
            // Check if the click target is NOT within the sidebar, hexagon button, or top bar
            if (window.isSidebarOpen && 
                !sidebar.contains(event.target) && 
                !hexagonButton.contains(event.target) &&
                !document.getElementById('top-bar').contains(event.target)) {
                window.toggleSidebar();
            }
        });
    } else {
        console.error("Sidebar, overlay, or hexagon button not found for sidebar initialization.");
    }
}

/**
 * Toggles the sidebar open/closed state and animates the hexagon button.
 * This function is made global so topbar.js can call it.
 */
window.toggleSidebar = function() { // Attach to window for global access
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const hexagonButton = document.getElementById("hexagon-button");

    if (!sidebar || !overlay || !hexagonButton) {
        console.error("Missing elements for toggleSidebar function.");
        return;
    }

    window.isSidebarOpen = !window.isSidebarOpen; // Update global state

    if (window.isSidebarOpen) {
        sidebar.classList.add('sidebar-open');
        hexagonButton.classList.add('button-rotated');
        overlay.classList.add('overlay-active');
        // Get sidebar width from CSS variable
        const sidebarWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
        document.body.style.paddingLeft = sidebarWidth; // Shift content
    } else {
        sidebar.classList.remove('sidebar-open');
        hexagonButton.classList.remove('button-rotated');
        overlay.classList.remove('overlay-active');
        document.body.style.paddingLeft = '0'; // Reset content position
    }

    // After toggling, refresh history if sidebar is opening, or just ensure it's up to date
    // Check if fetchHistory is defined globally (from main.js)
    if (window.isSidebarOpen && typeof window.fetchHistory === 'function') {
        window.fetchHistory(); 
    }
};

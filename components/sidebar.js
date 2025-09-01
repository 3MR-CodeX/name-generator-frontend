
// sidebar.js

// Make isSidebarOpen globally accessible
window.isSidebarOpen = false; 

// This function will be called by main.js after the HTML is loaded
function initializeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const hexagonButton = document.getElementById("hexagon-button"); // Get button from topbar
    const sidebarLinks = document.querySelector("#sidebar .sidebar-content ul");


    if (sidebar && overlay && hexagonButton && sidebarLinks) {
        overlay.addEventListener('click', window.toggleSidebar);

        // Close sidebar if a link inside is clicked
        sidebarLinks.addEventListener('click', (event) => {
            if (event.target.tagName === 'A' && window.isSidebarOpen) {
                // We don't call toggleSidebar() directly to avoid race conditions with main.js listeners
                // Instead, we just ensure it closes.
                closeSidebar();
            }
        });


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

function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const hexagonButton = document.getElementById("hexagon-button");

    if (!sidebar || !overlay || !hexagonButton) return;

    window.isSidebarOpen = true;
    sidebar.classList.add('sidebar-open');
    hexagonButton.classList.add('button-rotated');
    overlay.classList.add('overlay-active');
    const sidebarWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
    document.body.style.paddingLeft = sidebarWidth;
}

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const hexagonButton = document.getElementById("hexagon-button");

    if (!sidebar || !overlay || !hexagonButton) return;
    
    window.isSidebarOpen = false; 
    sidebar.classList.remove('sidebar-open');
    hexagonButton.classList.remove('button-rotated');
    overlay.classList.remove('overlay-active');
    document.body.style.paddingLeft = '0';
}


/**
 * Toggles the sidebar open/closed state and animates the hexagon button.
 * This function is made global so topbar.js can call it.
 */
window.toggleSidebar = function() { // Attach to window for global access
    if (window.isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }

    // After toggling, refresh history if sidebar is opening, or just ensure it's up to date
    // Check if fetchHistory is defined globally (from main.js)
    if (window.isSidebarOpen && typeof window.fetchHistory === 'function') {
        window.fetchHistory(); 
    }
};

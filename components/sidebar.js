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

        // --- NEW DELAYED CLICK PATTERN ---
        let isRouting = false; // Flag to track if we are simulating the delayed click

        sidebarLinks.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            
            if (link) {
                if (!isRouting) {
                    // 1. First actual click: Intercept it and hide it from main.js
                    event.preventDefault();
                    event.stopImmediatePropagation(); 

                    // 2. Close the sidebar
                    if (window.isSidebarOpen) {
                        closeSidebar();
                    }

                    // 3. Trigger the page transition loader
                    const loader = document.getElementById('page-transition-loader');
                    if (loader) {
                        loader.classList.add('active');
                        
                        // 4. WAIT 500ms for the solid loader to cover the screen
                        setTimeout(() => {
                            // 5. Briefly allow clicks to pass through, and simulate the click
                            isRouting = true;
                            link.click(); // main.js sees THIS click and changes the page invisibly!
                            isRouting = false;
                            
                            // 6. Keep the loader on screen for 1.5 more seconds, then fade out
                            setTimeout(() => {
                                loader.classList.remove('active');
                            }, 1500);

                        }, 500); // 500ms matches the CSS fade transition time
                    } else {
                        // Safe fallback if loader is missing
                        isRouting = true;
                        link.click();
                        isRouting = false;
                    }
                }
                // If isRouting IS true, we do nothing here and let the click pass through to main.js
            }
        }, true); // <-- 'true' triggers the Capture Phase to intercept before main.js


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
    const body = document.body;

    if (!sidebar || !overlay || !hexagonButton) return;

    window.isSidebarOpen = true;
    sidebar.classList.add('sidebar-open');
    hexagonButton.classList.add('button-rotated');
    overlay.classList.add('overlay-active');
    
    // Apply paddingLeft based on tier for smooth animation
    const tier = body.dataset.tier || 'free';
    if (tier === 'business' && !body.classList.contains('business-shifting-disabled')) {
        // For business tier, we let the CSS transition handle it.
    } else {
        const sidebarWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
        body.style.paddingLeft = sidebarWidth;
    }
}

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const hexagonButton = document.getElementById("hexagon-button");
    const body = document.body;

    if (!sidebar || !overlay || !hexagonButton) return;
    
    window.isSidebarOpen = false; 
    sidebar.classList.remove('sidebar-open');
    hexagonButton.classList.remove('button-rotated');
    overlay.classList.remove('overlay-active');
    
    // Reset paddingLeft based on tier
    const tier = body.dataset.tier || 'free';
     if (tier === 'business' && !body.classList.contains('business-shifting-disabled')) {
        // For business tier, we let the CSS transition handle it.
    } else {
        body.style.paddingLeft = '0';
    }
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

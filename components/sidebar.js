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

        // Close sidebar and trigger loading screen if a link inside is clicked
        // Close sidebar and trigger loading screen if a link inside is clicked
        // We use 'true' at the end to trigger the Capture Phase (runs before main.js)
        sidebarLinks.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            
            if (link) {
                // STOP main.js from instantly switching the page
                event.preventDefault();
                event.stopImmediatePropagation(); 

                // 1. Close the sidebar immediately
                if (window.isSidebarOpen) {
                    closeSidebar();
                }

                // 2. Figure out which page we are trying to go to
                let targetView = link.getAttribute('data-view');
                if (!targetView && link.getAttribute('href')) {
                    targetView = link.getAttribute('href').replace('#', '');
                }

                // 3. Trigger the page transition loader
                const loader = document.getElementById('page-transition-loader');
                if (loader && targetView) {
                    loader.classList.add('active');
                    
                    // 4. WAIT 500ms for the fade-in to finish, THEN switch the view
                    setTimeout(() => {
                        // Switch the view behind the loading screen
                        if (typeof window.showView === 'function') {
                            window.showView(targetView);
                        }
                        
                        // 5. Keep the loader on screen for 1.5 more seconds, then fade out
                        setTimeout(() => {
                            loader.classList.remove('active');
                        }, 1500);

                    }, 500); // 500ms matches the CSS fade transition time

                } else if (typeof window.showView === 'function' && targetView) {
                     // Fallback just in case
                     window.showView(targetView);
                }
            }
        }, true); // <-- 'true' is crucial here. It forces this to run before main.js


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

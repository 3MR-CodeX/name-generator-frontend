// sidebar.js

window.isSidebarOpen = false; 

function initializeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const hexagonButton = document.getElementById("hexagon-button"); 
    const sidebarLinks = document.querySelector("#sidebar .sidebar-content ul");

    if (sidebar && overlay && hexagonButton && sidebarLinks) {
        overlay.addEventListener('click', window.toggleSidebar);

        const appTips = [
            "Use the Custom Refiner to iterate and perfect your existing names.",
            "Check domain availability instantly to secure your brand's digital presence.",
            "The Name Analyzer gives you a detailed AI brandability score.",
            "Use the Word Combiner to magically merge multiple keywords into one.",
            "Try mixing different styles like 'Futuristic' or 'Minimal' for diverse results.",
            "You can export your entire generation history anytime from the Settings menu.",
            "Clicking the 'Surprise Me' button uses randomized parameters for unexpected genius.",
            "Use the Text Summarizer to extract core concepts from long, complex descriptions.",
            "Click on any generated name or explanation to instantly copy it to your clipboard.",
            "Try combining the 'Invented Word' pattern with the 'Tech' category for startups."
        ];

        sidebarLinks.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            
            if (link) {
                // Instantly stop standard link behavior
                event.preventDefault();
                event.stopImmediatePropagation(); 

                if (window.isSidebarOpen) {
                    closeSidebar();
                }

                // Get the target page
                let targetView = link.getAttribute('data-view');
                if (!targetView && link.getAttribute('href')) {
                    targetView = link.getAttribute('href').replace('#', '');
                }

                const loader = document.getElementById('page-transition-loader');
                
                if (loader && targetView) {
                    // Update the tip
                    const randomTip = appTips[Math.floor(Math.random() * appTips.length)];
                    const tipElement = document.getElementById('loading-tip-text');
                    if (tipElement) tipElement.textContent = randomTip;
                    
                    // Show loader
                    loader.classList.add('active');
                    
                    setTimeout(() => {
                        // FIX: Safely trigger main.js routing by changing the URL Hash
                        window.location.hash = targetView;
                        
                        // Fallback just in case hash listener misses it
                        if (typeof window.showView === 'function') {
                            window.showView(targetView);
                        }
                        
                        // Remove loader after page changes
                        setTimeout(() => {
                            loader.classList.remove('active');
                        }, 1500);

                    }, 500); // Wait 500ms for loader to cover screen
                } else if (targetView) {
                    // Fallback if loader is completely missing
                    window.location.hash = targetView;
                    if (typeof window.showView === 'function') window.showView(targetView);
                }
            }
        }, true);


        // Close sidebar if clicking anywhere outside sidebar and topbar
        document.body.addEventListener('click', (event) => {
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
    
    const tier = body.dataset.tier || 'free';
    if (tier === 'business' && !body.classList.contains('business-shifting-disabled')) {
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
    
    const tier = body.dataset.tier || 'free';
     if (tier === 'business' && !body.classList.contains('business-shifting-disabled')) {
    } else {
        body.style.paddingLeft = '0';
    }
}

window.toggleSidebar = function() {
    if (window.isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }

    if (window.isSidebarOpen && typeof window.fetchHistory === 'function') {
        window.fetchHistory(); 
    }
};

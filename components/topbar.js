// topbar.js

// This function will be called by main.js after the HTML is loaded
function initializeTopbar() {
    const hexagonButton = document.getElementById("hexagon-button");
    if (hexagonButton) {
        // Ensure toggleSidebar is globally accessible (defined in sidebar.js and attached to window)
        hexagonButton.addEventListener('click', window.toggleSidebar); 
    } else {
        console.error("Hexagon button not found in topbar.html");
    }
}

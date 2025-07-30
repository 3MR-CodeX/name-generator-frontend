// topbar.js

// This function will be called by main.js after the HTML is loaded
function initializeTopbar() {
    const hexagonButton = document.getElementById("hexagon-button");
    if (hexagonButton) {
        hexagonButton.addEventListener('click', toggleSidebar); // toggleSidebar is defined in sidebar.js
    } else {
        console.error("Hexagon button not found in topbar.html");
    }
}

function initializeSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const action = link.dataset.action;
            if (action === 'latest') {
                restoreHistory('latest');
            } else if (action === 'history') {
                openHistoryModal();
            }
        });
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburgerButton = document.getElementById('hexagon-button');
    sidebar.classList.toggle('active');
    hamburgerButton.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');

    // Update global state for sidebar
    window.isSidebarOpen = sidebar.classList.contains('active');
}

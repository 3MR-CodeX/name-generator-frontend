// components/topbar.js

function createTopBar() {
    const topBarPlaceholder = document.getElementById('top-bar-placeholder');

    const topBar = document.createElement('div');
    topBar.id = 'top-bar';
    topBar.innerHTML = `
        <div class="top-bar-left">
            <button id="hamburger-menu-btn" class="hexagon-btn">
                <span class="line line1"></span>
                <span class="line line2"></span>
                <span class="line line3"></span>
            </button>
            <div class="logo">NameIT</div>
        </div>
        <div class="top-bar-right">
            <!-- Authentication buttons (visible when signed out) -->
            <div id="auth-buttons" class="flex items-center gap-4">
                <button id="signup-btn" class="auth-btn">Sign Up</button>
                <button id="signin-btn" class="auth-btn">Sign In</button>
            </div>
            <!-- User info container (visible when signed in) -->
            <div id="user-info-container">
                <img id="user-pfp" src="https://placehold.co/40x40/800080/FFFFFF?text=P" alt="Profile picture">
                <div class="user-text">
                    <p id="user-name">User Name</p>
                    <p id="user-email">user@email.com</p>
                </div>
            </div>
            <!-- Dropdown for Sign Out -->
            <div id="profile-dropdown" class="profile-dropdown">
                <button id="signout-btn">Sign Out</button>
            </div>
        </div>
    `;
    topBarPlaceholder.appendChild(topBar);

    // Event listener for hamburger menu
    document.getElementById('hamburger-menu-btn').addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar-placeholder');
        const overlay = document.getElementById('overlay');
        const hamburgerBtn = document.getElementById('hamburger-menu-btn');
        
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
        
        // Adjust main content padding
        const mainContent = document.querySelector('.main-content-wrapper');
        if (sidebar.classList.contains('active')) {
            mainContent.style.paddingLeft = 'var(--sidebar-width)';
        } else {
            mainContent.style.paddingLeft = '10px';
        }
    });

    // Event listener to show signup modal
    document.getElementById('signup-btn').addEventListener('click', () => {
        document.getElementById('signup-modal').classList.add('active');
    });

    // Event listener to show signin modal
    document.getElementById('signin-btn').addEventListener('click', () => {
        document.getElementById('signin-modal').classList.add('active');
    });

    // Event listener for profile dropdown
    const userInfoContainer = document.getElementById('user-info-container');
    const profileDropdown = document.getElementById('profile-dropdown');
    userInfoContainer.addEventListener('click', (event) => {
        profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        event.stopPropagation(); // Prevents the click from closing the dropdown immediately
    });

    // Close dropdown if user clicks anywhere else
    window.addEventListener('click', (event) => {
        if (!userInfoContainer.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.style.display = 'none';
        }
    });

    // Event listeners to switch between modals
    document.getElementById('show-signin-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signup-modal').classList.remove('active');
        document.getElementById('signin-modal').classList.add('active');
    });

    document.getElementById('show-signup-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signin-modal').classList.remove('active');
        document.getElementById('signup-modal').classList.add('active');
    });
}

// Call the function to create the top bar when the script loads
createTopBar();

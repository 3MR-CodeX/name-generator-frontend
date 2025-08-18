const BACKEND_URL = "https://nameit-backend-2.vercel.app";

document.addEventListener("DOMContentLoaded", async () => {
    // UPDATED: Corrected paths
    await loadComponent('top-bar-placeholder', '../components/topbar.html');
    await loadComponent('sidebar-placeholder', '../components/sidebar.html');

    if (typeof initializeTopbar === 'function') initializeTopbar();
    if (typeof initializeSidebar === 'function') initializeSidebar();
    if (typeof initializeAuth === 'function') initializeAuth();

    const checkBtn = document.getElementById("check-availability-btn");
    if (checkBtn) {
        checkBtn.addEventListener('click', handleAvailabilityCheck);
    }
});
// ... (rest of availability.js is the same as the last version I provided)
// ... (rest of the file is the same as the previous correct version)

async function handleAvailabilityCheck() {
    const nameInput = document.getElementById("name-to-check-input");
    const resultsContainer = document.getElementById("results-container");
    const domainList = document.getElementById("domain-results-list");
    const socialList = document.getElementById("social-results-list");
    const errorDiv = document.getElementById("error");
    const checkBtn = document.getElementById("check-availability-btn");

    const name = nameInput.value.trim();
    if (!name) {
        errorDiv.textContent = "Please enter a name to check.";
        return;
    }
    errorDiv.textContent = "";

    resultsContainer.classList.remove("hidden-section");
    resultsContainer.classList.add("visible-section");
    domainList.innerHTML = '<div class="spinner-overlay show"><div class="spinner"></div></div>';
    socialList.innerHTML = '<div class="spinner-overlay show"><div class="spinner"></div></div>';
    checkBtn.disabled = true;
    checkBtn.textContent = "Checking...";

    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/check-availability`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify({ name })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "An error occurred during the check.");
        }

        const data = await response.json();
        renderResults(domainList, data.domains);
        renderResults(socialList, data.socials);

    } catch(err) {
        errorDiv.textContent = err.message;
        domainList.innerHTML = '<p>Could not fetch results.</p>';
        socialList.innerHTML = '<p>Could not fetch results.</p>';
    } finally {
        checkBtn.disabled = false;
        checkBtn.textContent = "Check Availability";
    }
}

function renderResults(container, results) {
    container.innerHTML = ""; // Clear spinner
    if (!results || results.length === 0) {
        container.textContent = "No platforms checked or an error occurred.";
        return;
    }
    results.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'status-item';

        const platformSpan = document.createElement('span');
        platformSpan.textContent = item.platform;

        const statusSpan = document.createElement('span');
        statusSpan.textContent = item.status.charAt(0).toUpperCase() + item.status.slice(1);
        statusSpan.className = `status-badge ${item.status}`;

        itemDiv.appendChild(platformSpan);
        itemDiv.appendChild(statusSpan);
        container.appendChild(itemDiv);
    });
}


// --- SHARED HELPER FUNCTIONS ---

async function loadComponent(placeholderId, componentUrl) {
    try {
        const response = await fetch(componentUrl);
        if (!response.ok) throw new Error(`Failed to load ${componentUrl}`);
        document.getElementById(placeholderId).innerHTML = await response.text();
    } catch (error) {
        console.error(error);
        document.getElementById(placeholderId).innerHTML = `<div style="color: red;">Error loading component.</div>`;
    }
}

async function getUserToken() {
    if (window.auth && window.auth.currentUser) {
        await window.auth.currentUser.reload();
        return await window.auth.currentUser.getIdToken(true);
    }
    return null;
}

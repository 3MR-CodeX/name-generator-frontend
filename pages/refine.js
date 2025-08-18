const BACKEND_URL = "https://nameit-backend-2.vercel.app";

document.addEventListener("DOMContentLoaded", async () => {
    // UPDATED: Corrected paths
    await loadComponent('top-bar-placeholder', '../components/topbar.html');
    await loadComponent('sidebar-placeholder', '../components/sidebar.html');

    if (typeof initializeTopbar === 'function') initializeTopbar();
    if (typeof initializeSidebar === 'function') initializeSidebar();
    if (typeof initializeAuth === 'function') initializeAuth();

    const refineBtn = document.getElementById("custom-refine-btn");
    if (refineBtn) {
        refineBtn.addEventListener('click', handleCustomRefine);
    }
});

// ... (rest of refine.js is the same as the last version I provided)
// ... (rest of the file is the same as the previous correct version)
async function handleCustomRefine() {
    const nameInput = document.getElementById("custom-name-input");
    const instructionInput = document.getElementById("refine-instruction-input");
    const outputContainer = document.getElementById("output_container");
    const refinedNamesPre = document.getElementById("refined_names");
    const refinedReasonsPre = document.getElementById("refined_reasons");
    const errorDiv = document.getElementById("error");
    const copyBtn = outputContainer.querySelector(".copy-button");
    const refineBtn = document.getElementById("custom-refine-btn");

    const name = nameInput.value.trim();
    const instruction = instructionInput.value.trim();

    if (!name || !instruction) {
        errorDiv.textContent = "Both name and instruction fields are required.";
        return;
    }
    errorDiv.textContent = "";

    outputContainer.classList.remove("hidden-section");
    outputContainer.classList.add("visible-section");
    showLoading(refinedNamesPre);
    showLoading(refinedReasonsPre);
    refineBtn.disabled = true;
    
    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/custom-refine`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify({ name, instruction })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "An error occurred during refinement.");
        }

        const data = await response.json();
        
        refinedNamesPre.textContent = data.names.join("\n\n");
        refinedReasonsPre.textContent = data.reasons.join("\n\n");
        
        copyBtn.onclick = () => copyToClipboard('refined_names');
        document.getElementById('reasons-copy-btn').onclick = () => copyToClipboard('refined_reasons');


    } catch(err) {
        errorDiv.textContent = err.message;
        outputContainer.classList.remove("visible-section");
        outputContainer.classList.add("hidden-section");
    } finally {
        hideLoading(refinedNamesPre);
        hideLoading(refinedReasonsPre);
        
        let countdown = 5;
        refineBtn.textContent = `Please wait ${countdown}s...`;
        
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                refineBtn.textContent = `Please wait ${countdown}s...`;
            } else {
                clearInterval(interval);
                refineBtn.textContent = '🔬 Refine Name';
                refineBtn.disabled = false;
            }
        }, 1000);
    }
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

function showLoading(targetElement) {
    targetElement.textContent = "";
    let spinnerOverlay = targetElement.querySelector(".spinner-overlay");
    if (!spinnerOverlay) {
        spinnerOverlay = document.createElement("div");
        spinnerOverlay.className = "spinner-overlay show";
        spinnerOverlay.innerHTML = '<div class="spinner"></div>';
        targetElement.appendChild(spinnerOverlay);
    } else {
        spinnerOverlay.classList.add("show");
    }
}

function hideLoading(targetElement) {
    const spinnerOverlay = targetElement.querySelector(".spinner-overlay");
    if (spinnerOverlay) spinnerOverlay.classList.remove("show");
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        const copyMessage = document.createElement('div');
        copyMessage.textContent = "Copied to clipboard!";
        copyMessage.style.cssText = `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: var(--button-purple); color: white; padding: 10px 20px; border-radius: 8px; z-index: 1000; opacity: 0; transition: opacity 0.5s ease-out;`;
        document.body.appendChild(copyMessage);
        setTimeout(() => { copyMessage.style.opacity = 1; }, 10);
        setTimeout(() => { copyMessage.style.opacity = 0; copyMessage.addEventListener('transitionend', () => copyMessage.remove()); }, 2000);
    });
}

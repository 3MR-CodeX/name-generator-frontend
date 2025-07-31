const BACKEND_URL = "https://nameit-backend-2.vercel.app";

const CATEGORY_OPTIONS = [
  "App", "Book", "Brand", "Company", "Course", "Drawing", "Event", "Game",
  "New Word", "Object", "Pet", "Place", "Platform", "Podcast", "Product",
  "Random", "Service", "Song", "Startup", "Tool", "Trend", "Video", "Website"
];
const STYLE_OPTIONS = [
  "Random", "Powerful", "aggressive", "Artistic", "Arcade", "Bold", "Catchy",
  "Cheerful", "Classy", "Cozy", "Creative", "Cryptic", "Cute", "Dark", "Edgy",
  "Elegant", "Efficient", "Fantasy", "Fashion", "Funny", "Futuristic", "Informative",
  "Intense", "Luxury", "Minimal", "Modern", "Mythical", "Organic", "Playful", "Mysterious",
  "Professional", "Retro", "Relaxing", "Scary", "Smart", "Stylish", "Sleek", "Competitive",
  "Suspense", "Surreal", "Traditional", "Uplifting", "Wholesome", "Zen", "Whimsical"
];
const SURPRISES = [
    ["أريد اسمًا قويًا ومميزًا لعلامة تجارية عربية جديدة في مجال التكنولوجيا", "Brand", "Powerful", "Arabic"],
    ["A silly and cute name for a hyperactive parrot", "Pet", "Funny", "English"],
    ["A strange, ancient place hidden under the ocean", "Place", "Mysterious", "English"],
    ["An elegant and luxurious name for a new high-end perfume line", "Product", "Luxury", "English"],
    ["A poetic name for a short film about isolation and self-discovery", "Video", "Minimal", "English"],
    ["A silly and cute name for a hyperactive parrot", "Pet", "Funny", "English"],
    ["A strange, ancient place hidden under the ocean", "Place", "Mysterious", "English"],
    ["An elegant and luxurious name for a new high-end perfume line", "Product", "Luxury", "English"],
    ["A poetic name for a short film about isolation and self-discovery", "Video", "Minimal", "English"],
    ["An edgy and futuristic name for a cyberpunk productivity app", "App", "Futuristic", "English"],
    ["A wholesome name for a cozy coffee shop in a rainy city", "Place", "Wholesome", "English"],
    ["A bold and cryptic name for an underground hacker forum", "Platform", "Dark", "English"],
    ["A magical and whimsical name for a children’s toy line", "Product", "Whimsical", "English"],
    ["A high-energy name for a viral TikTok challenge", "Trend", "Catchy", "English"],
    ["A mysterious name for an AI-powered time travel game", "Game", "Mysterious", "English"],
    ["A funky brand name for a retro streetwear label", "Brand", "Retro", "English"],
    ["A futuristic name for a space-themed meditation app", "App", "Zen", "English"],
    ["A gritty name for a post-apocalyptic survival video game", "Game", "Intense", "English"],
    ["A dramatic title for a thriller about corporate espionage", "Video", "Suspense", "English"],
    ["A charming name for a vintage bookstore", "Place", "Cozy", "English"],
    ["A stylish name for a luxury sneaker brand", "Product", "Fashion", "English"],
    ["A joyful and energetic name for a dance studio", "Place", "Cheerful", "English"],
    ["A techy and scalable name for a SaaS startup", "App", "Professional", "English"],
    ["An abstract name for a generative art collective", "Platform", "Creative", "English"],
    ["A powerful name for a female-led crypto fintech brand", "Brand", "Bold", "English"],
    ["A mystical name for a fantasy book publishing house", "Platform", "Fantasy", "English"],
    ["An iconic name for a retro-style arcade game", "Game", "Arcade", "English"],
    ["A hilarious name for a parody news site", "Platform", "Funny", "English"],
    ["An ethereal name for a nature-inspired skincare line", "Product", "Organic", "English"],
    ["A clever name for an AI assistant for writers", "App", "Smart", "English"],
    ["A peaceful name for a forest retreat resort", "Place", "Relaxing", "English"],
    ["An intriguing name for a tech documentary series", "Video", "Informative", "English"],
    ["A fashionable name for a digital outfit creator", "Product", "Stylish", "English"],
    ["A punchy name for an esports team", "Platform", "Competitive", "English"],
    ["A quirky name for a smart pet gadget", "Product", "Playful", "English"],
    ["A surreal name for a virtual dream simulator", "App", "Surreal", "English"],
    ["An optimistic name for a mental health journaling app", "App", "Uplifting", "English"],
    ["A sleek name for a futuristic transportation startup", "Brand", "Sleek", "English"],
    ["A mythical name for a fantasy map generation tool", "App", "Mythical", "English"],
    ["A classy name for an online wine subscription service", "Product", "Classy", "English"],
    ["An awe-inspiring name for a photography portfolio site", "Platform", "Artistic", "English"],
    ["A mysterious name for an anonymous feedback app", "App", "Cryptic", "English"],
    ["A snappy name for a productivity browser extension", "App", "Efficient", "English"],
    ["A delightful name for a weekly design inspiration newsletter", "Platform", "Creative", "English"],
    ["A chilling title for a horror podcast series", "Video", "Scary", "English"]
];

// Get references to key UI elements
const outputContainer = document.getElementById("output_container");
const refineSection = document.getElementById("refine_section");
const refinedOutputs = document.getElementById("refined_outputs");
const refineBtn = document.querySelector(".refine-btn");
const namesPre = document.getElementById("names");
const reasonsPre = document.getElementById("reasons");
const refinedNamesPre = document.getElementById("refined_names");
const refinedReasonsPre = document.getElementById("refined_reasons");
const promptInput = document.getElementById("prompt");
const editBox = document.getElementById("edit_box");

// Get button references for disabling
const generateBtn = document.querySelector(".generate-btn");
const surpriseBtn = document.querySelector(".surprise-btn");

// New UI elements for history modals
const historyModal = document.getElementById("history-modal"); // Full history list modal
const closeButtonHistoryModal = document.querySelector("#history-modal .close-button");
const fullHistoryList = document.getElementById("full-history-list");

const historyDetailsModal = document.getElementById("history-details-modal"); // History details modal
const closeButtonDetailsModal = document.querySelector("#history-details-modal .close-button");
const detailsContent = document.getElementById("details-content"); // Content area for details modal

const recentHistorySection = document.getElementById("history_section"); // Reference to the recent history section
const recentHistoryDiv = document.getElementById("history"); // Reference to the recent history div inside the section

// Auth UI Elements (NEW)
const authButtonsDiv = document.getElementById("auth-buttons");
const userProfileInfoDiv = document.getElementById("user-profile-info");
const userPfpImg = document.getElementById("user-pfp");
const userNameSpan = document.getElementById("user-name");
const userEmailSpan = document.getElementById("user-email");
const creditBalanceSpan = document.getElementById("credit-balance");

// Auth Modals (NEW)
const signupModal = document.getElementById("signup-modal");
const signinModal = document.getElementById("signin-modal");

// Global Firebase variables (initialized in index.html script)
window.auth = null;
window.db = null;
window.currentUser = null; // Stores the Firebase User object
window.currentUserId = null; // Stores the UID (Firebase UID or anonymous UUID)

document.addEventListener("DOMContentLoaded", async () => {
    // Load top bar HTML
    await loadComponent('top-bar-placeholder', 'components/topbar.html');
    // Load sidebar HTML
    await loadComponent('sidebar-placeholder', 'components/sidebar.html');
    // Load auth modals HTML (NEW)
    await loadComponent('signup-modal', 'components/accounting/signup-modal.html'); // Corrected path to lowercase 'accounting'
    await loadComponent('signin-modal', 'components/accounting/signin-modal.html'); // Corrected path to lowercase 'accounting'


    // Initialize component-specific JS AFTER their HTML is loaded
    if (typeof initializeTopbar === 'function') {
        initializeTopbar();
    }
    if (typeof initializeSidebar === 'function') {
        initializeSidebar();
    }

    initializeUI();
    populateDropdown("category", CATEGORY_OPTIONS);
    populateDropdown("style", STYLE_OPTIONS);
    setupTooltips();

    // Event listeners for full history list modal
    if (historyModal && closeButtonHistoryModal) {
        closeButtonHistoryModal.addEventListener('click', closeHistoryModal);
        window.addEventListener('click', (event) => {
            if (event.target == historyModal) {
                closeHistoryModal();
            }
        });
    }

    // Event listeners for history details modal
    if (historyDetailsModal && closeButtonDetailsModal) {
        closeButtonDetailsModal.addEventListener('click', () => {
            closeHistoryDetailsModal();
            openHistoryModal(); // Re-open the full history list
        });
        window.addEventListener('click', (event) => {
            if (event.target == historyDetailsModal) {
                closeHistoryDetailsModal();
                openHistoryModal(); // Re-open the full history list
            }
        });
    }

    // Event listeners for auth modals (NEW)
    if (signupModal) {
        window.addEventListener('click', (event) => {
            if (event.target == signupModal) {
                closeSignUpModal();
            }
        });
    }
    if (signinModal) {
        window.addEventListener('click', (event) => {
            if (event.target == signinModal) {
                closeSignInModal();
            }
        });
    }
});

/**
 * Dynamically loads an HTML component into a placeholder.
 * @param {string} placeholderId The ID of the div to load the HTML into.
 * @param {string} componentUrl The URL of the HTML file to load.
 */
async function loadComponent(placeholderId, componentUrl) {
    try {
        const response = await fetch(componentUrl);
        if (!response.ok) {
            throw new Error(`Failed to load component ${componentUrl}: ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
        console.error(error);
        document.getElementById(placeholderId).innerHTML = `<div style="color: red;">Error loading ${componentUrl}</div>`;
    }
}


function initializeUI() {
    // Add 'hidden-section' class to ALL sections that should be initially hidden
    outputContainer.classList.add("hidden-section");
    refineSection.classList.add("hidden-section");
    refinedOutputs.classList.add("hidden-section");
    refineBtn.classList.add("hidden-section");
    // Ensure history section is hidden initially
    recentHistorySection.classList.add("hidden-section");


    // Store original placeholders for error messaging
    if (!promptInput.dataset.originalPlaceholder) {
        promptInput.dataset.originalPlaceholder = promptInput.placeholder;
    }
    if (!editBox.dataset.originalPlaceholder) {
        editBox.dataset.originalPlaceholder = editBox.placeholder;
    }
}

function populateDropdown(id, options) {
    const select = document.getElementById(id);
    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

function cleanNames(text) {
    return text.replace(/\*\*/g, '');
}

/**
 * Shows a loading spinner overlay on a given element.
 * @param {HTMLElement} targetElement The element to overlay the spinner on.
 */
function showLoading(targetElement) {
    // Clear any existing content and animation classes
    targetElement.textContent = "";
    targetElement.classList.remove("fade-in-content");

    // Create spinner overlay if it doesn't exist
    let spinnerOverlay = targetElement.querySelector(".spinner-overlay");
    if (!spinnerOverlay) {
        spinnerOverlay = document.createElement("div");
        spinnerOverlay.className = "spinner-overlay";
        spinnerOverlay.innerHTML = '<div class="spinner"></div>';
        targetElement.appendChild(spinnerOverlay);
    }
    spinnerOverlay.classList.add("show"); // Show the spinner
}

/**
 * Hides the loading spinner overlay from a given element.
 * @param {HTMLElement} targetElement The element to remove the spinner from.
 */
function hideLoading(targetElement) {
    const spinnerOverlay = targetElement.querySelector(".spinner-overlay");
    if (spinnerOverlay) {
        spinnerOverlay.classList.remove("show"); // Hide the spinner
    }
}

/**
 * Disables all relevant buttons during a loading state.
 */
function disableButtons() {
    generateBtn.disabled = true;
    surpriseBtn.disabled = true;
    refineBtn.disabled = true;
}

/**
 * Enables all relevant buttons after a loading state.
 */
function enableButtons() {
    generateBtn.disabled = false;
    surpriseBtn.disabled = false;
    refineBtn.disabled = false;
}

/**
 * Displays a temporary error message in a textarea's placeholder.
 * @param {HTMLTextAreaElement} textarea The textarea element.
 * @param {string} message The error message to display.
 */
function showTemporaryPlaceholderError(textarea, message) {
    // Store original placeholder if not already stored
    if (!textarea.dataset.originalPlaceholder) {
        textarea.dataset.originalPlaceholder = textarea.placeholder;
    }
    textarea.placeholder = message;
    textarea.classList.add("prompt-error-placeholder");

    // Clear the error after 3 seconds
    setTimeout(() => {
        // Only revert if the current placeholder is still the error message
        if (textarea.placeholder === message) {
            textarea.placeholder = textarea.dataset.originalPlaceholder;
            textarea.classList.remove("prompt-error-placeholder");
        }
    }, 3000);
}


async function generateName() {
    const prompt = promptInput.value.trim(); // Trim whitespace from prompt

    // --- Empty Prompt Handling ---
    if (!prompt) {
        showTemporaryPlaceholderError(promptInput, "You cannot generate names without a description!");
        // Ensure all dynamic sections are hidden when there's no prompt
        resetDynamicSections(); 
        return; // Stop function execution
    } else {
        // Clear error placeholder if prompt is now valid (if it was previously set)
        promptInput.placeholder = promptInput.dataset.originalPlaceholder;
        promptInput.classList.remove("prompt-error-placeholder");
    }

    const category = document.getElementById("category").value;
    const style = document.getElementById("style").value;
    const language = document.getElementById("language").value;

    if (!BACKEND_URL) {
        document.getElementById("error").textContent = "Backend URL not set correctly.";
        resetDynamicSections(); // Hide all dynamic sections on critical error
        return;
    }

    // Clear general error message at the start of a valid attempt
    document.getElementById("error").textContent = "";

    // Show output boxes
    outputContainer.classList.remove("hidden-section");
    outputContainer.classList.add("visible-section");

    // Show loading state for output boxes and disable buttons
    showLoading(namesPre);
    showLoading(reasonsPre);
    disableButtons();

    // Hide refined outputs when generating new names (with animation)
    refinedOutputs.classList.remove("visible-section");
    refinedOutputs.classList.add("hidden-section");

    // Hide refine section and button initially, they will be shown on success if prompt is valid
    refineSection.classList.remove("visible-section");
    refineSection.classList.add("hidden-section");
    refineBtn.classList.remove("visible-section");
    refineBtn.classList.add("hidden-section");

    let idToken = null;
    if (window.auth && window.auth.currentUser) {
        try {
            idToken = await window.auth.currentUser.getIdToken();
        } catch (error) {
            console.error("Error getting ID token:", error);
            document.getElementById("error").textContent = "Error getting authentication token. Please try again.";
            hideLoading(namesPre);
            hideLoading(reasonsPre);
            enableButtons();
            return;
        }
    }

    try {
        const headers = {
            "Content-Type": "application/json",
        };
        if (idToken) {
            headers["Authorization"] = `Bearer ${idToken}`;
        } else if (window.currentUserId) { // For anonymous users
            headers["X-Anonymous-ID"] = window.currentUserId;
        }

        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ prompt, category, style, language })
        });
        if (!response.ok) {
            const errorData = await response.json(); // Assuming backend sends JSON error
            if (response.status === 403) {
                document.getElementById("error").textContent = errorData.detail || "Insufficient credits. Please sign in or top up.";
            } else {
                document.getElementById("error").textContent = errorData.detail || "Unknown error during name generation.";
            }
            resetDynamicSections();
            return;
        }
        const data = await response.json();

        namesPre.textContent = data.names.map(cleanNames).join("\n");
        reasonsPre.textContent = data.reasons.map(cleanNames).join("\n");

        // Add animation class after content is set
        namesPre.classList.add("fade-in-content");
        reasonsPre.classList.add("fade-in-content");

        // Show Refine section and button ONLY if prompt has content (which it will here due to initial check)
        refineSection.classList.remove("hidden-section");
        refineSection.classList.add("visible-section");
        refineBtn.classList.remove("hidden-section");
        refineBtn.classList.add("visible-section");
        
        // Show recent history section after successful generation
        recentHistorySection.classList.remove("hidden-section");
        recentHistorySection.classList.add("visible-section");
        
        // Refresh credits after successful generation
        if (typeof window.fetchCredits === 'function') {
            window.fetchCredits();
        }
        fetchHistory(false); // Refresh recent history after successful generation

    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        // If generation fails, hide output and refine sections
        resetDynamicSections(); // Hide all dynamic sections on error
        // Clear content in case of error
        namesPre.textContent = "";
        reasonsPre.textContent = "";

    } finally {
        hideLoading(namesPre);
        hideLoading(reasonsPre);
        enableButtons();
    }
}

async function refineNames() {
    const instruction = editBox.value.trim(); // Trim whitespace from instruction

    // --- Empty Refine Instruction Handling ---
    if (!instruction) {
        showTemporaryPlaceholderError(editBox, "Please enter a refine instruction.");
        document.getElementById("error").textContent = ""; // Clear general error message
        return; // Stop function execution
    } else {
        // Clear error placeholder if instruction is now valid (if it was previously set)
        editBox.placeholder = editBox.dataset.originalPlaceholder;
        editBox.classList.remove("prompt-error-placeholder");
    }

    if (!BACKEND_URL) {
        document.getElementById("error").textContent = "Backend URL not set correctly.";
        return;
    }

    document.getElementById("error").textContent = ""; // Clear previous error

    // Show loading state for refined output boxes and disable buttons
    showLoading(refinedNamesPre);
    showLoading(refinedReasonsPre);
    disableButtons();

    let idToken = null;
    if (window.auth && window.auth.currentUser) {
        try {
            idToken = await window.auth.currentUser.getIdToken();
        } catch (error) {
            console.error("Error getting ID token:", error);
            document.getElementById("error").textContent = "Error getting authentication token. Please try again.";
            hideLoading(refinedNamesPre);
            hideLoading(refinedReasonsPre);
            enableButtons();
            return;
        }
    }

    try {
        const headers = {
            "Content-Type": "application/json",
        };
        if (idToken) {
            headers["Authorization"] = `Bearer ${idToken}`;
        } else if (window.currentUserId) { // For anonymous users
            headers["X-Anonymous-ID"] = window.currentUserId;
        }

        const response = await fetch(`${BACKEND_URL}/refine`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ instruction })
        });
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 403) {
                document.getElementById("error").textContent = errorData.detail || "Insufficient credits. Please sign in or top up.";
            } else {
                document.getElementById("error").textContent = errorData.detail || "Unknown error during name refinement.";
            }
            // If refinement fails, hide refined output and clear content
            refinedOutputs.classList.remove("visible-section");
            refinedOutputs.classList.add("hidden-section");
            refinedNamesPre.textContent = "";
            refinedReasonsPre.textContent = "";
            return;
        }
        const data = await response.json();

        refinedNamesPre.textContent = data.names.map(cleanNames).join("\n");
        reasonsPre.textContent = data.reasons.map(cleanNames).join("\n");

        // Add animation class after content is set
        refinedNamesPre.classList.add("fade-in-content");
        refinedReasonsPre.classList.add("fade-in-content");

        // Show refined outputs with animation
        refinedOutputs.classList.remove("hidden-section");
        refinedOutputs.classList.add("visible-section");

        // Refresh credits after successful refinement
        if (typeof window.fetchCredits === 'function') {
            window.fetchCredits();
        }
        fetchHistory(false); // Refresh recent history after successful refinement

    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        // If refinement fails, hide refined output and clear content
        refinedOutputs.classList.remove("visible-section");
        refinedOutputs.classList.add("hidden-section");
        refinedNamesPre.textContent = "";
        refinedReasonsPre.textContent = "";
    } finally {
        hideLoading(refinedNamesPre);
        hideLoading(refinedReasonsPre);
        enableButtons();
    }
}

// Made global so sidebar.js can call it, and now handles rendering to sidebar or modal
async function fetchHistory(renderToModal = false) {
    if (!window.currentUserId) {
        console.warn("No user ID available to fetch history.");
        return;
    }

    let idToken = null;
    if (window.auth && window.auth.currentUser) {
        try {
            idToken = await window.auth.currentUser.getIdToken();
        } catch (error) {
            console.error("Error getting ID token for history:", error);
            document.getElementById("error").textContent = "Error getting authentication token for history. Please try again.";
            return;
        }
    }

    try {
        const headers = {};
        if (idToken) {
            headers["Authorization"] = `Bearer ${idToken}`;
        } else { // For anonymous users
            headers["X-Anonymous-ID"] = window.currentUserId;
        }

        const response = await fetch(`${BACKEND_URL}/history`, { headers: headers });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Unknown error fetching history.");
        }
        const history = await response.json();
        renderHistory(history, renderToModal);
    } catch (error) {
        document.getElementById("error").textContent = "Error fetching history: " + error.message;
    }
}

// Made global so sidebar.js can call it
function renderHistory(history, renderToModal = false) {
    const targetDiv = renderToModal ? fullHistoryList : recentHistoryDiv;
    
    if (!targetDiv) {
        console.warn(`Target history div not found. renderToModal: ${renderToModal}`);
        return;
    }

    targetDiv.innerHTML = ""; // Clear previous content

    let historyToRender = history;
    if (!renderToModal) {
        // For recent history, only show the last 100 entries
        historyToRender = history.slice(0, 100);
    }

    if (historyToRender.length === 0) {
        targetDiv.innerHTML = "<p>*No history yet. Generate some names!*</p>";
        return;
    }

    // Group history by date for modal, or just render directly for recent history
    if (renderToModal) {
        const groupedHistory = historyToRender.reduce((acc, entry) => {
            const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(entry);
            return acc;
        }, {});

        // Sort dates in descending order (most recent first)
        const sortedDates = Object.keys(groupedHistory).sort((a, b) => new Date(b) - new Date(a));

        sortedDates.forEach(date => {
            const dailyContainer = document.createElement('div');
            dailyContainer.className = 'daily-history-container';

            const dateHeading = document.createElement('h3');
            dateHeading.textContent = date;
            dailyContainer.appendChild(dateHeading);

            // Sort entries within each day by timestamp (most recent first)
            groupedHistory[date].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(entry => {
                const names = entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ");
                const tooltip = entry.category !== "Refined" ?
                    `Prompt: ${entry.prompt}\nCategory: ${entry.category}\nStyle: ${entry.style}\nLanguage: ${entry.language}` :
                    `Refine Instruction: ${entry.prompt}`;
                
                let preRefined = '';
                if (entry.pre_refined_names && entry.pre_refined_names.length > 0) {
                    preRefined = `<span class="pre-refined"> (from: ${entry.pre_refined_names.map(cleanNames).join(", ")})</span>`;
                }

                const button = document.createElement('button');
                button.className = 'history-item';
                button.title = tooltip;
                button.innerHTML = `${names}${preRefined}`;
                // For full history, clicking opens details modal
                button.onclick = () => showHistoryDetails(entry.id); 
                dailyContainer.appendChild(button);
            });
            targetDiv.appendChild(dailyContainer);
        });
    } else {
        // For recent history, just append items directly (already sliced to 100)
        // Sort entries by timestamp (most recent first) for recent history
        historyToRender.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(entry => {
            const names = entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ");
            const tooltip = entry.category !== "Refined" ?
                `Prompt: ${entry.prompt}\nCategory: ${entry.category}\nStyle: ${entry.style}\nLanguage: ${entry.language}` :
                `Refine Instruction: ${entry.prompt}`;
            
            let preRefined = '';
            if (entry.pre_refined_names && entry.pre_refined_names.length > 0) {
                preRefined = `<span class="pre-refined"> (from: ${entry.pre_refined_names.map(cleanNames).join(", ")})</span>`;
                }

            const button = document.createElement('button');
            button.className = 'history-item';
            button.title = tooltip;
            button.innerHTML = `${names}${preRefined}`;
            // For recent history, clicking restores to main form
            button.onclick = () => restoreHistory(entry.id); 
            targetDiv.appendChild(button);
        });
    }
}

// Made global so sidebar.js can call it
async function restoreHistory(id) {
    // Clear any existing error messages when restoring
    document.getElementById("error").textContent = "";
    // Reset prompt and refine placeholders and remove error styling
    promptInput.placeholder = promptInput.dataset.originalPlaceholder;
    promptInput.classList.remove("prompt-error-placeholder");
    editBox.placeholder = editBox.dataset.originalPlaceholder;
    editBox.classList.remove("prompt-error-placeholder");

    // Close any open modals
    closeHistoryModal();
    closeHistoryDetailsModal();

    if (!window.currentUserId) {
        console.warn("No user ID available to restore history.");
        return;
    }

    let idToken = null;
    if (window.auth && window.auth.currentUser) {
        try {
            idToken = await window.auth.currentUser.getIdToken();
        } catch (error) {
            console.error("Error getting ID token for restore history:", error);
            document.getElementById("error").textContent = "Error getting authentication token for history. Please try again.";
            return;
        }
    }

    try {
        const headers = {};
        if (idToken) {
            headers["Authorization"] = `Bearer ${idToken}`;
        } else { // For anonymous users
            headers["X-Anonymous-ID"] = window.currentUserId;
        }

        const response = await fetch(`${BACKEND_URL}/history`, { headers: headers });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Unknown error fetching history for restore.");
        }
        const historyData = await response.json();
        const entry = historyData.find(e => e.id === id);

        if (entry) {
            promptInput.value = entry.prompt;
            document.getElementById("category").value = entry.category;
            document.getElementById("style").value = entry.style;
            document.getElementById("language").value = entry.language;
            namesPre.textContent = entry.names.map(cleanNames).join("\n");
            reasonsPre.textContent = entry.reasons.map(cleanNames).join("\n");

            // Ensure animation class is applied
            namesPre.classList.add("fade-in-content");
            reasonsPre.classList.add("fade-in-content");

            // Show main output and history sections
            outputContainer.classList.remove("hidden-section");
            outputContainer.classList.add("visible-section");
            
            // Show refine section and button ONLY if prompt has content
            if (entry.category !== "Refined" && promptInput.value.trim()) { // Only show refine for non-refined entries
                refineSection.classList.remove("hidden-section");
                refineSection.classList.add("visible-section");
                refineBtn.classList.remove("hidden-section");
                refineBtn.classList.add("visible-section");
            } else {
                refineSection.classList.remove("visible-section");
                refineSection.classList.add("hidden-section");
                refineBtn.classList.remove("visible-section");
                refineBtn.classList.add("hidden-section");
            }

            // Always hide refined outputs when restoring from history
            refinedOutputs.classList.remove("visible-section");
            refinedOutputs.classList.add("hidden-section");

            // Show recent history section
            recentHistorySection.classList.remove("hidden-section");
            recentHistorySection.classList.add("visible-section");

            // Close sidebar if it's open after restoring history
            if (typeof toggleSidebar === 'function' && window.isSidebarOpen) { // Access isSidebarOpen globally
                toggleSidebar();
            }

        } else if (id === 'latest') { // Handle "Latest Generation" click from sidebar
            if (historyData.length > 0) {
                const latestEntry = historyData[0];
                promptInput.value = latestEntry.prompt;
                document.getElementById("category").value = latestEntry.category;
                document.getElementById("style").value = latestEntry.style;
                document.getElementById("language").value = latestEntry.language;
                namesPre.textContent = latestEntry.names.map(cleanNames).join("\n");
                reasonsPre.textContent = latestEntry.reasons.map(cleanNames).join("\n");

                namesPre.classList.add("fade-in-content");
                reasonsPre.classList.add("fade-in-content");

                outputContainer.classList.remove("hidden-section");
                outputContainer.classList.add("visible-section");
                
                if (latestEntry.category !== "Refined" && promptInput.value.trim()) {
                    refineSection.classList.remove("hidden-section");
                    refineSection.classList.add("visible-section");
                    refineBtn.classList.remove("hidden-section");
                    refineBtn.classList.add("visible-section");
                } else {
                    refineSection.classList.remove("visible-section");
                    refineSection.classList.add("hidden-section");
                    refineBtn.classList.remove("visible-section");
                    refineBtn.classList.add("hidden-section");
                }
                refinedOutputs.classList.remove("visible-section");
                refinedOutputs.classList.add("hidden-section");

                // Show recent history section
                recentHistorySection.classList.remove("hidden-section");
                recentHistorySection.classList.add("visible-section");

                if (typeof toggleSidebar === 'function' && window.isSidebarOpen) {
                    toggleSidebar();
                }
            } else {
                document.getElementById("error").textContent = "No history available to restore.";
            }
        }
    } catch (error) {
        document.getElementById("error").textContent = "Error fetching history for restore: " + error.message;
    }
}

function surpriseMe() {
    const [prompt, category, style, language] = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
    promptInput.value = prompt;
    document.getElementById("category").value = category;
    document.getElementById("style").value = style;
    document.getElementById("language").value = language;
    
    // Call generateName directly after setting the surprise prompt
    generateName(); 
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        const copyMessage = document.createElement('div');
        copyMessage.textContent = "Copied to clipboard!";
        copyMessage.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--button-purple);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s ease-out;
        `;
        document.body.appendChild(copyMessage);
        setTimeout(() => {
            copyMessage.style.opacity = 1;
        }, 10); // Small delay to trigger transition
        setTimeout(() => {
            copyMessage.style.opacity = 0;
            copyMessage.addEventListener('transitionend', () => copyMessage.remove());
        }, 2000); // Message visible for 2 seconds
    });
}

/**
 * Resets all dynamic UI sections to their initial hidden state.
 * This is used when an an operation fails or an empty prompt is detected.
 */
function resetDynamicSections() {
    outputContainer.classList.remove("visible-section");
    outputContainer.classList.add("hidden-section");
    refineSection.classList.remove("visible-section");
    refineSection.classList.add("hidden-section");
    refinedOutputs.classList.remove("visible-section");
    refinedOutputs.classList.add("hidden-section");
    refineBtn.classList.remove("visible-section");
    refineBtn.classList.add("hidden-section");
    // Ensure recent history section is hidden
    recentHistorySection.classList.remove("visible-section");
    recentHistorySection.classList.add("hidden-section");


    // Clear content of pre tags
    namesPre.textContent = "";
    reasonsPre.textContent = "";
    refinedNamesPre.textContent = "";
    refinedReasonsPre.textContent = "";

    // Clear animation classes
    namesPre.classList.remove("fade-in-content");
    reasonsPre.classList.remove("fade-in-content");
    refinedNamesPre.classList.remove("fade-in-content");
    refinedReasonsPre.classList.remove("fade-in-content");

    // Clear general error message
    document.getElementById("error").textContent = "";
}

/**
 * Sets up the hover functionality for tooltip icons.
 */
function setupTooltips() {
    const tooltipIcons = document.querySelectorAll('.tooltip-icon');

    tooltipIcons.forEach(icon => {
        const tooltipBox = icon.nextElementSibling; // The tooltip-box is the next sibling
        const tooltipText = icon.dataset.tooltipText;

        // Set the text content of the tooltip box
        tooltipBox.textContent = tooltipText;
    });
}

/**
 * Opens the full history list modal.
 */
window.openHistoryModal = function() {
    if (historyModal) {
        historyModal.classList.add('active');
        fetchHistory(true); // Fetch and render ALL history to the modal
    }
    // Close sidebar if open
    if (typeof toggleSidebar === 'function' && window.isSidebarOpen) {
        toggleSidebar();
    }
};

/**
/**
 * Closes the full history list modal.
 */
window.closeHistoryModal = function() {
    if (historyModal) {
        historyModal.classList.remove('active');
    }
};

/**
 * Opens the history details modal and populates it with specific entry data.
 * @param {string} id The ID of the history entry to display.
 */
window.showHistoryDetails = async function(id) {
    if (!historyDetailsModal || !detailsContent) {
        console.error("History details modal elements not found.");
        return;
    }

    // Clear previous details
    detailsContent.innerHTML = '';
    
    if (!window.currentUserId) {
        console.warn("No user ID available to fetch history details.");
        document.getElementById("error").textContent = "Please sign in to view history details.";
        return;
    }

    let idToken = null;
    if (window.auth && window.auth.currentUser) {
        try {
            idToken = await window.auth.currentUser.getIdToken();
        } catch (error) {
            console.error("Error getting ID token for history details:", error);
            document.getElementById("error").textContent = "Error getting authentication token for history details. Please try again.";
            return;
        }
    }

    try {
        const headers = {};
        if (idToken) {
            headers["Authorization"] = `Bearer ${idToken}`;
        } else { // For anonymous users
            headers["X-Anonymous-ID"] = window.currentUserId;
        }

        const response = await fetch(`${BACKEND_URL}/history`, { headers: headers });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Unknown error fetching history for details.");
        }
        const historyData = await response.json();
        const entry = historyData.find(e => e.id === id);

        if (entry) {
            let contentHtml = '';
            contentHtml += `<p><strong>Timestamp:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>`;

            if (entry.category === "Refined") {
                contentHtml += `<p><strong>Refine Instruction:</strong> ${entry.prompt}</p>`;
                contentHtml += `<p><strong>Refined Names:</strong></p><pre>${entry.names.map(cleanNames).join("\n")}</pre>`;
                contentHtml += `<p><strong>Refined Explanations:</strong></p><pre>${entry.reasons.map(cleanNames).join("\n")}</pre>`;
                if (entry.pre_refined_names && entry.pre_refined_names.length > 0) {
                    contentHtml += `<p><strong>Original Names (Pre-Refined):</strong></p><pre>${entry.pre_refined_names.map(cleanNames).join("\n")}</pre>`;
                }
            } else {
                contentHtml += `<p><strong>Prompt:</strong> ${entry.prompt}</p>`;
                contentHtml += `<p><strong>Category:</strong> ${entry.category}</p>`;
                contentHtml += `<p><strong>Style:</strong> ${entry.style}</p>`;
                contentHtml += `<p><strong>Language:</strong> ${entry.language}</p>`;
                contentHtml += `<p><strong>Generated Names:</strong></p><pre>${entry.names.map(cleanNames).join("\n")}</pre>`;
                contentHtml += `<p><strong>Explanations:</strong></p><pre>${entry.reasons.map(cleanNames).join("\n")}</pre>`;
            }
            
            detailsContent.innerHTML = contentHtml;
            historyDetailsModal.classList.add('active');
            closeHistoryModal(); // Close the list modal when opening details
        } else {
            console.error("History entry not found for ID:", id);
            document.getElementById("error").textContent = "Error: History entry not found.";
        }
    } catch (error) {
        console.error("Error displaying history details:", error);
        document.getElementById("error").textContent = "Error displaying history details: " + error.message;
    }
};

/**
 * Closes the history details modal.
 */
window.closeHistoryDetailsModal = function() {
    if (historyDetailsModal) {
        historyDetailsModal.classList.remove('active');
        detailsContent.innerHTML = ''; // Clear content when closing
    }
};

// --- NEW AUTHENTICATION FUNCTIONS (Made Global) ---

/**
 * Updates the top bar UI based on authentication state.
 * @param {firebase.User | null} user The Firebase User object or null if signed out.
 */
window.updateAuthUI = function(user) {
    if (user) {
        authButtonsDiv.classList.remove('show-flex');
        authButtonsDiv.classList.add('hidden');
        userProfileInfoDiv.classList.remove('hidden');
        userProfileInfoDiv.classList.add('show-flex');

        userNameSpan.textContent = user.displayName || (user.email ? user.email.split('@')[0] : 'Guest');
        userEmailSpan.textContent = user.email || 'Anonymous User';
        userPfpImg.src = user.photoURL || `https://placehold.co/40x40/800080/FFFFFF?text=${userNameSpan.textContent.charAt(0).toUpperCase()}`;
        
        // Fetch credits for the signed-in user
        if (typeof window.fetchCredits === 'function') {
            window.fetchCredits();
        }
    } else {
        authButtonsDiv.classList.remove('hidden');
        authButtonsDiv.classList.add('show-flex');
        userProfileInfoDiv.classList.remove('show-flex');
        userProfileInfoDiv.classList.add('hidden');
        creditBalanceSpan.textContent = '--'; // Clear credits when logged out
    }
};

/**
 * Fetches and displays the current user's credit balance.
 */
window.fetchCredits = async function() {
    if (!window.currentUserId) {
        creditBalanceSpan.textContent = '--';
        return;
    }

    let idToken = null;
    if (window.auth && window.auth.currentUser) {
        try {
            idToken = await window.auth.currentUser.getIdToken();
        } catch (error) {
            console.error("Error getting ID token for credits:", error);
            creditBalanceSpan.textContent = 'Error';
            return;
        }
    }

    try {
        const headers = {};
        if (idToken) {
            headers["Authorization"] = `Bearer ${idToken}`;
        } else { // For anonymous users
            headers["X-Anonymous-ID"] = window.currentUserId;
        }

        const response = await fetch(`${BACKEND_URL}/credits`, { headers: headers });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to fetch credits.");
        }
        const data = await response.json();
        creditBalanceSpan.textContent = data.current_credits;
    } catch (error) {
        console.error("Error fetching credits:", error);
        creditBalanceSpan.textContent = 'Error';
    }
};


/**
 * Opens the Sign Up modal.
 */
window.openSignUpModal = function() {
    if (signupModal) {
        signupModal.classList.add('active');
        // Clear any previous errors
        document.getElementById('signup-error').textContent = '';
        document.getElementById('signup-spinner').classList.remove('show');
    }
    // Close sidebar if open
    if (typeof toggleSidebar === 'function' && window.isSidebarOpen) {
        toggleSidebar();
    }
};

/**
 * Closes the Sign Up modal.
 */
window.closeSignUpModal = function() {
    if (signupModal) {
        signupModal.classList.remove('active');
        // Clear input fields
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
    }
};

/**
 * Handles email/password sign up.
 */
window.handleSignUpEmailPassword = async function() {
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const errorDisplay = document.getElementById('signup-error');
    const spinner = document.getElementById('signup-spinner');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    errorDisplay.textContent = ''; // Clear previous errors
    spinner.classList.remove('show'); // Hide spinner initially

    if (!email || !password) {
        errorDisplay.textContent = 'Please enter both email and password.';
        return;
    }
    if (password.length < 6) {
        errorDisplay.textContent = 'Password should be at least 6 characters.';
        return;
    }

    spinner.classList.add('show'); // Show spinner

    try {
        const userCredential = await window.createUserWithEmailAndPassword(window.auth, email, password);
        console.log("User signed up:", userCredential.user.uid);
        // User is automatically signed in after creation
        closeSignUpModal();
        // updateAuthUI will be called by onAuthStateChanged listener
    } catch (error) {
        console.error("Sign up error:", error);
        let errorMessage = "An error occurred during sign up.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email address is already in use.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'The password is too weak.';
        }
        errorDisplay.textContent = errorMessage;
    } finally {
        spinner.classList.remove('show'); // Hide spinner
    }
};

/**
 * Opens the Sign In modal.
 */
window.openSignInModal = function() {
    if (signinModal) {
        signinModal.classList.add('active');
        // Clear any previous errors
        document.getElementById('signin-error').textContent = '';
        document.getElementById('signin-spinner').classList.remove('show');
    }
    // Close sidebar if open
    if (typeof toggleSidebar === 'function' && window.isSidebarOpen) {
        toggleSidebar();
    }
};

/**
 * Closes the Sign In modal.
 */
window.closeSignInModal = function() {
    if (signinModal) {
        signinModal.classList.remove('active');
        // Clear input fields
        document.getElementById('signin-email').value = '';
        document.getElementById('signin-password').value = '';
    }
};

/**
 * Handles email/password sign in.
 */
window.handleSignInEmailPassword = async function() {
    const emailInput = document.getElementById('signin-email');
    const passwordInput = document.getElementById('signin-password');
    const errorDisplay = document.getElementById('signin-error');
    const spinner = document.getElementById('signin-spinner');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    errorDisplay.textContent = ''; // Clear previous errors
    spinner.classList.remove('show'); // Hide spinner initially

    if (!email || !password) {
        errorDisplay.textContent = 'Please enter both email and password.';
        return;
    }

    spinner.classList.add('show'); // Show spinner

    try {
        const userCredential = await window.signInWithEmailAndPassword(window.auth, email, password);
        console.log("User signed in:", userCredential.user.uid);
        closeSignInModal();
        // updateAuthUI will be called by onAuthStateChanged listener
    } catch (error) {
        console.error("Sign in error:", error);
        let errorMessage = "Invalid email or password.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }
        errorDisplay.textContent = errorMessage;
    } finally {
        spinner.classList.remove('show'); // Hide spinner
    }
};

/**
 * Handles Google Sign-In.
 */
window.handleGoogleSignIn = async function() {
    const provider = new window.GoogleAuthProvider();
    const currentModalError = document.getElementById('signup-error') || document.getElementById('signin-error');
    const currentModalSpinner = document.getElementById('signup-spinner') || document.getElementById('signin-spinner');

    if (currentModalError) currentModalError.textContent = '';
    if (currentModalSpinner) currentModalSpinner.classList.add('show');

    try {
        const result = await window.signInWithPopup(window.auth, provider);
        console.log("Google Sign-In successful:", result.user.uid);
        closeSignUpModal(); // Close both if open
        closeSignInModal();
        // updateAuthUI will be called by onAuthStateChanged listener
    } catch (error) {
        console.error("Google Sign-In error:", error);
        let errorMessage = "Google Sign-In failed.";
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-in window closed.';
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = 'Sign-in already in progress.';
        }
        if (currentModalError) currentModalError.textContent = errorMessage;
    } finally {
        if (currentModalSpinner) currentModalSpinner.classList.remove('show');
    }
};

/**
 * Handles user sign out.
 */
window.handleSignOut = async function() {
    try {
        await window.signOut(window.auth);
        console.log("User signed out.");
        // onAuthStateChanged listener will handle UI update
    } catch (error) {
        console.error("Sign out error:", error);
        document.getElementById("error").textContent = "Error signing out: " + error.message;
    }
};

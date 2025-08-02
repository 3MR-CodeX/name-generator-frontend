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

document.addEventListener("DOMContentLoaded", async () => {
    // Load top bar HTML
    await loadComponent('top-bar-placeholder', 'components/topbar.html');
    // Load sidebar HTML
    await loadComponent('sidebar-placeholder', 'components/sidebar.html');

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
            openHistoryModal();
        });
        window.addEventListener('click', (event) => {
            if (event.target == historyDetailsModal) {
                closeHistoryDetailsModal();
                openHistoryModal();
            }
        });
    }

    // Attach event listeners for buttons
    document.getElementById('generate-btn').addEventListener('click', generateName);
    document.getElementById('surprise-btn').addEventListener('click', surpriseMe);
    document.getElementById('refine-btn').addEventListener('click', refineNames);
    document.getElementById('copy-names').addEventListener('click', () => copyToClipboard('names'));
    document.getElementById('copy-reasons').addEventListener('click', () => copyToClipboard('reasons'));
    document.getElementById('copy-refined-names').addEventListener('click', () => copyToClipboard('refined_names'));
    document.getElementById('copy-refined-reasons').addEventListener('click', () => copyToClipboard('refined_reasons'));

    // Authentication logic
    function renderAuthControls(user) {
        const container = document.getElementById("auth-controls");
        container.innerHTML = "";

        if (user) {
            const img = document.createElement("img");
            img.src = user.photoURL || "default-pfp.png";
            img.className = "auth-pfp";

            const nameDiv = document.createElement("div");
            nameDiv.className = "auth-name";
            nameDiv.innerHTML = `
                <div>${user.displayName || user.email.split("@")[0]}</div>
                <div class="auth-email">${user.email}</div>
            `;

            const signOutBtn = document.createElement("button");
            signOutBtn.textContent = "Sign Out";
            signOutBtn.onclick = () => window.signOutUser();

            container.append(img, nameDiv, signOutBtn);
        } else {
            const signUpBtn = document.createElement("button");
            signUpBtn.textContent = "Sign Up";
            signUpBtn.className = "btn-purple";
            signUpBtn.onclick = () => openModal("signup-modal");

            const signInBtn = document.createElement("button");
            signInBtn.textContent = "Sign In";
            signInBtn.onclick = () => openModal("signin-modal");

            container.append(signUpBtn, signInBtn);
        }
    }

    function openModal(id) {
        document.getElementById(id).classList.add("active");
    }

    function closeModal(id) {
        document.getElementById(id).classList.remove("active");
    }

    document.querySelectorAll(".close-button").forEach((btn) => {
        const target = btn.dataset.target;
        btn.onclick = () => closeModal(target);
    });

    document.getElementById("signup-submit").onclick = async () => {
        const email = document.getElementById("signup-email").value;
        const pass = document.getElementById("signup-password").value;
        try {
            await window.signUp(window.auth, email, pass);
            closeModal("signup-modal");
        } catch (e) {
            alert(e.message);
        }
    };
    document.getElementById("signup-google").onclick = () => window.signInWithGoogle().then(() => closeModal("signup-modal"));

    document.getElementById("signin-submit").onclick = async () => {
        const email = document.getElementById("signin-email").value;
        const pass = document.getElementById("signin-password").value;
        try {
            await window.signIn(window.auth, email, pass);
            closeModal("signin-modal");
        } catch (e) {
            alert(e.message);
        }
    };
    document.getElementById("signin-google").onclick = () => window.signInWithGoogle().then(() => closeModal("signin-modal"));

    window.onUserStateChange(window.auth, (user) => renderAuthControls(user));
    renderAuthControls(null);

    // Attach functions to window for use in dynamically loaded HTML
    window.restoreHistory = restoreHistory;
    window.openHistoryModal = openHistoryModal;
    window.closeHistoryModal = closeHistoryModal;
    window.showHistoryDetails = showHistoryDetails;
    window.closeHistoryDetailsModal = closeHistoryDetailsModal;
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

    try {
        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, category, style, language })
        });
        if (!response.ok) {
            const errorData = await response.json(); // Assuming backend sends JSON error
            throw new Error(errorData.error || "Unknown error during name generation.");
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

    try {
        const response = await fetch(`${BACKEND_URL}/refine`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ instruction })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Unknown error during name refinement.");
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
    try {
        const response = await fetch(`${BACKEND_URL}/history`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Unknown error fetching history.");
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
    } else { // Render for recent history
        historyToRender.forEach(entry => {
            const names = entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ");
            const tooltip = entry.category !== "Refined" ?
                `Prompt: ${entry.prompt}\nCategory: ${entry.category}\nStyle: ${entry.style}\nLanguage: ${entry.language}` :
                `Refine Instruction: ${entry.prompt}`;
            
            const button = document.createElement('button');
            button.className = 'recent-history-item';
            button.title = tooltip;
            button.innerHTML = `${names}`;
            // For recent history, clicking restores the generation state
            button.onclick = () => restoreHistory(entry); 
            targetDiv.appendChild(button);
        });
    }
}

// Global function to restore a previous generation
function restoreHistory(entry) {
    if (entry.category === "Refined") {
        // For refined entries, restore the original prompt and the refine instruction
        promptInput.value = entry.pre_refined_prompt;
        document.getElementById("category").value = entry.pre_refined_category;
        document.getElementById("style").value = entry.pre_refined_style;
        document.getElementById("language").value = entry.pre_refined_language;

        editBox.value = entry.prompt;
        namesPre.textContent = entry.pre_refined_names.map(cleanNames).join("\n");
        reasonsPre.textContent = entry.pre_refined_reasons.map(cleanNames).join("\n");
        refinedNamesPre.textContent = entry.names.map(cleanNames).join("\n");
        refinedReasonsPre.textContent = entry.reasons.map(cleanNames).join("\n");

        outputContainer.classList.remove("hidden-section");
        refineSection.classList.remove("hidden-section");
        refinedOutputs.classList.remove("hidden-section");
        refineBtn.classList.remove("hidden-section");
        
    } else {
        // For a new generation, simply restore the prompt and options
        promptInput.value = entry.prompt;
        document.getElementById("category").value = entry.category;
        document.getElementById("style").value = entry.style;
        document.getElementById("language").value = entry.language;

        namesPre.textContent = entry.names.map(cleanNames).join("\n");
        reasonsPre.textContent = entry.reasons.map(cleanNames).join("\n");
        refinedNamesPre.textContent = "";
        refinedReasonsPre.textContent = "";
        editBox.value = "";

        outputContainer.classList.remove("hidden-section");
        refineSection.classList.remove("hidden-section");
        refinedOutputs.classList.add("hidden-section");
        refineBtn.classList.remove("hidden-section");
    }
    // Scroll to the top of the output section for better user experience
    outputContainer.scrollIntoView({ behavior: 'smooth' });
}

// Global function to open the full history modal
function openHistoryModal() {
    historyModal.style.display = 'block';
    fetchHistory(true); // Fetch and render history to the modal
}

// Global function to close the full history modal
function closeHistoryModal() {
    historyModal.style.display = 'none';
    fullHistoryList.innerHTML = ""; // Clear content on close for performance
}

// Global function to open history details modal
async function showHistoryDetails(historyId) {
    historyModal.style.display = 'none'; // Hide the list modal first
    closeHistoryDetailsModal(); // Ensure it's clean before opening

    try {
        const response = await fetch(`${BACKEND_URL}/history/${historyId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Unknown error fetching history details.");
        }
        const entry = await response.json();
        renderHistoryDetails(entry);
        historyDetailsModal.style.display = 'block';
    } catch (error) {
        document.getElementById("error").textContent = "Error fetching details: " + error.message;
        openHistoryModal(); // Go back to the full list on error
    }
}

// Global function to close history details modal
function closeHistoryDetailsModal() {
    historyDetailsModal.style.display = 'none';
    detailsContent.innerHTML = ""; // Clear content on close
}

// Global function to render details to the modal
function renderHistoryDetails(entry) {
    const detailsHtml = `
        <div class="details-header">
            <h3>Generation Details</h3>
            <button class="restore-button" onclick="restoreHistory(${JSON.stringify(entry).replace(/'/g, "\\'")})">Restore</button>
        </div>
        <p><strong>Date:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
        <p><strong>Prompt:</strong> ${entry.prompt}</p>
        ${entry.category !== "Refined" ? `
            <p><strong>Category:</strong> ${entry.category}</p>
            <p><strong>Style:</strong> ${entry.style}</p>
            <p><strong>Language:</strong> ${entry.language}</p>
        ` : `
            <p><strong>Refined From:</strong></p>
            <div class="refined-from-info">
                <p><strong>Prompt:</strong> ${entry.pre_refined_prompt}</p>
                <p><strong>Category:</strong> ${entry.pre_refined_category}</p>
                <p><strong>Style:</strong> ${entry.pre_refined_style}</p>
                <p><strong>Language:</strong> ${entry.pre_refined_language}</p>
                <p><strong>Original Names:</strong> ${entry.pre_refined_names.map(cleanNames).join(", ")}</p>
            </div>
        `}
        <div class="details-section">
            <h4>Names:</h4>
            <pre>${entry.names.map(cleanNames).join("\n")}</pre>
        </div>
        <div class="details-section">
            <h4>Reasons:</h4>
            <pre>${entry.reasons.map(cleanNames).join("\n")}</pre>
        </div>
    `;
    detailsContent.innerHTML = detailsHtml;
}

// Made global to be accessible from surpriseMe() and to be testable
async function getSurprisePrompt() {
    const response = await fetch(`${BACKEND_URL}/surprise`);
    const data = await response.json();
    return data;
}

// Surprise me functionality
async function surpriseMe() {
    try {
        const data = await getSurprisePrompt();
        promptInput.value = data.prompt;
        document.getElementById("category").value = data.category;
        document.getElementById("style").value = data.style;
        document.getElementById("language").value = data.language;
        await generateName();
    } catch (error) {
        document.getElementById("error").textContent = "Error fetching surprise prompt: " + error.message;
    }
}

/**
 * Resets and hides all dynamic sections (output, refine, refined, and history).
 * This is useful for error states or when the user clears the prompt.
 */
function resetDynamicSections() {
    outputContainer.classList.add("hidden-section");
    refineSection.classList.add("hidden-section");
    refinedOutputs.classList.add("hidden-section");
    refineBtn.classList.add("hidden-section");
    recentHistorySection.classList.add("hidden-section");
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        navigator.clipboard.writeText(element.textContent).then(() => {
            alert("Copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
}

// Function to set up tooltips using Tippy.js
function setupTooltips() {
    tippy('.with-tooltip', {
        content(reference) {
            const tooltipId = reference.getAttribute('data-tooltip-id');
            const template = document.getElementById(tooltipId);
            return template ? template.innerHTML : '';
        },
        allowHTML: true,
        animation: 'fade',
        duration: 200,
        theme: 'light',
        interactive: true,
    });
}

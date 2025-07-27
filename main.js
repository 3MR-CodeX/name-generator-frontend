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
const historySection = document.getElementById("history_section");
const refineBtn = document.querySelector(".refine-btn");
const namesPre = document.getElementById("names");
const reasonsPre = document.getElementById("reasons");
const refinedNamesPre = document.getElementById("refined_names");
const refinedReasonsPre = document.getElementById("refined_reasons");
const promptInput = document.getElementById("prompt");
const editBox = document.getElementById("edit_box"); // Reference to the refine instruction textarea

// Get button references for disabling
const generateBtn = document.querySelector(".generate-btn");
const surpriseBtn = document.querySelector(".surprise-btn");

// Get new elements for sidebar and top bar
const menuToggleBtn = document.getElementById("menu-toggle-btn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

// User info elements in top bar
const profilePicCircle = document.getElementById("profile-pic-circle");
const userNameDisplay = document.getElementById("user-name-display");
const userEmailDisplay = document.getElementById("user-email-display");
const roundsLeftDisplay = document.getElementById("rounds-left-display");

// User info elements in sidebar
const sidebarProfilePic = document.getElementById("sidebar-profile-pic");
const sidebarUserName = document.getElementById("sidebar-user-name");
const sidebarUserEmail = document.getElementById("sidebar-user-email");
const sidebarRoundsLeft = document.getElementById("sidebar-rounds-left");
const sidebarAuthBtn = document.getElementById("sidebar-auth-btn");
const sidebarLogoutBtn = document.getElementById("sidebar-logout-btn");

// Modal elements
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");
const settingsModal = document.getElementById("settings-modal");

// Global Firebase variables (initialized in index.html script module)
let firebaseApp = window.firebaseApp;
let db = window.db;
let auth = window.auth;
let userId = window.userId;
let isAuthReady = window.isAuthReady;
let currentUserData = window.currentUserData;
let __app_id = window.__app_id;

document.addEventListener("DOMContentLoaded", () => {
    initializeUI();
    populateDropdown("category", CATEGORY_OPTIONS);
    populateDropdown("style", STYLE_OPTIONS);
    // History fetch and auth UI update are now handled by onAuthStateChanged listener
    setupTooltips(); 
});

// Function to update UI based on auth state and user data
function updateAuthUI(user) {
    if (user) {
        // Logged in user
        userNameDisplay.textContent = currentUserData.name || user.email;
        userEmailDisplay.textContent = currentUserData.email || user.email;
        roundsLeftDisplay.textContent = `Rounds Left: ${currentUserData.roundsLeft}`;

        sidebarUserName.textContent = currentUserData.name || user.email;
        sidebarUserEmail.textContent = currentUserData.email || user.email;
        sidebarRoundsLeft.textContent = `Rounds Left: ${currentUserData.roundsLeft}`;

        sidebarAuthBtn.classList.add("hidden");
        sidebarLogoutBtn.classList.remove("hidden");

        // Set profile picture (initial or actual image if available)
        if (user.photoURL) {
            profilePicCircle.style.backgroundImage = `url(${user.photoURL})`;
            profilePicCircle.style.backgroundSize = 'cover';
            profilePicCircle.textContent = ''; // Clear initial
            sidebarProfilePic.style.backgroundImage = `url(${user.photoURL})`;
            sidebarProfilePic.style.backgroundSize = 'cover';
            sidebarProfilePic.textContent = '';
        } else {
            const initial = (currentUserData.name || user.email || 'G').charAt(0).toUpperCase();
            profilePicCircle.textContent = initial;
            profilePicCircle.style.backgroundImage = 'none';
            sidebarProfilePic.textContent = initial;
            sidebarProfilePic.style.backgroundImage = 'none';
        }

    } else {
        // Guest user
        userNameDisplay.textContent = "Guest User";
        userEmailDisplay.textContent = "guest@example.com";
        roundsLeftDisplay.textContent = "Rounds Left: ∞";

        sidebarUserName.textContent = "Guest User";
        sidebarUserEmail.textContent = "guest@example.com";
        sidebarRoundsLeft.textContent = "Rounds Left: ∞";

        sidebarAuthBtn.classList.remove("hidden");
        sidebarLogoutBtn.classList.add("hidden");

        profilePicCircle.textContent = "G";
        profilePicCircle.style.backgroundImage = 'none';
        sidebarProfilePic.textContent = "G";
        sidebarProfilePic.style.backgroundImage = 'none';
    }
}


function initializeUI() {
    // Add 'hidden-section' class to ALL sections that should be initially hidden
    outputContainer.classList.add("hidden-section");
    refineSection.classList.add("hidden-section");
    refinedOutputs.classList.add("hidden-section");
    historySection.classList.add("hidden-section");
    refineBtn.classList.add("hidden-section");

    // Store original placeholders for error messaging
    if (!promptInput.dataset.originalPlaceholder) {
        promptInput.dataset.originalPlaceholder = promptInput.placeholder;
    }
    if (!editBox.dataset.originalPlaceholder) {
        editBox.dataset.originalPlaceholder = editBox.placeholder;
    }

    // Initial update of auth UI (before Firebase listener fires)
    updateAuthUI(auth.currentUser);
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

/**
 * Displays a temporary message in a modal's error/message div.
 * @param {string} elementId The ID of the div to display the message in.
 * @param {string} message The message to display.
 * @param {string} type 'success' or 'error' for styling.
 */
function displayModalMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = message;
    messageDiv.className = `modal-message ${type}`; // Apply class for styling
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'modal-message';
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

    // --- Rounds Left Check ---
    if (!currentUserData.isPremium && currentUserData.roundsLeft <= 0) {
        document.getElementById("error").textContent = "You have no rounds left! Please subscribe to Premium or wait for more rounds.";
        resetDynamicSections();
        return;
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

    // Show output boxes and history section immediately before loading
    outputContainer.classList.remove("hidden-section");
    outputContainer.classList.add("visible-section");
    historySection.classList.remove("hidden-section");
    historySection.classList.add("visible-section");

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

        namesPre.textContent = data.names.map(cleanNames).join("\n\n");
        reasonsPre.textContent = data.reasons.map(cleanNames).join("\n\n");

        // Decrement rounds if not premium
        if (!currentUserData.isPremium && currentUserData.roundsLeft > 0) {
            currentUserData.roundsLeft--;
            await saveUserRounds(userId, currentUserData.roundsLeft);
            updateAuthUI(auth.currentUser); // Update UI with new rounds count
        }

        // Add animation class after content is set
        namesPre.classList.add("fade-in-content");
        reasonsPre.classList.add("fade-in-content");

        // Show Refine section and button ONLY if prompt has content (which it will here due to initial check)
        refineSection.classList.remove("hidden-section");
        refineSection.classList.add("visible-section");
        refineBtn.classList.remove("hidden-section");
        refineBtn.classList.add("visible-section");
        
        fetchHistory(); // Refresh history after successful generation

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

        refinedNamesPre.textContent = data.names.map(cleanNames).join("\n\n");
        refinedReasonsPre.textContent = data.reasons.map(cleanNames).join("\n\n");

        // Add animation class after content is set
        refinedNamesPre.classList.add("fade-in-content");
        refinedReasonsPre.classList.add("fade-in-content");

        // Show refined outputs with animation
        refinedOutputs.classList.remove("hidden-section");
        refinedOutputs.classList.add("visible-section");

        fetchHistory(); // Refresh history after successful refinement

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

async function fetchHistory() {
    // Use onSnapshot for real-time updates if user is logged in, otherwise fetch once
    if (userId && isAuthReady) {
        const q = query(collection(db, `artifacts/${__app_id}/users/${userId}/history`), orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
            const history = [];
            snapshot.forEach((doc) => {
                history.push({ id: doc.id, ...doc.data() });
            });
            renderHistory(history);
        }, (error) => {
            console.error("Error fetching real-time history:", error);
            document.getElementById("error").textContent = "Error fetching history: " + error.message;
        });
    } else {
        // Fallback for anonymous users or before auth is ready (fetches from backend)
        try {
            const response = await fetch(`${BACKEND_URL}/history`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Unknown error fetching history.");
            }
            const history = await response.json();
            renderHistory(history);
        } catch (error) {
            document.getElementById("error").textContent = "Error fetching history: " + error.message;
        }
    }
}


function renderHistory(history) {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = history.length ? "" : "<p>*No history yet. Generate some names!*</p>";
    history.forEach(entry => {
        const names = entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ");
        const tooltip = entry.category !== "Refined" ?
            `Prompt: ${entry.prompt}\nCategory: ${entry.category}\nStyle: ${entry.style}\nLanguage: ${entry.language}` :
            `Refine Instruction: ${entry.instruction}`; // Use 'instruction' for refined entries
        const preRefined = entry.pre_refined_names && entry.pre_refined_names.length ? ` <span class='pre-refined'>(from: ${entry.pre_refined_names.map(cleanNames).join(", ")})</span>` : "";
        const button = `<button class='history-item' title='${tooltip}' onclick='restoreHistory("${entry.id}")'>${names}${preRefined}</button>`;
        historyDiv.innerHTML += button;
    });
}

function restoreHistory(id) {
    // Clear any existing error messages when restoring
    document.getElementById("error").textContent = "";
    // Reset prompt and refine placeholders and remove error styling
    promptInput.placeholder = promptInput.dataset.originalPlaceholder;
    promptInput.classList.remove("prompt-error-placeholder");
    editBox.placeholder = editBox.dataset.originalPlaceholder;
    editBox.classList.remove("prompt-error-placeholder");

    // Fetch history data to find the specific entry
    fetch(`${BACKEND_URL}/history`).then(res => res.json()).then(historyData => {
        const entry = historyData.find(e => e.id === id);
        if (entry) {
            // Always ensure main output and history sections are visible
            outputContainer.classList.remove("hidden-section");
            outputContainer.classList.add("visible-section");
            historySection.classList.remove("hidden-section");
            historySection.classList.add("visible-section");

            // Always ensure refine section and button are visible
            refineSection.classList.remove("hidden-section");
            refineSection.classList.add("visible-section");
            refineBtn.classList.remove("hidden-section");
            refineBtn.classList.add("visible-section");

            if (entry.category === "Refined") {
                // If it's a refined entry, populate refined outputs
                refinedNamesPre.textContent = entry.names.map(cleanNames).join("\n\n");
                refinedReasonsPre.textContent = entry.reasons.map(cleanNames).join("\n\n");
                editBox.value = entry.instruction; // Use 'instruction' for refined entries

                // Clear and hide initial outputs
                namesPre.textContent = "";
                reasonsPre.textContent = "";
                outputContainer.classList.remove("visible-section"); // Ensure it's hidden if refined is shown
                outputContainer.classList.add("hidden-section"); // Ensure it's hidden if refined is shown

                // Ensure animation class is applied
                refinedNamesPre.classList.add("fade-in-content");
                refinedReasonsPre.classList.add("fade-in-content");

                // Show refined outputs
                refinedOutputs.classList.remove("hidden-section");
                refinedOutputs.classList.add("visible-section");

            } else {
                // If it's a regular generation entry, populate initial outputs
                promptInput.value = entry.prompt;
                document.getElementById("category").value = entry.category;
                document.getElementById("style").value = entry.style;
                document.getElementById("language").value = entry.language;
                namesPre.textContent = entry.names.map(cleanNames).join("\n\n");
                reasonsPre.textContent = entry.reasons.map(cleanNames).join("\n\n");

                // Clear and hide refined outputs
                refinedNamesPre.textContent = "";
                refinedReasonsPre.textContent = "";
                editBox.value = ""; // Clear refine instruction box
                refinedOutputs.classList.remove("visible-section");
                refinedOutputs.classList.add("hidden-section");

                // Ensure animation class is applied
                namesPre.classList.add("fade-in-content");
                reasonsPre.classList.add("fade-in-content");

                // Show initial outputs
                outputContainer.classList.remove("hidden-section");
                outputContainer.classList.add("visible-section");
            }
        }
    });
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
            background-color: #800080;
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
 * This is used when an operation fails or an empty prompt is detected.
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
    historySection.classList.remove("visible-section");
    historySection.classList.add("hidden-section");

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

        // No need for explicit mouseover/mouseout JS listeners
        // as CSS :hover handles showing/hiding with opacity/visibility.
        // The positioning is also handled by CSS.
    });
}

// --- Sidebar Functions ---
function openSidebar() {
    sidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
    menuToggleBtn.classList.add("rotated"); // Apply rotation
}

function closeSidebar() {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
    menuToggleBtn.classList.remove("rotated"); // Remove rotation
}

// --- Modal Functions (Re-introduced) ---
function openLoginModal() {
    closeSidebar(); // Close sidebar if open
    loginModal.classList.remove("hidden");
    loginModal.classList.add("active"); // Use 'active' for modals
}

function closeLoginModal() {
    loginModal.classList.add("hidden");
    loginModal.classList.remove("active");
    document.getElementById("login-error").textContent = ''; // Clear error
    document.getElementById("login-email").value = '';
    document.getElementById("login-password").value = '';
}

function openRegisterModal() {
    closeLoginModal(); // Close login modal if open
    registerModal.classList.remove("hidden");
    registerModal.classList.add("active");
}

function closeRegisterModal() {
    registerModal.classList.add("hidden");
    registerModal.classList.remove("active");
    document.getElementById("register-error").textContent = ''; // Clear error
    document.getElementById("register-email").value = '';
    document.getElementById("register-password").value = '';
}

function openSettingsModal() {
    closeSidebar(); // Close sidebar if open
    settingsModal.classList.remove("hidden");
    settingsModal.classList.add("active");
    loadSettings(); // Load settings when modal opens
}

function closeSettingsModal() {
    settingsModal.classList.add("hidden");
    settingsModal.classList.remove("active");
    document.getElementById("settings-message").textContent = ''; // Clear message
}

// --- Firebase Auth Functions (Re-introduced) ---
async function signInUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
        await window.signInWithEmailAndPassword(window.auth, email, password);
        displayModalMessage('login-error', 'Signed in successfully!', 'success');
        closeLoginModal();
    } catch (error) {
        console.error("Sign-in error:", error);
        displayModalMessage('login-error', `Sign-in failed: ${error.message}`, 'error');
    }
}

async function registerUser() {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    try {
        const userCredential = await window.createUserWithEmailAndPassword(window.auth, email, password);
        // Set initial user data in Firestore
        const userDocRef = doc(window.db, `artifacts/${window.__app_id}/users/${userCredential.user.uid}/profile/data`);
        await setDoc(userDocRef, {
            name: email.split('@')[0], // Default name from email
            email: email,
            roundsLeft: 5, // Default rounds for new users
            isPremium: false
        });
        displayModalMessage('register-error', 'Registration successful! Please sign in.', 'success');
        closeRegisterModal();
        openLoginModal(); // Prompt to sign in after registration
    } catch (error) {
        console.error("Registration error:", error);
        displayModalMessage('register-error', `Registration failed: ${error.message}`, 'error');
    }
}

async function signOutUser() {
    try {
        await window.signOut(window.auth);
        closeSidebar(); // Close sidebar on sign out
        // UI will be updated by onAuthStateChanged listener
    } catch (error) {
        console.error("Sign-out error:", error);
        document.getElementById("error").textContent = `Sign-out failed: ${error.message}`;
    }
}

// --- Sidebar Link Handlers (Placeholders) ---
function handlePremiumClick() {
    closeSidebar();
    // In a real app, this would redirect to a pricing page or open a premium modal
    alert("Premium Subscription details coming soon!");
}

function handlePlanDetailsClick() {
    closeSidebar();
    alert("Free Tier: Generate 5 names per day. Premium: Unlimited generations!");
}

function handleTool1Click() {
    closeSidebar();
    alert("Tool 1 functionality coming soon!");
}

function handleFeatureAClick() {
    closeSidebar();
    alert("Feature A functionality coming soon!");
}

function handleSettingsClick() {
    closeSidebar();
    openSettingsModal(); // Open the settings modal
}

function handleAboutClick() {
    closeSidebar();
    alert("NameIT App: Your ultimate naming companion!");
}

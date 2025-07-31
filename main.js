const BACKEND_URL = "https://nameit-backend-2.vercel.app";
firebase.initializeApp(window.env.firebaseConfig);
const auth = firebase.auth();

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
const generateBtn = document.querySelector(".generate-btn");
const surpriseBtn = document.querySelector(".surprise-btn");
const historyModal = document.getElementById("history-modal");
const closeButtonHistoryModal = document.querySelector("#history-modal .close-button");
const fullHistoryList = document.getElementById("full-history-list");
const historyDetailsModal = document.getElementById("history-details-modal");
const closeButtonDetailsModal = document.querySelector("#history-details-modal .close-button");
const detailsContent = document.getElementById("details-content");
const recentHistorySection = document.getElementById("history_section");
const recentHistoryDiv = document.getElementById("history");
const signupModal = document.getElementById("signup-modal");
const signinModal = document.getElementById("signin-modal");

document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent('top-bar-placeholder', 'components/topbar.html');
    await loadComponent('sidebar-placeholder', 'components/sidebar.html');

    if (typeof initializeTopbar === 'function') initializeTopbar();
    if (typeof initializeSidebar === 'function') initializeSidebar();

    initializeUI();
    populateDropdown("category", CATEGORY_OPTIONS);
    populateDropdown("style", STYLE_OPTIONS);
    setupAuthListeners();
    setupTooltips();

    closeButtonHistoryModal.addEventListener('click', () => {
        console.log("Close button clicked for modal: history-modal");
        closeHistoryModal();
    });
    window.addEventListener('click', (event) => {
        if (event.target == historyModal) {
            console.log("Clicked outside modal: history-modal");
            closeHistoryModal();
        }
    });

    closeButtonDetailsModal.addEventListener('click', () => {
        console.log("Close button clicked for modal: history-details-modal");
        closeHistoryDetailsModal();
        openHistoryModal();
    });
    window.addEventListener('click', (event) => {
        if (event.target == historyDetailsModal) {
            console.log("Clicked outside modal: history-details-modal");
            closeHistoryDetailsModal();
            openHistoryModal();
        }
    });

    document.querySelectorAll(".modal .close-button").forEach(button => {
        button.addEventListener('click', () => {
            console.log("Close button clicked for modal:", button.closest('.modal').id);
            button.closest('.modal').classList.remove('active');
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            console.log("Clicked outside modal:", event.target.id);
            event.target.classList.remove('active');
        }
    });

    document.getElementById("signup-submit").addEventListener('click', async () => {
        const name = document.getElementById("signup-name").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        console.log("Signup attempt:", { name, email, password });
        try {
            console.log("Creating Firebase user...");
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            console.log("Updating profile...");
            await userCredential.user.updateProfile({ displayName: name });
            console.log("Sending to backend...");
            const response = await fetch(`${BACKEND_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            console.log("Backend response:", response.status, await response.text());
            if (!response.ok) throw new Error("Backend registration failed");
            signupModal.classList.remove('active');
            alert("Registration successful. Please sign in.");
            signinModal.classList.add('active');
        } catch (error) {
            console.error("Signup error:", error.message);
            alert(error.message);
        }
    });

    document.getElementById("signin-submit").addEventListener('click', async () => {
        const email = document.getElementById("signin-email").value;
        const password = document.getElementById("signin-password").value;
        console.log("Signin attempt:", { email, password });
        try {
            console.log("Signing in with Firebase...");
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const idToken = await userCredential.user.getIdToken();
            console.log("Sending to backend...");
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            console.log("Backend response:", response.status, await response.text());
            if (!response.ok) throw new Error("Backend login failed");
            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            signinModal.classList.remove('active');
            updateAuthSection();
        } catch (error) {
            console.error("Signin error:", error.message);
            alert(error.message);
        }
    });

    generateBtn.addEventListener('click', generateName);
    refineBtn.addEventListener('click', refineNames);
    surpriseBtn.addEventListener('click', surpriseMe);
});

function setupAuthListeners() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const idToken = await user.getIdToken();
            localStorage.setItem("access_token", idToken);
            updateAuthSection();
        } else {
            localStorage.removeItem("access_token");
            updateAuthSection();
        }
    });

    // Google Sign-In listeners commented out to avoid null errors
    /*
    document.getElementById("signup-google").addEventListener('click', async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const userCredential = await auth.signInWithPopup(provider);
            const idToken = await userCredential.user.getIdToken();
            const response = await fetch(`${BACKEND_URL}/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });
            if (!response.ok) throw new Error("Backend Google login failed");
            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            signupModal.classList.remove('active');
            updateAuthSection();
        } catch (error) {
            console.error("Google signup error:", error.message);
            alert(error.message);
        }
    });

    document.getElementById("signin-google").addEventListener('click', async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const userCredential = await auth.signInWithPopup(provider);
            const idToken = await userCredential.user.getIdToken();
            const response = await fetch(`${BACKEND_URL}/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });
            if (!response.ok) throw new Error("Backend Google login failed");
            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            signinModal.classList.remove('active');
            updateAuthSection();
        } catch (error) {
            console.error("Google signin error:", error.message);
            alert(error.message);
        }
    });
    */
}

async function loadComponent(placeholderId, componentUrl) {
    try {
        const response = await fetch(componentUrl);
        if (!response.ok) throw new Error(`Failed to load component ${componentUrl}`);
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
        console.error(error);
        document.getElementById(placeholderId).innerHTML = `<div style="color: red;">Error loading ${componentUrl}</div>`;
    }
}

function initializeUI() {
    outputContainer.classList.add("hidden-section");
    refineSection.classList.add("hidden-section");
    refinedOutputs.classList.add("hidden-section");
    refineBtn.classList.add("hidden-section");
    recentHistorySection.classList.add("hidden-section");

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

function showLoading(targetElement) {
    targetElement.textContent = "";
    targetElement.classList.remove("fade-in-content");
    let spinnerOverlay = targetElement.querySelector(".spinner-overlay");
    if (!spinnerOverlay) {
        spinnerOverlay = document.createElement("div");
        spinnerOverlay.className = "spinner-overlay";
        spinnerOverlay.innerHTML = '<div class="spinner"></div>';
        targetElement.appendChild(spinnerOverlay);
    }
    spinnerOverlay.classList.add("show");
}

function hideLoading(targetElement) {
    const spinnerOverlay = targetElement.querySelector(".spinner-overlay");
    if (spinnerOverlay) spinnerOverlay.classList.remove("show");
}

function disableButtons() {
    generateBtn.disabled = true;
    surpriseBtn.disabled = true;
    refineBtn.disabled = true;
}

function enableButtons() {
    generateBtn.disabled = false;
    surpriseBtn.disabled = false;
    refineBtn.disabled = false;
}

function showTemporaryPlaceholderError(textarea, message) {
    if (!textarea.dataset.originalPlaceholder) {
        textarea.dataset.originalPlaceholder = textarea.placeholder;
    }
    textarea.placeholder = message;
    textarea.classList.add("prompt-error-placeholder");
    setTimeout(() => {
        if (textarea.placeholder === message) {
            textarea.placeholder = textarea.dataset.originalPlaceholder;
            textarea.classList.remove("prompt-error-placeholder");
        }
    }, 3000);
}

async function generateName() {
    const prompt = promptInput.value.trim();
    console.log("Generate name attempt:", { prompt });
    if (!prompt) {
        showTemporaryPlaceholderError(promptInput, "You cannot generate names without a description!");
        resetDynamicSections();
        return;
    } else {
        promptInput.placeholder = promptInput.dataset.originalPlaceholder;
        promptInput.classList.remove("prompt-error-placeholder");
    }

    const category = document.getElementById("category").value;
    const style = document.getElementById("style").value;
    const language = document.getElementById("language").value;
    const token = localStorage.getItem("access_token");
    console.log("Request data:", { prompt, category, style, language, token });

    if (!BACKEND_URL) {
        document.getElementById("error").textContent = "Backend URL not set correctly.";
        resetDynamicSections();
        return;
    }

    document.getElementById("error").textContent = "";
    outputContainer.classList.remove("hidden-section");
    outputContainer.classList.add("visible-section");
    showLoading(namesPre);
    showLoading(reasonsPre);
    disableButtons();
    refinedOutputs.classList.remove("visible-section");
    refinedOutputs.classList.add("hidden-section");
    refineSection.classList.remove("visible-section");
    refineSection.classList.add("hidden-section");
    refineBtn.classList.remove("visible-section");
    refineBtn.classList.add("hidden-section");

    try {
        console.log("Sending request to backend...");
        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ prompt, category, style, language })
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("access_token");
                auth.signOut();
                updateAuthSection();
                throw new Error("Please sign in to generate names.");
            }
            const errorData = await response.json();
            throw new Error(errorData.error || "Unknown error during name generation.");
        }
        const data = await response.json();
        console.log("Response data:", data);
        namesPre.textContent = data.names.map(cleanNames).join("\n");
        reasonsPre.textContent = data.reasons.map(cleanNames).join("\n");
        namesPre.classList.add("fade-in-content");
        reasonsPre.classList.add("fade-in-content");
        refineSection.classList.remove("hidden-section");
        refineSection.classList.add("visible-section");
        refineBtn.classList.remove("hidden-section");
        refineBtn.classList.add("visible-section");
        recentHistorySection.classList.remove("hidden-section");
        recentHistorySection.classList.add("visible-section");
        fetchHistory(false);
    } catch (error) {
        console.error("Generate error:", error.message);
        document.getElementById("error").textContent = "Error: " + error.message;
        resetDynamicSections();
        namesPre.textContent = "";
        reasonsPre.textContent = "";
    } finally {
        hideLoading(namesPre);
        hideLoading(reasonsPre);
        enableButtons();
    }
}

async(and) refineNames() {
    const instruction = editBox.value.trim();
    console.log("Refine attempt:", { instruction });
    if (!instruction) {
        showTemporaryPlaceholderError(editBox, "Please enter a refine instruction.");
        document.getElementById("error").textContent = "";
        return;
    } else {
        editBox.placeholder = editBox.dataset.originalPlaceholder;
        editBox.classList.remove("prompt-error-placeholder");
    }

    const token = localStorage.getItem("access_token");
    console.log("Refine request data:", { instruction, token });
    if (!BACKEND_URL) {
        document.getElementById("error").textContent = "Backend URL not set correctly.";
        return;
    }

    document.getElementById("error").textContent = "";
    showLoading(refinedNamesPre);
    showLoading(refinedReasonsPre);
    disableButtons();

    try {
        console.log("Sending refine request to backend...");
        const response = await fetch(`${BACKEND_URL}/refine`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ instruction })
        });
        console.log("Refine response status:", response.status);
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("access_token");
                auth.signOut();
                updateAuthSection();
                throw new Error("Please sign in to refine names.");
            }
            const errorData = await response.json();
            throw new Error(errorData.error || "Unknown error during name refinement.");
        }
        const data = await response.json();
        console.log("Refine response data:", data);
        refinedNamesPre.textContent = data.names.map(cleanNames).join("\n");
        refinedReasonsPre.textContent = data.reasons.map(cleanNames).join("\n");
        refinedNamesPre.classList.add("fade-in-content");
        refinedReasonsPre.classList.add("fade-in-content");
        refinedOutputs.classList.remove("hidden-section");
        refinedOutputs.classList.add("visible-section");
        fetchHistory(false);
    } catch (error) {
        console.error("Refine error:", error.message);
        document.getElementById("error").textContent = "Error: " + error.message;
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

async function fetchHistory(renderToModal = false) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
        console.log("Fetching history...");
        const response = await fetch(`${BACKEND_URL}/history`, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        console.log("History response status:", response.status);
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("access_token");
                auth.signOut();
                updateAuthSection();
                throw new Error("Please sign in to view history.");
            }
            const errorData = await response.json();
            throw new Error(errorData.error || "Unknown error fetching history.");
        }
        const history = await response.json();
        console.log("History data:", history);
        renderHistory(history, renderToModal);
    } catch (error) {
        console.error("History error:", error.message);
        document.getElementById("error").textContent = "Error fetching history: " + error.message;
    }
}

function renderHistory(history, renderToModal = false) {
    const targetDiv = renderToModal ? fullHistoryList : recentHistoryDiv;
    if (!targetDiv) return;

    targetDiv.innerHTML = "";
    let historyToRender = renderToModal ? history : history.slice(0, 100);

    if (historyToRender.length === 0) {
        targetDiv.innerHTML = "<p>*No history yet. Generate some names!*</p>";
        return;
    }

    if (renderToModal) {
        const groupedHistory = historyToRender.reduce((acc, entry) => {
            const date = new Date(entry.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            if (!acc[date]) acc[date] = [];
            acc[date].push(entry);
            return acc;
        }, {});

        const sortedDates = Object.keys(groupedHistory).sort((a, b) => new Date(b) - new Date(a));
        sortedDates.forEach(date => {
            const dailyContainer = document.createElement('div');
            dailyContainer.className = 'daily-history-container';
            const dateHeading = document.createElement('h3');
            dateHeading.textContent = date;
            dailyContainer.appendChild(dateHeading);

            groupedHistory[date].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(entry => {
                const names = entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ");
                const tooltip = entry.category !== "Refined" ?
                    `Prompt: ${entry.prompt}\nCategory: ${entry.category}\nStyle: ${entry.style}\nLanguage: ${entry.language}` :
                    `Refine Instruction: ${entry.prompt}`;
                let preRefined = entry.pre_refined_names && entry.pre_refined_names.length > 0 ?
                    `<span class="pre-refined"> (from: ${entry.pre_refined_names.map(cleanNames).join(", ")})</span>` : '';

                const button = document.createElement('button');
                button.className = 'history-item';
                button.title = tooltip;
                button.innerHTML = `${names}${preRefined}`;
                button.onclick = () => showHistoryDetails(entry.id);
                dailyContainer.appendChild(button);
            });
            targetDiv.appendChild(dailyContainer);
        });
    } else {
        historyToRender.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(entry => {
            const names = entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ");
            const tooltip = entry.category !== "Refined" ?
                `Prompt: ${entry.prompt}\nCategory: ${entry.category}\nStyle: ${entry.style}\nLanguage: ${entry.language}` :
                `Refine Instruction: ${entry.prompt}`;
            let preRefined = entry.pre_refined_names && entry.pre_refined_names.length > 0 ?
                `<span class="pre-refined"> (from: ${entry.pre_refined_names.map(cleanNames).join(", ")})</span>` : '';

            const button = document.createElement('button');
            button.className = 'history-item';
            button.title = tooltip;
            button.innerHTML = `${names}${preRefined}`;
            button.onclick = () => restoreHistory(entry.id);
            targetDiv.appendChild(button);
        });
    }
}

function restoreHistory(id) {
    document.getElementById("error").textContent = "";
    promptInput.placeholder = promptInput.dataset.originalPlaceholder;
    promptInput.classList.remove("prompt-error-placeholder");
    editBox.placeholder = editBox.dataset.originalPlaceholder;
    editBox.classList.remove("prompt-error-placeholder");

    closeHistoryModal();
    closeHistoryDetailsModal();

    fetch(`${BACKEND_URL}/history`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    }).then(res => res.json()).then(historyData => {
        const entry = historyData.find(e => e.id === id) || (id === 'latest' && historyData[0]);
        if (entry) {
            promptInput.value = entry.prompt;
            document.getElementById("category").value = entry.category;
            document.getElementById("style").value = entry.style;
            document.getElementById("language").value = entry.language;
            namesPre.textContent = entry.names.map(cleanNames).join("\n");
            reasonsPre.textContent = entry.reasons.map(cleanNames).join("\n");
            namesPre.classList.add("fade-in-content");
            reasonsPre.classList.add("fade-in-content");
            outputContainer.classList.remove("hidden-section");
            outputContainer.classList.add("visible-section");
            if (entry.category !== "Refined" && promptInput.value.trim()) {
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
            recentHistorySection.classList.remove("hidden-section");
            recentHistorySection.classList.add("visible-section");
            if (typeof toggleSidebar === 'function' && window.isSidebarOpen) toggleSidebar();
        } else {
            document.getElementById("error").textContent = "No history available to restore.";
        }
    });
}

function surpriseMe() {
    const [prompt, category, style, language] = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
    promptInput.value = prompt;
    document.getElementById("category").value = category;
    document.getElementById("style").value = style;
    document.getElementById("language").value = language;
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
        setTimeout(() => copyMessage.style.opacity = 1, 10);
        setTimeout(() => {
            copyMessage.style.opacity = 0;
            copyMessage.addEventListener('transitionend', () => copyMessage.remove());
        }, 2000);
    });
}

function resetDynamicSections() {
    outputContainer.classList.remove("visible-section");
    outputContainer.classList.add("hidden-section");
    refineSection.classList.remove("visible-section");
    refineSection.classList.add("hidden-section");
    refinedOutputs.classList.remove("visible-section");
    refinedOutputs.classList.add("hidden-section");
    refineBtn.classList.remove("visible-section");
    refineBtn.classList.add("hidden-section");
    recentHistorySection.classList.remove("visible-section");
    recentHistorySection.classList.add("hidden-section");
    namesPre.textContent = "";
    reasonsPre.textContent = "";
    refinedNamesPre.textContent = "";
    refinedReasonsPre.textContent = "";
    namesPre.classList.remove("fade-in-content");
    reasonsPre.classList.remove("fade-in-content");
    refinedNamesPre.classList.remove("fade-in-content");
    refinedReasonsPre.classList.remove("fade-in-content");
    document.getElementById("error").textContent = "";
}

function setupTooltips() {
    const tooltipIcons = document.querySelectorAll('.tooltip-icon');
    tooltipIcons.forEach(icon => {
        const tooltipBox = icon.nextElementSibling;
        const tooltipText = icon.dataset.tooltipText;
        tooltipBox.textContent = tooltipText;
    });
}

function openHistoryModal() {
    if (historyModal) {
        historyModal.classList.add('active');
        fetchHistory(true);
    }
    if (typeof toggleSidebar === 'function' && window.isSidebarOpen) toggleSidebar();
}

function closeHistoryModal() {
    if (historyModal) historyModal.classList.remove('active');
}

async function showHistoryDetails(id) {
    if (!historyDetailsModal || !detailsContent) return;
    try {
        console.log("Fetching history details for ID:", id);
        const response = await fetch(`${BACKEND_URL}/history`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
        });
        console.log("History details response status:", response.status);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Unknown error fetching history for details.");
        }
        const historyData = await response.json();
        const entry = historyData.find(e => e.id === id);
        if (entry) {
            console.log("History details data:", entry);
            let contentHtml = `<p><strong>Timestamp:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>`;
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
            closeHistoryModal();
        } else {
            console.error("History entry not found for ID:", id);
            document.getElementById("error").textContent = "Error: History entry not found.";
        }
    } catch (error) {
        console.error("History details error:", error.message);
        document.getElementById("error").textContent = "Error displaying history details: " + error.message;
    }
}

function closeHistoryDetailsModal() {
    if (historyDetailsModal) {
        historyDetailsModal.classList.remove('active');
        detailsContent.innerHTML = '';
    }
}

async function updateAuthSection() {
    const authSection = document.getElementById("auth-section");
    const user = auth.currentUser;
    if (user) {
        authSection.innerHTML = `
            <div class="user-profile" onclick="signOut()">
                <img src="${user.photoURL || 'default-pfp.png'}" alt="Profile Picture" class="pfp">
                <div class="user-info">
                    <span class="user-name">${user.displayName || 'User'}</span>
                    <span class="user-email">${user.email}</span>
                </div>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <button id="signup-button">Sign Up</button>
            <button id="signin-button">Sign In</button>
        `;
        document.getElementById("signup-button").addEventListener('click', () => signupModal.classList.add('active'));
        document.getElementById("signin-button").addEventListener('click', () => signinModal.classList.add('active'));
    }
}

function signOut() {
    auth.signOut().then(() => {
        localStorage.removeItem("access_token");
        updateAuthSection();
    });
}

// main.js
const BACKEND_URL = "https://nameit-backend-2.vercel.app";

const CATEGORY_OPTIONS = ["Auto (AI Decides)", "App", "Book", "Brand", "Company", "Course", "Drawing", "Event", "Game", "New Word", "Object", "Pet", "Place", "Platform", "Podcast", "Product", "Random", "Service", "Song", "Startup", "Tool", "Trend", "Video", "Website"];
const STYLE_OPTIONS = ["Auto (AI Decides)", "Random", "Professional", "Creative", "Modern", "Minimal", "Powerful", "Elegant", "Luxury", "Catchy", "Playful", "Bold", "Futuristic", "Mysterious", "Artistic", "Fantasy", "Mythical", "Retro", "Cute", "Funny", "Classy"];
const PATTERN_OPTIONS = ["Auto (AI Decides)", "One Word", "Two Words", "Invented Word", "Real Word", "Short & Punchy", "Long & Evocative"];
const FONT_OPTIONS = {
    "Roboto": "'Roboto', sans-serif",
    "Lato": "'Lato', sans-serif",
    "Montserrat": "'Montserrat', sans-serif",
    "Oswald": "'Oswald', sans-serif",
    "Raleway": "'Raleway', sans-serif",
    "Poppins": "'Poppins', sans-serif",
    "Nunito": "'Nunito', sans-serif",
    "Merriweather": "'Merriweather', serif",
    "Playfair Display": "'Playfair Display', serif",
    "Ubuntu": "'Ubuntu', sans-serif",
    "Source Code Pro": "'Source Code Pro', monospace",
    "Georgia": "'Georgia', serif",
    "Verdana": "'Verdana', sans-serif"
};

const PLATFORM_OPTIONS = {
    "Behance":      { value: "Behance", icon: "fab fa-behance" },
    "Facebook":     { value: "Facebook", icon: "fab fa-facebook" },
    "GitHub":       { value: "GitHub", icon: "fab fa-github" },
    "Instagram":    { value: "Instagram", icon: "fab fa-instagram" },
    "Medium":       { value: "Medium", icon: "fab fa-medium" },
    "Pinterest":    { value: "Pinterest", icon: "fab fa-pinterest" },
    "Reddit":       { value: "Reddit", icon: "fab fa-reddit-alien" },
    "Roblox":       { value: "Roblox", icon: "fas fa-gamepad" },
    "Rumble":       { value: "Rumble", icon: "fas fa-video" },
    "SoundCloud":   { value: "SoundCloud", icon: "fab fa-soundcloud" },
    "Steam":        { value: "Steam", icon: "fab fa-steam" },
    "TikTok":       { value: "TikTok", icon: "fab fa-tiktok" },
    "Twitch":       { value: "Twitch", icon: "fab fa-twitch" },
    "X":            { value: "X", icon: "fab fa-twitter" },
    "YouTube":      { value: "YouTube", icon: "fab fa-youtube" }
};

const DOMAIN_OPTIONS = {
    ".com": { value: "com", popular: true },
    ".io": { value: "io", popular: true },
    ".ai": { value: "ai", popular: true },
    ".app": { value: "app", popular: true },
    ".net": { value: "net" },
    ".org": { value: "org" },
    ".co": { value: "co" },
    ".xyz": { value: "xyz" },
    ".dev": { value: "dev" },
    ".tech": { value: "tech" },
    ".store": { value: "store" },
    ".me": { value: "me" },
};

const BACKGROUND_ANIMATIONS = {
    'pattern1': 'default', 'pattern2': 'default', 'pattern3': 'default',
    'pattern4': 'circles', 'pattern5': 'circles', 'pattern6': 'circles',
    'pattern7': 'sliding-bar', 'pattern8': 'sliding-bar',
    'pattern9': 'color-shift',
    'pattern10': 'color-shifting-bar',
    'pattern11': 'random-flicker',
    'pattern12': 'vertical-crossing-bars'
};



let customRefineHistoryLog = [];
let summaryHistoryLog = [];
let combinerHistoryLog = [];

// --- DOM Element Selectors ---
const mainGeneratorView = document.getElementById("main-generator-view");
const customRefinerView = document.getElementById("custom-refiner-view");
const availabilityCheckerView = document.getElementById("availability-checker-view");
const nameAnalyzerView = document.getElementById("name-analyzer-view");
const settingsView = document.getElementById("settings-view");
const aboutView = document.getElementById("about-view");
const premiumView = document.getElementById("premium-view");
const creditsView = document.getElementById("credits-view");
const summarizerView = document.getElementById("summarizer-view");
const wordCombinerView = document.getElementById("word-combiner-view");
const termsView = document.getElementById("terms-view");
const privacyView = document.getElementById("privacy-view");
const contactView = document.getElementById("contact-view");
const outputContainer = document.getElementById("output_container");
const refineSection = document.getElementById("refine_section");
const refineButtonSection = document.querySelector(".refine-button-section");
const contactForm = document.getElementById('contact-form');
const refinedOutputs = document.getElementById("refined_outputs");
const namesPre = document.getElementById("names");
const reasonsPre = document.getElementById("reasons");
const refinedNamesPre = document.getElementById("refined_names");
const refinedReasonsPre = document.getElementById("refined_reasons");
const promptInput = document.getElementById("prompt");
const editBox = document.getElementById("edit_box");
const generateBtn = document.querySelector(".generate-btn");
const surpriseBtn = document.querySelector(".surprise-btn");
const refineBtn = document.querySelector(".refine-btn");
const customRefineBtn = document.getElementById("custom-refine-btn");
const checkAvailabilityBtn = document.getElementById("check-availability-btn");
const analyzeNameBtn = document.getElementById("analyze-name-btn");
const summarizeBtn = document.getElementById("summarize-btn");
const combineWordsBtn = document.getElementById("combine-words-btn");
const summaryResultsContainer = document.getElementById("summary-results-container");
const combinerResultsContainer = document.getElementById("combiner-results-container");
const summaryOutput = document.getElementById("summary-output");
const combinerOutput = document.getElementById("combiner-output");
const combinerExplanation = document.getElementById("combiner-explanation");
const summarizerLoadingPlaceholder = document.getElementById("summarizer-loading-placeholder");
const combinerLoadingPlaceholder = document.getElementById("combiner-loading-placeholder");
const summaryHistorySection = document.getElementById("summary-history-section");
const summaryHistoryDiv = document.getElementById("summary-history");
const combinerHistorySection = document.getElementById("combiner-history-section");
const combinerHistoryDiv = document.getElementById("combiner-history");
const historyModal = document.getElementById("history-modal");
const closeButtonHistoryModal = document.querySelector("#history-modal .close-button");
const fullHistoryList = document.getElementById("full-history-list");
const historyDetailsModal = document.getElementById("history-details-modal");
const closeButtonDetailsModal = document.querySelector("#history-details-modal .close-button");
const detailsContent = document.getElementById("details-content");
const historyImportModal = document.getElementById("history-import-modal");
const closeButtonImportModal = document.querySelector("#history-import-modal .close-button");
const historyImportList = document.getElementById("history-import-list");
const recentHistorySection = document.getElementById("history_section");
const recentHistoryDiv = document.getElementById("history");
const customRefineHistorySection = document.getElementById("custom-refine-history-section");
const customRefineHistoryDiv = document.getElementById("custom-refine-history");
const refinedOutputsCustom = document.getElementById("refined_outputs_custom");
const refinedNamesCustomPre = document.getElementById("refined_names_custom");
const refinedReasonsCustomPre = document.getElementById("refined_reasons_custom");
const refinerLoadingPlaceholder = document.getElementById("refiner-loading-placeholder");
const alternativesGeneratorSection = document.getElementById("alternatives-generator-section");
const generateAlternativesBtn = document.getElementById("generate-alternatives-btn");
const alternativesResultsContainer = document.getElementById("alternatives-results-container");
const availableAlternativesSection = document.getElementById("available-alternatives-section");
const generateAvailableAltBtn = document.getElementById("generate-available-alt-btn");
const availableAlternativesResults = document.getElementById("available-alternatives-results");
// --- Settings Page Selectors ---
const themeSelect = document.getElementById('theme-select');
const backgroundSelect = document.getElementById('background-select');
const fontSelect = document.getElementById('font-select');
const fontSizeSlider = document.getElementById('font-size-slider');
const resultsFontSelect = document.getElementById('results-font-select');
const resultsFontSizeSlider = document.getElementById('results-font-size-slider');
const animationsToggle = document.getElementById('animations-toggle');
const changePasswordBtn = document.getElementById('change-password-btn');
const manageSubscriptionBtn = document.getElementById('manage-subscription-btn');
const exportHistoryBtn = document.getElementById('export-history-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');




document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent('top-bar-placeholder', 'components/topbar.html');
    await loadComponent('sidebar-placeholder', 'components/sidebar.html');
    
    if (typeof initializeTopbar === 'function') initializeTopbar();
    if (typeof initializeSidebar === 'function') initializeSidebar();
    if (typeof initializeAuth === 'function') initializeAuth();
    if (typeof initializePaymentSystem === 'function') initializePaymentSystem();
    
    initializeUI();
    handleHashChange(); // This line is added to handle direct linking
    initializeSettings();
    populateDropdown("category", CATEGORY_OPTIONS);
    populateDropdown("style", STYLE_OPTIONS);
    populateDropdown("pattern", PATTERN_OPTIONS);
    populateFontDropdowns();
    
    setupEventListeners();
    initializeAvailabilityDropdowns();

    setTimeout(() => {
        const loader = document.getElementById('loader-wrapper');
        if (loader) {
            loader.classList.add('fade-out');
            loader.addEventListener('transitionend', () => loader.style.display = 'none');
        }
    }, 5000);
});



async function loadComponent(placeholderId, componentUrl) {
    try {
        const response = await fetch(componentUrl);
        if (!response.ok) throw new Error(`Failed to load ${componentUrl}`);
        document.getElementById(placeholderId).innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

function initializeUI() {
    showView('generator');
    if (promptInput && !promptInput.dataset.originalPlaceholder) promptInput.dataset.originalPlaceholder = promptInput.placeholder;
    if (editBox && !editBox.dataset.originalPlaceholder) editBox.dataset.originalPlaceholder = editBox.placeholder;
}

async function handleContactFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = document.getElementById('contact-submit-btn');
    const submissionMessage = document.getElementById('form-submission-message');
    
    // New: Verify user is logged in at the moment of submission
    const user = window.auth.currentUser;
    if (!user || !user.email) {
        submissionMessage.style.display = 'block';
        submissionMessage.textContent = 'You must be logged in to send a message.';
        submissionMessage.className = 'error';
        return; // Stop the submission
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    const data = new FormData(form);
    
    // New: Manually set the email in the form data just before sending
    // This is the crucial fix.
    data.set('email', user.email);

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        submissionMessage.style.display = 'block';

        if (response.ok) {
            submissionMessage.textContent = 'Thank you! Your message has been sent successfully.';
            submissionMessage.className = 'success';
            form.style.display = 'none'; // Hide the form after success
        } else {
            const responseData = await response.json();
            const errorMessage = responseData.errors ? responseData.errors.map(error => error.message).join(', ') : 'Oops! There was a problem submitting your form.';
            throw new Error(errorMessage);
        }
    } catch (error) {
        submissionMessage.textContent = error.message;
        submissionMessage.className = 'error';
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }
}



// --- Full Updated setupEventListeners Function (Replace your existing function) ---

function setupEventListeners() {
    if (historyModal && closeButtonHistoryModal) {
        closeButtonHistoryModal.addEventListener('click', closeHistoryModal);
        window.addEventListener('click', (event) => { if (event.target == historyModal) closeHistoryModal(); });
    }
    if (historyDetailsModal && closeButtonDetailsModal) {
        closeButtonDetailsModal.addEventListener('click', () => { closeHistoryDetailsModal(); openHistoryModal(); });
        window.addEventListener('click', (event) => { if (event.target == historyDetailsModal) { closeHistoryDetailsModal(); openHistoryModal(); } });
    }
    if (historyImportModal && closeButtonImportModal) {
        closeButtonImportModal.addEventListener('click', closeHistoryImportModal);
        window.addEventListener('click', (event) => { if (event.target == historyImportModal) closeHistoryImportModal(); });
    }
    if(refineBtn) {
        refineBtn.onclick = () => {
            const instruction = editBox.value.trim();
            if (instruction) refineNames('freestyle', null, instruction);
            else showTemporaryPlaceholderError(editBox, "Please enter a refine instruction.");
        };
    }
    if (customRefineBtn) customRefineBtn.onclick = customRefineName;
    if (checkAvailabilityBtn) checkAvailabilityBtn.onclick = checkAvailability;
    if (analyzeNameBtn) analyzeNameBtn.onclick = analyzeName;
    if (generateAlternativesBtn) generateAlternativesBtn.onclick = generateAlternatives;
    if (generateAvailableAltBtn) generateAvailableAltBtn.onclick = generateAvailableAlternatives;
    if (summarizeBtn) summarizeBtn.onclick = summarizeText;
    if (combineWordsBtn) combineWordsBtn.onclick = combineWords;
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // Settings event listeners
    if (themeSelect) themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));
    if (fontSelect) fontSelect.addEventListener('change', (e) => applyFont(e.target.value));
    if (fontSizeSlider) fontSizeSlider.addEventListener('input', (e) => applyFontSize(e.target.value));
    if (resultsFontSelect) resultsFontSelect.addEventListener('change', (e) => applyResultsFont(e.target.value));
    if (resultsFontSizeSlider) resultsFontSizeSlider.addEventListener('input', (e) => applyResultsFontSize(e.target.value));
    if (animationsToggle) animationsToggle.addEventListener('change', (e) => applyAnimationSetting(e.target.checked));
    if (backgroundSelect) backgroundSelect.addEventListener('change', (e) => applyBackground(e.target.value));
    if (exportHistoryBtn) exportHistoryBtn.addEventListener('click', exportHistory);
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);
    if (changePasswordBtn) changePasswordBtn.addEventListener('click', sendPasswordReset);

    const buyCreditsShortcutBtn = document.getElementById('buy-credits-shortcut-btn');
    const goPremiumFromDropdownBtn = document.getElementById('go-premium-from-dropdown-btn');
    const tierDropdown = document.getElementById("tier-dropdown");

    if (buyCreditsShortcutBtn) {
        buyCreditsShortcutBtn.addEventListener('click', () => { 
            showView('credits'); 
            if(tierDropdown) tierDropdown.classList.remove('visible');
        });
    }

    if (goPremiumFromDropdownBtn) {
        goPremiumFromDropdownBtn.addEventListener('click', () => { 
            showView('premium'); 
            if(tierDropdown) tierDropdown.classList.remove('visible');
        });
    }

    setTimeout(() => {
        const homeLink = document.getElementById('home-link');
        const customRefineLink = document.getElementById('custom-refine-link');
        const availabilityCheckLink = document.getElementById('availability-check-link');
        const nameAnalyzerLink = document.getElementById('name-analyzer-link');
        const summarizerLink = document.getElementById('summarizer-link');
        const wordCombinerLink = document.getElementById('word-combiner-link');
        const settingsLink = document.getElementById('settings-link');
        const aboutLink = document.getElementById('about-link');
        const contactLink = document.getElementById('contact-link');
        const premiumLink = document.getElementById('go-premium-link');
        const buyCreditsLink = document.getElementById('buy-credits-link');
        const termsLink = document.getElementById('terms-link');
        const privacyLink = document.getElementById('privacy-link');
        const contactSignInLink = document.getElementById('contact-signin-link');


        if (homeLink) homeLink.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = ''; showView('generator'); if (window.isSidebarOpen) toggleSidebar(); });
        if (customRefineLink) customRefineLink.addEventListener('click', (e) => { e.preventDefault(); showView('refiner'); if (window.isSidebarOpen) toggleSidebar(); });
        if (availabilityCheckLink) availabilityCheckLink.addEventListener('click', (e) => { e.preventDefault(); showView('availability-checker'); if (window.isSidebarOpen) toggleSidebar(); });
        if (nameAnalyzerLink) nameAnalyzerLink.addEventListener('click', (e) => { e.preventDefault(); showView('name-analyzer'); if (window.isSidebarOpen) toggleSidebar(); });
        if (summarizerLink) summarizerLink.addEventListener('click', (e) => { e.preventDefault(); showView('summarizer'); if (window.isSidebarOpen) toggleSidebar(); });
        if (wordCombinerLink) wordCombinerLink.addEventListener('click', (e) => { e.preventDefault(); showView('word-combiner'); if (window.isSidebarOpen) toggleSidebar(); });
        if (settingsLink) settingsLink.addEventListener('click', (e) => { e.preventDefault(); showView('settings'); if (window.isSidebarOpen) toggleSidebar(); });
        if (aboutLink) aboutLink.addEventListener('click', (e) => { e.preventDefault(); showView('about'); if (window.isSidebarOpen) toggleSidebar(); });
        if (contactLink) contactLink.addEventListener('click', (e) => { e.preventDefault(); showView('contact'); if (window.isSidebarOpen) toggleSidebar(); });
        if (premiumLink) premiumLink.addEventListener('click', (e) => { e.preventDefault(); showView('premium'); if (window.isSidebarOpen) toggleSidebar(); });
        if (buyCreditsLink) buyCreditsLink.addEventListener('click', (e) => { e.preventDefault(); showView('credits'); if (window.isSidebarOpen) toggleSidebar(); });
        if (contactSignInLink) contactSignInLink.addEventListener('click', (e) => { e.preventDefault(); openSignInModal(); });
        
        if (termsLink) termsLink.addEventListener('click', (e) => { 
            e.preventDefault(); 
            window.location.hash = 'terms'; 
            if (window.isSidebarOpen) toggleSidebar(); 
        });
        if (privacyLink) privacyLink.addEventListener('click', (e) => { 
            e.preventDefault(); 
            window.location.hash = 'privacy'; 
            if (window.isSidebarOpen) toggleSidebar(); 
        });
    }, 500);
}

function showView(viewName) {
    const allViews = [mainGeneratorView, customRefinerView, availabilityCheckerView, nameAnalyzerView, settingsView, aboutView, premiumView, creditsView, summarizerView, wordCombinerView, termsView, privacyView, contactView];
    allViews.forEach(view => {
        if (view) view.classList.add('hidden');
    });
    if (viewName !== 'generator') {
        if (outputContainer) outputContainer.classList.add('hidden');
        if (refineSection) refineSection.classList.add('hidden');
        if (refineButtonSection) refineButtonSection.classList.add('hidden');
        if (refinedOutputs) refinedOutputs.classList.add('hidden');
        if (recentHistorySection) recentHistorySection.classList.add('hidden');
    } 
    else {
        if (namesPre && namesPre.innerHTML.trim() !== "") {
            if (outputContainer) outputContainer.classList.remove('hidden');
            if (recentHistorySection) recentHistorySection.classList.remove('hidden');
            if (window.auth.currentUser && window.auth.currentUser.emailVerified) {
                if (refineSection) refineSection.classList.remove('hidden');
                if (refineButtonSection) refineButtonSection.classList.remove('hidden');
            }
        }
    }

    if (viewName === 'generator') {
        if(mainGeneratorView) mainGeneratorView.classList.remove('hidden');
    } else if (viewName === 'refiner') {
        if(customRefinerView) customRefinerView.classList.remove('hidden');
    } else if (viewName === 'availability-checker') {
        if(availabilityCheckerView) availabilityCheckerView.classList.remove('hidden');
    } else if (viewName === 'name-analyzer') {
        if(nameAnalyzerView) nameAnalyzerView.classList.remove('hidden');
    } else if (viewName === 'settings') {
        if(settingsView) settingsView.classList.remove('hidden');
    } else if (viewName === 'about') {
        if(aboutView) aboutView.classList.remove('hidden');
    } else if (viewName === 'premium') {
        if(premiumView) premiumView.classList.remove('hidden');
    } else if (viewName === 'credits') {
        if(creditsView) creditsView.classList.remove('hidden');
    } else if (viewName === 'summarizer') {
        if(summarizerView) summarizerView.classList.remove('hidden');
    } else if (viewName === 'word-combiner') {
        if(wordCombinerView) wordCombinerView.classList.remove('hidden');
    } else if (viewName === 'terms') {
        if(termsView) termsView.classList.remove('hidden');
    } else if (viewName === 'privacy') {
        if(privacyView) privacyView.classList.remove('hidden');
    } else if (viewName === 'contact') {
        if(contactView) contactView.classList.remove('hidden');
        
        // ** NEW LOGIC STARTS HERE **
        const user = window.auth.currentUser;
        const contactFormElement = document.getElementById('contact-form');
        const loginPromptElement = document.getElementById('contact-login-prompt');
        const emailDisplayElement = document.getElementById('contact-user-email-display');
        const hiddenEmailInputElement = document.getElementById('contact-email');

        if (user) {
            // User is logged in, show the form and populate their email
            loginPromptElement.classList.add('hidden');
            contactFormElement.classList.remove('hidden');
            emailDisplayElement.textContent = user.email;
            hiddenEmailInputElement.value = user.email;
        } else {
            // User is not logged in, show the prompt and hide the form
            loginPromptElement.classList.remove('hidden');
            contactFormElement.classList.add('hidden');
        }
        // ** NEW LOGIC ENDS HERE **
    }
}


function populateDropdown(id, options) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = '';
    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

function populateFontDropdowns() {
    const fontSelectors = [fontSelect, resultsFontSelect];
    fontSelectors.forEach(selector => {
        if (selector) {
            selector.innerHTML = '';
            for (const fontName in FONT_OPTIONS) {
                const option = document.createElement('option');
                option.value = FONT_OPTIONS[fontName];
                option.textContent = fontName;
  
                 selector.appendChild(option);
            }
        }
    });
}

function cleanNames(text) { return text.replace(/\*\*|`/g, ''); }

function showLoading(targetElement) {
    if (!targetElement) return;
    targetElement.innerHTML = '';
    targetElement.classList.remove("fade-in-content");
    const overlay = document.createElement("div");
    overlay.className = "loading-overlay";
    overlay.innerHTML = '<div class="spinner-overlay show"><div class="spinner"></div></div>';
    targetElement.appendChild(overlay);
}

function hideLoading(targetElement) {
    if (!targetElement) return;
    const overlay = targetElement.querySelector(".loading-overlay, .spinner-overlay");
    if (overlay) overlay.remove();
}

function disableButtons() {
    [generateBtn, surpriseBtn, refineBtn, customRefineBtn, checkAvailabilityBtn, analyzeNameBtn, generateAlternativesBtn, generateAvailableAltBtn, summarizeBtn, combineWordsBtn].forEach(btn => { if(btn) btn.disabled = true; });
}

function enableButtons() {
    [generateBtn, surpriseBtn, refineBtn, customRefineBtn, checkAvailabilityBtn, analyzeNameBtn, generateAlternativesBtn, generateAvailableAltBtn, summarizeBtn, combineWordsBtn].forEach(btn => { if(btn) btn.disabled = false; });
}

function showTemporaryPlaceholderError(element, message) {
    if (!element) return;
    if (!element.dataset.originalPlaceholder) element.dataset.originalPlaceholder = element.placeholder;
    element.placeholder = message;
    element.classList.add("prompt-error-placeholder");
    setTimeout(() => {
        if (element.placeholder === message) {
            element.placeholder = element.dataset.originalPlaceholder;
            element.classList.remove("prompt-error-placeholder");
        }
    }, 3000);
}

async function getUserToken() {
    if (window.auth && window.auth.currentUser) {
        try {
            return await window.auth.currentUser.getIdToken(true);
        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        }
    }
    return null;
}

function renderClickableNames(namesArray, targetPre = namesPre) {
    if (!targetPre) return;
    targetPre.innerHTML = '';
    if(targetPre.classList.contains('clickable')) targetPre.classList.remove('clickable');
    namesArray.forEach(name => {
        const nameEl = document.createElement('div');
        nameEl.className = 'generated-name';
        nameEl.textContent = name;
        if (targetPre === namesPre) {
            targetPre.classList.add('clickable');
            nameEl.addEventListener('click', () => addSeedName(name));
        }
        targetPre.appendChild(nameEl);
    });
}

function addSeedName(name) {
    const moreLikeThisSection = document.getElementById("more-like-this-section");
    const container = document.getElementById("more-like-this-container");
    if (!moreLikeThisSection || !container) return;
    const existing = Array.from(container.children).map(el => el.textContent.slice(0, -1).trim());
    
    if (existing.includes(name) || existing.length >= 3) {
        if (existing.length >= 3) {
            moreLikeThisSection.classList.add('shake');
            setTimeout(() => moreLikeThisSection.classList.remove('shake'), 500);
        }
        return;
    }
    
    moreLikeThisSection.classList.add('visible');
    
    const tag = document.createElement('div');
    tag.className = 'seed-tag';
    tag.textContent = name;
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-seed';
    removeBtn.textContent = 'x';
    removeBtn.onclick = () => {
        tag.classList.add('pop-out');
        tag.addEventListener('animationend', () => {
            tag.remove();
            if (container.children.length === 0) {
                moreLikeThisSection.classList.remove('visible');
            }
        });
    };
    tag.appendChild(removeBtn);
    container.appendChild(tag);
}

async function generateName(force = false) {
    if (generateBtn.disabled && !force) return;
    const amountToGenerate = parseInt(document.getElementById("generator-amount").value);

    if (!window.auth.currentUser) {
        let anonGenerations = parseInt(localStorage.getItem('anonGenerations') || '0');
        if ((anonGenerations + amountToGenerate) > 25) {
            document.getElementById("error").textContent = `You have ${25 - anonGenerations} credits left.
            Please sign up to generate more.`;
            if (typeof openSignUpModal === 'function') openSignUpModal();
            return;
        }
    }

    const prompt = promptInput.value.trim();
    if (!prompt) {
        showTemporaryPlaceholderError(promptInput, "You cannot generate names without a description!");
        return;
    }

    document.getElementById("error").textContent = "";
    const seed_names = Array.from(document.getElementById("more-like-this-container").children).map(el => el.textContent.slice(0, -1).trim());
    const payload = { 
        prompt, 
        keywords: document.getElementById("keywords").value.trim(), 
        category: document.getElementById("category").value, 
        style: document.getElementById("style").value, 
        language: document.getElementById("language").value, 
        pattern: document.getElementById("pattern").value, 
        seed_names,
        relevancy: document.getElementById("generator-relevancy").value,
        amount: amountToGenerate
    };
    if(refinedOutputs) refinedOutputs.classList.add("hidden");

    if(outputContainer) outputContainer.classList.remove("hidden");
    showLoading(namesPre);
    showLoading(reasonsPre);
    disableButtons();

    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error((await response.json()).detail || `A server error occurred.`);
        const data = await response.json();
        if (!window.auth.currentUser) {
            let anonGenerations = parseInt(localStorage.getItem('anonGenerations') || '0') + amountToGenerate;
            localStorage.setItem('anonGenerations', anonGenerations);
            if (window.updateGenerationCountUI) window.updateGenerationCountUI(Math.max(0, 25 - anonGenerations));
        } else if (data.credits !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.credits);
        }

        renderClickableNames(data.names.map(cleanNames));
        if(reasonsPre) reasonsPre.textContent = data.reasons.map(cleanNames).join("\n\n");
        if(namesPre) namesPre.classList.add("fade-in-content");
        if(reasonsPre) reasonsPre.classList.add("fade-in-content");
        if (window.auth.currentUser && window.auth.currentUser.emailVerified) {
            if(refineSection) refineSection.classList.remove("hidden");
            if(refineButtonSection) refineButtonSection.classList.remove("hidden");
            if(refineBtn) refineBtn.classList.remove("hidden");
        }
        if(recentHistorySection) recentHistorySection.classList.remove("hidden");
        fetchHistory(false);
    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        resetDynamicSections();
    } finally {
        hideLoading(namesPre);
        hideLoading(reasonsPre);
        
        let countdown = 5;
        if(generateBtn) generateBtn.textContent = `Please wait ${countdown}s...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                if(generateBtn) generateBtn.textContent = `Please wait ${countdown}s...`;
            } else { 
                clearInterval(interval); 
        
                 if(generateBtn) generateBtn.textContent = '🎯 Generate Names'; 
                enableButtons(); 
            }
        }, 1000);
    }
}

async function refineNames(action, names = null, extra_info = "") {
    if (refineBtn.disabled) return;
    document.getElementById("error").textContent = "";
    if(refinedOutputs) refinedOutputs.classList.remove("hidden");
    showLoading(refinedNamesPre);
    showLoading(refinedReasonsPre);
    disableButtons();
    
    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/refine`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify({ action, names, extra_info })
        });
        if (!response.ok) throw new Error((await response.json()).detail || "Unknown error during name refinement.");
        const data = await response.json();
        if (window.auth.currentUser && data.credits !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.credits);
        }
        
        if(refinedNamesPre) refinedNamesPre.textContent = data.names.map(cleanNames).join("\n\n");
        if(refinedReasonsPre) refinedReasonsPre.textContent = data.reasons.map(cleanNames).join("\n\n");
        if(refinedNamesPre) refinedNamesPre.classList.add("fade-in-content");
        if(refinedReasonsPre) refinedReasonsPre.classList.add("fade-in-content");
        fetchHistory(false);
    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        if(refinedOutputs) refinedOutputs.classList.add("hidden");
    } finally {
        hideLoading(refinedNamesPre);
        hideLoading(refinedReasonsPre);
        
        let countdown = 5;
        if(refineBtn) refineBtn.textContent = `Please wait ${countdown}s...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                if(refineBtn) refineBtn.textContent = `Please wait ${countdown}s...`;
            } else { 
                clearInterval(interval); 
        
                 if(refineBtn) refineBtn.textContent = '🛠️ Refine Suggestions'; 
                enableButtons(); 
            }
        }, 1000);
    }
}

async function surpriseMe() {
    if (surpriseBtn.disabled) return;
    
    const keywordsInput = document.getElementById("keywords");
    const moreLikeThisContainer = document.getElementById("more-like-this-container");
    const moreLikeThisSection = document.getElementById("more-like-this-section");

    if(keywordsInput) keywordsInput.value = '';
    if(moreLikeThisContainer) moreLikeThisContainer.innerHTML = '';
    if(moreLikeThisSection) moreLikeThisSection.classList.remove('visible');
    
    disableButtons();
    if(promptInput) {
        promptInput.value = '';
        promptInput.placeholder = 'Conjuring an idea...';
    }

    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/surprise`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
        });
        if (!response.ok) throw new Error((await response.json()).detail || "Failed to get a surprise prompt.");
        const data = await response.json();
        if(promptInput) promptInput.value = data.prompt;
        document.getElementById("category").value = data.category;
        document.getElementById("style").value = data.style;
        document.getElementById("language").value = "English";
        document.getElementById("pattern").value = "Auto (AI Decides)";
        await generateName(true);
    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        enableButtons();
        if(promptInput) promptInput.placeholder = 'Enter a description!';
    }
}

async function customRefineName() {
    if (customRefineBtn.disabled) return;

    const nameToRefineInput = document.getElementById('name-to-refine');
    const instructionsInput = document.getElementById('refinement-instructions');
    const nameToRefine = nameToRefineInput.value.trim();
    const instructions = instructionsInput.value.trim();
    if (!nameToRefine) return showTemporaryPlaceholderError(nameToRefineInput, "Please enter a name to refine.");
    if (!instructions) return showTemporaryPlaceholderError(instructionsInput, "Please enter refinement instructions.");
    document.getElementById("error").textContent = "";
    
    if(refinedOutputsCustom) {
        refinedOutputsCustom.classList.add("hidden");
        refinedOutputsCustom.classList.remove("slide-down-animation");
    }
    if(refinerLoadingPlaceholder) {
        refinerLoadingPlaceholder.innerHTML = `<div class="loading-dots"><span></span><span></span><span></span></div>`;
        refinerLoadingPlaceholder.classList.remove("hidden");
    }
    
    disableButtons();

    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/custom-refine`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify({ 
                name: nameToRefine, 
                instructions: instructions,
          
                 relevancy: document.getElementById("refiner-relevancy").value,
                amount: document.getElementById("refiner-amount").value
            })
        });
        if (!response.ok) throw new Error((await response.json()).detail || "Unknown error during custom refinement.");
        const data = await response.json();
        
        if(refinerLoadingPlaceholder) refinerLoadingPlaceholder.classList.add("hidden");
        if (window.auth.currentUser && data.credits !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.credits);
        }
        
        renderClickableNames(data.names.map(cleanNames), refinedNamesCustomPre);
        if(refinedReasonsCustomPre) refinedReasonsCustomPre.textContent = data.reasons.map(cleanNames).join("\n\n");
        
        if(refinedOutputsCustom) {
            refinedOutputsCustom.classList.remove("hidden");
            setTimeout(() => {
                refinedOutputsCustom.classList.add("slide-down-animation");
            }, 10);
        }

        const historyEntry = { originalName: nameToRefine, instructions, results: data.names };
        customRefineHistoryLog.push(historyEntry);
        customRefineHistoryLog = customRefineHistoryLog.slice(-50);
        renderCustomRefineHistory();
        if(customRefineHistorySection) customRefineHistorySection.classList.remove("hidden");

    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        if(refinerLoadingPlaceholder) refinerLoadingPlaceholder.classList.add("hidden");
    } finally {
        let countdown = 5;
        if(customRefineBtn) customRefineBtn.textContent = `Please wait ${countdown}s...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                if(customRefineBtn) customRefineBtn.textContent = `Please wait ${countdown}s...`;
            } else { 
                clearInterval(interval); 
        
                 if(customRefineBtn) customRefineBtn.textContent = '🤖 Refine Name'; 
                enableButtons(); 
            }
        }, 1000);
    }
}

function renderCustomRefineHistory() {
    if (!customRefineHistoryDiv) return;
    customRefineHistoryDiv.innerHTML = "";
    if (customRefineHistoryLog.length === 0) {
        customRefineHistoryDiv.innerHTML = "<p>*No refinements yet.*</p>";
        return;
    }

    [...customRefineHistoryLog].reverse().forEach(entry => {
        const button = document.createElement('button');
        button.className = 'history-item';
        button.title = `Original: ${entry.originalName}\nInstruction: ${entry.instructions}`;
        const namesHTML = entry.results.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ");
        const preRefinedHTML = `<small class="pre-refined-history">from: ${cleanNames(entry.originalName)}</small>`;
        button.innerHTML = `${namesHTML}${preRefinedHTML}`;
        button.onclick = () => {
            
            const nameInput = document.getElementById('name-to-refine');
            const instructionsInput = document.getElementById('refinement-instructions');
            if(nameInput) nameInput.value = entry.originalName;
            if(instructionsInput) instructionsInput.value = entry.instructions;
        };
        customRefineHistoryDiv.appendChild(button);
    });
}

async function fetchHistory(renderToModal = false) {
    const targetDiv = renderToModal ? fullHistoryList : recentHistoryDiv;
    if(!targetDiv) return;
    targetDiv.innerHTML = "";
    const token = await getUserToken();
    if (!token) {
        targetDiv.innerHTML = "<p>*Sign in to see your history.*</p>";
        return;
    }
    try {
        const response = await fetch(`${BACKEND_URL}/history`, { headers: { "Authorization": `Bearer ${token}` } });
        if (!response.ok) throw new Error((await response.json()).detail || "Unknown error fetching history.");
        const history = await response.json();
        renderHistory(history, renderToModal);
    } catch (error) {
        document.getElementById("error").textContent = "Error fetching history: " + error.message;
        targetDiv.innerHTML = "<p>*Could not load history.*</p>";
    }
}

function renderHistory(history, renderToModal = false) {
    const targetDiv = renderToModal ?
    fullHistoryList : recentHistoryDiv;
    if (!targetDiv) return;
    targetDiv.innerHTML = "";
    if (!renderToModal) history = history.slice(0, 50);
    if (history.length === 0) {
        targetDiv.innerHTML = "<p>*No history yet. Generate some names!*</p>";
        return;
    }

    const createTooltip = (entry) => `Prompt: ${entry.prompt}\nCategory: ${entry.category}\nStyle: ${entry.style}`;
    if (renderToModal) {
        const groupedHistory = history.reduce((acc, entry) => {
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
       
                  const button = document.createElement('button');
                button.className = 'history-item';
                button.title = (entry.category.includes("Refined")) ? `Refine Instruction: ${entry.prompt}` : createTooltip(entry);
                button.innerHTML = `${entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ")}`;
                button.onclick = () => showHistoryDetails(entry.id);
    
                 dailyContainer.appendChild(button);
            });
            targetDiv.appendChild(dailyContainer);
        });
    } else {
        history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(entry => {
            const button = document.createElement('button');
            button.className = 'history-item';
            button.title = (entry.category.includes("Refined")) ? `Refine Instruction: ${entry.prompt}` : createTooltip(entry);
            const names = entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ");
            let 
            preRefinedHTML = '';
            if (entry.category.includes("Refined") && entry.pre_refined_names && entry.pre_refined_names.length > 0) {
                preRefinedHTML = `<small class="pre-refined-history">from: ${entry.pre_refined_names.map(cleanNames).join(", ")}</small>`;
            }
            button.innerHTML = `${names}${preRefinedHTML}`;
            button.onclick = () => restoreHistory(entry.id);
            targetDiv.appendChild(button);
   
         });
    }
}

async function restoreHistory(id) {
    document.getElementById("error").textContent = "";
    closeHistoryModal();
    closeHistoryDetailsModal();
    const token = await getUserToken();
    if (!token) return;
    
    const historyData = await fetch(`${BACKEND_URL}/history`, { headers: { "Authorization": `Bearer ${token}` } }).then(res => res.json());
    const entry = historyData.find(e => e.id === id);
    if (entry && !entry.category.includes("Refined")) {
        showView('generator');
        if(promptInput) promptInput.value = entry.prompt;
        document.getElementById("keywords").value = entry.keywords || '';
        document.getElementById("category").value = entry.category;
        document.getElementById("style").value = entry.style;
        document.getElementById("language").value = entry.language || 'English';
        renderClickableNames(entry.names.map(cleanNames)); 
        if(reasonsPre) reasonsPre.textContent = entry.reasons.map(cleanNames).join("\n\n");
        if(outputContainer) outputContainer.classList.remove("hidden");
        if(refineSection) refineSection.classList.remove("hidden");
        if(refineButtonSection) refineButtonSection.classList.remove("hidden");
        if(recentHistorySection) recentHistorySection.classList.remove("hidden");
        if (window.isSidebarOpen) toggleSidebar();
    } else {
        document.getElementById("error").textContent = "Cannot restore a refinement history item.";
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const text = element.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const copyMessage = document.createElement('div');
        copyMessage.textContent = "Copied to clipboard!";
        copyMessage.style.cssText = `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: var(--primary-accent); color: white; padding: 10px 20px; border-radius: 8px; z-index: 1000; opacity: 0; transition: opacity 0.5s ease-out;`;
        document.body.appendChild(copyMessage);
        setTimeout(() => { copyMessage.style.opacity = 1; }, 10);
        setTimeout(() => { copyMessage.style.opacity = 0; copyMessage.addEventListener('transitionend', () => copyMessage.remove()); 
        }, 2000);
    });
}

function resetDynamicSections(clearInputs = true) {
    const sections = [outputContainer, refineSection, refineButtonSection, refinedOutputs, refinedOutputsCustom, recentHistorySection, customRefineHistorySection, summaryHistorySection, combinerHistorySection];
    sections.forEach(el => {
        if (el) el.classList.add("hidden");
    });
    if (clearInputs) {
        const textPres = [namesPre, reasonsPre, refinedNamesPre, refinedReasonsPre, refinedNamesCustomPre, refinedReasonsCustomPre, summaryOutput, combinerOutput];
        textPres.forEach(el => {
            if (el) el.textContent = "";
        });
    }
    const errorDiv = document.getElementById("error");
    if (errorDiv) errorDiv.textContent = "";
}

async function showHistoryDetails(id) {
    if (!historyDetailsModal || !detailsContent) return;
    const token = await getUserToken();
    try {
        const historyData = await fetch(`${BACKEND_URL}/history`, { headers: { "Authorization": `Bearer ${token}` } }).then(res => res.json());
        const entry = historyData.find(e => e.id === id);
        if (entry) {
            let contentHtml = `<p><strong>Timestamp:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>`;
            if (entry.category.includes("Refined")) {
                contentHtml += `<p><strong>Refine Instruction:</strong> ${entry.prompt}</p>`;
                contentHtml += `<p><strong>Refined Names:</strong></p><pre>${entry.names.map(cleanNames).join("\n")}</pre>`;
                if (entry.pre_refined_names && entry.pre_refined_names.length > 0) {
                    contentHtml += `<p><strong>Original Name(s):</strong></p><pre>${entry.pre_refined_names.map(cleanNames).join("\n")}</pre>`;
                }
            } else {
                contentHtml += `<p><strong>Prompt:</strong> ${entry.prompt}</p>`;
                if (entry.keywords) contentHtml += `<p><strong>Keywords:</strong> ${entry.keywords}</p>`;
                contentHtml += `<p><strong>Category:</strong> ${entry.category}</p>`;
                contentHtml += `<p><strong>Style:</strong> ${entry.style}</p>`;
                contentHtml += `<p><strong>Generated Names:</strong></p><pre>${entry.names.map(cleanNames).join("\n")}</pre>`;
            }
            detailsContent.innerHTML = contentHtml;
            historyDetailsModal.classList.add('active');
            closeHistoryModal();
        }
    } catch (error) {
        document.getElementById("error").textContent = "Error displaying history details.";
    }
}

function openHistoryModal() {
    if (historyModal) {
        historyModal.classList.add('active');
        fetchHistory(true);
    }
    if (typeof toggleSidebar === 'function' && window.isSidebarOpen) {
        toggleSidebar();
    }
}

function closeHistoryModal() { if (historyModal) historyModal.classList.remove('active'); }
function closeHistoryDetailsModal() { if (historyDetailsModal) historyDetailsModal.classList.remove('active');
}

function initializeAvailabilityDropdowns() {
    const platformsBtn = document.getElementById("platforms-dropdown-btn");
    const platformsList = document.getElementById("platforms-dropdown-list");
    const domainsBtn = document.getElementById("domains-dropdown-btn");
    const domainsList = document.getElementById("domains-dropdown-list");

    if (!platformsBtn || !platformsList || !domainsBtn || !domainsList) return;

    Object.keys(PLATFORM_OPTIONS).sort().forEach(name => {
        const option = PLATFORM_OPTIONS[name];
        const label = document.createElement('label');
        label.className = 'platform-item';
        const icon = document.createElement('i');
        icon.className = option.icon;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = option.value;
        checkbox.checked = false;
        label.appendChild(icon);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${name}`));
        platformsList.appendChild(label);
    });

    const selectAllLabel = document.createElement('label');
    selectAllLabel.className = 'platform-item select-all';
    selectAllLabel.innerHTML = `<input type="checkbox" id="select-all-domains"> <strong>Select All</strong>`;
    domainsList.appendChild(selectAllLabel);

    Object.keys(DOMAIN_OPTIONS).forEach(name => {
        const option = DOMAIN_OPTIONS[name];
        const label = document.createElement('label');
        label.className = 'platform-item';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = option.value;
        checkbox.dataset.tld = 'true';
        checkbox.checked = false;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${name}`));
        domainsList.appendChild(label);
    });

    document.getElementById('select-all-domains').addEventListener('change', (e) => {
        domainsList.querySelectorAll('input[type="checkbox"][data-tld="true"]').forEach(box => {
            box.checked = e.target.checked;
        });
        domainsList.dispatchEvent(new Event('change'));
    });

    [platformsBtn, domainsBtn].forEach(btn => {
        const list = btn.nextElementSibling;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.disabled) return;
            list.classList.toggle('hidden');
            btn.classList.toggle('open');
        });
        list.addEventListener('click', (e) => e.stopPropagation());
    });

    document.addEventListener('click', () => {
        platformsList.classList.add('hidden');
        platformsBtn.classList.remove('open');
        domainsList.classList.add('hidden');
        domainsBtn.classList.remove('open');
    });

    platformsList.addEventListener('change', () => {
        updateDropdownButtonText(platformsBtn, platformsList, 'Platforms');
        handleDropdownExclusivity(platformsList, domainsList, domainsBtn);
    });

    domainsList.addEventListener('change', () => {
        updateDropdownButtonText(domainsBtn, domainsList, 'Domains');
        handleDropdownExclusivity(domainsList, platformsList, platformsBtn);
    });

    updateDropdownButtonText(platformsBtn, platformsList, 'Platforms');
    updateDropdownButtonText(domainsBtn, domainsList, 'Domains');

    if (availableAlternativesSection) availableAlternativesSection.classList.add('hidden');
}

function updateDropdownButtonText(button, list, type) {
    const selectedCount = list.querySelectorAll('input[type="checkbox"]:checked:not(#select-all-domains)').length;
    const totalCount = list.querySelectorAll('input[type="checkbox"]:not(#select-all-domains)').length;
    const buttonText = button.querySelector('span:first-child');

    if (selectedCount === totalCount) {
        buttonText.textContent = `All ${type}`;
    } else if (selectedCount === 0) {
        buttonText.textContent = `Select ${type}`;
    } else {
        buttonText.textContent = `${selectedCount} ${type} Selected`;
    }
}

async function checkAvailability() {
    const nameInput = document.getElementById('name-to-check');
    const nameToCheck = nameInput.value.trim();
    if (!nameToCheck) {
        showTemporaryPlaceholderError(nameInput, "Please enter a name to check.");
        return;
    }
    
    const selectedPlatforms = Array.from(document.querySelectorAll('#platforms-dropdown-list input:checked'))
                                   .map(box => box.value);

    const selectedTlds = Array.from(document.querySelectorAll('#domains-dropdown-list input:checked:not(#select-all-domains)'))
                              .map(box => box.value);

    const resultsContainer = document.getElementById('availability-results-container');
    resultsContainer.innerHTML = `<div class="loader-container"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
    availableAlternativesSection.classList.add('hidden');
    availableAlternativesResults.innerHTML = '';
    disableButtons();
    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/check-availability`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify({ 
                name: nameToCheck,
                platforms: selectedPlatforms,
                tlds: selectedTlds
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "An error occurred.");
        }

        const data = await response.json();
        if (data.credits !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.credits);
        }
        renderAvailabilityResults(data);
        
        if (selectedPlatforms.length > 0) {
            availableAlternativesSection.classList.remove('hidden');
        }
    } catch (error) {
        resultsContainer.innerHTML = `<div class="error" style="text-align: center;">Error: ${error.message}</div>`;
    } finally {
        enableButtons();
    }
}


function renderAvailabilityResults(data) {
    const resultsContainer = document.getElementById('availability-results-container');
    let htmlContent = '';
    
    let domainsHtml = '';
    if (data.domains && data.domains.length > 0) {
        domainsHtml = data.domains.map(d => {
            const viewButton = `<a href="https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${d.domain}" target="_blank" class="view-link">(View)</a>`;
            return `
            <div class="result-item">
                <span class="result-name">
                    <i class="fas fa-globe"></i>
                    ${d.domain}
                </span>
                ${d.available ? '<span class="status-available">✅ Available</span>' : `<span class="status-taken">❌ Taken ${viewButton}</span>`}
            </div>
        `}).join('');
    }
    
    let socialsHtml = '';
    if (data.socials && data.socials.length > 0) {
        socialsHtml = data.socials.map(s => {
            let iconClass = 'fas fa-hashtag';
            const optionKey = Object.keys(PLATFORM_OPTIONS).find(key => PLATFORM_OPTIONS[key].value === s.platform);
            if (optionKey) {
                iconClass = PLATFORM_OPTIONS[optionKey].icon;
            }
            return `
                <div class="result-item">
                    <span class="result-name">
                        <i class="${iconClass}"></i>
                         ${s.platform}
                    </span>
                    ${s.available ? `<span class="status-available">✅ Available</span>` : `<span class="status-taken">❌ Taken (<a href="${s.url}" target="_blank" class="view-link">View</a>)</span>`}
                </div>`;
        }).join('');
    }

    if (domainsHtml) {
        htmlContent += `<div class="output-box"><div class="output-header"><label>Domain Availability</label></div><div class="results-list">${domainsHtml}</div></div>`;
    }
    if (socialsHtml) {
        htmlContent += `<div class="output-box"><div class="output-header"><label>Social Media & Platforms</label></div><div class="results-list">${socialsHtml}</div></div>`;
    }

    if (htmlContent === '') {
        resultsContainer.innerHTML = '<p style="text-align: center; margin-top: 20px;">Please select at least one option from the dropdowns to check.</p>';
    } else {
        resultsContainer.innerHTML = `<div class="output-section" style="margin-top: 20px;">${htmlContent}</div>`;
    }
}

async function generateAvailableAlternatives() {
    if (generateAvailableAltBtn.disabled) return;

    const nameInput = document.getElementById('name-to-check');
    const originalName = nameInput.value.trim();
    if (!originalName) {
        showTemporaryPlaceholderError(nameInput, "Please enter a name to check first.");
        return;
    }
    
    const selectedPlatforms = Array.from(document.querySelectorAll('#platforms-dropdown-list input:checked'))
                                   .map(box => box.value);

    const selectedTlds = Array.from(document.querySelectorAll('#domains-dropdown-list input:checked:not(#select-all-domains)'))
                              .map(box => box.value);

    if (selectedPlatforms.length === 0 && selectedTlds.length === 0) {
        alert("Please select at least one platform or domain to check the alternatives against.");
        return;
    }

    showAlternativesLoadingPlaceholder(availableAlternativesResults);
    disableButtons();
    
    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/generate-available-alternatives`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify({
                original_name: originalName,
                platforms_to_check: selectedPlatforms,
                tlds_to_check: selectedTlds
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to generate alternatives.");
        }

        const data = await response.json();
        if (data.credits !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.credits);
        }

        renderAvailableAlternatives(data.alternatives);

    } catch (error) {
        availableAlternativesResults.innerHTML = `<div class="error" style="text-align: center;">Error: ${error.message}</div>`;
    } finally {
        let countdown = 10;
        generateAvailableAltBtn.textContent = `Please wait ${countdown}s...`;
        generateAvailableAltBtn.disabled = true;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                generateAvailableAltBtn.textContent = `Please wait ${countdown}s...`;
            } else {
                clearInterval(interval);
                 generateAvailableAltBtn.textContent = '💡 Generate Available Alternatives';
                enableButtons();
            }
        }, 1000);
    }
}

function renderAvailableAlternatives(alternatives) {
    if (!alternatives || alternatives.length === 0) {
        availableAlternativesResults.innerHTML = `<p style="text-align: center;">Could not find any available alternatives with the current selections. Try a different name or selections.</p>`;
        return;
    }
    
    let html = '<div class="output-section alternatives-report">';
    alternatives.forEach(alt => {
        html += `<div class="output-box alternative-result-card">`;
        html += `<h3 class="alternative-name-header">${alt.name}</h3>`;

        if (alt.availability.platforms && alt.availability.platforms.length > 0) {
            html += `<div class="availability-sub-section"><h4>Platforms</h4><div class="results-list">`;
            alt.availability.platforms.forEach(s => {
                const optionKey = Object.keys(PLATFORM_OPTIONS).find(key => PLATFORM_OPTIONS[key].value === s.platform);
                const iconClass = optionKey ? PLATFORM_OPTIONS[optionKey].icon : 'fas fa-hashtag';
                html += `<div class="result-item">
                    <span class="result-name"><i class="${iconClass}"></i> ${s.platform}</span>
                    ${s.available ? '<span class="status-available">✅</span>' : '<span class="status-taken">❌</span>'}
                </div>`;
            });
            html += `</div></div>`;
        }

        if (alt.availability.domains && alt.availability.domains.length > 0) {
            html += `<div class="availability-sub-section"><h4>Domains</h4><div class="results-list">`;
            alt.availability.domains.forEach(d => {
                const viewButton = `<a href="https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${d.domain}" target="_blank" class="view-link">(View)</a>`;
                html += `<div class="result-item">
                    <span class="result-name"><i class="fas fa-globe"></i> ${d.domain}</span>
                    ${d.available ? '<span class="status-available">✅</span>' : `<span class="status-taken">❌ ${viewButton}</span>`}
                </div>`;
            });
            html += `</div></div>`;
        }
        
        html += `</div>`;
    });
    html += `</div>`;
    
    availableAlternativesResults.innerHTML = html;
}

async function analyzeName() {
    if (analyzeNameBtn.disabled) return;
    const nameInput = document.getElementById('name-to-analyze');
    const contextInput = document.getElementById('analysis-context');
    const nameToAnalyze = nameInput.value.trim();
    const context = contextInput.value.trim();

    const audienceDesc = document.getElementById('audience-description').value.trim();
    const audienceLoc = document.getElementById('audience-location').value.trim();
    const audienceVals = document.getElementById('audience-values').value.trim();
    if (!nameToAnalyze) {
        showTemporaryPlaceholderError(nameInput, "Please enter a name to analyze.");
        return;
    }
    if (!context) {
        showTemporaryPlaceholderError(contextInput, "Please provide context for the name.");
        return;
    }

    const resultsContainer = document.getElementById('analyzer-results-container');
    resultsContainer.innerHTML = `<div class="loader-container"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
    alternativesGeneratorSection.classList.add('hidden');
    alternativesResultsContainer.innerHTML = '';
    disableButtons();
    try {
        const token = await getUserToken();
        let endpoint = `${BACKEND_URL}/analyze-name`;
        let payload = { name: nameToAnalyze, context: context };

        if (audienceDesc && audienceLoc && audienceVals) {
            endpoint = `${BACKEND_URL}/analyze-persona`;
            payload = {
                name: nameToAnalyze,
                context: context,
                audience: audienceDesc,
                location: audienceLoc,
                values: audienceVals
            };
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "An error occurred during analysis.");
        }
        
        const data = await response.json();
        if (data.credits !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.credits);
        }
        
        if (endpoint.includes('persona')) {
            renderPersonaAnalysisResults(data.analysis);
        } else {
            renderAnalysisResults(data.analysis);
        }
        
        alternativesGeneratorSection.classList.remove('hidden');
    } catch (error) {
        resultsContainer.innerHTML = `<div class="error" style="text-align: center;">Error: ${error.message}</div>`;
    } finally {
        let countdown = 5;
        if(analyzeNameBtn) analyzeNameBtn.textContent = `Please wait ${countdown}s...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                if(analyzeNameBtn) analyzeNameBtn.textContent = `Please wait ${countdown}s...`;
            } else { 
                clearInterval(interval); 
              
                 if(analyzeNameBtn) analyzeNameBtn.textContent = '🔬 Analyze Name'; 
                enableButtons(); 
            }
        }, 1000);
    }
}

async function generateAlternatives() {
    if (generateAlternativesBtn.disabled) return;
    const nameInput = document.getElementById('name-to-analyze');
    const contextInput = document.getElementById('analysis-context');
    const nameToAnalyze = nameInput.value.trim();
    const context = contextInput.value.trim();

    const audienceDesc = document.getElementById('audience-description').value.trim();
    const audienceLoc = document.getElementById('audience-location').value.trim();
    const audienceVals = document.getElementById('audience-values').value.trim();
    if (!nameToAnalyze || !context) {
        alert("Please ensure the original name and context are filled out before generating alternatives.");
        return;
    }

    showLoading(alternativesResultsContainer);
    disableButtons();

    try {
        const token = await getUserToken();
        const payload = {
            name: nameToAnalyze,
            context: context,
            audience: audienceDesc,
            location: audienceLoc,
            values: audienceVals
        };
        const response = await fetch(`${BACKEND_URL}/generate-alternatives`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "An error occurred.");
        }

        const data = await response.json();
        if (data.credits !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.credits);
        }
        
        renderScoredAlternatives(data.alternatives);
    } catch (error) {
        alternativesResultsContainer.innerHTML = `<div class="error" style="text-align: center;">Error: ${error.message}</div>`;
    } finally {
        let countdown = 5;
        if(generateAlternativesBtn) generateAlternativesBtn.textContent = `Please wait ${countdown}s...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                if(generateAlternativesBtn) generateAlternativesBtn.textContent = `Please wait ${countdown}s...`;
            } else { 
                clearInterval(interval); 
              
                 if(generateAlternativesBtn) generateAlternativesBtn.textContent = '🧠 Generate Better Alternatives'; 
                enableButtons(); 
            }
        }, 1000);
    }
}


function renderAnalysisResults(data) {
    const resultsContainer = document.getElementById('analyzer-results-container');
    let riskClass = '';
    if (data.conflict_risk === 'Clear') riskClass = 'risk-clear';
    if (data.conflict_risk === 'Medium Risk') riskClass = 'risk-medium';
    if (data.conflict_risk === 'High Risk') riskClass = 'risk-high';

    let alternativesHtml = '';
    if (data.alternative_names) {
        alternativesHtml = `
            <div class="analysis-section">
                <h4>Alternative Suggestions</h4>
                <ul>
                    ${data.alternative_names.map(item => `<li><strong>${item.name}:</strong> ${item.reason}</li>`).join('')}
                </ul>
   
             </div>
        `;
    }

    let creativeAuditHtml = '';
    if (data.creative_analysis) {
        creativeAuditHtml = `
            <div class="analysis-section">
                <h4>Creative Audit</h4>
                <ul>
                    ${Object.keys(data.creative_analysis).map(key => `<li><strong>${key}:</strong> ${data.creative_analysis[key]}</li>`).join('')}
           
             </ul>
            </div>
        `;
    }

    let tipsHtml = '';
    if (data.improvement_tips) {
        tipsHtml = `
            <div class="analysis-section">
                <h4>Improvement Tips</h4>
                <ul>
                    ${data.improvement_tips.map(tip => `<li>${tip}</li>`).join('')}
            
             </ul>
            </div>
        `;
    }

    resultsContainer.innerHTML = `
        <div class="analysis-report">
            <h3>
                Conflict Risk: 
                <span class="risk-badge ${riskClass}">${data.conflict_risk}</span>
            </h3>
            <p>${data.conflict_explanation}</p>
            ${alternativesHtml}
 
             ${creativeAuditHtml}
            ${tipsHtml}
        </div>
    `;
}

function renderPersonaAnalysisResults(data) {
    const resultsContainer = document.getElementById('analyzer-results-container');
    const createMetricCard = (title, score, explanation) => `
        <div class="persona-metric-card">
            <div class="metric-header">
                <h4>${title}</h4>
                <span class="metric-score">${score}/10</span>
            </div>
            <p>${explanation}</p>
        </div>
    `;
    resultsContainer.innerHTML = `
        <div class="persona-analysis-report">
            <div class="persona-summary-card">
                <h3>Overall Persona Score</h3>
                <div class="overall-score-display">${data.overall_score}<small>/10</small></div>
                <p><strong>Final Recommendation:</strong> ${data.final_recommendation}</p>
            </div>
           
             ${createMetricCard('Linguistic & Phonetic Appeal', data.linguistic_appeal.score, data.linguistic_appeal.explanation)}
            ${createMetricCard('Cultural Resonance', data.cultural_resonance.score, data.cultural_resonance.explanation)}
            ${createMetricCard('Market Fitness', data.market_fitness.score, data.market_fitness.explanation)}
            ${createMetricCard('Emotional Connection', data.emotional_connection.score, data.emotional_connection.explanation)}
            ${createMetricCard('Brand Story Potential', data.brand_story_potential.score, data.brand_story_potential.explanation)}
        </div>
    `;
}

function renderScoredAlternatives(alternatives) {
    let namesHtml = '';
    let reasonsHtml = '';
    alternatives.forEach(alt => {
        namesHtml += `
            <div class="alternative-item">
                <span class="alternative-name">${alt.name}</span>
                <span class="alternative-score">${alt.score}/10</span>
            </div>
        `;
        reasonsHtml += `<p><strong>${alt.name}:</strong> ${alt.reason}</p>`;
    });
    alternativesResultsContainer.innerHTML = `
        <div class="output-section" style="margin-top: 20px;">
            <div class="output-box">
                <div class="output-header"><label>Better Alternatives</label></div>
                <div class="alternatives-list">${namesHtml}</div>
            </div>
            <div class="output-box">
              
               <div class="output-header"><label>Justifications</label></div>
                <div class="alternatives-reasons">${reasonsHtml}</div>
            </div>
        </div>
    `;
}


function openHistoryImportModal(targetInputId) {
    if (historyImportModal) {
        historyImportModal.dataset.targetInput = targetInputId;
        historyImportModal.classList.add('active');
        fetchHistoryForImport();
    }
}

function closeHistoryImportModal() {
    if (historyImportModal) historyImportModal.classList.remove('active');
}

async function fetchHistoryForImport() {
    if (!historyImportList) return;
    historyImportList.innerHTML = `<div class="loader-container"><div class="loading-dots"><span></span><span></span><span></span></div></div>`;
    const token = await getUserToken();
    if (!token) {
        historyImportList.innerHTML = "<p>*Sign in to see your history.*</p>";
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/history`, { headers: { "Authorization": `Bearer ${token}` } });
        if (!response.ok) throw new Error("Could not load history.");
        const history = await response.json();

        historyImportList.innerHTML = "";
        if (history.length === 0) {
            historyImportList.innerHTML = "<p>*No history yet. Generate some names!*</p>";
            return;
        }

        history.forEach(entry => {
            entry.names.forEach(name => {
                const nameButton = document.createElement('button');
                nameButton.className = 'history-item';
                nameButton.textContent = cleanNames(name);
                nameButton.onclick = () => 
                {
                    const targetInputId = historyImportModal.dataset.targetInput;
                    const targetInput = document.getElementById(targetInputId);
                    if (targetInput) {
                        targetInput.value = cleanNames(name);
      
                     }
                    closeHistoryImportModal();
                };
                historyImportList.appendChild(nameButton);
            });
        });
    } catch (error) {
        historyImportList.innerHTML = `<p>*${error.message}*</p>`;
    }
}

function showProfessionalLoadingPlaceholder(targetElement, minHeight = '150px') {
    if (!targetElement) return;
    let loadingHtml = `
        <div class="output-section">
            <div class="output-box alternative-result-card loading-placeholder" style="min-height: ${minHeight}; width: 100%;">
                <div class="loader-container"><div class="loading-dots"><span></span><span></span><span></span></div></div>
            </div>
        </div>
    `;
    targetElement.innerHTML = loadingHtml;
}
async function summarizeText() {
    if (summarizeBtn.disabled) return;
    const textInput = document.getElementById('text-to-summarize');
    const lengthSelect = document.getElementById('summary-length');
    const toneSelect = document.getElementById('summary-tone'); // New: Get tone dropdown
    const text = textInput.value.trim();
    if (!text) {
        showTemporaryPlaceholderError(textInput, "Please enter some text to summarize.");
        return;
    }

    document.getElementById("error").textContent = "";
    if(summaryResultsContainer) summaryResultsContainer.classList.add("hidden");
    
    if(summarizerLoadingPlaceholder) {
        showProfessionalLoadingPlaceholder(summarizerLoadingPlaceholder, '100px');
        summarizerLoadingPlaceholder.classList.remove("hidden");
    }
    disableButtons();

    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/summarize`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            // New: Pass both length and tone to the backend
            body: JSON.stringify({ text: text, length: lengthSelect.value, tone: toneSelect.value })
        });
        if (!response.ok) throw new Error((await response.json()).detail || `A server error occurred.`);
        const data = await response.json();
        if (window.auth.currentUser && data.credits !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.credits);
        }

        if(summaryOutput) {
            summaryResultsContainer.classList.remove("hidden");
            summaryOutput.textContent = data.summary;
            summaryOutput.classList.add("fade-in-content");
        }
        
        summaryHistoryLog.unshift({ text: text, summary: data.summary });
        summaryHistoryLog = summaryHistoryLog.slice(0, 50);
        renderSummaryHistory();
        if(summaryHistorySection) summaryHistorySection.classList.remove("hidden");

    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        if(summaryResultsContainer) summaryResultsContainer.classList.add("hidden");
    } finally {
        if(summarizerLoadingPlaceholder) summarizerLoadingPlaceholder.classList.add("hidden");
        let countdown = 5;
        if(summarizeBtn) summarizeBtn.textContent = `Please wait ${countdown}s...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                if(summarizeBtn) summarizeBtn.textContent = `Please wait ${countdown}s...`;
            } else { 
                clearInterval(interval); 
                if(summarizeBtn) summarizeBtn.textContent = '📝 Summarize Text'; 
                enableButtons(); 
            }
        }, 1000);
    }
}



async function combineWords() {
    if (combineWordsBtn.disabled) return;
    const wordsInput = document.getElementById('words-to-combine');
    const lengthSelect = document.getElementById('combiner-length');
    const words = wordsInput.value.trim();

    if (!words) {
        showTemporaryPlaceholderError(wordsInput, "Please enter words to combine.");
        return;
    }

    document.getElementById("error").textContent = "";
    if(combinerResultsContainer) combinerResultsContainer.classList.add("hidden");
    if(combinerLoadingPlaceholder) {
        showProfessionalLoadingPlaceholder(combinerLoadingPlaceholder, '100px');
        combinerLoadingPlaceholder.classList.remove("hidden");
    }
    disableButtons();
    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/combine-words`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify({ words: words, length: lengthSelect.value })
        });
        if (!response.ok) throw new Error((await response.json()).detail || `A server error occurred.`);
        const data = await response.json();
        if (window.auth.currentUser && data.credits !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.credits);
        }

        // Updated to handle both the word and the explanation
        if(combinerOutput && combinerExplanation) {
            combinerResultsContainer.classList.remove("hidden");
            combinerOutput.textContent = data.combined_word;
            combinerExplanation.textContent = data.explanation; // Set the explanation text
            combinerOutput.classList.add("fade-in-content");
            combinerExplanation.classList.add("fade-in-content"); // Animate the explanation
        }

        // Add the explanation to the history log
        combinerHistoryLog.unshift({ words: words, result: data.combined_word, explanation: data.explanation });
        combinerHistoryLog = combinerHistoryLog.slice(0, 50);
        renderCombinerHistory();
        if(combinerHistorySection) combinerHistorySection.classList.remove("hidden");

    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        if(combinerResultsContainer) combinerResultsContainer.classList.add("hidden");
    } finally {
        if(combinerLoadingPlaceholder) combinerLoadingPlaceholder.classList.add("hidden");
        let countdown = 5;
        if(combineWordsBtn) combineWordsBtn.textContent = `Please wait ${countdown}s...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                if(combineWordsBtn) combineWordsBtn.textContent = `Please wait ${countdown}s...`;
            } else { 
                clearInterval(interval); 
                if(combineWordsBtn) combineWordsBtn.textContent = '✨ Combine Words'; 
                enableButtons(); 
            }
        }, 1000);
    }
}

function renderSummaryHistory() {
    if (!summaryHistoryDiv) return;
    summaryHistoryDiv.innerHTML = "";
    if (summaryHistoryLog.length === 0) {
        summaryHistoryDiv.innerHTML = "<p>*No summaries yet.*</p>";
        return;
    }

    summaryHistoryLog.forEach(entry => {
        const button = document.createElement('button');
        button.className = 'history-item';
        button.title = `Original Text: ${entry.text.substring(0, 100)}...`;
        button.innerHTML = `<strong>${entry.summary}</strong>`;
        button.onclick = () => {
            const textInput = document.getElementById('text-to-summarize');
            if(textInput) textInput.value = entry.text;
        };
        summaryHistoryDiv.appendChild(button);
    });
}

function renderCombinerHistory() {
    if (!combinerHistoryDiv) return;
    combinerHistoryDiv.innerHTML = "";
    if (combinerHistoryLog.length === 0) {
        combinerHistoryDiv.innerHTML = "<p>*No combinations yet.*</p>";
        return;
    }

    combinerHistoryLog.forEach(entry => {
        const button = document.createElement('button');
        button.className = 'history-item';
        // Updated to include the explanation in the tooltip
        button.title = `Original Words: ${entry.words}\n\nExplanation: ${entry.explanation || 'N/A'}`;
        const fromHTML = `<small class="pre-refined-history">from: ${entry.words}</small>`;
        button.innerHTML = `<strong>${entry.result}</strong>${fromHTML}`;
        button.onclick = () => {
             const wordsInput = document.getElementById('words-to-combine');
            if(wordsInput) wordsInput.value = entry.words;
        };
        combinerHistoryDiv.appendChild(button);
    });
}

function initializeSettings() {
    const settings = {
        theme: localStorage.getItem('nameit-theme') || 'synthwave',
        font: localStorage.getItem('nameit-font') || "'Roboto', sans-serif",
        fontSize: localStorage.getItem('nameit-fontSize') || '100',
        resultsFont: localStorage.getItem('nameit-results-font') || "'Roboto', sans-serif",
        resultsFontSize: localStorage.getItem('nameit-results-fontSize') || '100',
        animations: localStorage.getItem('nameit-animations') !== 'false',
        background: localStorage.getItem('nameit-background') || 'pattern1'
    };
    if (themeSelect) themeSelect.value = settings.theme;
    if (fontSelect) fontSelect.value = settings.font;
    if (fontSizeSlider) fontSizeSlider.value = settings.fontSize;
    if (resultsFontSelect) resultsFontSelect.value = settings.resultsFont;
    if (resultsFontSizeSlider) resultsFontSizeSlider.value = settings.resultsFontSize;
    if (animationsToggle) animationsToggle.checked = settings.animations;
    if (backgroundSelect) backgroundSelect.value = settings.background;

    applyTheme(settings.theme, false);
    applyFont(settings.font, false);
    applyFontSize(settings.fontSize, false);
    applyResultsFont(settings.resultsFont, false);
    applyResultsFontSize(settings.resultsFontSize, false);
    applyBackground(settings.background, false);
    applyAnimationSetting(settings.animations, false);
}

function handleHashChange() {
    const hash = window.location.hash;
    if (hash === '#terms') {
        showView('terms');
    } else if (hash === '#privacy') {
        showView('privacy');
    }
}

window.addEventListener('hashchange', handleHashChange);

function applyBackground(patternName, save = true) {
    if (save) localStorage.setItem('nameit-background', patternName);

    const patternElement = document.querySelector('.background-pattern');
    const animationLayer = document.getElementById('animation-layer');
    if (!patternElement || !animationLayer) return;

    // Set the static background image
    patternElement.style.backgroundImage = `url('background-patterns/${patternName}.png')`;
    
    // Clear previous animations AND any running timers
    animationLayer.innerHTML = '';
    if (animationLayer.timerId) {
        clearTimeout(animationLayer.timerId); // Use clearTimeout for our new recursive timer
        animationLayer.timerId = null;
    }
     if (animationLayer.circleTimerId) { // Also clear the circle timer if it exists
        clearInterval(animationLayer.circleTimerId);
        animationLayer.circleTimerId = null;
    }

    // Generate new animation layer based on selection
    const animationType = BACKGROUND_ANIMATIONS[patternName];

    let htmlToSet = '';

    // Helper for Drifting Circle
    const createRandomCircle = () => {
        animationLayer.innerHTML = '';
        const colors = ['var(--line-accent-glow)', 'var(--primary-accent)', 'var(--line-accent-default)'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 300 + 400; 
        const circle = document.createElement('div');
        circle.className = 'drifting-circle';
        circle.style.cssText = `...`; // Style definition omitted for brevity as it's unchanged
        animationLayer.appendChild(circle);
    };

    // Helper for Random Flicker
    const createRandomFlicker = () => {
        const colors = ['var(--line-accent-glow)', 'var(--primary-accent)', 'var(--line-accent-default)', '#ffffff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const baseSize = 400; // Average size of the balls
        const flickerSize = baseSize * 1.5 + Math.random() * 200; // 1.5x bigger + some variance
        
        const spot = document.createElement('div');
        spot.className = 'flicker-spot';
        spot.style.cssText = `
            width: ${flickerSize}px; height: ${flickerSize}px;
            top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;
            background-color: ${randomColor};
        `;
        
        animationLayer.appendChild(spot);

        // Remove the spot after its animation finishes
        setTimeout(() => {
            if (spot.parentElement) {
                spot.remove();
            }
        }, 500); // 500ms matches the animation duration

        // Set up the next flicker
        const nextFlickerDelay = Math.random() * 2500 + 500; // Random delay from 0.5s to 3s
        animationLayer.timerId = setTimeout(createRandomFlicker, nextFlickerDelay);
    };

    switch (animationType) {
        case 'default':
            htmlToSet = `<div class="sweep-bar left"></div><div class="sweep-bar right"></div>`;
            break;
        case 'circles':
            createRandomCircle();
            animationLayer.circleTimerId = setInterval(createRandomCircle, 10000);
            break;
        case 'sliding-bar':
            htmlToSet = `<div class="sliding-bar" style="animation-delay: -${Math.random() * 12}s;"></div>`;
            break;
        case 'color-shift':
            htmlToSet = `<div class="color-shift-bg"></div>`;
            break;
        case 'color-shifting-bar':
            htmlToSet = `<div class="color-shifting-bar"></div>`;
            break;
        case 'random-flicker':
            createRandomFlicker(); // Start the flicker loop
            break;
        case 'vertical-crossing-bars':
            htmlToSet = `<div class="vertical-crossing-bar top"></div><div class="vertical-crossing-bar bottom"></div>`;
            break;
    }
    
    // Set HTML for non-timer-based animations
    if (animationType !== 'circles' && animationType !== 'random-flicker') {
        animationLayer.innerHTML = htmlToSet;
    }
}


function applyAnimationSetting(enabled, save = true) {
    if (save) localStorage.setItem('nameit-animations', enabled);
    
    const showcaseContainer = document.querySelector('.showcase-container');
    const animationLayer = document.getElementById('animation-layer');

    if (enabled) {
        document.body.classList.remove('animations-disabled');
        if (showcaseContainer) showcaseContainer.style.display = 'flex';
        if (animationLayer) animationLayer.style.display = 'block';
    } else {
        document.body.classList.add('animations-disabled');
        if (showcaseContainer) showcaseContainer.style.display = 'none';
        if (animationLayer) animationLayer.style.display = 'none';
    }
}


function applyTheme(theme, save = true) {
    if (save) localStorage.setItem('nameit-theme', theme);
    document.body.dataset.theme = theme;
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

function applyFont(font, save = true) {
    if (save) localStorage.setItem('nameit-font', font);
    document.body.style.fontFamily = font;
}

function applyFontSize(size, save = true) {
    if (save) localStorage.setItem('nameit-fontSize', size);
    document.body.style.fontSize = `${size}%`;
}

function applyResultsFont(font, save = true) {
    if (save) localStorage.setItem('nameit-results-font', font);
    document.documentElement.style.setProperty('--results-font-family', font);
}

function applyResultsFontSize(size, save = true) {
    if (save) localStorage.setItem('nameit-results-fontSize', size);
    document.documentElement.style.setProperty('--results-font-size', `${size}%`);
}

function applyAnimationSetting(enabled, save = true) {
    if (save) localStorage.setItem('nameit-animations', enabled);
    
    const showcaseContainer = document.querySelector('.showcase-container');
    const backgroundContainer = document.getElementById('background-container');

    if (enabled) {
        document.body.classList.remove('animations-disabled');
        if (showcaseContainer) showcaseContainer.style.display = 'flex';
        if (backgroundContainer) backgroundContainer.style.display = 'block';
    } else {
        document.body.classList.add('animations-disabled');
        if (showcaseContainer) showcaseContainer.style.display = 'none';
        if (backgroundContainer) backgroundContainer.style.display = 'none';
    }
}

async function exportHistory() {
    const token = await getUserToken();
    if (!token) {
        alert("You must be signed in to export history.");
        return;
    }
    const historyData = await fetch(`${BACKEND_URL}/history`, { headers: { "Authorization": `Bearer ${token}` } }).then(res => res.json());
    const blob = new Blob([JSON.stringify(historyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nameit_history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function clearHistory() {
    if (!confirm("Are you sure you want to permanently delete your entire history? This action cannot be undone.")) {
        return;
    }
    const token = await getUserToken();
    if (!token) {
        alert("You must be signed in to clear history.");
        return;
    }
    try {
        const response = await fetch(`${BACKEND_URL}/clear-history`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to clear history.");
        
        if(recentHistoryDiv) recentHistoryDiv.innerHTML = "<p>*No history yet. Generate some names!*</p>";
        alert("Your history has been cleared.");

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function sendPasswordReset() {
    const user = window.auth.currentUser;
    if (user && user.email) {
        window.auth.sendPasswordResetEmail(user.email)
            .then(() => {
                alert(`A password reset link has been sent to ${user.email}.`);
            })
            .catch((error) => {
                alert(`Error: ${error.message}`);
       
             });
    } else {
        alert("You must be signed in with an email account to reset your password.");
    }
}

function handleDropdownExclusivity(changedList, otherList, otherBtn) {
    const isAnyChecked = changedList.querySelector('input[type="checkbox"]:checked');
    const otherCheckboxes = otherList.querySelectorAll('input[type="checkbox"]');
    const otherListContent = otherBtn.nextElementSibling;
    const availableAlternativesSection = document.getElementById('available-alternatives-section');

    if (isAnyChecked) {
        otherBtn.disabled = true;
        otherListContent.classList.add('disabled');
        otherCheckboxes.forEach(box => {
            box.disabled = true;
            box.checked = false;
        });
        updateDropdownButtonText(otherBtn, otherList, otherBtn.id.includes('domain') ? 'Domains' : 'Platforms');
    } else {
        otherBtn.disabled = false;
        otherListContent.classList.remove('disabled');
        otherCheckboxes.forEach(box => box.disabled = false);
    }
    
    if (availableAlternativesSection) availableAlternativesSection.classList.add('hidden');
}

function showAlternativesLoadingPlaceholder(targetElement) {
    if (!targetElement) return;
    let loadingHtml = `
        <div class="output-section alternatives-report">
            <div class="output-box alternative-result-card loading-placeholder">
                <div class="loader-container"><div class="loading-dots"><span></span><span></span><span></span></div></div>
            </div>
            <div class="output-box alternative-result-card loading-placeholder">
                <div class="loader-container"><div class="loading-dots"><span></span><span></span><span></span></div></div>
            </div>
            <div class="output-box alternative-result-card loading-placeholder">
                <div class="loader-container"><div class="loading-dots"><span></span><span></span><span></span></div></div>
            </div>
        </div>
    `;
    targetElement.innerHTML = loadingHtml;
}

















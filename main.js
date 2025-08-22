const BACKEND_URL = "https://nameit-backend-2.vercel.app";

const CATEGORY_OPTIONS = ["Auto (AI Decides)", "App", "Book", "Brand", "Company", "Course", "Drawing", "Event", "Game", "New Word", "Object", "Pet", "Place", "Platform", "Podcast", "Product", "Random", "Service", "Song", "Startup", "Tool", "Trend", "Video", "Website"];
const STYLE_OPTIONS = ["Auto (AI Decides)", "Random", "Professional", "Creative", "Modern", "Minimal", "Powerful", "Elegant", "Luxury", "Catchy", "Playful", "Bold", "Futuristic", "Mysterious", "Artistic", "Fantasy", "Mythical", "Retro", "Cute", "Funny", "Classy"];
const PATTERN_OPTIONS = ["Auto (AI Decides)", "One Word", "Two Words", "Invented Word", "Real Word", "Short & Punchy", "Long & Evocative"];
const CHECKABLE_OPTIONS = {
    "Behance":      { type: "platform", value: "Behance", icon: "fab fa-behance" },
    "Domains (.com, .io, .ai, .app)":  { type: "domain_group", value: ["com", "io", "ai", "app"], icon: "fas fa-globe" },
    "Facebook":     { type: "platform", value: "Facebook", icon: "fab fa-facebook" },
    "GitHub":       { type: "platform", value: "GitHub", icon: "fab fa-github" },
    "Instagram":    { type: "platform", value: "Instagram", icon: "fab fa-instagram" },
    "Medium":      { type: "platform", value: "Medium", icon: "fab fa-medium" },
    "Pinterest":    { type: "platform", value: "Pinterest", icon: "fab fa-pinterest" },
    "Reddit":       { type: "platform", value: "Reddit", icon: "fab fa-reddit-alien" },
    "Roblox":       { type: "platform", value: "Roblox", icon: "fas fa-gamepad" },
    "Rumble":       { type: "platform", value: "Rumble", icon: "fas fa-video" },
    "SoundCloud":   { type: "platform", value: "SoundCloud", icon: "fab fa-soundcloud" },
    "Steam":        { type: "platform", value: "Steam", icon: "fab fa-steam" },
    "TikTok":       { type: "platform", value: "TikTok", icon: "fab fa-tiktok" },
    "Twitch":       { type: "platform", value: "Twitch", icon: "fab fa-twitch" },
    "X":            { type: "platform", value: "X", icon: "fab fa-twitter" },
    "YouTube":      { type: "platform", value: "YouTube", icon: "fab fa-youtube" }
};
let customRefineHistoryLog = [];

// --- DOM Element Selectors ---
const mainGeneratorView = document.getElementById("main-generator-view");
const customRefinerView = document.getElementById("custom-refiner-view");
const availabilityCheckerView = document.getElementById("availability-checker-view");
const nameAnalyzerView = document.getElementById("name-analyzer-view");
const settingsView = document.getElementById("settings-view");
const outputContainer = document.getElementById("output_container");
const refineSection = document.getElementById("refine_section");
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
const platformsDropdownBtn = document.getElementById("platforms-dropdown-btn");
const platformsDropdownList = document.getElementById("platforms-dropdown-list");

// --- Settings Page Selectors ---
const themeSelect = document.getElementById('theme-select');
const fontSelect = document.getElementById('font-select');
const fontSizeSlider = document.getElementById('font-size-slider');
const outputFontSelect = document.getElementById('output-font-select');
const outputFontSizeSlider = document.getElementById('output-font-size-slider');
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
    
    initializeUI();
    initializeSettings();
    populateDropdown("category", CATEGORY_OPTIONS);
    populateDropdown("style", STYLE_OPTIONS);
    populateDropdown("pattern", PATTERN_OPTIONS);
    
    setupEventListeners();
    initializeSliders();
    initializePlatformsDropdown();
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

    // Settings event listeners
    if (themeSelect) themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));
    if (fontSelect) fontSelect.addEventListener('change', (e) => applyFont(e.target.value));
    if (fontSizeSlider) fontSizeSlider.addEventListener('input', (e) => applyFontSize(e.target.value));
    if (outputFontSelect) outputFontSelect.addEventListener('change', (e) => applyOutputFont(e.target.value));
    if (outputFontSizeSlider) outputFontSizeSlider.addEventListener('input', (e) => applyOutputFontSize(e.target.value));
    if (animationsToggle) animationsToggle.addEventListener('change', (e) => applyAnimationSetting(e.target.checked));
    if (exportHistoryBtn) exportHistoryBtn.addEventListener('click', exportHistory);
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);
    if (changePasswordBtn) changePasswordBtn.addEventListener('click', sendPasswordReset);


    setTimeout(() => {
        const homeLink = document.getElementById('home-link');
        const customRefineLink = document.getElementById('custom-refine-link');
        const availabilityCheckLink = document.getElementById('availability-check-link');
        const nameAnalyzerLink = document.getElementById('name-analyzer-link');
        const settingsLink = document.getElementById('settings-link');

        if (homeLink) homeLink.addEventListener('click', (e) => { e.preventDefault(); showView('generator'); if (window.isSidebarOpen) toggleSidebar(); });
        if (customRefineLink) customRefineLink.addEventListener('click', (e) => { e.preventDefault(); showView('refiner'); if (window.isSidebarOpen) toggleSidebar(); });
        if (availabilityCheckLink) availabilityCheckLink.addEventListener('click', (e) => { e.preventDefault(); showView('availability-checker'); if (window.isSidebarOpen) toggleSidebar(); });
        if (nameAnalyzerLink) nameAnalyzerLink.addEventListener('click', (e) => { e.preventDefault(); showView('name-analyzer'); if (window.isSidebarOpen) toggleSidebar(); });
        if (settingsLink) settingsLink.addEventListener('click', (e) => { e.preventDefault(); showView('settings'); if (window.isSidebarOpen) toggleSidebar(); });
    }, 500);
}

function initializeSliders() {
    const sliders = [
        { id: 'generator-relevancy', labelsId: 'generator-relevancy-labels' },
        { id: 'refiner-relevancy', labelsId: 'refiner-relevancy-labels' },
        { id: 'generator-amount', labelsId: 'generator-amount-labels' },
        { id: 'refiner-amount', labelsId: 'refiner-amount-labels' }
    ];
    sliders.forEach(sliderInfo => {
        const slider = document.getElementById(sliderInfo.id);
        const labelsContainer = document.getElementById(sliderInfo.labelsId);

        if (slider && labelsContainer) {
            const labels = labelsContainer.querySelectorAll('span');
            const updateValue = () => {
                labels.forEach(label => label.classList.remove('active'));
                if (labels[slider.value - 1]) {
                    labels[slider.value - 1].classList.add('active');
                }
            };
            slider.addEventListener('input', updateValue);
            updateValue();
        }
    });
}

function showView(viewName) {
    if(mainGeneratorView) mainGeneratorView.classList.add('hidden');
    if(customRefinerView) customRefinerView.classList.add('hidden');
    if(availabilityCheckerView) availabilityCheckerView.classList.add('hidden');
    if(nameAnalyzerView) nameAnalyzerView.classList.add('hidden');
    if(settingsView) settingsView.classList.add('hidden');
    
    resetDynamicSections(false);
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
    [generateBtn, surpriseBtn, refineBtn, customRefineBtn, checkAvailabilityBtn, analyzeNameBtn].forEach(btn => { if(btn) btn.disabled = true; });
}

function enableButtons() {
    [generateBtn, surpriseBtn, refineBtn, customRefineBtn, checkAvailabilityBtn, analyzeNameBtn].forEach(btn => { if(btn) btn.disabled = false; });
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
        await window.auth.currentUser.reload();
        return await window.auth.currentUser.getIdToken(true);
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
    moreLikeThisSection.classList.remove('hidden');
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
                moreLikeThisSection.classList.add('hidden');
            }
        });
    };
    tag.appendChild(removeBtn);
    container.appendChild(tag);
}

async function generateName(force = false) {
    if (generateBtn.disabled && !force) return;
    if (!window.auth.currentUser && parseInt(localStorage.getItem('anonGenerations') || '0') >= 10) {
        document.getElementById("error").textContent = "You have used all 10 free generations. Please sign up to continue.";
        if (typeof openSignUpModal === 'function') openSignUpModal();
        return;
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
        amount: document.getElementById("generator-amount").value
    };
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
            let anonGenerations = parseInt(localStorage.getItem('anonGenerations') || '0') + 1;
            localStorage.setItem('anonGenerations', anonGenerations);
            if (window.updateGenerationCountUI) window.updateGenerationCountUI(Math.max(0, 10 - anonGenerations), 10);
        } else if (data.generationsLeft !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.generationsLeft, 100);
        }

        renderClickableNames(data.names.map(cleanNames));
        if(reasonsPre) reasonsPre.textContent = data.reasons.map(cleanNames).join("\n\n");
        if(namesPre) namesPre.classList.add("fade-in-content");
        if(reasonsPre) reasonsPre.classList.add("fade-in-content");
        if (window.auth.currentUser && window.auth.currentUser.emailVerified) {
            if(refineSection) refineSection.classList.remove("hidden");
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
        if (window.auth.currentUser && data.generationsLeft !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.generationsLeft, 100);
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
    if(moreLikeThisSection) moreLikeThisSection.classList.add('hidden');
    
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
        if (window.auth.currentUser && data.generationsLeft !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.generationsLeft, 100);
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
            if(nameInput) nameInput.value = entry.originalName

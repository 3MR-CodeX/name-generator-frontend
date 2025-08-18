const BACKEND_URL = "https://nameit-backend-2.vercel.app";

const CATEGORY_OPTIONS = ["Auto (AI Decides)", "App", "Book", "Brand", "Company", "Course", "Drawing", "Event", "Game", "New Word", "Object", "Pet", "Place", "Platform", "Podcast", "Product", "Random", "Service", "Song", "Startup", "Tool", "Trend", "Video", "Website"];
const STYLE_OPTIONS = ["Auto (AI Decides)", "Random", "Professional", "Creative", "Modern", "Minimal", "Powerful", "Elegant", "Luxury", "Catchy", "Playful", "Bold", "Futuristic", "Mysterious", "Artistic", "Fantasy", "Mythical", "Retro", "Cute", "Funny", "Classy"];
const PATTERN_OPTIONS = ["Auto (AI Decides)", "One Word", "Two Words", "Invented Word", "Real Word", "Short & Punchy", "Long & Evocative"];

// --- Global State ---
let customRefineHistoryLog = []; // For custom refine history

// --- DOM Element Selectors ---
const mainGeneratorView = document.getElementById("main-generator-view");
const customRefinerView = document.getElementById("custom-refiner-view");
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
const historyModal = document.getElementById("history-modal");
const closeButtonHistoryModal = document.querySelector("#history-modal .close-button");
const fullHistoryList = document.getElementById("full-history-list");
const historyDetailsModal = document.getElementById("history-details-modal");
const closeButtonDetailsModal = document.querySelector("#history-details-modal .close-button");
const detailsContent = document.getElementById("details-content");
const recentHistorySection = document.getElementById("history_section");
const recentHistoryDiv = document.getElementById("history");
const customRefineHistorySection = document.getElementById("custom-refine-history-section");
const customRefineHistoryDiv = document.getElementById("custom-refine-history");


document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent('top-bar-placeholder', 'components/topbar.html');
    await loadComponent('sidebar-placeholder', 'components/sidebar.html');
    
    if (typeof initializeTopbar === 'function') initializeTopbar();
    if (typeof initializeSidebar === 'function') initializeSidebar();
    if (typeof initializeAuth === 'function') initializeAuth();
    
    initializeUI();
    populateDropdown("category", CATEGORY_OPTIONS);
    populateDropdown("style", STYLE_OPTIONS);
    populateDropdown("pattern", PATTERN_OPTIONS);
    
    setupEventListeners();
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
    if (!promptInput.dataset.originalPlaceholder) promptInput.dataset.originalPlaceholder = promptInput.placeholder;
    if (!editBox.dataset.originalPlaceholder) editBox.dataset.originalPlaceholder = editBox.placeholder;
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
    if(refineBtn) {
        refineBtn.onclick = () => {
            const instruction = editBox.value.trim();
            if (instruction) refineNames('freestyle', null, instruction);
            else showTemporaryPlaceholderError(editBox, "Please enter a refine instruction.");
        };
    }
    if (customRefineBtn) customRefineBtn.onclick = customRefineName;

    setTimeout(() => {
        const homeLink = document.getElementById('home-link');
        const customRefineLink = document.getElementById('custom-refine-link');
        if (homeLink) homeLink.addEventListener('click', (e) => { e.preventDefault(); showView('generator'); if (window.isSidebarOpen) toggleSidebar(); });
        if (customRefineLink) customRefineLink.addEventListener('click', (e) => { e.preventDefault(); showView('refiner'); if (window.isSidebarOpen) toggleSidebar(); });
    }, 500);
}

function showView(viewName) {
    mainGeneratorView.classList.add('hidden');
    customRefinerView.classList.add('hidden');
    resetDynamicSections(false);

    if (viewName === 'generator') {
        mainGeneratorView.classList.remove('hidden');
    } else if (viewName === 'refiner') {
        customRefinerView.classList.remove('hidden');
        // Hide the standard refine section on this page
        refineSection.classList.add('hidden');
        if(refineBtn) refineBtn.classList.add('hidden');
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

// Updated loading function for professional animation
function showLoading(targetElement, isCustomRefine = false) {
    targetElement.innerHTML = ''; // Clear previous content
    targetElement.classList.remove("fade-in-content");
    if (isCustomRefine) {
        targetElement.classList.add("loading-active");
    } else {
        // Fallback for original spinner
        let spinnerOverlay = document.createElement("div");
        spinnerOverlay.className = "spinner-overlay show";
        spinnerOverlay.innerHTML = '<div class="spinner"></div>';
        targetElement.appendChild(spinnerOverlay);
    }
}

function hideLoading(targetElement) {
    targetElement.classList.remove("loading-active");
    const spinnerOverlay = targetElement.querySelector(".spinner-overlay");
    if (spinnerOverlay) spinnerOverlay.remove();
}

function disableButtons() {
    [generateBtn, surpriseBtn, refineBtn, customRefineBtn].forEach(btn => { if(btn) btn.disabled = true; });
}

function enableButtons() {
    [generateBtn, surpriseBtn, refineBtn, customRefineBtn].forEach(btn => { if(btn) btn.disabled = false; });
}

function showTemporaryPlaceholderError(element, message) {
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
    targetPre.innerHTML = '';
    if(targetPre.classList.contains('clickable')) targetPre.classList.remove('clickable');

    namesArray.forEach(name => {
        const nameEl = document.createElement('div');
        nameEl.className = 'generated-name';
        nameEl.textContent = name;
        if (targetPre === namesPre) { // Only add seed functionality to main generator
            targetPre.classList.add('clickable');
            nameEl.addEventListener('click', () => addSeedName(name));
        }
        targetPre.appendChild(nameEl);
    });
}

function addSeedName(name) {
    const moreLikeThisSection = document.getElementById("more-like-this-section");
    const container = document.getElementById("more-like-this-container");
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
        seed_names 
    };
    
    outputContainer.classList.remove("hidden");
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
        reasonsPre.textContent = data.reasons.map(cleanNames).join("\n\n");
        namesPre.classList.add("fade-in-content");
        reasonsPre.classList.add("fade-in-content");

        if (window.auth.currentUser && window.auth.currentUser.emailVerified) {
            refineSection.classList.remove("hidden");
            if(refineBtn) refineBtn.classList.remove("hidden");
        }
        recentHistorySection.classList.remove("hidden");
        fetchHistory(false);
    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        resetDynamicSections();
    } finally {
        hideLoading(namesPre);
        hideLoading(reasonsPre);
        
        let countdown = 5;
        generateBtn.textContent = `Please wait ${countdown}s...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) generateBtn.textContent = `Please wait ${countdown}s...`;
            else { clearInterval(interval); generateBtn.textContent = '🎯 Generate Names'; enableButtons(); }
        }, 1000);
    }
}

async function refineNames(action, names = null, extra_info = "") {
    if (refineBtn.disabled) return;
    document.getElementById("error").textContent = "";
    refinedOutputs.classList.remove("hidden");
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
        
        refinedNamesPre.textContent = data.names.map(cleanNames).join("\n\n");
        refinedReasonsPre.textContent = data.reasons.map(cleanNames).join("\n\n");
        refinedNamesPre.classList.add("fade-in-content");
        refinedReasonsPre.classList.add("fade-in-content");
        fetchHistory(false);
    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        refinedOutputs.classList.add("hidden");
    } finally {
        hideLoading(refinedNamesPre);
        hideLoading(refinedReasonsPre);
        
        let countdown = 5;
        refineBtn.textContent = `Please wait ${countdown}s...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) refineBtn.textContent = `Please wait ${countdown}s...`;
            else { clearInterval(interval); refineBtn.textContent = '🛠️ Refine Suggestions'; enableButtons(); }
        }, 1000);
    }
}

async function surpriseMe() {
    if (surpriseBtn.disabled) return;
    
    document.getElementById("keywords").value = '';
    document.getElementById("more-like-this-container").innerHTML = '';
    document.getElementById("more-like-this-section").classList.add('hidden');
    
    disableButtons();
    promptInput.value = '';
    promptInput.placeholder = 'Conjuring an idea...';

    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/surprise`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
        });
        if (!response.ok) throw new Error((await response.json()).detail || "Failed to get a surprise prompt.");
        const data = await response.json();

        promptInput.value = data.prompt;
        document.getElementById("category").value = data.category;
        document.getElementById("style").value = data.style;
        document.getElementById("language").value = "English";
        document.getElementById("pattern").value = "Auto (AI Decides)";
        await generateName(true);

    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        enableButtons();
        promptInput.placeholder = 'Enter a description!';
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
    refinedOutputs.classList.remove("hidden"); 
    showLoading(refinedNamesPre, true);
    showLoading(refinedReasonsPre, true);
    disableButtons();

    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/custom-refine`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify({ name: nameToRefine, instructions: instructions })
        });

        if (!response.ok) throw new Error((await response.json()).detail || "Unknown error during custom refinement.");
        const data = await response.json();

        if (window.auth.currentUser && data.generationsLeft !== undefined && window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.generationsLeft, 100);
        }
        
        renderClickableNames(data.names.map(cleanNames), refinedNamesPre);
        refinedReasonsPre.textContent = data.reasons.map(cleanNames).join("\n\n");
        refinedNamesPre.classList.add("fade-in-content");
        refinedReasonsPre.classList.add("fade-in-content");

        const historyEntry = { originalName: nameToRefine, instructions, results: data.names };
        customRefineHistoryLog.push(historyEntry);
        customRefineHistoryLog = customRefineHistoryLog.slice(-50);
        renderCustomRefineHistory();
        customRefineHistorySection.classList.remove("hidden");

    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        refinedOutputs.classList.add("hidden");
    } finally {
        hideLoading(refinedNamesPre);
        hideLoading(refinedReasonsPre);
        
        let countdown = 5;
        customRefineBtn.textContent = `Please wait ${countdown}s...`;
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) customRefineBtn.textContent = `Please wait ${countdown}s...`;
            else { clearInterval(interval); customRefineBtn.textContent = '🤖 Refine Name'; enableButtons(); }
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
        const itemDiv = document.createElement('div');
        itemDiv.className = 'custom-history-item';

        const originalP = document.createElement('p');
        originalP.innerHTML = `<strong>Original:</strong> ${entry.originalName}`;
        
        const instructionP = document.createElement('p');
        instructionP.innerHTML = `<strong>Instruction:</strong> ${entry.instructions}`;

        const resultsList = document.createElement('ul');
        resultsList.className = 'refined-results-list';
        entry.results.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            resultsList.appendChild(li);
        });

        itemDiv.appendChild(originalP);
        itemDiv.appendChild(instructionP);
        itemDiv.appendChild(resultsList);
        customRefineHistoryDiv.appendChild(itemDiv);
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
    const targetDiv = renderToModal ? fullHistoryList : recentHistoryDiv;
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
            let preRefinedHTML = '';
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
        promptInput.value = entry.prompt;
        document.getElementById("keywords").value = entry.keywords || '';
        document.getElementById("category").value = entry.category;
        document.getElementById("style").value = entry.style;
        document.getElementById("language").value = entry.language || 'English';
        renderClickableNames(entry.names.map(cleanNames)); 
        reasonsPre.textContent = entry.reasons.map(cleanNames).join("\n\n");
        outputContainer.classList.remove("hidden");
        refineSection.classList.remove("hidden");
        if(refineBtn) refineBtn.classList.remove("hidden");
        recentHistorySection.classList.remove("hidden");
        if (window.isSidebarOpen) toggleSidebar();
    } else {
        document.getElementById("error").textContent = "Cannot restore a refinement history item.";
    }
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

function resetDynamicSections(clearInputs = true) {
    [outputContainer, refineSection, refinedOutputs, recentHistorySection, customRefineHistorySection].forEach(el => el.classList.add("hidden"));
    if (clearInputs) {
        [namesPre, reasonsPre, refinedNamesPre, refinedReasonsPre].forEach(el => el.textContent = "");
    }
    document.getElementById("error").textContent = "";
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
function closeHistoryDetailsModal() { if (historyDetailsModal) historyDetailsModal.classList.remove('active'); }

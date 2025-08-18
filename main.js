const BACKEND_URL = "https://nameit-backend-2.vercel.app";

const CATEGORY_OPTIONS = ["Auto (AI Decides)", "App", "Book", "Brand", "Company", "Course", "Drawing", "Event", "Game", "New Word", "Object", "Pet", "Place", "Platform", "Podcast", "Product", "Random", "Service", "Song", "Startup", "Tool", "Trend", "Video", "Website"];
const STYLE_OPTIONS = ["Auto (AI Decides)", "Random", "Professional", "Creative", "Modern", "Minimal", "Powerful", "Elegant", "Luxury", "Catchy", "Playful", "Bold", "Futuristic", "Mysterious", "Artistic", "Fantasy", "Mythical", "Retro", "Cute", "Funny", "Classy"];
const PATTERN_OPTIONS = ["Auto (AI Decides)", "One Word", "Two Words", "Invented Word", "Real Word", "Short & Punchy", "Long & Evocative"];

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
    setupTooltips();
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
            if (!instruction) {
                showTemporaryPlaceholderError(editBox, "Please enter a refine instruction.");
                return;
            }
            refineNames('freestyle', null, instruction);
        };
    }
});

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

function initializeUI() {
    outputContainer.classList.add("hidden-section");
    refineSection.classList.add("hidden-section");
    refinedOutputs.classList.add("hidden-section");
    refineBtn.classList.add("hidden-section");
    recentHistorySection.classList.add("hidden-section");
    document.getElementById("more-like-this-section").classList.remove('visible');
    if (!promptInput.dataset.originalPlaceholder) {
        promptInput.dataset.originalPlaceholder = promptInput.placeholder;
    }
    if (!editBox.dataset.originalPlaceholder) {
        editBox.dataset.originalPlaceholder = editBox.placeholder;
    }
}

function populateDropdown(id, options) {
    const select = document.getElementById(id);
    if (!select) return;
    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

function cleanNames(text) { return text.replace(/\*\*/g, ''); }

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

async function getUserToken() {
    if (window.auth && window.auth.currentUser) {
        await window.auth.currentUser.reload();
        return await window.auth.currentUser.getIdToken(true);
    }
    return null;
}

function renderClickableNames(namesArray) {
    namesPre.innerHTML = '';
    namesPre.classList.add('clickable');
    namesArray.forEach(name => {
        const nameEl = document.createElement('div');
        nameEl.className = 'generated-name';
        nameEl.textContent = name;
        nameEl.addEventListener('click', () => addSeedName(name));
        namesPre.appendChild(nameEl);
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

    if (!window.auth.currentUser) {
        let anonGenerations = parseInt(localStorage.getItem('anonGenerations') || '0');
        if (anonGenerations >= 10) {
            document.getElementById("error").textContent = "You have used all 10 free generations. Please sign up to continue.";
            if (typeof openSignUpModal === 'function') openSignUpModal();
            return;
        }
    }

    const prompt = promptInput.value.trim();
    if (!prompt) {
        showTemporaryPlaceholderError(promptInput, "You cannot generate names without a description!");
        resetDynamicSections();
        return;
    }

    promptInput.placeholder = promptInput.dataset.originalPlaceholder;
    promptInput.classList.remove("prompt-error-placeholder");
    document.getElementById("error").textContent = "";

    const seedNamesContainer = document.getElementById("more-like-this-container");
    const seed_names = Array.from(seedNamesContainer.children).map(el => el.textContent.slice(0, -1).trim());
    const keywords = document.getElementById("keywords").value.trim();
    const category = document.getElementById("category").value;
    const style = document.getElementById("style").value;
    const language = document.getElementById("language").value;
    const pattern = document.getElementById("pattern").value;
    
    outputContainer.classList.remove("hidden-section");
    outputContainer.classList.add("visible-section");
    showLoading(namesPre);
    showLoading(reasonsPre);
    disableButtons();

    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify({ prompt, keywords, category, style, language, pattern, seed_names })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `A server error occurred (Status: ${response.status}).`);
        }
        const data = await response.json();

        if (!window.auth.currentUser) {
            let anonGenerations = parseInt(localStorage.getItem('anonGenerations') || '0');
            anonGenerations++;
            localStorage.setItem('anonGenerations', anonGenerations);
            if (typeof window.updateGenerationCountUI === 'function') {
                window.updateGenerationCountUI(Math.max(0, 10 - anonGenerations), 10);
            }
        } else if (data.generationsLeft !== undefined) {
            if (typeof window.updateGenerationCountUI === 'function') {
                window.updateGenerationCountUI(data.generationsLeft, 100);
            }
        }

        renderClickableNames(data.names.map(cleanNames));
        reasonsPre.textContent = data.reasons.map(cleanNames).join("\n\n");
        namesPre.classList.add("fade-in-content");
        reasonsPre.classList.add("fade-in-content");

        if (window.auth.currentUser && window.auth.currentUser.emailVerified) {
            refineSection.classList.remove("hidden-section");
            refineSection.classList.add("visible-section");
            refineBtn.classList.remove("hidden-section");
            refineBtn.classList.add("visible-section");
        }
        recentHistorySection.classList.remove("hidden-section");
        recentHistorySection.classList.add("visible-section");
        fetchHistory(false);
    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        resetDynamicSections();
    } finally {
        hideLoading(namesPre);
        hideLoading(reasonsPre);
        
        let countdown = 5;
        generateBtn.textContent = `Please wait ${countdown}s...`;
        surpriseBtn.disabled = true;

        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                generateBtn.textContent = `Please wait ${countdown}s...`;
            } else {
                clearInterval(interval);
                generateBtn.textContent = '🎯 Generate Names';
                enableButtons();
            }
        }, 1000);
    }
}

async function refineNames(action, names = null, extra_info = "") {
    if (refineBtn.disabled) return;

    editBox.placeholder = editBox.dataset.originalPlaceholder;
    editBox.classList.remove("prompt-error-placeholder");
    document.getElementById("error").textContent = "";
    
    showLoading(refinedNamesPre);
    showLoading(refinedReasonsPre);
    disableButtons();
    
    try {
        const token = await getUserToken();
        const body = {
            action: action,
            names: names,
            extra_info: extra_info
        };
        const response = await fetch(`${BACKEND_URL}/refine`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Unknown error during name refinement.");
        }
        const data = await response.json();

        if (window.auth.currentUser && data.generationsLeft !== undefined) {
            if (typeof window.updateGenerationCountUI === 'function') {
                window.updateGenerationCountUI(data.generationsLeft, 100);
            }
        }
        
        refinedNamesPre.textContent = data.names.map(cleanNames).join("\n\n");
        refinedReasonsPre.textContent = data.reasons.map(cleanNames).join("\n\n");
        refinedNamesPre.classList.add("fade-in-content");
        refinedReasonsPre.classList.add("fade-in-content");
        refinedOutputs.classList.remove("hidden-section");
        refinedOutputs.classList.add("visible-section");
        fetchHistory(false);
    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        refinedOutputs.classList.add("hidden-section");
    } finally {
        hideLoading(refinedNamesPre);
        hideLoading(refinedReasonsPre);
        
        let countdown = 5;
        refineBtn.textContent = `Please wait ${countdown}s...`;
        generateBtn.disabled = true;
        surpriseBtn.disabled = true;

        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                refineBtn.textContent = `Please wait ${countdown}s...`;
            } else {
                clearInterval(interval);
                refineBtn.textContent = '🛠️ Refine Suggestions';
                enableButtons();
            }
        }, 1000);
    }
}

async function surpriseMe() {
    if (surpriseBtn.disabled) return;
    
    document.getElementById("keywords").value = '';
    document.getElementById("more-like-this-container").innerHTML = '';
    document.getElementById("more-like-this-section").classList.remove('visible');
    
    disableButtons();
    promptInput.value = '';
    promptInput.placeholder = 'Conjuring an idea...';

    try {
        const token = await getUserToken();
        const response = await fetch(`${BACKEND_URL}/surprise`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to get a surprise prompt.");
        }
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

async function fetchHistory(renderToModal = false) {
    const targetDiv = renderToModal ? fullHistoryList : recentHistoryDiv;
    targetDiv.innerHTML = "";
    const token = await getUserToken();
    try {
        const response = await fetch(`${BACKEND_URL}/history`, { headers: { ...(token && { "Authorization": `Bearer ${token}` }) } });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Unknown error fetching history.");
        }
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
    if (!renderToModal) {
        history = history.slice(0, 50);
    }
    if (history.length === 0) {
        targetDiv.innerHTML = "<p>*No history yet. Generate some names!*</p>";
        return;
    }

    const createTooltip = (entry) => {
        let tooltip = `Prompt: ${entry.prompt}\nCategory: ${entry.category}\nStyle: ${entry.style}`;
        if (entry.keywords) {
            tooltip += `\nKeywords: ${entry.keywords}`;
        }
        if (entry.seed_names_used && entry.seed_names_used.length > 0) {
            tooltip += `\nFrom Seeds: ${entry.seed_names_used.join(", ")}`;
        }
        return tooltip;
    };

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
                button.title = entry.category === "Refined" ? `Refine Instruction: ${entry.prompt}` : createTooltip(entry);
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
            button.title = entry.category === "Refined" ? `Refine Instruction: ${entry.prompt}` : createTooltip(entry);
            const names = entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ");
            let preRefinedHTML = '';
            if (entry.category === "Refined" && entry.pre_refined_names && entry.pre_refined_names.length > 0) {
                const preRefinedText = `from: ${entry.pre_refined_names.map(cleanNames).join(", ")}`;
                preRefinedHTML = `<small class="pre-refined-history">${preRefinedText}</small>`;
            }
            let seedNamesHTML = '';
            if (entry.seed_names_used && entry.seed_names_used.length > 0) {
                const seedNamesText = `from seeds: ${entry.seed_names_used.join(", ")}`;
                seedNamesHTML = `<small class="seed-names-history">${seedNamesText}</small>`;
            }
            button.innerHTML = `${names}${seedNamesHTML}${preRefinedHTML}`;
            button.onclick = () => restoreHistory(entry.id);
            targetDiv.appendChild(button);
        });
    }
}

async function restoreHistory(id) {
    document.getElementById("error").textContent = "";
    promptInput.placeholder = promptInput.dataset.originalPlaceholder;
    promptInput.classList.remove("prompt-error-placeholder");
    editBox.placeholder = editBox.dataset.originalPlaceholder;
    editBox.classList.remove("prompt-error-placeholder");
    closeHistoryModal();
    closeHistoryDetailsModal();
    const token = await getUserToken();
    if (!token) return;
    await fetch(`${BACKEND_URL}/restore-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id: id })
    });
    fetch(`${BACKEND_URL}/history`, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => res.json())
        .then(historyData => {
            const entry = id === 'latest' ? historyData[0] : historyData.find(e => e.id === id);
            if (entry) {
                promptInput.value = entry.prompt;
                document.getElementById("keywords").value = entry.keywords || '';
                document.getElementById("category").value = entry.category;
                document.getElementById("style").value = entry.style;
                document.getElementById("language").value = entry.language;
                renderClickableNames(entry.names.map(cleanNames)); 
                reasonsPre.textContent = entry.reasons.map(cleanNames).join("\n\n");
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
                    refineSection.classList.add("hidden-section");
                    refineBtn.classList.add("hidden-section");
                }
                refinedOutputs.classList.add("hidden-section");
                recentHistorySection.classList.remove("hidden-section");
                recentHistorySection.classList.add("visible-section");
                if (typeof toggleSidebar === 'function' && window.isSidebarOpen) {
                    toggleSidebar();
                }
            } else {
                document.getElementById("error").textContent = "No history available to restore.";
            }
        });
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

function resetDynamicSections() {
    outputContainer.classList.add("hidden-section");
    refineSection.classList.add("hidden-section");
    refinedOutputs.classList.add("hidden-section");
    refineBtn.classList.add("hidden-section");
    recentHistorySection.classList.add("hidden-section");
    document.getElementById("more-like-this-section").classList.remove('visible');
    document.getElementById("more-like-this-container").innerHTML = '';
    namesPre.textContent = "";
    reasonsPre.textContent = "";
    refinedNamesPre.textContent = "";
    refinedReasonsPre.textContent = "";
    document.getElementById("error").textContent = "";
}

function setupTooltips() {
    const tooltipIcons = document.querySelectorAll('.tooltip-icon');
    tooltipIcons.forEach(icon => {
        const tooltipBox = icon.nextElementSibling;
        tooltipBox.textContent = icon.dataset.tooltipText;
    });
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

function closeHistoryModal() {
    if (historyModal) {
        historyModal.classList.remove('active');
    }
}

async function showHistoryDetails(id) {
    if (!historyDetailsModal || !detailsContent) return;
    const token = await getUserToken();
    try {
        const response = await fetch(`${BACKEND_URL}/history`, { headers: { ...(token && { "Authorization": `Bearer ${token}` }) } });
        if (!response.ok) throw new Error("Could not fetch history for details.");
        const historyData = await response.json();
        const entry = historyData.find(e => e.id === id);
        if (entry) {
            let contentHtml = `<p><strong>Timestamp:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>`;
            if (entry.category === "Refined") {
                contentHtml += `<p><strong>Refine Instruction:</strong> ${entry.prompt}</p>`;
                contentHtml += `<p><strong>Refined Names:</strong></p><pre>${entry.names.map(cleanNames).join("\n")}</pre>`;
                if (entry.pre_refined_names && entry.pre_refined_names.length > 0) {
                    contentHtml += `<p><strong>Original Names (Pre-Refined):</strong></p><pre>${entry.pre_refined_names.map(cleanNames).join("\n")}</pre>`;
                }
            } else {
                contentHtml += `<p><strong>Prompt:</strong> ${entry.prompt}</p>`;
                if (entry.keywords) {
                    contentHtml += `<p><strong>Keywords:</strong> ${entry.keywords}</p>`;
                }
                if (entry.seed_names_used && entry.seed_names_used.length > 0) {
                    contentHtml += `<p><strong>From Seeds:</strong> ${entry.seed_names_used.join(", ")}</p>`;
                }
                contentHtml += `<p><strong>Category:</strong> ${entry.category}</p>`;
                contentHtml += `<p><strong>Style:</strong> ${entry.style}</p>`;
                contentHtml += `<p><strong>Language:</strong> ${entry.language}</p>`;
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

function closeHistoryDetailsModal() {
    if (historyDetailsModal) {
        historyDetailsModal.classList.remove('active');
        detailsContent.innerHTML = '';
    }
}

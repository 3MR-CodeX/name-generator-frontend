[cite_start]const BACKEND_URL = "https://nameit-backend-2.vercel.app"; [cite: 184]

const CATEGORY_OPTIONS = [
  "App", "Book", "Brand", "Company", "Course", "Drawing", "Event", "Game",
  "New Word", "Object", "Pet", "Place", "Platform", "Podcast", "Product",
  "Random", "Service", "Song", "Startup", "Tool", "Trend", "Video", "Website"
[cite_start]]; [cite: 184]
const STYLE_OPTIONS = [
  "Random", "Powerful", "aggressive", "Artistic", "Arcade", "Bold", "Catchy",
  "Cheerful", "Classy", "Cozy", "Creative", "Cryptic", "Cute", "Dark", "Edgy",
  "Elegant", "Efficient", "Fantasy", "Fashion", "Funny", "Futuristic", "Informative",
  "Intense", "Luxury", "Minimal", "Modern", "Mythical", "Organic", "Playful", "Mysterious",
  "Professional", "Retro", "Relaxing", "Scary", "Smart", "Stylish", "Sleek", "Competitive",
  "Suspense", "Surreal", "Traditional", "Uplifting", "Wholesome", "Zen", "Whimsical"
[cite_start]]; [cite: 184]
const SURPRISES = [
    [cite_start]["أريد اسمًا قويًا ومميزًا لعلامة تجارية عربية جديدة في مجال التكنولوجيا", "Brand", "Powerful", "Arabic"], [cite: 185]
    [cite_start]["A silly and cute name for a hyperactive parrot", "Pet", "Funny", "English"], [cite: 185]
    [cite_start]["A strange, ancient place hidden under the ocean", "Place", "Mysterious", "English"], [cite: 186]
    [cite_start]["An elegant and luxurious name for a new high-end perfume line", "Product", "Luxury", "English"], [cite: 186]
    [cite_start]["A poetic name for a short film about isolation and self-discovery", "Video", "Minimal", "English"], [cite: 186]
];

[cite_start]const outputContainer = document.getElementById("output_container"); [cite: 192]
[cite_start]const refineSection = document.getElementById("refine_section"); [cite: 192]
[cite_start]const refinedOutputs = document.getElementById("refined_outputs"); [cite: 192]
[cite_start]const refineBtn = document.querySelector(".refine-btn"); [cite: 193]
[cite_start]const namesPre = document.getElementById("names"); [cite: 193]
[cite_start]const reasonsPre = document.getElementById("reasons"); [cite: 193]
[cite_start]const refinedNamesPre = document.getElementById("refined_names"); [cite: 193]
[cite_start]const refinedReasonsPre = document.getElementById("refined_reasons"); [cite: 193]
[cite_start]const promptInput = document.getElementById("prompt"); [cite: 194]
[cite_start]const editBox = document.getElementById("edit_box"); [cite: 194]
[cite_start]const generateBtn = document.querySelector(".generate-btn"); [cite: 195]
[cite_start]const surpriseBtn = document.querySelector(".surprise-btn"); [cite: 195]
[cite_start]const historyModal = document.getElementById("history-modal"); [cite: 196]
[cite_start]const closeButtonHistoryModal = document.querySelector("#history-modal .close-button"); [cite: 196]
[cite_start]const fullHistoryList = document.getElementById("full-history-list"); [cite: 196]
[cite_start]const historyDetailsModal = document.getElementById("history-details-modal"); [cite: 197]
[cite_start]const closeButtonDetailsModal = document.querySelector("#history-details-modal .close-button"); [cite: 197]
[cite_start]const detailsContent = document.getElementById("details-content"); [cite: 197]
[cite_start]const recentHistorySection = document.getElementById("history_section"); [cite: 198]
[cite_start]const recentHistoryDiv = document.getElementById("history"); [cite: 199]

document.addEventListener("DOMContentLoaded", async () => {
    [cite_start]await loadComponent('top-bar-placeholder', 'components/topbar.html'); [cite: 200]
    [cite_start]await loadComponent('sidebar-placeholder', 'components/sidebar.html'); [cite: 200]

    [cite_start]if (typeof initializeTopbar === 'function') initializeTopbar(); [cite: 200]
    [cite_start]if (typeof initializeSidebar === 'function') initializeSidebar(); [cite: 200]
    
    if (typeof initializeAuth === 'function') {
        initializeAuth();
    }
    
    [cite_start]initializeUI(); [cite: 200]
    [cite_start]populateDropdown("category", CATEGORY_OPTIONS); [cite: 200]
    [cite_start]populateDropdown("style", STYLE_OPTIONS); [cite: 200]
    [cite_start]setupTooltips(); [cite: 200]

    [cite_start]if (historyModal && closeButtonHistoryModal) { [cite: 200]
        [cite_start]closeButtonHistoryModal.addEventListener('click', closeHistoryModal); [cite: 201]
        [cite_start]window.addEventListener('click', (event) => { [cite: 201]
            [cite_start]if (event.target == historyModal) closeHistoryModal(); [cite: 201]
        });
    }

    [cite_start]if (historyDetailsModal && closeButtonDetailsModal) { [cite: 202]
        [cite_start]closeButtonDetailsModal.addEventListener('click', () => { [cite: 202]
            [cite_start]closeHistoryDetailsModal(); [cite: 202]
            [cite_start]openHistoryModal(); [cite: 202]
        });
        [cite_start]window.addEventListener('click', (event) => { [cite: 203]
            [cite_start]if (event.target == historyDetailsModal) { [cite: 203]
                [cite_start]closeHistoryDetailsModal(); [cite: 203]
                [cite_start]openHistoryModal(); [cite: 203]
            }
        });
    }
});

[cite_start]async function loadComponent(placeholderId, componentUrl) { [cite: 205, 206, 207]
    try {
        [cite_start]const response = await fetch(componentUrl); [cite: 208]
        [cite_start]if (!response.ok) throw new Error(`Failed to load ${componentUrl}`); [cite: 208]
        [cite_start]document.getElementById(placeholderId).innerHTML = await response.text(); [cite: 210]
    } catch (error) {
        [cite_start]console.error(error); [cite: 211]
        [cite_start]document.getElementById(placeholderId).innerHTML = `<div style="color: red;">Error loading component.</div>`; [cite: 211]
    }
}

[cite_start]function initializeUI() { [cite: 212]
    [cite_start]outputContainer.classList.add("hidden-section"); [cite: 212]
    [cite_start]refineSection.classList.add("hidden-section"); [cite: 212]
    [cite_start]refinedOutputs.classList.add("hidden-section"); [cite: 212]
    [cite_start]refineBtn.classList.add("hidden-section"); [cite: 212]
    [cite_start]recentHistorySection.classList.add("hidden-section"); [cite: 212]
    [cite_start]if (!promptInput.dataset.originalPlaceholder) { [cite: 213]
        [cite_start]promptInput.dataset.originalPlaceholder = promptInput.placeholder; [cite: 213]
    }
    [cite_start]if (!editBox.dataset.originalPlaceholder) { [cite: 214]
        [cite_start]editBox.dataset.originalPlaceholder = editBox.placeholder; [cite: 214]
    }
}

[cite_start]function populateDropdown(id, options) { [cite: 216]
    [cite_start]const select = document.getElementById(id); [cite: 216]
    [cite_start]options.forEach(option => { [cite: 216]
        [cite_start]const opt = document.createElement("option"); [cite: 216]
        [cite_start]opt.value = option; [cite: 217]
        [cite_start]opt.textContent = option; [cite: 217]
        [cite_start]select.appendChild(opt); [cite: 217]
    });
}

[cite_start]function cleanNames(text) { [cite: 217]
    [cite_start]return text.replace(/\*\*/g, ''); [cite: 217]
}

[cite_start]function showLoading(targetElement) { [cite: 218, 219]
    [cite_start]targetElement.textContent = ""; [cite: 220]
    [cite_start]targetElement.classList.remove("fade-in-content"); [cite: 220]
    [cite_start]let spinnerOverlay = targetElement.querySelector(".spinner-overlay"); [cite: 221]
    [cite_start]if (!spinnerOverlay) { [cite: 221]
        [cite_start]spinnerOverlay = document.createElement("div"); [cite: 221]
        [cite_start]spinnerOverlay.className = "spinner-overlay"; [cite: 222]
        [cite_start]spinnerOverlay.innerHTML = '<div class="spinner"></div>'; [cite: 222]
        [cite_start]targetElement.appendChild(spinnerOverlay); [cite: 222]
    }
    [cite_start]spinnerOverlay.classList.add("show"); [cite: 222]
}

[cite_start]function hideLoading(targetElement) { [cite: 223, 224]
    [cite_start]const spinnerOverlay = targetElement.querySelector(".spinner-overlay"); [cite: 225]
    [cite_start]if (spinnerOverlay) { [cite: 225]
        [cite_start]spinnerOverlay.classList.remove("show"); [cite: 226]
    }
}

[cite_start]function disableButtons() { [cite: 227]
    [cite_start]generateBtn.disabled = true; [cite: 227]
    [cite_start]surpriseBtn.disabled = true; [cite: 227]
    [cite_start]refineBtn.disabled = true; [cite: 228]
}

[cite_start]function enableButtons() { [cite: 229]
    [cite_start]generateBtn.disabled = false; [cite: 229]
    [cite_start]surpriseBtn.disabled = false; [cite: 229]
    [cite_start]refineBtn.disabled = false; [cite: 229]
}

[cite_start]function showTemporaryPlaceholderError(textarea, message) { [cite: 230, 231]
    [cite_start]if (!textarea.dataset.originalPlaceholder) { [cite: 232]
        [cite_start]textarea.dataset.originalPlaceholder = textarea.placeholder; [cite: 232]
    }
    [cite_start]textarea.placeholder = message; [cite: 232]
    [cite_start]textarea.classList.add("prompt-error-placeholder"); [cite: 232]
    [cite_start]setTimeout(() => { [cite: 233]
        [cite_start]if (textarea.placeholder === message) { [cite: 233]
            [cite_start]textarea.placeholder = textarea.dataset.originalPlaceholder; [cite: 233]
            [cite_start]textarea.classList.remove("prompt-error-placeholder"); [cite: 233]
        }
    }, 3000);
}

async function getUserToken() {
    if (window.auth && window.auth.currentUser) {
        return await window.auth.currentUser.getIdToken(true);
    }
    return null;
}

async function generateName() {
    [cite_start]const prompt = promptInput.value.trim(); [cite: 234]
    if (!prompt) {
        [cite_start]showTemporaryPlaceholderError(promptInput, "You cannot generate names without a description!"); [cite: 235]
        [cite_start]resetDynamicSections(); [cite: 235]
        [cite_start]return; [cite: 236]
    }
    [cite_start]promptInput.placeholder = promptInput.dataset.originalPlaceholder; [cite: 237]
    [cite_start]promptInput.classList.remove("prompt-error-placeholder"); [cite: 237]

    [cite_start]const category = document.getElementById("category").value; [cite: 238]
    [cite_start]const style = document.getElementById("style").value; [cite: 238]
    [cite_start]const language = document.getElementById("language").value; [cite: 238]
    
    [cite_start]document.getElementById("error").textContent = ""; [cite: 241]
    [cite_start]outputContainer.classList.remove("hidden-section"); [cite: 241]
    [cite_start]outputContainer.classList.add("visible-section"); [cite: 241]
    [cite_start]showLoading(namesPre); [cite: 242]
    [cite_start]showLoading(reasonsPre); [cite: 242]
    disableButtons();
    [cite_start]refinedOutputs.classList.add("hidden-section"); [cite: 243]
    [cite_start]refineSection.classList.add("hidden-section"); [cite: 244]
    [cite_start]refineBtn.classList.add("hidden-section"); [cite: 244]

    try {
        const token = await getUserToken();

        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: JSON.stringify({ prompt, category, style, language })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Unknown error during name generation.");
        }
        [cite_start]const data = await response.json(); [cite: 247]

        [cite_start]namesPre.textContent = data.names.map(cleanNames).join("\n"); [cite: 248]
        [cite_start]reasonsPre.textContent = data.reasons.map(cleanNames).join("\n"); [cite: 248]
        [cite_start]namesPre.classList.add("fade-in-content"); [cite: 248]
        [cite_start]reasonsPre.classList.add("fade-in-content"); [cite: 249]
        [cite_start]refineSection.classList.remove("hidden-section"); [cite: 250]
        [cite_start]refineSection.classList.add("visible-section"); [cite: 250]
        [cite_start]refineBtn.classList.remove("hidden-section"); [cite: 250]
        [cite_start]refineBtn.classList.add("visible-section"); [cite: 250]
        [cite_start]recentHistorySection.classList.remove("hidden-section"); [cite: 251]
        [cite_start]recentHistorySection.classList.add("visible-section"); [cite: 251]
        [cite_start]fetchHistory(false); [cite: 251]
    } catch (error) {
        [cite_start]document.getElementById("error").textContent = "Error: " + error.message; [cite: 252]
        [cite_start]resetDynamicSections(); [cite: 253]
    } finally {
        [cite_start]hideLoading(namesPre); [cite: 255]
        [cite_start]hideLoading(reasonsPre); [cite: 255]
        enableButtons();
    }
}

async function refineNames() {
    [cite_start]const instruction = editBox.value.trim(); [cite: 256]
    if (!instruction) {
        [cite_start]showTemporaryPlaceholderError(editBox, "Please enter a refine instruction."); [cite: 257]
        [cite_start]return; [cite: 258]
    }
    [cite_start]editBox.placeholder = editBox.dataset.originalPlaceholder; [cite: 259]
    [cite_start]editBox.classList.remove("prompt-error-placeholder"); [cite: 259]

    [cite_start]document.getElementById("error").textContent = ""; [cite: 261]
    [cite_start]showLoading(refinedNamesPre); [cite: 261]
    [cite_start]showLoading(refinedReasonsPre); [cite: 261]
    disableButtons();

    try {
        const token = await getUserToken();
        
        const response = await fetch(`${BACKEND_URL}/refine`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: JSON.stringify({ instruction })
        });
        if (!response.ok) {
            [cite_start]const errorData = await response.json(); [cite: 263]
            throw new Error(errorData.detail || "Unknown error during name refinement.");
        }
        [cite_start]const data = await response.json(); [cite: 264]
        
        [cite_start]refinedNamesPre.textContent = data.names.map(cleanNames).join("\n"); [cite: 264]
        [cite_start]reasonsPre.textContent = data.reasons.map(cleanNames).join("\n"); [cite: 264]
        [cite_start]refinedNamesPre.classList.add("fade-in-content"); [cite: 265]
        [cite_start]refinedReasonsPre.classList.add("fade-in-content"); [cite: 265]
        [cite_start]refinedOutputs.classList.remove("hidden-section"); [cite: 265]
        [cite_start]refinedOutputs.classList.add("visible-section"); [cite: 265]
        [cite_start]fetchHistory(false); [cite: 266]
    } catch (error) {
        [cite_start]document.getElementById("error").textContent = "Error: " + error.message; [cite: 267]
        [cite_start]refinedOutputs.classList.add("hidden-section"); [cite: 268]
    } finally {
        [cite_start]hideLoading(refinedNamesPre); [cite: 269]
        [cite_start]hideLoading(refinedReasonsPre); [cite: 269]
        enableButtons();
    }
}

[cite_start]async function fetchHistory(renderToModal = false) { [cite: 270]
    [cite_start]const targetDiv = renderToModal ? fullHistoryList : recentHistoryDiv; [cite: 274]
    [cite_start]targetDiv.innerHTML = ""; [cite: 275]
    
    const token = await getUserToken();

    try {
        const response = await fetch(`${BACKEND_URL}/history`, {
            headers: {
                ...(token && { "Authorization": `Bearer ${token}` })
            }
        });
        if (!response.ok) {
            [cite_start]const errorData = await response.json(); [cite: 271]
            throw new Error(errorData.detail || "Unknown error fetching history.");
        }
        [cite_start]const history = await response.json(); [cite: 272]
        [cite_start]renderHistory(history, renderToModal); [cite: 272]
    } catch (error) {
        [cite_start]document.getElementById("error").textContent = "Error fetching history: " + error.message; [cite: 273]
        targetDiv.innerHTML = "<p>*Could not load history.*</p>";
    }
}

[cite_start]function renderHistory(history, renderToModal = false) { [cite: 274]
    [cite_start]const targetDiv = renderToModal ? fullHistoryList : recentHistoryDiv; [cite: 274]
    [cite_start]if (!targetDiv) return; [cite: 275]

    [cite_start]targetDiv.innerHTML = ""; [cite: 275]

    [cite_start]if (history.length === 0) { [cite: 278]
        [cite_start]targetDiv.innerHTML = "<p>*No history yet. Generate some names!*</p>"; [cite: 278]
        [cite_start]return; [cite: 278]
    }

    [cite_start]if (renderToModal) { [cite: 278]
        [cite_start]const groupedHistory = history.reduce((acc, entry) => { [cite: 278]
            [cite_start]const date = new Date(entry.timestamp).toLocaleDateString('en-US', { [cite: 278]
                [cite_start]year: 'numeric', month: 'long', day: 'numeric' [cite: 279]
            });
            [cite_start]if (!acc[date]) acc[date] = []; [cite: 280]
            [cite_start]acc[date].push(entry); [cite: 280]
            [cite_start]return acc; [cite: 280]
        }, {});
        [cite_start]const sortedDates = Object.keys(groupedHistory).sort((a, b) => new Date(b) - new Date(a)); [cite: 281]
        [cite_start]sortedDates.forEach(date => { [cite: 281]
            [cite_start]const dailyContainer = document.createElement('div'); [cite: 281]
            [cite_start]dailyContainer.className = 'daily-history-container'; [cite: 281]
            [cite_start]const dateHeading = document.createElement('h3'); [cite: 282]
            [cite_start]dateHeading.textContent = date; [cite: 282]
            [cite_start]dailyContainer.appendChild(dateHeading); [cite: 282]
            [cite_start]groupedHistory[date].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(entry => { [cite: 282]
                [cite_start]const button = document.createElement('button'); [cite: 285]
                [cite_start]button.className = 'history-item'; [cite: 285]
                [cite_start]button.innerHTML = `${entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ")}`; [cite: 282]
                [cite_start]button.onclick = () => showHistoryDetails(entry.id); [cite: 286]
                [cite_start]dailyContainer.appendChild(button); [cite: 286]
            });
            [cite_start]targetDiv.appendChild(dailyContainer); [cite: 286]
        });
    } else {
        [cite_start]history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(entry => { [cite: 287]
            [cite_start]const button = document.createElement('button'); [cite: 289]
            [cite_start]button.className = 'history-item'; [cite: 289]
            [cite_start]button.innerHTML = `${entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ")}`; [cite: 287]
            [cite_start]button.onclick = () => restoreHistory(entry.id); [cite: 290]
            [cite_start]targetDiv.appendChild(button); [cite: 290]
        });
    }
}

[cite_start]async function restoreHistory(id) { [cite: 291]
    [cite_start]document.getElementById("error").textContent = ""; [cite: 291]
    [cite_start]promptInput.placeholder = promptInput.dataset.originalPlaceholder; [cite: 291]
    [cite_start]promptInput.classList.remove("prompt-error-placeholder"); [cite: 292]
    [cite_start]editBox.placeholder = editBox.dataset.originalPlaceholder; [cite: 292]
    [cite_start]editBox.classList.remove("prompt-error-placeholder"); [cite: 292]
    [cite_start]closeHistoryModal(); [cite: 293]
    [cite_start]closeHistoryDetailsModal(); [cite: 293]

    const token = await getUserToken();
    if (!token) return;

    fetch(`${BACKEND_URL}/history`, { headers: { ...(token && { "Authorization": `Bearer ${token}` }) } })
        .then(res => res.json())
        [cite_start].then(historyData => { [cite: 293]
            [cite_start]const entry = id === 'latest' ? historyData[0] : historyData.find(e => e.id === id); [cite: 300, 301]
            [cite_start]if (entry) { [cite: 293]
                [cite_start]promptInput.value = entry.prompt; [cite: 293]
                [cite_start]document.getElementById("category").value = entry.category; [cite: 293]
                [cite_start]document.getElementById("style").value = entry.style; [cite: 293]
                [cite_start]document.getElementById("language").value = entry.language; [cite: 293]
                [cite_start]namesPre.textContent = entry.names.map(cleanNames).join("\n"); [cite: 294]
                [cite_start]reasonsPre.textContent = entry.reasons.map(cleanNames).join("\n"); [cite: 294]
                [cite_start]namesPre.classList.add("fade-in-content"); [cite: 294]
                [cite_start]reasonsPre.classList.add("fade-in-content"); [cite: 294]
                [cite_start]outputContainer.classList.remove("hidden-section"); [cite: 294]
                [cite_start]outputContainer.classList.add("visible-section"); [cite: 295]
                
                [cite_start]if (entry.category !== "Refined" && promptInput.value.trim()) { [cite: 295]
                    [cite_start]refineSection.classList.remove("hidden-section"); [cite: 296]
                    [cite_start]refineSection.classList.add("visible-section"); [cite: 296]
                    [cite_start]refineBtn.classList.remove("hidden-section"); [cite: 296]
                    [cite_start]refineBtn.classList.add("visible-section"); [cite: 296]
                } else {
                    [cite_start]refineSection.classList.add("hidden-section"); [cite: 297]
                    [cite_start]refineBtn.classList.add("hidden-section"); [cite: 297]
                }
                [cite_start]refinedOutputs.classList.add("hidden-section"); [cite: 298]
                [cite_start]recentHistorySection.classList.remove("hidden-section"); [cite: 299]
                [cite_start]recentHistorySection.classList.add("visible-section"); [cite: 299]
                
                [cite_start]if (typeof toggleSidebar === 'function' && window.isSidebarOpen) { [cite: 300]
                    [cite_start]toggleSidebar(); [cite: 300]
                }
            } else {
                [cite_start]document.getElementById("error").textContent = "No history available to restore."; [cite: 308]
            }
        });
}

[cite_start]function surpriseMe() { [cite: 309]
    [cite_start]const [prompt, category, style, language] = SURPRISES[Math.floor(Math.random() * SURPRISES.length)]; [cite: 309]
    [cite_start]promptInput.value = prompt; [cite: 310]
    [cite_start]document.getElementById("category").value = category; [cite: 310]
    [cite_start]document.getElementById("style").value = style; [cite: 310]
    [cite_start]document.getElementById("language").value = language; [cite: 310]
    [cite_start]generateName(); [cite: 311]
}

[cite_start]function copyToClipboard(elementId) { [cite: 312]
    [cite_start]const text = document.getElementById(elementId).textContent; [cite: 312]
    [cite_start]navigator.clipboard.writeText(text); [cite: 312]
}

[cite_start]function resetDynamicSections() { [cite: 316]
    [cite_start]outputContainer.classList.add("hidden-section"); [cite: 317]
    [cite_start]refineSection.classList.add("hidden-section"); [cite: 317]
    [cite_start]refinedOutputs.classList.add("hidden-section"); [cite: 317]
    [cite_start]refineBtn.classList.add("hidden-section"); [cite: 317]
    [cite_start]recentHistorySection.classList.add("hidden-section"); [cite: 318]
    [cite_start]namesPre.textContent = ""; [cite: 319]
    [cite_start]reasonsPre.textContent = ""; [cite: 319]
    [cite_start]refinedNamesPre.textContent = ""; [cite: 320]
    [cite_start]refinedReasonsPre.textContent = ""; [cite: 320]
    [cite_start]document.getElementById("error").textContent = ""; [cite: 322]
}

[cite_start]function setupTooltips() { [cite: 323]
    [cite_start]const tooltipIcons = document.querySelectorAll('.tooltip-icon'); [cite: 323]
    [cite_start]tooltipIcons.forEach(icon => { [cite: 323]
        [cite_start]const tooltipBox = icon.nextElementSibling; [cite: 323]
        [cite_start]tooltipBox.textContent = icon.dataset.tooltipText; [cite: 324]
    });
}

[cite_start]function openHistoryModal() { [cite: 325]
    [cite_start]if (historyModal) { [cite: 325]
        [cite_start]historyModal.classList.add('active'); [cite: 325]
        [cite_start]fetchHistory(true); [cite: 325]
    }
    [cite_start]if (typeof toggleSidebar === 'function' && window.isSidebarOpen) { [cite: 326]
        [cite_start]toggleSidebar(); [cite: 326]
    }
}

[cite_start]function closeHistoryModal() { [cite: 327]
    [cite_start]if (historyModal) { [cite: 327]
        [cite_start]historyModal.classList.remove('active'); [cite: 327]
    }
}

[cite_start]async function showHistoryDetails(id) { [cite: 328, 329]
    [cite_start]if (!historyDetailsModal || !detailsContent) return; [cite: 330]
    const token = await getUserToken();

    try {
        [cite_start]const response = await fetch(`${BACKEND_URL}/history`, { headers: { ...(token && { "Authorization": `Bearer ${token}` }) } }); [cite: 331]
        [cite_start]if (!response.ok) throw new Error("Could not fetch history for details."); [cite: 332]
        [cite_start]const historyData = await response.json(); [cite: 334]
        [cite_start]const entry = historyData.find(e => e.id === id); [cite: 334]
        [cite_start]if (entry) { [cite: 335]
            [cite_start]let contentHtml = `<p><strong>Timestamp:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>`; [cite: 335]
            [cite_start]if (entry.category === "Refined") { [cite: 336]
                [cite_start]contentHtml += `<p><strong>Refine Instruction:</strong> ${entry.prompt}</p>`; [cite: 336]
                [cite_start]contentHtml += `<p><strong>Refined Names:</strong></p><pre>${entry.names.map(cleanNames).join("\n")}</pre>`; [cite: 336]
                [cite_start]if (entry.pre_refined_names && entry.pre_refined_names.length > 0) { [cite: 337]
                    [cite_start]contentHtml += `<p><strong>Original Names (Pre-Refined):</strong></p><pre>${entry.pre_refined_names.map(cleanNames).join("\n")}</pre>`; [cite: 337]
                }
            } else {
                [cite_start]contentHtml += `<p><strong>Prompt:</strong> ${entry.prompt}</p>`; [cite: 338]
                [cite_start]contentHtml += `<p><strong>Category:</strong> ${entry.category}</p>`; [cite: 338]
                [cite_start]contentHtml += `<p><strong>Style:</strong> ${entry.style}</p>`; [cite: 338]
                [cite_start]contentHtml += `<p><strong>Language:</strong> ${entry.language}</p>`; [cite: 338]
                [cite_start]contentHtml += `<p><strong>Generated Names:</strong></p><pre>${entry.names.map(cleanNames).join("\n")}</pre>`; [cite: 339]
            }
            [cite_start]detailsContent.innerHTML = contentHtml; [cite: 340]
            [cite_start]historyDetailsModal.classList.add('active'); [cite: 340]
            [cite_start]closeHistoryModal(); [cite: 340]
        }
    } catch (error) {
        [cite_start]document.getElementById("error").textContent = "Error displaying history details."; [cite: 342]
    }
}

[cite_start]function closeHistoryDetailsModal() { [cite: 343]
    [cite_start]if (historyDetailsModal) { [cite: 343]
        [cite_start]historyDetailsModal.classList.remove('active'); [cite: 343]
        [cite_start]detailsContent.innerHTML = ''; [cite: 344]
    }
}

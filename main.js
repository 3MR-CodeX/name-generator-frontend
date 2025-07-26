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


document.addEventListener("DOMContentLoaded", () => {
    initializeUI();
    populateDropdown("category", CATEGORY_OPTIONS);
    populateDropdown("style", STYLE_OPTIONS);
    fetchHistory();

    // Add event listener to prompt input for dynamic section appearance
    promptInput.addEventListener("input", handlePromptInput);
});

function initializeUI() {
    // Add 'hidden-section' class to elements that should be initially hidden
    outputContainer.classList.add("hidden-section");
    refineSection.classList.add("hidden-section");
    refinedOutputs.classList.add("hidden-section");
    historySection.classList.add("hidden-section");
    refineBtn.classList.add("hidden-section"); // Hide refine button initially
}

function handlePromptInput() {
    // If prompt has content, show refine section and button
    if (promptInput.value.trim() !== "") {
        refineSection.classList.remove("hidden-section");
        refineSection.classList.add("visible-section");
        refineBtn.classList.remove("hidden-section");
        refineBtn.classList.add("visible-section");
    } else {
        // If prompt is empty, hide them
        refineSection.classList.remove("visible-section");
        refineSection.classList.add("hidden-section");
        refineBtn.classList.remove("visible-section");
        refineBtn.classList.add("hidden-section");
        // Also hide refined outputs if prompt is cleared
        refinedOutputs.classList.remove("visible-section");
        refinedOutputs.classList.add("hidden-section");
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

async function generateName() {
    const prompt = promptInput.value;
    const category = document.getElementById("category").value;
    const style = document.getElementById("style").value;
    const language = document.getElementById("language").value;

    if (!BACKEND_URL) {
        document.getElementById("error").textContent = "Backend URL not set correctly.";
        resetUI();
        return;
    }

    try {
        // Show loading state or clear previous results immediately
        namesPre.textContent = "Generating...";
        reasonsPre.textContent = "Generating...";
        namesPre.classList.remove("fade-in-content"); // Remove previous animation class
        reasonsPre.classList.remove("fade-in-content"); // Remove previous animation class
        refinedOutputs.classList.remove("visible-section"); // Hide refined outputs when generating new names
        refinedOutputs.classList.add("hidden-section");


        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, category, style, language })
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        namesPre.textContent = data.names.map(cleanNames).join("\n");
        reasonsPre.textContent = data.reasons.map(cleanNames).join("\n");

        // Add animation class after content is set
        namesPre.classList.add("fade-in-content");
        reasonsPre.classList.add("fade-in-content");

        // Show relevant sections with animation
        outputContainer.classList.remove("hidden-section");
        outputContainer.classList.add("visible-section");
        refineSection.classList.remove("hidden-section"); // Ensure refine section is visible if prompt exists
        refineSection.classList.add("visible-section");
        refineBtn.classList.remove("hidden-section"); // Ensure refine button is visible if prompt exists
        refineBtn.classList.add("visible-section");
        historySection.classList.remove("hidden-section");
        historySection.classList.add("visible-section");

        document.getElementById("error").textContent = "";
        fetchHistory();
    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        resetUI();
    }
}

async function refineNames() {
    const instruction = document.getElementById("edit_box").value;
    if (!instruction || !BACKEND_URL) {
        document.getElementById("error").textContent = "Refine instruction or backend URL missing.";
        resetUI();
        return;
    }

    try {
        // Show loading state or clear previous results immediately
        refinedNamesPre.textContent = "Refining...";
        refinedReasonsPre.textContent = "Refining...";
        refinedNamesPre.classList.remove("fade-in-content"); // Remove previous animation class
        refinedReasonsPre.classList.remove("fade-in-content"); // Remove previous animation class

        const response = await fetch(`${BACKEND_URL}/refine`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ instruction })
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        refinedNamesPre.textContent = data.names.map(cleanNames).join("\n");
        refinedReasonsPre.textContent = data.reasons.map(cleanNames).join("\n");

        // Add animation class after content is set
        refinedNamesPre.classList.add("fade-in-content");
        refinedReasonsPre.classList.add("fade-in-content");

        // Show refined outputs with animation
        refinedOutputs.classList.remove("hidden-section");
        refinedOutputs.classList.add("visible-section");
        document.getElementById("error").textContent = "";
        fetchHistory();
    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        resetUI();
    }
}

async function fetchHistory() {
    try {
        const response = await fetch(`${BACKEND_URL}/history`);
        if (!response.ok) throw new Error(await response.text());
        const history = await response.json();
        renderHistory(history);
    } catch (error) {
        document.getElementById("error").textContent = "Error: " + error.message;
        resetUI();
    }
}

function renderHistory(history) {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = history.length ? "" : "<p>*No history yet. Generate some names!*</p>";
    history.forEach(entry => {
        const names = entry.names.map(name => `<strong>${cleanNames(name)}</strong>`).join(", ");
        const tooltip = entry.category !== "Refined" ?
            `Prompt: ${entry.prompt}\nCategory: ${entry.category}\nStyle: ${entry.style}\nLanguage: ${entry.language}` :
            `Refine Instruction: ${entry.prompt}`;
        const preRefined = entry.pre_refined_names.length ? ` <span class='pre-refined'>(from: ${entry.pre_refined_names.map(cleanNames).join(", ")})</span>` : "";
        const button = `<button class='history-item' title='${tooltip}' onclick='restoreHistory("${entry.id}")'>${names}${preRefined}</button>`;
        historyDiv.innerHTML += button;
    });
}

function restoreHistory(id) {
    fetch(`${BACKEND_URL}/history`).then(res => res.json()).then(history => {
        const entry = history.find(e => e.id === id);
        if (entry) {
            promptInput.value = entry.prompt; // Use promptInput reference
            document.getElementById("category").value = entry.category;
            document.getElementById("style").value = entry.style;
            document.getElementById("language").value = entry.language;
            namesPre.textContent = entry.names.map(cleanNames).join("\n"); // Use namesPre reference
            reasonsPre.textContent = entry.reasons.map(cleanNames).join("\n"); // Use reasonsPre reference

            // Ensure animation class is applied
            namesPre.classList.add("fade-in-content");
            reasonsPre.classList.add("fade-in-content");

            // Show sections
            outputContainer.classList.remove("hidden-section");
            outputContainer.classList.add("visible-section");
            refineSection.classList.remove("hidden-section");
            refineSection.classList.add("visible-section");
            refineBtn.classList.remove("hidden-section");
            refineBtn.classList.add("visible-section");
            refinedOutputs.classList.remove("visible-section"); // Hide refined outputs when restoring
            refinedOutputs.classList.add("hidden-section");
            document.getElementById("error").textContent = "";
        }
    });
}

function surpriseMe() {
    const [prompt, category, style, language] = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
    promptInput.value = prompt; // Use promptInput reference
    document.getElementById("category").value = category;
    document.getElementById("style").value = style;
    document.getElementById("language").value = language;
    // Trigger the prompt input handler to show/hide sections based on new prompt
    handlePromptInput();
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        // Replace alert with a more subtle message or visual feedback
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

function resetUI() {
    // Add 'hidden-section' class to hide elements
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
}

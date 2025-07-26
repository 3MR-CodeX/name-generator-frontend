const BACKEND_URL = process.env.BACKEND_URL;
const API_KEY = process.env.NAMEIT2;


const CATEGORY_OPTIONS = [
  "App", "Book", "Brand", "Company", "Course", "Drawing", "Event", "Game",
  "New Word", "Object", "Pet", "Place", "Platform", "Podcast", "Product",
  "Random", "Service", "Song", "Startup", "Tool", "Trend", "Video", "Website"
];
const STYLE_OPTIONS = [
  "Random", "Powerful", "aggressive", "Artistic", "Arcade", "Bold", "Catchy",
  "Cheerful", "Classy", "Cozy", "Creative", "Cryptic", "Cute", "Dark", "Edgy",
  "Elegant", "Efficient", "Fantasy", "Fashion", "Funny", "Futuristic", "Informative",
  "Intense", "Luxury", "Minimal", "Modern", "Mythical", "Organic", "Playful",
  "Professional", "Retro", "Relaxing", "Scary", "Smart", "Stylish", "Sleek",
  "Suspense", "Surreal", "Traditional", "Uplifting", "Wholesome", "Zen"
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

document.addEventListener("DOMContentLoaded", () => {
    initializeUI();
    populateDropdown("category", CATEGORY_OPTIONS);
    populateDropdown("style", STYLE_OPTIONS);
    fetchHistory();
});

function initializeUI() {
    document.getElementById("output_container").style.display = "none";
    document.getElementById("refine_section").style.display = "none";
    document.getElementById("refined_outputs").style.display = "none";
    document.getElementById("history_section").style.display = "none";
    document.querySelector(".refine-btn").style.display = "none";
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
    const prompt = document.getElementById("prompt").value;
    const category = document.getElementById("category").value;
    const style = document.getElementById("style").value;
    const language = document.getElementById("language").value;

    try {
        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY
            },
            body: JSON.stringify({ prompt, category, style, language })
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        document.getElementById("names").textContent = data.names.map(cleanNames).join("\n");
        document.getElementById("reasons").textContent = data.reasons.map(cleanNames).join("\n");
        document.getElementById("output_container").style.display = "flex";
        document.getElementById("refine_section").style.display = prompt ? "block" : "none";
        document.querySelector(".refine-btn").style.display = prompt ? "block" : "none";
        document.getElementById("refined_outputs").style.display = "none";
        document.getElementById("history_section").style.display = "block";
        document.getElementById("error").textContent = "";
        fetchHistory();
    } catch (error) {
        document.getElementById("error").textContent = error.message;
    }
}

async function refineNames() {
    const instruction = document.getElementById("edit_box").value;
    if (!instruction) return;

    try {
        const response = await fetch(`${BACKEND_URL}/refine`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY
            },
            body: JSON.stringify({ instruction })
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        document.getElementById("refined_names").textContent = data.names.map(cleanNames).join("\n");
        document.getElementById("refined_reasons").textContent = data.reasons.map(cleanNames).join("\n");
        document.getElementById("refined_outputs").style.display = "flex";
        document.getElementById("error").textContent = "";
        fetchHistory();
    } catch (error) {
        document.getElementById("error").textContent = error.message;
    }
}

async function fetchHistory() {
    try {
        const response = await fetch(`${BACKEND_URL}/history`, {
            headers: { "x-api-key": API_KEY }
        });
        if (!response.ok) throw new Error(await response.text());
        const history = await response.json();
        renderHistory(history);
    } catch (error) {
        document.getElementById("error").textContent = error.message;
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
            document.getElementById("prompt").value = entry.prompt;
            document.getElementById("category").value = entry.category;
            document.getElementById("style").value = entry.style;
            document.getElementById("language").value = entry.language;
            document.getElementById("names").textContent = entry.names.map(cleanNames).join("\n");
            document.getElementById("reasons").textContent = entry.reasons.map(cleanNames).join("\n");
            document.getElementById("output_container").style.display = "flex";
            document.getElementById("refine_section").style.display = "block";
            document.querySelector(".refine-btn").style.display = "block";
            document.getElementById("refined_outputs").style.display = "none";
            document.getElementById("error").textContent = "";
        }
    });
}

function surpriseMe() {
    const [prompt, category, style, language] = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
    document.getElementById("prompt").value = prompt;
    document.getElementById("category").value = category;
    document.getElementById("style").value = style;
    document.getElementById("language").value = language;
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
}

const BACKEND_URL = window.env.BACKEND_URL || "https://4760050f-1753-4fa4-a6d0-1c75d54d8da4-00-ownpet0g9iuq.riker.replit.dev";
const API_KEY = window.env.NAMEIT2 || "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";

const CATEGORY_OPTIONS = ["Random", "Product", "Pet", "App", "Drawing", "Brand", "Object", "Video", "New Word", "Website", "Service", "Book", "Startup", "Course", "Event", "Song", "Tool", "Game", "Podcast", "Place", "Company"];
const STYLE_OPTIONS = ["Random", "Powerful", "Cute", "Futuristic", "Luxury", "Funny", "Elegant", "Minimal", "Bold", "Playful", "Mysterious", "Modern", "Traditional", "Edgy", "Catchy"];
const SURPRISES = [
    ["أريد اسمًا قويًا ومميزًا لعلامة تجارية عربية جديدة في مجال التكنولوجيا", "Brand", "Powerful", "Arabic"],
    ["A silly and cute name for a hyperactive parrot", "Pet", "Funny", "English"],
    ["A strange, ancient place hidden under the ocean", "Place", "Mysterious", "English"],
    ["An elegant and luxurious name for a new high-end perfume line", "Product", "Luxury", "English"],
    ["A poetic name for a short film about isolation and self-discovery", "Video", "Minimal", "English"]
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

        document.getElementById("names").textContent = data.names.join("\n");
        document.getElementById("reasons").textContent = data.reasons.join("\n");
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

        document.getElementById("refined_names").textContent = data.names.join("\n");
        document.getElementById("refined_reasons").textContent = data.reasons.join("\n");
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
        const names = entry.names.map(name => `<strong>${name}</strong>`).join(", ");
        const tooltip = entry.category !== "Refined" ?
            `Prompt: ${entry.prompt}\nCategory: ${entry.category}\nStyle: ${entry.style}\nLanguage: ${entry.language}` :
            `Refine Instruction: ${entry.prompt}`;
        const preRefined = entry.pre_refined_names.length ? ` <span class='pre-refined'>(from: ${entry.pre_refined_names.join(", ")})</span>` : "";
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
            document.getElementById("names").textContent = entry.names.join("\n");
            document.getElementById("reasons").textContent = entry.reasons.join("\n");
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

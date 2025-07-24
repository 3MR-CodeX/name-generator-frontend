import { config } from './config.js';

const backendURL = config.backendURL;
const apiKey = config.apiKey;

// 🎯 Generate Names
export async function generateName() {
  const prompt = document.getElementById("prompt").value;
  const category = document.getElementById("category").value;
  const style = document.getElementById("style").value;
  const language = document.getElementById("language").value;

  const resultEl = document.getElementById("names");
  const reasonEl = document.getElementById("reasons");
  const errorEl = document.getElementById("error");

  resultEl.textContent = "Generating...";
  reasonEl.textContent = "";
  errorEl.textContent = "";

  try {
    const response = await fetch(`${backendURL}/generate?desc=${encodeURIComponent(prompt)}&category=${category}&style=${style}&language=${language}`, {
      headers: {
        'x-api-key': apiKey
      }
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const data = await response.json();
    resultEl.textContent = data.names.join("\n");
    reasonEl.textContent = data.reasons.join("\n");
  } catch (err) {
    errorEl.textContent = "Failed to fetch. Please check your backend or API key.";
    console.error(err);
  }
}

// 🎲 Surprise Me
export function surpriseMe() {
  const examples = [
    "A cozy coffee shop in Cairo",
    "A futuristic time-tracking app",
    "A sword-themed fantasy game",
    "A minimalist fashion brand",
    "A productivity tool for students"
  ];
  const random = examples[Math.floor(Math.random() * examples.length)];
  document.getElementById("prompt").value = random;
}

// 📋 Copy to Clipboard
export function copyToClipboard(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}

// 🛠️ Refine Suggestions
export async function refineNames() {
  const editPrompt = document.getElementById("edit_box").value;
  const originalNames = document.getElementById("names").textContent;

  const refinedNamesEl = document.getElementById("refined_names");
  const refinedReasonsEl = document.getElementById("refined_reasons");
  const errorEl = document.getElementById("error");

  refinedNamesEl.textContent = "Refining...";
  refinedReasonsEl.textContent = "";
  errorEl.textContent = "";

  try {
    const response = await fetch(`${backendURL}/refine`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        names: originalNames.split("\n"),
        instruction: editPrompt
      })
    });

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const data = await response.json();
    refinedNamesEl.textContent = data.refined_names.join("\n");
    refinedReasonsEl.textContent = data.refined_reasons.join("\n");
  } catch (err) {
    errorEl.textContent = "Refinement failed. Try again.";
    console.error(err);
  }
}

// 🧠 Attach to window for HTML buttons
window.generateName = generateName;
window.surpriseMe = surpriseMe;
window.copyToClipboard = copyToClipboard;
window.refineNames = refineNames;

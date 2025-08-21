function initializeTopbar() {
    const hexagonButton = document.getElementById("hexagon-button");
    if (hexagonButton) {
        hexagonButton.addEventListener('click', window.toggleSidebar); 
    }

    const promptSpan = document.getElementById("showcase-prompt");
    const nameSpan = document.getElementById("showcase-name");

    if (promptSpan && nameSpan) {
        // Helper function to create a delay
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const type = async (element, text, speed) => {
            element.classList.add('typing');
            for (let i = 0; i < text.length; i++) {
                element.textContent += text.charAt(i);
                await sleep(speed);
            }
            element.classList.remove('typing');
        };

        const erase = async (element, speed) => {
            element.classList.add('typing');
            while (element.textContent.length > 0) {
                element.textContent = element.textContent.slice(0, -1);
                await sleep(speed);
            }
            element.classList.remove('typing');
        };

        const cycleNames = async (names) => {
            for (const name of names) {
                nameSpan.textContent = name;
                nameSpan.className = 'slide-in-down';
                await sleep(2000); // Wait 2 seconds while name is visible
                nameSpan.className = 'slide-out-down';
                await sleep(400); // Wait for slide-out animation to finish
            }
        };

        const runAnimationCycle = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/generate-for-showcase`, { method: "POST" });
                if (!response.ok) throw new Error("API request failed");
                const data = await response.json();

                // 1. Type the prompt
                await type(promptSpan, data.prompt, 50);
                
                // 2. Cycle through the names
                await cycleNames(data.names);
                
                // 3. Erase the prompt
                await sleep(1000); // Pause before erasing
                await erase(promptSpan, 25);
                
                // 4. Wait and start the next cycle
                await sleep(2000);
                runAnimationCycle();

            } catch (error) {
                console.error("Showcase animation failed:", error);
                await sleep(10000); // Wait longer on error before retrying
                runAnimationCycle();
            }
        };

        runAnimationCycle();
    }
}

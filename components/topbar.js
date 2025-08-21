function initializeTopbar() {
    const hexagonButton = document.getElementById("hexagon-button");
    if (hexagonButton) {
        hexagonButton.addEventListener('click', window.toggleSidebar); 
    }

    const promptSpan = document.getElementById("showcase-prompt");
    const nameSpan = document.getElementById("showcase-name");

    if (promptSpan && nameSpan) {
        const type = (element, text, speed, callback) => {
            element.textContent = '';
            element.classList.add('typing');
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(interval);
                    element.classList.remove('typing');
                    if (callback) callback();
                }
            }, speed);
        };

        const erase = (element, speed, callback) => {
            element.classList.add('typing');
            const interval = setInterval(() => {
                if (element.textContent.length > 0) {
                    element.textContent = element.textContent.slice(0, -1);
                } else {
                    clearInterval(interval);
                    element.classList.remove('typing');
                    if (callback) callback();
                }
            }, speed);
        };

        const cycleNames = (names, index = 0) => {
            if (index >= names.length) {
                // All names have been shown, trigger prompt deletion
                setTimeout(() => {
                    erase(promptSpan, 25, () => {
                        // Wait 2 seconds and start the next cycle
                        setTimeout(runAnimationCycle, 2000);
                    });
                }, 1000);
                return;
            }

            nameSpan.textContent = names[index];
            nameSpan.className = 'slide-in-down';

            setTimeout(() => {
                nameSpan.className = 'slide-out-down';
                // After slide out, call the next name in the cycle
                setTimeout(() => cycleNames(names, index + 1), 400);
            }, 2000); // How long each name stays on screen
        };

        async function runAnimationCycle() {
            try {
                const response = await fetch(`${BACKEND_URL}/generate-for-showcase`, { method: "POST" });
                const data = await response.json();

                // 1. Type the prompt
                type(promptSpan, data.prompt, 50, () => {
                    // 2. Start cycling through the names
                    cycleNames(data.names);
                });
            } catch (error) {
                console.error("Showcase animation failed:", error);
                setTimeout(runAnimationCycle, 10000);
            }
        }

        runAnimationCycle();
    }
}

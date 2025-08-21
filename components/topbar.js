// topbar.js

// This function will be called by main.js after the HTML is loaded
function initializeTopbar() {
    const hexagonButton = document.getElementById("hexagon-button");
    if (hexagonButton) {
        hexagonButton.addEventListener('click', window.toggleSidebar); 
    }

    const promptSpan = document.getElementById("showcase-prompt");
    const nameSpans = document.querySelectorAll("#showcase-names span");

    if (promptSpan && nameSpans.length === 3) {
        const type = (element, text, speed, callback) => {
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
        
        const animateItems = (items, animationClass, delay, callback) => {
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.className = animationClass;
                }, index * delay);
            });
            if (callback) {
                setTimeout(callback, items.length * delay);
            }
        };

        async function runAnimationCycle() {
            try {
                const response = await fetch(`${BACKEND_URL}/generate-for-showcase`, { method: "POST" });
                const data = await response.json();

                // 1. Type the prompt
                type(promptSpan, data.prompt, 50, () => {
                    // 2. Show the names one by one
                    nameSpans.forEach((span, i) => span.textContent = data.names[i]);
                    animateItems([...nameSpans], 'fade-in', 1000, () => {
                        // 3. Wait, then hide the names one by one
                        setTimeout(() => {
                            animateItems([...nameSpans].reverse(), 'fade-out', 500, () => {
                                // 4. Wait, then erase the prompt
                                setTimeout(() => {
                                    erase(promptSpan, 25, () => {
                                        // 5. Wait, then start the next cycle
                                        setTimeout(runAnimationCycle, 2000);
                                    });
                                }, 1000);
                            });
                        }, 3000);
                    });
                });
            } catch (error) {
                console.error("Showcase animation failed:", error);
                // If there's an error, wait a bit and try again
                setTimeout(runAnimationCycle, 10000);
            }
        }

        runAnimationCycle();
    }
}

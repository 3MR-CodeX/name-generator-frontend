// topbar.js

// This function will be called by main.js after the HTML is loaded
function initializeTopbar() {
    const hexagonButton = document.getElementById("hexagon-button");
    if (hexagonButton) {
        hexagonButton.addEventListener('click', window.toggleSidebar); 
    } else {
        console.error("Hexagon button not found in topbar.html");
    }

    const animatedTextSpan = document.getElementById("animated-text-span");
    if (animatedTextSpan) {
        const sentences = [
            "Name Anything And Everything.", "Describe It, We NameIT.", "Find The Perfect Name.",
            "Your Next Big Idea Starts Here.", "Brand Names, App Names, and More.", "From Startups to Side Projects.",
            "Unlock Your Creative Potential.", "Intelligent Naming, Instantly.", "Crafting Names That Resonate.",
            "Beyond the Dictionary.", "The Art of Naming, Simplified.", "Your Personal Branding Expert.",
            "Check Availability in Seconds.", "Analyze Your Brand's Strength.", "Refine Your Ideas with AI.",
            "For Companies, Products, and Pets.", "Naming Your Next Masterpiece.", "Where Great Names Are Born.",
            "Secure Your Brand Identity.", "Inspiration on Demand."
        ];
        let currentIndex = 0;

        function showNextSentence() {
            // Update text and apply the slide-in animation
            animatedTextSpan.textContent = sentences[currentIndex];
            animatedTextSpan.className = 'slide-in';

            // When the slide-in animation finishes...
            animatedTextSpan.addEventListener('animationend', function onSlideInEnd() {
                // Remove this event listener so it only runs once
                animatedTextSpan.removeEventListener('animationend', onSlideInEnd);

                // Wait for a few seconds before sliding out
                setTimeout(() => {
                    animatedTextSpan.className = 'slide-out';
                    
                    // When the slide-out animation finishes, start the next cycle
                    animatedTextSpan.addEventListener('animationend', function onSlideOutEnd() {
                        animatedTextSpan.removeEventListener('animationend', onSlideOutEnd);
                        currentIndex = (currentIndex + 1) % sentences.length;
                        showNextSentence();
                    });

                }, 4000); // How long the text stays on screen
            });
        }

        // Start the animation cycle
        showNextSentence();
    }
}

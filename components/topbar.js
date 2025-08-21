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
        let sentenceIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentSentence = sentences[sentenceIndex];
            
            // If deleting, remove a character. If typing, add a character.
            if (isDeleting) {
                animatedTextSpan.textContent = currentSentence.substring(0, charIndex - 1);
                charIndex--;
            } else {
                animatedTextSpan.textContent = currentSentence.substring(0, charIndex + 1);
                charIndex++;
            }

            // Determine the typing speed
            let typeSpeed = 80; // Decreased from 150 for faster typing
            if (isDeleting) {
                typeSpeed /= 2; // Deleting is faster
            }

            // If sentence is fully typed
            if (!isDeleting && charIndex === currentSentence.length) {
                typeSpeed = 3000; // Wait 3 seconds
                isDeleting = true;
            } 
            // If sentence is fully deleted
            else if (isDeleting && charIndex === 0) {
                typeSpeed = 2000; // Wait 2 seconds
                isDeleting = false;
                sentenceIndex = (sentenceIndex + 1) % sentences.length;
            }

            setTimeout(type, typeSpeed);
        }

        // Start the typing effect
        type();
    }
}

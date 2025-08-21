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

        // Set the first sentence immediately
        animatedTextSpan.textContent = sentences[currentIndex];

        // Set an interval to change the text. The CSS handles all the animation.
        setInterval(() => {
            currentIndex = (currentIndex + 1) % sentences.length;
            animatedTextSpan.textContent = sentences[currentIndex];
        }, 5000); // This must match the animation duration in the CSS
    }
}

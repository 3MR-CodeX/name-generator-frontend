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

        function cycleText() {
            // 1. Add the slide-out class to animate the current text away
            animatedTextSpan.classList.add('slide-out');

            // 2. After the slide-out animation finishes...
            setTimeout(() => {
                // ...update the text content...
                currentIndex = (currentIndex + 1) % sentences.length;
                animatedTextSpan.textContent = sentences[currentIndex];
                
                // ...and swap the classes to trigger the slide-in animation.
                animatedTextSpan.classList.remove('slide-out');
                animatedTextSpan.classList.add('slide-in');
            }, 500); // This must match the animation duration in your CSS

            // 3. After a few seconds, remove the slide-in class to prepare for the next cycle
            setTimeout(() => {
                animatedTextSpan.classList.remove('slide-in');
            }, 4500); // This should be slightly less than the setInterval delay
        }

        // Start the first animation immediately
        animatedTextSpan.textContent = sentences[currentIndex];
        animatedTextSpan.classList.add('slide-in');
        setTimeout(() => { animatedTextSpan.classList.remove('slide-in'); }, 4500);

        // Set the interval for cycling
        setInterval(cycleText, 5000); // Change text every 5 seconds
    }
}

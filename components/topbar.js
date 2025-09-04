// topbar.js

function initializeTopbar() {
    const hexagonButton = document.getElementById("hexagon-button");
    if (hexagonButton) {
        hexagonButton.addEventListener('click', window.toggleSidebar); 
    }

    const promptSpan = document.getElementById("showcase-prompt");
    const nameSpan = document.getElementById("showcase-name");

    if (promptSpan && nameSpan) {
        // This flag controls the execution of the animation loop.
        let animationCanRun = true;

        const showcaseData = [
            { prompt: "A cyberpunk detective agency", names: ["Chrono-Noir", "Nexus Point", "Synth-Shadow"] },
            { prompt: "A mystical underwater research facility", names: ["Aqua-Core", "Abyssal Labs", "Project Triton"] },
            { prompt: "A fantasy-themed bookstore", names: ["The Griffin's Tome", "Spellbound Scrolls", "The Story Forge"] },
            { prompt: "A coffee shop on Mars", names: ["Red Planet Roast", "The Olympus Grind", "Martian Mocha"] },
            { prompt: "A productivity app for artists", names: ["Canvas Flow", "Muse Mode", "Artisan's Desk"] },
            { prompt: "A brand of eco-friendly sneakers", names: ["Terra Tread", "Evergreen Kicks", "Leaf Sole"] },
            { prompt: "A heavy metal-themed barbecue restaurant", names: ["The Meat Hook", "Sizzle & Shred", "Grill 'Em All"] },
            { prompt: "A subscription box for rare teas", names: ["The Tea Crate", "Steep Society", "Global Infusions"] },
            { prompt: "A mobile game about building gardens in space", names: ["Cosmic Bloom", "Stardust Gardens", "Galaxy Flora"] },
            { prompt: "A vintage clothing store for rockstars", names: ["Retro Riffs", "The Velvet Fret", "Stage Worn"] }
        ];
        
        let dataIndex = 0;

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const type = async (element, text) => {
            element.classList.add('typing');
            for (let i = 0; i < text.length; i++) {
                if (!animationCanRun) break; 
                element.textContent += text.charAt(i);
                await sleep(50);
            }
            element.classList.remove('typing');
        };

        const erase = async (element) => {
            element.classList.add('typing');
            while (element.textContent.length > 0) {
                if (!animationCanRun) break;
                element.textContent = element.textContent.slice(0, -1);
                await sleep(25);
            }
            element.classList.remove('typing');
        };

        const cycleNames = async (names) => {
            for (const name of names) {
                if (!animationCanRun) break; 
                nameSpan.textContent = name;
                nameSpan.classList.add('visible');
                await sleep(2000); 
                nameSpan.classList.remove('visible');
                await sleep(400); 
            }
        };

        const runAnimationCycle = async () => {
            // Main check at the start of each cycle
            if (document.body.classList.contains('animations-disabled')) {
                animationCanRun = false;
                // Set a default static text when animation is off and exit
                promptSpan.textContent = "A fantasy-themed bookstore";
                nameSpan.textContent = "The Story Forge";
                nameSpan.classList.add('visible');
                promptSpan.classList.remove('typing');
                return;
            }
            animationCanRun = true;
            
            const data = showcaseData[dataIndex];
            dataIndex = (dataIndex + 1) % showcaseData.length;

            if (animationCanRun) await type(promptSpan, data.prompt);
            if (animationCanRun) await sleep(2000);
            if (animationCanRun) await cycleNames(data.names);
            if (animationCanRun) await sleep(1500);
            if (animationCanRun) await erase(promptSpan);
            if (animationCanRun) await sleep(2000);
            
            // Loop only if the flag is still true
            if(animationCanRun) {
               runAnimationCycle();
            }
        };

        // Listen for the global animation setting change from main.js
        window.addEventListener('animationSettingsChanged', () => {
            // If animations were just disabled, the loop will stop on its own.
            // If they were just enabled, we need to kickstart the loop again.
            if (!document.body.classList.contains('animations-disabled') && !animationCanRun) {
                runAnimationCycle();
            }
        });

        // Initial run
        runAnimationCycle();
    }
}

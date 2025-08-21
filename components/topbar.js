function initializeTopbar() {
    const hexagonButton = document.getElementById("hexagon-button");
    if (hexagonButton) {
        hexagonButton.addEventListener('click', window.toggleSidebar); 
    }

    const promptSpan = document.getElementById("showcase-prompt");
    const nameSpan = document.getElementById("showcase-name");

    if (promptSpan && nameSpan) {
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
            { prompt: "A vintage clothing store for rockstars", names: ["Retro Riffs", "The Velvet Fret", "Stage Worn"] },
            { prompt: "A company that makes smart home devices for pets", names: ["Paw Tech", "Critter Comfort", "Home Pet"] },
            { prompt: "A podcast about unsolved historical mysteries", names: ["Echoes of Time", "The History Vault", "Veiled Past"] },
            { prompt: "A line of hot sauce made with ghost peppers", names: ["Phantom Fire", "Specter Spice", "Reaper's Kiss"] },
            { prompt: "A VR experience that simulates flying", names: ["Aether Wings", "Skybound VR", "Project Icarus"] },
            { prompt: "A luxury brand of silk pajamas", names: ["Somnia Silk", "The Midnight Weave", "Luna Lair"] },
            { prompt: "A food truck that only sells gourmet grilled cheese", names: ["The Meltdown", "Golden Crust", "Cheese & Co."] },
            { prompt: "An AI tool that writes poetry", names: ["Verse Weaver", "The Digital Quill", "Sonnet AI"] },
            { prompt: "A brand of rugged, all-weather camping gear", names: ["Summit Bound", "Ridge Line", "Terra Firma Gear"] },
            { prompt: "A bakery specializing in magical-themed desserts", names: ["The Enchanted Oven", "Wizard's Whisk", "Fey Fare"] },
            { prompt: "A streaming service for indie horror films", names: ["ScreamBox", "The Midnight Hour", "Dread Central"] },
            { prompt: "A company that leads Northern Lights tours", names: ["Aurora Chasers", "Polaris Expeditions", "Sky Fire Tours"] },
            { prompt: "A high-tech, minimalist watch brand", names: ["Chronoform", "The Time Piece", "Momentum"] },
            { prompt: "A line of organic dog treats", names: ["Pawsitive Eats", "The Good Hound", "Bark Naturals"] },
            { prompt: "A journal app for lucid dreaming", names: ["Dream Weave", "The Oneironaut", "Lucid Log"] },
            { prompt: "A speakeasy-style cocktail bar", names: ["The Gilded Lily", "Whisper & Rye", "The Alchemist's Folly"] }
        ];
        
        let dataIndex = 0;

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const type = async (element, text, speed) => {
            element.textContent = '';
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
                await sleep(2000);
                nameSpan.className = 'slide-out-down';
                await sleep(400);
                nameSpan.className = '';
            }
        };

        const runAnimationCycle = async () => {
            try {
                const data = showcaseData[dataIndex];
                dataIndex = (dataIndex + 1) % showcaseData.length;

                await type(promptSpan, data.prompt, 50);
                await cycleNames(data.names);
                await sleep(1000);
                await erase(promptSpan, 25);
                await sleep(2000);
                runAnimationCycle();

            } catch (error) {
                console.error("Showcase animation failed:", error);
                await sleep(10000);
                runAnimationCycle();
            }
        };

        runAnimationCycle();
    }
}

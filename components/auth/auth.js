function initializeAuth() {
    if (window.env && window.env.FIREBASE_CONFIG) {
        firebase.initializeApp(window.env.FIREBASE_CONFIG);
        window.auth = firebase.auth();
        window.googleProvider = new firebase.auth.GoogleAuthProvider();
    } else {
        console.error("Firebase config not found.");
        return;
    }

    // --- DOM Element References ---
    const signInModal = document.getElementById("sign-in-modal");
    const signUpModal = document.getElementById("sign-up-modal");
    const authButtonsContainer = document.getElementById("auth-buttons");
    const userProfileContainer = document.getElementById("user-profile");
    const signInBtn = document.getElementById("top-bar-signin-btn");
    const signUpBtn = document.getElementById("top-bar-signup-btn");
    const userPfp = document.getElementById("user-pfp");
    const userName = document.getElementById("user-name");
    const userEmail = document.getElementById("user-email");
    const signInEmail = document.getElementById("signin-email");
    const signInPassword = document.getElementById("signin-password");
    const signInSubmit = document.getElementById("signin-submit-btn");
    const signInGoogle = document.getElementById("signin-google-btn");
    const authErrorMessageSignIn = document.getElementById("auth-error-message-signin");
    const signUpEmail = document.getElementById("signup-email");
    const signUpPassword = document.getElementById("signup-password");
    const signUpConfirmPassword = document.getElementById("signup-confirm-password");
    const signUpSubmit = document.getElementById("signup-submit-btn");
    const signUpGoogle = document.getElementById("signup-google-btn");
    const authErrorMessageSignUp = document.getElementById("auth-error-message-signup");
    const signOutLi = document.getElementById("sign-out-li");
    const signOutLink = document.getElementById("sign-out-link");
    const userStatusContainer = document.getElementById("user-status-container");
    const tierBadge = document.getElementById("tier-badge");
    const generationCounter = document.getElementById("generation-counter");
    const generationProgressBar = document.getElementById("generation-progress-bar");
    const fullHistoryLi = document.getElementById("full-history-li");

    // --- Event Listeners ---
    document.querySelectorAll('.auth-modal .close-button').forEach(btn => btn.addEventListener('click', closeAllAuthModals));
    window.addEventListener('click', (event) => {
        if (event.target === signInModal || event.target === signUpModal) closeAllAuthModals();
    });
    signInBtn.addEventListener('click', openSignInModal);
    signUpBtn.addEventListener('click', openSignUpModal);
    signOutLink.addEventListener('click', signOut); 
    signInSubmit.addEventListener('click', signInWithEmail);
    signUpSubmit.addEventListener('click', signUpWithEmail);
    signInGoogle.addEventListener('click', signInWithGoogle);
    signUpGoogle.addEventListener('click', signInWithGoogle);
    
    // --- Core Auth State Management ---
    auth.onAuthStateChanged(user => {
        updateUIForAuthState(user);
        if (typeof window.fetchHistory === 'function') window.fetchHistory(false);
    });

    // --- UI Update Functions ---
    function updateUIForAuthState(user) {
        document.querySelector(".generate-btn").disabled = false;
        document.querySelector(".surprise-btn").disabled = false;
        document.getElementById("error").textContent = "";

        if (user) { // User is Logged In
            authButtonsContainer.classList.add('hidden');
            userProfileContainer.classList.remove('hidden');
            signOutLi.classList.remove('hidden');
            fullHistoryLi.classList.remove('hidden'); // Show Full History
            userStatusContainer.classList.remove('hidden');

            userName.textContent = user.displayName || 'User';
            userEmail.textContent = user.email;
            userPfp.src = user.photoURL || `https://placehold.co/40x40/800080/FFFFFF?text=${(user.email?.[0] || 'U').toUpperCase()}`;
            userPfp.onerror = () => { userPfp.src = 'https://placehold.co/40x40/800080/FFFFFF?text=U'; };
            
            updateUserStatusUI(user);
        } else { // User is Logged Out
            authButtonsContainer.classList.remove('hidden');
            userProfileContainer.classList.add('hidden');
            signOutLi.classList.add('hidden');
            fullHistoryLi.classList.add('hidden'); // Hide Full History
            userStatusContainer.classList.add('hidden');
        }
    }

    function updateUserStatusUI(user) {
        // To preview other tiers, change the "tier" value in the line below.
        // Options: "Free Tier", "Premium Tier", "Business Tier"
        const mockUserData = { tier: "Free Tier" };

        const tiers = {
            "Free Tier": {
                className: 'free-tier',
                generationsLeft: 100,
                maxGenerations: 100,
            },
            "Premium Tier": {
                className: 'premium-tier',
                generationsLeft: 1000,
                maxGenerations: 1000,
            },
            "Business Tier": {
                className: 'business-tier',
                generationsLeft: Infinity,
                maxGenerations: Infinity,
            }
        };

        const userData = tiers[mockUserData.tier];

        tierBadge.textContent = mockUserData.tier;
        tierBadge.className = 'tier-badge';
        tierBadge.classList.add(userData.className);

        if (userData.generationsLeft === Infinity) {
            generationCounter.textContent = `Unlimited Generations`;
            generationProgressBar.style.width = `100%`;
        } else {
            generationCounter.textContent = `${userData.generationsLeft} / ${userData.maxGenerations} Generations Left`;
            const percentage = (userData.generationsLeft / userData.maxGenerations) * 100;
            generationProgressBar.style.width = `${percentage}%`;
        }
    }

    // --- Auth Action Functions ---
    function signUpWithEmail() {
        if (signUpPassword.value !== signUpConfirmPassword.value) {
            authErrorMessageSignUp.textContent = "Passwords do not match.";
            return;
        }
        auth.createUserWithEmailAndPassword(signUpEmail.value, signUpPassword.value)
            .then((userCredential) => {
                userCredential.user.sendEmailVerification();
                authErrorMessageSignUp.textContent = "Account created! Please check your email to verify.";
                setTimeout(closeAllAuthModals, 3000);
            })
            .catch(error => { authErrorMessageSignUp.textContent = error.message; });
    }

    function signInWithEmail() {
        auth.signInWithEmailAndPassword(signInEmail.value, signInPassword.value)
            .then(() => closeAllAuthModals())
            .catch(error => { authErrorMessageSignIn.textContent = error.message; });
    }

    function signInWithGoogle() {
        auth.signInWithPopup(window.googleProvider)
            .then(() => closeAllAuthModals())
            .catch(error => {
                authErrorMessageSignIn.textContent = error.message;
                authErrorMessageSignUp.textContent = error.message;
            });
    }

    function signOut(event) {
        event.preventDefault();
        if (window.confirm("Are you sure you want to sign out?")) {
            auth.signOut().catch(error => console.error("Sign out error:", error));
        }
    }

    function openSignInModal() {
        closeAllAuthModals();
        signInModal.classList.add('active');
    }

    function openSignUpModal() {
        closeAllAuthModals();
        signUpModal.classList.add('active');
    }

    function closeAllAuthModals() {
        if(signInModal) signInModal.classList.remove('active');
        if(signUpModal) signUpModal.classList.remove('active');
        if(authErrorMessageSignIn) authErrorMessageSignIn.textContent = '';
        if(authErrorMessageSignUp) authErrorMessageSignUp.textContent = '';
    }
}

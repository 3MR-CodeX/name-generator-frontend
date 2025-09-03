/// components/auth/auth.js

// These functions are now globally accessible
function openSignInModal() {
    const signInModal = document.getElementById("sign-in-modal");
    closeAllAuthModals();
    if (signInModal) signInModal.classList.add('active');
}

function openSignUpModal() {
    const signUpModal = document.getElementById("sign-up-modal");
    closeAllAuthModals();
    if (signUpModal) signUpModal.classList.add('active');
}

function closeAllAuthModals() {
    const signInModal = document.getElementById("sign-in-modal");
    const signUpModal = document.getElementById("sign-up-modal");
    const authErrorMessageSignIn = document.getElementById("auth-error-message-signin");
    const authErrorMessageSignUp = document.getElementById("auth-error-message-signup");

    if(signInModal) signInModal.classList.remove('active');
    if(signUpModal) signUpModal.classList.remove('active');
    if(authErrorMessageSignIn) authErrorMessageSignIn.textContent = '';
    if(authErrorMessageSignUp) authErrorMessageSignUp.textContent = '';
}


function initializeAuth() {
    if (!window.env || !window.env.FIREBASE_CONFIG) {
        console.error("Firebase config not found.");
        return;
    }
    firebase.initializeApp(window.env.FIREBASE_CONFIG);
    window.auth = firebase.auth();
    window.googleProvider = new firebase.auth.GoogleAuthProvider();

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
    const signOutLi = document.getElementById("sign-out-li");
    const signOutLink = document.getElementById("sign-out-link");
    const fullHistoryLi = document.getElementById("full-history-li");
    const verificationNotice = document.getElementById("verification-notice");
    const userStatusContainer = document.getElementById("user-status-container");
    const tierBadge = document.getElementById("tier-badge");
    const generationCounter = document.getElementById("generation-counter");
    const generationProgressBar = document.getElementById("generation-progress-bar");
    const accountDropdown = document.getElementById("account-dropdown");
    const tierDropdown = document.getElementById("tier-dropdown");
    const dropdownSignOutBtn = document.getElementById("dropdown-signout-btn");
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

    // --- UI Update Functions ---
    window.updateGenerationCountUI = (count) => {
        if (generationCounter) {
            generationCounter.textContent = `${count.toLocaleString()} Credits`;
        }
        if (generationProgressBar) {
            generationProgressBar.style.width = `100%`;
        }
    };
    
    function updateSubscriptionDisplay(data) {
        if (tierBadge) {
            tierBadge.textContent = data.tier;
            tierBadge.className = 'tier-badge';
            const tiers = { "Anonymous": 'free-tier', "Free Tier": 'free-tier', "Starter Tier": 'premium-tier', "Pro Tier": 'pro-tier', "Business Tier": 'business-tier' };
            if (tiers[data.tier]) {
                tierBadge.classList.add(tiers[data.tier]);
            }
        }
        updateTierDropdown(data.tier);
        window.updateGenerationCountUI(data.credits);
    }
    
    function updateTierDropdown(tier) {
        if (!tierDropdown) return;
    
        let content = '';
    
        if (tier === 'Pro Tier') {
            content = `
                <div class="tier-item">
                    <div class="tier-badge pro-tier">Pro Tier</div>
                    <p>Core access to the Name Generator and Custom Refiner, plus Pro tools.</p>
                </div>
                <div class="tier-item">
                    <button id="go-business-from-dropdown-btn" class="tier-badge business-tier">✨ Go Business</button>
                    <p>Unlock the ultimate potential of NameIT with exclusive tools and analysis.</p>
                </div>
            `;
        } else if (tier === 'Business Tier') {
            content = `
                <div class="tier-item">
                    <div class="tier-badge business-tier">Business Tier</div>
                    <p>You have unlocked all features, including exclusive tools and top-priority support.</p>
                </div>
            `;
        } else { // Free, Anonymous, Starter
            content = `
                <div class="tier-item">
                    <div class="tier-badge free-tier">Free Tier</div>
                    <p>Core access to the Name Generator and Custom Refiner.</p>
                </div>
                <div class="tier-item">
                    <button id="go-premium-from-dropdown-btn" class="tier-badge pro-tier">✨ Go Pro</button>
                    <p>Unlock advanced tools like the Availability Checker and Name Analyzer.</p>
                </div>
            `;
        }
    
        tierDropdown.innerHTML = content;
    }

    window.updateUserStatusUI = (user) => {
        const generateBtn = document.querySelector(".generate-btn");
        const surpriseBtn = document.querySelector(".surprise-btn");
        const errorDiv = document.getElementById("error");

        userStatusContainer.classList.add('hidden');
        verificationNotice.classList.add('hidden');
        authButtonsContainer.classList.add('hidden');
        userProfileContainer.classList.add('hidden');
        signOutLi.classList.add('hidden');
        fullHistoryLi.classList.add('hidden');
        if (accountDropdown) accountDropdown.classList.remove('visible');
        if (tierDropdown) tierDropdown.classList.remove('visible');

        if (user) { // --- USER IS LOGGED IN ---
            userProfileContainer.classList.remove('hidden');
            signOutLi.classList.remove('hidden');
            fullHistoryLi.classList.remove('hidden');
            userName.textContent = user.displayName || user.email;
            userPfp.src = user.photoURL || `https://placehold.co/40x40/800080/FFFFFF?text=${(user.email?.[0] || 'U').toUpperCase()}`;
            
            document.getElementById('account-name-detail').textContent = user.displayName || 'Not set';
            document.getElementById('account-email-detail').textContent = user.email;
            const creationDate = new Date(user.metadata.creationTime).toLocaleDateString();
            document.getElementById('account-created-detail').textContent = creationDate;
            
            user.reload().then(() => {
                if (user.emailVerified) {
                    if(generateBtn) generateBtn.disabled = false;
                    if(surpriseBtn) surpriseBtn.disabled = false;
                    userStatusContainer.classList.remove('hidden');
                    
                    user.getIdToken().then(token => {
                        fetch(`${BACKEND_URL}/status`, { headers: { 'Authorization': `Bearer ${token}` } })
                        .then(res => res.json())
                        .then(status => {
                            updateSubscriptionDisplay({
                                tier: status.tier,
                                credits: status.credits
                            });
                             // Set the data-tier for CSS styling
                            if (status.tier && status.tier !== 'Free Tier' && status.tier !== 'Anonymous') {
                                document.body.dataset.tier = status.tier.toLowerCase().replace(' tier', '');
                            } else {
                                delete document.body.dataset.tier;
                            }
                        });
                    });
                } else {
                    if(generateBtn) generateBtn.disabled = true;
                    if(surpriseBtn) surpriseBtn.disabled = true;
                    if(errorDiv) errorDiv.textContent = "";
                    verificationNotice.classList.remove('hidden');
                    verificationNotice.innerHTML = `Please check your inbox to verify your email address. <a id="resend-verification">Resend verification email.</a>`;
                    document.getElementById('resend-verification').addEventListener('click', resendVerificationEmail);
                }
            });
        } else { // --- USER IS NOT LOGGED IN (ANONYMOUS) ---
            if(generateBtn) generateBtn.disabled = false;
            if(surpriseBtn) surpriseBtn.disabled = false;
            authButtonsContainer.classList.remove('hidden');
            
            const anonGenerations = parseInt(localStorage.getItem('anonGenerations') || '0');
            userStatusContainer.classList.remove('hidden');
            updateSubscriptionDisplay({
                tier: "Anonymous",
                credits: Math.max(0, 25 - anonGenerations)
            });
            delete document.body.dataset.tier; // Ensure no premium styles for anon users
        }
    };

    // --- Core Auth State Management ---
    auth.onAuthStateChanged(user => {
        window.updateUserStatusUI(user);

        if (user && user.emailVerified) {
            // Fetch the custom claims to get the user's tier
            user.getIdTokenResult(true).then((idTokenResult) => {
                // The backend now stores tier in a custom claim called 'tier'
                const tier = idTokenResult.claims.tier || 'Free Tier';
                
                // Set the data-tier attribute on the body for dynamic CSS styling
                document.body.dataset.tier = tier.toLowerCase().replace(' tier', '').replace(' ', '-');
                
                // Update which features are locked/unlocked based on the tier
                if (typeof window.updateFeatureLocks === 'function') {
                    window.updateFeatureLocks(tier);
                }
                
                // Update the credit costs displayed in the UI
                if (typeof window.updateCreditCostsUI === 'function') {
                    window.updateCreditCostsUI(tier);
                }
            });
        } else {
            // Logic for logged-out or unverified users
            delete document.body.dataset.tier;
            if (typeof window.updateFeatureLocks === 'function') {
                window.updateFeatureLocks('Anonymous');
            }
            if (typeof window.updateCreditCostsUI === 'function') {
                window.updateCreditCostsUI('Anonymous');
            }
        }
    
        if (typeof window.fetchHistory === 'function') window.fetchHistory(false);
    });

    // --- Event Listeners and other functions ---
    if (signInBtn) signInBtn.addEventListener('click', openSignInModal);
    if (signUpBtn) signUpBtn.addEventListener('click', openSignUpModal);
    if (signOutLink) signOutLink.addEventListener('click', signOut);
    if (signInSubmit) signInSubmit.addEventListener('click', signInWithEmail);
    if (signUpSubmit) signUpSubmit.addEventListener('click', signUpWithEmail);
    if (signInGoogle) signInGoogle.addEventListener('click', signInWithGoogle);
    if (signUpGoogle) signUpGoogle.addEventListener('click', signInWithGoogle);
    if (userProfileContainer) userProfileContainer.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(accountDropdown); });
    if (tierBadge) tierBadge.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(tierDropdown); });
    if (dropdownSignOutBtn) dropdownSignOutBtn.addEventListener('click', signOut);
    document.querySelectorAll('.auth-modal .close-button').forEach(btn => btn.addEventListener('click', closeAllAuthModals));
    
    document.addEventListener('click', (event) => {
        if (accountDropdown && userProfileContainer && !userProfileContainer.contains(event.target)) {
            accountDropdown.classList.remove('visible');
        }
        if (tierDropdown && userStatusContainer && !userStatusContainer.contains(event.target)) {
            tierDropdown.classList.remove('visible');
        }
        if (event.target === signInModal || event.target === signUpModal) {
            closeAllAuthModals();
        }
    });

    function resendVerificationEmail() {
        const user = auth.currentUser;
        if (user) {
            user.sendEmailVerification()
                .then(() => {
                    if(verificationNotice) verificationNotice.innerHTML = `Verification email sent! Please check your inbox (and spam folder).`;
                })
                .catch(error => {
                    if(verificationNotice) verificationNotice.innerHTML = `Error: ${error.message}`;
                });
        }
    }
    
    function signUpWithEmail() {
        const email = signUpEmail.value;
        const password = signUpPassword.value;
        const confirmPassword = signUpConfirmPassword.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            authErrorMessageSignUp.textContent = "Please enter a valid email address format.";
            return;
        }
        if (password !== confirmPassword) {
            authErrorMessageSignUp.textContent = "Passwords do not match.";
            return;
        }
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                userCredential.user.sendEmailVerification();
                authErrorMessageSignUp.textContent = "Account created! A verification link has been sent to your email.";
                setTimeout(closeAllAuthModals, 3000);
            })
            .catch(error => {
                if (error.code == 'auth/email-already-in-use') {
                    authErrorMessageSignUp.textContent = "This email address is already in use.";
                } else if (error.code == 'auth/weak-password') {
                    authErrorMessageSignUp.textContent = "Password should be at least 6 characters.";
                } else {
                    authErrorMessageSignUp.textContent = error.message;
                }
            });
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
                if(authErrorMessageSignIn) authErrorMessageSignIn.textContent = error.message;
                if(authErrorMessageSignUp) authErrorMessageSignUp.textContent = error.message;
            });
    }

    function signOut(event) {
        event.preventDefault();
        if (window.confirm("Are you sure you want to sign out?")) {
            auth.signOut().catch(error => console.error("Sign out error:", error));
        }
    }

    function toggleDropdown(dropdown) {
        if (!dropdown) return;
        const isVisible = dropdown.classList.contains('visible');
        if (accountDropdown) accountDropdown.classList.remove('visible');
        if (tierDropdown) tierDropdown.classList.remove('visible');
        if (!isVisible) {
            dropdown.classList.add('visible');
        }
    }
}

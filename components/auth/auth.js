// components/auth/auth.js
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
        // Progress bar can be set to 100% or a dynamic value if there's a cap
        if (generationProgressBar) {
            generationProgressBar.style.width = `100%`;
        }
    };
    
    function updateSubscriptionDisplay(data) {
        if (tierBadge) {
            tierBadge.textContent = data.tier;
            tierBadge.className = 'tier-badge';
            const tiers = { "Anonymous": 'free-tier', "Free Tier": 'free-tier', "Premium Tier": 'premium-tier', "Business Tier": 'business-tier' };
            if (tiers[data.tier]) {
                tierBadge.classList.add(tiers[data.tier]);
            }
        }
        window.updateGenerationCountUI(data.credits);
    }
    
    window.updateUserStatusUI = (user) => {
        const generateBtn = document.querySelector(".generate-btn");
        const surpriseBtn = document.querySelector(".surprise-btn");
        const errorDiv = document.getElementById("error");

        // Hide all conditional UI elements by default
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
                    generateBtn.disabled = false;
                    surpriseBtn.disabled = false;
                    userStatusContainer.classList.remove('hidden');
                    
                    user.getIdToken().then(token => {
                        fetch(`${BACKEND_URL}/status`, { headers: { 'Authorization': `Bearer ${token}` } })
                        .then(res => res.json())
                        .then(status => {
                            updateSubscriptionDisplay({
                                tier: status.tier,
                                credits: status.credits
                            });
                        });
                    });
                } else {
                    generateBtn.disabled = true;
                    surpriseBtn.disabled = true;
                    errorDiv.textContent = "";
                    verificationNotice.classList.remove('hidden');
                    verificationNotice.innerHTML = `Please check your inbox to verify your email address. <a id="resend-verification">Resend verification email.</a>`;
                    document.getElementById('resend-verification').addEventListener('click', resendVerificationEmail);
                }
            });
        } else { // --- USER IS NOT LOGGED IN (ANONYMOUS) ---
            generateBtn.disabled = false;
            surpriseBtn.disabled = false;
            authButtonsContainer.classList.remove('hidden');
            
            const anonGenerations = parseInt(localStorage.getItem('anonGenerations') || '0');
            userStatusContainer.classList.remove('hidden');
            updateSubscriptionDisplay({
                tier: "Anonymous",
                credits: Math.max(0, 25 - anonGenerations)
            });
        }
    };

    // --- Core Auth State Management ---
    auth.onAuthStateChanged(user => {
        window.updateUserStatusUI(user);
        if (typeof window.fetchHistory === 'function') window.fetchHistory(false);
    });

    // --- Event Listeners and other functions ---
    signInBtn.addEventListener('click', openSignInModal);
    signUpBtn.addEventListener('click', openSignUpModal);
    signOutLink.addEventListener('click', signOut);
    signInSubmit.addEventListener('click', signInWithEmail);
    signUpSubmit.addEventListener('click', signUpWithEmail);
    signInGoogle.addEventListener('click', signInWithGoogle);
    signUpGoogle.addEventListener('click', signInWithGoogle);
    userProfileContainer.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(accountDropdown); });
    tierBadge.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(tierDropdown); });
    dropdownSignOutBtn.addEventListener('click', signOut);
    document.querySelectorAll('.auth-modal .close-button').forEach(btn => btn.addEventListener('click', closeAllAuthModals));
    
    document.addEventListener('click', (event) => {
        if (accountDropdown && !userProfileContainer.contains(event.target)) {
            accountDropdown.classList.remove('visible');
        }
        if (tierDropdown && !userStatusContainer.contains(event.target)) {
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
                    verificationNotice.innerHTML = `Verification email sent! Please check your inbox (and spam folder).`;
                })
                .catch(error => {
                    verificationNotice.innerHTML = `Error: ${error.message}`;
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

    window.openSignInModal = function() {
        closeAllAuthModals();
        signInModal.classList.add('active');
    }

    window.openSignUpModal = function() {
        closeAllAuthModals();
        signUpModal.classList.add('active');
    }

    function closeAllAuthModals() {
        if(signInModal) signInModal.classList.remove('active');
        if(signUpModal) signUpModal.classList.remove('active');
        if(authErrorMessageSignIn) authErrorMessageSignIn.textContent = '';
        if(authErrorMessageSignUp) authErrorMessageSignUp.textContent = '';
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

// components/auth/auth.js

function initializeAuth() {
    const auth = window.auth;
    const db = window.db;

    // CRITICAL FIX: If Firebase hasn't loaded yet, wait 100ms and try again. 
    if (!auth || !db) {
        setTimeout(initializeAuth, 100);
        return;
    }

    // Modal Elements (These are static and safe to query here)
    const signInModal = document.getElementById('sign-in-modal');
    const signUpModal = document.getElementById('sign-up-modal');
    
    const signInEmail = document.getElementById('sign-in-email');
    const signInPassword = document.getElementById('sign-in-password');
    const signInSubmit = document.getElementById('sign-in-submit');
    const signInGoogle = document.getElementById('sign-in-google');
    
    const signUpName = document.getElementById('sign-up-name');
    const signUpEmail = document.getElementById('sign-up-email');
    const signUpPassword = document.getElementById('sign-up-password');
    const signUpSubmit = document.getElementById('sign-up-submit');
    const signUpGoogle = document.getElementById('sign-up-google');

    const authErrorMessageSignIn = document.getElementById('auth-error-message-signin');
    const authErrorMessageSignUp = document.getElementById('auth-error-message-signup');

    let unsubscribeUserDoc = null;

    const TIER_LIMITS = {
        "Free Tier": 25,
        "Pro Tier": 2000,
        "Business Tier": 50000 
    };

    // --- Window Functions ---
    window.openSignInModal = () => {
        if(signInModal) signInModal.classList.add('active');
        if(signUpModal) signUpModal.classList.remove('active');
    };
    
    window.openSignUpModal = () => {
        if(signUpModal) signUpModal.classList.add('active');
        if(signInModal) signInModal.classList.remove('active');
    };

    window.closeAllAuthModals = () => {
        if(signInModal) signInModal.classList.remove('active');
        if(signUpModal) signUpModal.classList.remove('active');
        if(authErrorMessageSignIn) authErrorMessageSignIn.textContent = '';
        if(authErrorMessageSignUp) authErrorMessageSignUp.textContent = '';
    };

    window.updateGenerationCountUI = (credits) => {
        // FETCHED DYNAMICALLY to ensure the Topbar elements exist
        const generationsCount = document.getElementById('generations-count');
        const progressBarInner = document.getElementById('progress-bar-inner');

        if (generationsCount) generationsCount.textContent = `${credits} Credits left`;
        
        const currentTier = document.body.dataset.tier;
        let limit = TIER_LIMITS["Free Tier"];
        if (currentTier === "pro") limit = TIER_LIMITS["Pro Tier"];
        if (currentTier === "business") limit = TIER_LIMITS["Business Tier"];

        if (progressBarInner) {
            const percentage = Math.max(0, Math.min(100, (credits / limit) * 100));
            progressBarInner.style.width = `${percentage}%`;
            
            if (percentage < 20) progressBarInner.style.backgroundColor = '#ff5555';
            else if (percentage < 50) progressBarInner.style.backgroundColor = '#f1fa8c';
            else progressBarInner.style.backgroundColor = 'var(--progress-bar-color)';
        }
    };

    // --- Static Event Listeners ---
    document.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', window.closeAllAuthModals);
    });

    if (signInSubmit) signInSubmit.addEventListener('click', signInWithEmail);
    if (signUpSubmit) signUpSubmit.addEventListener('click', signUpWithEmail);
    if (signInGoogle) signInGoogle.addEventListener('click', signInWithGoogle);
    if (signUpGoogle) signUpGoogle.addEventListener('click', signInWithGoogle);

    const switchToSignUp = document.getElementById('switch-to-sign-up');
    const switchToSignIn = document.getElementById('switch-to-sign-in');
    if(switchToSignUp) switchToSignUp.addEventListener('click', (e) => { e.preventDefault(); window.openSignUpModal(); });
    if(switchToSignIn) switchToSignIn.addEventListener('click', (e) => { e.preventDefault(); window.openSignInModal(); });

    // --- Dynamic Topbar Event Listeners using Event Delegation ---
    document.body.addEventListener('click', (e) => {
        // Sign Out
        if (e.target && (e.target.id === 'sign-out-btn' || e.target.closest('#sign-out-btn'))) {
            signOut(e);
        }
        // Open Sign In
        if (e.target && (e.target.id === 'sign-in-btn' || e.target.closest('#sign-in-btn'))) {
            window.openSignInModal();
        }
        // Open Sign Up
        if (e.target && (e.target.id === 'sign-up-btn' || e.target.closest('#sign-up-btn'))) {
            window.openSignUpModal();
        }
        // Resend Verification
        if (e.target && e.target.id === 'resend-verification-link') {
            e.preventDefault();
            const user = auth.currentUser;
            if (user) {
                user.sendEmailVerification()
                    .then(() => alert('Verification email sent! Please check your inbox.'))
                    .catch((error) => alert('Error sending email: ' + error.message));
            }
        }
        
        // Handle dropdowns clicking
        const userProfileContainer = e.target.closest('#user-profile');
        const tierBadgeClick = e.target.closest('#user-tier-badge');
        
        const accountDropdown = document.getElementById('account-dropdown');
        const tierDropdown = document.getElementById('tier-dropdown');

        if (userProfileContainer) {
            e.stopPropagation();
            toggleDropdown(accountDropdown);
        } else if (tierBadgeClick) {
            e.stopPropagation();
            toggleDropdown(tierDropdown);
        } else {
            // Click outside closes dropdowns
            if(accountDropdown) accountDropdown.classList.remove('visible');
            if(tierDropdown) tierDropdown.classList.remove('visible');
        }
    });

    // --- Auth State Listener ---
    auth.onAuthStateChanged(user => {
        if (unsubscribeUserDoc) {
            unsubscribeUserDoc();
        }

        // CRITICAL FIX: Fetch Topbar Elements HERE dynamically so they are guaranteed to exist
        const authButtons = document.getElementById('auth-buttons');
        const userProfileContainer = document.getElementById('user-profile');
        const userStatusContainer = document.getElementById('user-status-container');
        const userProfilePic = document.getElementById('user-profile-pic');
        const userNameDisplay = document.getElementById('user-name-display');
        const userEmailDisplay = document.getElementById('user-email-display');
        const tierBadge = document.getElementById('user-tier-badge');
        const verificationNotice = document.getElementById('verification-notice');

        if (user) {
            const userRef = db.collection('users').doc(user.uid);

            if (authButtons) authButtons.classList.add('hidden');
            if (userProfileContainer) userProfileContainer.classList.remove('hidden');
            if (userStatusContainer) userStatusContainer.classList.remove('hidden');

            if (userProfilePic && user.photoURL) userProfilePic.src = user.photoURL;
            if (userNameDisplay) userNameDisplay.textContent = user.displayName || 'User';
            if (userEmailDisplay) userEmailDisplay.textContent = user.email;

            if (!user.emailVerified) {
                if (verificationNotice) {
                    verificationNotice.classList.remove('hidden');
                    verificationNotice.innerHTML = `Please verify your email address to unlock name refinement. <a id="resend-verification-link">Resend email</a>`;
                }
                const refineSection = document.getElementById("refine_section");
                const refineBtnSection = document.querySelector(".refine-button-section");
                if(refineSection) refineSection.classList.add("hidden");
                if(refineBtnSection) refineBtnSection.classList.add("hidden");
            } else {
                if (verificationNotice) verificationNotice.classList.add('hidden');
            }

            unsubscribeUserDoc = userRef.onSnapshot(doc => {
                let tier = 'Free Tier';
                let credits = 25;

                if (doc.exists) {
                    const data = doc.data();
                    tier = data.tier || 'Free Tier';
                    credits = data.credits !== undefined ? data.credits : 25;
                } else {
                    userRef.set({
                        email: user.email,
                        displayName: user.displayName || '',
                        tier: 'Free Tier',
                        credits: 25,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }

                if (tierBadge) {
                    tierBadge.innerHTML = `<span>${tier}</span>`;
                    tierBadge.className = 'tier-badge'; 
                    if (tier === 'Free Tier') tierBadge.classList.add('free-tier');
                    if (tier === 'Pro Tier') tierBadge.classList.add('pro-tier', 'animated-glow');
                    if (tier === 'Business Tier') tierBadge.classList.add('business-tier', 'animated-glow');
                }

                if (tier === 'Free Tier') document.body.dataset.tier = 'free';
                if (tier === 'Pro Tier') document.body.dataset.tier = 'pro';
                if (tier === 'Business Tier') document.body.dataset.tier = 'business';

                window.updateGenerationCountUI(credits);
                if (window.updateCreditCostsUI) window.updateCreditCostsUI(tier);
                if (window.updateFeatureLocks) window.updateFeatureLocks(tier);
                if (window.updatePremiumPage) window.updatePremiumPage(tier);
                
                document.querySelectorAll('.tier-specific-limit').forEach(el => el.classList.add('hidden'));
                const specificLimit = document.getElementById(`limit-${tier.split(' ')[0].toLowerCase()}`);
                if (specificLimit) specificLimit.classList.remove('hidden');

            });

        } else {
            if (authButtons) authButtons.classList.remove('hidden');
            if (userProfileContainer) userProfileContainer.classList.add('hidden');
            if (userStatusContainer) userStatusContainer.classList.add('hidden');
            if (verificationNotice) verificationNotice.classList.add('hidden');
            
            document.body.dataset.tier = 'free';
            
            let anonGenerations = parseInt(localStorage.getItem('anonGenerations') || '0');
            window.updateGenerationCountUI(Math.max(0, 25 - anonGenerations));
            if (window.updateCreditCostsUI) window.updateCreditCostsUI('Anonymous');
            if (window.updateFeatureLocks) window.updateFeatureLocks('Free Tier');
            if (window.updatePremiumPage) window.updatePremiumPage('Free Tier');
        }
    });

    // --- Authentication Actions ---
    function signUpWithEmail() {
        auth.createUserWithEmailAndPassword(signUpEmail.value, signUpPassword.value)
            .then((userCredential) => {
                const user = userCredential.user;
                return user.updateProfile({ displayName: signUpName.value }).then(() => {
                    user.sendEmailVerification();
                    db.collection('users').doc(user.uid).set({
                        email: user.email,
                        displayName: signUpName.value,
                        tier: 'Free Tier',
                        credits: 25,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    closeAllAuthModals();
                    alert("Account created successfully! Please check your email to verify your account.");
                });
            })
            .catch(error => {
                if (error.code === 'auth/weak-password') {
                    if(authErrorMessageSignUp) authErrorMessageSignUp.textContent = "Password should be at least 6 characters.";
                } else {
                    if(authErrorMessageSignUp) authErrorMessageSignUp.textContent = error.message;
                }
            });
    }

    function signInWithEmail() {
        auth.signInWithEmailAndPassword(signInEmail.value, signInPassword.value)
            .then(() => closeAllAuthModals())
            .catch(error => { if(authErrorMessageSignIn) authErrorMessageSignIn.textContent = error.message; });
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
        if(event) event.preventDefault();
        if (window.confirm("Are you sure you want to sign out?")) {
            auth.signOut().catch(error => console.error("Sign out error:", error));
        }
    }

    function toggleDropdown(dropdown) {
        if (!dropdown) return;
        
        const accountDropdown = document.getElementById('account-dropdown');
        const tierDropdown = document.getElementById('tier-dropdown');
        
        const isVisible = dropdown.classList.contains('visible');
        if (accountDropdown) accountDropdown.classList.remove('visible');
        if (tierDropdown) tierDropdown.classList.remove('visible');
        if (!isVisible) {
            dropdown.classList.add('visible');
        }
    }
}

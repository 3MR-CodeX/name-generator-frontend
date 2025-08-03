// components/auth/auth.js

function initializeAuth() {
    // --- Firebase Initialization ---
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
    
    // Sign In
    const signInEmail = document.getElementById("signin-email");
    const signInPassword = document.getElementById("signin-password");
    const signInSubmit = document.getElementById("signin-submit-btn");
    const signInGoogle = document.getElementById("signin-google-btn");
    const authErrorMessageSignIn = document.getElementById("auth-error-message-signin");

    // Sign Up
    const signUpEmail = document.getElementById("signup-email");
    const signUpPassword = document.getElementById("signup-password");
    const signUpConfirmPassword = document.getElementById("signup-confirm-password"); // New
    const signUpSubmit = document.getElementById("signup-submit-btn");
    const signUpGoogle = document.getElementById("signup-google-btn");
    const authErrorMessageSignUp = document.getElementById("auth-error-message-signup");
    
    // Sign Out
    const signOutLi = document.getElementById("sign-out-li"); // New
    const signOutLink = document.getElementById("sign-out-link"); // New

    // --- Event Listeners ---
    document.querySelectorAll('.auth-modal .close-button').forEach(btn => btn.addEventListener('click', closeAllAuthModals));
    window.addEventListener('click', (event) => {
        if (event.target === signInModal || event.target === signUpModal) closeAllAuthModals();
    });

    signInBtn.addEventListener('click', openSignInModal);
    signUpBtn.addEventListener('click', openSignUpModal);
    
    // FIXED: Sign out is now a dedicated button
    signOutLink.addEventListener('click', signOut); 

    signInSubmit.addEventListener('click', signInWithEmail);
    signUpSubmit.addEventListener('click', signUpWithEmail);
    signInGoogle.addEventListener('click', signInWithGoogle);
    signUpGoogle.addEventListener('click', signInWithGoogle);
    
    // --- Core Auth State Management ---
    auth.onAuthStateChanged(user => {
        updateUIForAuthState(user);
        // Fetch history for the current user (or anonymous)
        if (typeof window.fetchHistory === 'function') {
            window.fetchHistory(false);
        }
    });

    function updateUIForAuthState(user) {
        // FIXED: App features are always enabled
        document.querySelector(".generate-btn").disabled = false;
        document.querySelector(".surprise-btn").disabled = false;
        document.getElementById("error").textContent = "";

        if (user) { // User is Logged In
            authButtonsContainer.classList.add('hidden');
            userProfileContainer.classList.remove('hidden');
            signOutLi.classList.remove('hidden'); // Show sign out link

            userName.textContent = user.displayName || 'User';
            userEmail.textContent = user.email;
            // FIXED: Use a placeholder for the profile picture to avoid 404
            userPfp.src = user.photoURL || `https://placehold.co/40x40/800080/FFFFFF?text=${(user.email?.[0] || 'U').toUpperCase()}`;
            userPfp.onerror = () => { userPfp.src = 'https://placehold.co/40x40/800080/FFFFFF?text=U'; };

        } else { // User is Logged Out
            authButtonsContainer.classList.remove('hidden');
            userProfileContainer.classList.add('hidden');
            signOutLi.classList.add('hidden'); // Hide sign out link
        }
    }

    function signUpWithEmail() {
        const email = signUpEmail.value;
        const password = signUpPassword.value;
        const confirmPassword = signUpConfirmPassword.value;

        // NEW: Password confirmation
        if (password !== confirmPassword) {
            authErrorMessageSignUp.textContent = "Passwords do not match.";
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // NEW: Send verification email
                userCredential.user.sendEmailVerification();
                authErrorMessageSignUp.textContent = "Account created! Please check your email to verify your account.";
                setTimeout(closeAllAuthModals, 3000); // Close modal after a delay
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
        event.preventDefault(); // Prevent link from navigating
        auth.signOut().catch(error => console.error("Sign out error:", error));
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

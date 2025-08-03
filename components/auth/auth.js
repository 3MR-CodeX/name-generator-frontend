// components/auth/auth.js

// This function will now be called from main.js AFTER the top bar is loaded.
function initializeAuth() {
    // --- Firebase Initialization ---
    if (window.env && window.env.FIREBASE_CONFIG) {
        firebase.initializeApp(window.env.FIREBASE_CONFIG);
        window.auth = firebase.auth();
        window.googleProvider = new firebase.auth.GoogleAuthProvider();
    } else {
        console.error("Firebase config not found.");
        return; // Stop if firebase isn't configured
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
    const signUpEmail = document.getElementById("signup-email");
    const signUpPassword = document.getElementById("signup-password");
    const signUpSubmit = document.getElementById("signup-submit-btn");
    const signUpGoogle = document.getElementById("signup-google-btn");
    const authErrorMessageSignIn = document.getElementById("auth-error-message-signin");
    const authErrorMessageSignUp = document.getElementById("auth-error-message-signup");

    // --- Event Listeners ---
    document.querySelectorAll('.auth-modal .close-button').forEach(btn => btn.addEventListener('click', closeAllAuthModals));
    window.addEventListener('click', (event) => {
        if (event.target === signInModal || event.target === signUpModal) {
            closeAllAuthModals();
        }
    });

    signInBtn.addEventListener('click', openSignInModal);
    signUpBtn.addEventListener('click', openSignUpModal);
    userProfileContainer.addEventListener('click', signOut); // Sign out on profile click
    signInSubmit.addEventListener('click', signInWithEmail);
    signUpSubmit.addEventListener('click', signUpWithEmail);
    signInGoogle.addEventListener('click', signInWithGoogle);
    signUpGoogle.addEventListener('click', signInWithGoogle);
    
    // --- Core Auth State Management ---
    // This listener is now safely attached only after the DOM is ready.
    auth.onAuthStateChanged(user => {
        updateUIForAuthState(user);
        if (user) {
            if (typeof window.fetchHistory === 'function') {
                window.fetchHistory(false);
            }
        } else {
            if (typeof window.resetDynamicSections === 'function') {
                window.resetDynamicSections();
                document.getElementById('history').innerHTML = "<p>*Log in to see your history.*</p>";
            }
        }
    });

    function updateUIForAuthState(user) {
        const generateBtn = document.querySelector(".generate-btn");
        const surpriseBtn = document.querySelector(".surprise-btn");
        const errorDiv = document.getElementById("error");

        if (user) {
            authButtonsContainer.classList.add('hidden');
            userProfileContainer.classList.remove('hidden');
            userName.textContent = user.displayName || 'User';
            userEmail.textContent = user.email;
            userPfp.src = user.photoURL || 'default-pfp.png';
            generateBtn.disabled = false;
            surpriseBtn.disabled = false;
            errorDiv.textContent = "";
        } else {
            authButtonsContainer.classList.remove('hidden');
            userProfileContainer.classList.add('hidden');
            generateBtn.disabled = true;
            surpriseBtn.disabled = true;
            errorDiv.textContent = "Please sign in to generate names.";
        }
    }

    function signUpWithEmail() {
        auth.createUserWithEmailAndPassword(signUpEmail.value, signUpPassword.value)
            .then(() => closeAllAuthModals())
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

    function signOut() {
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
        signInModal.classList.remove('active');
        signUpModal.classList.remove('active');
        authErrorMessageSignIn.textContent = '';
        authErrorMessageSignUp.textContent = '';
    }
}

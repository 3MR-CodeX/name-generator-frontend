// components/auth/auth.js

// --- Firebase Initialization ---
// The configuration is now in config.js
if (window.env && window.env.FIREBASE_CONFIG) {
    firebase.initializeApp(window.env.FIREBASE_CONFIG);
    window.auth = firebase.auth();
    window.googleProvider = new firebase.auth.GoogleAuthProvider();
} else {
    console.error("Firebase config not found. Make sure config.js is loaded correctly.");
}


// --- DOM Element References ---
let signInModal, signUpModal, authSection;
let authButtonsContainer, userProfileContainer;
let signInBtn, signUpBtn;
let userPfp, userName, userEmail;
let signInEmail, signInPassword, signInSubmit, signInGoogle;
let signUpEmail, signUpPassword, signUpSubmit, signUpGoogle;
let authErrorMessageSignIn, authErrorMessageSignUp;

function initializeAuthElements() {
    // Modals
    signInModal = document.getElementById("sign-in-modal");
    signUpModal = document.getElementById("sign-up-modal");

    // Top Bar Sections
    authSection = document.getElementById("auth-section");
    authButtonsContainer = document.getElementById("auth-buttons");
    userProfileContainer = document.getElementById("user-profile");
    
    // Auth buttons in top bar
    signInBtn = document.getElementById("top-bar-signin-btn");
    signUpBtn = document.getElementById("top-bar-signup-btn");

    // User Profile Display
    userPfp = document.getElementById("user-pfp");
    userName = document.getElementById("user-name");
    userEmail = document.getElementById("user-email");

    // Sign In Modal Elements
    signInEmail = document.getElementById("signin-email");
    signInPassword = document.getElementById("signin-password");
    signInSubmit = document.getElementById("signin-submit-btn");
    signInGoogle = document.getElementById("signin-google-btn");
    authErrorMessageSignIn = document.getElementById("auth-error-message-signin");

    // Sign Up Modal Elements
    signUpEmail = document.getElementById("signup-email");
    signUpPassword = document.getElementById("signup-password");
    signUpSubmit = document.getElementById("signup-submit-btn");
    signUpGoogle = document.getElementById("signup-google-btn");
    authErrorMessageSignUp = document.getElementById("auth-error-message-signup");

    // Event Listeners
    setupEventListeners();
}

// --- Event Listeners ---
function setupEventListeners() {
    // Modal controls
    document.querySelectorAll('.auth-modal .close-button').forEach(btn => btn.addEventListener('click', closeAllAuthModals));
    window.addEventListener('click', (event) => {
        if (event.target === signInModal || event.target === signUpModal) {
            closeAllAuthModals();
        }
    });

    // Top bar buttons
    signInBtn.addEventListener('click', openSignInModal);
    signUpBtn.addEventListener('click', openSignUpModal);
    userProfileContainer.addEventListener('click', signOut); // Sign out on profile click

    // Form submissions
    signInSubmit.addEventListener('click', signInWithEmail);
    signUpSubmit.addEventListener('click', signUpWithEmail);

    // Google Sign-in
    signInGoogle.addEventListener('click', signInWithGoogle);
    signUpGoogle.addEventListener('click', signInWithGoogle);
}

// --- Core Auth State Management ---
auth.onAuthStateChanged(user => {
    updateUIForAuthState(user);
    if (user) {
        // User is signed in
        if (typeof window.fetchHistory === 'function') {
            window.fetchHistory(false); // Fetch history for the logged-in user
        }
    } else {
        // User is signed out
        if (typeof window.resetDynamicSections === 'function') {
            window.resetDynamicSections(); // Clear the UI
            document.getElementById('history').innerHTML = "<p>*Log in to see your history.*</p>";
        }
    }
});


function updateUIForAuthState(user) {
    const generateBtn = document.querySelector(".generate-btn");
    const surpriseBtn = document.querySelector(".surprise-btn");
    const refineBtn = document.querySelector(".refine-btn");
    const errorDiv = document.getElementById("error");

    if (user) {
        // --- User is Logged In ---
        authButtonsContainer.classList.add('hidden');
        userProfileContainer.classList.remove('hidden');

        // Populate user info
        userName.textContent = user.displayName || 'User';
        userEmail.textContent = user.email;
        userPfp.src = user.photoURL || 'default-pfp.png'; // Provide a default avatar

        // Enable app features
        generateBtn.disabled = false;
        surpriseBtn.disabled = false;
        // refineBtn is enabled/disabled based on context in main.js
        errorDiv.textContent = "";

    } else {
        // --- User is Logged Out ---
        authButtonsContainer.classList.remove('hidden');
        userProfileContainer.classList.add('hidden');

        // Disable app features
        generateBtn.disabled = true;
        surpriseBtn.disabled = true;
        refineBtn.disabled = true;
        errorDiv.textContent = "Please sign in to generate names.";
    }
}


// --- Auth Action Functions ---
function signUpWithEmail() {
    const email = signUpEmail.value;
    const password = signUpPassword.value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            closeAllAuthModals();
            // User is automatically signed in, onAuthStateChanged will handle the rest
        })
        .catch(error => {
            authErrorMessageSignUp.textContent = error.message;
        });
}

function signInWithEmail() {
    const email = signInEmail.value;
    const password = signInPassword.value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            closeAllAuthModals();
            // User is signed in, onAuthStateChanged will handle the rest
        })
        .catch(error => {
            authErrorMessageSignIn.textContent = error.message;
        });
}

function signInWithGoogle() {
    auth.signInWithPopup(window.googleProvider)
        .then(result => {
            closeAllAuthModals();
            // User is signed in, onAuthStateChanged will handle the rest
        })
        .catch(error => {
            authErrorMessageSignIn.textContent = error.message;
            authErrorMessageSignUp.textContent = error.message;
        });
}

function signOut() {
    auth.signOut().catch(error => console.error("Sign out error:", error));
}


// --- Modal Control Functions ---
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
    // Clear error messages on close
    if(authErrorMessageSignIn) authErrorMessageSignIn.textContent = '';
    if(authErrorMessageSignUp) authErrorMessageSignUp.textContent = '';
}

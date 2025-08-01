// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase with your provided configuration
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper function to show and hide modals
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Function to update the top bar based on the user's authentication status
function updateAuthUI(user) {
    const authButtons = document.getElementById('auth-buttons');
    const userInfoContainer = document.getElementById('user-info-container');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userPfpElement = document.getElementById('user-pfp');

    if (authButtons && userInfoContainer) {
        if (user) {
            // User is signed in
            authButtons.style.display = 'none';
            userInfoContainer.style.display = 'flex';
            userInfoContainer.classList.add('signed-in');
            
            // Update user info
            userNameElement.textContent = user.displayName || 'User';
            userEmailElement.textContent = user.email;
            if (user.photoURL) {
                userPfpElement.src = user.photoURL;
            } else {
                // Placeholder for users without a profile picture
                userPfpElement.src = `https://placehold.co/40x40/800080/FFFFFF?text=${user.email.charAt(0).toUpperCase()}`;
            }
        } else {
            // User is signed out
            authButtons.style.display = 'flex';
            userInfoContainer.style.display = 'none';
            userInfoContainer.classList.remove('signed-in');
            
            // Hide the dropdown in case it was open
            const profileDropdown = document.getElementById('profile-dropdown');
            if (profileDropdown) {
                profileDropdown.style.display = 'none';
            }
        }
    }
}

// Event listeners for modal close buttons and overlay
document.querySelectorAll('.modal .close-button, #overlay').forEach(element => {
    element.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    });
});

// Event listener for email/password sign-up
document.getElementById('create-account-btn').addEventListener('click', async () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created:', userCredential.user);
        hideModal('signup-modal');
    } catch (error) {
        console.error('Error creating user:', error.message);
        document.getElementById('error').textContent = error.message;
    }
});

// Event listener for email/password sign-in
document.getElementById('signin-btn').addEventListener('click', async () => {
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', userCredential.user);
        hideModal('signin-modal');
    } catch (error) {
        console.error('Error signing in:', error.message);
        document.getElementById('error').textContent = error.message;
    }
});

// Event listener for Google Sign Up/Sign In
const googleProvider = new GoogleAuthProvider();

document.getElementById('signup-google-btn').addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Google Sign-up successful:', result.user);
        hideModal('signup-modal');
    } catch (error) {
        console.error('Google Sign-up error:', error);
        document.getElementById('error').textContent = error.message;
    }
});

document.getElementById('signin-google-btn').addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Google Sign-in successful:', result.user);
        hideModal('signin-modal');
    } catch (error) {
        console.error('Google Sign-in error:', error);
        document.getElementById('error').textContent = error.message;
    }
});

// Event listener for Sign Out
const signoutBtn = document.getElementById('signout-btn');
if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log('User signed out');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    });
}

// Listen for auth state changes to update the UI
onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
});

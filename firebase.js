// firebase_auth.js

// Make sure Firebase SDK is loaded before this script runs.
// The index.html file handles loading the SDK and assigning auth and db to window.

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
        document.getElementById('profile-dropdown').style.display = 'none';
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
        const userCredential = await window.createUserWithEmailAndPassword(window.auth, email, password);
        // User account created successfully
        console.log('User created:', userCredential.user);
        hideModal('signup-modal');
    } catch (error) {
        // Handle errors here
        console.error('Error creating user:', error.message);
        // Display error message in the UI
        document.getElementById('error').textContent = error.message;
    }
});

// Event listener for email/password sign-in
document.getElementById('signin-btn').addEventListener('click', async () => {
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    try {
        const userCredential = await window.signInWithEmailAndPassword(window.auth, email, password);
        // User signed in successfully
        console.log('User signed in:', userCredential.user);
        hideModal('signin-modal');
    } catch (error) {
        // Handle errors here
        console.error('Error signing in:', error.message);
        // Display error message in the UI
        document.getElementById('error').textContent = error.message;
    }
});

// Event listener for Google Sign Up
document.getElementById('signup-google-btn').addEventListener('click', async () => {
    const provider = new window.GoogleAuthProvider();
    try {
        const result = await window.inWithPopup(window.auth, provider);
        // Google Sign-up successful
        console.log('Google Sign-up successful:', result.user);
        hideModal('signup-modal');
    } catch (error) {
        console.error('Google Sign-up error:', error);
        // Display error message in the UI
        document.getElementById('error').textContent = error.message;
    }
});

// Event listener for Google Sign In
document.getElementById('signin-google-btn').addEventListener('click', async () => {
    const provider = new window.GoogleAuthProvider();
    try {
        const result = await window.inWithPopup(window.auth, provider);
        // Google Sign-in successful
        console.log('Google Sign-in successful:', result.user);
        hideModal('signin-modal');
    } catch (error) {
        console.error('Google Sign-in error:', error);
        // Display error message in the UI
        document.getElementById('error').textContent = error.message;
    }
});

// Event listener for Sign Out
document.getElementById('signout-btn').addEventListener('click', async () => {
    try {
        await window.signOut(window.auth);
        console.log('User signed out');
    } catch (error) {
        console.error('Sign out error:', error);
    }
});

// Listen for auth state changes to update the UI
window.onAuthStateChanged(window.auth, async (user) => {
    updateAuthUI(user);
    if (user) {
        // Sign in with custom token if available
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token !== null) {
            try {
                await window.signInWithCustomToken(window.auth, __initial_auth_token);
                console.log('Signed in with custom token.');
            } catch (error) {
                console.error('Error signing in with custom token:', error);
            }
        }
    }
});



// config.js
window.env = {
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:8000",
  BACKEND_API_KEY: process.env.BACKEND_API_KEY || "fallback-key-for-local-testing"
};

// Firebase Client Configuration (NEW)
// REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIG OBJECT
// You can find this in your Firebase Project Settings -> General -> Your apps
window.__firebase_config = `{
  "apiKey": "YOUR_FIREBASE_API_KEY",
  "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT_ID.appspot.com",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "appId": "YOUR_APP_ID"
}`;

// This token is provided by the Canvas environment for initial authentication.
// If not in Canvas, it will be undefined, and anonymous sign-in will be used.
window.__initial_auth_token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;


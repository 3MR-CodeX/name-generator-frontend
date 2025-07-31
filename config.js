// config.js
window.env = {
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:8000",
  BACKEND_API_KEY: process.env.BACKEND_API_KEY || "fallback-key-for-local-testing"
};

// Firebase Client Configuration (NEW)
// REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIG OBJECT
// You can find this in your Firebase Project Settings -> General -> Your apps
window.__firebase_config = `{
  "apiKey": "AIzaSyDT7kkBgflIKI432uxY_piFueCzmqmPD6U",
  "authDomain": "nameit-app-nit.firebaseapp.com",
  "projectId": "nameit-app-nit",
  "storageBucket": "nameit-app-nit.firebasestorage.app",
  "messagingSenderId": "255958152641",
  "appId": "1:255958152641:web:d56fa5b2c95945bac5ab40",
  "measurementId": "G-J9XGX5BVFR"
}`;

// This token is provided by the Canvas environment for initial authentication.
// If not in Canvas, it will be undefined, and anonymous sign-in will be used.
window.__initial_auth_token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

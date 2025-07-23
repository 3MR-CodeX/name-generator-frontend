// config.js
window.env = {
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:8000",
  BACKEND_API_KEY: process.env.BACKEND_API_KEY || "fallback-key-for-local-testing"
};

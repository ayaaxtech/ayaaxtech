// Firebase logic using Compat CDN (Global firebase object)
// This avoids the 'Component auth has not been registered yet' error by using a single global registry.

declare var firebase: any;

const firebaseConfig = {
  apiKey: "AIzaSyBl3pAgOmAm3_Ih02gRQ2Q66JnLyjNPYeQ",
  authDomain: "ayaax-tech.firebaseapp.com",
  projectId: "ayaax-tech",
  storageBucket: "ayaax-tech.firebasestorage.app",
  messagingSenderId: "912766525303",
  appId: "1:912766525303:web:d46686a63fb895308a8b72",
  measurementId: "G-DR0S2KZ1TE"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export Auth instance
export const auth = firebase.auth();

// Export Google Provider
export const provider = new firebase.auth.GoogleAuthProvider();

// Alias for compatibility with existing imports in LandingPage.tsx
export const googleProvider = provider;

// Compatibility exports
export const isFirebaseReady = true;
export const initializationError = null;

// Auth Helper
export function signInWithGoogle() {
  return auth.signInWithPopup(provider);
}

// Optional Analytics (if script is added to HTML)
export const analytics = firebase.analytics ? firebase.analytics() : null;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAG4DKY0s8gPdbe8VEYkNcql-TvZIm2-qA",
  authDomain: "rentrider-26626.firebaseapp.com",
  projectId: "rentrider-26626",
  storageBucket: "rentrider-26626.firebasestorage.app",
  messagingSenderId: "963227422013",
  appId: "1:963227422013:web:ba21e86a225f44450f8954",
  measurementId: "G-GF7QQZSYPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Configure Firestore to work better in offline mode
if (process.env.NODE_ENV === 'development') {
  // Enable offline persistence for development
  try {
    // Note: This is commented out as it can cause issues in development
    // enableNetwork(db);
  } catch (error) {
    console.warn('Firestore offline persistence setup failed:', error);
  }
}

// Configure auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Configure Facebook provider
facebookProvider.setCustomParameters({
  display: 'popup',
});

export {
  auth,
  db,
  googleProvider,
  facebookProvider
};

export default app;

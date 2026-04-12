// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhES4H51a5E6ZCP3eBlwUpweX1Qi2qIR8",
  authDomain: "farmhith-893f4.firebaseapp.com",
  projectId: "farmhith-893f4",
  storageBucket: "farmhith-893f4.firebasestorage.app",
  messagingSenderId: "560879991571",
  appId: "1:560879991571:web:17a9202e23b72ef62cb8e6",
  measurementId: "G-D8LP47R14W"
};

// Initialize Firebase securely (avoiding double initialization in Next.js hot reloads)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics is only supported in browser environments
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };

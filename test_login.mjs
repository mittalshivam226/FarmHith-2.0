import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhES4H51a5E6ZCP3eBlwUpweX1Qi2qIR8",
  authDomain: "farmhith-893f4.firebaseapp.com",
  projectId: "farmhith-893f4",
  storageBucket: "farmhith-893f4.firebasestorage.app",
  messagingSenderId: "560879991571",
  appId: "1:560879991571:web:17a9202e23b72ef62cb8e6",
  measurementId: "G-D8LP47R14W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testLogin() {
  try {
    const userCred = await signInWithEmailAndPassword(auth, "admin@farmhith.in", "admin123");
    console.log("Success! UID:", userCred.user.uid);
  } catch (err) {
    console.error("FAIL:", err.message);
  }
  process.exit();
}

testLogin();

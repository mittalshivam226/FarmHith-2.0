import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import fs from "fs";

// Simple manual dotenv
const envFile = fs.readFileSync("./apps/admin/.env.local", "utf8");
const envVars = {};
envFile.split("\n").forEach(line => {
  const parts = line.split("=");
  if (parts.length > 1) {
    envVars[parts[0].trim()] = parts.slice(1).join("=").trim().replace(/(^"|"$)/g, '');
  }
});

const firebaseConfig = {
  apiKey: envVars["NEXT_PUBLIC_FIREBASE_API_KEY"],
  authDomain: envVars["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"],
  projectId: envVars["NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
  storageBucket: envVars["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: envVars["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"],
  appId: envVars["NEXT_PUBLIC_FIREBASE_APP_ID"]
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function setupAdmin() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, "admin@farmhith.in", "admin123");
    const uid = userCredential.user.uid;
    console.log("Authenticated UID:", uid);

    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        console.log("Document does not exist. Creating it!");
    } else {
        console.log("Document exists:", snap.data());
    }

    await setDoc(userRef, {
      uid: uid,
      email: "admin@farmhith.in",
      role: "ADMIN",
      createdAt: new Date().toISOString(),
      name: "Super Admin"
    }, { merge: true });

    console.log("Successfully set /users/" + uid + " with role: ADMIN");
    process.exit(0);
  } catch(e) {
    console.error("Failed:", e);
    process.exit(1);
  }
}

setupAdmin();


import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the Firebase configuration from the auto-generated file
import firebaseConfig from '../firebase-applet-config.json';

if (!firebaseConfig || !firebaseConfig.projectId || firebaseConfig.projectId === "TODO_PROJECT_ID") {
  console.error("Firebase configuration is missing or invalid. Please check firebase-applet-config.json");
}

// Log project info to help debugging (API key is hidden for security)
console.log("Initializing Firebase for project:", firebaseConfig.projectId);

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export default app;

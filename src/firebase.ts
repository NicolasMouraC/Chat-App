import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC0hOx90Ls3Kqyb6rFuGXkIW02B0MQRCHg",
  authDomain: "chat-app-b828c.firebaseapp.com",
  projectId: "chat-app-b828c",
  storageBucket: "chat-app-b828c.firebasestorage.app",
  messagingSenderId: "623088635453",
  appId: "1:623088635453:web:babf15cc51354b11b8a454",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const rtdb = getDatabase(app);

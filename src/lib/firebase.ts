// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbuS5RYFTgRKMKvb34M20GDFXTBh9nBB4",
  authDomain: "dxai-f94f0.firebaseapp.com",
  projectId: "dxai-f94f0",
  storageBucket: "dxai-f94f0.firebasestorage.app",
  messagingSenderId: "695185229581",
  appId: "1:695185229581:web:bf7dc38aaaa78be569d244"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
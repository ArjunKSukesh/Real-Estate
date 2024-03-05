// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-3469b.firebaseapp.com",
  projectId: "real-estate-3469b",
  storageBucket: "real-estate-3469b.appspot.com",
  messagingSenderId: "948796854946",
  appId: "1:948796854946:web:e8cc6cd90e3f01d465fdfb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
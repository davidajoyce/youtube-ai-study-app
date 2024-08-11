// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPzQkongvLCXhHxNLJPsMppHZxta3iYdY",
  authDomain: "study-2c2ea.firebaseapp.com",
  projectId: "study-2c2ea",
  storageBucket: "study-2c2ea.appspot.com",
  messagingSenderId: "424929637589",
  appId: "1:424929637589:web:468a6ecc42c426f6b65e5c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
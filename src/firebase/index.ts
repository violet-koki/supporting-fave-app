// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuxHCfrNH7nq59FLHf2CSwr5Fm5WbKlX8",
  authDomain: "fave-app-18c04.firebaseapp.com",
  projectId: "fave-app-18c04",
  storageBucket: "fave-app-18c04.firebasestorage.app",
  messagingSenderId: "273809521181",
  appId: "1:273809521181:web:63c6b27a7ac81b0816e4f4",
  measurementId: "G-CY7BKPQK6C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage }
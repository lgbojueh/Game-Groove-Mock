// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5ODtwPo8prD3h1CAQyxM4j3ME38H9SqM",
  authDomain: "gamegroove.firebaseapp.com",
  projectId: "gamegroove",
  storageBucket: "gamegroove.firebasestorage.app",
  messagingSenderId: "999915937285",
  appId: "1:999915937285:web:13e01c57c3619d0a64866c",
  measurementId: "G-GSRSGTWS26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)

export { app, auth };
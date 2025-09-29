// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3--RTERjPb1yjhI7W80C6iYcfMRVTzro",
  authDomain: "marketmoves-a7868.firebaseapp.com",
  projectId: "marketmoves-a7868",
  storageBucket: "marketmoves-a7868.firebasestorage.app",
  messagingSenderId: "697228798423",
  appId: "1:697228798423:web:596a2b5977ff610a380392",
  measurementId: "G-3Y52371Y2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
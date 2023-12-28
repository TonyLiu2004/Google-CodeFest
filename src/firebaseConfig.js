// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFOuZzqcqjYmZefaaR2h1Lpcc0yohTh7U",
  authDomain: "codefest-97b85.firebaseapp.com",
  projectId: "codefest-97b85",
  storageBucket: "codefest-97b85.appspot.com",
  messagingSenderId: "913525027667",
  appId: "1:913525027667:web:e7007d266da91e097c67a6",
  measurementId: "G-9JDY9NV33E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
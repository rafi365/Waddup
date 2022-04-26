import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCh0OtU9PeSgz1mdW6SyZ7HbWo0VbX7z2E",
    authDomain: "waddup-b49eb.firebaseapp.com",
    projectId: "waddup-b49eb",
    storageBucket: "waddup-b49eb.appspot.com",
    messagingSenderId: "697022643939",
    appId: "1:697022643939:web:9fd05ce1f5d0629dbdcfd6",
    measurementId: "G-0BSB5XPS79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

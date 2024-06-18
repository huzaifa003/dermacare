// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import {getStorage} from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";


// Correct the import for AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOqdBesU67Xz_6r5SveXVQPNmdv0IW9Zo",
  authDomain: "skin-disease-4711e.firebaseapp.com",
  projectId: "skin-disease-4711e",
  storageBucket: "skin-disease-4711e.appspot.com",
  messagingSenderId: "453444279879",
  appId: "1:453444279879:web:ac1fa8c97a5b2ceece5b62"
};


// Initialize Firebase
// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
const auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getDatabase(firebase_app);
const storage = getStorage(firebase_app, "gs://skin-disease-4711e.appspot.com");
const provider = new GoogleAuthProvider(firebase_app);
export { firebase_app, auth, db, storage, provider};
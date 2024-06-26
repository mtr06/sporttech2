import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBWqQ3IHPAUbiK9gMPBOI9eVu2cNPEV5HQ",
  authDomain: "ppam-e8f78.firebaseapp.com",
  databaseURL:
    "https://ppam-e8f78-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ppam-e8f78",
  storageBucket: "ppam-e8f78.appspot.com",
  messagingSenderId: "345650128704",
  appId: "1:345650128704:web:2b9887f9ebd9f98c86fca5",
  measurementId: "G-WR2JBRZ3S8",
  storageBucket: "gs://ppam-e8f78.appspot.com",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

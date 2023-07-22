

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, initializeAuth} from "firebase/auth"




const firebaseConfig = {
  apiKey: "AIzaSyDyOVkUnpcQ37SCvbHbje9p38a7O-FXTWs",
  authDomain: "lsr-kicks.firebaseapp.com",
  projectId: "lsr-kicks",
  storageBucket: "lsr-kicks.appspot.com",
  messagingSenderId: "1080239469361",
  appId: "1:1080239469361:web:a25899f304303d5f77b610",
  measurementId: "G-XQZ508ESRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {auth, provider, app}
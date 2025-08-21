import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAs5nu5QXEcVjwitCe9pD3agXefOlDDGD0",
  authDomain: "auth-1bc02.firebaseapp.com",
  projectId: "auth-1bc02",
  storageBucket: "auth-1bc02.appspot.com",  
  messagingSenderId: "652032507645",
  appId: "1:652032507645:web:3c1618e34029930ce1c894"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

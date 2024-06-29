import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  databaseURL: "",
};

const app = initializeApp(firebaseConfig);

// init service
const db = getFirestore(app);

// 
const storage = getStorage(app);

export { db, storage };

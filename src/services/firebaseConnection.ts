import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCOhi17NOE7bO2PmhBXfC3wKLtImZIUbwQ",
  authDomain: "boardapp-1c8a2.firebaseapp.com",
  projectId: "boardapp-1c8a2",
  storageBucket: "boardapp-1c8a2.appspot.com",
  messagingSenderId: "919781655218",
  appId: "1:919781655218:web:a8c7543e75ae91171a7fab",
  measurementId: "G-TB8369MX1K"
};

const app = !getApps().length ? initializeApp( firebaseConfig ) : getApp()
const dataBase = getFirestore(app);
 
export { dataBase }
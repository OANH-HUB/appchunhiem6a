import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCpu9wd1E_bpwT9zJgKJvu3LyvIDQ9Igio",
  authDomain: "appchunhiem6a.firebaseapp.com",
  projectId: "appchunhiem6a",
  storageBucket: "appchunhiem6a.firebasestorage.app",
  messagingSenderId: "585524125443",
  appId: "1:585524125443:web:135f81fb1f3d24414c9336",
  measurementId: "G-FP5GJYSELV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

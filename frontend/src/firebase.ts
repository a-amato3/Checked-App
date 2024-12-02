import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDMUscJN8-iqT_Qy7rNJ8HmdiBb0phIn9Y",
    authDomain: "react-todo-f44db.firebaseapp.com",
    projectId: "react-todo-f44db",
    storageBucket: "react-todo-f44db.firebasestorage.app",
    messagingSenderId: "68717474299",
    appId: "1:68717474299:web:ae8f3a66301fcfb4791b5e"
  };

// Initialisation of Firebase
const app = initializeApp(firebaseConfig);

// Export of the Auth instance
export const auth = getAuth(app);

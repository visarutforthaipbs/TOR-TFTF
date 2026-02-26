import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBRim1Jk13HgFFD2XQdF0A_7X19DM-5Wzs',
  authDomain: 'funfai-project-2026.firebaseapp.com',
  projectId: 'funfai-project-2026',
  storageBucket: 'funfai-project-2026.firebasestorage.app',
  messagingSenderId: '409361857842',
  appId: '1:409361857842:web:9d4dbb9ad6cd62a5776b2b',
  measurementId: 'G-ED8TPBSKPT',
};

// Prevent re-initialization during HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configuración oficial de Firebase para Venstack
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración proporcionada por el usuario
const firebaseConfig = {
  apiKey: "AIzaSyADhNNvBQ97Y1GmfFkRis5PWAXvAK53km8",
  authDomain: "venstack-18b16.firebaseapp.com",
  projectId: "venstack-18b16",
  storageBucket: "venstack-18b16.firebasestorage.app",
  messagingSenderId: "710662254392",
  appId: "1:710662254392:web:eb69be110aed2078a39bcd",
  measurementId: "G-V01D4989CH"
};

// Inicializar Firebase App
export const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Inicializar Firestore DB
export const db = getFirestore(app);

// Inicializar Analytics (con verificación para evitar errores en entornos sin soporte)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics fallback silenciado
  });
}

// Helpers de Autenticación
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const loginWithGithub = () => {
  return signInWithPopup(auth, githubProvider);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

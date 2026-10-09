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
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc,
  setDoc,
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";

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

// Inicializar Firestore DB estándar (default)
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

// Helper para evitar que operaciones a Firestore se queden congeladas indefinidamente si no hay facturación o red
const withTimeout = (promise, ms = 2500) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout de sincronización (${ms}ms)`)), ms)
    )
  ]);
};

// -------------------------------------------------------------
// FIRESTORE: Desarrolladores (Talento)
// -------------------------------------------------------------
export const saveDeveloperToFirestore = async (devData) => {
  const devId = devData.id || `dev-${Date.now()}`;
  const cleanDev = {
    ...devData,
    id: devId,
    updatedAt: Date.now()
  };

  // 1. Guardar de inmediato en almacenamiento local para persistencia instantánea y offline
  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_developers') || '[]');
    const filtered = existing.filter((d) => d.id !== devId);
    localStorage.setItem('venstack_custom_developers', JSON.stringify([cleanDev, ...filtered]));
  } catch (e) {
    console.warn("Aviso guardando en localStorage:", e);
  }

  // 2. Intentar guardar en Firestore con límite de tiempo
  try {
    const docRef = doc(db, "developers", devId);
    await withTimeout(setDoc(docRef, cleanDev, { merge: true }), 2500);
    return cleanDev;
  } catch (error) {
    console.warn("Aviso Firestore desarrolladores (perfil guardado localmente):", error.message || error);
    return cleanDev;
  }
};

export const subscribeToDevelopers = (callback) => {
  try {
    const devsCol = collection(db, "developers");
    return onSnapshot(
      devsCol, 
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(items);
      },
      (error) => {
        console.warn("Aviso Firestore developers (modo local activo):", error.message);
      }
    );
  } catch (err) {
    console.warn("No se pudo suscribir a developers en Firestore:", err);
    return () => {};
  }
};

// -------------------------------------------------------------
// FIRESTORE: Ofertas & Bounties
// -------------------------------------------------------------
export const saveJobToFirestore = async (jobData) => {
  const jobId = jobData.id || `job-${Date.now()}`;
  const cleanJob = {
    ...jobData,
    id: jobId,
    updatedAt: Date.now()
  };

  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_jobs') || '[]');
    const filtered = existing.filter((j) => j.id !== jobId);
    localStorage.setItem('venstack_custom_jobs', JSON.stringify([cleanJob, ...filtered]));
  } catch (e) {
    console.warn("Aviso guardando empleo en localStorage:", e);
  }

  try {
    const docRef = doc(db, "jobs", jobId);
    await withTimeout(setDoc(docRef, cleanJob, { merge: true }), 2500);
    return cleanJob;
  } catch (error) {
    console.warn("Aviso Firestore empleos (empleo guardado localmente):", error.message || error);
    return cleanJob;
  }
};

export const subscribeToJobs = (callback) => {
  try {
    const jobsCol = collection(db, "jobs");
    return onSnapshot(
      jobsCol, 
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(items);
      },
      (error) => {
        console.warn("Aviso Firestore jobs (modo local activo):", error.message);
      }
    );
  } catch (err) {
    console.warn("No se pudo suscribir a jobs en Firestore:", err);
    return () => {};
  }
};

// -------------------------------------------------------------
// FIRESTORE: Empresas & Reclutadores
// -------------------------------------------------------------
export const saveCompanyToFirestore = async (companyData) => {
  const compId = companyData.id || `comp-${Date.now()}`;
  const cleanComp = {
    ...companyData,
    id: compId,
    updatedAt: Date.now()
  };

  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_companies') || '[]');
    const filtered = existing.filter((c) => c.id !== compId);
    localStorage.setItem('venstack_custom_companies', JSON.stringify([cleanComp, ...filtered]));
  } catch (e) {
    console.warn("Aviso guardando empresa en localStorage:", e);
  }

  try {
    const docRef = doc(db, "companies", compId);
    await withTimeout(setDoc(docRef, cleanComp, { merge: true }), 2500);
    return cleanComp;
  } catch (error) {
    console.warn("Aviso Firestore empresas (empresa guardada localmente):", error.message || error);
    return cleanComp;
  }
};

export const subscribeToCompanies = (callback) => {
  try {
    const compCol = collection(db, "companies");
    return onSnapshot(
      compCol,
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(items);
      },
      (error) => {
        console.warn("Aviso Firestore companies (modo local activo):", error.message);
      }
    );
  } catch (err) {
    console.warn("No se pudo suscribir a companies en Firestore:", err);
    return () => {};
  }
};

export const getCompanyById = async (compId) => {
  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_companies') || '[]');
    const found = existing.find((c) => c.id === compId);
    if (found) return found;
  } catch (e) {}

  try {
    const docRef = doc(db, "companies", compId);
    const docSnap = await withTimeout(getDoc(docRef), 2500);
    if (docSnap && docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.warn("Aviso Firestore getCompanyById:", error.message);
    return null;
  }
};

export const deleteDeveloperFromFirestore = async (devId) => {
  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_developers') || '[]');
    const filtered = existing.filter((d) => d.id !== devId);
    localStorage.setItem('venstack_custom_developers', JSON.stringify(filtered));
  } catch (e) {}

  try {
    const docRef = doc(db, "developers", devId);
    await withTimeout(deleteDoc(docRef), 2500);
  } catch (error) {
    console.warn("Aviso al eliminar dev de Firestore:", error.message);
  }
};




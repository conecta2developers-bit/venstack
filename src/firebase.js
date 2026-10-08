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

// Inicializar Firestore DB apuntando a la base de datos nombrada 'venstack'
export const db = getFirestore(app, "venstack");

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

// -------------------------------------------------------------
// FIRESTORE: Desarrolladores (Talento)
// -------------------------------------------------------------
export const saveDeveloperToFirestore = async (devData) => {
  try {
    const devId = devData.id || `dev-${Date.now()}`;
    const cleanDev = {
      ...devData,
      id: devId,
      updatedAt: Date.now()
    };
    const docRef = doc(db, "developers", devId);
    await setDoc(docRef, cleanDev, { merge: true });
    return cleanDev;
  } catch (error) {
    console.error("Error guardando desarrollador en Firestore:", error);
    throw error;
  }
};

export const subscribeToDevelopers = (callback) => {
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
      console.warn("Aviso Firestore developers (posible modo offline o reglas):", error.message);
    }
  );
};

// -------------------------------------------------------------
// FIRESTORE: Ofertas & Bounties
// -------------------------------------------------------------
export const saveJobToFirestore = async (jobData) => {
  try {
    const jobId = jobData.id || `job-${Date.now()}`;
    const cleanJob = {
      ...jobData,
      id: jobId,
      updatedAt: Date.now()
    };
    const docRef = doc(db, "jobs", jobId);
    await setDoc(docRef, cleanJob, { merge: true });
    return cleanJob;
  } catch (error) {
    console.error("Error guardando empleo en Firestore:", error);
    throw error;
  }
};

export const subscribeToJobs = (callback) => {
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
      console.warn("Aviso Firestore jobs (posible modo offline o reglas):", error.message);
    }
  );
};

// -------------------------------------------------------------
// FIRESTORE: Empresas & Reclutadores
// -------------------------------------------------------------
export const saveCompanyToFirestore = async (companyData) => {
  try {
    const compId = companyData.id || `comp-${Date.now()}`;
    const cleanComp = {
      ...companyData,
      id: compId,
      updatedAt: Date.now()
    };
    const docRef = doc(db, "companies", compId);
    await setDoc(docRef, cleanComp, { merge: true });
    return cleanComp;
  } catch (error) {
    console.error("Error guardando empresa en Firestore:", error);
    throw error;
  }
};

export const subscribeToCompanies = (callback) => {
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
      console.warn("Aviso Firestore companies (posible modo offline o reglas):", error.message);
    }
  );
};

export const getCompanyById = async (compId) => {
  try {
    const docRef = doc(db, "companies", compId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
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
    const docRef = doc(db, "developers", devId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("Aviso al eliminar dev de Firestore:", error.message);
  }
};




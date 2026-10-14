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

export const deleteCompanyFromFirestore = async (compId) => {
  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_companies') || '[]');
    const filtered = existing.filter((c) => c.id !== compId);
    localStorage.setItem('venstack_custom_companies', JSON.stringify(filtered));
  } catch (e) {}

  try {
    const docRef = doc(db, "companies", compId);
    await withTimeout(deleteDoc(docRef), 2500);
  } catch (error) {
    console.warn("Aviso al eliminar empresa de Firestore:", error.message);
  }
};


// -------------------------------------------------------------
// FIRESTORE: Postulaciones / Candidatos (Applications)
// -------------------------------------------------------------
export const saveApplicationToFirestore = async (appData) => {
  const appId = appData.id || `app-${Date.now()}`;
  const cleanApp = {
    ...appData,
    id: appId,
    appliedAt: appData.appliedAt || Date.now(),
    updatedAt: Date.now()
  };

  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_applications') || '[]');
    const filtered = existing.filter((a) => a.id !== appId);
    localStorage.setItem('venstack_custom_applications', JSON.stringify([cleanApp, ...filtered]));
  } catch (e) {
    console.warn("Aviso guardando postulación en localStorage:", e);
  }

  try {
    const docRef = doc(db, "applications", appId);
    await withTimeout(setDoc(docRef, cleanApp, { merge: true }), 2500);
    return cleanApp;
  } catch (error) {
    console.warn("Aviso Firestore al guardar postulación:", error.message || error);
    return cleanApp;
  }
};

export const subscribeToApplications = (callback) => {
  try {
    const appCol = collection(db, "applications");
    return onSnapshot(
      appCol,
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(items);
      },
      (error) => {
        console.warn("Aviso Firestore applications (modo local activo):", error.message);
      }
    );
  } catch (err) {
    console.warn("No se pudo suscribir a applications en Firestore:", err);
    return () => {};
  }
};

export const updateApplicationStatusInFirestore = async (appId, newStatus, notes = '') => {
  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_applications') || '[]');
    const idx = existing.findIndex((a) => a.id === appId);
    if (idx >= 0) {
      existing[idx] = { 
        ...existing[idx], 
        status: newStatus, 
        ...(notes !== undefined ? { notes } : {}), 
        updatedAt: Date.now() 
      };
      localStorage.setItem('venstack_custom_applications', JSON.stringify(existing));
    }
  } catch (e) {}

  try {
    const docRef = doc(db, "applications", appId);
    const updatePayload = { status: newStatus, updatedAt: Date.now() };
    if (notes !== undefined && notes !== '') {
      updatePayload.notes = notes;
    }
    await withTimeout(setDoc(docRef, updatePayload, { merge: true }), 2500);
  } catch (error) {
    console.warn("Aviso Firestore al actualizar estado de postulación:", error.message);
  }
};

export const deleteApplicationFromFirestore = async (appId) => {
  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_applications') || '[]');
    const filtered = existing.filter((a) => a.id !== appId);
    localStorage.setItem('venstack_custom_applications', JSON.stringify(filtered));
  } catch (e) {
    console.warn("Aviso eliminando postulación en localStorage:", e);
  }

  try {
    const docRef = doc(db, "applications", appId);
    await withTimeout(deleteDoc(docRef), 2500);
  } catch (error) {
    console.warn("Aviso Firestore al eliminar postulación:", error.message || error);
  }
};

// -------------------------------------------------------------
// FIRESTORE: Comunidad (Debates, Comentarios & Likes)
// -------------------------------------------------------------
export const saveCommunityPostToFirestore = async (postData) => {
  const postId = postData.id || `post-${Date.now()}`;
  const cleanPost = {
    ...postData,
    id: postId,
    likes: typeof postData.likes === 'number' ? postData.likes : 0,
    likedBy: Array.isArray(postData.likedBy) ? postData.likedBy : [],
    comments: Array.isArray(postData.comments) ? postData.comments : [],
    updatedAt: Date.now(),
    createdAt: postData.createdAt || Date.now()
  };

  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_posts') || '[]');
    const filtered = existing.filter((p) => p.id !== postId);
    localStorage.setItem('venstack_custom_posts', JSON.stringify([cleanPost, ...filtered]));
  } catch (e) {
    console.warn("Aviso guardando post en localStorage:", e);
  }

  try {
    const docRef = doc(db, "community_posts", postId);
    await withTimeout(setDoc(docRef, cleanPost, { merge: true }), 2500);
    return cleanPost;
  } catch (error) {
    console.warn("Aviso Firestore al guardar post de comunidad:", error.message || error);
    return cleanPost;
  }
};

export const subscribeToCommunityPosts = (callback) => {
  try {
    const postsCol = collection(db, "community_posts");
    return onSnapshot(
      postsCol,
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(items);
      },
      (error) => {
        console.warn("Aviso Firestore community_posts (modo local activo):", error.message);
      }
    );
  } catch (err) {
    console.warn("No se pudo suscribir a community_posts en Firestore:", err);
    return () => {};
  }
};

export const toggleCommunityPostLikeInFirestore = async (postId, userIdentifier) => {
  if (!userIdentifier) return;

  let updatedPost = null;

  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_posts') || '[]');
    const idx = existing.findIndex((p) => p.id === postId);
    if (idx >= 0) {
      const p = existing[idx];
      const likedBy = Array.isArray(p.likedBy) ? [...p.likedBy] : [];
      const hasLiked = likedBy.includes(userIdentifier);
      const newLikedBy = hasLiked 
        ? likedBy.filter((u) => u !== userIdentifier)
        : [...likedBy, userIdentifier];
      const newLikes = Math.max(0, (typeof p.likes === 'number' ? p.likes : 0) + (hasLiked ? -1 : 1));

      updatedPost = { ...p, likes: newLikes, likedBy: newLikedBy, updatedAt: Date.now() };
      existing[idx] = updatedPost;
      localStorage.setItem('venstack_custom_posts', JSON.stringify(existing));
    }
  } catch (e) {
    console.warn("Aviso guardando like en localStorage:", e);
  }

  try {
    const docRef = doc(db, "community_posts", postId);
    const snap = await withTimeout(getDoc(docRef), 2000);
    if (snap && snap.exists()) {
      const data = snap.data();
      const likedBy = Array.isArray(data.likedBy) ? [...data.likedBy] : [];
      const hasLiked = likedBy.includes(userIdentifier);
      const newLikedBy = hasLiked 
        ? likedBy.filter((u) => u !== userIdentifier)
        : [...likedBy, userIdentifier];
      const newLikes = Math.max(0, (typeof data.likes === 'number' ? data.likes : 0) + (hasLiked ? -1 : 1));
      
      await withTimeout(setDoc(docRef, { likes: newLikes, likedBy: newLikedBy, updatedAt: Date.now() }, { merge: true }), 2500);
    } else if (updatedPost) {
      await withTimeout(setDoc(docRef, updatedPost, { merge: true }), 2500);
    }
  } catch (error) {
    console.warn("Aviso Firestore al togglear like:", error.message || error);
  }
};

export const addCommentToCommunityPostInFirestore = async (postId, commentData) => {
  const commentId = commentData.id || `comm-${Date.now()}`;
  const cleanComment = {
    ...commentData,
    id: commentId,
    likes: typeof commentData.likes === 'number' ? commentData.likes : 0,
    likedBy: Array.isArray(commentData.likedBy) ? commentData.likedBy : [],
    createdAt: Date.now()
  };

  let updatedPost = null;

  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_posts') || '[]');
    const idx = existing.findIndex((p) => p.id === postId);
    if (idx >= 0) {
      const p = existing[idx];
      const comments = Array.isArray(p.comments) ? [...p.comments, cleanComment] : [cleanComment];
      updatedPost = { ...p, comments, updatedAt: Date.now() };
      existing[idx] = updatedPost;
      localStorage.setItem('venstack_custom_posts', JSON.stringify(existing));
    }
  } catch (e) {
    console.warn("Aviso agregando comentario en localStorage:", e);
  }

  try {
    const docRef = doc(db, "community_posts", postId);
    const snap = await withTimeout(getDoc(docRef), 2000);
    if (snap && snap.exists()) {
      const data = snap.data();
      const currentComments = Array.isArray(data.comments) ? data.comments : [];
      const newComments = [...currentComments, cleanComment];
      await withTimeout(setDoc(docRef, { comments: newComments, updatedAt: Date.now() }, { merge: true }), 2500);
    } else if (updatedPost) {
      await withTimeout(setDoc(docRef, updatedPost, { merge: true }), 2500);
    }
  } catch (error) {
    console.warn("Aviso Firestore al agregar comentario:", error.message || error);
  }

  return cleanComment;
};

export const deleteCommunityPostFromFirestore = async (postId) => {
  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_posts') || '[]');
    const filtered = existing.filter((p) => p.id !== postId);
    localStorage.setItem('venstack_custom_posts', JSON.stringify(filtered));
  } catch (e) {}

  try {
    const docRef = doc(db, "community_posts", postId);
    await withTimeout(deleteDoc(docRef), 2500);
  } catch (error) {
    console.warn("Aviso Firestore al eliminar post:", error.message || error);
  }
};

export const deleteCommentFromCommunityPostInFirestore = async (postId, commentId) => {
  try {
    const existing = JSON.parse(localStorage.getItem('venstack_custom_posts') || '[]');
    const idx = existing.findIndex((p) => p.id === postId);
    if (idx >= 0) {
      const p = existing[idx];
      const comments = Array.isArray(p.comments) ? p.comments.filter((c) => c.id !== commentId) : [];
      existing[idx] = { ...p, comments, updatedAt: Date.now() };
      localStorage.setItem('venstack_custom_posts', JSON.stringify(existing));
    }
  } catch (e) {}

  try {
    const docRef = doc(db, "community_posts", postId);
    const snap = await withTimeout(getDoc(docRef), 2000);
    if (snap && snap.exists()) {
      const data = snap.data();
      const comments = Array.isArray(data.comments) ? data.comments.filter((c) => c.id !== commentId) : [];
      await withTimeout(setDoc(docRef, { comments, updatedAt: Date.now() }, { merge: true }), 2500);
    }
  } catch (error) {
    console.warn("Aviso Firestore al eliminar comentario:", error.message || error);
  }
};


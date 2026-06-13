// src/services/firebase.js
// Mock-mode gate: reads VITE_FIREBASE_* env vars at module load.
// With no vars set, MOCK_MODE = true and auth/db remain null — no Firebase call is made.
// Source: D-05, RESEARCH Pattern 1, Pitfall 2 (HMR guard)

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Detect mock mode: any required field missing or empty string means mock by default (D-05)
export const MOCK_MODE = !firebaseConfig.apiKey || !firebaseConfig.projectId;

let app = null;
export let auth = null;
export let db   = null;

if (!MOCK_MODE) {
  // HMR-safe guard: avoid duplicate initializeApp error on Vite hot reload (Pitfall 2)
  app  = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
  if (import.meta.env.DEV) console.info('[firebase] Live mode active — using Firestore + Auth');
} else {
  if (import.meta.env.DEV) console.info('[firebase] Mock mode active — using localStorage (no Firebase credentials)');
}

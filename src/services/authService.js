// src/services/authService.js
// Dual-path authentication. Live mode uses Firebase Auth (email/password +
// anonymous guest); mock mode derives a local session persisted in
// localStorage. App.jsx consumes this uniformly and never branches on mode.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { auth, MOCK_MODE } from './firebase.js';
import { makeUid, getSession, setSession, clearSession } from '../lib/session.js';

const uidForEmail = (email) => 'user_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_');

/** Normalize a Firebase user (or mock session) into the app's session shape. */
function toSession(user, { name, isGuest } = {}) {
  return {
    uid: user.uid,
    email: user.email || null,
    isGuest: typeof isGuest === 'boolean' ? isGuest : !!user.isAnonymous,
    name: name || user.displayName || '',
  };
}

/**
 * Sign up / log in / guest. Returns the resolved session.
 * @param {{mode:'signup'|'login'|'guest', email?:string, password?:string, name?:string}} args
 */
export async function authenticate({ mode, email, password, name }) {
  if (MOCK_MODE) {
    const uid = mode === 'guest' ? makeUid('guest') : uidForEmail(email);
    const session = { uid, email: email || null, isGuest: mode === 'guest', name: name || '' };
    setSession(session);
    return session;
  }

  if (mode === 'guest') {
    const cred = await signInAnonymously(auth);
    return toSession(cred.user, { name: '', isGuest: true });
  }
  if (mode === 'signup') {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name }).catch(() => {});
    return toSession(cred.user, { name, isGuest: false });
  }
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return toSession(cred.user, { isGuest: false });
}

/**
 * Subscribe to session changes for restore-on-load + live auth updates.
 * Mock mode invokes the callback once with any stored session.
 * @returns {() => void} unsubscribe
 */
export function watchAuth(callback) {
  if (MOCK_MODE) {
    callback(getSession());
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    callback(user ? toSession(user) : null);
  });
}

export async function logout() {
  if (MOCK_MODE) {
    clearSession();
    return;
  }
  await signOut(auth);
}

// src/services/dbService.js
// Dual-path CRUD layer: Firestore (live) or namespaced localStorage (mock).
// All five methods share an identical async signature and return shape — callers never branch on MOCK_MODE.
// Source: D-06, RESEARCH Pattern 2, Pitfalls 3 & 4; DESIGN.md §3.1 & §3.2

import { doc, getDoc, setDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, MOCK_MODE } from './firebase.js';

// ------------------------------------------------------------------
// Namespaced localStorage key builders (T-01-05: zenstudy: namespace)
// ------------------------------------------------------------------
const LS = {
  user:        (uid) => `zenstudy:users:${uid}`,
  journals:    (uid) => `zenstudy:journals:${uid}`,
  chatHistory: (uid) => `zenstudy:chat:${uid}`,
};

// ------------------------------------------------------------------
// localStorage helpers — all reads/writes wrapped in try/catch (Pitfall 3 / T-01-04)
// ------------------------------------------------------------------

/**
 * Read and JSON-parse a localStorage value. Returns null on any error.
 */
function lsGet(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

/**
 * JSON-stringify and write a value to localStorage.
 * On QuotaExceededError logs a warning and returns silently — never throws (Pitfall 3).
 */
function lsSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('[dbService] localStorage write failed — quota may be exceeded', e);
  }
}

// ------------------------------------------------------------------
// Users (DESIGN.md §3.1)
// ------------------------------------------------------------------

/**
 * Read a user profile by uid.
 * @param {string} uid
 * @returns {Promise<object|null>}
 */
export async function getUser(uid) {
  if (MOCK_MODE) {
    return lsGet(LS.user(uid));
  }
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

/**
 * Merge data into an existing user profile (or create it if absent).
 * Live path always uses { merge: true } to avoid clobbering streak/zenPoints (Pitfall 4 / T-01-06).
 * @param {string} uid
 * @param {object} data  Partial or full user fields per DESIGN.md §3.1
 * @returns {Promise<object>} The merged/written object
 */
export async function updateUser(uid, data) {
  if (MOCK_MODE) {
    const existing = lsGet(LS.user(uid)) || {};
    const merged = { ...existing, ...data };
    lsSet(LS.user(uid), merged);
    return merged;
  }
  await setDoc(doc(db, 'users', uid), data, { merge: true });
  return data;
}

// ------------------------------------------------------------------
// Journals (DESIGN.md §3.2)
// ------------------------------------------------------------------

/**
 * Append a new journal entry for a user.
 * Payload shape follows DESIGN.md §3.2 AI fields.
 * Mock path caps the list at 100 entries (oldest removed first).
 * @param {string} uid
 * @param {object} entry  Partial journal fields (e.g. moodScore, content, entryType)
 * @returns {Promise<object>} The stored payload
 */
export async function logJournal(uid, entry) {
  const payload = {
    userId: uid,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  if (MOCK_MODE) {
    const list = lsGet(LS.journals(uid)) || [];
    list.unshift(payload);
    lsSet(LS.journals(uid), list.slice(0, 100)); // cap at 100
    return payload;
  }

  const ref = await addDoc(collection(db, 'journals'), payload);
  return { id: ref.id, ...payload };
}

/**
 * Retrieve all journal entries for a user, ordered newest-first (mock) or as Firestore returns.
 * @param {string} uid
 * @returns {Promise<object[]>}
 */
export async function getJournals(uid) {
  if (MOCK_MODE) {
    return lsGet(LS.journals(uid)) || [];
  }
  const q = query(collection(db, 'journals'), where('userId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ------------------------------------------------------------------
// Chat history
// ------------------------------------------------------------------

/**
 * Persist the full chat message history for a user.
 * In live mode stores under users/{uid}.chatHistory to avoid a separate collection.
 * @param {string} uid
 * @param {object[]} messages  Array of { role, content } message objects
 * @returns {Promise<void>}
 */
export async function saveChatHistory(uid, messages) {
  if (MOCK_MODE) {
    lsSet(LS.chatHistory(uid), messages);
    return;
  }
  await setDoc(doc(db, 'users', uid), { chatHistory: messages }, { merge: true });
}

/**
 * Read the persisted chat history for a user (companion drawer restore).
 * Mirrors saveChatHistory's storage location in each mode.
 * @param {string} uid
 * @returns {Promise<object[]>}
 */
export async function getChatHistory(uid) {
  if (MOCK_MODE) {
    return lsGet(LS.chatHistory(uid)) || [];
  }
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data().chatHistory || [] : [];
}

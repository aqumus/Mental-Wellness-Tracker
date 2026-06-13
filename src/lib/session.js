// src/lib/session.js
// Lightweight session persistence for mock mode. In live Firebase mode the
// real auth listener owns the session; here we persist the active uid so a
// page refresh restores the user (AUTH success criterion 1).

const SESSION_KEY = 'zenstudy:session';

/** Generate a stable-ish local uid (guest or email-derived). */
export function makeUid(prefix = 'user') {
  const rand = Math.floor(Math.random() * 1e9).toString(36);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn('[session] could not persist session', e);
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** Scan free text for safety-net trigger keywords (case-insensitive). */
export function containsSafetyTrigger(text, keywords) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

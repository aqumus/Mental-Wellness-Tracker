// src/services/geminiService.js
// Gemini client scaffold. Phase 1 provides mock (canned) responses — no network calls.
// Live wiring (GoogleGenerativeAI + gemini-1.5-flash) is deferred to Phase 4 (D-10, T-01-07).
// Source: RESEARCH Standard Stack A5; IMPLEMENTATION_PLAN.md §2 Phase 2

// NOTE: The live branch below is intentionally never reached when the key is absent.
// It is included as a Phase 4 TODO scaffold so the structural change in Phase 4 is minimal.
// The @google/generative-ai import is present so Phase 4 only needs to un-comment the live path.
import { GoogleGenerativeAI } from '@google/generative-ai';

// Detect Gemini key: mirrors the firebase.js MOCK_MODE pattern (D-05)
const _geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

/** true when no Gemini API key is configured — all methods return canned data */
export const GEMINI_MOCK_MODE = !_geminiKey;

// ------------------------------------------------------------------
// Phase 4 TODO: uncomment and wire the live client when key is present
// ------------------------------------------------------------------
// let _genAI = null;
// let _model  = null;
// if (!GEMINI_MOCK_MODE) {
//   _genAI = new GoogleGenerativeAI(_geminiKey);
//   _model = _genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Assumptions Log A5
// }
// ------------------------------------------------------------------

if (import.meta.env.DEV) {
  console.info(
    GEMINI_MOCK_MODE
      ? '[geminiService] Mock mode — canned responses active (no Gemini key)'
      : '[geminiService] Live mode — Gemini Flash wiring TODO for Phase 4',
  );
}

// ------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------

/**
 * Analyse a journal entry and return AI-generated feedback fields.
 * Phase 1: returns deterministic canned data matching DESIGN.md §3.2 AI fields.
 * Phase 4: will call Gemini Flash with the entry + profile context.
 *
 * @param {object} entry   Journal entry fields (content, moodScore, entryType, etc.)
 * @param {object} profile User profile fields (name, targetExam, targetDate, etc.)
 * @returns {Promise<{sentiment: string, stressTriggers: string[], copingStrategy: string, encouragement: string}>}
 */
export async function analyzeJournalEntry(entry, profile) {
  // TODO Phase 4: replace with live Gemini Flash call
  // Mock response — plain strings only, no HTML/markup (security constraint)
  const examLabel = profile?.targetExam || 'your exam';
  return {
    sentiment: 'Thoughtful & Reflective',
    stressTriggers: ['Study load', examLabel],
    copingStrategy:
      'Take a 5-minute break. Try the 4-7-8 breathing technique: inhale for 4 counts, hold for 7, exhale for 8.',
    encouragement:
      'Every day of consistent effort builds the foundation for your success. You are making progress even when it does not feel like it.',
  };
}

/**
 * Send a message in the Shanti companion chat and receive a reply.
 * Phase 1: returns a short canned empathetic response using safe string concatenation.
 * Phase 4: will call Gemini Flash with the full message history + profile context.
 *
 * @param {object[]} messages  Array of { role: 'user'|'assistant', content: string } objects
 * @param {object}   profile   User profile fields (name, targetExam, etc.)
 * @returns {Promise<string>} Plain-text reply (no HTML/markup)
 */
export async function sendCompanionMessage(messages, profile) {
  // TODO Phase 4: replace with live Gemini Flash multi-turn call
  // Mock response — plain strings only, no dangerouslySetInnerHTML risk downstream
  const name     = profile?.name     || 'there';
  const examName = profile?.targetExam || 'your exam';
  const lastUserMsg = messages?.findLast?.(m => m.role === 'user')?.content || '';

  if (!lastUserMsg.trim()) {
    return 'Hi ' + name + ', I am here whenever you want to talk about your ' + examName + ' journey.';
  }

  return (
    'I hear you, ' + name + '. Preparing for ' + examName + ' is genuinely demanding, ' +
    'and it is okay to feel the way you do right now. ' +
    'Every small step forward matters. What would help you feel a little better today?'
  );
}

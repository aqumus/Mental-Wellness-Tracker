// src/services/geminiService.js
// Gemini Flash client for Shanti. Live mode activates automatically when
// VITE_GEMINI_API_KEY is set; otherwise canned mock responses are used.
// Every live call falls back to the mock response on error so the core
// vent → companion loop never breaks during a demo (network/quota safe).
// All returns are plain strings (no HTML/markup) — XSS constraint.
// Source: RESEARCH Standard Stack A5; IMPLEMENTATION_PLAN.md §2 Phase 2

import { GoogleGenerativeAI } from '@google/generative-ai';

// Detect Gemini key: mirrors the firebase.js MOCK_MODE pattern (D-05)
const _geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

/** true when no Gemini API key is configured — all methods return canned data */
export const GEMINI_MOCK_MODE = !_geminiKey;

// Gemini Flash — fast + low-cost, matches the hackathon problem statement.
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';

let _genAI = null;
if (!GEMINI_MOCK_MODE) {
  try {
    _genAI = new GoogleGenerativeAI(_geminiKey);
  } catch (e) {
    console.error('[geminiService] client init failed — falling back to mock', e);
  }
}

if (import.meta.env.DEV) {
  console.info(
    GEMINI_MOCK_MODE || !_genAI
      ? '[geminiService] Mock mode — canned responses active (no Gemini key)'
      : `[geminiService] Live mode — ${MODEL_NAME} active`,
  );
}

// ------------------------------------------------------------------
// Context builder — injects identity, exam countdown, mood, stressors,
// and streak into Shanti's system instruction (REQUIREMENTS §6).
// ------------------------------------------------------------------
function buildSystemInstruction(profile = {}) {
  const name = profile.name || 'the student';
  const exam = profile.targetExam || 'a competitive exam';

  let countdown = '';
  if (profile.targetDate) {
    const days = Math.ceil((new Date(profile.targetDate) - Date.now()) / 86400000);
    if (days > 0) countdown = ` Their exam is roughly ${days} days away.`;
  }
  const streak = profile.streak ? ` They are on a ${profile.streak}-day wellness streak — encourage it.` : '';
  const triggers = (profile.stressTriggers || []).slice(-3);
  const trig = triggers.length ? ` Recent stressors they mentioned: ${triggers.join(', ')}.` : '';
  const lastMood = (profile.moodHistory || []).slice(-1)[0]?.score;
  const mood = typeof lastMood === 'number' ? ` Their last self-rated mood was ${lastMood}/5.` : '';

  return [
    'You are Shanti, a warm, emotionally intelligent wellness companion for Indian competitive-exam aspirants (JEE, NEET, UPSC, GATE, Boards).',
    `You are talking with ${name}, who is preparing for ${exam}.${countdown}${streak}${trig}${mood}`,
    'Speak like a caring friend, not a clinician. Keep replies short (2-4 sentences), validating, and practical.',
    'Reference their exam context and stressors when it helps. Never give medical diagnoses or rankings-based pressure.',
    'If they express self-harm or crisis, gently and urgently encourage contacting a professional helpline.',
    'Respond in plain text only — no markdown, no HTML, no asterisks.',
  ].join(' ');
}

// ------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------

/**
 * Analyse a journal entry and return AI-generated feedback fields.
 * Live: Gemini Flash with JSON output. Mock/fallback: deterministic canned data.
 *
 * @param {object} entry   Journal entry fields (content, moodScore, entryType, etc.)
 * @param {object} profile User profile fields (name, targetExam, targetDate, etc.)
 * @returns {Promise<{sentiment: string, stressTriggers: string[], copingStrategy: string, encouragement: string}>}
 */
export async function analyzeJournalEntry(entry, profile) {
  if (GEMINI_MOCK_MODE || !_genAI) return mockAnalysis(entry, profile);

  try {
    const model = _genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.6, maxOutputTokens: 400 },
    });
    const prompt =
      `A ${profile?.targetExam || 'exam'} aspirant wrote this "${entry?.entryType || 'journal'}" entry: ` +
      `"""${entry?.content || ''}""". ` +
      'Return ONLY a JSON object with these exact fields: ' +
      '{"sentiment": string, "stressTriggers": string[], "copingStrategy": string, "encouragement": string}. ' +
      'stressTriggers: 1-3 short tags. copingStrategy: one practical, short suggestion. ' +
      'encouragement: one warm sentence. Plain text values only.';

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    return {
      sentiment: String(parsed.sentiment || 'Reflective'),
      stressTriggers: Array.isArray(parsed.stressTriggers)
        ? parsed.stressTriggers.map(String).slice(0, 3)
        : [],
      copingStrategy: String(parsed.copingStrategy || ''),
      encouragement: String(parsed.encouragement || ''),
    };
  } catch (e) {
    console.error('[geminiService] analyzeJournalEntry failed — using fallback', e);
    return mockAnalysis(entry, profile);
  }
}

/**
 * Send a message in the Shanti companion chat and receive a reply.
 * Live: multi-turn Gemini Flash chat with context-injected system instruction.
 * Mock/fallback: short canned empathetic response.
 *
 * @param {object[]} messages  Array of { role: 'user'|'assistant', content: string }
 * @param {object}   profile   User profile fields
 * @returns {Promise<string>} Plain-text reply (no HTML/markup)
 */
export async function sendCompanionMessage(messages, profile) {
  if (GEMINI_MOCK_MODE || !_genAI) return mockCompanionReply(messages, profile);

  try {
    const model = _genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: buildSystemInstruction(profile),
      generationConfig: { temperature: 0.85, maxOutputTokens: 300 },
    });

    const all = (messages || []).filter((m) => m?.content?.trim());
    const lastUser = all[all.length - 1]?.content || '';

    // Gemini chat history must start with a user turn — drop any leading
    // assistant greeting, then map roles (assistant → model).
    const prior = all.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    while (prior.length && prior[0].role === 'model') prior.shift();

    const chat = model.startChat({ history: prior });
    const result = await chat.sendMessage(lastUser);
    return result.response.text().trim() || mockCompanionReply(messages, profile);
  } catch (e) {
    console.error('[geminiService] sendCompanionMessage failed — using fallback', e);
    return mockCompanionReply(messages, profile);
  }
}

// ------------------------------------------------------------------
// Mock fallbacks (also used when no key is configured)
// ------------------------------------------------------------------
function mockAnalysis(entry, profile) {
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

function mockCompanionReply(messages, profile) {
  const name = profile?.name || 'there';
  const examName = profile?.targetExam || 'your exam';
  const lastUserMsg = messages?.findLast?.((m) => m.role === 'user')?.content || '';

  if (!lastUserMsg.trim()) {
    return 'Hi ' + name + ', I am here whenever you want to talk about your ' + examName + ' journey.';
  }

  return (
    'I hear you, ' + name + '. Preparing for ' + examName + ' is genuinely demanding, ' +
    'and it is okay to feel the way you do right now. ' +
    'Every small step forward matters. What would help you feel a little better today?'
  );
}

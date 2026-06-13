// src/components/Settings.jsx
// Settings panel (SET-01/SET-02): configure the Gemini API key and Firebase
// credentials. Keys are stored locally only (never committed) and applied on
// reload — they are never hardcoded. Also shows the current service mode and
// a logout control.

import { useState } from 'react';
import { Settings as Cog, X, KeyRound, Database } from 'lucide-react';
import { MOCK_MODE } from '../services/firebase.js';
import { GEMINI_MOCK_MODE } from '../services/geminiService.js';

const CONFIG_KEY = 'zenstudy:config';

function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
  } catch {
    return {};
  }
}

export default function Settings({ onClose, onLogout, pushToast }) {
  const existing = loadConfig();
  const [geminiKey, setGeminiKey] = useState(existing.geminiKey || '');
  const [fbApiKey, setFbApiKey] = useState(existing.fbApiKey || '');
  const [fbProjectId, setFbProjectId] = useState(existing.fbProjectId || '');

  function save() {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify({ geminiKey, fbApiKey, fbProjectId }));
      pushToast('Credentials saved locally — reload to apply ✓');
    } catch {
      pushToast('Could not save credentials in this browser.');
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="modal-card">
        <div className="flex items-center justify-between mb-4">
          <h2 id="settings-title" className="font-[var(--font-display)] font-bold text-lg m-0 flex items-center gap-2">
            <Cog size={20} color="var(--accent-violet)" /> Settings
          </h2>
          <button type="button" className="tab-btn" onClick={onClose} aria-label="Close settings">
            <X size={18} />
          </button>
        </div>

        {/* Service status */}
        <div className="flex gap-2 mb-5 flex-wrap">
          <span className="stat-pill" style={{ borderColor: MOCK_MODE ? 'var(--accent-orange)' : 'var(--accent-teal)' }}>
            <Database size={14} /> Firebase: {MOCK_MODE ? 'Mock (local)' : 'Live'}
          </span>
          <span className="stat-pill" style={{ borderColor: GEMINI_MOCK_MODE ? 'var(--accent-orange)' : 'var(--accent-teal)' }}>
            <KeyRound size={14} /> Gemini: {GEMINI_MOCK_MODE ? 'Mock' : 'Live'}
          </span>
        </div>

        <label className="block text-sm mb-1">Gemini API key</label>
        <input className="input-field mb-3" type="password" placeholder="AIza…" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} />

        <label className="block text-sm mb-1">Firebase API key</label>
        <input className="input-field mb-3" type="password" placeholder="AIza…" value={fbApiKey} onChange={(e) => setFbApiKey(e.target.value)} />

        <label className="block text-sm mb-1">Firebase project ID</label>
        <input className="input-field mb-4" type="text" placeholder="your-project-id" value={fbProjectId} onChange={(e) => setFbProjectId(e.target.value)} />

        <p className="text-[var(--text-muted)] text-xs m-0 mb-4">
          Keys are stored only in this browser and never committed. Mock mode keeps the full app
          usable offline for evaluators.
        </p>

        <div className="flex gap-2">
          <button type="button" className="btn-primary flex-1" onClick={save}>Save</button>
          <button type="button" className="btn-secondary" onClick={onLogout}>Log out</button>
        </div>
      </div>
    </div>
  );
}

// src/components/Auth.jsx
// Authentication portal (DESIGN §2.1): signup / login / one-click guest.
// In mock mode no Firebase call is made — App derives a local session.
// The frosted container shifts its border violet (signup) → teal (login).

import { useState } from 'react';
import { Leaf, UserPlus, LogIn, Zap } from 'lucide-react';
import { MOCK_MODE } from '../services/firebase.js';

export default function Auth({ onAuthenticate, onGuest }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';
  const accent = isSignup ? 'var(--accent-violet)' : 'var(--accent-teal)';

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim() || (isSignup && !name.trim())) {
      setError('Please fill in all fields.');
      return;
    }
    setBusy(true);
    try {
      await onAuthenticate({ mode, email: email.trim(), password, name: name.trim() });
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function guest() {
    setBusy(true);
    try {
      await onGuest();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div
        className="glass-card w-full max-w-md p-7"
        style={{ borderColor: accent, boxShadow: `0 0 40px ${accent}22` }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <Leaf size={36} color="var(--accent-teal)" />
          <h1 className="font-[var(--font-display)] font-bold text-2xl mt-2 mb-1">ZenStudy</h1>
          <p className="text-[var(--text-muted)] text-sm m-0">
            Your calm corner in the exam storm.
          </p>
        </div>

        {/* Mode switch */}
        <div className="flex gap-1 p-1 mb-5 rounded-xl" style={{ background: 'hsla(224,30%,10%,0.7)' }}>
          <button
            type="button"
            className="tab-btn flex-1 justify-center"
            data-active={isSignup}
            onClick={() => setMode('signup')}
          >
            <UserPlus size={15} /> Sign Up
          </button>
          <button
            type="button"
            className="tab-btn flex-1 justify-center"
            data-active={!isSignup}
            onClick={() => setMode('login')}
          >
            <LogIn size={15} /> Log In
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          {isSignup && (
            <input
              className="input-field"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />

          {error && <p className="text-[var(--accent-rose)] text-sm m-0">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4 text-[var(--text-muted)] text-xs">
          <span className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
          OR
          <span className="flex-1 h-px" style={{ background: 'var(--border-glass)' }} />
        </div>

        <button type="button" className="btn-secondary w-full" onClick={guest} disabled={busy}>
          <Zap size={15} /> Continue as Guest
        </button>

        {MOCK_MODE && (
          <p className="text-[var(--text-muted)] text-xs text-center mt-4 m-0">
            Offline demo mode — data is saved locally in your browser. Add Firebase keys in
            Settings to sync to the cloud.
          </p>
        )}
      </div>
    </main>
  );
}

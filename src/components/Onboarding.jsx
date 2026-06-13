// src/components/Onboarding.jsx
// The Zen Gate (DESIGN §2.2): a 4-step setup — name, target exam, exam date,
// and starting plant seed. On completion App writes the full user document.

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { EXAMS, PLANTS } from '../lib/constants.js';
import MindGarden from './MindGarden.jsx';

export default function Onboarding({ initialName = '', onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialName);
  const [targetExam, setTargetExam] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [startingPlant, setStartingPlant] = useState('');
  const [busy, setBusy] = useState(false);

  const steps = [
    { title: "What should Shanti call you?", valid: name.trim().length > 0 },
    { title: 'Which exam are you preparing for?', valid: !!targetExam },
    { title: 'When is your exam?', valid: !!targetDate },
    { title: 'Pick a seed for your Mind Garden', valid: !!startingPlant },
  ];

  const canAdvance = steps[step].valid;
  const isLast = step === steps.length - 1;

  async function finish() {
    setBusy(true);
    try {
      await onComplete({
        name: name.trim(),
        targetExam,
        targetDate: targetDate ? new Date(targetDate).toISOString() : null,
        startingPlant,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg p-7">
        {/* Progress dots */}
        <div className="flex gap-2 mb-6" aria-hidden="true">
          {steps.map((_, i) => (
            <span
              key={i}
              className="flex-1 h-1.5 rounded-full"
              style={{ background: i <= step ? 'var(--accent-violet)' : 'var(--border-glass)' }}
            />
          ))}
        </div>

        <h2 className="font-[var(--font-display)] font-bold text-xl mb-5">{steps[step].title}</h2>

        {/* Step 0 — name */}
        {step === 0 && (
          <input
            className="input-field"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        )}

        {/* Step 1 — exam */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {EXAMS.map((ex) => (
              <button
                key={ex.id}
                type="button"
                className="choice-card"
                data-selected={targetExam === ex.id}
                onClick={() => setTargetExam(ex.id)}
              >
                <span className="block font-[var(--font-display)] font-semibold">{ex.label}</span>
                <span className="block text-[var(--text-muted)] text-sm">{ex.blurb}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — date */}
        {step === 2 && (
          <div>
            <input
              className="input-field"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
            <p className="text-[var(--text-muted)] text-sm mt-2 m-0">
              Shanti uses this to gently track your countdown — never to pressure you.
            </p>
          </div>
        )}

        {/* Step 3 — plant */}
        {step === 3 && (
          <div className="grid grid-cols-3 gap-3">
            {PLANTS.map((pl) => (
              <button
                key={pl.id}
                type="button"
                className="choice-card flex flex-col items-center text-center"
                data-selected={startingPlant === pl.id}
                onClick={() => setStartingPlant(pl.id)}
              >
                <MindGarden profile={{ streak: 1, startingPlant: pl.id }} size={96} />
                <span className="font-[var(--font-display)] font-semibold mt-1">{pl.label}</span>
                <span className="text-[var(--text-muted)] text-xs">{pl.hint}</span>
              </button>
            ))}
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || busy}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {isLast ? (
            <button type="button" className="btn-primary" onClick={finish} disabled={!canAdvance || busy}>
              {busy ? 'Planting…' : 'Enter ZenStudy'} <Check size={15} />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance}
            >
              Next <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

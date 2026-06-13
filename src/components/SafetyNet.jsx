// src/components/SafetyNet.jsx
// Static safety modal (SAFE-01). Raised when a trigger keyword is detected in
// any text field. Shows professional helplines — never AI-generated content.

import { LifeBuoy, Phone, X } from 'lucide-react';
import { HELPLINES } from '../lib/constants.js';

export default function SafetyNet({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" role="alertdialog" aria-modal="true" aria-labelledby="safety-title">
      <div className="modal-card" style={{ borderColor: 'var(--accent-rose)' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <LifeBuoy size={22} color="var(--accent-rose)" />
            <h2 id="safety-title" className="font-[var(--font-display)] font-bold text-lg m-0">
              You are not alone
            </h2>
          </div>
          <button type="button" className="tab-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">
          It sounds like you are going through something really heavy right now. Please consider
          reaching out — talking to someone can help. These free, confidential helplines are
          available to you:
        </p>

        <ul className="flex flex-col gap-2 list-none p-0 m-0">
          {HELPLINES.map((h) => (
            <li key={h.name}>
              <a
                href={h.href}
                className="choice-card flex items-center gap-3 no-underline"
                style={{ display: 'flex' }}
              >
                <Phone size={18} color="var(--accent-teal)" />
                <span>
                  <span className="block font-medium">{h.name}</span>
                  <span className="block text-[var(--text-muted)] text-sm">{h.detail}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <button type="button" className="btn-primary w-full mt-5" onClick={onClose}>
          I understand
        </button>
      </div>
    </div>
  );
}

// src/components/Insights.jsx
// Insights view (DESIGN §4.6 / INSIGHT): a mood timeline rendered as native
// inline SVG (no charting library) plus the stress triggers extracted from the
// user's journal history. Loads recent entries from the dual-path service.

import { useEffect, useState } from 'react';
import { LineChart, Tag, BookOpen } from 'lucide-react';
import { getJournals } from '../services/dbService.js';

const ENTRY_LABEL = { rant: 'Rant', insecurity: 'Insecurity', general: 'Check-in', burn: 'Burn' };

export default function Insights({ profile, uid }) {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    let alive = true;
    getJournals(uid).then((list) => {
      if (alive) setJournals(list || []);
    });
    return () => {
      alive = false;
    };
  }, [uid, profile.zenPoints]); // refetch after new entries change the score

  const moods = (profile.moodHistory || []).slice(-12);
  const triggers = profile.stressTriggers || [];

  // Build an SVG polyline from mood scores (1–5 → y).
  const W = 600;
  const H = 160;
  const pad = 20;
  const points = moods.map((m, i) => {
    const x = pad + (moods.length <= 1 ? 0 : (i / (moods.length - 1)) * (W - pad * 2));
    const y = H - pad - ((Math.min(5, Math.max(1, m.score)) - 1) / 4) * (H - pad * 2);
    return { x, y };
  });
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-[var(--font-display)] font-bold text-2xl m-0 flex items-center gap-2">
          <LineChart size={24} color="var(--accent-violet)" /> Insights
        </h1>
        <p className="text-[var(--text-muted)] m-0 mt-1">Your mood trend and the themes Shanti is tracking.</p>
      </header>

      {/* Mood timeline */}
      <section className="glass-card p-5">
        <h2 className="font-[var(--font-display)] font-semibold text-lg mt-0 mb-3">Mood timeline</h2>
        {moods.length === 0 ? (
          <p className="text-[var(--text-muted)] m-0">No mood data yet — check in or complete a quest to start your trend.</p>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Mood over time">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const y = H - pad - ((lvl - 1) / 4) * (H - pad * 2);
              return <line key={lvl} x1={pad} y1={y} x2={W - pad} y2={y} stroke="var(--border-glass)" strokeWidth="1" />;
            })}
            <polyline points={polyline} fill="none" stroke="var(--accent-violet)" strokeWidth="2.5" strokeLinejoin="round" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--accent-teal)" />
            ))}
          </svg>
        )}
        <p className="text-[var(--text-muted)] text-xs m-0 mt-2">Scale: 1 (low) → 5 (great)</p>
      </section>

      {/* Stress triggers */}
      <section className="glass-card p-5">
        <h2 className="font-[var(--font-display)] font-semibold text-lg mt-0 mb-3 flex items-center gap-2">
          <Tag size={18} color="var(--accent-orange)" /> Stress triggers
        </h2>
        {triggers.length === 0 ? (
          <p className="text-[var(--text-muted)] m-0">No triggers detected yet.</p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {triggers.map((t, i) => (
              <span key={`${t}-${i}`} className="stat-pill" style={{ borderColor: 'var(--accent-orange)' }}>{t}</span>
            ))}
          </div>
        )}
      </section>

      {/* Recent entries */}
      <section className="glass-card p-5">
        <h2 className="font-[var(--font-display)] font-semibold text-lg mt-0 mb-3 flex items-center gap-2">
          <BookOpen size={18} color="var(--accent-teal)" /> Recent entries
        </h2>
        {journals.length === 0 ? (
          <p className="text-[var(--text-muted)] m-0">Your journal entries will appear here.</p>
        ) : (
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            {journals.slice(0, 6).map((j, i) => (
              <li key={j.id || i} className="choice-card" style={{ cursor: 'default' }}>
                <div className="flex items-center justify-between">
                  <span className="stat-pill">{ENTRY_LABEL[j.entryType] || 'Entry'}</span>
                  <span className="text-[var(--text-muted)] text-xs">
                    {new Date(j.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {j.content && <p className="m-0 mt-2 text-sm">{j.content.slice(0, 140)}{j.content.length > 140 ? '…' : ''}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

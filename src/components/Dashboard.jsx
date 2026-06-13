// src/components/Dashboard.jsx
// Home view: time-aware greeting, the Mind Garden with its current growth/decay
// state, a Zen Oracle quest nudge, and the daily wellness quests (check-in,
// 1-minute breathing, and shortcuts into vents/assessments).

import { useEffect, useRef, useState } from 'react';
import { Wind, MessageSquareHeart, Brain, CheckCircle2, Sparkles } from 'lucide-react';
import MindGarden from './MindGarden.jsx';
import { getGardenState, isNewDay } from '../lib/garden.js';
import { ZP, BREATHING_SECONDS } from '../lib/constants.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard({ profile, onReward, onNavigate, pushToast }) {
  const garden = getGardenState(profile);
  const canCheckIn = isNewDay(profile.lastActive) || !profile.lastActive;
  const [breathing, setBreathing] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Greeting */}
      <section>
        <h1 className="font-[var(--font-display)] font-bold text-2xl m-0">
          {greeting()}, {profile.name} 🌱
        </h1>
        <p className="text-[var(--text-muted)] m-0 mt-1">
          {profile.targetExam} aspirant · {profile.streak || 0}-day streak ·{' '}
          {profile.zenPoints || 0} ZP
        </p>
      </section>

      <div className="grid gap-5" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)' }}>
        {/* Mind Garden */}
        <section className="glass-card p-5 flex flex-col items-center text-center">
          <h2 className="font-[var(--font-display)] font-semibold text-lg m-0 mb-1">Mind Garden</h2>
          <span
            className="stat-pill mb-1"
            style={{ borderColor: garden.accent, color: garden.accent }}
          >
            {garden.label}
          </span>
          <MindGarden profile={profile} size={200} />
          <p className="text-[var(--text-muted)] text-sm m-0">
            {garden.mood === 'decaying'
              ? 'Your garden needs you — complete any quest below to revive it.'
              : 'Keep your streak alive to help it bloom.'}
          </p>
        </section>

        {/* Quests */}
        <section className="flex flex-col gap-3">
          {/* Zen Oracle */}
          <div
            className="glass-card p-4"
            style={{ animation: 'pulse 8s infinite', borderColor: 'var(--border-glow)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} color="var(--accent-violet)" />
              <span className="font-[var(--font-display)] font-semibold">The Zen Oracle</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm m-0">
              The Oracle senses some focus fatigue. Clear an assessment quest for a Zen Points
              boost and a clearer head.
            </p>
            <button type="button" className="btn-primary mt-3" onClick={() => onNavigate('assess')}>
              Start a quest (+{ZP.scenario} ZP)
            </button>
          </div>

          {/* Daily check-in */}
          <button
            type="button"
            className="glass-card p-4 text-left cursor-pointer"
            disabled={!canCheckIn}
            onClick={() => {
              onReward({ zen: ZP.checkIn, label: 'Daily check-in complete', markCheckIn: true, mood: 4 });
            }}
            style={{ opacity: canCheckIn ? 1 : 0.55 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} color="var(--accent-teal)" />
              <span className="font-[var(--font-display)] font-semibold">
                {canCheckIn ? `Daily check-in (+${ZP.checkIn} ZP)` : 'Checked in today ✓'}
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-sm m-0 mt-1">
              A quick hello keeps your streak and your garden alive.
            </p>
          </button>

          {/* Breathing + shortcuts */}
          <div className="grid grid-cols-3 gap-3">
            <QuestTile icon={<Wind size={18} color="var(--accent-teal)" />} label="Breathe" sub={`+${ZP.breathing} ZP`} onClick={() => setBreathing(true)} />
            <QuestTile icon={<MessageSquareHeart size={18} color="var(--accent-rose)" />} label="Vent" sub={`+${ZP.vent} ZP`} onClick={() => onNavigate('vent')} />
            <QuestTile icon={<Brain size={18} color="var(--accent-violet)" />} label="Assess" sub={`+${ZP.scenario} ZP`} onClick={() => onNavigate('assess')} />
          </div>
        </section>
      </div>

      {breathing && (
        <BreathingQuest
          onClose={() => setBreathing(false)}
          onComplete={() => {
            setBreathing(false);
            onReward({ zen: ZP.breathing, label: 'Breathing exercise complete', markCheckIn: true });
          }}
        />
      )}
    </div>
  );
}

function QuestTile({ icon, label, sub, onClick }) {
  return (
    <button type="button" className="choice-card flex flex-col items-center text-center gap-1" onClick={onClick}>
      {icon}
      <span className="font-[var(--font-display)] font-semibold text-sm">{label}</span>
      <span className="text-[var(--text-muted)] text-xs">{sub}</span>
    </button>
  );
}

// 1-minute guided breathing (DESIGN dashboard quest). Uses the `breathe` keyframe.
function BreathingQuest({ onClose, onComplete }) {
  const [remaining, setRemaining] = useState(BREATHING_SECONDS);
  const [phase, setPhase] = useState('Inhale');
  const doneRef = useRef(false);

  useEffect(() => {
    const tick = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(tick);
          if (!doneRef.current) {
            doneRef.current = true;
            onComplete();
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    const phaseTimer = setInterval(() => {
      setPhase((p) => (p === 'Inhale' ? 'Exhale' : 'Inhale'));
    }, 4000);
    return () => {
      clearInterval(tick);
      clearInterval(phaseTimer);
    };
  }, [onComplete]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Breathing exercise">
      <div className="modal-card flex flex-col items-center text-center">
        <h2 className="font-[var(--font-display)] font-bold text-lg mb-1">Box Breathing</h2>
        <p className="text-[var(--text-muted)] text-sm mt-0 mb-5">Follow the circle. {remaining}s left.</p>
        <div
          className="rounded-full mb-5 flex items-center justify-center"
          style={{
            width: 160,
            height: 160,
            background: 'radial-gradient(circle, var(--accent-teal) 0%, transparent 70%)',
            animation: 'breathe 8s ease-in-out infinite',
          }}
        >
          <span className="font-[var(--font-display)] font-semibold text-lg">{phase}</span>
        </div>
        <button type="button" className="btn-secondary" onClick={onClose}>
          End early
        </button>
      </div>
    </div>
  );
}

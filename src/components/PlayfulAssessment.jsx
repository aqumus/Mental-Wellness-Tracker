// src/components/PlayfulAssessment.jsx
// Zen Oracle quests (DESIGN §4.3): a TAT-inspired visual card pick + descriptor,
// then a CBT branching scenario. Selections map to stress/behavioral indicators,
// update mood + stress triggers, and award Zen Points.

import { useState } from 'react';
import { Brain, ArrowRight, Award } from 'lucide-react';
import { TAT_CARDS, CBT_SCENARIOS, ZP } from '../lib/constants.js';

const INDICATOR_MOOD = { isolation: 2, 'lack of direction': 2, resilience: 4 };

export default function PlayfulAssessment({ onReward, pushToast }) {
  const [stage, setStage] = useState('tat'); // tat → word → cbt → done
  const [card, setCard] = useState(null);
  const [word, setWord] = useState('');
  const [scenarioChoice, setScenarioChoice] = useState(null);
  const scenario = CBT_SCENARIOS[0];

  function finish(choice) {
    setScenarioChoice(choice);
    setStage('done');
    const triggers = [];
    if (card?.indicator && card.indicator !== 'resilience') triggers.push(card.title);
    onReward({
      zen: ZP.scenario,
      label: `Quest complete — +${ZP.scenario} ZP`,
      mood: INDICATOR_MOOD[card?.indicator] ?? 3,
      triggers,
    });
  }

  function reset() {
    setStage('tat');
    setCard(null);
    setWord('');
    setScenarioChoice(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-[var(--font-display)] font-bold text-2xl m-0 flex items-center gap-2">
          <Brain size={24} color="var(--accent-violet)" /> Zen Oracle Quest
        </h1>
        <p className="text-[var(--text-muted)] m-0 mt-1">A 30-second read on your head-space. No wrong answers.</p>
      </header>

      {/* Stage 1 — TAT card pick */}
      {stage === 'tat' && (
        <section className="glass-card p-5">
          <h2 className="font-[var(--font-display)] font-semibold text-lg mt-0">
            Which scene matches your head-space?
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {TAT_CARDS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="choice-card flex flex-col"
                data-selected={card?.id === c.id}
                onClick={() => setCard(c)}
              >
                <span className="rounded-lg mb-2" style={{ height: 90, background: c.gradient, display: 'block' }} />
                <span className="font-[var(--font-display)] font-semibold text-sm">{c.title}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn-primary mt-4" disabled={!card} onClick={() => setStage('word')}>
            Next <ArrowRight size={15} />
          </button>
        </section>
      )}

      {/* Stage 2 — descriptor word */}
      {stage === 'word' && (
        <section className="glass-card p-5">
          <h2 className="font-[var(--font-display)] font-semibold text-lg mt-0">Pick one word for it</h2>
          <div className="flex gap-2 flex-wrap">
            {card.words.map((w) => (
              <button
                key={w}
                type="button"
                className="choice-card"
                data-selected={word === w}
                onClick={() => setWord(w)}
              >
                {w}
              </button>
            ))}
          </div>
          <button type="button" className="btn-primary mt-4" disabled={!word} onClick={() => setStage('cbt')}>
            Continue <ArrowRight size={15} />
          </button>
        </section>
      )}

      {/* Stage 3 — CBT scenario */}
      {stage === 'cbt' && (
        <section className="glass-card p-5">
          <h2 className="font-[var(--font-display)] font-semibold text-lg mt-0">{scenario.prompt}</h2>
          <div className="grid grid-cols-2 gap-3">
            {scenario.choices.map((ch) => (
              <button key={ch.id} type="button" className="choice-card" onClick={() => finish(ch)}>
                {ch.text}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Result */}
      {stage === 'done' && (
        <section className="glass-card p-5 flex flex-col items-center text-center" style={{ borderColor: 'var(--accent-teal)' }}>
          <Award size={32} color="var(--accent-teal)" />
          <h2 className="font-[var(--font-display)] font-bold text-lg mt-2 mb-1">Quest complete!</h2>
          <p className="text-[var(--text-muted)] m-0">
            You read your mood as <strong>{word}</strong>. Your response leans toward{' '}
            <strong>{scenarioChoice.profile}</strong>.
          </p>
          <p className="m-0 mt-2">
            {scenarioChoice.healthy
              ? 'That is a healthy, active-coping move. Keep it up. 🌿'
              : 'Notice that urge — and try analyzing the errors calmly instead. Shanti can help.'}
          </p>
          <button type="button" className="btn-secondary mt-4" onClick={reset}>
            Take another
          </button>
        </section>
      )}
    </div>
  );
}

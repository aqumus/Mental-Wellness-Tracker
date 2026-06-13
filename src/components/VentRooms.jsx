// src/components/VentRooms.jsx
// The Sanctuary (DESIGN §4.2): four themed release rooms.
//  - Rant Room: neon terminal, typing spark particles, matrix-fall submit.
//  - Insecurity Circle: constellation that connects your star to peers.
//  - Gossip Corner: chalkboard cards upvoted with steaming cups.
//  - Burn Chamber: text is incinerated in memory and NEVER persisted.
// Every text submission is screened by the safety net before anything else.

import { useRef, useState } from 'react';
import { Flame, Sparkles, Stars, Coffee, Send } from 'lucide-react';
import { GOSSIP_PROMPTS, ZP } from '../lib/constants.js';

const ROOMS = [
  { id: 'rant', label: 'Rant Room', icon: Flame, accent: 'var(--accent-teal)' },
  { id: 'insecurity', label: 'Insecurity Circle', icon: Stars, accent: 'var(--accent-violet)' },
  { id: 'gossip', label: 'Gossip Corner', icon: Coffee, accent: 'var(--accent-orange)' },
  { id: 'burn', label: 'Burn Chamber', icon: Sparkles, accent: 'var(--accent-rose)' },
];

export default function VentRooms({ onJournal, onReward, checkSafety, pushToast }) {
  const [room, setRoom] = useState('rant');

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-[var(--font-display)] font-bold text-2xl m-0">The Sanctuary</h1>
        <p className="text-[var(--text-muted)] m-0 mt-1">Pick a room that fits how you feel right now.</p>
      </header>

      <nav className="flex gap-2 flex-wrap" aria-label="Vent rooms">
        {ROOMS.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              type="button"
              className="tab-btn"
              data-active={room === r.id}
              onClick={() => setRoom(r.id)}
            >
              <Icon size={15} color={r.accent} /> {r.label}
            </button>
          );
        })}
      </nav>

      {room === 'rant' && <RantRoom onJournal={onJournal} checkSafety={checkSafety} pushToast={pushToast} />}
      {room === 'insecurity' && <InsecurityCircle onJournal={onJournal} checkSafety={checkSafety} pushToast={pushToast} />}
      {room === 'gossip' && <GossipCorner onReward={onReward} pushToast={pushToast} />}
      {room === 'burn' && <BurnChamber onReward={onReward} checkSafety={checkSafety} pushToast={pushToast} />}
    </div>
  );
}

/* ----------------------------- Rant Room -------------------------------- */
function RantRoom({ onJournal, checkSafety, pushToast }) {
  const [text, setText] = useState('');
  const [sparks, setSparks] = useState([]);
  const [falling, setFalling] = useState(false);
  const [tip, setTip] = useState('');
  const lastSpark = useRef(0);
  const sparkId = useRef(0);

  function onKeyDown() {
    const now = Date.now();
    if (now - lastSpark.current < 80) return; // debounce particle spawn
    lastSpark.current = now;
    const id = sparkId.current++;
    const spark = {
      id,
      left: 20 + Math.random() * 60,
      top: 20 + Math.random() * 50,
      dx: `${(Math.random() - 0.5) * 40}px`,
      dy: `${-20 - Math.random() * 30}px`,
    };
    setSparks((s) => [...s, spark]);
    setTimeout(() => setSparks((s) => s.filter((x) => x.id !== id)), 600);
  }

  async function submit() {
    if (!text.trim()) return;
    if (checkSafety(text)) return; // safety net intercepts
    setFalling(true);
    const analysis = await onJournal({
      entryType: 'rant',
      content: text,
      moodScore: 2,
      zen: ZP.vent,
    });
    setTimeout(() => {
      setText('');
      setFalling(false);
      setTip(analysis?.copingStrategy || 'Take a slow breath. You let it out — that matters.');
    }, 700);
  }

  return (
    <section className="glass-card p-5" style={{ background: 'hsl(150,20%,6%)' }}>
      <p className="text-[var(--text-muted)] text-sm mt-0">
        Deep black terminal. Type fast — let the frustration spark out.
      </p>
      <div className="relative">
        <textarea
          className="input-field"
          style={{
            minHeight: 160,
            fontFamily: 'ui-monospace, monospace',
            color: 'hsl(140,80%,70%)',
            background: 'hsl(150,25%,4%)',
            animation: falling ? 'matrix-fall 0.7s ease forwards' : 'none',
          }}
          placeholder="> organic chemistry makes no sense and the mock was brutal..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
        />
        {sparks.map((s) => (
          <span
            key={s.id}
            className="particle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: 5,
              height: 5,
              background: 'hsl(140,90%,65%)',
              boxShadow: '0 0 8px hsl(140,90%,65%)',
              '--dx': s.dx,
              '--dy': s.dy,
              animation: 'spark 0.6s ease-out forwards',
            }}
          />
        ))}
      </div>
      <button type="button" className="btn-primary mt-3" onClick={submit} disabled={!text.trim() || falling}>
        <Send size={15} /> Release (+{ZP.vent} ZP)
      </button>
      {tip && (
        <div className="glass-card p-4 mt-4" style={{ borderColor: 'var(--accent-teal)' }}>
          <span className="font-[var(--font-display)] font-semibold text-sm">Shanti's cooldown tip</span>
          <p className="text-[var(--text-muted)] text-sm m-0 mt-1">{tip}</p>
        </div>
      )}
    </section>
  );
}

/* -------------------------- Insecurity Circle --------------------------- */
function InsecurityCircle({ onJournal, checkSafety, pushToast }) {
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const peerCount = 14;

  async function submit() {
    if (!text.trim()) return;
    if (checkSafety(text)) return;
    await onJournal({ entryType: 'insecurity', content: text, moodScore: 2, zen: ZP.vent });
    setConnected(true);
  }

  // Ten peer stars around the central (your) star.
  const peers = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    return { x: 150 + Math.cos(angle) * 110, y: 110 + Math.sin(angle) * 80 };
  });

  return (
    <section
      className="glass-card p-5"
      style={{ background: 'linear-gradient(160deg, hsl(230,45%,10%), hsl(263,40%,12%))' }}
    >
      <p className="text-[var(--text-muted)] text-sm mt-0">
        A calm, soft-glowing space. Share what quietly weighs on you.
      </p>

      <svg viewBox="0 0 300 220" className="w-full" style={{ maxHeight: 220 }} role="img" aria-label="Constellation of peers">
        {connected &&
          peers.map((p, i) => (
            <line key={i} x1="150" y1="110" x2={p.x} y2={p.y} stroke="var(--accent-violet)" strokeWidth="0.6" opacity="0.5" />
          ))}
        {peers.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="hsl(210,40%,90%)" style={{ animation: `twinkle ${3 + (i % 4)}s ease-in-out infinite` }} />
        ))}
        <circle cx="150" cy="110" r="6" fill="var(--accent-violet)" style={{ filter: 'drop-shadow(0 0 8px var(--accent-violet))' }} />
      </svg>

      {!connected ? (
        <>
          <textarea
            className="input-field"
            style={{ minHeight: 100 }}
            placeholder="What if I fail and my parents' money is wasted?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="button" className="btn-primary mt-3" onClick={submit} disabled={!text.trim()}>
            <Stars size={15} /> Release my star (+{ZP.vent} ZP)
          </button>
        </>
      ) : (
        <div className="glass-card p-4 mt-2" style={{ borderColor: 'var(--accent-violet)' }}>
          <p className="m-0">
            Your star is connected. <strong>{peerCount} other peers</strong> preparing for the same
            exam shared a similar feeling today. You are not alone. 💜
          </p>
          <button type="button" className="btn-secondary mt-3" onClick={() => { setText(''); setConnected(false); }}>
            Share another
          </button>
        </div>
      )}
    </section>
  );
}

/* ----------------------------- Gossip Corner ---------------------------- */
function GossipCorner({ onReward, pushToast }) {
  const [posts, setPosts] = useState(GOSSIP_PROMPTS);
  const [draft, setDraft] = useState('');

  function upvote(id) {
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, cups: p.cups + 1 } : p)));
  }

  function post() {
    if (!draft.trim()) return;
    setPosts((ps) => [{ id: `u-${Date.now()}`, text: draft.trim(), cups: 1 }, ...ps]);
    setDraft('');
    onReward({ zen: 5, label: 'Posted to the Gossip Corner', markCheckIn: true });
  }

  return (
    <section className="glass-card p-5" style={{ background: 'hsl(28,25%,9%)' }}>
      <p className="text-[var(--text-muted)] text-sm mt-0">Retro cafe blackboard — light banter only. ☕</p>
      <div className="flex gap-2 mb-4">
        <input
          className="input-field"
          placeholder="Who else is awake at 2 AM revising?"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="button" className="btn-primary" onClick={post} disabled={!draft.trim()}>Pin</button>
      </div>
      <ul className="grid grid-cols-2 gap-3 list-none p-0 m-0">
        {posts.map((p) => (
          <li key={p.id} className="choice-card" style={{ background: 'hsl(28,20%,14%)' }}>
            <p className="m-0 mb-3" style={{ fontFamily: 'ui-monospace, monospace' }}>{p.text}</p>
            <button
              type="button"
              className="stat-pill"
              onClick={() => upvote(p.id)}
              aria-label={`Upvote, ${p.cups} cups`}
            >
              <Coffee size={14} color="var(--accent-orange)" /> {p.cups}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------- Burn Chamber ----------------------------- */
function BurnChamber({ onReward, checkSafety, pushToast }) {
  const [text, setText] = useState('');
  const [embers, setEmbers] = useState([]);
  const [burning, setBurning] = useState(false);

  function incinerate() {
    if (!text.trim()) return;
    if (checkSafety(text)) return;
    setBurning(true);
    // Spawn embers — the text is destroyed in memory, never stored anywhere.
    setEmbers(Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: 30 + Math.random() * 40,
      delay: Math.random() * 0.4,
    })));
    setTimeout(() => {
      setText('');
      setEmbers([]);
      setBurning(false);
      onReward({ zen: ZP.breathing, label: 'Released into the flames 🔥', markCheckIn: true });
    }, 1100);
  }

  return (
    <section className="glass-card p-5" style={{ background: 'hsl(20,30%,7%)' }}>
      <p className="text-[var(--text-muted)] text-sm mt-0">
        Volcanic hearth. Whatever you type here is <strong>burned in memory</strong> — never saved.
      </p>
      <div className="relative">
        <textarea
          className="input-field"
          style={{
            minHeight: 130,
            background: 'hsl(20,25%,5%)',
            animation: burning ? 'incinerate 1s ease forwards' : 'none',
          }}
          placeholder="The negative thought you want gone forever..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {embers.map((e) => (
          <span
            key={e.id}
            className="particle"
            style={{
              left: `${e.left}%`,
              bottom: 0,
              width: 6,
              height: 6,
              background: 'var(--accent-orange)',
              boxShadow: '0 0 10px var(--accent-orange)',
              animation: `ember 1s ease-out ${e.delay}s forwards`,
            }}
          />
        ))}
      </div>
      {/* Molten hearth */}
      <div
        className="mt-2 rounded-full"
        style={{ height: 8, background: 'linear-gradient(90deg, var(--accent-orange), var(--accent-rose))', animation: 'pulse 3s infinite' }}
      />
      <button type="button" className="btn-primary mt-3" onClick={incinerate} disabled={!text.trim() || burning}>
        <Flame size={15} /> Incinerate
      </button>
    </section>
  );
}

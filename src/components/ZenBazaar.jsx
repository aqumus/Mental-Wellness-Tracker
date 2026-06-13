// src/components/ZenBazaar.jsx
// Zen Bazaar (DESIGN §4.4): spend Zen Points on focus audio, planners, a streak
// freeze, or garden skins. Affordable items show a teal redeem with a coin burst;
// unaffordable items show the exact ZP shortfall. Redeemed audio opens a player.

import { useState } from 'react';
import { Store, Check, Play, Pause } from 'lucide-react';
import { STORE_ITEMS } from '../lib/constants.js';

export default function ZenBazaar({ profile, onRedeem, pushToast }) {
  const balance = profile.zenPoints || 0;
  const redeemed = profile.redeemedItems || [];
  const [coins, setCoins] = useState(null); // item id showing the coin burst
  const [player, setPlayer] = useState(null); // active audio item

  async function redeem(item) {
    if (redeemed.includes(item.id) || balance < item.cost) return;
    setCoins(item.id);
    setTimeout(() => setCoins(null), 700);
    await onRedeem(item);
  }

  function useItem(item) {
    if (item.kind === 'audio') setPlayer(item);
    else if (item.kind === 'link') {
      navigator.clipboard?.writeText(item.payload).catch(() => {});
      pushToast('Link copied to clipboard 📋');
    } else {
      pushToast(`${item.title} is active ✓`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="font-[var(--font-display)] font-bold text-2xl m-0 flex items-center gap-2">
          <Store size={24} color="var(--accent-teal)" /> The Zen Bazaar
        </h1>
        <span className="stat-pill" style={{ borderColor: 'var(--accent-violet)' }}>
          Balance: {balance} ZP
        </span>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {STORE_ITEMS.map((item) => {
          const owned = redeemed.includes(item.id);
          const affordable = balance >= item.cost;
          const shortfall = item.cost - balance;
          return (
            <div
              key={item.id}
              className="glass-card p-4 relative flex flex-col"
              style={{ borderColor: owned ? 'var(--accent-teal)' : 'var(--border-glass)' }}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-[var(--text-muted)] text-xs mt-2">{item.category}</span>
              <span className="font-[var(--font-display)] font-semibold mt-0.5">{item.title}</span>
              <p className="text-[var(--text-muted)] text-sm m-0 mt-1 flex-1">{item.desc}</p>
              <span className="font-[var(--font-display)] font-bold my-2">{item.cost} ZP</span>

              {owned ? (
                <button type="button" className="btn-secondary" style={{ borderColor: 'var(--accent-teal)' }} onClick={() => useItem(item)}>
                  <Check size={14} color="var(--accent-teal)" /> Use item
                </button>
              ) : affordable ? (
                <button type="button" className="btn-primary" onClick={() => redeem(item)}>
                  Redeem
                </button>
              ) : (
                <button type="button" className="btn-secondary" disabled>
                  Needs {shortfall} more ZP
                </button>
              )}

              {coins === item.id && (
                <span
                  className="absolute left-1/2 top-1/2 text-2xl"
                  style={{ animation: 'coin-pop 0.7s ease-out forwards' }}
                  aria-hidden="true"
                >
                  🪙
                </span>
              )}
            </div>
          );
        })}
      </section>

      {player && <AudioPlayer item={player} onClose={() => setPlayer(null)} />}
    </div>
  );
}

// Simple in-app focus-audio player drawer. Uses the Web Audio API to synthesize
// brown noise / a soft tone so the demo needs no bundled media files.
function AudioPlayer({ item, onClose }) {
  const [playing, setPlaying] = useState(false);
  const [ctxRef] = useState(() => ({ ctx: null, node: null }));

  function toggle() {
    if (playing) {
      ctxRef.node?.stop?.();
      ctxRef.ctx?.close?.();
      ctxRef.ctx = null;
      ctxRef.node = null;
      setPlaying(false);
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const gain = ctx.createGain();
      gain.gain.value = 0.06;
      let source;
      if (item.id === 'brown_noise_01') {
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 3.5;
        }
        source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
      } else {
        source = ctx.createOscillator();
        source.type = 'sine';
        source.frequency.value = 220;
      }
      source.connect(gain).connect(ctx.destination);
      source.start();
      ctxRef.ctx = ctx;
      ctxRef.node = source;
      setPlaying(true);
    } catch {
      /* audio unavailable — ignore */
    }
  }

  return (
    <div
      className="glass-card p-4 flex items-center gap-4"
      style={{ position: 'fixed', bottom: 16, left: 16, right: 16, maxWidth: 420, margin: '0 auto', zIndex: 45, animation: 'slide-up 0.25s ease' }}
    >
      <span className="text-2xl">{item.icon}</span>
      <div className="flex-1">
        <span className="font-[var(--font-display)] font-semibold block">{item.title}</span>
        <span className="text-[var(--text-muted)] text-sm">{playing ? 'Now playing…' : 'Paused'}</span>
      </div>
      <button type="button" className="chat-fab" style={{ position: 'static', width: 44, height: 44 }} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
    </div>
  );
}

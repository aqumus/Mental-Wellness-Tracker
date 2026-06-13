// src/components/ZenLeague.jsx
// Zen League (DESIGN §4.5): a wellness-only cohort leaderboard ranked by streak
// + Zen Points (never academic scores). "Send Chai" awards a peer a warm nudge
// and earns the sender a few ZP, with an animated cup + toast.

import { useMemo, useState } from 'react';
import { Trophy, Coffee } from 'lucide-react';
import { LEAGUE_PEERS, ZP } from '../lib/constants.js';

export default function ZenLeague({ profile, onReward, pushToast }) {
  const [chaiSent, setChaiSent] = useState({});

  // Merge the player into the cohort and rank by streak, then points.
  const ranked = useMemo(() => {
    const me = {
      id: 'me',
      name: `${profile.name} (you)`,
      streak: profile.streak || 0,
      zenPoints: profile.zenPoints || 0,
      badge: '🧘',
      isMe: true,
    };
    return [...LEAGUE_PEERS, me].sort((a, b) => b.streak - a.streak || b.zenPoints - a.zenPoints);
  }, [profile]);

  function sendChai(peer) {
    if (peer.isMe || chaiSent[peer.id]) return;
    setChaiSent((s) => ({ ...s, [peer.id]: true }));
    onReward({ zen: ZP.sendChai, label: `You sent chai to ${peer.name} ☕`, markCheckIn: false });
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-[var(--font-display)] font-bold text-2xl m-0 flex items-center gap-2">
          <Trophy size={24} color="var(--accent-orange)" /> Zen League
        </h1>
        <p className="text-[var(--text-muted)] m-0 mt-1">
          Ranked by consistency and self-care — never by marks. Cheer a peer with chai.
        </p>
      </header>

      <section className="glass-card overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[var(--text-muted)] text-sm text-left">
              <th className="p-3 font-medium">#</th>
              <th className="p-3 font-medium">Peer</th>
              <th className="p-3 font-medium">Streak</th>
              <th className="p-3 font-medium">ZP</th>
              <th className="p-3 font-medium">Chai</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((peer, i) => (
              <tr
                key={peer.id}
                style={{
                  borderTop: '1px solid var(--border-glass)',
                  background: peer.isMe ? 'var(--border-glow)' : 'transparent',
                }}
              >
                <td className="p-3 font-[var(--font-display)] font-semibold">{i + 1}</td>
                <td className="p-3">{peer.badge} {peer.name}</td>
                <td className="p-3">🔥 {peer.streak}d</td>
                <td className="p-3">{peer.zenPoints}</td>
                <td className="p-3">
                  {peer.isMe ? (
                    <span className="text-[var(--text-muted)] text-sm">—</span>
                  ) : (
                    <button
                      type="button"
                      className="stat-pill"
                      onClick={() => sendChai(peer)}
                      disabled={chaiSent[peer.id]}
                      style={{ opacity: chaiSent[peer.id] ? 0.5 : 1 }}
                    >
                      <Coffee size={14} color="var(--accent-orange)" />
                      {chaiSent[peer.id] ? 'Sent' : 'Send'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

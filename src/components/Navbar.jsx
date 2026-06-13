// src/components/Navbar.jsx
// Persistent frosted header: brand, feature tabs, streak + Zen Points badges,
// and profile/logout. Semantic <header><nav> with keyboard-focusable tabs.

import { Flame, Sparkles, LogOut, Leaf } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Home' },
  { id: 'vent', label: 'Vent Rooms' },
  { id: 'assess', label: 'Assessments' },
  { id: 'league', label: 'Zen League' },
  { id: 'bazaar', label: 'Bazaar' },
  { id: 'insights', label: 'Insights' },
];

export default function Navbar({ profile, view, onNavigate, onOpenSettings, onLogout }) {
  return (
    <header className="glass-card" style={{ borderRadius: 0, position: 'sticky', top: 0, zIndex: 40 }}>
      <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
        <div className="flex items-center gap-2 mr-2">
          <Leaf size={22} color="var(--accent-teal)" />
          <span className="font-[var(--font-display)] font-bold text-lg">ZenStudy</span>
        </div>

        <nav className="flex items-center gap-1 flex-wrap" aria-label="Primary">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="tab-btn"
              data-active={view === t.id}
              aria-current={view === t.id ? 'page' : undefined}
              onClick={() => onNavigate(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <span className="stat-pill" title="Consistency streak">
            <Flame size={15} color="var(--accent-orange)" />
            {profile?.streak || 0}d
          </span>
          <span className="stat-pill" title="Zen Points">
            <Sparkles size={15} color="var(--accent-violet)" />
            {profile?.zenPoints || 0} ZP
          </span>
          <button
            type="button"
            className="tab-btn"
            onClick={onOpenSettings}
            title="Settings"
          >
            {profile?.name || 'Profile'}
          </button>
          <button type="button" className="tab-btn" onClick={onLogout} title="Log out" aria-label="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

// src/components/MindGarden.jsx
// Native inline SVG plant that reflects the streak-driven growth/decay state
// (DESIGN §4.1). No image assets, no chart libs — pure vector for instant load.

import { getGardenState } from '../lib/garden.js';

// Per-state visual parameters. Growth states get green/teal healthy palettes;
// decay states get progressively paler → brown → fungal treatments.
const PALETTE = {
  seed:     { leaf: 'hsl(162,55%,45%)', stem: 'hsl(162,45%,38%)', droop: 0, height: 26, leaves: 1, flower: false },
  sprout:   { leaf: 'hsl(162,70%,48%)', stem: 'hsl(162,55%,40%)', droop: 0, height: 54, leaves: 2, flower: false },
  tall:     { leaf: 'hsl(155,72%,50%)', stem: 'hsl(155,55%,42%)', droop: 0, height: 88, leaves: 4, flower: false },
  bloom:    { leaf: 'hsl(150,75%,52%)', stem: 'hsl(150,55%,44%)', droop: 0, height: 110, leaves: 5, flower: true },
  pale:     { leaf: 'hsl(70,55%,55%)',  stem: 'hsl(80,35%,45%)',  droop: 8, height: 64, leaves: 3, flower: false },
  drooping: { leaf: 'hsl(55,45%,52%)',  stem: 'hsl(60,30%,42%)',  droop: 26, height: 60, leaves: 3, flower: false },
  wilted:   { leaf: 'hsl(28,40%,38%)',  stem: 'hsl(25,30%,32%)',  droop: 40, height: 52, leaves: 3, flower: false, spots: true },
  fungal:   { leaf: 'hsl(28,25%,30%)',  stem: 'hsl(25,20%,26%)',  droop: 48, height: 46, leaves: 3, flower: false, spots: true, fungus: true },
};

export default function MindGarden({ profile, size = 220 }) {
  const stateInfo = getGardenState(profile);
  const p = PALETTE[stateInfo.key] || PALETTE.seed;
  const goldenPot = (profile?.redeemedItems || []).includes('golden_pot');
  const cx = 110;
  const groundY = 200;
  const topY = groundY - p.height;

  // Leaf positions distributed up the stem.
  const leaves = Array.from({ length: p.leaves }, (_, i) => {
    const t = (i + 1) / (p.leaves + 1);
    const y = groundY - p.height * t;
    const side = i % 2 === 0 ? 1 : -1;
    return { y, side };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      role="img"
      aria-label={`Mind garden plant: ${stateInfo.label}`}
    >
      <defs>
        <radialGradient id="garden-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={stateInfo.accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stateInfo.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient mood glow */}
      <circle cx={cx} cy="100" r="100" fill="url(#garden-glow)" />

      {/* Soil */}
      <ellipse cx={cx} cy={groundY} rx="54" ry="12" fill="hsl(24,30%,22%)" />

      {/* Stem */}
      <path
        d={`M ${cx} ${groundY} Q ${cx + p.droop} ${(groundY + topY) / 2} ${cx + p.droop * 1.3} ${topY}`}
        stroke={p.stem}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Leaves */}
      {leaves.map((lf, i) => (
        <ellipse
          key={i}
          cx={cx + lf.side * 22}
          cy={lf.y}
          rx="22"
          ry="11"
          fill={p.leaf}
          transform={`rotate(${lf.side * (25 + p.droop)} ${cx + lf.side * 22} ${lf.y})`}
        />
      ))}

      {/* Flower (full bloom only) */}
      {p.flower && (
        <g transform={`translate(${cx + p.droop * 1.3} ${topY})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx="0"
              cy="-12"
              rx="7"
              ry="13"
              fill="var(--accent-rose)"
              transform={`rotate(${a})`}
            />
          ))}
          <circle r="7" fill="var(--accent-orange)" />
        </g>
      )}

      {/* Black rot spots (wilted / fungal) */}
      {p.spots && (
        <>
          <circle cx={cx - 4} cy={groundY - 24} r="3" fill="hsl(0,0%,8%)" />
          <circle cx={cx + 8} cy={groundY - 44} r="2.5" fill="hsl(0,0%,8%)" />
        </>
      )}

      {/* Fungal spore dots */}
      {p.fungus && (
        <>
          <circle cx={cx - 28} cy={groundY - 2} r="3" fill="hsl(0,0%,80%)" opacity="0.8" />
          <circle cx={cx + 22} cy={groundY + 2} r="2.5" fill="hsl(0,0%,75%)" opacity="0.8" />
          <circle cx={cx + 2} cy={groundY - 60} r="2" fill="hsl(0,0%,82%)" opacity="0.7" />
        </>
      )}

      {/* Pot */}
      <path
        d={`M ${cx - 50} ${groundY} L ${cx - 40} ${groundY + 16} L ${cx + 40} ${groundY + 16} L ${cx + 50} ${groundY} Z`}
        fill={goldenPot ? 'hsl(45,80%,55%)' : 'hsl(263,30%,30%)'}
        stroke={goldenPot ? 'hsl(45,90%,65%)' : 'var(--border-glass)'}
        strokeWidth="1.5"
      />

      {/* Fungal mist overlay */}
      {p.fungus && (
        <rect x="0" y="0" width="220" height="220" fill="hsl(0,0%,60%)" opacity="0.14" />
      )}
    </svg>
  );
}

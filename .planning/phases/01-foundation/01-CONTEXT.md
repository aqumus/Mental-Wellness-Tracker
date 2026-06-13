# Phase 1: Foundation - Context

**Gathered:** 2026-06-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 delivers the runnable scaffold and the full auth/onboarding entry loop:

- Vite + React project scaffold with the glassmorphic design system (HSL tokens, keyframe animations, Outfit/Inter fonts) in `src/index.css`.
- Service layer: `firebase.js`, `dbService.js` (dual-path Firestore/localStorage), `geminiService.js` (client setup + mock methods). Built to interface specs so later phases plug in.
- Auth: email/password sign-up + login (session persists across refresh), one-click anonymous guest entry.
- Onboarding: name, target exam, exam date, starting plant seed → creates user document → routes to dashboard.
- A navigable dashboard shell.
- Offline mock mode: the app loads and is fully navigable with no Firebase/Gemini credentials configured.

Covers: AUTH-01..06, SET-02.

**Not this phase:** vent rooms, assessments, Mind Garden rendering logic, gamification/league, store, insights, the Shanti chat companion, the Settings credential panel (SET-01, Phase 4). Those land in Phases 2–4.

</domain>

<decisions>
## Implementation Decisions

The user instructed "use sensible defaults." All decisions below are Claude's discretion, grounded in the existing root-level `DESIGN.md` and `IMPLEMENTATION_PLAN.md`.

### Language & Tooling
- **D-01:** JavaScript with `.jsx` files (not TypeScript) — matches `IMPLEMENTATION_PLAN.md` file naming (`firebase.js`, `App.jsx`) and keeps hackathon velocity high.
- **D-02:** Vite + React scaffold. Dependencies: `lucide-react` (icons), `@google/generative-ai` (Gemini, wired in Phase 4 but installed now). No other heavy deps.

### Styling system
- **D-03:** Plain CSS with HSL custom properties (CSS variables) and hand-rolled utility classes centralized in `src/index.css` — per `IMPLEMENTATION_PLAN.md` ("Tailwind-like HSL setup in index.css", "Zero inline styles"). **No Tailwind** — avoids build config overhead and keeps the bundle lean (Efficiency criterion). Keyframes (`breathe`, `incinerate`, matrix-fall) defined centrally.

### Routing & state
- **D-04:** Internal state-machine routing in `App.jsx` via conditional rendering on `(session, profileComplete)` — Auth → Onboarding → Dashboard. **No `react-router-dom`** — `IMPLEMENTATION_PLAN.md` states "App.jsx controls routing states"; in-app tab switching (vents/garden/league/etc.) is also state-driven, so a router adds little. Fewer deps, simpler.

### Mock-mode strategy (SET-02 / AUTH-06)
- **D-05:** `firebase.js` detects whether valid Firebase config is present (env vars / in-app settings). If absent → app runs in **mock mode by default** so examiners launch with zero setup.
- **D-06:** `dbService.js` is dual-path: when Firebase is initialized it reads/writes Firestore (`users` collection per `DESIGN.md` §3.1); otherwise it reads/writes `localStorage` under a namespaced key. Same method surface either way (`getUser`, `updateUser`, `logJournal`, `getJournals`, `saveChatHistory`).
- **D-07:** Guest entry (`signInAnonymously` when live; a generated local id when mock) creates a temporary profile in the active store immediately, then routes to onboarding.
- **D-08:** Phase 1 seeds only what auth/onboarding needs (the current user's profile). Cohort/league/journal seed data belongs to later phases.

### Dashboard shell scope
- **D-09:** Phase 1 dashboard is a **navigable shell, not bare**: persistent `Navbar` (name, streak counter, Zen Point balance — reading from profile, zero/initial values fine) plus a greeting and placeholder regions/tabs for the feature areas (vents, garden, league, bazaar, insights) so success criterion "fully navigable" holds. Placeholders are replaced as Phases 2–4 land their features. No feature logic implemented here.

### Security (carried from PROJECT.md / IMPLEMENTATION_PLAN.md)
- **D-10:** No hardcoded Firebase/Gemini keys committed. Credentials come from env vars or (Phase 4) the Settings panel. `.env*` and any local secrets gitignored.

### Claude's Discretion
All of the above — the user delegated these decisions. Planner/executor may refine file-level structure as long as the locked decisions and the `DESIGN.md`/`IMPLEMENTATION_PLAN.md` contracts hold.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product & scope
- `.planning/PROJECT.md` — project vision, core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — v1 requirement IDs and traceability (Phase 1 = AUTH-01..06, SET-02)
- `.planning/ROADMAP.md` §"Phase 1: Foundation" — goal + 5 success criteria

### Design contract (root-level, authored before GSD init — primary source of truth for visuals & schemas)
- `DESIGN.md` §1 — Visual Design System: exact HSL CSS theme tokens, fonts (Outfit/Inter), glass blur, aesthetic guidelines (tactile buttons, frosted edges, mood gradients)
- `DESIGN.md` §2 — Auth portal + onboarding ("Zen Gate") flows, including the auth-state mermaid diagram and Firebase calls (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signInAnonymously`)
- `DESIGN.md` §3.1 — `users` Firestore collection schema (name, targetExam, targetDate, startingPlant, streak, zenPoints, lastActive, createdAt, redeemedItems)

### Build plan (root-level)
- `IMPLEMENTATION_PLAN.md` §1 — hackathon evaluation criteria (Code Quality, Alignment, Security, Efficiency, Testing, Accessibility) that constrain coding practices
- `IMPLEMENTATION_PLAN.md` §2 Phase 1 — skeleton & CSS theme (package.json, index.html, vite.config.js, src/index.css)
- `IMPLEMENTATION_PLAN.md` §2 Phase 2 — services layer interface contracts (`firebase.js`, `dbService.js`, `geminiService.js`)
- `IMPLEMENTATION_PLAN.md` §2 Phase 3 — `Navbar.jsx`, `Auth.jsx`, `Onboarding.jsx` component targets
- `IMPLEMENTATION_PLAN.md` §2 Phase 4 — `App.jsx` routing-state shell

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield. No `src/`, no `package.json` yet. This phase creates the scaffold all later phases build on.

### Established Patterns
- The root-level `DESIGN.md`/`IMPLEMENTATION_PLAN.md` define the patterns to establish: presentation/logic separation (components vs services), centralized HSL utility classes, mock-first services.

### Integration Points
- `dbService.js` method surface is the contract Phases 2–4 depend on — design it complete now even though only `getUser`/`updateUser` are exercised in Phase 1.
- `geminiService.js` is scaffolded with mock methods now; live Gemini wiring is Phase 4.

</code_context>

<specifics>
## Specific Ideas

- Visual fidelity targets are concrete and pre-specified in `DESIGN.md` §1 — implement the exact HSL token values and aesthetic guidelines, not approximations.
- Guest Mode must reach the dashboard in a single click (success criterion 2) — keep that path frictionless.

</specifics>

<deferred>
## Deferred Ideas

- Settings credential panel (SET-01) — Phase 4 (Shanti & Hardening).
- Mind Garden rendering and decay states — Phase 2 (referenced in onboarding plant-seed choice, but the garden component itself is later).
- Cohort/league seed data — Phase 3.

None of these were scope creep; they are roadmap-assigned to later phases.

</deferred>

---

*Phase: 1-Foundation*
*Context gathered: 2026-06-13*

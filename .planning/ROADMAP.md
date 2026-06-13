# Roadmap: ZenStudy

## Overview

ZenStudy ships as four coarse phases tuned for a hackathon deadline. Phase 1 lays the foundation — scaffolding, design system, service layer, auth, and onboarding — so that a real demoable login-to-dashboard flow exists immediately. Phase 2 delivers the core emotional experience: all four themed vent rooms, playful assessments, and the Mind Garden with streak-driven growth and decay. Phase 3 unlocks engagement mechanics and social proof: Zen Points economy, Zen League leaderboard with "Send Chai", the Zen Bazaar store, and the Insights view. Phase 4 completes and hardens the product: Shanti AI companion with full context injection, safety net keyword detection, settings panel, and a final security/accessibility/performance pass that satisfies every hackathon evaluation parameter.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Project scaffolding, glassmorphic design system, dual-path service layer, auth, and onboarding
- [ ] **Phase 2: Core Experience** - Four themed vent rooms, playful TAT/CBT assessments, and streaked Mind Garden
- [ ] **Phase 3: Engagement & Social** - Zen Points economy, Zen League, Zen Bazaar store, and Insights view
- [ ] **Phase 4: Shanti & Hardening** - AI companion with context injection, safety net, settings, and audit pass

## Phase Details

### Phase 1: Foundation

**Goal**: A new user can sign up or enter as a guest, complete onboarding, and land on the dashboard — with the full service layer operating in offline mock mode when Firebase/Gemini are not configured.
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, SET-02
**Success Criteria** (what must be TRUE):

  1. User can sign up with email/password, and log back in on page refresh without losing session
  2. User can tap Guest Mode and be on the dashboard in one click, with a local anonymous profile
  3. A new user who completes onboarding (name, target exam, exam date, plant seed) is routed to the dashboard with their profile stored
  4. The app loads and is fully navigable without any Firebase or Gemini credentials configured (mock mode)
  5. The glassmorphic design system (HSL tokens, keyframe animations, Outfit/Inter fonts) renders correctly across all screens

**Plans**: 5 plansPlans:
**Wave 1**

- [x] 01-01-PLAN.md — Scaffold Vite + React 19 project and glassmorphic design system (index.css)
- [ ] 01-02-PLAN.md — Dual-path service layer: firebase.js mock gate, dbService.js, geminiService.js

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 01-03-PLAN.md — Auth.jsx (signup/login/guest) + Onboarding.jsx (4-step Zen Gate)
- [ ] 01-04-PLAN.md — Navbar.jsx + Dashboard.jsx navigable shell

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-05-PLAN.md — App.jsx (user, profile) state machine wiring + main.jsx render

**UI hint**: yes

### Phase 2: Core Experience

**Goal**: A student can release stress through any of the four themed vent rooms, complete a playful mood assessment, and watch their Mind Garden grow or decay based on their consistency streak.
**Depends on**: Phase 1
**Requirements**: VENT-01, VENT-02, VENT-03, VENT-04, VENT-05, ASSESS-01, ASSESS-02, ASSESS-03, GARDEN-01, GARDEN-02, GARDEN-03
**Success Criteria** (what must be TRUE):

  1. User can submit a Rant Room entry and see typing spark particles followed by a matrix-fall submit animation
  2. User can incinerate a thought in the Burn Chamber — the text is visually destroyed and never appears in any data store
  3. User can complete the TAT visual card swipe and the CBT branching scenario, with each mapping to a stress/behavioral indicator and awarding Zen Points
  4. The Mind Garden SVG reflects the current streak growth stage, and decaying over missed days shows drooping → wilted → fungal transitions
  5. Any completed daily wellness task (vent, assessment, breathing) immediately restores the plant to a healthy state

**Plans**: TBD
**UI hint**: yes

### Phase 3: Engagement & Social

**Goal**: A student can earn and spend Zen Points, compete on a wellness-only leaderboard, redeem store items including focus audio, and see their mood history and extracted stress triggers in the Insights view.
**Depends on**: Phase 2
**Requirements**: GAME-01, GAME-02, GAME-03, GAME-04, STORE-01, STORE-02, STORE-03, INSIGHT-01, INSIGHT-02
**Success Criteria** (what must be TRUE):

  1. User earns Zen Points for check-ins, assessments, vents, and breathing exercises, with the running total visible in the navbar streak counter
  2. The Zen League shows a cohort leaderboard ranked by streak/wellness points — no academic scores are displayed anywhere
  3. User can send an animated "Send Chai" interaction to a peer on the leaderboard
  4. User can browse the Zen Bazaar, redeem an affordable item (Zen Points are deducted and item unlocked), and launch in-app focus audio playback; unaffordable items show the ZP shortfall
  5. The Insights view renders a mood timeline as native inline SVG (no charting library) and surfaces extracted stress triggers from journal history

**Plans**: TBD
**UI hint**: yes

### Phase 4: Shanti & Hardening

**Goal**: The Shanti AI companion delivers context-aware, safe chat responses driven by the user's identity, mood, stressors, and streak — and the app passes a full security, accessibility, and performance audit suitable for hackathon evaluation.
**Depends on**: Phase 3
**Requirements**: SHANTI-01, SHANTI-02, SHANTI-03, SHANTI-04, SAFE-01, SET-01
**Success Criteria** (what must be TRUE):

  1. User can open Shanti from the floating button and send messages; responses reference the user's exam context, recent mood, and active stressors (demonstrable via a Physics mock stress scenario)
  2. Chat history persists across page refreshes (Firestore in live mode, localStorage in offline mode)
  3. Entering a trigger keyword (self-harm / depression indicator) in any text field raises the safety modal with professional helpline links
  4. User can configure Gemini API key and Firebase credentials in the Settings panel, and the configured keys activate live services without requiring a code change or app restart
  5. AI chat content renders via safe React text nodes — no `dangerouslySetInnerHTML` — and all interactive elements pass aria-expanded/aria-controls and :focus-visible keyboard checks

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/5 | In Progress | - |
| 2. Core Experience | 0/TBD | Not started | - |
| 3. Engagement & Social | 0/TBD | Not started | - |
| 4. Shanti & Hardening | 0/TBD | Not started | - |

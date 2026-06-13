# Requirements: ZenStudy

**Defined:** 2026-06-13
**Core Value:** A stressed exam aspirant can vent, check in, and feel genuinely understood — the journal-to-AI-companion loop must work.

## v1 Requirements

Requirements for the hackathon release. Each maps to a roadmap phase. Derived from `REQUIREMENTS.md`, `DESIGN.md`, and `IMPLEMENTATION_PLAN.md`.

### Authentication & Onboarding

- [ ] **AUTH-01**: User can sign up with email and password (Firebase `createUserWithEmailAndPassword`)
- [ ] **AUTH-02**: User can log in with email and password and stay logged in across refresh
- [ ] **AUTH-03**: User can enter as a guest via one-click anonymous session (`signInAnonymously`)
- [ ] **AUTH-04**: New users complete onboarding: name, target exam (JEE/NEET/UPSC/Boards), exam date, starting plant seed
- [ ] **AUTH-05**: Completing onboarding creates the user document and routes to the dashboard
- [ ] **AUTH-06**: App works offline — auth/data fall back to localStorage when Firebase is not configured

### Vent Rooms

- [ ] **VENT-01**: User can submit a Rant Room entry (Neon Matrix theme) and see typing spark particles + matrix-fall submit animation
- [ ] **VENT-02**: User can submit an Insecurity Circle entry (Celestial theme) and see it connect to peer stars with a "you are not alone" message
- [ ] **VENT-03**: User can post and upvote in the Gossip Corner (Cafe Blackboard theme)
- [ ] **VENT-04**: User can incinerate a thought in the Burn Chamber (Volcanic theme); burnt text is destroyed in memory and never persisted
- [ ] **VENT-05**: Submitting a Rant or Insecurity entry triggers an AI coping/reframing card and awards Zen Points

### Playful Assessment

- [ ] **ASSESS-01**: User can complete the TAT-inspired visual card swipe and the selection maps to a stress indicator
- [ ] **ASSESS-02**: User can complete a CBT branching scenario dilemma that maps to a behavioral profile
- [ ] **ASSESS-03**: Assessments are surfaced as Zen Oracle quest cards with a Zen Point reward

### Mind Garden

- [ ] **GARDEN-01**: Mind Garden renders the user's chosen plant as inline SVG reflecting current streak growth stage
- [ ] **GARDEN-02**: Garden decays through defined stages (drooping → wilted → fungal) as daily check-ins are missed
- [ ] **GARDEN-03**: Completing any daily wellness task instantly recovers the plant to a healthy state

### Gamification & League

- [ ] **GAME-01**: User earns Zen Points for check-ins, assessments, vents, and breathing exercises per the defined ZP schedule
- [ ] **GAME-02**: Consistency streak increments on daily activity and is displayed in the navbar
- [ ] **GAME-03**: Zen League shows a cohort leaderboard ranked by streak/wellness points, with no academic scores displayed
- [ ] **GAME-04**: User can "Send Chai" to a peer in the league with an animated interaction

### Zen Bazaar (Store)

- [ ] **STORE-01**: User can browse redeemable items (focus audio, study planners, streak freeze, garden skins) with ZP costs
- [ ] **STORE-02**: User can redeem an affordable item — ZP is deducted and the item is unlocked; unaffordable items show the ZP shortfall
- [ ] **STORE-03**: Redeeming focus audio launches an in-app player; streak freeze token protects the garden from one missed day

### Insights

- [ ] **INSIGHT-01**: Insights view plots the mood timeline as native inline SVG (no charting library)
- [ ] **INSIGHT-02**: Insights surface extracted stress triggers from journal history

### Shanti AI Companion

- [ ] **SHANTI-01**: User can open Shanti from a floating button and exchange messages in a chat drawer
- [ ] **SHANTI-02**: Shanti responses are context-aware — system prompt injects identity, recent mood, active stressors, journal highlights, and streak
- [ ] **SHANTI-03**: Chat history persists per user (Firestore or localStorage)
- [ ] **SHANTI-04**: AI chat renders via safe React text nodes (no `dangerouslySetInnerHTML`)

### Safety & Settings

- [ ] **SAFE-01**: Trigger keywords (self-harm / depression indicators) raise a static modal with professional helpline links
- [ ] **SET-01**: User can configure Gemini API key and Firebase credentials via an in-app Settings panel; keys are never committed to git
- [ ] **SET-02**: Service layer exposes mock methods so the app runs fully offline for examiners

## v2 Requirements

Deferred beyond the hackathon.

### Community

- **COMM-01**: Real-time peer chat
- **COMM-02**: "Message in a Bottle" peer comfort exchange
- **COMM-03**: "Silent Library" co-presence study mode

## Out of Scope

| Feature | Reason |
|---------|--------|
| Native mobile app | Web-first for the hackathon |
| Heavy charting libraries | Mood graphs are native inline SVG (efficiency criterion) |
| Custom backend server / API | Firebase + client-side Gemini only; nothing to maintain |
| Clinical-grade diagnosis | Wellness support, not a medical tool |
| Academic-score leaderboards | Explicitly anti-feature — league is wellness-only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| AUTH-06 | Phase 1 | Pending |
| SET-02  | Phase 1 | Pending |
| VENT-01 | Phase 2 | Pending |
| VENT-02 | Phase 2 | Pending |
| VENT-03 | Phase 2 | Pending |
| VENT-04 | Phase 2 | Pending |
| VENT-05 | Phase 2 | Pending |
| ASSESS-01 | Phase 2 | Pending |
| ASSESS-02 | Phase 2 | Pending |
| ASSESS-03 | Phase 2 | Pending |
| GARDEN-01 | Phase 2 | Pending |
| GARDEN-02 | Phase 2 | Pending |
| GARDEN-03 | Phase 2 | Pending |
| GAME-01 | Phase 3 | Pending |
| GAME-02 | Phase 3 | Pending |
| GAME-03 | Phase 3 | Pending |
| GAME-04 | Phase 3 | Pending |
| STORE-01 | Phase 3 | Pending |
| STORE-02 | Phase 3 | Pending |
| STORE-03 | Phase 3 | Pending |
| INSIGHT-01 | Phase 3 | Pending |
| INSIGHT-02 | Phase 3 | Pending |
| SHANTI-01 | Phase 4 | Pending |
| SHANTI-02 | Phase 4 | Pending |
| SHANTI-03 | Phase 4 | Pending |
| SHANTI-04 | Phase 4 | Pending |
| SAFE-01 | Phase 4 | Pending |
| SET-01 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 (coverage complete)

| Phase | Requirements | Count |
|-------|-------------|-------|
| Phase 1: Foundation | AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, SET-02 | 7 |
| Phase 2: Core Experience | VENT-01, VENT-02, VENT-03, VENT-04, VENT-05, ASSESS-01, ASSESS-02, ASSESS-03, GARDEN-01, GARDEN-02, GARDEN-03 | 11 |
| Phase 3: Engagement & Social | GAME-01, GAME-02, GAME-03, GAME-04, STORE-01, STORE-02, STORE-03, INSIGHT-01, INSIGHT-02 | 9 |
| Phase 4: Shanti & Hardening | SHANTI-01, SHANTI-02, SHANTI-03, SHANTI-04, SAFE-01, SET-01 | 6 |

---
*Requirements defined: 2026-06-13*
*Last updated: 2026-06-13 after roadmap creation — traceability complete*

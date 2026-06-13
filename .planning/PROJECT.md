# ZenStudy — Mental Wellness Tracker

## What This Is

ZenStudy is a gamified, AI-driven mental wellness web app for Indian competitive-exam aspirants (JEE, NEET, UPSC, GATE, Boards). It replaces clinical questionnaires with playful visual assessments, themed emotional-release rooms, and a stateful AI companion ("Shanti") that remembers each student's exam context, mood history, and journal highlights to deliver hyper-personalized coaching. Built for the PromptWars Mumbai hackathon.

## Core Value

A stressed exam aspirant can vent, check in, and feel genuinely understood — Shanti and the themed rooms turn self-care into something engaging enough that students come back daily. If everything else fails, the journal-to-AI-companion loop (vent → context-aware empathetic response) must work.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Email/password + anonymous guest auth (Firebase), with localStorage fallback
- [ ] Onboarding (name, target exam, exam date, starting plant seed)
- [ ] Four themed vent rooms: Rant (Neon Matrix), Insecurity Circle (Celestial), Gossip Corner (Cafe Blackboard), Burn Chamber (Volcanic)
- [ ] Playful mood assessment: TAT-inspired visual card swipe + CBT branching scenario dilemmas
- [ ] SVG Mind Garden with streak-driven growth and multi-stage decay states
- [ ] Zen Points economy + Zen League consistency leaderboard (no academic scores shown)
- [ ] Zen Bazaar redeemable store (focus audio, planners, streak freeze, garden skins)
- [ ] Insights view (inline-SVG mood timeline + extracted stress triggers)
- [ ] Shanti AI companion (Gemini Flash) with stateful context injection (identity, mood, stressors, journal highlights, streak)
- [ ] Safety net: trigger-keyword detection → professional helpline modal

### Out of Scope

- Real-time peer chat — high complexity; community value delivered via async league/constellation instead
- Native mobile app — web-first for the hackathon
- Heavy charting libraries — mood graphs rendered as native inline SVG (efficiency criterion)
- Backend server / custom API — Firebase + client-side Gemini calls only; no separate backend to maintain
- Clinical-grade diagnosis — this is wellness support, not a medical tool

## Context

- **Hackathon project:** PromptWars Mumbai. Evaluation parameters drive coding practices: Code Quality, Problem-Statement Alignment, Security, Efficiency, Testing, Accessibility.
- **Existing artifacts:** Detailed `REQUIREMENTS.md`, `DESIGN.md` (full visual system, Firestore schemas, state machines), and `IMPLEMENTATION_PLAN.md` (7-phase parallel build) already authored at repo root. These are the source of truth for product/design detail.
- **Greenfield code:** No `src/` yet — planning docs only. Build from scratch.
- **Visual identity:** Dark glassmorphism inspired by Duolingo (gamified micro-feedback), Forest (calming nature progress), Linear (slick dark UI). HSL theme tokens, Outfit/Inter fonts.
- **Mock-first services:** Service files expose mock methods so the app runs fully offline for examiners without live Firebase/Gemini credentials.

## Constraints

- **Tech stack**: React + Vite, `lucide-react`, `@google/generative-ai` — matches existing implementation plan; no framework churn.
- **AI provider**: Gemini Flash for Shanti — confirmed; hackathon problem-statement alignment expects it.
- **Timeline**: Hard hackathon deadline — prioritize a shippable, demoable build over completeness.
- **Security**: No hardcoded keys — Gemini/Firebase credentials configured via in-app Settings, never committed. Burn Room thoughts destroyed in memory, never persisted. No `dangerouslySetInnerHTML` for AI/chat content (XSS).
- **Efficiency**: Native inline SVG for charts/garden; debounce keyboard-driven particle animations.
- **Accessibility**: Semantic HTML5, `aria-expanded`/`aria-controls` on drawers/dialogs, `:focus-visible` states.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep Gemini Flash for Shanti | Matches existing specs and hackathon problem-statement alignment | — Pending |
| Full feature set in v1 | Hackathon scoring rewards the complete differentiated vision | — Pending |
| Firebase + localStorage dual-path | Works offline for examiners; no backend to maintain | — Pending |
| Coarse phase granularity | Fast hackathon iteration; fewer broader phases | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-13 after initialization*

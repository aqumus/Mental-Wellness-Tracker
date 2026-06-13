# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-13
**Phase:** 1-Foundation
**Areas discussed:** Styling system, Routing & state, Mock-mode strategy, Dashboard shell scope (resolved via "use sensible defaults")

---

The four gray areas below were surfaced for discussion. The user responded **"use sensible defaults,"** delegating all four to Claude's discretion. Defaults were grounded in the pre-existing root-level `DESIGN.md` and `IMPLEMENTATION_PLAN.md`.

## Styling system

| Option | Description | Selected |
|--------|-------------|----------|
| Plain CSS utility classes in index.css | HSL custom properties, hand-rolled utilities — per IMPLEMENTATION_PLAN | ✓ (default) |
| Tailwind CSS | Adopt Tailwind config | |

**User's choice:** Use sensible default → Plain CSS (matches docs, leaner bundle).

## Routing & state

| Option | Description | Selected |
|--------|-------------|----------|
| Internal state machine in App.jsx | Conditional render on session/profile state | ✓ (default) |
| react-router-dom | Library router | |

**User's choice:** Use sensible default → Internal state machine (IMPLEMENTATION_PLAN says "App.jsx controls routing states").

## Mock-mode strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-detect missing config → mock by default | dbService dual-path Firestore/localStorage; live creds via env/Settings | ✓ (default) |

**User's choice:** Use sensible default → Mock-by-default so examiners run with zero setup.

## Dashboard shell scope

| Option | Description | Selected |
|--------|-------------|----------|
| Navigable shell | Navbar + greeting + placeholder feature tabs | ✓ (default) |
| Bare shell | Minimal landing only | |

**User's choice:** Use sensible default → Navigable shell (satisfies "fully navigable" success criterion).

---

## Claude's Discretion

All four areas — the user explicitly delegated with "use sensible defaults." Decisions D-01 through D-10 in CONTEXT.md were made by Claude, anchored to DESIGN.md and IMPLEMENTATION_PLAN.md.

## Deferred Ideas

- Settings credential panel (SET-01) — Phase 4.
- Mind Garden rendering/decay — Phase 2.
- Cohort/league seed data — Phase 3.

(All roadmap-assigned to later phases; none were scope creep.)

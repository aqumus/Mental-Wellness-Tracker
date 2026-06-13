---
phase: 01-foundation
plan: 02
subsystem: database
tags: [firebase, firestore, localstorage, gemini, mock-mode, service-layer]

# Dependency graph
requires:
  - phase: 01-foundation/01-01
    provides: Vite + React scaffold with all npm dependencies installed

provides:
  - firebase.js: MOCK_MODE flag + HMR-safe Firebase Auth/Firestore init or null instances
  - dbService.js: dual-path CRUD with five-method surface (getUser, updateUser, logJournal, getJournals, saveChatHistory)
  - geminiService.js: GEMINI_MOCK_MODE flag + mock analyzeJournalEntry + sendCompanionMessage

affects:
  - 01-03 (Auth components consume firebase.js + dbService.js)
  - 01-04 (Onboarding uses updateUser)
  - 01-05 (App.jsx state machine uses all three services)
  - phase-02 (journal service surface already frozen)
  - phase-04 (live Gemini wiring swaps GEMINI_MOCK_MODE branch)

# Tech tracking
tech-stack:
  added:
    - firebase v12.14.0 (modular v9+ imports from firebase/app, firebase/auth, firebase/firestore)
    - "@google/generative-ai v0.24.1 (imported but live branch deferred to Phase 4)"
  patterns:
    - MOCK_MODE flag pattern: !apiKey || !projectId check at module load via import.meta.env
    - HMR-safe Firebase init: getApps().length ? getApp() : initializeApp(config)
    - Dual-path service method: if (MOCK_MODE) localStorage branch else Firestore branch
    - localStorage helpers (lsGet/lsSet) wrapped in try/catch for QuotaExceededError safety
    - Namespaced localStorage keys: zenstudy:users:{uid}, zenstudy:journals:{uid}, zenstudy:chat:{uid}
    - setDoc with merge:true for all partial user updates

key-files:
  created:
    - src/services/firebase.js
    - src/services/dbService.js
    - src/services/geminiService.js

key-decisions:
  - "MOCK_MODE derived from !apiKey || !projectId — any missing required field activates mock"
  - "dbService lsSet never rethrows QuotaExceededError — logs warn and returns silently (T-01-04)"
  - "updateUser always uses setDoc with merge:true to prevent clobbering streak/zenPoints (T-01-06)"
  - "geminiService live branch scaffolded as commented TODO — unreachable until Phase 4 wires VITE_GEMINI_API_KEY"
  - "Journal list capped at 100 entries in mock mode to bound localStorage growth"
  - "saveChatHistory stores under users/{uid}.chatHistory in Firestore to avoid a separate collection"

patterns-established:
  - "Mock-first service pattern: every exported function branches on MOCK_MODE, identical signatures both paths"
  - "lsGet/lsSet helper pattern: centralised try/catch wrappers used by all localStorage ops"
  - "GEMINI_MOCK_MODE mirrors MOCK_MODE so Phase 4 wiring follows identical flip-flag pattern"

requirements-completed: [AUTH-06, SET-02]

# Metrics
duration: 12min
completed: 2026-06-13
---

# Phase 01 Plan 02: Service Layer Summary

**Dual-path service layer with firebase.js MOCK_MODE gate, five-method dbService CRUD (Firestore/localStorage), and geminiService scaffold with canned mock responses**

## Performance

- **Duration:** 12 min
- **Started:** 2026-06-13T00:00:00Z
- **Completed:** 2026-06-13T00:12:00Z
- **Tasks:** 2 of 2
- **Files modified:** 3

## Accomplishments

- firebase.js exports MOCK_MODE, auth, db — with no VITE_FIREBASE_* vars MOCK_MODE is true and auth/db are null; no initializeApp call fires and no error is thrown
- dbService.js exposes the full five-method surface with identical async signatures in both Firestore and localStorage paths; all localStorage writes are QuotaExceededError-safe
- geminiService.js exports analyzeJournalEntry and sendCompanionMessage returning deterministic canned data; GEMINI_MOCK_MODE flag mirrors firebase pattern so Phase 4 live wiring is a minimal diff

## Task Commits

Each task was committed atomically:

1. **Task 1: firebase.js mock-mode gate and dbService.js dual-path CRUD** - `d9a8b25` (feat)
2. **Task 2: geminiService.js scaffold with mock methods** - `104a77d` (feat)

## Files Created/Modified

- `src/services/firebase.js` — MOCK_MODE detection, HMR-safe Firebase init or null exports, DEV console.info
- `src/services/dbService.js` — five-method CRUD surface; zenstudy: namespaced localStorage; lsGet/lsSet helpers; Firestore dual-path; merge:true on all updateUser calls
- `src/services/geminiService.js` — GEMINI_MOCK_MODE flag; canned analyzeJournalEntry (sentiment/stressTriggers/copingStrategy/encouragement); canned sendCompanionMessage (plain string, safe concatenation); Phase 4 TODO comment with GoogleGenerativeAI scaffold

## Decisions Made

- MOCK_MODE based on `!apiKey || !projectId` — the two most critical Firebase fields; absence of either means the app cannot connect anyway.
- `saveChatHistory` stores under `users/{uid}.chatHistory` rather than a separate Firestore collection; avoids unnecessary collection proliferation for Phase 1.
- Journal entries capped at 100 in mock mode to bound localStorage usage without an explicit eviction strategy.
- geminiService imports `@google/generative-ai` unconditionally so the tree-shaker includes it; Phase 4 only needs to un-comment the live path — no import change needed.

## Deviations from Plan

None — plan executed exactly as written. All threat mitigations (T-01-04, T-01-06, T-01-07) applied as specified.

## Issues Encountered

None — `npm run build` exited 0 on first attempt with all three service files present.

## User Setup Required

None — no external service configuration required. The service layer runs fully on localStorage with no credentials. To enable live Firebase, set VITE_FIREBASE_* vars in `.env.local` (git-ignored).

## Next Phase Readiness

- Service layer contract is frozen: getUser, updateUser, logJournal, getJournals, saveChatHistory, analyzeJournalEntry, sendCompanionMessage
- Plan 01-03 (Auth components) can import firebase.js + dbService.js immediately
- Plan 01-05 (App.jsx state machine) can wire the mock:user session pattern from zenstudy:mock:user
- Phase 4 Gemini wiring requires only: un-commenting the live branch in geminiService.js + supplying VITE_GEMINI_API_KEY

---
*Phase: 01-foundation*
*Completed: 2026-06-13*

# ZenStudy Implementation Plan

This implementation plan details the architectural modules, file locations, parallel track schedules, and specific coding practices aligned with the **PromptWars Mumbai evaluation parameters** (Code Quality, Alignment, Security, Efficiency, Testing, and Accessibility).

---

## 1. Hackathon Parameter Alignment Strategy

To ensure maximum points in evaluation, our code will implement these specific criteria:

*   **Code Quality (High Impact):**
    *   Strict modular separation: Keep presentation (components) separated from logic (services).
    *   Zero inline styles: Use standard HSL utility classes defined centrally in `src/index.css`.
    *   Clean Prop-Types and semantic naming (e.g., `dbService`, `geminiService`).
*   **Problem Statement Alignment (High Impact):**
    *   The GenAI assistant ("Shanti") will consume context summaries (triggers, exam count, streak status) directly from user records to deliver context-aware, empathetic advice.
    *   Targeted vents (Rant, Insecurity, Gossip, Burn) explicitly tackle board/entrance exam stress points.
*   **Security (Medium Impact):**
    *   **No hardcoded keys:** Gemini API keys and Firebase credentials must be configured via the in-app Settings Panel, storing them in local memory or secure environment variables, never committed to git.
    *   **Safe Data Discarding:** Burnt thoughts in the Burn Room are immediately destroyed in memory, never logged to any database.
    *   **XSS Protection:** Use standard React text nodes rather than `dangerouslySetInnerHTML` for chat dialogues.
*   **Efficiency (Medium Impact):**
    *   **No heavy chart packages:** Mood history graph is rendered in **native inline SVG**, consuming nearly zero memory and loading instantly.
    *   **State updates throttling:** Debounce keyboard triggers in Rant room particle animations to avoid UI rendering lag.
*   **Testing (Low Impact):**
    *   Service files will expose mock methods that simulate responses so the app can be fully verified offline.
    *   A manual test matrix is included in the project directory for examiners.
*   **Accessibility (Low Impact):**
    *   Use correct HTML5 semantic tags: `<header>`, `<main>`, `<nav>`, `<aside>`, and `<button>`.
    *   Provide distinct `aria-expanded` and `aria-controls` properties for drawers and dialogs.
    *   Provide keyboard focus states (`:focus-visible`) for navigation items.

---

## 2. Parallel Development Phases & Architecture

We divide the implementation into **6 Phases**. In a team or multi-agent setting, tasks marked with **[PARALLEL TRACK A]** and **[PARALLEL TRACK B]** can be built simultaneously because their interfaces (props and services) are pre-defined.

```
PHASE 1: Project Init & Design System (Tailwind-like HSL setup in index.css)
   │
   ├── [TRACK A] PHASE 2: Services Layer ───────────────┐
   │             (firebase.js, dbService.js, gemini.js) │
   │                                                    ├─> PHASE 4: Core Shell Connect
   └── [TRACK B] PHASE 3: Visual Elements & UI Shell ───┘             (App.jsx, Onboarding, Auth)
   │
   ├── [TRACK A] PHASE 5.1: Vent Rooms & Quests ────────┐
   │             (VentRooms.jsx, PlayfulAssessment.jsx) ├─> PHASE 6: Insights, League & Shanti
   └── [TRACK B] PHASE 5.2: Social & Store ─────────────┘             (Insights, League, ChatCompanion)
   │
PHASE 7: Security, a11y, and Performance Audit
```

---

### Phase 1: Skeleton & CSS Theme
*   **Target Files:**
    *   `package.json`, `index.html`, `vite.config.js`
    *   [index.css](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/index.css)
*   **Actions:**
    *   Initialize Vite + React templates. Install `lucide-react` (icons) and `@google/generative-ai` (Gemini).
    *   Initialize HSL variables for dark glassmorphism.
    *   Add keyframes for expanding breathing circle (`@keyframes breathe`), burning ash particles (`@keyframes incinerate`), and neon matrix characters fall.

---

### Phase 2: Services Layer [PARALLEL TRACK A]
Builds the functional engine without dependency on components.

*   **Target Files:**
    *   [firebase.js](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/services/firebase.js): Detects environment tokens, wraps Firebase auth and Firestore configurations safely.
    *   [dbService.js](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/services/dbService.js): Dual-path logic for `getUser`, `updateUser`, `logJournal`, `getJournals`, and `saveChatHistory`. Maps to Firestore collection documents if active, else defaults to `localStorage`.
    *   [geminiService.js](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/services/geminiService.js): Sets up Gemini Client. Exports `analyzeJournalEntry` and `sendCompanionMessage`, building system instructions from past user data.

---

### Phase 3: Visual Components & Shell [PARALLEL TRACK B]
Builds the static visual layout shell and onboarding flows.

*   **Target Files:**
    *   [Navbar.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/Navbar.jsx): Navigation header showing streak counter, user name, and points indicators.
    *   [Auth.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/Auth.jsx): Login/Signup glassmorphic card interface.
    *   [Onboarding.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/Onboarding.jsx): Multi-slide screen containing exam choices (NEET, JEE, etc.) and starting plant seeds.
    *   [MindGarden.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/MindGarden.jsx): SVG vector tree renderer. Calculates decay states (healthy bloom, drooping, brown withered, fungal spore cover) based on neglected days.

---

### Phase 4: Core Shell Connect
Integrates Phase 2 Services with Phase 3 UI.

*   **Target Files:**
    *   [App.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/App.jsx): Controls routing states: `Auth` $\to$ `Onboarding` $\to$ `Dashboard / Main Tabs`. Renders navbar and chat companion bubble persistently.

---

### Phase 5.1: Themed Vent Rooms & Quests [PARALLEL TRACK A]
*   **Target Files:**
    *   [VentRooms.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/VentRooms.jsx):
        *   *Rant Room*: Code spark elements on keydown, matrix falling animation on release.
        *   *Insecurity Circle*: Celestial star mapping connecting with 10 virtual stars.
        *   *Gossip Corner*: Cafe blackboard rendering magnet polaroids with upvotes.
        *   *Burn Chamber*: Fireplace form dropping card into volcanic fire particles.
    *   [PlayfulAssessment.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/PlayfulAssessment.jsx): Renders visual swipe cards (TAT test) and branching scenarios (CBT dilemmas).

---

### Phase 5.2: Social & Store [PARALLEL TRACK B]
*   **Target Files:**
    *   [ZenLeague.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/ZenLeague.jsx): Renders cohort list. Employs SVG animated cup sliding to peer's row on clicking "Send Chai".
    *   [ZenBazaar.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/ZenBazaar.jsx): Catalog cards displaying redeemable audio, streak freeze token, planners, and garden pots. If focus audio is redeemed, launches an in-app player.

---

### Phase 6: Insights & Chat Companion
*   **Target Files:**
    *   [Insights.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/Insights.jsx): Plots mood timeline as inline `<svg><polyline ... /></svg>` and highlights extracted triggers.
    *   [ChatCompanion.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/ChatCompanion.jsx): Circular floating chat drawer opening Shanti bot with context injection.
    *   [Settings.jsx](file:///Users/aquibvadsaria/project/playground/Mental-Wellness-Tracker/src/components/Settings.jsx): Configuration overrides.

---

### Phase 7: Auditing & Optimization
*   Verify contrast ratios and run simple manual accessibility checks.
*   Ensure console warnings from fallback systems are descriptive.
*   Bundle compilation via `npm run build`.

---

## 3. Verification Plan

### Automated Tests
*   `npm run build`: Checks for bundler and compiler validity.

### Manual Verification Matrix
| Phase | Action | Expected Outcome |
| :--- | :--- | :--- |
| **Auth** | Tap Guest Mode | Instantly generates local profile, bypasses screen to Onboarding. |
| **Onboarding** | Select target exam + Bonsai | Unlocks dashboard, SVG garden displays starting Bonsai sprout. |
| **Vent** | Write insecurity, hit submit | Shows "connected constellation" with counter incremented. |
| **Garden Decay** | Change dates to simulated +3 days | Plant transitions to Stage 4.2 (Wilted, brown edges). |
| **Bazaar** | Redeem Lofi audio | Subtracts ZP, audio player slides up from bottom with player controllers. |
| **Breathing** | Start 1-min Breathing Quest | recommended bubble expands/shrinks sequentially. |
| **Shanti** | Log physics trigger $\to$ open Shanti | AI starts chat referring directly to Physics mock stress. |

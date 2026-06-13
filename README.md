# ZenStudy — Mental Wellness Tracker

A gamified, AI-driven mental wellness web app for Indian competitive-exam aspirants (JEE, NEET, UPSC, GATE, Boards). Built for the **PromptWars Mumbai** hackathon.

ZenStudy replaces clinical questionnaires with playful visual assessments, themed emotional-release rooms, and a stateful AI companion (**Shanti**) that remembers each student's exam context, mood history, and journal highlights to deliver hyper-personalized coaching.

🔗 **Live app:** https://mental-wellness-tracker-wheat.vercel.app/

---

## The Core Idea

A stressed exam aspirant can vent, check in, and feel genuinely understood. Shanti and the themed rooms turn self-care into something engaging enough that students come back daily — gamifying *wellness consistency* rather than academic scores.

## Ideas Adopted

- **Frictionless assessment** — uncover stress and burnout through visual games and scenario questions instead of clinical forms.
- **Themed release rooms** — Rant, Insecurity, Gossip, and Burn rooms make journaling focused and engaging. Burn Room thoughts are destroyed in memory and never persisted.
- **Context-aware AI companion (Shanti)** — Gemini Flash powered; references past journals, mood patterns, and exam countdown for tailored coaching.
- **Healthy gamification** — Zen Points ($ZP$), consistency streaks, and the wellness-focused **Zen League** leaderboard.
- **Mind Garden** — a living plant that grows with consistency and visibly degrades when neglected, making streaks tangible.
- **Zen Bazaar** — redeem earned Zen Points for cosmetic and motivational rewards.
- **Peer comfort** — "you are not alone" social proof and co-presence to counter the isolation of long study hours.

## Design

Visual inspiration drawn from **Duolingo** (playful gamified micro-feedback), **Forest** (calming nature-based progress), and **Linear** (slick dark glassmorphism).

- **Aesthetic:** dark glassmorphic UI with frosted cards, vibrant mood-accent gradients, and tactile game-pad-style buttons.
- **Tokens:** HSL-based theme with violet (reflection), teal (growth/calm), rose (warmth), and orange (high-stress alert) mood accents; Outfit + Inter typefaces.
- **Accessibility:** semantic HTML5, `aria-expanded`/`aria-controls` on drawers and dialogs, and `:focus-visible` states throughout.

See [`DESIGN.md`](./DESIGN.md) for the full design system, schemas, and workflows, and [`REQUIREMENTS.md`](./REQUIREMENTS.md) for product specs.

## Tech Stack

- **Frontend:** React + Vite
- **Icons:** `lucide-react`
- **AI:** `@google/generative-ai` (Gemini Flash)
- **Backend:** Cloud Firestore

> Credentials (Gemini / Firebase) are configured via in-app Settings — never hardcoded or committed.

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints, and add your Gemini/Firebase keys in **Settings**.

<!-- GSD:project-start source:PROJECT.md -->

## Project

**ZenStudy — Mental Wellness Tracker**

ZenStudy is a gamified, AI-driven mental wellness web app for Indian competitive-exam aspirants (JEE, NEET, UPSC, GATE, Boards). It replaces clinical questionnaires with playful visual assessments, themed emotional-release rooms, and a stateful AI companion ("Shanti") that remembers each student's exam context, mood history, and journal highlights to deliver hyper-personalized coaching. Built for the PromptWars Mumbai hackathon.

**Core Value:** A stressed exam aspirant can vent, check in, and feel genuinely understood — Shanti and the themed rooms turn self-care into something engaging enough that students come back daily. If everything else fails, the journal-to-AI-companion loop (vent → context-aware empathetic response) must work.

### Constraints

- **Tech stack**: React + Vite, `lucide-react`, `@google/generative-ai` — matches existing implementation plan; no framework churn.
- **AI provider**: Gemini Flash for Shanti — confirmed; hackathon problem-statement alignment expects it.
- **Timeline**: Hard hackathon deadline — prioritize a shippable, demoable build over completeness.
- **Security**: No hardcoded keys — Gemini/Firebase credentials configured via in-app Settings, never committed. Burn Room thoughts destroyed in memory, never persisted. No `dangerouslySetInnerHTML` for AI/chat content (XSS).
- **Efficiency**: Native inline SVG for charts/garden; debounce keyboard-driven particle animations.
- **Accessibility**: Semantic HTML5, `aria-expanded`/`aria-controls` on drawers/dialogs, `:focus-visible` states.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->

## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

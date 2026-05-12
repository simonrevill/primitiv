---
name: model-routing
description: Which Claude model to use for which kind of work in this repo — Opus for design/architecture, Sonnet for implementation/TDD, Haiku for lookups/syntax. Includes decision tree, token cost ranges, and the canonical three-phase workflow. TRIGGER when the user asks "which model should I use?", "is this an Opus or Sonnet task?", "should I escalate?", or when planning a session and wanting to pick a model deliberately. SKIP for routine tool calls during implementation.
---

# Model routing

## Quick decision tree

- "What should we do?" → **Opus** (design, trade-offs, architecture)
- "How do we implement this?" → **Sonnet** (implementation, TDD,
  refactoring)
- "What's the syntax?" → **Haiku** (lookups, clarifications,
  boilerplate)

## Task-type routing

### Opus 4.7 — design & architecture

- Exploring multiple approaches to a new system
- Comparing trade-offs (performance vs maintainability, type safety
  vs flexibility)
- Long-horizon refactoring strategy or system restructuring
- Complex TDD decisions ("what should we test?", not "how?")
- Typical cost: ~8–15k tokens (high reasoning, infrequent)

### Sonnet 4.6 — implementation & features

- Writing code once the design is clear
- TDD cycles (test → red → green → refactor)
- Feature implementation following an established pattern
- Code review and refactoring within a known approach
- Typical cost: ~5–12k tokens per iteration (faster, frequent)

### Haiku 4.5 — quick fixes & syntax

- Syntax questions in any language
- Quick clarifications or API lookups
- High-volume boilerplate tasks
- Typical cost: ~500–2k tokens (lightweight, as-needed)

## Canonical workflow for features

1. **Phase 1 — Exploration (Opus).** Discuss problem space, explore
   2–3 approaches, settle on design. ~8–15k tokens.
2. **Phase 2 — Implementation (Sonnet).** TDD cycle: write test →
   implement → refactor. Multiple iterations as needed. ~5–12k
   tokens per iteration.
3. **Phase 3 — Refinement (Sonnet).** Continue implementation or
   move to related features. Escalate to Opus only if you hit a
   structural issue.

## Token efficiency tips

- **Batch design sessions.** One comprehensive Opus session beats
  multiple back-and-forth clarifications. Saves 30–40%.
- **Separate design from implementation.** Opus for design → Sonnet
  for code. Two conversations beats one mixed conversation. Saves
  ~12–15k tokens per feature.
- **Retry before escalating.** When Sonnet feels incomplete, retry
  with a clearer prompt first. Only escalate if retry fails.
- **Use Sonnet for TDD cycles.** Lower latency means faster
  iteration and more tests per token. Saves 20–30% vs Opus for test
  writing.

When in doubt, default to **Sonnet** — it handles most tasks well
and iterates quickly. Reserve Opus for genuinely architectural
decisions.

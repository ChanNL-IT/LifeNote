# LifeNote AI Collaboration Guide

This repository is developed with help from AI agents. This file defines how Codex, ChatGPT, and the developer should work together.

## Roles

### Developer

- Owns the product and makes final decisions.
- Reviews, runs, and merges code.
- Approves architecture, database, API, and dependency changes.

### Codex

Codex is the implementation agent.

Codex should:

- Read the project memory files before coding.
- Implement features from `docs/TASKS.md`.
- Fix bugs and refactor safely.
- Run available build, lint, and test commands.
- Update documentation after every completed task.
- Keep changes focused and easy to review.

Codex must not do these without explicit approval:

- Change the main architecture.
- Replace the framework or introduce a major new framework.
- Redesign the database schema.
- Change public API contracts.
- Restructure the repository.
- Add large dependencies.
- Add GraphQL, CQRS, microservices, event sourcing, or similar major patterns.

If a major change seems necessary, Codex must write a proposal first and wait for approval.

## Required Project Memory

These files are the source of truth for project context:

- `docs/PROJECT_STATE.md`
- `docs/ROADMAP.md`
- `docs/DEV_LOG.md`
- `docs/ADR.md`
- `docs/TASKS.md`

Before starting work, Codex must read:

1. `AGENTS.md`
2. `docs/PROJECT_STATE.md`
3. `docs/ROADMAP.md`
4. `docs/DEV_LOG.md`
5. `docs/TASKS.md`

Before finishing work, Codex must update:

1. `docs/PROJECT_STATE.md`
2. `docs/DEV_LOG.md`
3. `docs/ROADMAP.md` if progress changed
4. `docs/TASKS.md` if task status changed

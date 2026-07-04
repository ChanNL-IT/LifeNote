# LifeNote Architecture Decision Records

This file records decisions that affect architecture, data model, API contracts, infrastructure, or long-term maintenance.

## ADR-001: Use Repository-Based Project Memory

Date: 2026-07-05

### Status

Accepted

### Context

The project will use multiple AI assistants and may continue for a long time. Chat history alone is not reliable enough as project memory.

### Decision

Store shared project memory in repository files:

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/ROADMAP.md`
- `docs/DEV_LOG.md`
- `docs/ADR.md`
- `docs/TASKS.md`

### Consequences

- Codex can read project rules before coding.
- ChatGPT can review project state without guessing.
- The developer has a stable source of truth inside Git.
- Every completed task must update the relevant docs.

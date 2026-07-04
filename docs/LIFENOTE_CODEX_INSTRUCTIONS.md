# LifeNote Codex Instructions

Use this file as the working rulebook for Codex when developing LifeNote.

This document is intentionally self-contained. If the repository does not yet have the files listed below, Codex should create them from the sections in this file:

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/ROADMAP.md`
- `docs/DEV_LOG.md`
- `docs/ADR.md`
- `docs/TASKS.md`

## 1. Project Goal

LifeNote is a long-term personal productivity and note-taking application.

Target direction:

- Web, Android, and iOS support.
- Flutter client.
- NestJS backend.
- PostgreSQL database.
- Prisma ORM.
- Docker local development.
- Offline-first behavior.
- Multi-device sync.
- Clean architecture.
- Automated tests.
- CI/CD.

Always prioritize maintainability and code quality over short-term implementation speed.

## 2. Roles

### Developer

- Owns the product and makes final decisions.
- Reviews, runs, and merges code.
- Approves architecture, database, API, and dependency changes.

### Codex

Codex is the implementation agent.

Codex should:

- Read this file before coding.
- Implement tasks from the task list.
- Fix bugs and refactor safely.
- Run available build, lint, and test commands.
- Update project documentation after every completed task.
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

### ChatGPT

ChatGPT acts as architect and reviewer.

ChatGPT should:

- Review architecture, API design, database design, and risks.
- Review pull requests, diffs, and development logs.
- Help plan the roadmap and next tasks.
- Keep the project maintainable over the long term.

## 3. Required Workflow

Every task should follow this workflow:

1. Read this instruction file.
2. Check current branch.
3. Read existing project docs if available.
4. Create or switch to the correct feature branch.
5. Implement the task.
6. Run build, lint, and tests if available.
7. Fix errors.
8. Update project documentation.
9. Commit using Conventional Commits.
10. Push branch.

## 4. Branch Strategy

- `main`: stable release branch.
- `develop`: integration branch.
- `feature/*`: feature branches.
- `fix/*`: bug fix branches.
- `chore/*`: maintenance branches.

Do not commit directly to `main`.

Preferred workflow:

```bash
git checkout develop
git pull
git checkout -b feature/name-of-feature
```

After finishing:

```bash
git add .
git commit -m "feat(scope): short description"
git push -u origin feature/name-of-feature
```

## 5. Definition Of Done

A task is complete only when:

- The requested behavior is implemented.
- Build succeeds, if a build command exists.
- Tests pass, if tests exist.
- Lint passes, if lint exists.
- Relevant APIs or screens are manually checked where possible.
- Project state is updated.
- Development log is updated.
- Task status is updated.
- Commit message follows Conventional Commits.

## 6. Commit Convention

Use Conventional Commits:

```text
feat(auth): implement jwt login
feat(notes): add note CRUD
fix(sync): handle conflict resolution
docs: update project state
refactor(notes): simplify service layer
test(auth): add login tests
chore: update dependencies
```

Allowed prefixes:

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`
- `style`
- `perf`
- `build`
- `ci`

## 7. Proposal Rule

For large changes, write a proposal instead of editing code immediately.

Use this format:

```md
## Problem

## Proposed Solution

## Alternatives

## Pros

## Cons

## Impact

## Migration Plan
```

Wait for developer approval before implementation.

## 8. Engineering Principles

- Prefer simple, maintainable code.
- Follow existing project patterns.
- Keep features small and reviewable.
- Avoid premature abstraction.
- Document decisions that affect future development.
- Use structured APIs and framework conventions instead of ad hoc logic.
- Do not rewrite unrelated code.
- Do not remove user changes unless explicitly instructed.
- Prioritize long-term maintainability over short-term speed.

## 9. Files Codex Should Create In The Repo

Codex should create the following files if they do not exist.

### 9.1 `AGENTS.md`

```md
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
```

### 9.2 `docs/PROJECT_STATE.md`

```md
# LifeNote Project State

Last updated: YYYY-MM-DD

## Current Branch

Unknown

## Current Version

v0.1.0-planning

## Current Phase

Repository setup and AI collaboration setup.

## Current Feature

Project documentation and AI workflow.

## Backend Status

Not verified yet.

## Flutter Status

Not verified yet.

## Database Status

Not verified yet.

## Current Goal

Create a shared project memory system so Developer, Codex, and ChatGPT can follow the same context.

## Last Completed

- Added AI collaboration instructions.

## Current Task

Verify repository structure.

## Next Task

Start the first implementation task from `docs/TASKS.md`.

## Known Issues

- None documented yet.
```

### 9.3 `docs/ROADMAP.md`

```md
# LifeNote Roadmap

## Phase 0: Project Setup

- [ ] Define AI collaboration workflow.
- [ ] Add `AGENTS.md`.
- [ ] Add project memory files.
- [ ] Verify Git repository structure.
- [ ] Confirm branch strategy: `main`, `develop`, `feature/*`.
- [ ] Confirm local development commands.

## Phase 1: Backend Foundation

- [ ] Create or verify NestJS backend.
- [ ] Configure PostgreSQL.
- [ ] Configure Prisma.
- [ ] Add Docker local development.
- [ ] Add environment variable documentation.
- [ ] Add Swagger/OpenAPI.

## Phase 2: Authentication

- [ ] User registration.
- [ ] Login.
- [ ] JWT access token.
- [ ] Refresh token.
- [ ] Logout.
- [ ] Auth guards.
- [ ] Basic auth tests.

## Phase 3: Notes Core

- [ ] Create note.
- [ ] Read notes.
- [ ] Update note.
- [ ] Delete note.
- [ ] Tags.
- [ ] Search.

## Phase 4: Flutter App

- [ ] Create or verify Flutter app.
- [ ] App navigation.
- [ ] Auth screens.
- [ ] Notes list.
- [ ] Note editor.
- [ ] API integration.

## Phase 5: Offline And Sync

- [ ] Local storage.
- [ ] Offline note editing.
- [ ] Sync queue.
- [ ] Conflict detection.
- [ ] Conflict resolution.

## Phase 6: Production Readiness

- [ ] Automated tests.
- [ ] CI pipeline.
- [ ] Deployment plan.
- [ ] Error logging.
- [ ] Security review.
```

### 9.4 `docs/DEV_LOG.md`

```md
# LifeNote Development Log

## YYYY-MM-DD

### Feature

Initial setup.

### Summary

Added initial project memory files so Codex, ChatGPT, and the developer can share project context.

### Files Changed

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/ROADMAP.md`
- `docs/DEV_LOG.md`
- `docs/ADR.md`
- `docs/TASKS.md`

### Commands Executed

- Add commands here.

### Verification

- Add verification result here.

### Notes

- Add notes here.
```

### 9.5 `docs/ADR.md`

```md
# LifeNote Architecture Decision Records

This file records decisions that affect architecture, data model, API contracts, infrastructure, or long-term maintenance.

## ADR-001: Use Repository-Based Project Memory

Date: YYYY-MM-DD

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
```

### 9.6 `docs/TASKS.md`

```md
# LifeNote Tasks

## Doing

- Set up AI collaboration files.

## Todo

- Verify current Git branch.
- Create or switch to `develop`.
- Confirm backend app structure.
- Confirm Flutter app structure.
- Document available commands for build, lint, test, and run.

## Done

- Created initial AI collaboration instructions.
```

## 10. First Task For Codex

When the developer gives this file to Codex, Codex should do this first:

1. Inspect the repository structure.
2. Create `AGENTS.md`.
3. Create the `docs/` files listed above.
4. Update dates to the current date.
5. Check current Git branch.
6. If needed, ask whether to create or switch to `develop`.
7. Commit with:

```bash
git add AGENTS.md docs
git commit -m "docs: add AI collaboration workflow"
```

If remote is configured, push the current branch.

## 11. How ChatGPT Should Review Later

When the developer asks ChatGPT to review progress, read in this order:

1. `AGENTS.md`
2. `docs/PROJECT_STATE.md`
3. `docs/DEV_LOG.md`
4. `docs/ROADMAP.md`
5. Git diff or pull request

Then review:

- Architecture.
- Correctness.
- Maintainability.
- Security.
- Performance.
- Missing tests.
- Next recommended task.

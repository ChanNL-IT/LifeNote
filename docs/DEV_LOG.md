# LifeNote Development Log

## 2026-07-05

### Feature

Local development commands and backend test planning.

### Summary

Documented the backend local development command set and created a backend test plan for Auth, Tags, and Notes. Updated project memory to move the next active task toward backend structure review and automated tests.

### Files Changed

- `docs/LOCAL_DEVELOPMENT.md`
- `docs/BACKEND_TEST_PLAN.md`
- `docs/PROJECT_STATE.md`
- `docs/ROADMAP.md`
- `docs/DEV_LOG.md`
- `docs/TASKS.md`

### Commands Executed

- `Get-Content -Raw AGENTS.md`
- `Get-Content -Raw docs\PROJECT_STATE.md`
- `Get-Content -Raw docs\TASKS.md`
- `Get-Content -Raw README.md`
- `Get-Content -Raw apps\api\package.json`
- `Get-Content -Raw docs\RUNNING.md`

### Verification

- Documentation-only change. No build, lint, or test command was required for code verification.
- Commands were checked against `apps/api/package.json`, `docker-compose.yml`, and existing project docs.

### Notes

- The backend test plan recommends starting with service tests, then adding E2E coverage after a test database workflow is approved.
- The current local PostgreSQL port is `5434`, matching `docker-compose.yml` and `apps/api/.env.example`.

## 2026-07-05

### Feature

Backend build, lint, and Notes/Tags verification.

### Summary

Verified the backend after the Notes/Tags MVP changes. Added an ESLint flat config for ESLint 9, removed remaining explicit `any` usage from `notes.service.ts`, ran build/type-check/lint, and manually verified the Notes/Tags API flow against the local NestJS server.

### Files Changed

- `apps/api/eslint.config.cjs`
- `apps/api/src/modules/notes/notes.service.ts`
- `docs/PROJECT_STATE.md`
- `docs/ROADMAP.md`
- `docs/DEV_LOG.md`
- `docs/TASKS.md`

### Commands Executed

- `docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"`
- `npm run build`
- `npm run lint`
- `npx tsc --noEmit -p tsconfig.build.json`
- `npm test -- --runInBand`
- `node dist\main.js`
- `Invoke-WebRequest -Uri http://localhost:3000/docs -UseBasicParsing`

### Verification

- Docker containers `lifenote_postgres` and `lifenote_redis` were running.
- `npm run build` passed.
- `npm run lint` passed.
- `npx tsc --noEmit -p tsconfig.build.json` passed.
- Swagger `/docs` returned `200 OK`.
- Manual API flow passed: register, login, create tag, create note with tag, search notes, filter by tag, patch favorite/title, remove tag, add tag, delete note, restore note.

### Notes

- Jest is configured but still reports `No tests found` because there are no `*.spec.ts` files yet.
- `nest start` attempted to rewrite `dist` and was blocked by sandbox permissions, so API verification used the already-built `node dist\main.js`.
- Manual verification created a temporary local test user `codex-20260705015020@example.com`.

## 2026-07-05

### Feature

AI collaboration workflow and project memory setup.

### Summary

Created standardized project memory files so Codex, ChatGPT, and the developer can share project context from the repository.

### Files Changed

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/ROADMAP.md`
- `docs/DEV_LOG.md`
- `docs/ADR.md`
- `docs/TASKS.md`

### Commands Executed

- `git rev-parse --abbrev-ref HEAD`
- `Get-Content -Raw docs\LIFENOTE_CODEX_INSTRUCTIONS.md`

### Verification

- Confirmed current Git branch is `develop`.
- Created or updated all project memory files requested by `docs/LIFENOTE_CODEX_INSTRUCTIONS.md`.

### Notes

- No architecture, framework, database, API contract, or folder structure changes were made.
- Commit and push are still pending developer confirmation of the remote workflow.

## 2026-07-04

### Feature

Notes and Tags backend MVP behavior.

### Summary

Completed the Notes and Tags backend MVP behavior within the existing NestJS modules. Added Notes query support for pagination, keyword search, tag filtering, favorite filtering, archived filtering, and supported sort modes. Added note-tag management endpoints for adding multiple tags to a note and removing one tag from a note.

### Files Changed

- `apps/api/src/modules/notes/notes.controller.ts`
- `apps/api/src/modules/notes/notes.service.ts`
- `apps/api/src/modules/notes/dto/add-note-tags.dto.ts`
- `apps/api/src/modules/notes/dto/notes-query.dto.ts`
- `apps/api/src/modules/tags/tags.service.ts`

### Commands Executed

- `npx prettier --write src/modules/notes src/modules/tags`
- `npx tsc --noEmit -p tsconfig.build.json`
- `npm test -- --runInBand`
- `npm run build`

### Verification

- TypeScript check passed.
- Jest ran but reported `No tests found` because the project does not have `*.spec.ts` files yet.
- `npm run build` could not complete because the running NestJS dev server was locking files in `apps/api/dist`.

### Notes

- Stop the dev server and rerun `npm run build` before marking the backend task fully done.
- No framework, database, folder structure, or large Prisma schema changes were made.

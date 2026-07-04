# LifeNote Development Log

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

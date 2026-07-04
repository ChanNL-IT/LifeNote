# LifeNote Project State

Last updated: 2026-07-05

## Current Branch

develop

## Current Version

v0.1.0-backend-mvp

## Current Phase

Backend MVP stabilization.

## Current Feature

Backend local command documentation and test planning.

## Backend Status

NestJS backend exists and Swagger responds at `http://localhost:3000/docs`. Auth, Users, Notes, Tags, Devices, and Sync modules exist. Devices and Sync are still placeholder-level. Notes and Tags were improved for MVP behavior. Build, TypeScript check, lint, and manual Notes/Tags API verification passed.

## Flutter Status

Flutter app is not implemented yet. `apps/mobile/README.md` documents the intended setup.

## Database Status

PostgreSQL is configured through Docker Compose and Prisma schema exists. Docker containers `lifenote_postgres` and `lifenote_redis` were verified running locally. Manual Notes/Tags API verification created a temporary Codex test user/note/tag in the local database.

## Current Goal

Create a shared project memory system so Developer, Codex, and ChatGPT can follow the same context.

## Last Completed

- Added standardized AI collaboration and project memory files.
- Added Notes and Tags backend MVP improvements.
- Committed and pushed AI collaboration workflow to `origin/develop`.
- Verified backend build, lint, Swagger, and Notes/Tags API flow.

## Current Task

Document available local development commands and plan backend tests.

## Next Task

Add backend tests for Auth, Notes, and Tags before Flutter app scaffolding.

## Known Issues

- Jest is configured but no `*.spec.ts` tests exist yet.
- Devices and Sync endpoints are placeholders.

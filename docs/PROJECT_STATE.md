# LifeNote Project State

Last updated: 2026-07-05

## Current Branch

develop

## Current Version

v0.1.0-backend-mvp

## Current Phase

Backend MVP stabilization and AI collaboration setup.

## Current Feature

Git workflow preparation for project memory files.

## Backend Status

NestJS backend exists and Swagger has been opened at `http://localhost:3000/docs`. Auth, Users, Notes, Tags, Devices, and Sync modules exist. Devices and Sync are still placeholder-level. Notes and Tags were improved for MVP behavior and TypeScript check passed.

## Flutter Status

Flutter app is not implemented yet. `apps/mobile/README.md` documents the intended setup.

## Database Status

PostgreSQL is configured through Docker Compose and Prisma schema exists. The developer reported Docker is running locally. Current database state still needs manual endpoint verification after restarting the backend.

## Current Goal

Create a shared project memory system so Developer, Codex, and ChatGPT can follow the same context.

## Last Completed

- Added standardized AI collaboration and project memory files.
- Added Notes and Tags backend MVP improvements.

## Current Task

Prepare commit and push workflow for the project memory files.

## Next Task

Commit the documentation changes, push the `develop` branch, then restart backend, run build, and manually verify Notes/Tags endpoints through Swagger.

## Known Issues

- `npm run build` was blocked while the NestJS dev server was locking files in `apps/api/dist`.
- Jest is configured but no `*.spec.ts` tests exist yet.
- Devices and Sync endpoints are placeholders.

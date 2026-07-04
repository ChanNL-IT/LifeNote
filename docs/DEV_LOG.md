# 2026-07-04

## Feature
- Completed the Notes and Tags backend MVP behavior within the existing NestJS modules.
- Added Notes query support for pagination, keyword search, tag filtering, favorite filtering, archived filtering, and supported sort modes.
- Added note-tag management endpoints for adding multiple tags to a note and removing one tag from a note.
- Improved ownership checks so notes can only be linked to tags that belong to the authenticated user.
- Updated tags listing to include `notesCount`.
- Added duplicate slug checking when updating tag names.

## Files Changed
- `apps/api/src/modules/notes/notes.controller.ts`
- `apps/api/src/modules/notes/notes.service.ts`
- `apps/api/src/modules/notes/dto/add-note-tags.dto.ts`
- `apps/api/src/modules/notes/dto/notes-query.dto.ts`
- `apps/api/src/modules/tags/tags.service.ts`

## Commands
- `npx prettier --write src/modules/notes src/modules/tags`
- `npx tsc --noEmit -p tsconfig.build.json`
- `npm test -- --runInBand`
- `npm run build`

## Notes
- TypeScript check passed.
- Jest ran successfully but reported `No tests found` because the project does not have `*.spec.ts` files yet.
- `npm run build` could not complete because the running NestJS dev server was locking files in `apps/api/dist`. Stop the dev server and run the build again before marking the task fully done.
- No framework, database, folder structure, or large Prisma schema changes were made.

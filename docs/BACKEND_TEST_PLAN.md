# LifeNote Backend Test Plan

Last updated: 2026-07-05

## Goal

Add automated backend tests before starting Flutter implementation, so Auth, Notes, and Tags behavior can be changed safely.

## Current Test Status

- Jest is configured in `apps/api/package.json`.
- `supertest` and `@nestjs/testing` are installed.
- No `*.spec.ts` files exist yet.
- `npm test -- --runInBand` currently reports `No tests found`.

## Test Command

```bash
cd apps/api
npm test -- --runInBand
```

## Recommended Test Order

1. Auth tests.
2. Tags tests.
3. Notes tests.
4. Cross-module ownership and authorization tests.

## Auth Tests

Minimum coverage:

- Register creates a user.
- Register rejects duplicate email.
- Register never returns `passwordHash`.
- Login returns user, access token, and refresh token.
- Login rejects wrong password.
- `GET /me` succeeds with a valid access token.
- `GET /me` rejects missing or invalid token.
- Refresh token returns a new token pair.
- Logout returns success for a valid refresh token.

## Tags Tests

Minimum coverage:

- Create tag.
- Reject duplicate tag slug for the same user.
- Allow same tag name for different users.
- List tags for current user only.
- Update tag name and regenerate slug.
- Reject update to duplicate slug.
- Soft delete tag.
- Deleted tags do not appear in list.
- `notesCount` counts active notes only.

## Notes Tests

Minimum coverage:

- Create note.
- Create note with valid `tagIds`.
- Reject note creation with another user's tag.
- List notes with pagination.
- Search notes by title/content.
- Filter notes by `tagId`.
- Filter notes by `favorite`.
- Filter notes by `archived`.
- Sort notes by `updatedAt_desc`, `createdAt_desc`, and `title_asc`.
- Get note detail.
- Update note.
- Soft delete note.
- Restore note.
- Add tags to note.
- Adding the same tag twice is idempotent.
- Remove tag from note.
- Reject access to another user's note.

## Suggested Test Structure

Keep tests close to feature modules:

```text
apps/api/src/modules/auth/auth.service.spec.ts
apps/api/src/modules/tags/tags.service.spec.ts
apps/api/src/modules/notes/notes.service.spec.ts
```

For later end-to-end coverage, add:

```text
apps/api/test/auth.e2e-spec.ts
apps/api/test/notes-tags.e2e-spec.ts
```

## Test Data Rules

- Use unique emails per test.
- Do not depend on local manual data.
- Clean up created records when possible.
- Keep ownership tests explicit with at least two users.

## Open Decision

The project still needs to choose the first automated test style:

- Service tests with mocked Prisma.
- Integration tests against a test database.
- E2E tests against a temporary test database.

Recommendation: start with service tests for Auth/Tags/Notes, then add E2E coverage after the test database workflow is agreed.

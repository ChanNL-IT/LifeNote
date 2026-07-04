# LifeNote Local Development Commands

Last updated: 2026-07-05

## Requirements

- Node.js 20+
- npm 10+
- Docker Desktop
- Git

## Services

Start PostgreSQL and Redis from the repository root:

```bash
docker compose up -d
```

Check containers:

```bash
docker ps
```

Expected containers:

- `lifenote_postgres`
- `lifenote_redis`

Current local ports:

- PostgreSQL: `localhost:5434`
- Redis: `localhost:6379`

Stop services:

```bash
docker compose down
```

Remove local database volume:

```bash
docker compose down -v
```

## Backend Setup

From the backend folder:

```bash
cd apps/api
npm install
```

Create `.env` if it does not exist:

```powershell
Copy-Item .env.example .env
```

Current expected database URL:

```env
DATABASE_URL="postgresql://lifenote:lifenote_password@localhost:5434/lifenote_db?schema=public"
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Run migrations:

```bash
npm run prisma:migrate
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Backend Run

Development server:

```bash
npm run start:dev
```

Production-style local run after build:

```bash
npm run build
node dist/main.js
```

Swagger:

```text
http://localhost:3000/docs
```

API base URL:

```text
http://localhost:3000/api/v1
```

## Backend Quality Commands

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

TypeScript check without writing `dist`:

```bash
npx tsc --noEmit -p tsconfig.build.json
```

Run tests:

```bash
npm test -- --runInBand
```

Current test status:

- Jest is configured.
- No `*.spec.ts` files exist yet, so Jest currently reports `No tests found`.

## Manual Backend Verification

Recommended Swagger flow:

1. `POST /api/v1/auth/register`
2. `POST /api/v1/auth/login`
3. Use Swagger Authorize with `Bearer <accessToken>`
4. `GET /api/v1/me`
5. `POST /api/v1/tags`
6. `GET /api/v1/tags`
7. `POST /api/v1/notes` with `tagIds`
8. `GET /api/v1/notes?q=...`
9. `GET /api/v1/notes?tagId=...`
10. `PATCH /api/v1/notes/:id`
11. `DELETE /api/v1/notes/:id/tags/:tagId`
12. `POST /api/v1/notes/:id/tags`
13. `DELETE /api/v1/notes/:id`
14. `POST /api/v1/notes/:id/restore`

## Git Workflow

Work from `develop` and create feature branches for implementation work:

```bash
git checkout develop
git pull
git checkout -b feature/name-of-feature
```

Use Conventional Commits:

```bash
git commit -m "feat(scope): short description"
```

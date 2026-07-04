# Running LifeNote Backend

1. `docker compose up -d`
2. `cd apps/api`
3. `npm install`
4. `cp .env.example .env`
5. `npm run prisma:generate`
6. `npx prisma migrate dev --name init`
7. `npm run start:dev`
8. Open `http://localhost:3000/docs`

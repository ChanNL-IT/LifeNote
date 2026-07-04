# LifeNote Full Project - Fixed

Backend NestJS chạy được cho LifeNote MVP.

## Yêu cầu

- Node.js 20+
- npm 10+
- Docker Desktop

## Cách chạy

### 1. Giải nén

Nếu sau khi giải nén bị lồng folder, hãy `cd` vào folder có file `docker-compose.yml`.

```bash
cd lifenote_full_project_fixed
```

### 2. Chạy database

```bash
docker compose up -d
```

Kiểm tra:

```bash
docker ps
```

Phải thấy container `lifenote_postgres`.

### 3. Chạy backend

```bash
cd apps/api
npm install
```

Tạo file env:

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux/Git Bash:

```bash
cp .env.example .env
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Tạo bảng database:

```bash
npx prisma migrate dev --name init
```

Chạy server:

```bash
npm run start:dev
```

Mở Swagger:

```text
http://localhost:3000/docs
```

API base URL:

```text
http://localhost:3000/api/v1
```

## Test nhanh bằng curl

Register:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","displayName":"Test User"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Nếu lỗi port PostgreSQL

Nếu máy đã có PostgreSQL chạy ở port 5432, đổi port trong `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"
```

Rồi đổi `DATABASE_URL` trong `apps/api/.env`:

```env
DATABASE_URL="postgresql://lifenote:lifenote_password@localhost:5433/lifenote_db?schema=public"
```

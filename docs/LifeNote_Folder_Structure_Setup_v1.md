# LifeNote - Folder Structure & Development Setup v1

## 1. Mục tiêu

Tài liệu này định nghĩa cấu trúc source code, quy ước tổ chức thư mục và cách chạy dự án LifeNote trên máy local.

Dự án cần đảm bảo:

- Dễ chạy trên máy mới
- Dễ mở rộng module
- Backend và Flutter app nằm chung monorepo
- Có Docker cho database
- Có tài liệu `.env`
- Có thứ tự setup rõ ràng

---

# 2. Cấu trúc Monorepo đề xuất

```text
lifenote/
├── apps/
│   ├── api/
│   └── mobile/
│
├── docs/
│   ├── LifeNote_PRD_v1.md
│   ├── LifeNote_Database_Design_v1.md
│   ├── LifeNote_API_Design_v1.md
│   ├── LifeNote_System_Architecture_v1.md
│   └── LifeNote_Folder_Structure_Setup_v1.md
│
├── docker/
│   └── postgres/
│
├── scripts/
│   ├── setup.sh
│   └── reset-db.sh
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── README.md
├── .gitignore
└── .editorconfig
```

---

# 3. Vì sao dùng Monorepo?

Monorepo giúp gom toàn bộ dự án vào một repo duy nhất:

```text
Backend
Frontend
Docs
Docker
Scripts
CI/CD
```

Lợi ích:

- Dễ clone và chạy
- Dễ quản lý version
- Dễ viết tài liệu chung
- Dễ deploy từng phần
- Phù hợp project cá nhân dài hạn

---

# 4. Yêu cầu môi trường

## 4.1 Công cụ cần cài

```text
Node.js >= 20
pnpm >= 9
Docker Desktop
Flutter SDK >= 3.x
Git
VS Code hoặc WebStorm
Postman / Insomnia
```

## 4.2 Kiểm tra version

```bash
node -v
pnpm -v
docker -v
flutter --version
git --version
```

Nếu tất cả lệnh đều chạy được thì môi trường đã sẵn sàng.

---

# 5. Docker Compose

File `docker-compose.yml` đặt ở root project.

```yaml
services:
  postgres:
    image: postgres:16
    container_name: lifenote_postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: lifenote
      POSTGRES_PASSWORD: lifenote_password
      POSTGRES_DB: lifenote_db
    volumes:
      - lifenote_postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: lifenote_redis
    restart: always
    ports:
      - "6379:6379"

volumes:
  lifenote_postgres_data:
```

## Chạy database

```bash
docker compose up -d
```

## Dừng database

```bash
docker compose down
```

## Xóa database local hoàn toàn

```bash
docker compose down -v
```

---

# 6. Backend Structure - NestJS

Thư mục backend:

```text
apps/api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── utils/
│   │
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── strategies/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   │
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   │
│   │   ├── notes/
│   │   │   ├── dto/
│   │   │   ├── notes.controller.ts
│   │   │   ├── notes.module.ts
│   │   │   └── notes.service.ts
│   │   │
│   │   ├── tags/
│   │   │   ├── dto/
│   │   │   ├── tags.controller.ts
│   │   │   ├── tags.module.ts
│   │   │   └── tags.service.ts
│   │   │
│   │   ├── devices/
│   │   └── sync/
│   │
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts
│
├── test/
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

# 7. Backend `.env.example`

Tạo file:

```text
apps/api/.env.example
```

Nội dung:

```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

DATABASE_URL="postgresql://lifenote:lifenote_password@localhost:5432/lifenote_db?schema=public"

JWT_ACCESS_SECRET="change_me_access_secret"
JWT_REFRESH_SECRET="change_me_refresh_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="30d"

GOOGLE_CLIENT_ID=""
```

Sau đó copy thành `.env`:

```bash
cp apps/api/.env.example apps/api/.env
```

---

# 8. Backend package scripts

Trong `apps/api/package.json` nên có:

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build",
    "lint": "eslint .",
    "test": "jest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:reset": "prisma migrate reset"
  }
}
```

---

# 9. Cách chạy Backend local

## Bước 1: Clone project

```bash
git clone <repo-url>
cd lifenote
```

## Bước 2: Chạy PostgreSQL và Redis

```bash
docker compose up -d
```

## Bước 3: Cài dependencies backend

```bash
cd apps/api
pnpm install
```

## Bước 4: Tạo file env

```bash
cp .env.example .env
```

## Bước 5: Generate Prisma Client

```bash
pnpm prisma:generate
```

## Bước 6: Chạy migration

```bash
pnpm prisma:migrate
```

## Bước 7: Chạy server

```bash
pnpm start:dev
```

Backend sẽ chạy tại:

```text
http://localhost:3000/api/v1
```

Swagger nên chạy tại:

```text
http://localhost:3000/docs
```

---

# 10. Flutter Structure

Thư mục Flutter:

```text
apps/mobile/
├── lib/
│   ├── main.dart
│   │
│   ├── app/
│   │   ├── app.dart
│   │   ├── router.dart
│   │   └── theme.dart
│   │
│   ├── core/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── database/
│   │   ├── errors/
│   │   ├── network/
│   │   ├── storage/
│   │   └── utils/
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   ├── models/
│   │   │   │   └── repositories/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   └── usecases/
│   │   │   └── presentation/
│   │   │       ├── pages/
│   │   │       ├── providers/
│   │   │       └── widgets/
│   │   │
│   │   ├── notes/
│   │   ├── tags/
│   │   ├── search/
│   │   └── sync/
│   │
│   └── shared/
│       ├── widgets/
│       ├── models/
│       └── extensions/
│
├── test/
├── pubspec.yaml
└── README.md
```

---

# 11. Flutter `.env`

Có thể dùng `flutter_dotenv`.

Tạo file:

```text
apps/mobile/.env
```

Nội dung:

```env
API_BASE_URL=http://localhost:3000/api/v1
```

Lưu ý khi chạy Android Emulator:

```env
API_BASE_URL=http://10.0.2.2:3000/api/v1
```

Lưu ý khi chạy iOS Simulator:

```env
API_BASE_URL=http://localhost:3000/api/v1
```

Lưu ý khi chạy điện thoại thật:

```env
API_BASE_URL=http://<LAN_IP_CUA_MAY_TINH>:3000/api/v1
```

Ví dụ:

```env
API_BASE_URL=http://192.168.1.10:3000/api/v1
```

---

# 12. Cách chạy Flutter app

## Bước 1: Cài dependencies

```bash
cd apps/mobile
flutter pub get
```

## Bước 2: Kiểm tra thiết bị

```bash
flutter devices
```

## Bước 3: Chạy Web

```bash
flutter run -d chrome
```

## Bước 4: Chạy Android

```bash
flutter run -d <android-device-id>
```

## Bước 5: Chạy iOS

```bash
flutter run -d <ios-device-id>
```

---

# 13. Quy ước API URL theo nền tảng

| Platform | API URL |
|---|---|
| Flutter Web | `http://localhost:3000/api/v1` |
| Android Emulator | `http://10.0.2.2:3000/api/v1` |
| iOS Simulator | `http://localhost:3000/api/v1` |
| Physical Device | `http://<LAN_IP>:3000/api/v1` |

---

# 14. Coding Convention Backend

## 14.1 Naming

| Loại | Quy ước |
|---|---|
| File | kebab-case |
| Class | PascalCase |
| Variable | camelCase |
| DTO | PascalCase + Dto |
| Module | PascalCase + Module |
| Service | PascalCase + Service |
| Controller | PascalCase + Controller |

Ví dụ:

```text
create-note.dto.ts
notes.service.ts
notes.controller.ts
notes.module.ts
```

---

## 14.2 Controller chỉ xử lý HTTP

Controller không viết business logic phức tạp.

```text
Controller
  ↓
Service
  ↓
Prisma
```

---

## 14.3 Service xử lý nghiệp vụ

Service chịu trách nhiệm:

- Validate logic nghiệp vụ
- Gọi Prisma
- Kiểm tra quyền sở hữu dữ liệu
- Throw exception phù hợp

---

## 14.4 DTO bắt buộc validate

Ví dụ:

```ts
export class CreateNoteDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;
}
```

---

## 14.5 Không trả passwordHash

Không bao giờ trả về:

```text
passwordHash
refreshTokenHash
```

---

# 15. Coding Convention Flutter

## 15.1 Feature-first

Không chia kiểu:

```text
pages/
widgets/
models/
services/
```

Nên chia theo feature:

```text
features/
├── auth/
├── notes/
├── tags/
└── sync/
```

---

## 15.2 Layer trong mỗi feature

Mỗi feature có 3 layer:

```text
data/
domain/
presentation/
```

### data

- API call
- Local database
- Model DTO
- Repository implementation

### domain

- Entity
- Abstract repository
- Use case

### presentation

- Page
- Widget
- Riverpod provider

---

## 15.3 State management

Dùng Riverpod.

Quy ước:

```text
notes_provider.dart
auth_provider.dart
tag_provider.dart
```

---

## 15.4 Model generation

Dùng:

```text
freezed
json_serializable
```

Chạy generate:

```bash
dart run build_runner build --delete-conflicting-outputs
```

---

# 16. Git Convention

## 16.1 Branch

```text
main
develop
feature/auth
feature/notes
feature/tags
fix/login-error
```

## 16.2 Commit message

Dùng Conventional Commits:

```text
feat: add note creation API
fix: handle invalid login password
docs: add database design
refactor: clean notes service
chore: update dependencies
```

---

# 17. README.md nên có gì?

File root `README.md` nên có:

```md
# LifeNote

LifeNote is a personal knowledge management app for Web, Android and iOS.

## Tech Stack

- Flutter
- NestJS
- PostgreSQL
- Prisma
- Docker

## Requirements

- Node.js 20+
- pnpm
- Docker
- Flutter SDK

## Quick Start

```bash
docker compose up -d

cd apps/api
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:migrate
pnpm start:dev
```

```bash
cd apps/mobile
flutter pub get
flutter run -d chrome
```
```

---

# 18. Thứ tự tạo project thật

## Bước 1: Tạo root folder

```bash
mkdir lifenote
cd lifenote
git init
```

## Bước 2: Tạo folder

```bash
mkdir apps docs docker scripts
```

## Bước 3: Tạo backend

```bash
cd apps
nest new api
```

Chọn package manager:

```text
pnpm
```

## Bước 4: Tạo Flutter app

```bash
cd apps
flutter create mobile
```

## Bước 5: Tạo Docker Compose ở root

```bash
touch docker-compose.yml
```

## Bước 6: Chạy database

```bash
docker compose up -d
```

## Bước 7: Setup Prisma trong backend

```bash
cd apps/api
pnpm add prisma @prisma/client
pnpm prisma init
```

## Bước 8: Update DATABASE_URL trong `.env`

```env
DATABASE_URL="postgresql://lifenote:lifenote_password@localhost:5432/lifenote_db?schema=public"
```

## Bước 9: Chạy migration đầu tiên

```bash
pnpm prisma migrate dev --name init
```

## Bước 10: Chạy backend

```bash
pnpm start:dev
```

## Bước 11: Chạy Flutter Web

```bash
cd apps/mobile
flutter run -d chrome
```

---

# 19. Lưu ý quan trọng để project chạy được

## 19.1 Backend và database phải cùng thông tin kết nối

Nếu Docker Compose dùng:

```env
POSTGRES_USER=lifenote
POSTGRES_PASSWORD=lifenote_password
POSTGRES_DB=lifenote_db
```

Thì `DATABASE_URL` phải là:

```env
postgresql://lifenote:lifenote_password@localhost:5432/lifenote_db?schema=public
```

---

## 19.2 Android Emulator không gọi được localhost của máy host

Sai:

```env
API_BASE_URL=http://localhost:3000/api/v1
```

Đúng với Android Emulator:

```env
API_BASE_URL=http://10.0.2.2:3000/api/v1
```

---

## 19.3 Điện thoại thật cần cùng Wi-Fi

Nếu chạy trên điện thoại thật, máy tính và điện thoại phải cùng mạng Wi-Fi.

Dùng IP LAN của máy tính:

```bash
ipconfig
```

Hoặc macOS/Linux:

```bash
ifconfig
```

Sau đó set:

```env
API_BASE_URL=http://192.168.x.x:3000/api/v1
```

---

## 19.4 CORS phải bật cho Flutter Web

Trong `main.ts` của NestJS:

```ts
app.enableCors({
  origin: true,
  credentials: true,
});
```

---

## 19.5 NestJS nên dùng global prefix

```ts
app.setGlobalPrefix('api/v1');
```

---

# 20. Checklist chạy project local

## Backend

```text
[ ] Docker đang chạy
[ ] PostgreSQL container đang chạy
[ ] Redis container đang chạy
[ ] apps/api/.env đã tồn tại
[ ] DATABASE_URL đúng
[ ] pnpm install đã chạy
[ ] Prisma generate đã chạy
[ ] Migration đã chạy
[ ] Backend chạy tại localhost:3000
[ ] Swagger mở được tại localhost:3000/docs
```

## Flutter

```text
[ ] Flutter SDK đã cài
[ ] flutter doctor không lỗi nghiêm trọng
[ ] apps/mobile/.env đã đúng
[ ] flutter pub get đã chạy
[ ] Backend đang chạy
[ ] API URL đúng theo platform
[ ] flutter run -d chrome chạy được
```

---

# 21. Kết luận

Cấu trúc tốt nhất cho LifeNote ở giai đoạn đầu:

```text
lifenote/
├── apps/api
├── apps/mobile
├── docs
├── docker-compose.yml
└── README.md
```

Ưu tiên hiện tại không phải thêm nhiều tính năng, mà là làm cho dự án:

- Clone về chạy được
- Backend kết nối database được
- Flutter gọi được API
- Có tài liệu setup rõ ràng
- Có nền tảng để tiếp tục làm Auth, Notes, Tags và Sync

# LifeNote - System Architecture v1

## 1. Mục tiêu

Tài liệu này mô tả kiến trúc tổng thể của LifeNote.

LifeNote là ứng dụng quản lý tri thức cá nhân chạy trên:

- Web
- Android
- iOS

Hệ thống cần hỗ trợ:

- Đăng nhập
- Ghi chú Markdown
- Tag
- Search
- Offline First
- Sync đa thiết bị
- Mở rộng về sau cho AI, file, OCR, journal, bookmark

---

# 2. Kiến trúc tổng quan

```text
┌──────────────────────────────┐
│          Flutter App          │
│  Web / Android / iOS          │
└───────────────┬──────────────┘
                │ HTTPS / REST API
                ▼
┌──────────────────────────────┐
│          NestJS API           │
│ Auth / Notes / Tags / Sync    │
└───────────────┬──────────────┘
                │
      ┌─────────┴─────────┐
      ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ PostgreSQL   │    │ Redis        │
│ Main DB      │    │ Cache/Queue  │
└──────────────┘    └──────────────┘

Giai đoạn sau:

┌──────────────┐
│ Object Store │
│ S3/R2/MinIO  │
└──────────────┘

┌──────────────┐
│ AI Service   │
│ LLM/OCR      │
└──────────────┘
```

---

# 3. Thành phần chính

## 3.1 Flutter App

Flutter App là client chính, dùng chung codebase cho Web, Android và iOS.

### Nhiệm vụ

- Hiển thị UI
- Quản lý state
- Lưu dữ liệu offline
- Gửi request tới backend
- Sync dữ liệu local với server

### Công nghệ đề xuất

```text
Flutter
Riverpod
GoRouter
Drift
Dio
Freezed
Json Serializable
```

### Cấu trúc chính

```text
apps/mobile/lib/
├── app/
├── core/
├── features/
│   ├── auth/
│   ├── notes/
│   ├── tags/
│   ├── search/
│   └── sync/
└── shared/
```

---

## 3.2 NestJS API

Backend xử lý logic nghiệp vụ và giao tiếp với database.

### Nhiệm vụ

- Authentication
- Authorization
- CRUD Notes
- CRUD Tags
- Search
- Sync
- Validate dữ liệu
- Ghi log
- Quản lý session/token

### Công nghệ đề xuất

```text
NestJS
Prisma
PostgreSQL
JWT
Passport
Class Validator
Swagger
```

### Cấu trúc chính

```text
apps/api/src/
├── main.ts
├── app.module.ts
├── common/
├── config/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── notes/
│   ├── tags/
│   ├── devices/
│   └── sync/
└── prisma/
```

---

## 3.3 PostgreSQL

PostgreSQL là database chính.

### Lưu trữ

- Users
- Notes
- Tags
- Devices
- Sync events

### Vì sao dùng PostgreSQL?

- Ổn định
- Mạnh cho dữ liệu quan hệ
- Hỗ trợ JSONB
- Hỗ trợ full-text search
- Dễ mở rộng

---

## 3.4 Redis

Redis chưa bắt buộc trong MVP đầu tiên, nhưng nên để trong kiến trúc.

### Dùng cho

- Cache
- Rate limit
- Refresh token blacklist
- Queue job
- Sync queue
- Background task

Trong MVP có thể chưa dùng Redis ngay.

---

## 3.5 Object Storage

Dùng sau V1 khi có file, ảnh, PDF hoặc attachment.

Có thể chọn:

```text
Cloudflare R2
AWS S3
MinIO
Supabase Storage
```

### Dùng cho

- Ảnh trong note
- PDF
- Attachment
- Avatar
- File export

---

## 3.6 AI Service

Dùng sau V1.

### Có thể hỗ trợ

- Tóm tắt note
- Hỏi đáp trên ghi chú
- OCR ảnh
- Speech to text
- Gợi ý tag
- Liên kết note liên quan

Ban đầu chưa cần tách service riêng. Có thể gọi AI API trực tiếp từ NestJS.

---

# 4. Luồng Authentication

## 4.1 Email Login

```text
User nhập email/password
        ↓
Flutter gọi POST /auth/login
        ↓
NestJS kiểm tra user
        ↓
So sánh password hash
        ↓
Tạo access token + refresh token
        ↓
Flutter lưu token an toàn
        ↓
Các request sau gửi Authorization header
```

## 4.2 Google Login

```text
User bấm Login with Google
        ↓
Flutter lấy Google ID Token
        ↓
Gửi POST /auth/google
        ↓
NestJS verify token với Google
        ↓
Tìm hoặc tạo user
        ↓
Trả access token + refresh token
```

## 4.3 Token

```text
Access Token:
- Sống ngắn
- Dùng để gọi API

Refresh Token:
- Sống dài hơn
- Dùng để lấy access token mới
```

---

# 5. Luồng CRUD Note

## 5.1 Tạo note khi online

```text
User tạo note
        ↓
Flutter lưu local database
        ↓
Flutter gọi POST /notes
        ↓
NestJS validate dữ liệu
        ↓
Prisma lưu PostgreSQL
        ↓
Server trả note mới
        ↓
Flutter cập nhật local database
```

## 5.2 Tạo note khi offline

```text
User tạo note
        ↓
Flutter lưu vào local database
        ↓
Đánh dấu pendingSync = true
        ↓
Khi có mạng
        ↓
SyncService push thay đổi lên server
        ↓
Server lưu vào PostgreSQL
        ↓
Flutter cập nhật trạng thái synced
```

---

# 6. Luồng Search

## 6.1 Local Search

Khi offline hoặc dữ liệu nhỏ:

```text
User search keyword
        ↓
Flutter query local database
        ↓
Hiển thị kết quả ngay
```

## 6.2 Server Search

Khi online:

```text
User search keyword
        ↓
Flutter gọi GET /notes?q=keyword
        ↓
NestJS query PostgreSQL full-text search
        ↓
Trả danh sách note
```

## 6.3 AI Search trong tương lai

```text
User hỏi tự nhiên
        ↓
NestJS lấy dữ liệu liên quan
        ↓
Gửi context tới AI service
        ↓
AI trả câu trả lời
```

---

# 7. Offline First Architecture

Offline First nghĩa là app vẫn hoạt động tốt khi không có mạng.

## Nguyên tắc

- Local database là nguồn dữ liệu chính của UI
- UI đọc dữ liệu từ local database
- API chỉ dùng để sync
- Mọi thay đổi local được ghi vào sync queue
- Khi online thì push lên server

## Mô hình

```text
UI
 ↓
Local Repository
 ↓
Local Database
 ↓
Sync Queue
 ↓
Remote API
 ↓
PostgreSQL
```

---

# 8. Sync Architecture

## 8.1 Thành phần

### Local Database

Lưu notes, tags, trạng thái sync.

### Sync Queue

Lưu thay đổi chưa gửi lên server.

### Sync Service

Chạy khi:

- App mở
- Có mạng trở lại
- Sau một khoảng thời gian
- User bấm sync thủ công

### Server Sync API

- `GET /sync/pull`
- `POST /sync/push`

---

## 8.2 Push Flow

```text
Flutter lấy các thay đổi pending
        ↓
POST /sync/push
        ↓
Server kiểm tra conflict
        ↓
Server lưu thay đổi hợp lệ
        ↓
Server ghi sync_events
        ↓
Flutter đánh dấu thay đổi đã sync
```

---

## 8.3 Pull Flow

```text
Flutter gửi lastSyncedAt
        ↓
GET /sync/pull?since=...
        ↓
Server lấy sync_events mới hơn since
        ↓
Trả danh sách changes
        ↓
Flutter apply vào local database
        ↓
Cập nhật lastSyncedAt
```

---

## 8.4 Conflict Strategy MVP

MVP dùng chiến lược đơn giản:

```text
Last Write Wins
```

Tức là bản nào có `updatedAt` mới hơn thì thắng.

Sau này có thể nâng cấp:

```text
Manual conflict resolution
Version number
Event sourcing
CRDT
```

---

# 9. Security Architecture

## 9.1 Password

Không bao giờ lưu password gốc.

Dùng:

```text
bcrypt hoặc argon2
```

## 9.2 JWT

- Access token sống ngắn
- Refresh token sống dài hơn
- Refresh token nên được hash trước khi lưu DB
- Logout thì revoke refresh token

## 9.3 Authorization

Mọi dữ liệu phải kiểm tra `userId`.

Ví dụ:

```text
User A không được đọc note của User B
```

## 9.4 Input Validation

Dùng DTO + class-validator trong NestJS.

## 9.5 Rate Limit

Dùng cho:

- Login
- Register
- Refresh token
- Search

Có thể dùng Redis sau này.

---

# 10. Deployment Architecture

## 10.1 Development

```text
Developer Machine
├── Flutter App
├── NestJS API
├── PostgreSQL Docker
└── Redis Docker
```

Chạy bằng:

```bash
docker compose up -d
```

---

## 10.2 Production đơn giản

```text
VPS / Cloud Server
├── Nginx
├── NestJS API Docker Container
├── PostgreSQL Managed DB
├── Redis Managed / Docker
└── Object Storage
```

---

## 10.3 Production đề xuất

```text
Frontend Web:
Vercel / Netlify / Cloudflare Pages

Backend:
Railway / Render / Fly.io / VPS

Database:
Supabase / Neon / Railway PostgreSQL

Storage:
Cloudflare R2 / S3

Mobile:
Google Play / App Store
```

---

# 11. CI/CD

## 11.1 Backend Pipeline

```text
Push code
   ↓
Install dependencies
   ↓
Run lint
   ↓
Run unit test
   ↓
Run Prisma migration check
   ↓
Build Docker image
   ↓
Deploy
```

## 11.2 Flutter Pipeline

```text
Push code
   ↓
flutter pub get
   ↓
flutter analyze
   ↓
flutter test
   ↓
Build web/android/ios
```

---

# 12. Module Boundaries

## 12.1 Auth Module

Phụ trách:

- Register
- Login
- Refresh token
- Logout
- Google login

Không xử lý note.

---

## 12.2 Users Module

Phụ trách:

- Profile
- Avatar
- User settings

Không xử lý auth trực tiếp.

---

## 12.3 Notes Module

Phụ trách:

- CRUD notes
- Favorite
- Pin
- Archive
- Soft delete
- Restore

Không tự xử lý login.

---

## 12.4 Tags Module

Phụ trách:

- CRUD tags
- Slug
- Tag color
- Note-tag relationship

---

## 12.5 Sync Module

Phụ trách:

- Pull changes
- Push changes
- Conflict handling
- Sync events

---

# 13. Folder Structure tổng thể

```text
lifenote/
├── apps/
│   ├── mobile/
│   │   └── lib/
│   │       ├── app/
│   │       ├── core/
│   │       ├── features/
│   │       └── shared/
│   │
│   └── api/
│       ├── src/
│       │   ├── common/
│       │   ├── config/
│       │   ├── modules/
│       │   └── prisma/
│       └── test/
│
├── packages/
│   ├── shared/
│   └── design_system/
│
├── docs/
│   ├── LifeNote_PRD_v1.md
│   ├── LifeNote_Database_Design_v1.md
│   ├── LifeNote_API_Design_v1.md
│   └── LifeNote_System_Architecture_v1.md
│
├── docker-compose.yml
├── README.md
└── .github/
    └── workflows/
```

---

# 14. MVP Build Order

## Phase 1 - Backend Foundation

- Setup NestJS
- Setup Prisma
- Setup PostgreSQL
- Setup Docker
- Setup config/env
- Setup global validation pipe
- Setup Swagger

## Phase 2 - Auth

- Register
- Login
- Refresh token
- JWT guard
- Get current user

## Phase 3 - Notes

- Create note
- Get notes
- Get note detail
- Update note
- Delete note
- Restore note

## Phase 4 - Tags

- Create tag
- Get tags
- Update tag
- Delete tag
- Add tag to note
- Remove tag from note

## Phase 5 - Flutter MVP

- App shell
- Login screen
- Notes list
- Note editor
- Tag filter
- Local database

## Phase 6 - Sync

- Device registration
- Push local changes
- Pull server changes
- Basic conflict handling

---

# 15. Quyết định kiến trúc quan trọng

## 15.1 Monorepo

Dùng monorepo để gom backend, app và docs chung một nơi.

Lợi ích:

- Dễ quản lý
- Dễ versioning
- Dễ CI/CD
- Dễ chia sẻ types/config

---

## 15.2 Offline First

Chọn Offline First vì ghi chú là loại app cần tốc độ và độ tin cậy.

Người dùng phải có thể ghi note ngay cả khi mất mạng.

---

## 15.3 Modular Architecture

Cả Flutter và NestJS nên chia theo feature/module.

Không nên chia theo kiểu chung chung như:

```text
controllers/
services/
models/
```

Nên chia theo nghiệp vụ:

```text
auth/
notes/
tags/
sync/
```

---

## 15.4 REST API trước, GraphQL sau

MVP nên dùng REST API vì:

- Dễ thiết kế
- Dễ debug
- Dễ test bằng Postman
- Phù hợp CRUD

GraphQL có thể cân nhắc sau khi app lớn hơn.

---

# 16. Rủi ro kỹ thuật

## 16.1 Sync phức tạp

Đây là phần khó nhất.

Cách giảm rủi ro:

- Làm CRUD online trước
- Sau đó mới thêm offline
- Sau đó mới thêm sync
- Ban đầu dùng Last Write Wins

---

## 16.2 Flutter Web

Flutter Web có thể nặng hơn web app truyền thống.

Cách giảm rủi ro:

- UI đơn giản
- Lazy loading
- Không lạm dụng animation
- Tối ưu bundle khi deploy

---

## 16.3 Search

PostgreSQL full-text search đủ cho MVP.

Nếu dữ liệu lớn hơn, có thể chuyển sang:

```text
Meilisearch
Typesense
Elasticsearch
```

---

## 16.4 AI Cost

AI có thể tốn tiền nếu tích hợp sớm.

Cách giảm rủi ro:

- Chưa làm AI trong V1
- Chỉ thêm sau khi Notes + Search + Sync ổn định
- Có quota/rate limit cho AI

---

# 17. Kết luận

Kiến trúc LifeNote v1 nên đi theo hướng:

```text
Flutter Offline First
        ↓
NestJS Modular API
        ↓
PostgreSQL as source of truth
        ↓
Redis / Object Storage / AI thêm sau
```

MVP không nên quá tham tính năng.

Thứ tự tốt nhất:

1. Backend chạy được
2. Auth chạy được
3. Notes CRUD chạy được
4. Flutter app đọc/ghi được note
5. Tags + Search
6. Offline Sync
7. Polish UI

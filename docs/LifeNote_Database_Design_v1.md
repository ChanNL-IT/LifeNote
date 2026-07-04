
# LifeNote - Database Design v1

## 1. Mục tiêu thiết kế

Database của LifeNote cần đáp ứng các mục tiêu chính:

- Quản lý user
- Quản lý ghi chú
- Quản lý tag
- Hỗ trợ tìm kiếm
- Hỗ trợ đồng bộ đa thiết bị
- Hỗ trợ soft delete
- Có thể mở rộng cho AI, file, journal, bookmark trong tương lai

---

## 2. Danh sách bảng MVP

```text
users
notes
tags
note_tags
devices
sync_events
```

---

# 3. Bảng users

Lưu thông tin tài khoản người dùng.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT,
    display_name VARCHAR(255),
    avatar_url TEXT,

    provider VARCHAR(50) DEFAULT 'local',
    provider_id VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);
```

## Giải thích

| Cột | Ý nghĩa |
|---|---|
| id | ID duy nhất của user |
| email | Email đăng nhập |
| password_hash | Mật khẩu đã hash, không lưu password gốc |
| display_name | Tên hiển thị |
| avatar_url | Ảnh đại diện |
| provider | local / google / apple |
| provider_id | ID từ Google/Apple nếu login OAuth |
| deleted_at | Soft delete tài khoản |

---

# 4. Bảng notes

Lưu ghi chú của user.

```sql
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id),

    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL DEFAULT '',

    content_format VARCHAR(50) NOT NULL DEFAULT 'markdown',

    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,

    color VARCHAR(50),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,

    last_synced_at TIMESTAMP
);
```

## Giải thích

| Cột | Ý nghĩa |
|---|---|
| id | ID duy nhất của note |
| user_id | Note thuộc user nào |
| title | Tiêu đề ghi chú |
| content | Nội dung ghi chú |
| content_format | markdown / plain_text / rich_text |
| is_favorite | Đánh dấu yêu thích |
| is_pinned | Ghim lên đầu |
| is_archived | Lưu trữ |
| color | Màu note |
| deleted_at | Soft delete |
| last_synced_at | Thời điểm đồng bộ gần nhất |

---

# 5. Bảng tags

Lưu tag của từng user.

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id),

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    color VARCHAR(50),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,

    UNIQUE(user_id, slug)
);
```

## Giải thích

| Cột | Ý nghĩa |
|---|---|
| id | ID duy nhất của tag |
| user_id | Tag thuộc user nào |
| name | Tên tag, ví dụ Flutter |
| slug | Dạng chuẩn hóa, ví dụ flutter |
| color | Màu tag |
| UNIQUE(user_id, slug) | Một user không được có 2 tag trùng slug |

---

# 6. Bảng note_tags

Bảng trung gian vì một note có nhiều tag và một tag có nhiều note.

```sql
CREATE TABLE note_tags (
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (note_id, tag_id)
);
```

## Quan hệ

```text
notes 1 ---- n note_tags n ---- 1 tags
```

Ví dụ:

```text
Note: Flutter Clean Architecture
Tags: Flutter, Architecture, Mobile
```

---

# 7. Bảng devices

Lưu thiết bị đang đăng nhập để hỗ trợ sync và quản lý session.

```sql
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id),

    device_name VARCHAR(255),
    platform VARCHAR(50) NOT NULL,
    app_version VARCHAR(50),

    push_token TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMP
);
```

## Giải thích

| Cột | Ý nghĩa |
|---|---|
| device_name | Ví dụ iPhone 15, Chrome Windows, iPad |
| platform | web / android / ios |
| app_version | Version app |
| push_token | Dùng cho push notification sau này |
| last_active_at | Thiết bị hoạt động lần cuối |

---

# 8. Bảng sync_events

Ghi lại các thay đổi để hỗ trợ đồng bộ.

```sql
CREATE TABLE sync_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id),
    device_id UUID REFERENCES devices(id),

    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,

    action VARCHAR(50) NOT NULL,

    payload JSONB,

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Giải thích

| Cột | Ý nghĩa |
|---|---|
| entity_type | notes / tags / users |
| entity_id | ID của bản ghi bị thay đổi |
| action | create / update / delete |
| payload | Dữ liệu thay đổi |
| created_at | Thời điểm thay đổi |

Ví dụ:

```json
{
  "entity_type": "notes",
  "action": "update",
  "payload": {
    "title": "Flutter Riverpod",
    "content": "Updated content"
  }
}
```

---

# 9. Index đề xuất

```sql
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at);
CREATE INDEX idx_notes_deleted_at ON notes(deleted_at);

CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_slug ON tags(slug);

CREATE INDEX idx_sync_events_user_id ON sync_events(user_id);
CREATE INDEX idx_sync_events_created_at ON sync_events(created_at);
```

---

# 10. Full-text Search

Với PostgreSQL, có thể dùng `tsvector`.

```sql
ALTER TABLE notes
ADD COLUMN search_vector tsvector;

CREATE INDEX idx_notes_search_vector
ON notes USING GIN(search_vector);
```

Có thể cập nhật `search_vector` từ title + content.

```sql
UPDATE notes
SET search_vector =
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content, ''));
```

---

# 11. Quan hệ tổng thể

```text
users
  ├── notes
  │     └── note_tags
  │             └── tags
  │
  ├── devices
  │
  └── sync_events
```

---

# 12. Prisma Schema đề xuất

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String?
  displayName  String?
  avatarUrl    String?

  provider     String   @default("local")
  providerId   String?

  notes        Note[]
  tags         Tag[]
  devices      Device[]
  syncEvents   SyncEvent[]

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  deletedAt    DateTime?
}

model Note {
  id            String   @id @default(uuid())
  userId        String

  title         String
  content       String   @default("")
  contentFormat String   @default("markdown")

  isFavorite    Boolean  @default(false)
  isPinned      Boolean  @default(false)
  isArchived    Boolean  @default(false)

  color         String?

  user          User     @relation(fields: [userId], references: [id])
  noteTags      NoteTag[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?
  lastSyncedAt  DateTime?

  @@index([userId])
  @@index([updatedAt])
  @@index([deletedAt])
}

model Tag {
  id        String   @id @default(uuid())
  userId    String

  name      String
  slug      String
  color     String?

  user      User     @relation(fields: [userId], references: [id])
  noteTags  NoteTag[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@unique([userId, slug])
  @@index([userId])
}

model NoteTag {
  noteId    String
  tagId     String

  note      Note   @relation(fields: [noteId], references: [id], onDelete: Cascade)
  tag       Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@id([noteId, tagId])
}

model Device {
  id           String   @id @default(uuid())
  userId       String

  deviceName   String?
  platform     String
  appVersion   String?
  pushToken    String?

  user         User     @relation(fields: [userId], references: [id])

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  lastActiveAt DateTime?

  @@index([userId])
}

model SyncEvent {
  id         String   @id @default(uuid())
  userId     String
  deviceId   String?

  entityType String
  entityId   String
  action     String
  payload    Json?

  user       User    @relation(fields: [userId], references: [id])

  createdAt  DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}
```

---

# 13. Những bảng chưa cần làm ngay

Các bảng này để dành cho V2/V3:

```text
attachments
bookmarks
journals
ai_messages
note_versions
workspaces
folders
shared_notes
```

## attachments

Dùng để lưu file, ảnh, PDF.

## note_versions

Dùng để lưu lịch sử chỉnh sửa note.

## ai_messages

Dùng cho AI chat với dữ liệu cá nhân.

## workspaces

Dùng nếu sau này LifeNote có nhiều không gian làm việc.

---

# 14. Thứ tự triển khai

## Bước 1
Tạo bảng:

```text
users
notes
tags
note_tags
```

## Bước 2
Làm CRUD API:

```text
Auth
Notes
Tags
```

## Bước 3
Thêm:

```text
devices
sync_events
```

## Bước 4
Thêm full-text search.

## Bước 5
Tối ưu offline sync.

---

# 15. Ghi chú quan trọng

Ở giai đoạn đầu, không nên thiết kế quá nhiều bảng.

MVP chỉ cần đủ để:

- Đăng nhập
- Tạo note
- Gắn tag
- Tìm kiếm
- Đồng bộ

Các tính năng lớn như AI, OCR, file, journal nên để sau khi core note app đã ổn định.

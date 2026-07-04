# LifeNote - API Design v1

## 1. Mục tiêu

Tài liệu này định nghĩa REST API cho LifeNote MVP.

API cần hỗ trợ:

- Đăng ký / đăng nhập
- Quản lý user hiện tại
- CRUD ghi chú
- CRUD tag
- Gắn / gỡ tag khỏi note
- Tìm kiếm note
- Quản lý thiết bị
- Đồng bộ dữ liệu đa thiết bị

---

## 2. Base URL

```text
Development:
http://localhost:3000/api/v1

Production:
https://api.lifenote.app/api/v1
```

---

## 3. Quy ước chung

### 3.1 Authentication Header

Những API cần đăng nhập phải gửi JWT Access Token.

```http
Authorization: Bearer <access_token>
```

### 3.2 Response Format

Response thành công:

```json
{
  "success": true,
  "data": {},
  "message": "OK"
}
```

Response lỗi:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {}
  }
}
```

### 3.3 Pagination

```http
GET /notes?page=1&limit=20
```

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 3.4 Date Format

Tất cả datetime dùng ISO 8601.

```text
2026-07-04T14:00:00.000Z
```

---

# 4. Auth API

## 4.1 Register

```http
POST /auth/register
```

Request:

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123",
  "displayName": "Nguyen Chan"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "displayName": "Nguyen Chan",
      "avatarUrl": null
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

---

## 4.2 Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "displayName": "Nguyen Chan",
      "avatarUrl": null
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

---

## 4.3 Refresh Token

```http
POST /auth/refresh
```

Request:

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

---

## 4.4 Logout

```http
POST /auth/logout
```

Request:

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

Response:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 4.5 Google Login

```http
POST /auth/google
```

Request:

```json
{
  "idToken": "google_id_token"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@gmail.com",
      "displayName": "Nguyen Chan",
      "avatarUrl": "https://..."
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

---

# 5. User API

## 5.1 Get Current User

```http
GET /me
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Nguyen Chan",
    "avatarUrl": null,
    "createdAt": "2026-07-04T14:00:00.000Z"
  }
}
```

---

## 5.2 Update Current User

```http
PATCH /me
```

Request:

```json
{
  "displayName": "Chan Nguyen",
  "avatarUrl": "https://..."
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Chan Nguyen",
    "avatarUrl": "https://..."
  }
}
```

---

# 6. Notes API

## 6.1 Get Notes

```http
GET /notes
```

Query Params:

| Param | Type | Required | Description |
|---|---|---|---|
| page | number | no | Default 1 |
| limit | number | no | Default 20 |
| q | string | no | Search keyword |
| tagId | uuid | no | Filter by tag |
| favorite | boolean | no | Filter favorite |
| archived | boolean | no | Filter archived |
| sort | string | no | updatedAt_desc / createdAt_desc / title_asc |

Example:

```http
GET /notes?page=1&limit=20&q=flutter&tagId=uuid
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Flutter Riverpod",
        "content": "Markdown content...",
        "contentFormat": "markdown",
        "isFavorite": true,
        "isPinned": false,
        "isArchived": false,
        "color": "blue",
        "tags": [
          {
            "id": "uuid",
            "name": "Flutter",
            "slug": "flutter",
            "color": "blue"
          }
        ],
        "createdAt": "2026-07-04T14:00:00.000Z",
        "updatedAt": "2026-07-04T14:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

## 6.2 Get Note Detail

```http
GET /notes/:id
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Flutter Riverpod",
    "content": "Markdown content...",
    "contentFormat": "markdown",
    "isFavorite": true,
    "isPinned": false,
    "isArchived": false,
    "color": "blue",
    "tags": [],
    "createdAt": "2026-07-04T14:00:00.000Z",
    "updatedAt": "2026-07-04T14:00:00.000Z"
  }
}
```

---

## 6.3 Create Note

```http
POST /notes
```

Request:

```json
{
  "title": "Flutter Riverpod",
  "content": "# Riverpod Note",
  "contentFormat": "markdown",
  "tagIds": ["uuid"],
  "color": "blue"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Flutter Riverpod",
    "content": "# Riverpod Note",
    "contentFormat": "markdown",
    "isFavorite": false,
    "isPinned": false,
    "isArchived": false,
    "color": "blue",
    "tags": [],
    "createdAt": "2026-07-04T14:00:00.000Z",
    "updatedAt": "2026-07-04T14:00:00.000Z"
  }
}
```

---

## 6.4 Update Note

```http
PATCH /notes/:id
```

Request:

```json
{
  "title": "Flutter Riverpod Updated",
  "content": "Updated markdown content",
  "contentFormat": "markdown",
  "isFavorite": true,
  "isPinned": false,
  "isArchived": false,
  "color": "green"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Flutter Riverpod Updated",
    "content": "Updated markdown content",
    "contentFormat": "markdown",
    "isFavorite": true,
    "isPinned": false,
    "isArchived": false,
    "color": "green",
    "updatedAt": "2026-07-04T14:00:00.000Z"
  }
}
```

---

## 6.5 Delete Note

Soft delete note.

```http
DELETE /notes/:id
```

Response:

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

## 6.6 Restore Note

```http
POST /notes/:id/restore
```

Response:

```json
{
  "success": true,
  "message": "Note restored successfully"
}
```

---

## 6.7 Add Tags To Note

```http
POST /notes/:id/tags
```

Request:

```json
{
  "tagIds": ["uuid1", "uuid2"]
}
```

Response:

```json
{
  "success": true,
  "message": "Tags added successfully"
}
```

---

## 6.8 Remove Tag From Note

```http
DELETE /notes/:id/tags/:tagId
```

Response:

```json
{
  "success": true,
  "message": "Tag removed successfully"
}
```

---

# 7. Tags API

## 7.1 Get Tags

```http
GET /tags
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Flutter",
      "slug": "flutter",
      "color": "blue",
      "notesCount": 12,
      "createdAt": "2026-07-04T14:00:00.000Z",
      "updatedAt": "2026-07-04T14:00:00.000Z"
    }
  ]
}
```

---

## 7.2 Create Tag

```http
POST /tags
```

Request:

```json
{
  "name": "Flutter",
  "color": "blue"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Flutter",
    "slug": "flutter",
    "color": "blue",
    "createdAt": "2026-07-04T14:00:00.000Z",
    "updatedAt": "2026-07-04T14:00:00.000Z"
  }
}
```

---

## 7.3 Update Tag

```http
PATCH /tags/:id
```

Request:

```json
{
  "name": "Flutter Framework",
  "color": "green"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Flutter Framework",
    "slug": "flutter-framework",
    "color": "green",
    "updatedAt": "2026-07-04T14:00:00.000Z"
  }
}
```

---

## 7.4 Delete Tag

Soft delete tag.

```http
DELETE /tags/:id
```

Response:

```json
{
  "success": true,
  "message": "Tag deleted successfully"
}
```

---

# 8. Search API

Trong MVP, search có thể đi qua Notes API:

```http
GET /notes?q=flutter
```

Nếu muốn tách riêng search module:

```http
GET /search?q=flutter&type=notes
```

Response:

```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "id": "uuid",
        "title": "Flutter Riverpod",
        "highlight": "Flutter state management with Riverpod..."
      }
    ]
  }
}
```

---

# 9. Devices API

## 9.1 Register Device

```http
POST /devices
```

Request:

```json
{
  "deviceName": "Chrome Windows",
  "platform": "web",
  "appVersion": "1.0.0",
  "pushToken": null
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "deviceName": "Chrome Windows",
    "platform": "web",
    "appVersion": "1.0.0",
    "lastActiveAt": "2026-07-04T14:00:00.000Z"
  }
}
```

---

## 9.2 Get My Devices

```http
GET /devices
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "deviceName": "Chrome Windows",
      "platform": "web",
      "appVersion": "1.0.0",
      "lastActiveAt": "2026-07-04T14:00:00.000Z"
    }
  ]
}
```

---

## 9.3 Update Device

```http
PATCH /devices/:id
```

Request:

```json
{
  "deviceName": "iPad Air",
  "appVersion": "1.0.1",
  "pushToken": "fcm_token"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "deviceName": "iPad Air",
    "platform": "ios",
    "appVersion": "1.0.1",
    "lastActiveAt": "2026-07-04T14:00:00.000Z"
  }
}
```

---

## 9.4 Remove Device

```http
DELETE /devices/:id
```

Response:

```json
{
  "success": true,
  "message": "Device removed successfully"
}
```

---

# 10. Sync API

## 10.1 Pull Changes

Client gọi API này để lấy thay đổi mới từ server sau thời điểm sync cuối.

```http
GET /sync/pull?since=2026-07-04T10:00:00.000Z
```

Response:

```json
{
  "success": true,
  "data": {
    "serverTime": "2026-07-04T14:00:00.000Z",
    "changes": [
      {
        "id": "uuid",
        "entityType": "notes",
        "entityId": "uuid",
        "action": "update",
        "payload": {
          "id": "uuid",
          "title": "Updated title",
          "content": "Updated content",
          "updatedAt": "2026-07-04T13:30:00.000Z",
          "deletedAt": null
        },
        "createdAt": "2026-07-04T13:30:00.000Z"
      }
    ]
  }
}
```

---

## 10.2 Push Changes

Client gửi những thay đổi local lên server.

```http
POST /sync/push
```

Request:

```json
{
  "deviceId": "uuid",
  "changes": [
    {
      "clientChangeId": "local-change-uuid",
      "entityType": "notes",
      "entityId": "uuid",
      "action": "update",
      "payload": {
        "title": "New title from mobile",
        "content": "New content",
        "updatedAt": "2026-07-04T13:55:00.000Z"
      }
    }
  ]
}
```

Response:

```json
{
  "success": true,
  "data": {
    "serverTime": "2026-07-04T14:00:00.000Z",
    "accepted": [
      {
        "clientChangeId": "local-change-uuid",
        "entityId": "uuid",
        "serverUpdatedAt": "2026-07-04T14:00:00.000Z"
      }
    ],
    "conflicts": []
  }
}
```

---

## 10.3 Conflict Response Example

Nếu cùng một note bị sửa ở hai thiết bị.

```json
{
  "success": true,
  "data": {
    "accepted": [],
    "conflicts": [
      {
        "clientChangeId": "local-change-uuid",
        "entityType": "notes",
        "entityId": "uuid",
        "reason": "SERVER_VERSION_NEWER",
        "serverVersion": {
          "title": "Server title",
          "content": "Server content",
          "updatedAt": "2026-07-04T14:00:00.000Z"
        },
        "clientVersion": {
          "title": "Client title",
          "content": "Client content",
          "updatedAt": "2026-07-04T13:55:00.000Z"
        }
      }
    ]
  }
}
```

---

# 11. Error Codes

| Code | Meaning |
|---|---|
| VALIDATION_ERROR | Dữ liệu gửi lên không hợp lệ |
| UNAUTHORIZED | Chưa đăng nhập hoặc token sai |
| FORBIDDEN | Không có quyền truy cập tài nguyên |
| NOT_FOUND | Không tìm thấy dữ liệu |
| DUPLICATE_EMAIL | Email đã tồn tại |
| DUPLICATE_TAG | Tag đã tồn tại |
| INVALID_CREDENTIALS | Sai email hoặc mật khẩu |
| TOKEN_EXPIRED | Token hết hạn |
| SYNC_CONFLICT | Xung đột đồng bộ |
| INTERNAL_SERVER_ERROR | Lỗi server |

---

# 12. HTTP Status Code

| Status | Use case |
|---|---|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 400 | Request sai |
| 401 | Chưa xác thực |
| 403 | Không có quyền |
| 404 | Không tìm thấy |
| 409 | Conflict |
| 422 | Validation error |
| 500 | Server error |

---

# 13. DTO đề xuất cho NestJS

## CreateNoteDto

```ts
export class CreateNoteDto {
  title: string;
  content?: string;
  contentFormat?: 'markdown' | 'plain_text';
  tagIds?: string[];
  color?: string;
}
```

## UpdateNoteDto

```ts
export class UpdateNoteDto {
  title?: string;
  content?: string;
  contentFormat?: 'markdown' | 'plain_text';
  isFavorite?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  color?: string;
}
```

## CreateTagDto

```ts
export class CreateTagDto {
  name: string;
  color?: string;
}
```

## PushSyncDto

```ts
export class PushSyncDto {
  deviceId: string;
  changes: SyncChangeDto[];
}

export class SyncChangeDto {
  clientChangeId: string;
  entityType: 'notes' | 'tags';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  payload: Record<string, any>;
}
```

---

# 14. Thứ tự triển khai API

## Phase 1
- `POST /auth/register`
- `POST /auth/login`
- `GET /me`

## Phase 2
- `GET /notes`
- `GET /notes/:id`
- `POST /notes`
- `PATCH /notes/:id`
- `DELETE /notes/:id`

## Phase 3
- `GET /tags`
- `POST /tags`
- `PATCH /tags/:id`
- `DELETE /tags/:id`
- `POST /notes/:id/tags`
- `DELETE /notes/:id/tags/:tagId`

## Phase 4
- `GET /notes?q=keyword`
- Full-text search

## Phase 5
- `POST /devices`
- `GET /devices`
- `GET /sync/pull`
- `POST /sync/push`

---

# 15. Ghi chú quan trọng

Trong MVP, không cần làm sync quá phức tạp ngay từ đầu.

Cách đơn giản nhất:

1. Làm API CRUD chuẩn.
2. Client lưu local database.
3. Khi online, client push thay đổi.
4. Server dùng `updatedAt` để xử lý xung đột.
5. Nếu có conflict, ưu tiên server hoặc hỏi người dùng.

Sau khi core app ổn định, có thể nâng cấp sync bằng version number hoặc event sourcing.

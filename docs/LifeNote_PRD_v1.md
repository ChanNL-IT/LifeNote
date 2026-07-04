# LifeNote - Product Requirements Document (PRD)

## 1. Giới thiệu

**Tên dự án:** LifeNote

**Mục tiêu:** Xây dựng ứng dụng quản lý tri thức cá nhân chạy trên Web,
Android và iOS theo mô hình "Second Brain".

------------------------------------------------------------------------

## 2. Đối tượng người dùng

-   Sinh viên
-   Lập trình viên
-   Người đi làm
-   Người học tập lâu dài

------------------------------------------------------------------------

## 3. Giá trị cốt lõi

-   Ghi chú Markdown
-   Đồng bộ đa thiết bị
-   Offline First
-   Tìm kiếm nhanh
-   Dễ mở rộng

------------------------------------------------------------------------

## 4. MVP

### Authentication

-   Đăng ký
-   Đăng nhập
-   Google Login

### Notes

-   CRUD ghi chú
-   Markdown
-   Favorite

### Tags

-   CRUD Tag
-   Gắn nhiều tag

### Search

-   Theo tiêu đề
-   Theo nội dung
-   Theo tag

### Sync

-   Đồng bộ Web / Android / iOS

------------------------------------------------------------------------

## 5. Chưa làm trong V1

-   AI Assistant
-   OCR
-   Voice Note
-   Whiteboard
-   Habit
-   Expense

------------------------------------------------------------------------

## 6. Tech Stack

### Frontend

-   Flutter
-   Riverpod
-   GoRouter
-   Drift

### Backend

-   NestJS
-   Prisma
-   PostgreSQL

### DevOps

-   Docker
-   GitHub Actions

------------------------------------------------------------------------

## 7. Cấu trúc

``` text
lifenote/
├── apps/
│   ├── mobile/
│   └── api/
├── packages/
├── docs/
└── README.md
```

------------------------------------------------------------------------

## 8. Roadmap

1.  Setup dự án
2.  Authentication
3.  CRUD Notes
4.  Tags
5.  Search
6.  Offline Sync
7.  Hoàn thiện UI

------------------------------------------------------------------------

## 9. Tầm nhìn

LifeNote sẽ phát triển thành nền tảng quản lý tri thức cá nhân với AI,
Journal, Habit Tracker, Bookmark, File Manager và nhiều module khác.

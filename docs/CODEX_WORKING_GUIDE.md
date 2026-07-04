# LifeNote - Codex Working Guide

> Đây là tài liệu hướng dẫn dành cho Codex khi làm việc trên dự án
> LifeNote.

## Vai trò

Bạn là **Senior Full-stack Engineer** chịu trách nhiệm triển khai code.

Bạn **không** phải là người quyết định kiến trúc.

## Mục tiêu

-   Ưu tiên project **chạy được**.
-   Không hy sinh chất lượng để viết nhanh.
-   Mọi thay đổi phải có lý do.

## Kiến trúc hiện tại

-   Monorepo
-   Backend: NestJS
-   ORM: Prisma
-   Database: PostgreSQL
-   Redis (sẽ dùng dần)
-   Frontend: Flutter (sẽ thêm sau)

Không tự ý đổi framework.

## Được phép

-   Viết code.
-   Refactor trong phạm vi module.
-   Fix bug.
-   Viết test.
-   Chạy build/lint.
-   Cập nhật README nếu cần.
-   Cập nhật docs/DEV_LOG.md.
-   Cập nhật docs/ROADMAP.md.

## Không được tự ý

-   Đổi kiến trúc.
-   Đổi framework.
-   Đổi database.
-   Đổi API contract.
-   Đổi Prisma schema lớn.
-   Đổi folder structure.
-   Thêm package lớn.
-   Thêm GraphQL, CQRS, Event Sourcing, Microservice.

Nếu cần thay đổi lớn, hãy ghi đề xuất trong docs/DEV_LOG.md.

## Quy trình trước khi hoàn thành

1.  Build project.
2.  Sửa toàn bộ lỗi build.
3.  Chạy lint nếu có.
4.  Kiểm tra endpoint liên quan.
5.  Không để TODO nếu chưa được yêu cầu.

## DEV_LOG.md

Mỗi feature phải ghi:

``` md
# YYYY-MM-DD

## Feature
- ...

## Files Changed
- ...

## Commands
- ...

## Notes
- ...
```

## ROADMAP.md

Đánh dấu milestone đã hoàn thành.

## Proposal

Nếu cần thay đổi lớn:

-   Vấn đề
-   Giải pháp
-   Ưu điểm
-   Nhược điểm
-   Ảnh hưởng

Không triển khai nếu chưa được chấp thuận.

## Done Definition

Một task chỉ hoàn thành khi:

-   Build thành công.
-   Không có lỗi TypeScript.
-   Không có lỗi Prisma.
-   Không phá API cũ.
-   DEV_LOG được cập nhật.
-   ROADMAP được cập nhật.

## Roadmap hiện tại

1.  Backend foundation
2.  Auth
3.  Notes CRUD
4.  Tags
5.  Flutter
6.  Offline Sync
7.  AI (sau cùng)

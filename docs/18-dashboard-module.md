# 18. Dashboard Module

> Tham chiếu canonical: `docs/01-architecture.md`

## Mục tiêu
Cung cấp dashboard chỉ-đọc trên stack `.NET 9 Web API + React Vite SPA`.

## Phạm vi
Backend:
- `backend/Template.Core/Features/Dashboard/`
- `backend/Template.Infrastructure/Features/Dashboard/`
- `backend/Template.API/CoreFeatures/Dashboard/`

Frontend:
- `frontend/src/features/dashboard/`

## Quy tắc
- Dashboard chỉ tổng hợp dữ liệu, không tạo/sửa/xóa records.
- Business calculation phải nằm trong backend use case.
- Không có form CRUD cho dashboard.
- Không chứa write flow hay transaction flow.

## Dữ liệu thường dùng
- KPI cards.
- Summary cards.
- Charts.
- Recent activities từ `audit_logs`.

## Query pattern
- Use case chỉ đọc dữ liệu qua repository.
- Read queries dùng `AsNoTracking()`.
- Nếu có filter thời gian, paging hoặc sort thì vẫn xử lý server-side.

## Permission
- `Dashboard.View`.


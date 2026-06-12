# 14. Master Data Module

> Tham chiếu canonical: `docs/01-architecture.md`

## Mục tiêu
Chuẩn hóa các module CRUD nền tảng trên stack `.NET 9 Web API + React Vite SPA`.

## Phạm vi
Backend:
- `backend/Template.Core/Features/{FeatureName}/`
- `backend/Template.Infrastructure/Features/{FeatureName}/`
- `backend/Template.API/CoreFeatures/{FeatureName}/`

Frontend:
- `frontend/src/features/{feature-name}/`

## Kiến trúc chuẩn
Backend:
```text
Controller -> Handler / Use Case -> Repository Interface -> Repository Implementation -> Database
```

Frontend:
```text
Page -> Hook -> API Client -> Backend API
```

## Cấu trúc chuẩn
Backend feature:
```text
Template.Core/Features/{FeatureName}/
├── Commands/
├── Queries/
├── Handlers/
└── Interfaces/
```

Frontend feature:
```text
frontend/src/features/{feature-name}/
├── components/
├── pages/
├── hooks/
├── api/
├── schemas/
├── types/
└── index.ts
```

## Quy tắc dữ liệu
- Dùng `uuid` cho `id`.
- Bảng dùng `snake_case` và số nhiều.
- Business entity nên có `created_at`, `updated_at`, `deleted_at`.
- Read queries dùng `AsNoTracking()`.
- Filter, sort, pagination phải chạy server-side.

## UI chuẩn
- List page dùng `DataTable`.
- Form dùng `react-hook-form` + `zod`.
- Query/mutation dùng TanStack Query.
- Detail page có thể hiển thị audit timeline.

## Audit & Permission
- Audit `CREATE`, `UPDATE`, `DELETE` khi có thay đổi dữ liệu.
- Permission theo dạng PascalCase dot format như `Customer.Read`, `Customer.Create`, `Customer.Delete`.

## Checklist
- CRUD đầy đủ.
- Search, filter, pagination.
- Soft delete.
- Audit log.
- RBAC.
- Type exports qua `index.ts`.


# CRUD Architecture

> Tham chiếu canonical: `docs/01-architecture.md`

## Mục tiêu

Định nghĩa pattern CRUD chuẩn cho toàn bộ hệ thống trên stack **.NET 9 Web API + React Vite SPA**.

Mọi module CRUD phải tuân theo cùng một cấu trúc để dễ generate, dễ test và dễ maintain.

---

# CRUD Flow

Backend:

```
Controller
↓
Handler / Use Case
↓
Repository
↓
Database
```

Frontend:

```
Page
↓
Hook
↓
API Client
↓
Backend API
```

---

# Controller Rule

Backend resource controllers must inherit from `BaseController<TEntity>`.

Mục tiêu:

- giảm boilerplate cho CRUD
- chuẩn hóa response và error handling
- giữ controller mỏng, chỉ làm HTTP orchestration

Rules:

- không truy cập `DbContext` trực tiếp
- không viết business logic trong controller
- chỉ override phần thật sự đặc thù của feature

Controllers are still responsible for request binding, response formatting, and authorization entry points.

---

# Page Rule

Pages chịu trách nhiệm:

- render UI
- xử lý tương tác người dùng
- ghép các component của feature

Pages không được chứa:

- business logic
- database access

---

# Hook Rule

Hooks chịu trách nhiệm:

- state management
- data fetching
- mutations
- cache sync qua TanStack Query

Do not place business logic inside hooks.

Hooks chỉ nên điều phối dữ liệu giữa UI và API client.

---

# Use Case Rule

Use cases chịu trách nhiệm:

- business logic
- validation orchestration
- permission checks
- audit logging
- mapping lỗi infrastructure sang lỗi application-safe

Use cases là nơi duy nhất được phép chứa business logic trong CRUD module.

---

# Repository Rule

Repositories chịu trách nhiệm:

- database queries
- persistence
- query composition with EF Core

Rules:

- dùng `AsNoTracking()` cho read-only queries
- dùng `IQueryable` cho filter, sort, pagination
- pagination phải chạy ở server side
- không chứa business logic
- không chứa permission logic

---

# Form Rule

Use:

- `react-hook-form`
- `zod`

for all forms.

Validation must happen before the use case call.

Backend validation vẫn phải bảo vệ invariants ngay cả khi frontend đã validate.

---

# Table Rule

Use a generic `<DataTable />` component for list pages.

Rules:

- powered by TanStack Query for fetching and cache synchronization
- supports search, filter, pagination, and sorting
- accepts feature-specific columns and actions
- should be reused across CRUD list pages

Avoid building one-off list tables when the generic table fits.

---

# CRUD Page Types

Prefer the standard set:

- List Page
- Create Page
- Edit Page
- Detail Page

Not every feature needs all four pages, but the pattern should stay consistent.

---

# Permission Rule

CRUD operations should validate permissions.

Examples:

- `user:create`
- `user:update`
- `user:delete`
- `user:view`

Permission checks belong in the use case or server-side authorization boundary, never only in the UI.

---

# Audit Rule

CRUD operations should create audit logs when applicable.

Examples:

- `CREATE`
- `UPDATE`
- `DELETE`

Audit logging belongs in the use case layer or an application service coordinated by the use case.

---

# Error Handling

Never expose raw database errors to the UI.

Rules:

- map infrastructure errors in the use case layer
- return application-safe messages or error codes
- keep validation failures distinct from persistence failures

---

# Validation Rule

Validation should happen before repository calls.

Preferred flow:

```
Form
↓
Zod Validation
↓
Use Case
↓
Repository
```

---

# Read and Write Patterns

Reads:

- query through repositories
- use `AsNoTracking()`
- page on the server

Writes:

- validate command input
- enforce permissions
- call repository through use case
- create audit log when needed

---

# System Settings CRUD

`system_settings` is a special-case configuration resource.

Rules:

- use a single JSONB payload
- validate the payload with a strongly typed schema
- keep the UI generic when possible
- preserve a stable API contract for config management

---

# Generic CRUD Stack

Recommended default stack:

- Backend controller inherits `BaseController<TEntity>`
- Backend queries use EF Core repositories
- Frontend list pages use generic `<DataTable />`
- Frontend data loading uses TanStack Query
- Frontend forms use `react-hook-form` + `zod`

---

# Goal

CRUD implementations must be:

- consistent
- reusable
- secure
- predictable
- easy to generate
- aligned across backend and frontend

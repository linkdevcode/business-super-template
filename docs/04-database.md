# Thiết Kế Database

## Mục tiêu

Tài liệu này định nghĩa kiến trúc database nền tảng cho My Super Template trên stack **.NET 9 + EF Core + React Vite SPA**.

Template được thiết kế theo mô hình:

- One Customer = One Database
- Mỗi khách hàng sử dụng một PostgreSQL database riêng biệt
- Không dùng `organization_id` để phân tách dữ liệu
- Không có bảng `organizations`

Multi-tenant trong một database là phạm vi tương lai, ngoài scope hiện tại.

---

# Nguyên Tắc Database

## PostgreSQL First

Database sử dụng PostgreSQL.

EF Core là ORM chính ở backend.

---

## UUID First

Mọi bảng phải sử dụng:

- `id` kiểu `uuid`

Không dùng:

- `integer`
- `serial`
- `bigint`

làm khóa chính.

---

## Snake Case

Tên bảng và tên cột dùng `snake_case`.

Ví dụ:

- `users`
- `audit_logs`
- `role_permissions`
- `system_settings`
- `created_at`
- `updated_at`

---

## Plural Table Names

Tên bảng phải ở dạng số nhiều.

Ví dụ đúng:

- `users`
- `roles`
- `permissions`
- `audit_logs`

Ví dụ sai:

- `user`
- `role`
- `permission`
- `audit_log`

---

## Timestamp Convention

Mọi bảng phải có:

- `created_at`
- `updated_at`

Bảng nghiệp vụ nên có thêm:

- `deleted_at` nếu hỗ trợ soft delete

---

## Soft Delete Convention

Ưu tiên `deleted_at` cho các bảng nghiệp vụ.

Soft delete phải được EF Core xử lý bằng:

- shared `ISoftDelete`
- global query filter

---

# Mô Hình Triển Khai

## One Customer = One Database

Mỗi khách hàng được triển khai trên database riêng.

Ví dụ:

- `factory_a_db`
- `factory_b_db`
- `school_a_db`
- `school_b_db`

Không sử dụng `organization_id` để phân tách dữ liệu.

---

# Core Tables

Phiên bản đầu tiên của template bao gồm:

- `system_settings`
- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`
- `audit_logs`

---

# System Settings

## Purpose

Lưu cấu hình hệ thống của từng database.

## Design

`system_settings` là một bảng duy nhất, lưu payload cấu hình trong cột JSONB.

Khuyến nghị cấu trúc:

- `id`
- `code` — định danh bản ghi cấu hình
- `settings` — JSONB payload
- `created_at`
- `updated_at`

### Ghi chú

- Có thể dùng một bản ghi singleton với `code = 'default'`
- Hoặc dùng nhiều bản ghi theo nhóm cấu hình nếu cần mở rộng
- Logic đọc/ghi payload phải được validate ở application layer trước khi lưu

### Ví dụ dữ liệu

```json
{
  "companyName": "ABC Factory",
  "companyCode": "ABC",
  "contact": {
    "email": "hello@abc.com",
    "phone": "+84..."
  },
  "branding": {
    "logoUrl": "/uploads/logo.png"
  }
}
```

---

# Users

## Purpose

Người dùng hệ thống.

## Main Fields

- `id`
- `email`
- `full_name`
- `avatar_url`
- `status`
- `last_login_at`
- `created_at`
- `updated_at`
- `deleted_at`

## Rules

- `email` phải unique
- `status` dùng giá trị nghiệp vụ thay vì nhiều cờ boolean
- `deleted_at` dùng cho soft delete

---

# Roles

## Purpose

Nhóm quyền.

## Main Fields

- `id`
- `name`
- `description`
- `created_at`
- `updated_at`

## Rules

- `name` phải unique
- dùng cho RBAC, không hardcode role name trong UI

---

# Permissions

## Purpose

Định nghĩa quyền truy cập hệ thống.

## Main Fields

- `id`
- `key`
- `name`
- `description`
- `created_at`
- `updated_at`

## Permission Key Convention

Permission key phải theo định dạng chuẩn:

- `Resource.Action`

Ví dụ:

- `User.Read`
- `User.Create`
- `User.Update`
- `User.Delete`
- `Role.Read`
- `Contract.Create`
- `Contract.Approve`
- `Asset.Update`
- `AuditLog.View`

`key` phải unique.

Tất cả seed data, .NET authorization attribute, và frontend guard đều phải dùng cùng một chuẩn này.

---

# User Roles

## Purpose

Liên kết User và Role.

## Main Fields

- `user_id`
- `role_id`
- `created_at`

## Rules

- khóa chính có thể là composite key hoặc unique constraint trên `(user_id, role_id)`
- tạo index cho cả hai khóa ngoại

---

# Role Permissions

## Purpose

Liên kết Role và Permission.

## Main Fields

- `role_id`
- `permission_id`
- `created_at`

## Rules

- khóa chính có thể là composite key hoặc unique constraint trên `(role_id, permission_id)`
- tạo index cho cả hai khóa ngoại

---

# Audit Logs

## Purpose

Lưu lịch sử thay đổi dữ liệu.

## Main Fields

- `id`
- `entity_type`
- `entity_id`
- `action`
- `changes`
- `created_by`
- `created_at`

## Action Examples

- `CREATE`
- `UPDATE`
- `DELETE`
- `APPROVE`
- `REJECT`
- `ASSIGN_ROLE`
- `REMOVE_ROLE`

`changes` phải được lưu dưới dạng JSONB để phản ánh cấu trúc thay đổi và hỗ trợ truy vấn linh hoạt.

---

# Database Access Pattern

Mọi truy cập dữ liệu phải đi qua repository.

Không truy cập database trực tiếp từ:

- Page
- Component
- Hook

Backend repository phải thực thi truy vấn qua EF Core trong Infrastructure layer.

---

# Auditability

Các hành động sau nên ghi log:

- Create
- Update
- Delete
- Approve
- Reject
- Assign
- Revoke

---

# Initial Release Scope

Core schema:

- `system_settings`
- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`
- `audit_logs`

Các bảng nghiệp vụ sẽ được bổ sung theo từng sản phẩm cụ thể.

---

# Database Conventions Summary

- UUID primary keys
- snake_case naming
- plural table names
- timestamps on every table
- `NOT NULL` by default
- indexes on foreign keys and common filters
- soft delete via `deleted_at`
- JSONB for `system_settings.settings`
- JSONB for `audit_logs.changes`
- RBAC through records, not hardcoded UI values

---

# Goal

Database phải:

- Dễ mở rộng
- Dễ maintain
- Hỗ trợ RBAC
- Hỗ trợ audit log
- Hỗ trợ EF Core mapping chuẩn
- AI Friendly
- Cursor Friendly
- Reusable cho nhiều ứng dụng quản lý doanh nghiệp

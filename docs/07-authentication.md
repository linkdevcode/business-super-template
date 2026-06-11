# Authentication Architecture

## Mục tiêu

Tài liệu này định nghĩa chiến lược xác thực cho My Super Template trên stack **.NET 9 Web API + React Vite SPA**.

Authentication phải tách biệt rõ giữa xác thực danh tính, lưu token, và kiểm soát quyền truy cập.

---

# Architecture Overview

Kiến trúc xác thực sử dụng:

- custom JWT access token
- refresh token rotation
- dedicated `IdentityService`
- Supabase Postgres làm nơi lưu identity/session data

Không dùng Next-Auth.
Không phụ thuộc vào provider-specific auth SDK ở business layer.

---

# Authentication Flow

```
User
↓
Login
↓
IdentityService
↓
JWT Access Token + Refresh Token Cookie
↓
API Request
↓
Backend Authorization
↓
Allow / Deny
```

---

# IdentityService

`IdentityService` là lớp trung tâm cho authentication.

Trách nhiệm:

- kiểm tra credential
- tạo JWT access token
- tạo refresh token
- xoay refresh token khi hết hạn
- revoke session
- resolve current user
- đồng bộ identity với Supabase Postgres

`IdentityService` là nơi duy nhất biết chi tiết lưu trữ auth.

---

# User Source

Thông tin user nghiệp vụ đến từ bảng `users`.

Không tạo duplicate user model cho auth.

Mapping boundary:

- `full_name` → `fullName`

---

# Session and Token Strategy

## Access Token

- JWT ngắn hạn
- chỉ lưu trong application memory của React (state / in-memory store)
- dùng cho `Authorization: Bearer ...`
- không lưu trong `localStorage` hoặc `sessionStorage`

## Refresh Token

- token dài hạn
- do backend phát hành và lưu trong cookie bảo mật
- phải được rotate sau mỗi lần refresh
- token cũ phải bị revoke hoặc vô hiệu hóa theo chính sách

## Cookie Policy

Refresh token phải được lưu trong cookie với các thuộc tính sau:

- `HttpOnly`
- `Secure`
- `SameSite=Strict`

Cookie này do backend .NET quản lý thông qua response header `Set-Cookie`.
Frontend không được đọc refresh token bằng JavaScript để giảm rủi ro XSS.

---

# Frontend Token Handling

Frontend phải dùng Axios interceptors để:

- tự động gắn access token từ memory
- tự động gọi refresh endpoint khi gặp `401`
- gửi request refresh kèm cookie bằng `withCredentials`
- retry request sau khi refresh thành công
- clear auth state nếu refresh thất bại

Token rotation phải trong suốt với người dùng.

---

# Route Protection

Routes được chia thành:

- Public
- Protected
- Permission Protected

Ví dụ:

- `/login` là public
- `/dashboard` là protected
- `/users` có thể permission protected

---

# Current User

Luôn dùng utility tập trung:

- `getCurrentUser()`
- `requireAuth()`
- `requirePermission()`
- `hasPermission()`
- `hasRole()`

---

# Authorization Strategy

Hệ thống sử dụng RBAC:

User
↓
Role
↓
Permission

Không authorize theo role name trực tiếp.

Bad:

```csharp
if (user.Role == "Admin")
```

Good:

```csharp
[HasPermission("User.Read")]
```

---

# Backend Authorization

Backend là nơi kiểm tra cuối cùng.

Permission validation phải chạy trên server.
Frontend permission check chỉ phục vụ UX.

---

# Frontend Authorization

Frontend có thể dùng `<HasPermission />` để ẩn hoặc hiển thị UI.
Frontend không được xem là nguồn kiểm soát quyền.

---

# Audit Integration

Các hành động auth cần được ghi log khi phù hợp:

- `LOGIN`
- `LOGOUT`
- `PASSWORD_RESET`
- `TOKEN_REFRESH`
- `TOKEN_REVOKE`

---

# Goal

Authentication phải:

- secure
- reusable
- testable
- provider agnostic ở mức module
- framework agnostic
- hỗ trợ JWT refresh token rotation

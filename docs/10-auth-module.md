# Thiết Kế Auth Module

## Mục tiêu

Auth Module là platform module nền tảng của toàn bộ hệ thống.

Mọi module khác đều phụ thuộc vào:

- current user
- authentication
- authorization
- session

Auth module không phải business module và không tuân theo pattern Use Case / Repository như các feature nghiệp vụ.

---

# Vị Trí Module

- `backend/Template.API/CoreFeatures/Auth/` — HTTP entry point và auth controllers
- `backend/Template.Core/Features/Auth/` — orchestration và application contracts
- `backend/Template.Infrastructure/Auth/` — `IdentityService` và persistence adapters
- `frontend/src/features/auth/` — React pages, hooks, components, api

---

# Trách Nhiệm

Auth module chịu trách nhiệm:

- login
- logout
- refresh token handling
- current user resolution
- permission checks for UX
- route protection

---

# Không Phải Trách Nhiệm

Auth module không chịu trách nhiệm:

- user CRUD nghiệp vụ
- role CRUD
- permission CRUD

Các chức năng này thuộc business modules tương ứng.

---

# Auth Flow

```
User
↓
Login Page
↓
Hook
↓
API Layer
↓
IdentityService
↓
JWT Access Token + Refresh Token Cookie
↓
Current User
↓
Permission Check
```

---

# Cấu Trúc Module

Backend auth trải rộng qua `backend/Template.API/CoreFeatures/Auth/`, `backend/Template.Core/Features/Auth/`, và `backend/Template.Infrastructure/Auth/`, không cần một root folder auth riêng.

Frontend auth:

```
frontend/src/features/auth/
├── components/
├── pages/
├── hooks/
├── api/
├── schemas/
├── types/
└── index.ts
```

Auth module không có `use-cases/` hay `repositories/` theo kiểu business module.

---

# Identity Integration

`IdentityService` là lớp trung tâm cho:

- credential verification
- JWT issuance
- refresh token rotation
- session revoke
- current user resolution

Persistence chi tiết nằm trong `backend/Template.Infrastructure/Auth/`.

---

# Types

## AuthUser

```ts
interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  status: string;
  roles: string[];
  permissions: string[];
}
```

Database mapping:

- `users.full_name` → `AuthUser.fullName`

## AuthSession

Frontend chỉ giữ access token trong bộ nhớ tạm thời của ứng dụng.
Refresh token không được expose cho JavaScript vì được lưu trong HttpOnly cookie.

```ts
interface AuthSession {
  accessToken: string;
  expiresAt: string;
}
```

---

# Schemas

## Login Schema

Fields:

- email
- password

Validation:

- email required
- email must be valid
- password required

## Refresh Schema

Refresh endpoint không nhận refresh token từ JavaScript body.
Refresh token được gửi tự động qua cookie bảo mật.

---

# API Layer

Orchestration logic chỉ ở đây, không chứa React code.

Typical operations:

- `login`
- `logout`
- `refreshSession`
- `getCurrentUser`
- `getPermissions`

---

# Hooks

## useAuth()

Returns:

- login
- logout
- currentUser
- loading

## useCurrentUser()

Returns:

- currentUser
- loading

## usePermission()

Returns:

- `hasPermission()`
- `hasRole()`

Hooks chỉ điều phối data và state, không chứa business logic.

---

# Components

## ProtectedRoute

Yêu cầu user đăng nhập.

Nếu chưa đăng nhập thì redirect về login.

## HasPermission

Render children khi user có permission phù hợp.

Ví dụ:

- `User.Read`
- `User.Create`
- `AuditLog.View`

---

# Pages

## LoginPage

Sử dụng:

- `react-hook-form`
- `zod`

Fields:

- email
- password

---

# Authorization Rules

Không authorize bằng role name.

Bad:

```ts
if (user.role === "Admin")
```

Good:

```ts
hasPermission("User.Read")
```

---

# Token Rotation

Khi access token hết hạn:

1. Axios interceptor gọi refresh endpoint
2. backend đọc refresh token từ HttpOnly cookie
3. `IdentityService` cấp access token mới
4. refresh token được rotate và ghi lại cookie mới
5. request cũ được retry tự động
6. nếu refresh fail, clear session và redirect login

---

# Audit Integration

Login → `LOGIN` audit log

Logout → `LOGOUT` audit log

Password reset → `PASSWORD_RESET` audit log

Token refresh/revoke → audit log khi chính sách yêu cầu

---

# Provider Abstraction

Auth module không phụ thuộc trực tiếp vào provider SDK.

Auth persistence và identity management nằm ở `IdentityService` và infrastructure adapters.

---

# Goal

Auth Module phải:

- reusable
- secure
- testable
- provider agnostic ở mức module
- easy to extend
- consistent với custom JWT + refresh token flow

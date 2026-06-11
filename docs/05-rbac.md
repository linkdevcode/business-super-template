# RBAC (Role Based Access Control)

## Mục tiêu

Tài liệu này định nghĩa mô hình phân quyền cho My Super Template trên stack **.NET 9 Web API + React Vite SPA**.

Hệ thống sử dụng RBAC để kiểm soát quyền truy cập. Người dùng không được gán permission trực tiếp; permission được kế thừa thông qua role.

---

# RBAC Structure

```
User
↓
Role
↓
Permission
```

---

# Core Tables

- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

---

# User

Người sử dụng hệ thống.

Một user có thể có nhiều role.

---

# Role

Role là nhóm quyền.

Role dùng để gom nhiều permission thành một tập hợp nghiệp vụ.

Ví dụ role:

- Admin
- Manager
- Staff
- Viewer

---

# Permission

Permission là đơn vị quyền nhỏ nhất.

## Permission Key Convention

Permission key phải theo định dạng:

- `Resource.Action`

Ví dụ:

- `User.Read`
- `User.Create`
- `User.Update`
- `User.Delete`
- `Role.Read`
- `Asset.Update`
- `Contract.Approve`
- `AuditLog.View`

Permission key phải duy nhất.

Không hardcode role name để quyết định quyền.

---

# Authorization Model

```
User
↓
Role
↓
Permission
```

Quyền truy cập chỉ được xác định bằng permission.

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

Yêu cầu:

- permission check phải chạy trên server
- endpoint quan trọng phải có authorization attribute
- frontend không được xem là nguồn kiểm soát quyền

---

# Permission Attributes

Backend controllers và actions nên sử dụng attribute dạng:

- `[HasPermission("User.Read")]`
- `[HasPermission("User.Create")]`
- `[HasPermission("AuditLog.View")]`

Dynamic string permission keys là hợp lệ và là nguồn sự thật cho authorization.

---

# Frontend Authorization

Frontend chỉ dùng permission cho UX.

Các quyền có thể dùng để:

- ẩn menu
- ẩn button
- ẩn action
- điều hướng người dùng

Frontend guard phải là component tái sử dụng:

- `<HasPermission />`

Guard chỉ quyết định hiển thị UI, không thay thế server-side authorization.

---

# Route Protection

Routes được chia thành:

- Public
- Protected
- Permission Protected

Ví dụ:

- `/login` là Public
- `/dashboard` là Protected
- `/users` có thể là Permission Protected với `User.Read`

---

# Permission Check Flow

```
Request
↓
Authenticated User
↓
Load Roles
↓
Load Permissions
↓
Permission Check
↓
Allow / Deny
```

---

# Default Permission Rules

Mỗi module nghiệp vụ mới phải khai báo permission riêng.

Ví dụ:

- `Student.Read`
- `Student.Create`
- `Student.Update`
- `Student.Delete`

- `Contract.Read`
- `Contract.Create`
- `Contract.Approve`

---

# Goal

RBAC phải:

- rõ ràng
- dễ mở rộng
- dễ audit
- đồng nhất giữa backend và frontend
- AI friendly

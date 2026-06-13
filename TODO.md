# 🚀 Super Admin Template - Project Backlog & TODO List

---

## Phase 1: Khởi tạo Project & Môi trường Local

- [x] **1.1. Cấu trúc thư mục Vật lý & Solution Backend**
  - [x] Tạo folder `backend/` và file solution `Template.sln`.
  - [x] Tạo dự án `Template.Core` (Class Library).
  - [x] Tạo dự án `Template.Infrastructure` (Class Library).
  - [x] Tạo dự án `Template.API` (Web API .NET 9).
  - [x] Cấu hình Reference (API -> Infrastructure -> Core).
- [x] **1.2. Khởi tạo Frontend Project**
  - [x] Tạo folder `frontend/` bằng Vite + TypeScript + React.
  - [x] Cấu hình `vite.config.ts` (port, alias `@` trỏ vào `src`).
- [x] **1.3. Cấu hình Docker Local Môi trường Phát triển**
  - [x] Viết file `docker-compose.yml` ở root (PostgreSQL v16, pgAdmin).
  - [x] Kiểm tra kết nối database từ môi trường local.

---

## Phase 2: Thiết lập Tầng Lõi Cơ Bản (Core Infrastructure)

### Backend (.NET 9)

- [x] **2.1. Tầng Core (Domain & Contracts Lõi)**
  - [x] Tạo `ISoftDelete`, `BaseEntity`, `ApiResponse`, `PagedResponse`.
  - [x] Tạo entity `AuditLog`.
  - [x] Tạo `IBaseRepository` và `IUnitOfWork`.
  - [x] Giữ toàn bộ entity và contract ở Core theo hướng persistence-ignorant.

- [x] **2.2. Tầng Infrastructure (Hạ tầng & Data)**
  - [x] Tạo `AppDbContext` kết nối PostgreSQL qua EF Core.
  - [x] Tạo Fluent API configurations cho entity.
  - [x] Override `SaveChangesAsync()` để auto `CreatedAt` / `UpdatedAt` / `DeletedAt`.
  - [x] Ghi audit log tự động vào `AuditLogs`.
  - [x] Áp dụng Global Query Filter cho soft delete.
  - [x] Triển khai `BaseRepository` với CRUD, paging, filter, sort server-side.
  - [x] Đăng ký DI cho DbContext, Repository, UnitOfWork.

- [x] **2.3. Tầng API (Cổng chạy)**
  - [x] Viết `GlobalExceptionMiddleware`.
  - [x] Viết `BaseController` cho CRUD generic.
  - [x] Chuẩn hóa `GetAll`, `GetById`, `Create`, `Update`, `Delete`.
  - [x] Giữ controller thật mỏng.
  - [x] Cấu hình `Program.cs` theo đúng bootstrap order.

### Frontend (React + TS)

- [x] **2.4. Cấu hình Core & HTTP Client**
  - [x] Cài `axios`, `react-router-dom`, `@tanstack/react-query`, `tailwindcss`.
  - [x] Tạo `axiosClient.ts` với request/response interceptors.
  - [x] Tự động refresh token khi gặp `401`.
  - [x] Logout đồng bộ khi refresh fail.
  - [x] Tạo `providers.tsx` bọc `QueryClientProvider`.
  - [x] Cấu hình typed env module cho `import.meta.env`.

- [x] **2.5. Khởi tạo Khung UI & Layout**
  - [x] Tích hợp `shadcn/ui` và tạo `Button`, `Input`, `Table`, `Dialog`.
  - [x] Tạo `<DataTable />`.
  - [x] Viết `AdminLayout` và `AuthLayout`.
  - [x] Chuẩn bị `router.tsx` cho Public / Protected / Permission Protected routes.

---

## Phase 3: Triển khai các Module Chung (Core Features)

### 3.0. Core Entity Foundation

- [ ] **Backend**
  - [ ] Tạo entity `User` cho bảng `users`.
  - [ ] Tạo entity `Role` cho bảng `roles`.
  - [ ] Tạo entity `Permission` cho bảng `permissions`.
  - [ ] Tạo entity trung gian `UserRole` cho bảng `user_roles`.
  - [ ] Tạo entity trung gian `RolePermission` cho bảng `role_permissions`.
  - [ ] Tạo entity `SystemSetting` cho bảng `system_settings`.
  - [ ] Tạo entity `AuditLog` cho bảng `audit_logs`.
  - [ ] Tạo EF Core Fluent API mapping cho toàn bộ entity nền tảng.
  - [ ] Tạo migration đầu tiên cho core tables.

### 3.1. Module Authentication & User (Platform Feature)

- [x] **Backend**
  - [x] Tạo `Template.Core/Features/Auth/`.
  - [x] Tạo `Template.API/CoreFeatures/Auth/`.
  - [x] Tạo `Template.Infrastructure/Auth/`.
  - [ ] Dùng user nghiệp vụ từ bảng `users`, không tạo model auth tách rời.
  - [x] Xử lý `JWT access token`, `refresh token rotation`, `revocation`, và session security.
  - [x] Giữ auth provider ở dạng abstraction.
- [x] **Frontend**
  - [x] Tạo `frontend/src/features/auth/`.
  - [x] Viết màn hình `Login` và `Logout`.
  - [x] Giữ state trong memory bằng auth store/context.
  - [x] Viết route guard cho `ProtectedRoute`, `PublicRoute`.
  - [x] Dùng `axiosClient` để gắn access token và refresh tự động.

### 3.2. Module Role & Permission (RBAC)

- [ ] **Backend**
  - [ ] Tạo feature slices cho `Role` và `Permission`.
  - [ ] Map `roles`, `permissions`, `user_roles`, `role_permissions`.
  - [ ] Định nghĩa permission key theo `Resource.Action`.
  - [ ] Viết `PermissionRequirement` và `HasPermissionAttribute`.
  - [ ] Gắn authorization entry point ở controller/action.
- [ ] **Frontend**
  - [ ] Tạo UI quản lý `Roles` và `Permissions`.
  - [ ] Tạo `<HasPermission name="Resource.Action" />`.
  - [ ] Chuẩn bị UI gán role cho user.

### 3.3. Module Master Data CRUD Standard

- [ ] **Backend**
  - [ ] Tạo entity và module slices cho `Customer`.
  - [ ] Tạo entity và module slices cho `Supplier`.
  - [ ] Tạo entity và module slices cho `Employee`.
  - [ ] Tạo entity và module slices cho `Product`.
  - [ ] Chuẩn hóa CRUD pattern cho master data.
  - [ ] Bảo đảm query list dùng `.AsNoTracking()` và `IQueryable`.
  - [ ] Áp dụng soft delete và permission guard.
- [ ] **Frontend**
  - [ ] Sử dụng `frontend/src/features/{feature-name}/` cho master data.
  - [ ] Trang danh sách dùng `<DataTable />`.
  - [ ] Form dùng `react-hook-form` + `zod`.

### 3.4. Module File Management (Lưu trữ Tệp tin 0đ)

- [ ] **Backend**
  - [ ] Tạo entity `File` cho bảng `files`.
  - [ ] Tạo feature slice `FileManagement`.
  - [ ] Triển khai `IStorageProvider` và `SupabaseStorageProvider`.
  - [ ] Áp dụng soft delete và permission cho file.
- [ ] **Frontend**
  - [ ] Tạo feature `file-management`.
  - [ ] Xây dựng upload/download flow qua Axios.

### 3.5. Module Notification (Real-time Thông báo)

- [ ] **Backend**
  - [ ] Tạo entity `Notification` cho bảng `notifications`.
  - [ ] Tạo `NotificationHub`.
  - [ ] Triển khai `CreateNotification`, `MarkAsRead`, `MarkAllAsRead`, `GetMyNotifications`.
- [ ] **Frontend**
  - [ ] Tạo feature `notification`.
  - [ ] Kết nối SignalR client.

### 3.6. Module Dashboard (Bảng Điều Khiển Tổng Quan)

- [ ] **Backend**
  - [ ] Triển khai các use case read-only cho KPI / activity feed.
- [ ] **Frontend**
  - [ ] Xây dashboard widgets và cards.

### 3.7. Module Reporting (Xuất Bản Báo Cáo)

- [ ] **Backend**
  - [ ] Tạo `IReportExportProvider`.
  - [ ] Xuất báo cáo bằng stream hoặc file tạm.
- [ ] **Frontend**
  - [ ] Tạo UI tra cứu và export báo cáo.

### 3.8. Module System Settings & Audit Log Viewer

- [ ] **Backend**
  - [ ] Tạo API đọc/ghi cấu hình `system_settings`.
  - [ ] Tạo API tra cứu `audit_logs`.
- [ ] **Frontend**
  - [ ] Tạo trang System Settings.
  - [ ] Tạo trang Audit Log Viewer.

---

## Phase 4: Đóng gói Template & Kiểm tra Deploy (0đ)

- [ ] **Backend deployment**
  - [ ] Viết `Dockerfile` đa tầng cho Backend `.NET 9`.
  - [ ] Cấu hình port, health check `/health`, và biến môi trường runtime.
  - [ ] Bảo đảm backend bootstrap theo đúng thứ tự.
- [ ] **Frontend deployment**
  - [ ] Tạo luồng build production cho Vite SPA.
  - [ ] Rà lại `import.meta.env` và các biến `VITE_*`.
- [ ] **CI/CD**
  - [ ] Viết file cấu hình GitHub Actions cho pipeline build/test/lint/deploy.
- [ ] **Zero-cost deploy validation**
  - [ ] Deploy thử nghiệm FE lên Vercel hoặc Netlify.
  - [ ] Deploy thử nghiệm BE lên Render hoặc Railway bằng Docker.
  - [ ] Xác minh ứng dụng chạy end-to-end.

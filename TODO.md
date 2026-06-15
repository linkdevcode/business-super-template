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

## Naming Convention (Template-wide)

- **Backend entity / class / handler / DTO**: `PascalCase`, số ít.
  - Ví dụ: `User`, `Role`, `Permission`, `SystemSetting`, `AuditLog`, `File`, `Notification`
- **Database table**: `snake_case`, số nhiều.
  - Ví dụ: `users`, `roles`, `permissions`, `system_settings`, `audit_logs`, `files`, `notifications`
- **Backend feature folder**: `PascalCase`, theo concept/module.
  - Ví dụ: `Auth`, `Role`, `Permission`, `FileManagement`, `Notification`, `Dashboard`, `Reporting`
- **Frontend feature folder**: `kebab-case`, theo concept/module.
  - Ví dụ: `auth`, `role`, `permission`, `file-management`, `notification`, `dashboard`, `reporting`
- **Controller**: `{Entity}Controller` hoặc `{Concept}Controller`.
  - Ví dụ: `UsersController`, `RolesController`, `AuthController`
- **Handler / use case**: `{Verb}{Entity}Handler`.
  - Ví dụ: `CreateUserHandler`, `UpdateRoleHandler`, `MarkNotificationAsReadHandler`
- **Repository**: `I{Entity}Repository` và `{Entity}Repository`.
  - Ví dụ: `IUserRepository`, `UserRepository`
- **Frontend API client**: `{entity}Api.ts`.
  - Ví dụ: `userApi.ts`, `roleApi.ts`, `notificationApi.ts`
- **Frontend hook**: `use{Entities}` hoặc `use{Verb}{Entity}`.
  - Ví dụ: `useUsers`, `useCreateUser`, `useNotifications`
- **Frontend schema**: `{action}{Entity}Schema`.
  - Ví dụ: `createUserSchema`, `updateRoleSchema`, `createFileSchema`

---

## Phase 3: Triển khai các Module Chung (Core Features)

### 3.0. Core Entity Foundation

- [x] **Backend**
  - [x] Tạo entity `User` cho bảng `users`.
  - [x] Tạo entity `Role` cho bảng `roles`.
  - [x] Tạo entity `Permission` cho bảng `permissions`.
  - [x] Tạo entity trung gian `UserRole` cho bảng `user_roles`.
  - [x] Tạo entity trung gian `RolePermission` cho bảng `role_permissions`.
  - [x] Tạo entity `SystemSetting` cho bảng `system_settings`.
  - [x] Tạo EF Core Fluent API mapping cho toàn bộ entity nền tảng.
  - [x] Tạo migration đầu tiên cho core tables.

### 3.1. Module Authentication & User (Platform Feature)

- [x] **Backend**
  - [x] Tạo `Template.Core/Features/Auth/`.
  - [x] Tạo `Template.API/CoreFeatures/Auth/`.
  - [x] Tạo `Template.Infrastructure/Auth/`.
  - [x] Dùng user nghiệp vụ từ bảng `users`, không tạo model auth tách rời.
  - [x] Xử lý `JWT access token`, `refresh token rotation`, `revocation`, và session security.
  - [x] Giữ auth provider ở dạng abstraction.
- [x] **Frontend**
  - [x] Tạo `frontend/src/features/auth/`.
  - [x] Viết màn hình `Login` và `Logout`.
  - [x] Giữ state trong memory bằng auth store/context.
  - [x] Viết route guard cho `ProtectedRoute`, `PublicRoute`.
  - [x] Dùng `axiosClient` để gắn access token và refresh tự động.

### 3.1.1. User Management & Profile

- [x] **Backend**
  - [x] API danh sách Users phân trang, tìm kiếm, lọc trạng thái (`User.Read`).
  - [x] API cập nhật trạng thái User Active/Inactive và gán Role (`User.Update`).
  - [x] API `UpdateProfileCommand` và `ChangePasswordCommand` (BCrypt) cho người dùng hiện tại.
  - [x] Bổ sung `User.Read` / `User.Update` vào seeder và `AuthUserDto.AvatarUrl`.
- [x] **Frontend**
  - [x] Menu sidebar "Người dùng" trong nhóm Quản trị (dưới Vai trò).
  - [x] Trang quản lý người dùng với `<DataTable />`, badge trạng thái, gán vai trò nhanh.
  - [x] Trang Hồ sơ cá nhân với `<AvatarUploader />`, cập nhật thông tin và đổi mật khẩu.
  - [x] Liên kết "Hồ sơ" từ dropdown Header điều hướng tới `/profile`.

### 3.2. Module Role & Permission (RBAC & CRUD Pattern Standard)
- [x] **Backend**
  - [x] Tạo feature slices riêng cho `Role` và `Permission` trong `Template.Core`, `Template.Infrastructure`, `Template.API`.
  - [x] Định nghĩa bộ Permission Key thống nhất theo chuẩn PascalCase dot format (`Resource.Action`).
  - [x] Viết `PermissionRequirement` và `HasPermissionAttribute` để kiểm tra quyền hạn (Authorization) ở tầng Server.
  - [x] Triển khai **pattern CRUD mẫu** cho `Role` kế thừa từ `BaseRepository`: API list ép phân trang/lọc/sort server-side (`IQueryable` + `.AsNoTracking()`), áp dụng soft delete và chặn quyền bằng `[HasPermission("Role.Read")]`.
- [x] **Frontend**
  - [x] Tạo UI quản lý danh sách `Roles` và tích chọn `Permissions` chi tiết (Many-to-Many Form) theo cấu trúc feature slice chuẩn.
  - [x] Trang danh sách Role kết nối trực tiếp với siêu component `<DataTable />` làm mẫu hiển thị, phân trang từ Backend.
  - [x] Màn hình Form Thêm/Sửa Role bọc `react-hook-form` + `zod` làm bài mẫu xử lý dữ liệu.
  - [x] Triển khai component `<HasPermission name="Resource.Action" />` để điều khiển UI động từ Client side.

### 3.3. Module File Management (Lưu trữ Tệp tin 0đ)

- [x] **Backend**
  - [x] Tạo entity `File` cho bảng `files`.
  - [x] Tạo feature slice `FileManagement`.
  - [x] Triển khai `IStorageProvider` và `SupabaseStorageProvider`.
  - [x] Áp dụng soft delete và permission cho file.
- [x] **Frontend**
  - [x] Tạo feature `file-management`.
  - [x] Xây dựng upload/download flow qua Axios.

### 3.5. Module Notification (Real-time Thông báo)

- [x] **Backend**
  - [x] Tạo thực thể `Notification` cho bảng `notifications`.
  - [x] Triển khai lớp `NotificationHub` kế thừa từ `Hub` của SignalR:
    - [x] Override hai hàm `OnConnectedAsync` và `OnDisconnectedAsync` để tự động ánh xạ (map) giữa `Context.User.GetUserId()` (bóc tách từ JWT Token) với `ConnectionId` tương ứng của trình duyệt.
    - [x] Đảm bảo cơ chế gửi thông báo nhắm chính xác đích danh user qua: `_hubContext.Clients.User(userId.ToString()).SendAsync(...)`.
  - [x] Triển khai luồng xử lý đồng bộ giữa Database và Real-time khi có sự kiện thông báo (`CreateNotification`):
    - [x] **Bước 1:** Ghi một bản ghi mới chứa đầy đủ Metadata vào bảng `notifications` trong cơ sở dữ liệu để lưu vết lịch sử tra cứu sau này.
    - [x] **Bước 2:** Gọi qua `IHubContext` để kích hoạt một sự kiện WebSockets hạ tầng xuống chính xác Client của User liên quan (nếu họ đang trực tuyến) để hiển thị giao diện lập tức.
  - [x] Xây dựng hoàn chỉnh các Use Cases: `CreateNotification`, `MarkAsRead`, `MarkAllAsRead`, `GetMyNotifications`.

- [x] **Frontend**
  - [x] Tạo cấu trúc thư mục tính năng `frontend/src/features/notification/`.
  - [x] Quản lý kết nối bền bỉ (Resilient Connection) với SignalR Server:
    - [x] Khởi tạo SignalR Client ở cấp độ **App Provider** hoặc **Global Context** (chỉ cho phép thiết lập cổng kết nối ngầm sau khi người dùng xác thực thành công).
    - [x] Cấu hình bắt buộc cơ chế tự động kết nối lại `.withAutomaticReconnect()` để phòng ngừa các sự cố rớt mạng cục bộ hoặc máy chủ khởi động lại, tránh tình trạng chết kết nối ngầm.
  - [x] Kết nối hoàn chỉnh SignalR client với UI "Quả chuông thông báo" và Toast Component để đẩy trải nghiệm thời gian thực lên giao diện một cách mượt mà.

### 3.5. Module System Settings & Audit Log Viewer (Quản Trị Hệ Thống)

- [x] **Backend**
  - [x] Hoàn thiện bảng `system_settings` lưu cấu hình hệ thống bằng kiểu dữ liệu **JSONB**. Viết API đọc/ghi và thực hiện validate cấu hình bằng Fluent Validation ở Application layer.
  - [x] Mở API tra cứu lịch sử từ bảng `audit_logs` (đã được cấu hình cào tự động ở Phase 2.2) hỗ trợ phân trang, lọc và tìm kiếm theo thực thể (Entity Name), ID bản ghi, hoặc người tác động.
- [x] **Frontend**
  - [x] Tạo trang Cấu hình hệ thống (System Settings Page) tự động ánh xạ cấu hình dạng JSON nhận từ API thành các trường nhập liệu trực quan (Mail SMTP, cấu hình app...).
  - [x] Tạo trang Nhật ký hệ thống (Audit Log Viewer) hiển thị danh sách và chi tiết lịch sử thay đổi dạng trước/sau (Before / After Data) trực quan cho Admin.

### 3.6. UI System & Experience Polish (Template Experience)

- [x] **Frontend**
  - [x] Chuẩn hóa theme system cho toàn bộ template bằng `shadcn/ui` tokens + CSS variables, ưu tiên palette `zinc` / `slate` / `stone`.
  - [x] Tích hợp `next-themes` để hỗ trợ Dark / Light mode mượt mà, đồng bộ transition cho toàn hệ thống giao diện.
  - [x] Tái cấu trúc `AdminLayout` theo hướng chuyên nghiệp: sidebar collapsible, header sticky/glass nhẹ, breadcrumb theo route, user profile dropdown.
  - [x] Thêm hiệu ứng động tinh tế bằng Framer Motion cho route transitions, page enter/exit, và các interaction chính yếu.
  - [x] Nâng cấp `<DataTable />`, form, input, button, dialog, empty state, skeleton loading để tạo cảm giác product-ready và thống nhất.
  - [x] Chuẩn hóa spacing, typography, focus ring, shadow, active state, responsive behavior để template nhìn hoàn chỉnh hơn.

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

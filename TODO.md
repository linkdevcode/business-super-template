# 🚀 Super Admin Template - Project Backlog & TODO List

File này dùng để theo dõi tiến độ xây dựng bộ Siêu Template (.NET 9 + React Vite SPA).
Hướng dẫn cho AI: Mỗi khi hoàn thành một task, hãy cập nhật trạng thái từ `[ ]` thành `[x]`.

---

## Phase 1: Khởi tạo Project & Môi trường Local

- [ ] **1.1. Cấu trúc thư mục Vật lý & Solution Backend**
  - [ ] Tạo folder `backend/` và file solution `Template.sln`.
  - [ ] Tạo dự án `Template.Core` (Class Library).
  - [ ] Tạo dự án `Template.Infrastructure` (Class Library).
  - [ ] Tạo dự án `Template.API` (Web API .NET 9).
  - [ ] Cấu hình Reference (API -> Infrastructure -> Core).
- [ ] **1.2. Khởi tạo Frontend Project**
  - [ ] Tạo folder `frontend/` bằng Vite + TypeScript + React.
  - [ ] Cấu hình `vite.config.ts` (port, alias `@` trỏ vào `src`).
- [ ] **1.3. Cấu hình Docker Local Môi trường Phát triển**
  - [ ] Viết file `docker-compose.yml` ở root (PostgreSQL v16, pgAdmin).
  - [ ] Kiểm tra kết nối database từ môi trường local.

---

## Phase 2: Thiết lập Tầng Lõi Cơ Bản (Core Infrastructure)

### Backend (.NET 9)
- [ ] **2.1. Tầng Core (Domain Lõi)**
  - [ ] Tạo `BaseEntity.cs` (Id kiểu Guid, các trường Audit: CreatedAt, UpdatedAt, IsDeleted).
  - [ ] Tạo các interface cơ bản: `IBaseRepository.cs`, `IUnitOfWork.cs`.
- [ ] **2.2. Tầng Infrastructure (Hạ tầng & Data)**
  - [ ] Tạo `ApplicationDbContext.cs` bọc kết nối Postgres qua EF Core.
  - [ ] Override hàm `SaveChangesAsync()` để tự động cào `ChangeTracker` xử lý Audit Log tự động.
  - [ ] Triển khai `BaseRepository.cs` sử dụng các câu lệnh LINQ tối ưu (`AsNoTracking()`).
- [ ] **2.3. Tầng API (Cổng chạy)**
  - [ ] Viết `GlobalExceptionMiddleware.cs` để bắt và format toàn bộ lỗi hệ thống tập trung.
  - [ ] Viết `BaseController.cs` kế thừa CRUD Generic (GetAll phân trang, GetById, Create, Update, Delete).

### Frontend (React + TS)
- [ ] **2.4. Cấu hình Core & HTTP Client**
  - [ ] Cài đặt các package: `axios`, `react-router-dom`, `@tanstack/react-query`, `tailwindcss`.
  - [ ] Cấu hình `axiosClient.ts` bọc sẵn Interceptor (Tự động đính kèm JWT, tự động bắt lỗi 401 để kích hoạt Refresh Token).
- [ ] **2.5. Khởi tạo Khung UI & Layout**
  - [ ] Tích hợp `shadcn/ui` và khởi tạo các component cơ bản (Button, Input, Table, Dialog).
  - [ ] Tạo component `<DataTable />` dùng chung nhận cấu hình từ TanStack Table.
  - [ ] Viết `AdminLayout` (Sidebar, Header, Khu vực nội dung) và `AuthLayout`.

---

## Phase 3: Triển khai các Module Chung (Core Features)

### 3.1. Module Authentication & User (Xác thực & Thành viên)
- [ ] **Backend:** Tạo Entity `User`, viết `IdentityService` xử lý cấp phát JWT + quay vòng Refresh Token (lưu bảo mật).
- [ ] **Frontend:** Tạo `auth` feature, viết màn hình Login, `AuthContext` quản lý trạng thái, viết Route Guard (`ProtectedRoute`).

### 3.2. Module Role & Permission (Phân quyền động)
- [ ] **Backend:** Tạo bảng `Role`, `Permission`, `RolePermission`. Viết custom `PermissionRequirement` và `[HasPermission("String")]` attribute.
- [ ] **Frontend:** Tạo trang quản lý danh sách Nhóm quyền và phân quyền trực quan. Viết component `<HasPermission name="..." />` để ẩn/hiện nút bấm động.

### 3.3. Module System Setting & Audit Log (Cấu hình & Lịch sử)
- [ ] **Backend:** Tạo bảng `SystemSettings` dùng kiểu dữ liệu `JSONB`. Viết API đọc/ghi cấu hình động.
- [ ] **Frontend:** Tạo trang Cài đặt cấu hình hệ thống (tự map JSON ra Form). Tạo trang tra cứu lịch sử tác động (Audit Log Viewer).

### 3.4. Module Notification & File Storage (Thông báo & Lưu trữ)
- [ ] **Backend:** Tạo SignalR Hub để đẩy thông báo realtime. Viết `SupabaseStorageService` bọc chuẩn kết nối S3 để upload file lên Cloud 0đ.
- [ ] **Frontend:** Thêm component "Quả chuông thông báo" realtime trên thanh Header. Tạo UI component `AvatarUploader` và `FileDropzone`.

---

## Phase 4: Đóng gói Template & Kiểm tra Deploy (0đ)

- [ ] Viết file `Dockerfile` đa tầng (Multi-stage) tối ưu dung lượng cho Backend .NET 9.
- [ ] Viết file cấu hình GitHub Actions hoàn chỉnh cho CI/CD tự động.
- [ ] Deploy thử nghiệm hệ thống chạy thực tế với chi phí 0đ (FE lên Vercel, BE lên Render, DB lên Supabase).
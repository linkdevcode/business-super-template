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
  - [x] Kiểm tra kết nối database từ môi trường local.s

---

## Phase 2: Thiết lập Tầng Lõi Cơ Bản (Core Infrastructure)

### Backend (.NET 9)

* [x] **2.1. Tầng Core (Domain & Contracts Lõi)**
* [x] Tạo `Template.Core/Common/Interfaces/ISoftDelete.cs` định nghĩa cơ chế đánh dấu xóa mềm.
* [x] Tạo `Template.Core/Common/Models/BaseEntity.cs` tích hợp `Id: Guid`, `CreatedAt`, `UpdatedAt`, `DeletedAt` và kế thừa `ISoftDelete`.
* [x] Tạo các Wrapper Model chuẩn hóa Object trả về đồng bộ cho API:
* [x] `Template.Core/Common/Models/ApiResponse.cs` (Cấu trúc: `IsSuccess`, `Data`, `Message`, `Errors`).
* [x] `Template.Core/Common/Models/PagedResponse.cs` (Cấu trúc: `Items`, `PageNumber`, `PageSize`, `TotalRecords`, `TotalPages`).


* [x] Tạo Entity `AuditLog.cs` ở tầng Core để định nghĩa cấu trúc lưu vết database lịch sử tác động (Ai sửa, Sửa bảng nào, Record nào, Giá trị Cũ [JSONB] vs Giá trị Mới [JSONB]).
* [x] Tạo các interface nền tảng: `Template.Core/Common/Interfaces/IBaseRepository.cs` và `Template.Core/Common/Interfaces/IUnitOfWork.cs`.
* [x] Giữ toàn bộ entity và contract ở Core theo hướng persistence-ignorant, không phụ thuộc EF Core.


* [x] **2.2. Tầng Infrastructure (Hạ tầng & Data)**
* [x] Tạo `Template.Infrastructure/Persistence/AppDbContext.cs` kết nối PostgreSQL qua EF Core.
* [x] Tạo `Template.Infrastructure/Persistence/Configurations/` để cấu hình map Entity (bao gồm cả bảng `AuditLogs`) bằng Fluent API, không dùng data annotation.
* [x] Override `SaveChangesAsync()` xử lý tập trung tự động:
* [x] Cào `ChangeTracker` phát hiện trạng thái để tự động điền `CreatedAt` / `UpdatedAt`.
* [x] Chuyển trạng thái `EntityState.Deleted` thành cập nhật `DeletedAt` và ẩn đi (Soft Delete).
* [x] Tự động bóc tách giá trị cũ và mới của các trường bị thay đổi để ghi thêm một bản ghi lịch sử vào bảng `AuditLogs`.


* [x] Áp dụng Global Query Filter trên DbContext để tự động loại bỏ các bản ghi đã bị Soft Delete khỏi tất cả các câu lệnh truy vấn thông thường.
* [x] Triển khai `Template.Infrastructure/Persistence/Repositories/BaseRepository.cs` hỗ trợ đầy đủ các hàm CRUD kết hợp phân trang, lọc, sắp xếp server-side bằng `IQueryable`. Ép tất cả các hàm Đọc dữ liệu mặc định dùng `.AsNoTracking()`.
* [x] Chuẩn bị class/extension để đăng ký Dependency Injection (DI) tập trung cho DbContext, Repositories và UnitOfWork.


* [x] **2.3. Tầng API (Cổng chạy)**
* [x] Viết `Template.API/Middleware/GlobalExceptionMiddleware.cs` để bắt và xử lý mọi Exception tập trung. Toàn bộ lỗi trả về cho UI bắt buộc phải bọc trong định dạng `ApiResponse<object>`.
* [x] Viết lớp abstract `Template.API/CoreFeatures/BaseController.cs` dùng chung cho CRUD generic sử dụng các Wrapper Response (`ApiResponse` / `PagedResponse`).
* [x] Chuẩn hóa các endpoint CRUD mẫu: `GetAll` (nhận tham số paging/filter/sort), `GetById`, `Create`, `Update`, `Delete`.
* [x] Giữ controllers thật mỏng: chỉ bind request, gọi use case/handler/repository, format response và làm entry point cho authorization.
* [x] Cấu hình `Program.cs` theo đúng bootstrap order: Environment → Config → Database → Auth → Application.



---

### Frontend (React + TS)

* [ ] **2.4. Cấu hình Core & HTTP Client**
* [ ] Cài đặt các package nền tảng: `axios`, `react-router-dom`, `@tanstack/react-query`, `tailwindcss`.
* [ ] Tạo `frontend/src/shared/http/axiosClient.ts` cấu hình các Interceptors:
* [ ] **Request Interceptor:** Tự động đính kèm Access Token lấy từ App Memory (React State) vào Header của mỗi request.
* [ ] **Response Interceptor (Bắt lỗi 401):** Tự động gọi API đổi token mới bằng Refresh Token (Lưu tại HttpOnly Cookie). Nếu lấy thành công, thử lại request cũ.
* [ ] **Xử lý Ngắt chuỗi (Logout đồng bộ):** Nếu API đổi token thất bại hoặc Refresh Token hết hạn, tự động xóa sạch Auth State trong Memory và đẩy người dùng (`window.location.href`) trực tiếp về màn hình `/login`.


* [ ] Tạo `frontend/src/app/providers.tsx` để bọc `QueryClientProvider` (TanStack Query) và các provider toàn cục của ứng dụng.
* [ ] Cấu hình `frontend/src/shared/config/` để bọc an toàn và ép kiểu chặt chẽ (Strongly-typed) cho các biến môi trường `import.meta.env` có tiền tố `VITE_*`.


* [ ] **2.5. Khởi tạo Khung UI & Layout**
* [ ] Tích hợp `shadcn/ui` và tạo sẵn các UI component dùng chung cốt lõi: `Button`, `Input`, `Table`, `Dialog`.
* [ ] Tạo siêu component dùng chung `<DataTable />` dựa trên TanStack Table kết hợp chặt chẽ với các hooks của TanStack Query để tự động handle việc hiển thị dữ liệu phân trang, lọc, sắp xếp từ Backend trả về.
* [ ] Viết `frontend/src/app/layouts/AdminLayout.tsx` gồm Sidebar, Header (có khu vực hiển thị Avatar, Quả chuông thông báo) và vùng render nội dung chính (`<Outlet />`).
* [ ] Viết `frontend/src/app/layouts/AuthLayout.tsx` bọc khung giao diện gọn sạch chuyên biệt cho các màn hình đăng nhập, khôi phục mật khẩu.
* [ ] Chuẩn bị file `frontend/src/app/router.tsx` cấu hình React Router chia rõ các nhóm Route: Public Route, Protected Route (Yêu cầu đăng nhập), và Permission Protected Route (Yêu cầu check chuỗi quyền PascalCase).
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
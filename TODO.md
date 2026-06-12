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

* [x] **2.4. Cấu hình Core & HTTP Client**
* [x] Cài đặt các package nền tảng: `axios`, `react-router-dom`, `@tanstack/react-query`, `tailwindcss`.
* [x] Tạo `frontend/src/shared/http/axiosClient.ts` cấu hình các Interceptors:
* [x] **Request Interceptor:** Tự động đính kèm Access Token lấy từ App Memory (React State) vào Header của mỗi request.
* [x] **Response Interceptor (Bắt lỗi 401):** Tự động gọi API đổi token mới bằng Refresh Token (Lưu tại HttpOnly Cookie). Nếu lấy thành công, thử lại request cũ.
* [x] **Xử lý Ngắt chuỗi (Logout đồng bộ):** Nếu API đổi token thất bại hoặc Refresh Token hết hạn, tự động xóa sạch Auth State trong Memory và đẩy người dùng (`window.location.href`) trực tiếp về màn hình `/login`.


* [x] Tạo `frontend/src/app/providers.tsx` để bọc `QueryClientProvider` (TanStack Query) và các provider toàn cục của ứng dụng.
* [x] Cấu hình `frontend/src/shared/config/` để bọc an toàn và ép kiểu chặt chẽ (Strongly-typed) cho các biến môi trường `import.meta.env` có tiền tố `VITE_*`.


* [x] **2.5. Khởi tạo Khung UI & Layout**
* [x] Tích hợp `shadcn/ui` và tạo sẵn các UI component dùng chung cốt lõi: `Button`, `Input`, `Table`, `Dialog`.
* [x] Tạo siêu component dùng chung `<DataTable />` dựa trên TanStack Table kết hợp chặt chẽ với các hooks của TanStack Query để tự động handle việc hiển thị dữ liệu phân trang, lọc, sắp xếp từ Backend trả về.
* [x] Viết `frontend/src/app/layouts/AdminLayout.tsx` gồm Sidebar, Header (có khu vực hiển thị Avatar, Quả chuông thông báo) và vùng render nội dung chính (`<Outlet />`).
* [x] Viết `frontend/src/app/layouts/AuthLayout.tsx` bọc khung giao diện gọn sạch chuyên biệt cho các màn hình đăng nhập, khôi phục mật khẩu.
* [x] Chuẩn bị file `frontend/src/app/router.tsx` cấu hình React Router chia rõ các nhóm Route: Public Route, Protected Route (Yêu cầu đăng nhập), và Permission Protected Route (Yêu cầu check chuỗi quyền PascalCase).
---

## Phase 3: Triển khai các Module Chung (Core Features)

### 3.1. Module Authentication & User (Platform Feature)
- [ ] **Backend**
  - [ ] Tạo `backend/Template.Core/Features/Auth/` cho orchestration, commands, queries và contracts của auth.
  - [ ] Tạo `backend/Template.API/CoreFeatures/Auth/` cho HTTP entry point: login, refresh, logout, current user.
  - [ ] Tạo `backend/Template.Infrastructure/Auth/` cho `IdentityService` xử lý cấp phát JWT và quản lý Token mã hóa.
  - [ ] Dùng user nghiệp vụ từ bảng `users`, không tạo model auth tách rời.
  - [ ] Xử lý `JWT access token` (In-memory), `refresh token rotation` (Secure HttpOnly Cookie), `revocation`, và session security.
  - [ ] Giữ auth provider ở dạng abstraction, không phụ thuộc SDK cụ thể ở Core.
- [ ] **Frontend**
  - [ ] Tạo `frontend/src/features/auth/` theo cấu trúc `components/`, `pages/`, `hooks/`, `api/`, `schemas/`, `types/`.
  - [ ] Viết các màn hình `Login`, `Logout` và flow tự động thiết lập lại phiên (refresh session).
  - [ ] Dùng auth store/context và các current-user utilities để giữ state trong memory (React State).
  - [ ] Viết route guard cho `ProtectedRoute`, `PublicRoute` và các nhánh redirect.
  - [ ] Dùng `axiosClient` ở Phase 2.4 để đính kèm access token và tự động xử lý refresh token khi bắt gặp lỗi 401.

### 3.2. Module Role & Permission (RBAC)
- [ ] **Backend**
  - [ ] Tạo feature slices riêng cho `Role` và `Permission` trong `Template.Core`, `Template.Infrastructure`, `Template.API`.
  - [ ] Map các bảng `roles`, `permissions`, `user_roles`, `role_permissions` bằng EF Core Fluent API ở tầng Infrastructure.
  - [ ] Định nghĩa permission key thống nhất theo chuẩn PascalCase dot format (`Resource.Action`) như `User.Read`, `User.Create`, `AuditLog.View`.
  - [ ] Viết custom `PermissionRequirement` và `HasPermissionAttribute` để kiểm tra quyền hạn (Authorization) ở tầng Server.
  - [ ] Gắn authorization entry point ở controller/action theo chuẩn tường minh: `[HasPermission("User.Read")]`.
- [ ] **Frontend**
  - [ ] Tạo UI quản lý danh sách `Roles` và cấu hình tích chọn `Permissions` chi tiết cho từng Role.
  - [ ] Tạo React component `<HasPermission name="Resource.Action" />` để ẩn/hiện nút bấm, link điều hướng và UI action theo quyền.
  - [ ] Chuẩn bị UI gán nhóm quyền (Role) cho tài khoản người dùng (User).
  - [ ] Chỉ dùng permission ở Frontend cho mục đích tối ưu trải nghiệm UI/UX, không xem đó là nguồn kiểm soát quyền cuối cùng (luôn luôn validate lại ở Backend).

### 3.3. Module Master Data CRUD Standard
- [ ] **Backend**
  - [ ] Chuẩn hóa pattern CRUD cho các feature danh mục nền tảng: `Customer`, `Supplier`, `Employee`, `Product`.
  - [ ] Giữ controller mỏng, backend flow tuân thủ chặt chẽ: `Controller -> Handler / Use Case -> Repository Interface -> Repository Implementation -> Database`.
  - [ ] Bảo đảm các query danh sách (List/Read) bắt buộc dùng `.AsNoTracking()` và xử lý paging/filter/sort phía Server-side thông qua cú pháp trì hoãn `IQueryable`.
  - [ ] Áp dụng soft delete (`ISoftDelete`), ghi nhận nhật ký hệ thống và ép chặn quyền hạn theo chuẩn `[HasPermission("Customer.Read")]`.
- [ ] **Frontend**
  - [ ] Sử dụng cấu trúc thư mục `frontend/src/features/{feature-name}/` đồng bộ cho từng danh mục master data.
  - [ ] Trang danh sách dùng siêu component `<DataTable />`, form nghiệp vụ dùng `react-hook-form` + `zod` để validate dữ liệu từ Client.
  - [ ] Khai thác TanStack Query (`useQuery`, `useMutation`) để đồng bộ dữ liệu và tự động xóa cache (Invalidate queries) sau khi thay đổi dữ liệu.
  - [ ] Hiển thị thanh công cụ tìm kiếm nâng cao, bộ lọc trạng thái, phân trang mượt mà từ server.

### 3.4. Module Transaction (Nghiệp vụ Phức tạp)
- [ ] **Backend**
  - [ ] Triển khai các feature mang tính giao dịch / trạng thái cao: `Contract`, `Invoice`, `Order`.
  - [ ] Thiết kế thuộc tính `Status` và luồng dịch chuyển trạng thái (State Transition) rõ ràng; mọi hành động thay đổi trạng thái phải đi qua một Use Case / Command chuyên biệt.
  - [ ] Tách biệt các hành động `Submit`, `Approve`, `Reject`, `Cancel` thành các Use Case xử lý độc lập để kiểm soát logic chặt chẽ (Approval Flow).
  - [ ] Đưa toàn bộ business validation phức tạp vào Use Case, tuyệt đối không viết ở Controller, Hook hay Repository.
  - [ ] Tích hợp tệp đính kèm (Attachment) bằng cách lưu trữ liên kết khóa ngoại (Foreign Key) trỏ sang bảng `Files`, không lưu dữ liệu nhị phân (Binary/Blob) trực tiếp trong bảng nghiệp vụ.
  - [ ] Dùng permission theo PascalCase dot format như `Contract.Read`, `Contract.Create`, `Contract.Update`, `Contract.Delete`.
- [ ] **Frontend**
  - [ ] Tạo trang danh sách, trang chi tiết chuyên sâu (Detail Page), trang tạo mới/chỉnh sửa và bảng điều khiển phê duyệt (Approval Panel).
  - [ ] Tận dụng dữ liệu từ lịch sử hệ thống (Audit Log Timeline) để hiển thị lịch sử tác động trực quan trên trang chi tiết nghiệp vụ.
  - [ ] Giữ Custom Hooks frontend đóng vai trò điều phối luồng dữ liệu (Data & Mutation Orchestration), không chứa logic kiểm tra nghiệp vụ.

### 3.5. Module File Management (Lưu trữ Tệp tin 0đ)
- [ ] **Backend**
  - [ ] Tạo cấu trúc folder Feature `FileManagement` đồng bộ ở cả 3 tầng (`Core`, `Infrastructure`, `API`).
  - [ ] Thiết kế bảng `files` lưu trữ metadata độc lập; các bảng nghiệp vụ dùng `FileId` khóa ngoại hoặc bảng trung gian nếu là quan hệ một-nhiều.
  - [ ] Triển khai `IStorageProvider` abstraction ở tầng Core và viết cụ thể lớp triển khai `SupabaseStorageProvider` (S3 Compatible API) ở tầng Infrastructure phục vụ việc upload tệp tin lên mây với giá 0đ.
  - [ ] Áp dụng soft delete cho tệp tin, kiểm soát phân quyền hệ thống chặt chẽ bằng chuỗi dạng `File.Read`, `File.Create`, `File.Update`, `File.Delete`.
- [ ] **Frontend**
  - [ ] Tạo feature `file-management` quản lý các UI component dùng chung như `AvatarUploader` hoặc `FileDropzone`.
  - [ ] Xây dựng luồng tải lên/tải xuống tệp tin an toàn qua Axios client API, đảm bảo giao diện luôn hiển thị phần trăm tiến trình tải lên (Upload Progress Bar).
  - [ ] Tuyệt đối không nhúng hoặc gọi trực tiếp Storage Cloud SDK từ mã nguồn giao diện UI.

### 3.6. Module Notification (Real-time Thông báo)
- [ ] **Backend**
  - [ ] Thiết lập tính năng Real-time bằng cách tạo **ASP.NET Core SignalR Hub** (`NotificationHub`) tại tầng Infrastructure.
  - [ ] Triển khai các use case cốt lõi: `CreateNotification`, `MarkAsRead`, `MarkAllAsRead`, `GetMyNotifications`.
  - [ ] Định nghĩa bảng `notifications` lưu vết người nhận, nội dung, thực thể liên quan (`EntityType`, `EntityId`), trạng thái đọc (`IsRead`, `ReadAt`).
  - [ ] Tạo `IEmailProvider` abstraction ở tầng Core để chuẩn bị cho việc gửi email ngầm thông qua Background Task nếu cần.
- [ ] **Frontend**
  - [ ] Tạo feature `notification` xử lý giao diện "Quả chuông thông báo" trên thanh Header và trang danh sách thông báo tổng hợp.
  - [ ] Thiết lập kết nối SignalR Client (`@microsoft/signalr`) bọc trong một React Hook hoặc Context, tự động lắng nghe và kích hoạt thông báo Toast nhảy lên màn hình theo thời gian thực mà không cần reload trang.
  - [ ] Dùng permission theo PascalCase dot format như `Notification.Read` và `Notification.Update`.

### 3.7. Module Dashboard (Bảng Điều Khiển Tổng Quan)
- [ ] **Backend**
  - [ ] Triển khai Use Cases **chỉ-đọc (Read-only)** tổng hợp các số liệu kinh doanh: KPI tổng, biểu đồ tăng trưởng, danh sách hoạt động gần đây (Recent Activities).
  - [ ] Tối ưu hóa hiệu năng truy vấn bằng cách sử dụng các câu lệnh truy vấn tổng hợp (Aggregation), ép `.AsNoTracking()` toàn bộ và cấm thiết lập bất kỳ một luồng ghi (Write Flow) nào tại feature này.
- [ ] **Frontend**
  - [ ] Xây dựng các widget hiển thị thẻ số liệu (KPI Cards) bằng Shadcn UI và các biểu đồ nhẹ như `Recharts`.
  - [ ] Tạo dashboard feature theo hướng read-only, dùng polling/refetch khi cần để cập nhật dữ liệu nhẹ nhàng.
  - [ ] Dùng permission hiển thị khu vực dashboard theo chuẩn `Dashboard.View`.

### 3.8. Module Reporting (Xuất Bản Báo Cáo)
- [ ] **Backend**
  - [ ] Triển khai `IReportExportProvider` ở tầng Core, viết exporter ở Infrastructure theo hướng stream trực tiếp hoặc ghi file tạm để tránh giữ toàn bộ dữ liệu trong memory.
  - [ ] Với báo cáo nặng, ưu tiên trả về `Stream` từ backend hoặc sinh file tạm trên storage rồi trả link download cho Frontend.
  - [ ] Bắt buộc ghi nhận nhật ký hệ thống (Audit Log) cho các hành động kết xuất dữ liệu nhạy cảm này.
- [ ] **Frontend**
  - [ ] Thiết lập trang tra cứu và bộ lọc báo cáo đa dạng, tạo nút trigger gọi hành động export từ Backend.
  - [ ] Tiếp nhận liên kết file từ Backend trả về để tự động kích hoạt tiến trình tải xuống tệp tin trên trình duyệt của người dùng. Không tự sinh file trực tiếp từ Client side.
  - [ ] Dùng permission theo chuẩn `Report.View` và `Report.Export`.

### 3.9. Module System Settings & Audit Log Viewer
- [ ] **Backend**
  - [ ] Hoàn thiện bảng `system_settings` lưu cấu hình hệ thống bằng kiểu dữ liệu **JSONB**, viết API đọc/ghi và thực hiện validate cấu hình bằng Fluent Validation ở Application layer.
  - [ ] Mở API tra cứu lịch sử từ bảng `audit_logs` (đã được cào tự động từ Phase 2.2) hỗ trợ phân trang và tìm kiếm theo thực thể, người tác động.
- [ ] **Frontend**
  - [ ] Tạo trang Cấu hình hệ thống (System Settings Page) tự động ánh xạ cấu hình dạng JSON nhận từ API thành các trường nhập liệu trực quan.
  - [ ] Tạo trang Nhật ký hệ thống (Audit Log Viewer) hiển thị chi tiết lịch sử thay đổi dạng trước/sau (Before / After Data) thân thiện với quản trị viên.

---

## Phase 4: Đóng gói Template & Kiểm tra Deploy (0đ)

- [ ] **Backend deployment**
  - [ ] Viết file `Dockerfile` đa tầng (Multi-stage) cho Backend `.NET 9` theo chuẩn `build -> publish -> runtime`.
  - [ ] Cấu hình port, health check `/health`, và biến môi trường runtime theo đúng deployment rules.
  - [ ] Bảo đảm backend bootstrap theo đúng thứ tự: Environment -> Config -> Database -> Auth -> Application.
  - [ ] Kiểm tra chạy migration trước khi deploy và không phụ thuộc schema thủ công.
- [ ] **Frontend deployment**
  - [ ] Tạo luồng build production cho Vite SPA và xác nhận `frontend/src/app/main.tsx` bootstraps đúng theo router/providers.
  - [ ] Rà lại `import.meta.env` và các biến `VITE_*` để đảm bảo cấu hình deploy an toàn.
- [ ] **CI/CD**
  - [ ] Viết file cấu hình GitHub Actions cho pipeline kiểm tra build, test, lint và deploy.
  - [ ] Bảo đảm pipeline không hardcode secret, URL hoặc database connection.
- [ ] **Zero-cost deploy validation**
  - [ ] Deploy thử nghiệm FE lên Vercel hoặc Netlify.
  - [ ] Deploy thử nghiệm BE lên Render hoặc Railway bằng Docker.
  - [ ] Kết nối DB PostgreSQL được provision sẵn và xác minh ứng dụng chạy end-to-end.
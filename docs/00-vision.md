# My Super Template

## Mục tiêu

My Super Template là một bộ khung (starter template) dùng để phát triển nhanh các hệ thống quản lý nghiệp vụ cho doanh nghiệp.

Template không phục vụ mục tiêu xây dựng website SEO, landing page hoặc các công cụ đơn chức năng.

Template tập trung vào các ứng dụng quản trị nội bộ và SaaS B2B.

Ví dụ:

- Quản lý cho thuê nhà xưởng
- Quản lý tài sản
- Quản lý lớp học
- Quản lý cửa hàng
- Quản lý đào tạo nội bộ
- Quản lý khách hàng
- Quản lý bảo trì thiết bị
- Quản lý kho
- Quản lý nhân sự quy mô nhỏ

---

## Mục tiêu kỹ thuật

- Reusable — tái sử dụng được giữa các dự án khách hàng
- Modular — tổ chức theo feature/module độc lập
- Maintainable — dễ bảo trì, dễ đọc
- AI Friendly — cấu trúc dự đoán được cho AI code generation
- Cursor Friendly — rules và docs nhất quán cho Cursor Agent

---

## Nguyên tắc thiết kế

### 1. Feature First

Mọi nghiệp vụ phải được tổ chức theo **feature** (vertical slice), không tổ chức theo technical layer ở cấp toàn solution.

Không tổ chức theo:

- `pages/` hoặc `controllers/` ở root
- `services/` chung cho toàn bộ domain

ở cấp toàn dự án.

Mỗi feature phải độc lập và chứa toàn bộ logic nghiệp vụ của chính nó — trải dài từ API đến UI.

---

### 2. Business Logic Isolation

Business logic chỉ được phép nằm trong:

- **Backend:** `Template.Core/Features/{FeatureName}/` (handlers / use cases)
- **Frontend:** không chứa business logic — chỉ gọi API

Không được viết business logic trong:

- React Components / Pages
- API Controllers
- Repository implementations
- Hooks (frontend)

---

### 3. Infrastructure Independence

Business logic không phụ thuộc trực tiếp vào:

- EF Core
- Email provider cụ thể
- Storage provider cụ thể
- AI provider cụ thể

Mọi kết nối bên ngoài phải đi qua abstraction layer trong `Template.Infrastructure/`.

`Template.Core` không được reference `Template.Infrastructure`.

---

### 4. Future Multi Tenant Ready

Kiến trúc hiện tại:

**One Customer = One Database**

Mỗi khách hàng sử dụng một PostgreSQL database riêng. Tenant isolation đạt được bằng database isolation — không có `organization_id` ở cấp dữ liệu.

Hỗ trợ multi-tenant trong một database có thể được bổ sung trong tương lai, nhưng không thuộc phạm vi kiến trúc hiện tại.

---

### 5. Auditability

Mọi thay đổi dữ liệu quan trọng phải có khả năng ghi nhận lịch sử thay đổi (audit log).

---

### 6. Permission Driven

Không kiểm tra quyền bằng hardcode role name.

Mọi quyền truy cập phải được xác định thông qua permission key (ví dụ: `user:create`, `contract:approve`).

---

### 7. AI Ready

Kiến trúc phải cho phép tích hợp AI trong tương lai mà không cần thay đổi business logic hiện tại.

AI providers phải được bọc qua interface trong `Template.Infrastructure/AI/`.

---

## Công nghệ

### Backend

- .NET 9 Web API
- Hybrid Layered + Vertical Slice Architecture
- 3 projects: `Template.Core`, `Template.Infrastructure`, `Template.API`
- Controllers tổ chức theo feature trong `Template.API/CoreFeatures/`

### Frontend

- React 19+
- Vite (SPA)
- TypeScript
- Client-side routing (React Router)
- Tailwind CSS
- Shadcn UI

### Database

- PostgreSQL
- Entity Framework Core

### Validation

- **Backend:** FluentValidation (hoặc validation trong handler)
- **Frontend:** Zod

### Authentication

- Provider-agnostic abstraction
- Implementation trong `Template.Infrastructure/Auth/`

### Storage, Email, AI

- Abstraction trong `Template.Infrastructure/`
- Không hardcode provider trong business logic

---

## Mục tiêu sử dụng

Quy trình chuẩn:

```
Clone Template
↓
Thêm Feature Nghiệp Vụ (Backend + Frontend)
↓
Triển Khai
↓
Bàn Giao Hoặc Kinh Doanh
```

Không phát triển trực tiếp sản phẩm khách hàng trên repository template gốc.

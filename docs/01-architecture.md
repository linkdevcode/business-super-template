# System Architecture

> **Tài liệu kiến trúc canonical.** Mọi tài liệu và cursor rules khác phải tham chiếu tài liệu này khi có mâu thuẫn.

## Tổng quan

My Super Template sử dụng kiến trúc **Hybrid Layered + Vertical Slice**:

- **Layered:** tách rõ 3 project backend theo trách nhiệm kỹ thuật
- **Vertical Slice:** mỗi feature nghiệp vụ được tổ chức theo chiều dọc xuyên suốt các layer

Mỗi feature chịu trách nhiệm cho một nghiệp vụ cụ thể.

Ví dụ:

- User
- Role
- Permission
- Asset
- Contract
- Tenant

Mỗi feature phải chứa đầy đủ các thành phần liên quan tới nghiệp vụ của chính nó ở cả backend lẫn frontend.

---

# Solution Structure

```
backend/

├── Template.Core/           # Domain + Application logic
├── Template.Infrastructure/ # Persistence + External adapters
└── Template.API/            # HTTP entry point

frontend/
└── src/
    ├── app/
    ├── features/
    ├── shared/
    ├── lib/
    └── types/
```

---

# Tenant Model

Kiến trúc hiện tại:

**One Customer = One Database**

- Mỗi khách hàng được triển khai trên một PostgreSQL database riêng
- Không có `organization_id` ở cấp dữ liệu
- Không có bảng `organizations`
- Hỗ trợ multi-tenant trong một database là phạm vi tương lai, ngoài scope hiện tại

---

# Architectural Flow

## Backend (Business Features)

Mọi business feature backend phải tuân theo luồng:

```
Controller (Template.API/CoreFeatures/)
↓
Handler / Use Case (Template.Core/Features/)
↓
Repository Interface (Template.Core)
↓
Repository Implementation (Template.Infrastructure)
↓
Database
```

---

## Frontend (Business Features)

Mọi business feature frontend phải tuân theo luồng:

```
Page / Component
↓
Hook
↓
API Client
↓
Backend API (Template.API)
```

Feature code đặt tại `frontend/src/features/{feature-name}/`.

---

## Auth Feature (Platform Exception)

Auth là **platform feature** — không tuân theo đầy đủ pattern business feature slice.

**Backend:**

```
Template.API/CoreFeatures/Auth/
Template.Core/Features/Auth/
Template.Infrastructure/Auth/
```

**Frontend:**

```
frontend/src/features/auth/
```

Auth module không được phụ thuộc trực tiếp vào bất kỳ auth provider cụ thể nào ở tầng Core.

---

# Layer Responsibilities

## API Layer (Template.API)

Chứa:

- Controllers trong `CoreFeatures/{FeatureName}/`
- Middleware, filters
- DI composition (`Program.cs`)

Nhiệm vụ:

- Nhận HTTP request
- Map request sang command/query
- Gọi handler
- Trả response

Không chứa:

- Business logic
- Truy vấn database trực tiếp

---

## Application Layer (Template.Core)

Đây là nơi **duy nhất** được phép chứa business logic.

Chứa:

- Domain entities
- Commands / Queries
- Handlers (use cases)
- Repository interfaces
- Service interfaces

Ví dụ:

```
CreateUserHandler
InviteUserHandler
CreateContractHandler
ApproveLeaveRequestHandler
```

Handler chịu trách nhiệm:

- Kiểm tra nghiệp vụ
- Kiểm tra permission (khi cần)
- Điều phối repositories
- Ghi audit log (khi cần)

Không chứa:

- EF Core code
- HTTP concerns
- SDK calls trực tiếp

---

## Infrastructure Layer (Template.Infrastructure)

Chứa:

- `AppDbContext` và entity configurations
- Repository implementations
- External service adapters

Ví dụ:

```
Template.Infrastructure/Auth/
Template.Infrastructure/Email/
Template.Infrastructure/Storage/
Template.Infrastructure/AI/
```

Repository chịu trách nhiệm:

- Query database
- Insert
- Update
- Delete

Repository **không được** chứa business logic.

---

## Page / Component Layer (Frontend)

Chứa:

- Pages
- Components
- Forms

Nhiệm vụ:

- Hiển thị dữ liệu
- Thu thập input từ người dùng

Không chứa:

- Business logic
- Truy cập database

---

## Hook Layer (Frontend)

Chứa:

- State management
- Data fetching qua API client
- Mutation orchestration

Nhiệm vụ:

- Kết nối UI với backend API
- Quản lý loading / error state

Không chứa:

- Business logic
- Truy cập database

---

# Source Structure

## Backend

```
Template.Core/
├── Entities/
├── Features/
│   └── {FeatureName}/
│       ├── Commands/
│       ├── Queries/
│       ├── Handlers/
│       └── Interfaces/
└── Common/

Template.Infrastructure/
├── Persistence/
├── Features/
│   └── {FeatureName}/
│       └── Repositories/
├── Auth/
├── Email/
├── Storage/
└── AI/

Template.API/
├── CoreFeatures/
│   └── {FeatureName}/
│       └── {FeatureName}Controller.cs
├── Middleware/
└── Program.cs
```

## Frontend

```
frontend/src/

app/           # Routing shell, providers
features/      # Business features
shared/        # Shared UI và utilities
lib/           # Generic helpers
types/         # Global types
```

---

# Business Feature Structure

## Backend Feature Slice

```
Template.Core/Features/Users/
├── Commands/
│   └── CreateUserCommand.cs
├── Queries/
│   └── GetUsersQuery.cs
├── Handlers/
│   ├── CreateUserHandler.cs
│   └── GetUsersHandler.cs
└── Interfaces/
    └── IUserRepository.cs

Template.Infrastructure/Features/Users/
└── Repositories/
    └── UserRepository.cs

Template.API/CoreFeatures/Users/
└── UsersController.cs
```

Không tạo `Services/` cho business logic trong feature slice.

---

## Frontend Feature Slice

```
features/user/

components/
pages/
hooks/
api/
schemas/
types/
index.ts
```

---

# Shared Layer

**Frontend:** `frontend/src/shared/` — chỉ chứa code dùng chung, không có business logic.

**Backend:** `Template.Core/Common/` — exceptions, base interfaces, shared models.

Shared không được chứa business logic nghiệp vụ.

---

# Dependency Rule

Được phép:

```
Template.API → Template.Core
Template.Infrastructure → Template.Core
Frontend Hook → API Client → Backend API
```

Không được phép:

```
Template.Core → Template.Infrastructure
Template.Core → Template.API
Repository → Controller (bỏ qua handler)
Frontend → Database
Page/Hook → Repository
```

---

# Database Access Rule

Không được query database trực tiếp từ:

- Controller
- Frontend page, component, hook

Mọi truy cập database phải đi qua:

```
IRepository (Core) → Repository (Infrastructure) → DbContext
```

---

# Business Logic Rule

Business logic chỉ được phép nằm trong:

```
Template.Core/Features/{FeatureName}/Handlers/
```

Ví dụ:

- ✓ `CreateContractHandler`
- ✓ `CalculateInvoiceHandler`
- ✗ `ContractsController`
- ✗ `UserRepository`
- ✗ `useContracts.ts` (frontend hook)

---

# AI Integration Rule

Mọi AI provider phải được bọc thông qua interface trong `Template.Infrastructure/AI/`.

Không gọi trực tiếp SDK AI trong business handler.

---

# Audit Log Rule

Các hành động thay đổi dữ liệu quan trọng phải có khả năng ghi log:

- Create
- Update
- Delete
- Approve / Reject (khi áp dụng)

---

# Naming Convention

| Layer | Pattern | Ví dụ |
|-------|---------|-------|
| Handler | `{Verb}{Entity}Handler` | `CreateUserHandler` |
| Command | `{Verb}{Entity}Command` | `CreateUserCommand` |
| Repository (interface) | `I{Entity}Repository` | `IUserRepository` |
| Repository (impl) | `{Entity}Repository` | `UserRepository` |
| Controller | `{Entity}Controller` | `UsersController` |
| Frontend component | PascalCase | `UserForm` |
| Frontend hook | camelCase | `useUsers` |
| Frontend API client | camelCase | `userApi` |
| Frontend schema | camelCase | `createUserSchema` |

---

# Architecture Goal

- Dễ bảo trì
- Dễ mở rộng theo feature
- Cursor Friendly
- AI Friendly
- Reusable giữa các dự án khách hàng
- Predictable — developer và AI luôn biết file nằm ở đâu

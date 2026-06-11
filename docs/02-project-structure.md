# Project Structure

## Mục tiêu

Định nghĩa cấu trúc thư mục chuẩn cho toàn bộ My Super Template trên stack **.NET 9 Web API + React Vite SPA**.

Mọi feature mới phải tuân theo cấu trúc này.

---

# Root Structure

```
business-os-template/

├── .cursor/
├── docs/
├── backend/
│   ├── Template.Core/
│   ├── Template.Infrastructure/
│   └── Template.API/
├── frontend/
│   └── src/
│       ├── app/
│       ├── features/
│       ├── shared/
│       ├── lib/
│       └── types/
├── database/
├── tests/
├── scripts/
├── .env.example
├── Template.sln
└── README.md
```

---

# Directory Responsibilities

## .cursor

Chứa rule dành cho Cursor Agent.

```
.cursor/
└── rules/
    ├── architecture.mdc
    ├── project-structure.mdc
    ├── development-conventions.mdc
    └── ...
```

---

## docs

Chứa toàn bộ tài liệu dự án.

```
docs/
├── 00-vision.md
├── 01-architecture.md
├── 02-project-structure.md
├── 03-development-conventions.md
└── ROADMAP.md
```

---

## database

Chứa schema reference, seed scripts, và tài liệu liên quan database.

```
database/
├── schema/
├── migrations/    # reference hoặc SQL migrations thủ công
└── seeds/
```

> EF Core migrations được generate vào `Template.Infrastructure/Persistence/Migrations/` khi dùng tooling.

---

## tests

Unit test và integration test.

```
tests/
├── Template.Core.Tests/
├── Template.Infrastructure.Tests/
├── Template.API.Tests/
└── frontend/
```

---

## scripts

Script hỗ trợ phát triển.

```
scripts/
├── generate-feature.ps1
└── seed-data.ps1
```

---

# Backend Structure

## Template.Core

Domain và application logic. **Không** reference Infrastructure hay API.

```
Template.Core/

├── Entities/
│   ├── User.cs
│   └── Role.cs
├── Features/
│   └── Users/
│       ├── Commands/
│       │   └── CreateUserCommand.cs
│       ├── Queries/
│       │   └── GetUsersQuery.cs
│       ├── Handlers/
│       │   ├── CreateUserHandler.cs
│       │   └── GetUsersHandler.cs
│       └── Interfaces/
│           └── IUserRepository.cs
├── Common/
│   ├── Exceptions/
│   ├── Interfaces/
│   └── Models/
└── Template.Core.csproj
```

---

## Template.Infrastructure

Persistence và external integrations.

```
Template.Infrastructure/

├── Persistence/
│   ├── AppDbContext.cs
│   ├── Configurations/
│   │   └── UserConfiguration.cs
│   └── Migrations/
├── Features/
│   └── Users/
│       └── Repositories/
│           └── UserRepository.cs
├── Auth/
├── Email/
├── Storage/
├── AI/
├── DependencyInjection.cs
└── Template.Infrastructure.csproj
```

---

## Template.API

HTTP entry point. Controllers tổ chức theo feature.

```
Template.API/

├── CoreFeatures/
│   ├── Users/
│   │   └── UsersController.cs
│   ├── Roles/
│   │   └── RolesController.cs
│   └── Auth/
│       └── AuthController.cs
├── Middleware/
├── Extensions/
├── Program.cs
├── appsettings.json
└── Template.API.csproj
```

Không đặt business logic trong `Template.API/`.

---

# Frontend Structure

Location: `frontend/`

```
frontend/

├── public/
├── src/
│   ├── app/
│   ├── features/
│   ├── shared/
│   ├── lib/
│   └── types/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## App Layer

Chỉ chứa application shell và routing.

```
frontend/src/app/

main.tsx
App.tsx
router.tsx        # hoặc routes/
providers.tsx
```

Ví dụ route map:

```
/dashboard
/users
/settings
/login
```

Không đặt business logic trong `app/`.

---

## Features Layer

Đây là nơi chứa toàn bộ nghiệp vụ frontend.

```
src/features/

auth/
user/
role/
permission/
audit-log/
```

Mỗi feature phải độc lập.

---

## Standard Business Feature Structure (Frontend)

Business feature tuân theo luồng:

```
Page → Hook → API Client → Backend API
```

```
features/{feature-name}/

components/
pages/
hooks/
api/
schemas/
types/
index.ts
```

Ví dụ:

```
features/user/

components/
  UserForm.tsx
  UserTable.tsx
pages/
  UsersPage.tsx
  UserDetailPage.tsx
hooks/
  useUsers.ts
  useCreateUser.ts
api/
  userApi.ts
schemas/
  createUserSchema.ts
  updateUserSchema.ts
types/
  user.ts
  create-user-input.ts
index.ts
```

Không tạo `services/` cho business logic trong feature.

---

## Auth Feature Structure (Platform Exception)

Auth là platform feature.

```
features/auth/

components/
pages/
hooks/
api/
schemas/
types/
index.ts
```

**Backend tương ứng:**

```
Template.API/CoreFeatures/Auth/
Template.Core/Features/Auth/
Template.Infrastructure/Auth/
```

---

## Shared Layer

Code dùng chung giữa các feature.

```
frontend/src/shared/

components/
hooks/
utils/
constants/
validators/
config/
```

Ví dụ:

```
shared/components/
  data-table/
  page-header/
  empty-state/
  confirm-dialog/
```

Không chứa business logic.

---

## Lib Layer

Helper functions generic.

```
frontend/src/lib/

format-currency.ts
format-date.ts
```

Không chứa business logic nghiệp vụ.

---

## Types Layer

Global TypeScript types.

```
frontend/src/types/

api.ts
common.ts
```

---

# Feature Placement Rules

## Nếu là nghiệp vụ

**Backend:**

```
Template.Core/Features/{FeatureName}/
Template.Infrastructure/Features/{FeatureName}/
Template.API/CoreFeatures/{FeatureName}/
```

**Frontend:**

```
src/features/{feature-name}/
```

Ví dụ: Contract, Asset, Tenant, Student

---

## Nếu dùng chung nhiều feature

**Frontend:** `frontend/src/shared/`

**Backend:** `Template.Core/Common/`

Ví dụ: DataTable, Modal, Loading Spinner

---

## Nếu kết nối bên ngoài

**Backend:** `Template.Infrastructure/{Integration}/`

Ví dụ: Auth, Email, Storage, AI

Không đặt trong Core hay API trực tiếp.

---

# Folder Creation Rule

Không tạo folder trước khi cần.

Ví dụ — không tạo:

```
features/crm/
features/inventory/
features/booking/
```

nếu chưa có nghiệp vụ tương ứng.

Chỉ tạo feature khi nghiệp vụ xuất hiện.

---

# Initial Features

Template ban đầu chỉ bao gồm:

**Backend + Frontend:**

- auth
- user
- role
- permission
- audit-log

---

# Goal

- Dễ tìm code theo feature
- Dễ mở rộng vertical slice
- Dễ onboarding developer mới
- Cursor Agent có thể dự đoán vị trí file
- Tránh spaghetti architecture
- Tách biệt rõ backend API và frontend SPA

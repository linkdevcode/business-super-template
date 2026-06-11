# Development Conventions

## Mục tiêu

Tài liệu này định nghĩa các quy tắc phát triển phần mềm cho My Super Template trên stack **.NET 9 + React Vite SPA**.

Mọi source code mới được tạo bởi developer hoặc AI Assistant phải tuân thủ các convention bên dưới.

---

# General Principles

## Simplicity First

Ưu tiên giải pháp đơn giản.

Không tạo abstraction khi chưa có nhu cầu thực tế.

Không tối ưu sớm.

Không over-engineering.

---

## Consistency Over Preference

Tính nhất quán quan trọng hơn sở thích cá nhân.

Nếu project đã có convention thì phải tuân thủ convention hiện có.

---

## Predictable Structure

Developer và AI phải luôn dự đoán được:

- File nằm ở đâu
- Logic nằm ở đâu
- Dữ liệu đi như thế nào (UI → API → Handler → Repository → DB)

---

# Naming Convention Overview

| Ngôn ngữ | Class / Type / Component | Method / Function / Variable |
|----------|--------------------------|------------------------------|
| C# | PascalCase | PascalCase (method), camelCase (param/local) |
| TypeScript | PascalCase (type/component) | camelCase |

---

# Backend File Naming (C#)

File C# sử dụng **PascalCase**, trùng tên với type chính:

```
CreateUserHandler.cs
CreateUserCommand.cs
UserRepository.cs
UsersController.cs
IUserRepository.cs
```

Không sử dụng:

```
create-user-handler.cs
user_repository.cs
```

---

# Frontend File Naming (TypeScript)

Component file — **PascalCase**:

```
UserForm.tsx
UsersPage.tsx
CreateUserDialog.tsx
```

Non-component file — **camelCase**:

```
userApi.ts
useUsers.ts
createUserSchema.ts
user.ts
```

---

# Symbol Naming Convention

## C# (Backend)

```csharp
// Class, record, interface — PascalCase
public class CreateUserHandler { }
public interface IUserRepository { }

// Method — PascalCase
public async Task<User> ExecuteAsync(CreateUserCommand command) { }

// Property — PascalCase
public string FullName { get; set; }

// Private field — _camelCase
private readonly IUserRepository _userRepository;

// Parameter, local — camelCase
public void Process(Guid userId) { }
```

---

## TypeScript (Frontend)

```ts
// Component, type, interface — PascalCase
export function UserForm() { }
type CreateUserInput = { ... }

// Function, variable, hook — camelCase
export function useUsers() { }
const userList = await getUsers();
```

---

# Feature Convention

## Backend Feature Slice

Mỗi **business feature** backend phải có cấu trúc:

```
Template.Core/Features/{FeatureName}/
├── Commands/
├── Queries/
├── Handlers/
└── Interfaces/

Template.Infrastructure/Features/{FeatureName}/
└── Repositories/

Template.API/CoreFeatures/{FeatureName}/
└── {FeatureName}Controller.cs
```

Luồng chuẩn:

```
Controller → Handler → Repository Interface → Repository Implementation → Database
```

---

## Frontend Feature Slice

Mỗi **business feature** frontend phải có cấu trúc:

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

Luồng chuẩn:

```
Page → Hook → API Client → Backend API
```

---

## Business Logic Placement

Business logic chỉ được phép nằm trong:

```
Template.Core/Features/{FeatureName}/Handlers/
```

Không tạo:

```
Services/   # cho business logic trong feature slice
```

---

## Auth Feature Exception

`auth` là **platform feature** — không bắt buộc tuân theo đầy đủ cấu trúc business feature.

**Backend:**

```
Template.API/CoreFeatures/Auth/
Template.Core/Features/Auth/
Template.Infrastructure/Auth/
```

**Frontend:**

```
features/auth/

components/
pages/
hooks/
api/
schemas/
types/
```

Auth không được phụ thuộc trực tiếp vào auth provider cụ thể ở tầng Core.

---

# Controller Convention (Backend)

Tên controller:

```
{Entity}Controller
```

Ví dụ:

```csharp
UsersController
ContractsController
RolesController
```

Vị trí:

```
Template.API/CoreFeatures/Users/UsersController.cs
```

Controller chịu trách nhiệm:

- Nhận HTTP request
- Map sang command/query
- Gọi handler
- Trả `ActionResult<T>` hoặc `IResult`

Controller **không được** chứa business logic.

---

# Handler Convention (Backend)

Tên handler:

```
{Verb}{Entity}Handler
```

Ví dụ:

```csharp
CreateUserHandler
UpdateContractHandler
DeleteAssetHandler
```

Command / Query:

```csharp
CreateUserCommand
GetUserByIdQuery
```

Handler là nơi duy nhất được phép chứa business logic trên backend.

Ví dụ trách nhiệm:

- Kiểm tra quyền
- Kiểm tra trạng thái nghiệp vụ
- Tính toán nghiệp vụ
- Điều phối repositories
- Ghi audit log

---

# Repository Convention (Backend)

Interface (Core):

```
I{Entity}Repository
```

Implementation (Infrastructure):

```
{Entity}Repository
```

Ví dụ:

```csharp
IUserRepository
UserRepository
```

Repository chịu trách nhiệm:

- Select
- Insert
- Update
- Delete

Repository **không được**:

- Tính toán nghiệp vụ
- Kiểm tra business rule

---

# Component Convention (Frontend)

## Local Component

Nếu chỉ sử dụng trong một feature:

```
features/user/components/UserForm.tsx
```

## Shared Component

Nếu sử dụng từ hai feature trở lên:

```
shared/components/DataTable/
shared/components/ConfirmDialog/
```

---

# Hook Convention (Frontend)

Tên hook:

```
use{Entities}
use{Verb}{Entity}
```

Ví dụ:

```ts
useUsers
useCreateUser
useUpdateUser
```

File:

```
useUsers.ts
useCreateUser.ts
```

Hook chịu trách nhiệm:

- State management
- Data fetching qua API client
- Mutation orchestration
- Trả dữ liệu cho Page/Component

Hook **không được**:

- Chứa business logic
- Truy cập database trực tiếp

---

# API Client Convention (Frontend)

File:

```
{entity}Api.ts
```

Ví dụ:

```ts
// features/user/api/userApi.ts
export async function getUsers(): Promise<User[]> { ... }
export async function createUser(input: CreateUserInput): Promise<User> { ... }
```

Function sử dụng **camelCase**.

API client gọi endpoint từ `Template.API` — không bypass backend.

---

# Command & Query Convention

## Command (thay đổi dữ liệu)

Ví dụ: Create, Update, Delete, Approve, Reject

Luồng backend:

```
Controller → Command → Handler → Repository → Database
```

Luồng frontend:

```
Page → Hook → API Client → Controller
```

---

## Query (đọc dữ liệu)

Ví dụ: Get User, Get Roles, Get Notifications

Luồng backend:

```
Controller → Query → Handler → Repository → Database
```

Luồng frontend:

```
Page → Hook → API Client → Controller
```

Không bắt buộc tạo handler riêng cho query đơn giản, nhưng vẫn phải đi qua repository — không query trực tiếp từ controller.

---

# Schema Convention (Frontend)

Sử dụng **Zod**.

Tên schema — **camelCase**:

```
createUserSchema
updateUserSchema
createContractSchema
```

Validation không được khai báo trực tiếp trong component.

---

# Validation Convention (Backend)

Sử dụng **FluentValidation** hoặc validation trong handler.

Validator đặt cùng feature slice:

```
Template.Core/Features/Users/Validators/
  CreateUserCommandValidator.cs
```

---

# Type Convention

## Entity (Backend — C#)

```csharp
User
Role
Contract
```

## Command / Query Input (Backend)

```csharp
CreateUserCommand
UpdateUserCommand
GetUsersQuery
```

## Input (Frontend)

```ts
CreateUserInput
UpdateUserInput
```

## DTO / Response

Chỉ sử dụng khi có mapping thực sự.

```csharp
UserDto        // backend
```

```ts
UserResponse   // frontend
```

Không tạo DTO nếu chỉ copy dữ liệu từ database ra UI mà không có transformation.

---

# Database Access Convention

Không truy cập database trực tiếp từ:

```
Controller
Frontend Page / Component / Hook
```

Mọi truy cập dữ liệu phải đi qua:

```
IRepository (Core) → Repository (Infrastructure) → DbContext
```

---

# Infrastructure Convention

Mọi tích hợp bên ngoài phải đặt trong:

```
Template.Infrastructure/
```

Ví dụ:

```
Auth/
Email/
Storage/
AI/
```

---

# Service Convention

External adapter service chỉ được phép tồn tại trong:

```
Template.Infrastructure/
```

Ví dụ:

```csharp
EmailService
StorageService
AiService
```

Không tạo:

```csharp
UserService
ContractService
TenantService
```

Business logic thuộc `Handlers/` — không tạo `Services/` cho domain logic.

---

# Import Convention

## Frontend

Sử dụng alias:

```ts
@/features
@/shared
@/lib
@/types
```

Không sử dụng import tương đối nhiều cấp:

```ts
../../../../components   // tránh
```

## Backend

Project references:

```
Template.API → Template.Core
Template.Infrastructure → Template.Core
```

`Template.Core` **không** reference `Template.Infrastructure`.

---

# Function Convention

Một function chỉ nên làm một việc.

Nếu function vượt quá khoảng **50 dòng**, hãy cân nhắc tách nhỏ.

---

# Comment Convention

Không comment những điều code đã thể hiện rõ.

Chỉ comment khi:

- Business rule đặc biệt
- Tích hợp bên thứ ba
- Quy trình phức tạp

---

# Cursor Convention

Mọi code sinh ra phải tuân thủ:

1. `docs/00-vision.md`
2. `docs/01-architecture.md`
3. `docs/02-project-structure.md`
4. `docs/03-development-conventions.md`

Theo đúng thứ tự ưu tiên trên.

Cursor rules tương ứng:

- `.cursor/rules/architecture.mdc`
- `.cursor/rules/project-structure.mdc`
- `.cursor/rules/development-conventions.mdc`

---

# Goal

Code phải:

- Dễ đọc
- Dễ mở rộng theo feature
- Dễ bảo trì
- Dễ generate bằng AI
- Dễ onboarding developer mới
- Nhất quán giữa backend C# và frontend TypeScript

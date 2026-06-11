# Runtime Bootstrap Architecture

## Mục tiêu

Tài liệu này mô tả cách khởi động toàn bộ hệ thống trên stack **.NET 9 Web API + React Vite SPA**.

Bootstrap phải rõ ràng, fail-fast, và dễ dự đoán.

---

# Current Template State

Template hiện tại chưa cung cấp production shell hoàn chỉnh cho cả backend và frontend.

Tuy nhiên, kiến trúc bootstrap phải được thiết kế sẵn để hỗ trợ:

- backend `.NET 9 Web API`
- frontend `React Vite SPA`
- database initialization
- auth initialization
- feature flags

---

# Bootstrap Flow

## Backend

```
Environment
↓
Config
↓
Database
↓
Auth
↓
Application
↓
Ready
```

## Frontend

```
Environment
↓
Config
↓
API Client
↓
Auth
↓
React App
↓
Ready
```

---

# Backend Bootstrap

## Program.cs

Backend startup phải được điều phối từ `Program.cs`.

`Program.cs` là composition root duy nhất của backend.

### Nhiệm vụ chính

- đọc cấu hình
- validate environment
- đăng ký dependency injection
- cấu hình DbContext / repository / infrastructure
- cấu hình authentication / authorization
- map controllers / middleware
- chạy application host

### Mẫu kiến trúc

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddAppConfiguration(builder.Configuration)
    .AddInfrastructure(builder.Configuration)
    .AddAuthenticationServices(builder.Configuration)
    .AddAuthorizationServices();

builder.Services.AddControllers();

var app = builder.Build();

app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### DI Rules

- đăng ký DI ở `Program.cs` hoặc extension methods được gọi từ `Program.cs`
- giữ composition root mỏng
- không chứa business logic trong startup
- fail fast khi cấu hình không hợp lệ

---

# Frontend Bootstrap

## main.tsx

Frontend startup phải được điều phối từ `src/main.tsx` hoặc `frontend/src/app/main.tsx` tùy cấu trúc project.

`main.tsx` là entry point của Vite SPA.

### Nhiệm vụ chính

- đọc environment của Vite
- khởi tạo React root
- đăng ký providers toàn cục
- đăng ký router
- mount ứng dụng

### Mẫu kiến trúc

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### React Boot Rules

- dùng Vite làm bundler
- dùng client-side routing
- không đưa business logic vào `main.tsx`
- mount các provider như query client, auth context, theme provider tại app shell

---

# Runtime Layers

```
backend/
├── Template.Core/
├── Template.Infrastructure/
└── Template.API/

frontend/
└── src/
    ├── app/
    ├── features/
    ├── shared/
    ├── lib/
    └── types/

database/          # project root — not src/database/
```

---

# Infrastructure Layer

Infrastructure nằm trong `backend/Template.Infrastructure/`.

Ví dụ:

- auth
- storage
- email
- cache
- logging

Infrastructure có thể phụ thuộc vào:

- config
- shared

Infrastructure không được phụ thuộc vào:

- business modules
- UI components
- pages

---

# Shared Layer

Shared code nằm trong `frontend/src/shared/`.

Ví dụ:

- config
- constants
- types
- utils
- hooks

Shared không được phụ thuộc modules hoặc business logic.

---

# Database Initialization

Database phải được khởi tạo một lần.

Rules:

- backend dùng một DbContext / pool đã đăng ký qua DI
- không tạo connection per request nếu không cần thiết
- schema, migrations, seeds nằm ở `database/` ở project root

Entry point database là Infrastructure layer và được consumption từ `Program.cs`.

---

# Authentication Initialization

Authentication được khởi tạo thông qua configuration và DI.

Backend auth services được đăng ký trong `Program.cs`.
Frontend auth provider / token interceptors được đăng ký trong app shell.

Không hardcode provider selection.

---

# Runtime Modes

Supported:

- development
- test
- production

Backend dựa trên môi trường ASP.NET.
Frontend dựa trên Vite mode và `import.meta.env`.

---

# Production Restrictions

Production must not use:

- stub auth
- debug secrets
- unsafe defaults

---

# Error Handling

Bootstrap failures phải fail fast.

Ví dụ:

- missing `DATABASE_URL`
- missing `AUTH_SECRET`
- invalid auth mode
- invalid feature flag config
- invalid API base URL

Không được fail silently.

---

# Dependency Direction

Allowed:

```
Config
↓
Infrastructure
↓
Modules
↓
Application
```

Avoid circular dependencies.

---

# Deployment Targets

Primary targets:

- frontend: Vercel or Netlify
- backend: Render.com or Railway via Docker

Future targets:

- VPS
- Cloud Run

Do not write platform-specific business logic.

---

# Goal

Runtime must be:

- predictable
- portable
- environment driven
- easy to deploy
- easy to maintain

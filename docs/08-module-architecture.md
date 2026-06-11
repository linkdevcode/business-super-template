# Module Architecture

> Tham chiếu canonical: `docs/01-architecture.md`

## Mục tiêu

Định nghĩa kiến trúc chuẩn cho mọi module nghiệp vụ trên stack **.NET 9 Web API + React Vite SPA**.

Mọi module phải có cấu trúc dự đoán được cho cả backend lẫn frontend.

---

# Module Location

## Backend

- `backend/Template.Core/Features/{FeatureName}/`
- `backend/Template.Infrastructure/Features/{FeatureName}/`
- `backend/Template.API/CoreFeatures/{FeatureName}/`

## Frontend

- `frontend/src/features/{feature-name}/`

---

# Example Modules

Backend and frontend feature examples:

- `auth`
- `user`
- `role`
- `permission`
- `audit-log`
- `contract`
- `asset`
- `tenant`

---

# Business Module Flow

Backend business flow:

```
Controller
↓
Handler / Use Case
↓
Repository Interface
↓
Repository Implementation
↓
Database
```

Frontend business flow:

```
Page / Component
↓
Hook
↓
API Client
↓
Backend API
```

---

# Backend Module Structure

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

Rules:

- business logic lives in `Template.Core`
- persistence lives in `Template.Infrastructure`
- HTTP entry points live in `Template.API`
- do not create `Services/` inside feature slices

---

# Frontend Module Structure

```
frontend/src/features/{feature-name}/
├── components/
├── pages/
├── hooks/
├── api/
├── schemas/
├── types/
└── index.ts
```

Rules:

- pages render UI
- hooks manage state and data fetching
- api clients call backend endpoints
- schemas validate input with Zod
- components stay feature-local unless shared across features

---

# Responsibilities

## pages

Pages render UI and orchestrate feature components.

They must not contain business logic or database access.

## hooks

Hooks handle data fetching, mutations, and state orchestration.

They must not contain business logic.

## use-cases / handlers

Use cases contain business logic, validation orchestration, permission checks, and audit coordination.

This is the only place where business logic should live in backend business modules.

## repositories

Repositories handle data access only.

They must not contain business rules or domain calculations.

## components

Components are local UI building blocks.

Move reusable UI to `frontend/src/shared/components/`.

## schemas

Validation schemas belong here.

Use Zod on the frontend.
Use FluentValidation or handler-level validation on the backend.

## types

Feature-specific types, DTOs, and input contracts belong here.

---

# Auth Module Exception

`auth` is a platform module, not a standard CRUD business module.

Backend:

- `backend/Template.API/CoreFeatures/Auth/`
- `backend/Template.Core/Features/Auth/`
- `backend/Template.Infrastructure/Auth/`

Frontend:

- `frontend/src/features/auth/`

Auth provider implementations live in `backend/Template.Infrastructure/Auth/`.
Auth orchestration lives in the auth feature slice.

Auth module does not need the full repository pattern for CRUD entities, but it must still follow provider abstraction rules.

---

# Module Isolation

A module must not access another module's internal files directly.

Good:

- import from `frontend/src/features/user`
- import from `Template.Core/Features/User` public contracts

Bad:

- importing repository internals from another module
- importing controller internals from another module

Prefer public APIs and `index.ts` exports.

---

# Shared Code

Shared code belongs in:

- `frontend/src/shared/`
- `Template.Core/Common/`

Use shared code only when logic or UI is reused by multiple modules.

---

# Business Module Rules

Every business module should include:

- repositories
- use cases / handlers
- schemas
- types
- public exports

Every module should remain independently testable and easy to generate.

---

# Goal

Modules must be:

- reusable
- independent
- testable
- maintainable
- AI friendly
- predictable across backend and frontend

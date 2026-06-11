# Environment Configuration

## Mục tiêu

Tài liệu này định nghĩa chiến lược quản lý environment variables cho toàn bộ hệ thống trên stack **.NET 9 Web API + React Vite SPA**.

Environment là nguồn cấu hình quan trọng của ứng dụng, nhưng cách đọc environment khác nhau giữa backend và frontend.

---

# Principles

## Single Source Of Truth

### Backend

Backend không nên đọc `Environment.GetEnvironmentVariable(...)` rải rác trong code feature.

Thay vào đó:

- dùng `appsettings.json`
- override bằng environment variables khi deploy
- bind vào typed options classes

### Frontend

Frontend dùng `import.meta.env` của Vite.

Không đọc raw env trong feature code; nên map vào một typed config module ở `frontend/src/shared/config/`.

---

# Environment Validation

Sử dụng validation tại startup.

### Backend

Có thể dùng:

- `IOptions<T>` + validation
- custom startup checks
- guard trong `Program.cs`

### Frontend

Có thể dùng:

- typed wrapper cho `import.meta.env`
- runtime guards cho giá trị bắt buộc

Application phải fail fast nếu:

- thiếu biến bắt buộc
- sai enum
- sai URL
- sai cấu hình feature flag

---

# Configuration Layer

## Backend structure

```
backend/Template.API/
├── appsettings.json
├── appsettings.Development.json
├── appsettings.Production.json
└── Program.cs
```

## Frontend structure

```
frontend/
├── .env
├── .env.local
├── .env.development
├── .env.production
└── frontend/src/shared/config/
```

---

# Backend Configuration Model

Backend configuration nên chia thành:

- application settings
- database settings
- auth settings
- feature flags
- external service settings

Khuyến nghị dùng strongly typed options classes:

- `AppSettingsOptions`
- `DatabaseOptions`
- `AuthOptions`
- `FeatureFlagsOptions`

---

# Frontend Configuration Model

Frontend configuration nên được gom vào một typed module, ví dụ:

- `frontend/src/shared/config/env.ts`
- `frontend/src/shared/config/config.ts`

Nên map từ `import.meta.env` sang các biến đã validate.

---

# Feature Flipping

Feature flags dùng để bật/tắt các core modules như Billing và AI Chatbot.

## Backend

Đề xuất cấu trúc trong `appsettings.json`:

```json
{
  "FeatureFlags": {
    "Billing": false,
    "AiChatbot": true
  }
}
```

Rules:

- đọc từ configuration, không hardcode
- expose qua typed options
- dùng trong backend để chặn hoặc cho phép đăng ký endpoint / service / menu logic
- không thay thế authorization

## Frontend

Có thể mirror bằng public Vite env:

- `VITE_FEATURE_BILLING`
- `VITE_FEATURE_AI_CHATBOT`

Frontend chỉ dùng để ẩn UI hoặc điều hướng UX.

---

# Backend vs Frontend Mapping

## Backend configuration

Dùng `appsettings.json` và environment variables để cấu hình:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `FeatureFlags:*`

## Frontend configuration

Dùng `.env` và `import.meta.env` cho:

- `VITE_APP_URL`
- `VITE_API_BASE_URL`
- `VITE_FEATURE_BILLING`
- `VITE_FEATURE_AI_CHATBOT`

---

# Public Variables

Frontend client-safe variables phải dùng prefix `VITE_`.

Ví dụ:

- `VITE_APP_URL`
- `VITE_API_BASE_URL`
- `VITE_FEATURE_BILLING`
- `VITE_FEATURE_AI_CHATBOT`

Không expose secret server variables ra browser.

---

# Server Variables

Không expose ra client:

- `DATABASE_URL`
- `AUTH_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- API keys
- tokens

---

# Supported Environment Variables

## Backend application

- `APP_NAME`
- `ASPNETCORE_ENVIRONMENT`
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `FEATURE_BILLING`
- `FEATURE_AI_CHATBOT`

## Frontend application

- `VITE_APP_URL`
- `VITE_API_BASE_URL`
- `VITE_FEATURE_BILLING`
- `VITE_FEATURE_AI_CHATBOT`

## External integrations

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `STORAGE_PROVIDER`
- `STORAGE_BUCKET`
- `STORAGE_REGION`

---

# Enum Validation

Backend runtime values phải được validate.

Ví dụ:

- development
- test
- production

`FEATURE_BILLING` và `FEATURE_AI_CHATBOT` nên được parse sang boolean rõ ràng.

---

# Configuration Loading Order

## Backend

1. `appsettings.json`
2. `appsettings.{Environment}.json`
3. environment variables
4. platform secret store

## Frontend

1. `.env`
2. `.env.local`
3. `.env.development` / `.env.production`
4. `.env.{mode}.local`

Later files override earlier files.

---

# Documentation Rule

Mọi biến môi trường mới phải được cập nhật trong:

- `.env.example`
- `docs/12-environment.md`

Nếu là backend-only setting, phải ghi rõ key trong `appsettings.json` và cách override qua deployment platform.

---

# Security Rules

Không:

- commit secrets
- log secrets
- expose secrets to frontend

Không in ra:

- `DATABASE_URL`
- `AUTH_SECRET`
- API keys
- tokens

---

# Goal

Environment configuration phải:

- typed
- validated
- centralized
- secure
- deployment friendly
- hỗ trợ feature flipping cho core modules

# Deployment Architecture

## Mục tiêu

Tài liệu này định nghĩa chiến lược deployment cho My Super Template trên stack **.NET 9 Web API + React Vite SPA**.

Template được tối ưu cho mô hình chi phí thấp, dễ triển khai và dễ nhân bản cho nhiều khách hàng.

---

# Primary Deployment Strategy

Mặc định deployment path:

- frontend → Vercel hoặc Netlify
- backend → Render.com hoặc Railway qua Docker

Luồng chung:

```
Clone → Configure Env → Deploy
```

---

# Frontend Deployment

## Primary Targets

- Vercel
- Netlify

React Vite SPA phù hợp với static hosting / edge-friendly hosting.

### Rules

- build frontend bằng Vite
- expose public config qua `VITE_` prefix
- gọi backend thông qua `VITE_API_BASE_URL`
- không hardcode URL backend trong code feature

---

# Backend Deployment

## Primary Targets

- Render.com
- Railway

Backend deploy dưới dạng `.NET 9 Web API` container.

### Rules

- dùng Docker multi-stage build
- chạy app trên ASP.NET Core runtime image
- cấu hình qua environment variables
- giữ business logic độc lập với hosting platform

---

# Standard Multi-Stage Dockerfile

Dockerfile chuẩn cho backend `.NET 9 Web API`:

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["Template.sln", "."]
COPY ["backend/Template.API/Template.API.csproj", "backend/Template.API/"]
COPY ["backend/Template.Core/Template.Core.csproj", "backend/Template.Core/"]
COPY ["backend/Template.Infrastructure/Template.Infrastructure.csproj", "backend/Template.Infrastructure/"]
RUN dotnet restore "backend/Template.API/Template.API.csproj"

COPY . .
WORKDIR /src/backend/Template.API
RUN dotnet publish "Template.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Template.API.dll"]
```

Rules:

- build stage và runtime stage phải tách biệt
- không ship SDK image lên production
- port phải phù hợp hosting platform
- có thể override port qua environment nếu cần

---

# Environment Driven Deployment

Deployment configuration phải đến từ environment variables.

Không hardcode:

- URLs
- secrets
- API keys
- database connections
- provider credentials
- feature flags

---

# Stateless Application Rule

Application phải stateless.

Không lưu business state trong:

- memory local
- filesystem local

Persistent data thuộc về:

- database
- storage provider
- auth provider

---

# Database Rule

Supported database:

- PostgreSQL

Application không tự tạo database.

Database provisioning là external step.

### Migration Workflow

```text
migrate
↓
seed (development only)
```

Không seed trước migration.
Không seed production trừ khi có chủ đích rõ ràng.

---

# Zero-Cost Hosting Guidance

## Frontend

Để tối ưu chi phí, ưu tiên:

- Vercel free tier
- Netlify free tier

## Backend

Để tối ưu chi phí, ưu tiên:

- Render free tier hoặc low-cost service
- Railway trial / low-cost container hosting

## Database

Dùng PostgreSQL có free tier hoặc môi trường dev được quản lý riêng.

Mô hình phải portable nếu hosting provider thay đổi.

---

# Production Restrictions

Production must not use:

- stub auth
- debug secrets
- unsafe defaults

Fail fast if detected.

---

# Secrets Rule

Không:

- commit secrets
- log secrets
- expose secrets to frontend

Sensitive values include:

- `DATABASE_URL`
- `AUTH_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- API keys
- tokens
- passwords

---

# Logging Rule

Dùng structured logging trong production.

Không log sensitive information.

Runtime logs của platform là đủ cho giai đoạn solo developer / SME.

---

# Health Check Rule

Backend nên expose:

- `/health`

Health check nên xác nhận:

- application startup
- database connectivity

---

# Deployment Checklist

## Trước khi deploy

- environment variables đã cấu hình trên platform
- database reachable
- type check pass
- migrations đã review
- auth mode production hợp lệ
- feature flags đúng target environment

## Sau khi deploy

- verify frontend load thành công
- verify backend connectivity
- verify authentication
- verify core feature flags

---

# Future Deployment Targets

Các target sau không phải first-class mặc định:

- Docker Compose
- VPS
- Cloud Run

Không tối ưu kiến trúc cho các target này trừ khi có yêu cầu rõ ràng.

---

# Infrastructure Separation

Business logic không được phụ thuộc vào:

- hosting provider
- deployment platform
- container runtime

Infrastructure adapters thuộc `backend/Template.Infrastructure/`.

---

# Deployment Assets

Repository nên hỗ trợ các asset sau khi cần:

- `Dockerfile` cho backend
- `docker-compose.yml` cho local integration
- CI pipeline cho build / migrate / deploy
- health check endpoint

Không cần generate đầy đủ các asset enterprise nếu chưa có yêu cầu.

---

# Goal

Deployment architecture phải:

- fast to ship
- provider friendly
- environment driven
- solo developer friendly
- repeatable across customer projects
- portable giữa các hosting provider

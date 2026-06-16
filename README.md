# My Super Template

Template nền tảng: **.NET 9 Web API + React (Vite + TypeScript) + PostgreSQL**.

## Yêu Cầu Môi Trường

- Cài sẵn **Docker Desktop**
- Cài sẵn **VS Code** hoặc **Cursor**
- (Khuyến nghị) Cài thêm `.NET SDK 9` và `Node.js 22+` nếu chạy hybrid dev

## Chạy Local (Khuyến nghị cho Dev)

1. Khởi động database:

```bash
docker compose up -d db
```

2. Chạy backend:

```bash
dotnet watch --project backend/Template.API
```

3. Chạy frontend:

```bash
cd frontend && npm install && npm run dev
```

## Chạy Full Docker

```bash
docker compose up -d --build
```

## Tài Khoản Mặc Định (Development Seed)

- Email: `admin@example.com`
- Password: `Password123!`

> Mật khẩu được hash bằng **BCrypt** trước khi lưu vào database seed.

## Xem Database (DBCode)

Dùng extension **DBCode** trong VS Code/Cursor để kết nối PostgreSQL local:

| Thông tin | Giá trị |
|-----------|---------|
| Host | `localhost` |
| Port | `5432` |
| Database | `template_db` |
| Username | `template_db` |
| Password | `template_db` |

## URL Mặc Định

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Health check: `http://localhost:5000/health`


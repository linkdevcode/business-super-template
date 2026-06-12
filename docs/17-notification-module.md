# 17. Notification Module

> Tham chiếu canonical: `docs/01-architecture.md`

## Mục tiêu
Cung cấp hệ thống thông báo tập trung trên stack `.NET 9 Web API + React Vite SPA`.

## Phạm vi
Backend:
- `backend/Template.Core/Features/Notification/`
- `backend/Template.Infrastructure/Features/Notification/`
- `backend/Template.API/CoreFeatures/Notification/`

Frontend:
- `frontend/src/features/notification/`

## Kiến trúc chuẩn
- Create notification, mark as read, mark all as read, get notifications là các use case riêng.
- Notification là module dùng chung, không đặt business logic ở UI hay repository.
- Real-time notification phải đi qua `NotificationHub` ở backend và `HubConnection` ở frontend.

## Database schema
Bảng `notifications` nên có:
- `id`, `user_id`, `title`, `message`, `type`
- `entity_type`, `entity_id`
- `is_read`, `read_at`
- `created_at`, `updated_at`, `deleted_at`

## Notification types
- `SYSTEM`, `INFO`, `WARNING`, `SUCCESS`, `ERROR`.

## Email provider
- Gửi email phải đi qua abstraction ở `backend/Template.Infrastructure/Email/`.
- Không gửi email trực tiếp từ UI hoặc repository.

## Audit & Permission
- Chỉ audit khi notification gắn với business process quan trọng.
- Permission: `Notification.Read`, `Notification.Update`.

## Checklist
- In-app notification.
- Email integration qua provider.
- Read/unread state.
- Public API rõ ràng qua `index.ts`.


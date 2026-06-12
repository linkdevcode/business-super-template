# 16. File Management

> Tham chiếu canonical: `docs/01-architecture.md`

## Mục tiêu
Cung cấp hệ thống file dùng chung cho toàn bộ ứng dụng trên stack `.NET 9 Web API + React Vite SPA`.

## Phạm vi
Backend:
- `backend/Template.Core/Features/FileManagement/`
- `backend/Template.Infrastructure/Features/FileManagement/`
- `backend/Template.API/CoreFeatures/FileManagement/`

Frontend:
- `frontend/src/features/file-management/`

## Nguyên tắc
- Chỉ dùng một bảng chung `files`.
- `files` là bảng metadata độc lập.
- Các bảng nghiệp vụ dùng `file_id` khóa ngoại hoặc bảng trung gian nếu là quan hệ một-nhiều.
- Không truy cập storage trực tiếp từ UI hay use case.

## Database schema
`files` nên có:
- `id`, `file_name`, `original_name`, `mime_type`, `file_size`
- `storage_provider`, `storage_path`, `public_url`
- `uploaded_by`
- `created_at`, `updated_at`, `deleted_at`

## Storage provider
- Abstraction nằm ở `backend/Template.Infrastructure/Storage/`.
- Hỗ trợ local, Supabase Storage, S3.
- Use case chỉ gọi `StorageProvider`, không biết SDK cụ thể.

## Flow
Upload, download, delete, restore đều phải qua backend use case và permission check.

## Audit & Permission
- Audit cho upload, delete, restore.
- Permission: `File.Read`, `File.Create`, `File.Update`, `File.Delete`.

## Checklist
- Generic module.
- Soft delete.
- Provider abstraction.
- Audit log.
- Reuse cho mọi module khác.


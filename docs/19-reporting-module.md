# 19. Reporting Module

> Tham chiếu canonical: `docs/01-architecture.md`

## Mục tiêu
Tạo báo cáo và export dữ liệu trên stack `.NET 9 Web API + React Vite SPA`.

## Phạm vi
Backend:
- `backend/Template.Core/Features/Reporting/`
- `backend/Template.Infrastructure/Features/Reporting/`
- `backend/Template.API/CoreFeatures/Reporting/`

Frontend:
- `frontend/src/features/reporting/`

## Quy tắc
- Reporting chỉ đọc dữ liệu hiện có.
- Logic xuất file phải nằm trong backend use case và export provider.
- Không generate Excel/PDF trực tiếp trong UI.

## Export provider
- Provider nằm ở `backend/Template.Infrastructure/Export/`.
- Hỗ trợ Excel, CSV, PDF.
- Use case chỉ orchestration, không phụ thuộc SDK export cụ thể.
- Với báo cáo lớn, ưu tiên trả `Stream` hoặc sinh file tạm trên storage rồi trả link download cho frontend.

## Report types
- Operational report.
- Financial report.
- Audit report.

## Audit & Permission
- Export report phải có audit log.
- Permission: `Report.View`, `Report.Export`.


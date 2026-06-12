# 15. Transaction Module

> Tham chiếu canonical: `docs/01-architecture.md`

## Mục tiêu
Chuẩn hóa các module nghiệp vụ có trạng thái và vòng đời trên stack `.NET 9 Web API + React Vite SPA`.

Ví dụ: Contract, Invoice, Payment, Order, Booking, Rental.

## Phạm vi
Backend:
- `backend/Template.Core/Features/{FeatureName}/`
- `backend/Template.Infrastructure/Features/{FeatureName}/`
- `backend/Template.API/CoreFeatures/{FeatureName}/`

Frontend:
- `frontend/src/features/{feature-name}/`

## Kiến trúc chuẩn
Backend:
```text
Controller -> Handler / Use Case -> Repository Interface -> Repository Implementation -> Database
```

Frontend:
```text
Page -> Hook -> API Client -> Backend API
```

## Quy tắc nghiệp vụ
- Mỗi transaction phải có `status` rõ ràng.
- Trạng thái chỉ được đổi qua use case chuyên biệt.
- Approval flow dùng use case riêng như submit/approve/reject/cancel/close.
- Business validation chỉ đặt trong backend use case.
- Attachment phải đi qua file-management bằng FK hoặc bảng trung gian, không lưu blob trong bảng transaction.

## UI chuẩn
- List page, detail page, create/edit page.
- Nếu có approval thì thêm approval page hoặc approval panel.
- Detail page nên có activity timeline lấy từ audit log.

## Dữ liệu và query
- Bảng dùng `uuid`, `created_at`, `updated_at`, `deleted_at`.
- Search thường gồm keyword, status, date range.
- Filter/pagination phải server-side.

## Audit & Permission
- Audit thêm `SUBMIT`, `APPROVE`, `REJECT`, `CANCEL`, `CLOSE`.
- Permission tối thiểu: `Contract.Read`, `Contract.Create`, `Contract.Update`, `Contract.Delete`.
- Nếu có approval: `Contract.Submit`, `Contract.Approve`, `Contract.Reject`.

## Checklist
- Lifecycle rõ ràng.
- State transition hợp lệ.
- Approval flow tách use case.
- Attachment support.
- Timeline từ audit log.


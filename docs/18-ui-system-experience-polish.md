# 18. UI System & Experience Polish

> Tham chiếu canonical: `docs/01-architecture.md`

## Mục tiêu
Nâng cấp hệ thống giao diện của template theo hướng hiện đại, nhất quán, reusable và product-ready cho các ứng dụng quản trị / SaaS B2B.

## Phạm vi
Frontend:
- `frontend/src/app/`
- `frontend/src/features/`
- `frontend/src/shared/`

## Nguyên tắc
- Template phải đẹp theo kiểu hệ thống giao diện tốt, không phải đẹp theo kiểu custom riêng cho từng dự án.
- Ưu tiên tái sử dụng component và token giao diện thay vì hardcode style ở từng page.
- Theme, spacing, typography, shadow, focus state phải đồng bộ toàn hệ thống.

## Theme system
- Dùng `shadcn/ui` theme tokens + CSS variables làm nền.
- Ưu tiên palette `zinc`, `slate`, hoặc `stone`.
- Hỗ trợ Dark / Light mode bằng `next-themes` hoặc một context tương đương.
- Transition theme và surface state nên mượt nhưng không gây distraction.

## Admin shell
- Sidebar nên hỗ trợ collapsed / expanded state.
- Header nên sticky, có thể dùng glass nhẹ với `backdrop-blur` nếu vẫn đảm bảo readability.
- Breadcrumb nên bám theo route.
- User profile dropdown cần rõ ràng và thống nhất.

## Motion & feedback
- Dùng Framer Motion cho transition nhẹ giữa routes hoặc page sections.
- Ưu tiên fade / slide nhẹ, tránh animation quá dài hoặc quá “marketing”.
- Loading nên ưu tiên skeleton mượt hơn spinner cổ điển.

## Component polish
- `<DataTable />` cần có empty state, loading state, filter/search/pagination rõ ràng.
- Form controls cần có ring/focus state mềm, shadow nhẹ, spacing hợp lý.
- Empty state nên tối giản, reusable, và phù hợp app quản trị.

## Anti-goals
- Không lạm dụng glassmorphism ở mọi nơi.
- Không tạo hiệu ứng nặng làm chậm cảm giác dùng app.
- Không viết UI custom chỉ dùng cho một page nếu có thể tái dùng qua shared components.

## Checklist
- Theme system hoàn chỉnh.
- Dark / Light mode hoạt động mượt.
- Admin layout chuyên nghiệp.
- Motion tinh tế.
- DataTable và form UI được chuẩn hóa.
- Loading, empty, error states đồng nhất.


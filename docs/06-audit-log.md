# Audit Log Design

## Mục tiêu

Audit log dùng để ghi nhận toàn bộ thay đổi quan trọng trong hệ thống.

Mọi thay đổi nghiệp vụ cần có khả năng truy vết và đối chiếu lịch sử.

---

# Core Table

- `audit_logs`

---

# Purpose

Audit log hỗ trợ:

- truy vết thay đổi
- điều tra sự cố
- kiểm toán
- bảo mật
- theo dõi thao tác người dùng

---

# Audit Log Fields

- `id`
- `entity_type`
- `entity_id`
- `action`
- `changes`
- `created_by`
- `created_at`

---

# Field Semantics

## entity_type

Loại dữ liệu bị tác động.

Ví dụ:

- `User`
- `Role`
- `Permission`
- `Contract`
- `Asset`
- `Invoice`
- `Payment`

## entity_id

ID của bản ghi bị thay đổi.

## action

Loại hành động:

- `CREATE`
- `UPDATE`
- `DELETE`
- `APPROVE`
- `REJECT`
- `ASSIGN_ROLE`
- `REMOVE_ROLE`
- `LOGIN`
- `LOGOUT`
- `PASSWORD_RESET`

## changes

Lưu dữ liệu thay đổi dưới dạng JSONB.

Khuyến nghị structure:

```json
{
  "before": {},
  "after": {}
}
```

Ví dụ:

```json
{
  "before": {
    "status": "PENDING"
  },
  "after": {
    "status": "APPROVED"
  }
}
```

## created_by

User thực hiện hành động.

## created_at

Thời gian ghi log.

---

# What Should Be Logged

Ghi log cho các hành động quan trọng:

- tạo mới dữ liệu
- cập nhật dữ liệu
- xóa dữ liệu
- phê duyệt
- từ chối
- gán role
- thu hồi role
- đăng nhập
- đăng xuất
- reset mật khẩu

---

# What Should Not Be Logged

Không ghi log cho:

- xem trang
- đọc dữ liệu thông thường
- danh sách dữ liệu
- tìm kiếm dữ liệu

---

# EF Core Audit Strategy

Audit logging phải được tự động hóa ở tầng persistence.

Khuyến nghị chuẩn:

- override `SaveChangesAsync` trong `ApplicationDbContext`
- dùng `ChangeTracker` để phát hiện entity changes
- so sánh old values và new values
- sinh audit log entry trong cùng transaction khi thích hợp

Rules:

- audit log không được mềm xóa
- audit log là immutable
- audit log phải lưu đủ thông tin để phục vụ kiểm toán

---

# Audit Flow

```
User Action
↓
Use Case
↓
Repository / DbContext
↓
SaveChangesAsync
↓
ChangeTracker
↓
Audit Log Entry
```

---

# Security

Người dùng thông thường không được sửa audit log.

Audit log là dữ liệu lịch sử, không phải business entity có thể chỉnh sửa lại.

---

# Performance

Audit log nên được lưu riêng và không làm thay đổi behavior của business tables.

Khi khối lượng lớn, có thể mở rộng sang background processing, nhưng mặc định vẫn phải đảm bảo tính nhất quán dữ liệu.

---

# Future Extensions

Có thể mở rộng thêm:

- `ip_address`
- `user_agent`
- `request_id`
- `module_name`

Nhưng không bắt buộc trong phiên bản đầu tiên.

---

# Goal

Audit log phải:

- chính xác
- không thể chỉnh sửa
- dễ truy vết
- dễ mở rộng
- dễ tự động hóa bằng EF Core

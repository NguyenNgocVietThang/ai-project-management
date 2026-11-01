# Phạm vi Đồ án tốt nghiệp (sau điều chỉnh)

> Ngày: 2026-11-01. Phạm vi **đồ án** hẹp hơn phạm vi **sản phẩm** trong BRD: sản phẩm có thể có nhiều tính năng, nhưng đồ án chỉ cam kết và đánh giá các mô-đun ở Tầng A.

## 1. Định vị

- **Tên đề tài (đề xuất, chờ GVHD chốt):** Xây dựng hệ thống lập kế hoạch và kiểm soát thay đổi dự án phần mềm có AI hỗ trợ, gồm ứng dụng di động cho nhóm dự án.
- **Bài toán:** PM tốn nhiều thời gian dựng WBS ban đầu. Thành viên nhóm cần nhận việc, ghi giờ và phản hồi thay đổi ngay trên điện thoại. Thay đổi phạm vi cần được kiểm soát, nhưng không được giao quyền quyết định cho AI.
- **Kiến trúc tổng quát:** một backend FastAPI dùng chung; **app Android (Expo React Native)** cho thành viên và người duyệt; **web (Next.js)** cho PM lập kế hoạch và quản trị.

## 2. Phạm vi 3 tầng

### Tầng A — Trọng tâm (đóng góp chính, có đánh giá)

| Mô-đun | Nội dung | Đánh giá |
|---|---|---|
| **A1. Ứng dụng di động** | Xem §3 | E3 |
| **A2. AI lập kế hoạch** | Hỏi làm rõ yêu cầu (hồ sơ 7 mục, mỗi lượt một câu) → sinh WBS từ hồ sơ đã chốt → PM rà soát trên web | E1 |
| **A3. Kiểm soát thay đổi** | CR có mức tác động, duyệt BA → PO → PM do con người quyết định, báo cáo tác động AI chỉ tư vấn, khôi phục phiên bản có kiểm soát | E2, E4 |

### Tầng B — Nền tảng kế thừa (mô tả kiến trúc, không phải đóng góp chính)

Auth (JWT, refresh xoay vòng, OAuth Google web), RBAC, quản lý portfolio/project/task, CPM, durable jobs + outbox, thông báo WebSocket, cron hằng ngày, triển khai Render + Supabase Free.

### Tầng C — Ngoài trọng tâm (giữ mã, không cam kết đánh giá)

BPMN, sinh SRS/BRD DOCX, xuất XLSX/EVA/Burndown, Investor dashboard, Gantt chỉ đọc (chỉ dùng để minh họa kết quả A2), AI tối ưu lịch / gợi ý nhân sự / quét rủi ro.

### Ngoài phạm vi đồ án

iOS; phát hành công khai Google Play (chỉ APK/Internal Testing); giai đoạn 4–9 của [`ANDROID_ROADMAP.md`](../mobile/ANDROID_ROADMAP.md); upload và bóc tách tài liệu bằng AI; chụp/tải tài liệu trên mobile (mục 3.3 của lộ trình); đăng nhập Google trên mobile; kéo thả Gantt; gửi email thật trên demo.

## 3. Phạm vi app mobile (A1)

Ánh xạ tới [`ANDROID_ROADMAP.md`](../mobile/ANDROID_ROADMAP.md):

| Nhóm | Chức năng | Mục lộ trình | Thứ tự ưu tiên |
|---|---|---|---|
| M1. Lõi | Khung app, client API sinh từ OpenAPI, đăng nhập email/mật khẩu, khôi phục phiên, thông báo trong app, Việc của tôi, đổi trạng thái task, timer worklog, i18n vi/en, theme | 1.1–1.7 | 1 |
| M2. Push + Duyệt CR | FCM, deep link, danh sách CR chờ tôi duyệt, xem **mức tác động** + báo cáo AI, **xác nhận đã đọc** (CR MAJOR), duyệt/từ chối có lý do | 2.1, 2.2, 2.4, 2.5 (có điều kiện) | 2 |
| M3. Chat dự án | Lịch sử, gửi tin, chưa đọc, WebSocket khi foreground, kết nối lại có backoff | 2.3 | 3 |
| M4. Dashboard + Offline | KPI tóm tắt; ghi worklog khi mất mạng bằng SQLite + hàng đợi đồng bộ, xử lý xung đột | 3.1, 3.2 | 4 |
| Phát hành | EAS Build APK preview, khóa sinh trắc học (tùy chọn), ẩn nội dung ở đa nhiệm | 3.4 (một phần), 3.5 (chỉ APK/Internal) | cuối |

**Ràng buộc từ kiểm soát thay đổi:** nút Duyệt/Từ chối ngay trên thông báo (mục 2.5) **chỉ áp dụng cho CR MINOR/MODERATE**. CR MAJOR bắt buộc mở màn hình chi tiết, đọc báo cáo và xác nhận.

**Điểm cắt nếu trễ tiến độ:** bỏ M4 offline, sau đó đến M3 chat (chuyển sang "hướng phát triển"). M1 và M2 là tối thiểu bắt buộc.

## 4. Tiêu chí hoàn thành đồ án

1. App APK chạy trên thiết bị thật với backend demo; luồng E2E *đăng nhập → nhận push → duyệt CR → ghi giờ* đạt.
2. Luồng AI *ý tưởng → làm rõ → WBS → CPM* chạy với provider thật; có số liệu E1.
3. CR MAJOR không thể duyệt khi thiếu báo cáo tác động hoặc thiếu xác nhận đã đọc; khôi phục phiên bản chỉ chạy sau khi xem trước.
4. Có chương đánh giá với số liệu E1–E4, kèm phần hạn chế và các yếu tố ảnh hưởng tính hợp lệ.

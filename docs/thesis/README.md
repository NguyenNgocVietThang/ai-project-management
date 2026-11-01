# Hồ sơ điều chỉnh Đồ án tốt nghiệp

> Ngày lập: 2026-11-01. Lý do: điều chỉnh hướng đồ án theo 4 góp ý của giảng viên hướng dẫn (GVHD) về đề cương.
> Trạng thái: **kế hoạch đã được chủ dự án chốt hướng**. Phần sửa mã chưa làm; mỗi bước phải trình kế hoạch chi tiết và chờ xác nhận trước khi code (xem [`tasks/thesis-revision-plan.md`](../../tasks/thesis-revision-plan.md)).

## Mục lục

| Tài liệu | Nội dung |
|---|---|
| [`advisor-feedback-response.md`](./advisor-feedback-response.md) | Đối chiếu từng góp ý với hiện trạng mã nguồn, nguyên nhân, phương án khắc phục |
| [`scope.md`](./scope.md) | Định vị lại đồ án, phạm vi 3 tầng, phạm vi app mobile |
| [`change-control-design.md`](./change-control-design.md) | Thiết kế kiểm soát thay đổi: phân loại mức tác động CR, AI chỉ tư vấn, khôi phục phiên bản có kiểm soát |
| [`evaluation-plan.md`](./evaluation-plan.md) | Kế hoạch đánh giá hệ thống: đánh giá kế hoạch dự án do AI tạo, phân tích tác động CR, app mobile, kiểm thử hệ thống |
| [`../../tasks/thesis-revision-plan.md`](../../tasks/thesis-revision-plan.md) | Kế hoạch triển khai theo bước, có cổng xác nhận |

## Quyết định đã chốt (2026-11-01)

| # | Chủ đề | Quyết định |
|---|---|---|
| Q1 | Rollback | Thu hẹp thành **khôi phục có kiểm soát**: bắt buộc xem trước (dry-run), PM xác nhận; chỉ khôi phục trường kế hoạch của task còn tồn tại; không xóa cứng, không tạo lại task |
| Q2 | Kiểm soát CR | **Phân loại mức tác động** Nhỏ / Trung bình / Lớn kèm ràng buộc; CR Lớn bắt buộc có báo cáo tác động và người duyệt xác nhận đã đọc; AI chỉ gợi ý mức, con người chốt |
| Q3 | App mobile | Phạm vi đồ án gồm: Đăng nhập + Việc của tôi + Timer; Push + Duyệt CR; Chat dự án; Dashboard + Offline timesheet |
| Q4 | Đánh giá | Kết hợp chỉ số tự động + **3–5 chuyên gia** (PM/BA) chấm rubric mù + so sánh với kế hoạch lập thủ công |

## Thông điệp chính cho hội đồng

1. Đồ án là **hệ thống lập kế hoạch dự án có AI hỗ trợ**, với **ứng dụng di động** là kênh làm việc chính của nhóm dự án (nhận việc, ghi giờ, duyệt thay đổi, trao đổi). Web dành cho PM lập kế hoạch và quản trị.
2. **AI chỉ đề xuất, con người quyết định.** AI không có quyền ghi vào chuỗi duyệt, không tự áp dụng thay đổi. Thay đổi càng lớn thì kiểm soát của con người càng chặt.
3. Chất lượng đầu ra AI được **đo bằng số liệu**: bộ kịch bản chuẩn, chỉ số tự động và chuyên gia chấm mù, chứ không chỉ dựa vào khẳng định.
4. Phạm vi được **thu hẹp có chủ đích**. Các tính năng phụ trợ đã có (BPMN, DOCX, EVA, Investor…) không phải đóng góp chính và không nằm trong phần đánh giá.

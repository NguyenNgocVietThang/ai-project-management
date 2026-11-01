# Phản hồi góp ý của GVHD về đề cương ĐATN

> Ngày: 2026-11-01. Mỗi góp ý được đối chiếu với **mã nguồn thực tế** (có dẫn tệp) trước khi đưa phương án.

## Tóm tắt

| # | Góp ý | Đánh giá sau đối chiếu | Phương án | Tài liệu chi tiết |
|---|---|---|---|---|
| 1 | Thiếu mô-đun/app mobile (bắt buộc với chuyên ngành KTPM di động) | **Đúng.** Backend cho mobile đã xong (Giai đoạn 0) nhưng app chưa có | Đưa app mobile vào **trọng tâm**, định vị lại đề tài | [`scope.md`](./scope.md) §1, §3 |
| 2 | Khối lượng quá nặng, cần rà soát phạm vi | **Đúng.** Đề cương liệt kê khoảng 12 nhóm chức năng ngang hàng | Phạm vi 3 tầng: trọng tâm / nền tảng kế thừa / ngoài trọng tâm | [`scope.md`](./scope.md) §2 |
| 3a | Không nên để AI ra quyết định với thay đổi quan trọng | **Mã đúng, tài liệu viết gây hiểu nhầm.** AI chưa bao giờ quyết định, nhưng thiếu cơ chế kiểm soát theo mức tác động | Sửa câu chữ + phân loại mức tác động + ràng buộc với CR Lớn | [`change-control-design.md`](./change-control-design.md) §1–2 |
| 3b | Rollback trong một transaction tiềm ẩn rủi ro cao | **Đúng.** Rollback V0 khôi phục toàn bộ cấu trúc, tạo lại/xóa cứng task | Thu hẹp thành khôi phục có kiểm soát (dry-run + xác nhận) | [`change-control-design.md`](./change-control-design.md) §3 |
| 4 | Chưa có phần đánh giá hệ thống (ví dụ đánh giá kế hoạch AI tạo ra) | **Đúng.** Chỉ có unit/integration test, không có bộ đánh giá chất lượng AI | Kế hoạch đánh giá 4 nhóm E1–E4, có chuyên gia | [`evaluation-plan.md`](./evaluation-plan.md) |

---

## Góp ý 1 — App mobile là yêu cầu bắt buộc

**Hiện trạng đã kiểm chứng:**
- [`docs/mobile/ANDROID_ROADMAP.md`](../mobile/ANDROID_ROADMAP.md) đã chọn Expo React Native + TypeScript. **Giai đoạn 0 (backend) đã xong:** auth cho client mobile (`X-Client: android`), bảng `device_tokens`, kênh push FCM (chế độ giả lập), `GET /app/config`, xuất `mobile/openapi/openapi.json`.
- **Giai đoạn 1–3 (chính app) chưa bắt đầu.** Thư mục `mobile/` mới chỉ có tệp OpenAPI.
- Đề cương gửi GVHD trình bày gần như toàn bộ là chức năng web. App mobile không xuất hiện như một đóng góp.

**Nguyên nhân:** app mobile được lập kế hoạch như "app đồng hành" phụ, chưa được đưa vào đề cương.

**Khắc phục:**
1. Đổi tên/định vị đề tài: *"Xây dựng hệ thống lập kế hoạch và kiểm soát thay đổi dự án có AI hỗ trợ, gồm ứng dụng di động cho nhóm dự án"*. Tên chính thức do sinh viên và GVHD chốt.
2. App mobile thành **mô-đun trọng tâm số 1**, gồm: đăng nhập; việc của tôi + timer worklog; push + deep link; **duyệt CR trên điện thoại** (có mức tác động và xác nhận đã đọc báo cáo); chat dự án; dashboard; ghi giờ offline.
3. Các nội dung mang tính "di động" được trình bày trong báo cáo: lưu token an toàn (Android Keystore), refresh token xoay vòng single-flight, push FCM khi app ở nền, deep link, offline-first có đồng bộ và giải quyết xung đột, xử lý cold start máy chủ.
4. Đánh giá riêng cho mobile: SUS, hiệu năng, E2E Maestro (xem `evaluation-plan.md` §E3).

## Góp ý 2 — Khối lượng công việc quá nặng

**Hiện trạng:** BRD v2.4 liệt kê ngang hàng: phân cấp dự án, CPM, chat, thông báo, RBAC 34 quyền, 10 chức năng AI, CR 3 cấp, timesheet, versioning/rollback, Gantt, SRS/BRD DOCX, XLSX/EVA, BPMN, Investor dashboard. Khi thêm app mobile thì phạm vi còn lớn hơn.

**Khắc phục:** chia phạm vi thành 3 tầng (chi tiết `scope.md` §2):
- **Tầng A – Trọng tâm (đóng góp chính, có đánh giá):** (A1) app mobile, (A2) AI làm rõ yêu cầu và sinh kế hoạch WBS, (A3) kiểm soát thay đổi có con người quyết định.
- **Tầng B – Nền tảng kế thừa:** auth/RBAC, CPM, durable jobs, thông báo. Chỉ mô tả ở mức kiến trúc.
- **Tầng C – Ngoài trọng tâm:** BPMN, SRS/BRD DOCX, XLSX/EVA, Investor dashboard, tối ưu lịch/gợi ý nhân sự/quét rủi ro bằng AI. Mã vẫn giữ nhưng báo cáo chỉ nhắc ở mục "tính năng mở rộng" và **không cam kết đánh giá**.
- Cắt khỏi phạm vi đồ án: iOS, phát hành công khai Play Store, các giai đoạn 4–9 của lộ trình mobile, upload/bóc tách tài liệu bằng AI.

**Rủi ro còn lại:** chủ dự án chọn đủ 4 nhóm màn hình mobile (kể cả chat và offline), nên khối lượng tầng A vẫn lớn. Biện pháp: xếp **chat** và **offline timesheet** cuối hàng đợi mobile, có **điểm cắt** định trước (xem `tasks/thesis-revision-plan.md` §3). Nếu trễ tiến độ thì hai mục này chuyển sang "hướng phát triển" mà không ảnh hưởng phần đánh giá chính.

## Góp ý 3a — Không để AI ra quyết định với thay đổi quan trọng

**Hiện trạng đã kiểm chứng trong mã:**
- `backend/app/services/approval_service.py`: chỉ thành viên dự án có đúng vai trò BA/PO/PM của bước hiện hành được duyệt hoặc từ chối. Sai vai trò trả 403; admin chỉ xem. Không có đường nào để AI ghi quyết định.
- `backend/app/services/ai/impact_analyzer.py`: chỉ sinh báo cáo tác động (scope, timeline, budget, resource), **không có** khuyến nghị duyệt/từ chối.
- Câu trong đề cương/BRD §4.3 *"AI chạy Phân tích tác động … Thành viên đúng vai trò quyết định từng bước; từ chối phải nêu lý do"* đặt hai ý sát nhau nên dễ đọc thành AI tham gia quyết định. Câu "PM duyệt bước cuối" lại không nói rõ hai bước BA, PO trước đó cũng do người quyết định.
- **Thiếu thật:** CR không có phân loại mức tác động. CR thay đổi lớn và CR sửa chữ đi cùng một quy trình, và báo cáo tác động không bắt buộc với bất kỳ CR nào.

**Khắc phục (chi tiết `change-control-design.md` §1–2):**
1. Viết lại nguyên tắc thành văn: **AI chỉ tư vấn, không quyết định, không tự áp dụng thay đổi.** Đã cập nhật BRD v2.5 §1.2 và §4.3, SRS §3.10.
2. Thêm **mức tác động** `MINOR / MODERATE / MAJOR`. Người tạo đề xuất, AI gợi ý kèm lý do, **PM chốt**. Hạ mức từ MAJOR phải có lý do và ghi audit.
3. Ràng buộc cho CR MAJOR: phải có báo cáo tác động hợp lệ (hoặc đánh giá thủ công của PM nếu AI lỗi); **mỗi người duyệt phải xác nhận đã đọc** báo cáo; duyệt cũng bắt buộc ghi nhận xét; không cho duyệt nhanh từ nút trên thông báo mobile.
4. Báo cáo AI luôn gắn nhãn *"Khuyến nghị – không có giá trị quyết định"*, ghi rõ model và thời điểm sinh.

## Góp ý 3b — Rollback trong một transaction rủi ro cao

**Hiện trạng đã kiểm chứng:** `backend/app/services/versioning_service.py:236` (`rollback_to_version`) trong **một** transaction:
- khôi phục mọi trường của phase/sprint/epic/milestone/task, kể cả `status`, `progress`, `assignee_id`;
- **tạo lại** thực thể đã xóa với ID mới (trả `id_map`);
- **xóa cứng** task không có trong snapshot nếu task đó không có dữ liệu phụ thuộc, ngược lại thì lưu trữ (`archived_at`);
- đồng bộ lại toàn bộ dependency rồi tính lại CPM.

**Rủi ro chính:**
- **Transaction dài trên toàn dự án:** khóa hàng project trong thời gian lâu và dễ timeout trên Supabase Free với pool 5 kết nối.
- **Mất tiến độ thực tế:** `status` và `progress` bị ghi đè về giá trị cũ dù đã có worklog.
- **Phá vỡ tham chiếu bên ngoài:** ID mới làm hỏng link trong thông báo, chat và CR.
- **Không có bước xem trước:** PM bấm khôi phục mà không biết sẽ thay đổi những gì.
- **Khó kiểm thử đủ các tổ hợp** trong thời lượng đồ án.

**Khắc phục (chi tiết `change-control-design.md` §3):** thay bằng **khôi phục có kiểm soát**:
- Bắt buộc dry-run (`restore-preview`) trả danh sách thay đổi; PM xác nhận bằng `preview_token`. Nếu dữ liệu đã đổi kể từ lúc xem trước thì trả 409.
- Chỉ khôi phục **trường kế hoạch** (`start_date`, `due_date`, `estimated_hours`, dependency) của task **còn tồn tại** và chưa hoàn thành.
- Không xóa cứng, không tạo lại task. Task khác biệt được liệt kê để PM xử lý thủ công.
- Giới hạn số thay đổi mỗi lần để transaction ngắn. Vẫn tạo snapshot "trước khi khôi phục".
- Endpoint rollback V0 bị gỡ khỏi phạm vi đồ án.

## Góp ý 4 — Thiếu đánh giá hệ thống

**Hiện trạng:** chỉ có kiểm thử đơn vị/tích hợp (backend khoảng 811 test, frontend khoảng 248 test theo nhật ký 2026-10-24). Không có bộ dữ liệu, chỉ số hay quy trình đánh giá **chất lượng** đầu ra AI. Mục tiêu BRD "giảm 80% thời gian tạo WBS" chưa có căn cứ đo.

**Khắc phục (chi tiết `evaluation-plan.md`):**
- **E1 – Kế hoạch dự án do AI tạo (trọng tâm):** 20 kịch bản chuẩn, mỗi kịch bản chạy 3 lần; 7 chỉ số tự động (hợp lệ cấu trúc, độ phủ yêu cầu, bịa ngoài phạm vi, sai lệch ước lượng, độ ổn định, hiệu năng, độ chi tiết); 3–5 chuyên gia chấm mù rubric 6 tiêu chí, so với kế hoạch lập thủ công; đo thời gian tiết kiệm.
- **E2 – Phân tích tác động CR:** độ khớp mức tác động AI gợi ý với chuyên gia (accuracy, Cohen's kappa), precision/recall task bị ảnh hưởng.
- **E3 – App mobile:** E2E Maestro, SUS (≥ 8 người dùng), hiệu năng, tỷ lệ nhận push.
- **E4 – Hệ thống:** kiểm thử kiểm soát thay đổi, khôi phục, phân quyền.
- Mục tiêu "giảm 80%" được đổi thành **giả thuyết cần kiểm chứng** ở E1.

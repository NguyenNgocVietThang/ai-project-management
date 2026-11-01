# Kế hoạch triển khai điều chỉnh ĐATN

> Lập ngày 2026-11-01 theo 4 góp ý của GVHD. Hồ sơ đầy đủ: [`docs/thesis/`](../docs/thesis/README.md).
> **Quy tắc:** mỗi bước (B1…) phải trình kế hoạch chi tiết (tệp, migration, API, test) và **chờ chủ dự án xác nhận** trước khi code. Thay đổi đẩy thẳng lên `main` theo yêu cầu chủ dự án. Comment mã và tài liệu bằng tiếng Việt.
> Thời lượng là **ước lượng theo tuần làm việc**, chưa gắn hạn nộp đồ án. Cần chủ dự án cung cấp mốc nộp để xếp lịch thật.

## 1. Danh sách bước

| Bước | Nội dung | Góp ý | Phụ thuộc | Ước lượng | Trạng thái |
|---|---|---|---|---|---|
| **B0** | Hồ sơ điều chỉnh: phản hồi góp ý, phạm vi, thiết kế kiểm soát thay đổi, kế hoạch đánh giá; sửa câu chữ BRD/SRS/lộ trình mobile | 1–4 | — | 0,5 tuần | **Xong (2026-11-01)** |
| **B1** | Backend phân loại mức tác động CR + ràng buộc MAJOR + AI gợi ý mức (`change-control-design.md` §2); migration, service, schema, test | 3a | B0 | 1 tuần | **Xong (2026-11-01)**, xem [`b1-cr-impact-level-plan.md`](./b1-cr-impact-level-plan.md) §9 |
| **B2** | Web: huy hiệu mức, PM chốt/hạ mức, xác nhận đã đọc, nhãn "Khuyến nghị" trên báo cáo AI; i18n vi/en; test | 3a | B1 | 0,5 tuần | **Xong (2026-11-01)** |
| **B3** | Backend khôi phục có kiểm soát: `restore-preview`, `restore` + `preview_token`, giới hạn thay đổi, gỡ rollback V0; test §3.4 | 3b | B0 | 1 tuần | Chờ xác nhận |
| **B4** | Web: trang phiên bản hiển thị xem trước → xác nhận; bỏ nút rollback cũ | 3b | B3 | 0,5 tuần | Chờ |
| **B5** | Bộ công cụ đánh giá E1: 20 kịch bản, `run_plan_eval.py`, `plan_metrics.py` (M1–M7) + unit test, mẫu phiếu chấm chuyên gia | 4 | B0 | 1 tuần | Chờ xác nhận |
| **B6** | Mobile M1 (Giai đoạn 1 lộ trình): khung Expo, client API, đăng nhập, thông báo, Việc của tôi, timer | 1 | B0 | 2 tuần | Chờ xác nhận |
| **B7** | Mobile M2: FCM, deep link, duyệt CR có mức tác động + xác nhận đã đọc; nút duyệt nhanh chỉ cho MINOR/MODERATE | 1, 3a | B6, B1 | 1,5 tuần | Chờ |
| **B8** | Mobile M3: chat dự án | 1 | B6 | 1 tuần | Chờ — *điểm cắt 2* |
| **B9** | Mobile M4: dashboard + offline timesheet; build APK, E2E Maestro | 1 | B6 | 1,5 tuần | Chờ — *offline là điểm cắt 1* |
| **B10** | Chạy đánh giá E1–E4, thu phiếu chuyên gia và SUS, phân tích thống kê, lưu `docs/thesis/eval-results/` | 4 | B5, B1–B4, B7 | 1,5 tuần (xen kẽ) | Chờ |
| **B11** | Chốt tài liệu: SRS/BRD/README/ROADMAP khớp mã; `graphify update .`; tài liệu chương đánh giá | — | tất cả | 0,5 tuần | Chờ |

Tổng ước lượng khoảng 12–13 tuần nếu làm tuần tự. B5 và V1–V3 (soạn kịch bản, mời chuyên gia) có thể chạy song song với B1–B4.

## 2. Thứ tự đề xuất

1. **B1 → B3** trước: thay đổi nhỏ, khép lại góp ý 3, và mobile B7 cần API mới của B1.
2. **B5** ngay sau đó, đồng thời **liên hệ chuyên gia** vì đây là đường găng phụ thuộc người ngoài.
3. **B2, B4** (web) gọn, có thể làm xen với B6.
4. **B6 → B7** là phần tối thiểu bắt buộc của app mobile.
5. **B8, B9** theo điểm cắt.
6. **B10, B11** cuối, nhưng E1 có thể chạy ngay khi B5 xong vì không phụ thuộc mobile.

## 3. Điểm cắt khi trễ tiến độ

| Thứ tự cắt | Hạng mục | Ảnh hưởng |
|---|---|---|
| 1 | Offline timesheet (một phần B9) | Chuyển sang "hướng phát triển"; E3 bỏ ca offline |
| 2 | Chat mobile (B8) | Chat vẫn có trên web |
| 3 | E1.6 ablation, so sánh 2 model | Báo cáo là hạn chế |
| **Không cắt** | B1, B3, B5, B6, B7, E1.3–E1.4 | Là phần trả lời trực tiếp góp ý của GVHD |

## 4. Rủi ro

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Không đủ 3 chuyên gia hoặc chuyên gia trả phiếu muộn | Cao | Liên hệ ở tuần đầu; giới hạn khoảng 2 giờ/người; có phương án dự phòng chấm bằng LLM-as-judge **chỉ để tham khảo**, ghi rõ hạn chế |
| Quota/độ ổn định của provider AI miễn phí khi chạy 60 lần E1 | Trung bình | Chạy rải nhiều ngày; lưu đầu ra thô; script chạy tiếp được từ chỗ dừng |
| Chưa có Firebase project thật cho FCM | Trung bình | Tạo sớm ở B7; chế độ giả lập đã có cho test |
| Khối lượng mobile lớn (đủ 4 nhóm) | Cao | Điểm cắt §3; M1, M2 trước |
| Migration CR làm vỡ dữ liệu demo | Thấp | Có `downgrade`; CR cũ gán MODERATE; kiểm thử trên PostgreSQL cục bộ |

## 5. Nhật ký

| Ngày | Bước | Ghi chú |
|---|---|---|
| 2026-11-01 | B0 | Chủ dự án chốt Q1–Q4 (`docs/thesis/README.md`). Tạo hồ sơ `docs/thesis/`, sửa câu chữ BRD v2.5, SRS, ANDROID_ROADMAP. Chưa đổi mã |
| 2026-11-01 | B1 | Lập kế hoạch chi tiết. Phát hiện: chưa có API đọc báo cáo tác động đã lưu (F1); CR không sửa được sau khi tạo nên dùng revision của báo cáo thay revision của CR (F2) |
| 2026-11-01 | B1, B2 | Triển khai và đẩy `main` cùng lúc (quyết định D1). Backend 866 passed / 16 skipped (có PostgreSQL), frontend 348 test. Kiểm thử trình duyệt với backend thật: BA → PM → BA → PM trên CR MAJOR, màn hình 390px không tràn ngang |

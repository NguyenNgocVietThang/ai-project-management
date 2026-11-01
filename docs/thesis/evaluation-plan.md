# Kế hoạch đánh giá hệ thống

> Ngày: 2026-11-01. Trạng thái: **kế hoạch, chưa có số liệu**. Ngưỡng mục tiêu là đề xuất ban đầu, có thể chỉnh sau đợt chạy thử (pilot). Mọi điều chỉnh phải ghi lại kèm lý do để tránh "chỉnh ngưỡng theo kết quả".

## 0. Tổng quan

| Nhóm | Đối tượng | Câu hỏi đánh giá | Phương pháp |
|---|---|---|---|
| **E1** | Kế hoạch dự án do AI tạo (A2) | Kế hoạch có hợp lệ, đầy đủ, hợp lý, ổn định không? Có tiết kiệm thời gian không? | Chỉ số tự động + chuyên gia chấm mù + so sánh với kế hoạch thủ công |
| **E2** | Báo cáo tác động CR (A3) | AI gợi ý mức tác động và task bị ảnh hưởng có khớp với chuyên gia không? | So với đáp án chuyên gia |
| **E3** | App mobile (A1) | Có đúng chức năng, dễ dùng, đủ nhanh, ổn định không? | E2E Maestro, SUS, đo hiệu năng |
| **E4** | Hệ thống | Kiểm soát thay đổi và khôi phục có an toàn và đúng không? | Kiểm thử tự động theo kịch bản |

---

## E1. Đánh giá kế hoạch dự án do AI tạo

### E1.1 Bộ dữ liệu

- **20 kịch bản dự án** phủ 5 loại (web thương mại điện tử, app mobile, hệ thống nội bộ doanh nghiệp, tích hợp/di trú dữ liệu, dự án AI/dữ liệu) × 4 quy mô (khoảng 1, 3, 6, 12 tháng).
- Mỗi kịch bản gồm:
  1. `idea`: ý tưởng thô;
  2. `brief`: hồ sơ yêu cầu 7 mục **đã chốt sẵn**, để tách riêng bước sinh WBS khỏi bước hỏi làm rõ;
  3. `answers`: câu trả lời mẫu cho vòng hỏi làm rõ (dùng ở E1.6);
  4. nhãn: `key_features` nào bắt buộc phải có task, mục `out_of_scope`/`skipped` nào không được xuất hiện.
- **Kế hoạch tham chiếu thủ công** cho 6 kịch bản (mỗi loại ít nhất 1). Chuyên gia hoặc sinh viên lập bằng công cụ quen dùng (MS Project/Excel), có ghi lại thời gian lập.
- Lưu tại `backend/tests/fixtures/eval/scenarios/*.json` (dự kiến). Bộ dữ liệu được đóng băng (ghi mã băm) trước khi chạy chính thức.

### E1.2 Cấu hình chạy

- Mỗi kịch bản chạy **3 lần** qua đúng luồng sản phẩm (`generate-project-from-brief`, job thật) trên provider thật.
- Ghi lại: provider, model, tham số, phiên bản prompt (commit), thời gian, token, lỗi.
- Có tùy chọn so sánh **2 model** nếu quota cho phép (ví dụ model mặc định với một model khác). Đây là phần bổ sung, không bắt buộc.

### E1.3 Chỉ số tự động

| ID | Chỉ số | Cách tính | Mục tiêu đề xuất |
|---|---|---|---|
| M1 | Tỷ lệ hợp lệ cấu trúc | % lần chạy đạt: JSON đúng schema, dependency trỏ đúng task, **DAG không chu trình**, mọi task có ước lượng > 0, CPM tính được | ≥ 95% |
| M2 | Độ phủ yêu cầu | % `key_features` + `in_scope` được ánh xạ tới ≥ 1 task. Ánh xạ tự động bằng so khớp từ khóa/ngữ nghĩa, sau đó **người rà soát xác nhận** | ≥ 90% |
| M3 | Bịa ngoài phạm vi | Số task thuộc `out_of_scope` hoặc mục `skipped` trên mỗi kế hoạch (người rà soát xác nhận) | trung bình ≤ 0,2; không có vi phạm nghiêm trọng |
| M4 | Sai lệch ước lượng | MAPE của tổng giờ công và độ dài đường găng so với kế hoạch tham chiếu (6 kịch bản) | báo cáo; tham chiếu ≤ 30% |
| M5 | Độ ổn định | Jaccard tập phase và tập task (tên chuẩn hóa) giữa 3 lần chạy; hệ số biến thiên (CV) tổng giờ công | Jaccard phase ≥ 0,6; CV ≤ 20% |
| M6 | Hiệu năng & tin cậy | Thời gian sinh p50/p95, tỷ lệ job FAILED, token mỗi lần | báo cáo; FAILED ≤ 5% |
| M7 | Độ chi tiết | Số task, độ sâu WBS, % task > 40 giờ (quá thô), % task < 1 giờ (quá vụn) | % task > 40 giờ ≤ 10% |

Công cụ dự kiến: `backend/scripts/eval/run_plan_eval.py` (chạy kịch bản, lưu đầu ra thô) và `backend/scripts/eval/plan_metrics.py` (tính M1–M7). Hàm tính có unit test. Kết quả ghi ra `docs/thesis/eval-results/E1-*.csv` kèm thông tin cấu hình.

### E1.4 Đánh giá chuyên gia (chấm mù)

- **Chuyên gia:** 3–5 người có ≥ 2 năm kinh nghiệm PM/BA/Tech lead. Ghi lại hồ sơ kinh nghiệm (ẩn danh).
- **Mẫu chấm:** 6 kịch bản có kế hoạch tham chiếu, mỗi kịch bản 1 kế hoạch AI (lần chạy thứ nhất) và 1 kế hoạch thủ công, tổng **12 kế hoạch/chuyên gia** (khoảng 2 giờ).
- **Chấm mù:** hai loại kế hoạch được chuẩn hóa cùng định dạng bảng (WBS + thời lượng + phụ thuộc), ẩn nguồn và xáo trộn thứ tự cho từng chuyên gia.
- **Rubric Likert 1–5 (6 tiêu chí):**

| # | Tiêu chí | 1 | 5 |
|---|---|---|---|
| R1 | Đầy đủ so với yêu cầu | Thiếu nhiều hạng mục chính | Đủ mọi hạng mục chính |
| R2 | Phân rã công việc hợp lý | Lộn xộn, sai cấp | Rõ ràng, đúng cấp, kích thước task hợp lý |
| R3 | Thứ tự và phụ thuộc | Sai logic nghiêm trọng | Đúng logic, không thừa |
| R4 | Ước lượng thời lượng | Phi thực tế | Sát thực tế |
| R5 | Khả thi tổng thể | Không dùng được | Có thể triển khai |
| R6 | Mức sẵn sàng sử dụng | Phải làm lại > 50% | Sửa < 10% |

- Kèm câu hỏi mở: lỗi điển hình, thứ phải sửa đầu tiên.
- **Phân tích:** trung bình ± độ lệch chuẩn theo tiêu chí; so sánh AI với thủ công bằng kiểm định Wilcoxon signed-rank (cặp theo kịch bản và chuyên gia); độ đồng thuận giữa chuyên gia bằng Krippendorff's alpha (thứ bậc).
- **Mục tiêu đề xuất:** trung bình mỗi tiêu chí của kế hoạch AI ≥ 3,5; R1–R3 không thấp hơn thủ công có ý nghĩa thống kê. Nếu alpha < 0,6 thì báo cáo là hạn chế.

### E1.5 Thời gian tiết kiệm

- Đo **T_thủ công** (thời gian lập kế hoạch tham chiếu) và **T_AI** = thời gian vòng hỏi + thời gian sinh + **thời gian chuyên gia rà soát và sửa** kế hoạch AI đến mức chấp nhận được (đo trên ít nhất 3 kịch bản).
- Báo cáo mức giảm = 1 − T_AI / T_thủ công. Mục tiêu "giảm 80%" trong BRD cũ được xem là **giả thuyết**; báo cáo trung thực số đo được.

### E1.6 Vòng hỏi làm rõ yêu cầu

- Mô phỏng người dùng bằng `answers` có sẵn. Đo: số lượt trung bình, % mục chuyển sang `clear`, % câu hỏi trùng lặp.
- Chuyên gia chấm mức liên quan của câu hỏi (Likert 1–5) trên mẫu 5 phiên hội thoại.
- Thử nghiệm đối chứng (ablation, nếu đủ thời gian): sinh WBS **có** và **không có** bước làm rõ trên cùng ý tưởng, so sánh M2/M3.

---

## E2. Đánh giá báo cáo tác động CR

- **Dữ liệu:** 1–2 dự án mẫu (lấy từ E1) và **12–15 CR mẫu** trải đều 3 mức. Với mỗi CR, chuyên gia xác định trước **đáp án**: mức tác động và tập task bị ảnh hưởng.
- **Chỉ số:**
  - độ khớp `suggested_impact_level` với đáp án: accuracy và Cohen's kappa có trọng số;
  - precision/recall/F1 của tập task bị ảnh hưởng;
  - sai lệch số ngày trễ ước tính so với kết quả CPM sau khi áp dụng thay đổi thủ công;
  - chuyên gia chấm tính hữu ích của báo cáo (Likert 1–5).
- **Diễn giải:** kết quả chỉ chứng minh AI **hữu ích để tư vấn**. Kết quả tốt **không** được dùng để lập luận cho việc AI tự quyết định (nguyên tắc P1).

---

## E3. Đánh giá app mobile

| Hạng mục | Phương pháp | Mục tiêu đề xuất |
|---|---|---|
| Chức năng | Ca kiểm thử theo use case M1–M4; E2E **Maestro** cho luồng *đăng nhập → nhận push → mở CR → xác nhận đã đọc → duyệt → ghi giờ*; kiểm thử offline (bật chế độ máy bay giữa chừng) | 100% ca chính đạt |
| Kiểm thử đơn vị | Jest + RNTL cho auth store, interceptor refresh single-flight, hàng đợi offline, hook chính | các module lõi đều có test |
| Khả dụng | **SUS** với ≥ 8 người dùng (thành viên dự án/sinh viên) sau khi làm 5 nhiệm vụ; ghi tỷ lệ hoàn thành và thời gian mỗi nhiệm vụ | SUS ≥ 68 |
| Hiệu năng | Thời gian khởi động lạnh của app; thời gian tải danh sách việc (khi máy chủ đã thức / cold start Render); kích thước APK; bộ nhớ | báo cáo; khởi động ≤ 3 giây trên máy tầm trung |
| Push | Tỷ lệ push nhận được trong 30 giây khi app ở nền/đã đóng, trên N lần gửi | ≥ 90% |
| Tương thích | 2–3 thiết bị hoặc emulator, Android 10–14 | chạy ổn định |
| Bảo mật | Token trong SecureStore; refresh xoay vòng không văng phiên khi nhiều request song song; không lộ dữ liệu dự án của người không phải thành viên | đạt |

---

## E4. Kiểm thử hệ thống (kiểm soát thay đổi, khôi phục)

- **Kiểm soát thay đổi:** kịch bản cho mọi ô trong bảng `change-control-design.md` §2.3 (MAJOR thiếu báo cáo, báo cáo cũ, thiếu xác nhận, hạ mức không lý do, đổi mức giữa chừng mở lại bước, duyệt nhanh MAJOR từ thông báo bị chặn, AI lỗi thì dùng đánh giá thủ công).
- **Khôi phục:** toàn bộ danh sách tại `change-control-design.md` §3.4.
- **Phân quyền:** sai vai trò trả 403, admin chỉ xem, người ngoài dự án không xem được CR/báo cáo, kiểm tra IDOR trên endpoint mới.
- **Hồi quy:** toàn bộ test backend/frontend hiện có vẫn đạt.
- Báo cáo: số ca, tỷ lệ đạt, độ phủ mã của các service liên quan.

---

## 5. Hạn chế và yếu tố ảnh hưởng tính hợp lệ (đưa vào báo cáo)

- Số chuyên gia và kịch bản nhỏ, nên kết quả mang tính chỉ báo, không khái quát hóa.
- Kịch bản do người thực hiện đồ án soạn nên có thể thiên lệch. Giảm thiểu: chuyên gia rà soát kịch bản trước khi chạy.
- Model AI miễn phí có thể thay đổi theo thời gian. Giảm thiểu: ghi phiên bản model và thời điểm chạy, lưu toàn bộ đầu ra thô.
- Chấm mù có thể bị lộ do phong cách trình bày. Giảm thiểu: chuẩn hóa định dạng và tên task.
- Đo SUS trên sinh viên chưa đại diện cho người dùng doanh nghiệp.

## 6. Lịch thực hiện đánh giá

| Bước | Việc | Phụ thuộc |
|---|---|---|
| V1 | Soạn 20 kịch bản + nhờ 1 chuyên gia rà soát; **liên hệ chuyên gia sớm** | — |
| V2 | Viết script E1 + unit test cho chỉ số; pilot 3 kịch bản; chốt ngưỡng | V1 |
| V3 | Lập 6 kế hoạch tham chiếu thủ công (ghi thời gian) | V1 |
| V4 | Chạy E1 chính thức (20 × 3); gửi phiếu chấm chuyên gia | V2, V3 |
| V5 | E2 sau khi xong B1 (mức tác động) | B1 |
| V6 | E3 sau khi app đạt M2; SUS sau khi đủ M1–M3 | Mobile |
| V7 | Tổng hợp, phân tích thống kê, viết chương đánh giá | V4–V6 |

# Thiết kế kiểm soát thay đổi (KH-CR, KH-VER)

> Ngày: 2026-11-01. Trạng thái: **§2 đã triển khai (B1 backend + B2 web, 2026-11-01)**, chi tiết tại [`tasks/b1-cr-impact-level-plan.md`](../../tasks/b1-cr-impact-level-plan.md). **§3 chưa triển khai** (B3, B4).
>
> Điều chỉnh so với bản nháp khi triển khai: (1) CR không sửa được sau khi tạo nên không dùng revision của CR; thay bằng `impact_reports.revision`, tăng mỗi lần báo cáo bị ghi đè, và người duyệt xác nhận theo revision này. (2) Thêm `GET /change-requests/{id}/impact-report`, vì trước đó báo cáo chỉ hiển thị từ kết quả job nên tải lại trang là mất. (3) Mã lỗi `impact_report_stale` được thay bằng `impact_report_changed`.

## 1. Nguyên tắc (áp dụng cho toàn hệ thống)

| # | Nguyên tắc | Cách bảo đảm |
|---|---|---|
| P1 | **AI chỉ tư vấn, không quyết định.** | AI không có đường ghi vào bảng `approvals`; quyết định chỉ đến từ API duyệt do người dùng đã xác thực gọi, đúng vai trò của bước |
| P2 | **AI không tự áp dụng thay đổi vào kế hoạch.** | Kết quả AI (báo cáo tác động, đề xuất lịch) chỉ được lưu dạng đề xuất. PM chỉnh kế hoạch thủ công hoặc bấm áp dụng có xác nhận |
| P3 | **Thay đổi càng lớn, kiểm soát của con người càng chặt.** | Mức tác động quyết định các ràng buộc ở §2.3 |
| P4 | **Mọi quyết định truy vết được.** | Audit log ghi người quyết định, vai trò, mức tác động tại thời điểm quyết định, ID báo cáo đã đọc |
| P5 | **Thao tác khó đảo ngược phải xem trước.** | Khôi phục phiên bản bắt buộc dry-run (§3) |

Hiện trạng: P1–P4 đã có trong mã (P3 từ 2026-11-01). P5 chờ B3.

## 2. Phân loại mức tác động CR

### 2.1 Mức

| Mức | Ý nghĩa (hướng dẫn cho người dùng) | Gợi ý định lượng cho AI (tham khảo, chốt ở B1) |
|---|---|---|
| `MINOR` | Sửa nhỏ, không đổi đường găng, không đổi ngân sách đáng kể | trễ ≤ 2 ngày **và** không task găng bị ảnh hưởng **và** chi phí ≤ 2% |
| `MODERATE` | Ảnh hưởng một phần lịch hoặc nguồn lực | các trường hợp còn lại |
| `MAJOR` | Đổi phạm vi chính, đổi đường găng/mốc, chi phí hoặc thời gian lớn | trễ ≥ 10 ngày **hoặc** ≥ 10% tổng thời lượng **hoặc** chi phí ≥ 10% **hoặc** đổi milestone |

### 2.2 Ai đặt mức

1. **Người tạo CR** chọn mức đề xuất khi tạo (mặc định `MODERATE`).
2. **AI** (trong báo cáo tác động) trả thêm `suggested_impact_level` kèm lý do. Đây chỉ là gợi ý, hệ thống không tự đổi mức.
3. **PM chốt mức** (`impact_level_confirmed_by`, `impact_level_confirmed_at`) trước khi bước BA được quyết định. Nâng mức thì không cần lý do. **Hạ mức từ MAJOR bắt buộc nêu lý do** và ghi audit.
4. Mức đã chốt được lưu cùng từng quyết định duyệt. Nếu PM đổi mức giữa chừng thì các bước đã duyệt dưới mức thấp hơn được **mở lại**.

### 2.3 Ràng buộc theo mức

| Ràng buộc | MINOR | MODERATE | MAJOR |
|---|---|---|---|
| Chuỗi duyệt | BA → PO → PM | BA → PO → PM | BA → PO → PM |
| Báo cáo tác động AI | Tùy chọn | Khuyến nghị (UI nhắc) | **Bắt buộc** trước bước đầu tiên |
| Báo cáo đổi (chạy lại AI) sau khi người duyệt đọc | — | — | **Chặn duyệt**, phải đọc và xác nhận revision mới (`impact_report_changed`) |
| AI lỗi / hết quota | — | — | PM nhập **đánh giá tác động thủ công** thay thế (đánh dấu nguồn `MANUAL`) |
| Xác nhận "đã đọc báo cáo" | Không | Không | **Bắt buộc** với mọi người duyệt |
| Nhận xét khi **duyệt** | Không | Không | **Bắt buộc** |
| Lý do khi từ chối | Bắt buộc | Bắt buộc | Bắt buộc |
| Duyệt nhanh từ thông báo mobile | Cho phép | Cho phép | **Không cho phép** |

### 2.4 Thay đổi dữ liệu dự kiến (nháp)

- `change_requests`: thêm `impact_level` (enum), `impact_level_confirmed_by_id`, `impact_level_confirmed_at`, `impact_level_change_reason`, `content_revision` (tăng mỗi lần sửa nội dung để phát hiện báo cáo cũ).
- `impact_reports`: thêm `suggested_impact_level`, `source` (`AI` | `MANUAL`), `cr_revision` (revision CR lúc sinh), `model_name`.
- `approvals`: thêm `impact_level_at_decision`, `acknowledged_report_id`.
- Migration Alembic có `downgrade`. CR cũ được gán `MODERATE` và coi như PM đã chốt bởi hệ thống (ghi chú migration).

### 2.5 Lỗi trả về dự kiến

| Tình huống | Mã |
|---|---|
| MAJOR, chưa có báo cáo hợp lệ | 422 `impact_report_required` |
| Revision báo cáo đã xác nhận khác revision hiện tại | 422 `impact_report_changed` |
| MAJOR, thiếu xác nhận đã đọc / nhận xét | 422 `acknowledgement_required` / `comment_required` |
| Mức chưa được PM chốt | 422 `impact_level_unconfirmed` |
| Hạ mức MAJOR không có lý do | 422 `reason_required` |

### 2.6 Giao diện

- Web và mobile: huy hiệu mức tác động trên danh sách và chi tiết CR; khung báo cáo AI có nhãn **"Khuyến nghị – không có giá trị quyết định"**, model và thời điểm sinh; mức AI gợi ý hiển thị cạnh mức đã chốt.
- CR MAJOR: nút Duyệt chỉ bật khi đã tick "Tôi đã đọc báo cáo tác động" và nhập nhận xét.

## 3. Khôi phục phiên bản có kiểm soát (thay rollback V0)

### 3.1 Phạm vi khôi phục

| Đối tượng | V0 (hiện tại) | Khôi phục có kiểm soát (mới) |
|---|---|---|
| Trường task | Mọi trường kể cả `status`, `progress`, `assignee_id`, `phase_id`… | Chỉ **trường kế hoạch**: `start_date`, `due_date`, `estimated_hours` |
| Task đã xóa sau snapshot | Tạo lại với ID mới | **Không tạo lại**, chỉ liệt kê cảnh báo |
| Task mới sau snapshot | Xóa cứng hoặc lưu trữ | **Giữ nguyên**, chỉ liệt kê cảnh báo |
| Task `DONE` hoặc có `actual_start` | Ghi đè | **Bỏ qua**, liệt kê cảnh báo |
| Dependency | Đồng bộ toàn bộ | Thêm/xóa/sửa `lag_days` **chỉ giữa các task còn tồn tại**; kiểm tra không tạo chu trình trước khi ghi |
| Phase/Sprint/Epic/Milestone | Khôi phục mọi trường hoặc tạo lại | Chỉ ngày bắt đầu/kết thúc của thực thể còn tồn tại |
| Snapshot "trước khi khôi phục" | Có | Có |
| CPM | Tính lại | Tính lại (qua job nếu dự án lớn, giữ cơ chế hiện có) |

### 3.2 Luồng hai bước

1. `POST /projects/{id}/versions/{vid}/restore-preview` (PM): **không ghi dữ liệu**, trả về:
   - `changes`: danh sách `{entity, id, field, current, restored}`;
   - `skipped`: các mục bị bỏ qua kèm lý do (`task_deleted`, `task_new`, `task_done`, `would_create_cycle`…);
   - `preview_token`: chữ ký HMAC của (project_id, version_id, mã băm trạng thái các trường liên quan, hạn 10 phút).
2. `POST /projects/{id}/versions/{vid}/restore` với `preview_token` (PM):
   - băm lại trạng thái hiện tại; nếu khác thì trả **409 `preview_outdated`** và yêu cầu xem trước lại;
   - nếu số thay đổi vượt `RESTORE_MAX_CHANGES` (đề xuất 500) thì trả 422 để transaction luôn ngắn;
   - áp dụng đúng tập `changes` đã xem trước trong **một transaction ngắn** (chỉ UPDATE và INSERT/DELETE dependency), ghi audit.
3. Endpoint `/{id}/rollback` (V0) bị gỡ hoặc trả 410. Quyết định chọn cách nào được chốt ở B3.

### 3.3 Vì sao rủi ro thấp hơn

- Không tạo hay xóa task nên không đổi ID và không vỡ tham chiếu từ thông báo, chat, CR.
- Không chạm `status`, `progress` hay worklog, nên dữ liệu thực tế không bị mất.
- Transaction chỉ gồm các lệnh UPDATE có giới hạn số lượng, khóa ngắn, hợp với pool kết nối nhỏ.
- Có token xem trước, nên **điều PM thấy đúng là điều được áp dụng**. Trường hợp chạy đồng thời bị chặn bằng 409.
- Vẫn đảo ngược được nhờ snapshot "trước khi khôi phục".

### 3.4 Kiểm thử bắt buộc (đưa vào E4)

Kết quả preview khớp kết quả áp dụng; dữ liệu đổi giữa preview và restore cho 409; hai PM khôi phục đồng thời; task DONE không bị đổi; dependency tạo chu trình bị bỏ qua; vượt giới hạn cho 422; lỗi giữa chừng không để lại thay đổi dở; khôi phục ngược bằng snapshot "trước khi khôi phục".

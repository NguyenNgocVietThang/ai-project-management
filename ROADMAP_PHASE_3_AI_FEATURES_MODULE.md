# Roadmap: AI Features Module (Phase 3)

> **Phiên bản:** 1.4 | **Cập nhật:** 2026-09-13  
> **Trạng thái:** AI Project Generator (SOP-AI-001) đã chạy thật end-to-end kèm UI hoàn chỉnh (endpoint `/ai` đã mount, Celery `ai_tasks.generate_project_task` ghi Project/Phase/Task/Dependency thật, `AIGeneratorModal.tsx` cho phép nhập prompt và theo dõi job từ trang Projects). 4 SOP còn lại (Impact Analysis, Schedule Optimization, Resource Recommendation, Risk Analysis) vẫn là stub `TODO`, chưa có UI.  
> **Mức độ ưu tiên:** Critical – Lớp trí tuệ nhân tạo cốt lõi của hệ thống  
> **Điều kiện tiên quyết:** [x] Phase 1 (Auth & RBAC) & Phase 2 (Portfolio, Project Core, CPM & Real-time Chat) đã hoàn thành

---

## Tổng quan Module

Module **AI Features (Phase 3)** tích hợp trí tuệ nhân tạo (xKiro — cổng AI tương thích OpenAI, gộp nhiều model miễn phí như DeepSeek, Qwen, Mistral sau 1 API key) vào toàn bộ quy trình quản lý dự án nhằm tự động hóa việc lập kế hoạch, phân tích rủi ro, cân bằng nguồn lực và đánh giá tác động thay đổi theo chuẩn SOP.

### 5 Trụ cột AI chính:
1. **AI Project Generator (SOP-AI-001):** Sinh WBS (Phases, Tasks, Estimated Hours, Dependencies) tự động từ prompt ngôn ngữ tự nhiên hoặc prompt templates.
2. **AI Impact Analysis (SOP-AI-002):** Phân tích tác động đa chiều (Timeline, Budget, Resource, Critical Path) khi có Change Request.
3. **AI Schedule Optimization (SOP-AI-003):** Tối ưu hóa tiến độ, cân bằng workload, loại trừ ngày nghỉ (bảng `leaves`), đa mục tiêu (Time - Cost - Quality).
4. **AI Resource Recommendation (SOP-RM-001 / SOP-AI-004):** Đề xuất phân bổ nhân sự thông minh theo kỹ năng (`user_skills`), chi phí (`hourly_rate`), khối lượng công việc hiện tại và dữ liệu lịch sử.
5. **AI Risk Analysis (SOP-AI-005):** Phân tích & nhận diện rủi ro định kỳ, phân loại ma trận rủi ro 5x5, gợi ý chiến lược giảm thiểu rủi ro.

Mỗi trụ cột dùng một model xKiro riêng theo mức độ phức tạp của việc (xem `backend/app/services/ai/model_router.py`), thay vì một model cố định cho tất cả.

---

## Hiện trạng & Hạ tầng sẵn có

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| AI Provider Abstraction (`BaseAIProvider`) | Đã có | `backend/app/services/ai/base.py` |
| xKiro Provider (`XkiroProvider`) | Đã có | `backend/app/services/ai/xkiro_provider.py` — provider AI duy nhất |
| AI Model Router (`resolve_model`, `AITaskType`) | Đã có | `backend/app/services/ai/model_router.py` |
| AI Project Generator Engine (`generate_project_from_prompt`) | Đã có, chạy thật | `backend/app/services/ai/project_generator.py` |
| Endpoint `/ai/generate-project`, `/ai/jobs/{id}` | Đã mount | `backend/app/api/v1/endpoints/ai.py` |
| Celery Worker + Redis Broker | Đã có | `backend/app/workers/celery_app.py` & `ai_tasks.py` |
| Database Models: `ai_requests`, `ai_outputs`, `risk_reports` | Đã migrate | Sẵn sàng lưu trữ lịch sử và kết quả AI |
| CPM Engine (Topological Sort + Forward/Backward Pass) | Đã có | `app/utils/cpm.py` + `app/services/scheduling_service.py` (không có `cpm_service.py`) |
| User Skills & Leaves Schema | Đã migrate | `user_skills`, `skills`, `leaves` |
| AI API Key cấu hình trong `.env` | Đã có | `XKIRO_API_KEY`, `XKIRO_BASE_URL`, `XKIRO_MODEL_*` |

---

## Danh mục tính năng triển khai theo Phase

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| AI Provider Abstraction Layer | Core | Critical | Hoàn thành | `BaseAIProvider`, `XkiroProvider`, `model_router.py` | — (chỉ 1 provider, không cần Switcher UI) |
| AI Project Generator Engine | SOP-AI-001 | Critical | Hoàn thành, chạy thật | `project_generator.py` gọi qua endpoint `/ai/generate-project`; Celery `generate_project_task` ghi Project/Phase/Task/Dependency thật | `AIGeneratorModal.tsx` (trang Projects) |
| AI Impact Analysis | SOP-AI-002 | High | Chưa bắt đầu | Service chưa tồn tại; `impact_analysis_task` là stub | Chưa có |
| AI Schedule Optimization | SOP-AI-003 | High | Chưa bắt đầu | Service chưa tồn tại; `optimize_schedule_task` là stub | Chưa có |
| AI Resource Recommendation | SOP-AI-004 | High | Chưa bắt đầu | Service chưa tồn tại | Chưa có |
| AI Risk Analysis & Periodic Scan | SOP-AI-005 | Medium | Chưa bắt đầu | Service chưa tồn tại; `risk_analysis_task` là stub, không có Celery Beat entry | Chưa có |

---

## Chi tiết kế hoạch triển khai

### GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure
> **Trạng thái:** Đã hoàn thành
- `BaseAIProvider` (`backend/app/services/ai/base.py`): Abstract base class với `generate_text` và `generate_json`.
- `XkiroProvider` (`backend/app/services/ai/xkiro_provider.py`): Tích hợp xKiro qua SDK `openai` (base URL riêng), chọn model theo `AITaskType` từ `model_router.py`.
- `project_generator.py`: Hàm `generate_project_from_prompt(prompt)` gọi `XkiroProvider.generate_json()`.

### GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001)
> **Trạng thái:** Đã hoàn thành
- Backend: mount router `/ai` (`generate-project`, `jobs/{id}`), `generate_project_task` sinh Project/Phase/Task/Dependency thật và ghi `ai_requests`/`ai_outputs`; `AIResultResponse` trả thêm `project_id` để frontend điều hướng sau khi job xong.
- Frontend: nút "Generate with AI" trên trang Projects mở `AIGeneratorModal.tsx` (`frontend/src/features/ai/`) — nhập prompt, poll trạng thái job qua React Query tới khi COMPLETED/FAILED, rồi điều hướng tới project vừa tạo.

### GIAI ĐOẠN 3.3 – AI Impact Analysis (SOP-AI-002)
> **Trạng thái:** Kế hoạch tiếp theo
- Phân tích tác động khi PO duyệt Change Request hoặc PM kích hoạt thủ công.
- Đánh giá Timeline slippage, Budget delta, Resource overload và đường găng Critical Path.

### GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)
> **Trạng thái:** Kế hoạch tiếp theo
- AI tính toán nén tiến độ (Fast-tracking / Crashing), loại trừ ngày nghỉ của nhân sự (`leaves`) và đề xuất lịch trình mới.

### GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004)
> **Trạng thái:** Kế hoạch tiếp theo
- Đề xuất nhân sự tối ưu dựa trên kỹ năng (`user_skills`), khối lượng công việc hiện tại và chi phí (`hourly_rate`).

### GIAI ĐOẠN 3.6 – AI Risk Analysis (SOP-AI-005)
> **Trạng thái:** Kế hoạch tiếp theo
- Quét định kỳ qua Celery Beat để phát hiện sớm các nguy cơ trễ hạn, quá tải hoặc vượt ngân sách.

---

*Cập nhật lần cuối: 2026-09-13 — Phase 3 (AI Features) — Giai đoạn 3.2 hoàn thành: `AIGeneratorModal.tsx` + `AIResultResponse.project_id` để điều hướng sau khi AI tạo project xong. 4 SOP còn lại (3.3–3.6) vẫn chưa triển khai.*

# Roadmap: AI Features Module (Phase 3)

> **Phiên bản:** 1.3 | **Cập nhật:** 2026-09-16  
> **Trạng thái:** ~30% — SOP-AI-001 (AI Project Generator) đã chạy thật đầu-cuối: endpoint `/ai` đã mount, Celery task `generate_project_task` ghi Project/Phase/Task/Dependency thật, có UI `AIGeneratorModal.tsx`. 4 trụ cột AI còn lại (Impact Analysis, Schedule Optimization, Resource Recommendation, Risk Analysis) vẫn là Celery task stub `TODO`, chưa có service, chưa có UI. 
> **Mức độ ưu tiên:** Critical – Lớp trí tuệ nhân tạo cốt lõi của hệ thống  
> **Điều kiện tiên quyết:** [x] Phase 1 (Auth & RBAC) & Phase 2 (Portfolio, Project Core, CPM & Real-time Chat) đã hoàn thành

---

## Tổng quan Module

Module **AI Features (Phase 3)** tích hợp trí tuệ nhân tạo vào toàn bộ quy trình quản lý dự án nhằm tự động hóa việc lập kế hoạch, phân tích rủi ro, cân bằng nguồn lực và đánh giá tác động thay đổi theo chuẩn SOP.

### 5 Trụ cột AI chính:
1. **AI Project Generator (SOP-AI-001):** Sinh WBS (Phases, Tasks, Estimated Hours, Dependencies) tự động từ prompt ngôn ngữ tự nhiên hoặc prompt templates.
2. **AI Impact Analysis (SOP-AI-002):** Phân tích tác động đa chiều (Timeline, Budget, Resource, Critical Path) khi có Change Request.
3. **AI Schedule Optimization (SOP-AI-003):** Tối ưu hóa tiến độ, cân bằng workload, loại trừ ngày nghỉ (bảng `leaves`), đa mục tiêu (Time - Cost - Quality).
4. **AI Resource Recommendation (SOP-RM-001 / SOP-AI-004):** Đề xuất phân bổ nhân sự thông minh theo kỹ năng (`user_skills`), chi phí (`hourly_rate`), khối lượng công việc hiện tại và dữ liệu lịch sử.
5. **AI Risk Analysis (SOP-AI-005):** Phân tích & nhận diện rủi ro định kỳ, phân loại ma trận rủi ro 5x5, gợi ý chiến lược giảm thiểu rủi ro.

---

## Hiện trạng & Hạ tầng sẵn có

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| AI Provider Abstraction (`BaseAIProvider`) | Đã có | `backend/app/services/ai/base.py` |
| xKiro Provider (`XkiroProvider`, cổng tương thích OpenAI, nhiều model miễn phí) | Đã có | `backend/app/services/ai/xkiro_provider.py` — đã thay thế các provider OpenAI/Gemini riêng lẻ trước đây |
| Model Router theo loại tác vụ AI (`AITaskType` -> model xKiro) | Đã có | `backend/app/services/ai/model_router.py` |
| AI Project Generator Engine (`generate_project_from_prompt`) | Đã có, đã nối endpoint + worker | `backend/app/services/ai/project_generator.py`, gọi từ `workers/ai_tasks.py` |
| `AIService` điều phối vòng đời `AIRequest` (queue + poll trạng thái) | Đã có | `backend/app/services/ai_service.py` |
| Celery Worker + Redis Broker | Đã có | `backend/app/workers/celery_app.py` & `ai_tasks.py` (`generate_project_task` chạy thật; 4 task còn lại vẫn là stub `TODO`) |
| Database Models: `ai_requests`, `ai_outputs` | Đã migrate, đang dùng thật | Ghi nhận job AI Project Generator; chưa có model `risk_reports` |
| CPM Engine (Topological Sort + Forward/Backward Pass) | Đã có | `app/utils/cpm.py` + `app/services/scheduling_service.py`, mount read-only tại `/api/v1/projects/{id}/cpm` (`endpoints/cpm.py`) |
| User Skills & Leaves Schema | Đã migrate | `user_skills`, `skills`, `leaves` — endpoint `/leaves`, `/skills` vẫn chưa mount (Phase 2) |
| AI API Keys cấu hình trong `.env` | Đã có | `XKIRO_API_KEY`, `XKIRO_BASE_URL`, các biến định tuyến model theo tác vụ (`XKIRO_MODEL_*`) |

---

## Danh mục tính năng triển khai theo Phase

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| AI Provider Abstraction Layer | Core | Critical | Hoàn thành | `BaseAIProvider`, `XkiroProvider`, `model_router.py` | — (chưa có Provider Switcher UI) |
| AI Project Generator Engine | SOP-AI-001 | Critical | Hoàn thành | `project_generator.py` được gọi từ `ai_tasks.generate_project_task` (ghi Project/Phase/Task/Dependency thật); endpoint `POST /ai/generate-project` + `GET /ai/jobs/{id}` đã mount qua `AIService` | `AIGeneratorModal.tsx`, `useAIGenerator.ts` |
| AI Impact Analysis | SOP-AI-002 | High | Chưa bắt đầu | Service chưa tồn tại; `impact_analysis_task` là stub | Chưa có |
| AI Schedule Optimization | SOP-AI-003 | High | Chưa bắt đầu | Service chưa tồn tại | Chưa có |
| AI Resource Recommendation | SOP-AI-004 | High | Chưa bắt đầu | Service chưa tồn tại | Chưa có |
| AI Risk Analysis & Periodic Scan | SOP-AI-005 | Medium | Chưa bắt đầu | Service chưa tồn tại; không có Celery Beat entry | Chưa có |

---

## Chi tiết kế hoạch triển khai

### GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure
> **Trạng thái:** Đã hoàn thành — kiến trúc provider đã đổi từ nhiều SDK riêng (OpenAI/Gemini) sang một cổng xKiro duy nhất
- `BaseAIProvider` (`backend/app/services/ai/base.py`): Abstract base class với `generate_text` và `generate_json`.
- `XkiroProvider` (`backend/app/services/ai/xkiro_provider.py`): Gọi xKiro — cổng tương thích OpenAI SDK, gộp nhiều model miễn phí (DeepSeek, Mistral, GLM, ...) sau một API key duy nhất; không còn `OpenAIProvider`/`GeminiProvider` riêng lẻ.
- `model_router.py` (`backend/app/services/ai/model_router.py`): Định tuyến model xKiro theo từng loại tác vụ (`AITaskType`), đọc từ biến môi trường `XKIRO_MODEL_*` nên đổi model không cần sửa code.
- `ProjectGeneratorService` (`backend/app/services/ai/project_generator.py`): Hàm `generate_project_from_prompt(prompt)` gọi Provider tương ứng.

### GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001)
> **Trạng thái:** Đã hoàn thành
- Backend: `AIService` (`app/services/ai_service.py`) tạo bản ghi `AIRequest` và xếp hàng Celery; `POST /api/v1/ai/generate-project` (202 Accepted) trả `job_id`, `GET /api/v1/ai/jobs/{job_id}` để poll trạng thái. `ai_tasks.generate_project_task` gọi `generate_project_from_prompt`, ghi thật Project + Phase + Task + Dependency qua `ProjectService`/`WBSService`/`TaskService`, lưu kết quả vào `AIOutput`.
- Frontend: `AIGeneratorModal.tsx` + `useAIGenerator.ts` (`useGenerateProject`, `useAIJob` poll 2 giây khi đang PENDING/PROCESSING), gắn vào trang danh sách dự án.

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

*Cập nhật lần cuối: 2026-09-16 — Phase 3 (AI Features) — đối soát với mã nguồn: SOP-AI-001 (AI Project Generator) đã chạy thật đầu-cuối kèm UI; Provider layer đã đổi sang xKiro; 4 trụ cột AI còn lại (3.3–3.6) vẫn chưa triển khai.*

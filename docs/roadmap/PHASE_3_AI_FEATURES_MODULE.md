# Roadmap: AI Features Module (Phase 3)

> **Phiên bản:** 1.4 | **Cập nhật:** 2026-09-17  
> **Trạng thái:** 100% — Cả 5 trụ cột AI đã chạy thật đầu-cuối. SOP-AI-001 (AI Project Generator): endpoint `/ai/generate-project`, Celery task `generate_project_task` ghi Project/Phase/Task/Dependency thật, UI `AIGeneratorModal.tsx`. SOP-AI-002 (Impact Analysis): CRUD Change Request tối giản mới + `impact_analyzer.py` + `POST /ai/impact-analysis`, ghi bảng `impact_reports`, UI tại `/projects/{id}/change-requests`. SOP-AI-003 (Schedule Optimization): `schedule_optimizer.py` (chỉ đề xuất, không tự ghi đè lịch) + `POST /ai/optimize-schedule`, UI tại `/projects/{id}/ai-insights`. SOP-AI-004 (Resource Recommendation): `resource_recommender.py` (kết hợp chấm điểm định lượng + AI xếp hạng) + `POST /ai/resource-recommendation`, UI cùng trang `ai-insights`. SOP-AI-005 (Risk Analysis): `risk_analyzer.py` + `POST /ai/risk-analysis`, ghi bảng `risk_reports`, quét định kỳ qua Celery Beat (`ai.sweep_active_projects_for_risk`, 08:30 hằng ngày), UI `RiskWidget` tại `ai-insights`.
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
| Change Request CRUD (nền cho SOP-AI-002) | — | High | Hoàn thành (tối giản) | `change_request_service.py`, `endpoints/change_requests.py` — create/list/get/submit, không có workflow duyệt nhiều bước | `features/change-requests/**` |
| AI Impact Analysis | SOP-AI-002 | High | Hoàn thành | `impact_analyzer.py` gọi từ `ai_tasks.impact_analysis_task`, ghi bảng `impact_reports`; `POST /ai/impact-analysis` | `ChangeRequestDetail.tsx` tại `/projects/{id}/change-requests` |
| AI Schedule Optimization | SOP-AI-003 | High | Hoàn thành | `schedule_optimizer.py` gọi từ `ai_tasks.optimize_schedule_task` (chỉ đề xuất, không ghi đè Task); `POST /ai/optimize-schedule` | `SchedulePanel.tsx` tại `/projects/{id}/ai-insights` |
| AI Resource Recommendation | SOP-AI-004 | High | Hoàn thành | `resource_recommender.py` gọi từ `ai_tasks.resource_recommendation_task`; `POST /ai/resource-recommendation` | `ResourceRecommendationPanel.tsx` tại `/projects/{id}/ai-insights` |
| AI Risk Analysis & Periodic Scan | SOP-AI-005 | Medium | Hoàn thành | `risk_analyzer.py` gọi từ `ai_tasks.risk_analysis_task`, ghi bảng `risk_reports`; `POST /ai/risk-analysis`; Celery Beat `ai.sweep_active_projects_for_risk` (08:30 hằng ngày, quét mọi project ACTIVE) | `RiskWidget.tsx` tại `/projects/{id}/ai-insights` |

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
> **Trạng thái:** Đã hoàn thành
- `ChangeRequest` trước đây chỉ là stub CRUD không auth, chưa mount router — đã xây CRUD tối giản thật (`change_request_service.py`, `endpoints/change_requests.py`: create/list/get/submit DRAFT→SUBMITTED) làm nền, không có workflow duyệt nhiều bước (bảng `approvals` vẫn là stub, để lại cho một plan riêng).
- `impact_analyzer.py`: nạp Project/Task/Dependency, tính CPM (`compute_cpm_for_project`), gọi AI qua `AITaskType.IMPACT_ANALYSIS`, kẹp/validate risk_score/risk_level/affected_task_ids trước khi ghi `impact_reports` (upsert theo `change_request_id`).
- Endpoint `POST /api/v1/ai/impact-analysis` (xếp hàng qua `AIRequest`/Celery, poll `GET /ai/jobs/{id}` — cùng pattern SOP-AI-001).
- UI: trang `/projects/{id}/change-requests` (danh sách, tạo mới, chi tiết + nút "Run Impact Analysis" + hiển thị report theo risk_level).

### GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)
> **Trạng thái:** Đã hoàn thành
- `schedule_optimizer.py`: dùng lại đúng cách tính CPM của `scheduling_service.py`, nạp `Assignment` + `Leave` đã APPROVED chồng lên khung thời gian dự án, gọi AI đề xuất Fast-tracking/Crashing/Reassign. CHỈ đề xuất (read-only) — không ghi đè `Task.early_start`/`late_finish`/...; PM tự áp dụng thủ công qua API task đã có.
- Endpoint `POST /api/v1/ai/optimize-schedule`.
- UI: `SchedulePanel.tsx` tại `/projects/{id}/ai-insights`.

### GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004)
> **Trạng thái:** Đã hoàn thành
- `resource_recommender.py`: chấm điểm định lượng (kỹ năng qua `user_skills`, workload hiện tại từ `Assignment`, chi phí `hourly_rate`, tránh người đang nghỉ phép) kết hợp AI xếp hạng lý do — AI không bao giờ được tin là chỉ tham chiếu ứng viên thật, lọc bỏ id lạ trước khi trả về. Chỉ đề xuất, không tự tạo `Assignment`.
- Endpoint `POST /api/v1/ai/resource-recommendation`.
- UI: chọn 1 task rồi xem danh sách ứng viên xếp hạng — `ResourceRecommendationPanel.tsx` tại `/projects/{id}/ai-insights`.

### GIAI ĐOẠN 3.6 – AI Risk Analysis (SOP-AI-005)
> **Trạng thái:** Đã hoàn thành
- `risk_analyzer.py`: tổng hợp tín hiệu định lượng (task quá hạn, gần đường găng, % ngân sách đã dùng, tiến độ so với thời gian đã trôi qua, số ngày-người quá tải trong 14 ngày tới) rồi gọi AI phân loại ma trận rủi ro 5x5 + gợi ý giảm thiểu, ghi bảng `risk_reports` (mỗi lần quét là 1 dòng mới, không upsert).
- Endpoint `POST /api/v1/ai/risk-analysis` (chạy thủ công) + Celery Beat `ai.sweep_active_projects_for_risk` (08:30 hằng ngày, enqueue riêng từng project đang ACTIVE).
- UI: `RiskWidget.tsx` tại `/projects/{id}/ai-insights` (badge risk_level, risk_score, risk_factors, mitigation_suggestions).

---

*Cập nhật lần cuối: 2026-09-17 — Phase 3 (AI Features) hoàn thành 5/5 trụ cột. Xem `docs/archive/phase3-ai-features/plan.md` cho quyết định phạm vi (Change Request CRUD tối giản là nền mới cho SOP-AI-002, không có workflow duyệt nhiều bước) và danh sách file đã thêm/sửa.*

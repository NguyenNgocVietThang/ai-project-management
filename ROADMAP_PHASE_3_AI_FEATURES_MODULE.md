# Roadmap: AI Features Module (Phase 3)

> **Phiên bản:** 1.2 | **Cập nhật:** 2026-09-03  
> **Trạng thái:** 🟡 ~15% — MỚI CÓ Provider abstraction layer + `project_generator.py` (chưa nối vào endpoint/worker nào). Endpoint `/ai` và toàn bộ Celery `ai_tasks` vẫn là stub `TODO`. Chưa có UI AI nào.  
> **Mức độ ưu tiên:** Critical – Lớp trí tuệ nhân tạo cốt lõi của hệ thống  
> **Điều kiện tiên quyết:** [x] Phase 1 (Auth & RBAC) & Phase 2 (Portfolio, Project Core, CPM & Real-time Chat) đã hoàn thành

---

## Tổng quan Module

Module **AI Features (Phase 3)** tích hợp trí tuệ nhân tạo (OpenAI GPT-4o & Google Gemini Pro) vào toàn bộ quy trình quản lý dự án nhằm tự động hóa việc lập kế hoạch, phân tích rủi ro, cân bằng nguồn lực và đánh giá tác động thay đổi theo chuẩn SOP.

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
| AI Provider Abstraction (`BaseAIProvider`) | ✅ Đã có | `backend/app/services/ai/base.py` |
| OpenAI Provider (`OpenAIProvider` GPT-4o) | ✅ Đã có | `backend/app/services/ai/openai_provider.py` |
| Google Gemini Provider (`GeminiProvider`) | ✅ Đã có | `backend/app/services/ai/gemini_provider.py` |
| AI Project Generator Engine (`generate_project_from_prompt`) | ✅ Đã có | `backend/app/services/ai/project_generator.py` |
| Celery Worker + Redis Broker | ✅ Đã có | `backend/app/workers/celery_app.py` & `ai_tasks.py` |
| Database Models: `ai_requests`, `ai_outputs`, `risk_reports` | ✅ Đã migrate | Sẵn sàng lưu trữ lịch sử và kết quả AI |
| CPM Engine (Topological Sort + Forward/Backward Pass) | ✅ Đã có | `app/utils/cpm.py` + `app/services/scheduling_service.py` (không có `cpm_service.py`) |
| User Skills & Leaves Schema | ✅ Đã migrate | `user_skills`, `skills`, `leaves` |
| AI API Keys cấu hình trong `.env` | ✅ Đã có | `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ACTIVE_AI_PROVIDER` |

---

## Danh mục tính năng triển khai theo Phase

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| AI Provider Abstraction Layer | Core | Critical | ✅ Hoàn thành | `BaseAIProvider`, `OpenAIProvider`, `GeminiProvider` | — (chưa có Provider Switcher UI) |
| AI Project Generator Engine | SOP-AI-001 | Critical | 🟡 Chỉ có service function | `project_generator.py` tồn tại nhưng KHÔNG được gọi; Celery task `generate_project_task` là stub `TODO`; endpoint `/ai` chưa mount | ❌ Chưa có |
| AI Impact Analysis | SOP-AI-002 | High | ❌ Chưa bắt đầu | Service chưa tồn tại; `impact_analysis_task` là stub | ❌ Chưa có |
| AI Schedule Optimization | SOP-AI-003 | High | ❌ Chưa bắt đầu | Service chưa tồn tại | ❌ Chưa có |
| AI Resource Recommendation | SOP-AI-004 | High | ❌ Chưa bắt đầu | Service chưa tồn tại | ❌ Chưa có |
| AI Risk Analysis & Periodic Scan | SOP-AI-005 | Medium | ❌ Chưa bắt đầu | Service chưa tồn tại; không có Celery Beat entry | ❌ Chưa có |

---

## Chi tiết kế hoạch triển khai

### GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure
> **Trạng thái:** ✅ Đã hoàn thành  
- `BaseAIProvider` (`backend/app/services/ai/base.py`): Abstract base class với `generate_text` và `generate_json`.
- `OpenAIProvider` (`backend/app/services/ai/openai_provider.py`): Tích hợp OpenAI GPT-4o JSON mode.
- `GeminiProvider` (`backend/app/services/ai/gemini_provider.py`): Tích hợp Google Gemini Pro SDK và xử lý Markdown code-block cleaner.
- `ProjectGeneratorService` (`backend/app/services/ai/project_generator.py`): Hàm `generate_project_from_prompt(prompt)` gọi Provider tương ứng.

### GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001)
> **Trạng thái:** ❌ Chưa bắt đầu (chỉ có `project_generator.py` chưa được nối)
- Cần làm: mount router `/ai`, hiện thực `generate_project_task` (đang là stub), ghi `ai_requests`/`ai_outputs`, dựng `AIGeneratorModal.tsx`.

### GIAI ĐOẠN 3.3 – AI Impact Analysis (SOP-AI-002)
> **Trạng thái:** ⏳ Kế hoạch tiếp theo
- Phân tích tác động khi PO duyệt Change Request hoặc PM kích hoạt thủ công.
- Đánh giá Timeline slippage, Budget delta, Resource overload và đường găng Critical Path.

### GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)
> **Trạng thái:** ⏳ Kế hoạch tiếp theo
- AI tính toán nén tiến độ (Fast-tracking / Crashing), loại trừ ngày nghỉ của nhân sự (`leaves`) và đề xuất lịch trình mới.

### GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004)
> **Trạng thái:** ⏳ Kế hoạch tiếp theo
- Đề xuất nhân sự tối ưu dựa trên kỹ năng (`user_skills`), khối lượng công việc hiện tại và chi phí (`hourly_rate`).

### GIAI ĐOẠN 3.6 – AI Risk Analysis (SOP-AI-005)
> **Trạng thái:** ⏳ Kế hoạch tiếp theo
- Quét định kỳ qua Celery Beat để phát hiện sớm các nguy cơ trễ hạn, quá tải hoặc vượt ngân sách.

---

*Cập nhật lần cuối: 2026-09-03 — Phase 3 (AI Features) — đối soát với mã nguồn: chỉ Provider layer + `project_generator.py` tồn tại, phần còn lại chưa triển khai.*

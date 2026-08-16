# Roadmap: AI Features Module (Phase 3)

> **Phiên bản:** 1.0 | **Cập nhật:** 2026-08-16  
> **Trạng thái:** ⏳ Chưa bắt đầu (0%) | **Ngày hoàn thành:** --  
> **Mức độ ưu tiên:** Critical – Lớp trí tuệ nhân tạo cốt lõi của hệ thống  
> **Điều kiện tiên quyết:** [x] Phase 1 (Auth & Onboarding) & Phase 2 (Portfolio, Project Core & CPM Engine) đã hoàn thành

---

## Tổng quan Module

Module **AI Features (Phase 3)** tích hợp trí tuệ nhân tạo (OpenAI GPT-4o & Google Gemini Pro) vào toàn bộ quy trình quản lý dự án nhằm tự động hóa việc lập kế hoạch, phân tích rủi ro, cân bằng nguồn lực và đánh giá tác động thay đổi theo chuẩn SOP.

### 5 Trụ cột AI chính:
1. **AI Project Generator (SOP-AI-001):** Sinh WBS (Phases, Tasks, Dependencies) tự động từ prompt ngôn ngữ tự nhiên hoặc prompt templates.
2. **AI Impact Analysis (SOP-AI-002):** Phân tích tác động đa chiều (Timeline, Budget, Resource, Critical Path) khi có Change Request (đơn lẻ hoặc đồng thời).
3. **AI Schedule Optimization (SOP-AI-003):** Tối ưu hóa tiến độ, cân bằng workload, loại trừ ngày nghỉ (bảng `leaves`), đa mục tiêu (Time - Cost - Quality).
4. **AI Resource Recommendation (SOP-RM-001 / SOP-AI-004):** Đề xuất phân bổ nhân sự thông minh theo kỹ năng (`user_skills`), chi phí (`hourly_rate`), khối lượng công việc hiện tại và dữ liệu lịch sử.
5. **AI Risk Analysis (SOP-AI-005):** Phân tích & nhận diện rủi ro định kỳ qua Celery Beat, phân loại ma trận rủi ro 5x5, gợi ý chiến lược giảm thiểu rủi ro dựa trên mẫu dữ liệu `audit_logs`.

---

## Hiện trạng & Hạ tầng sẵn có

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| Celery Worker + Redis Broker | Đã có sẵn | `backend/app/workers/celery_app.py` |
| CPM Engine (Topological Sort + Forward/Backward Pass) | Đã có sẵn | `backend/app/services/cpm_service.py` |
| Database Models: `ai_requests`, `ai_outputs`, `risk_reports`, `impact_reports` | Đã migrate | Sẵn sàng lưu trữ lịch sử và kết quả AI |
| User Skills & Leaves Schema | Đã migrate | `user_skills`, `skills`, `leaves` |
| AI API Keys cấu hình trong `.env` | Đã có | `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ACTIVE_AI_PROVIDER` |

---

## Danh mục tính năng cần triển khai

| Tính năng | Mã SOP | Độ ưu tiên | Trạng thái | Backend Task | Frontend Component |
|---|---|---|---|---|---|
| AI Provider Abstraction Layer | Core | Critical | ⏳ Chưa bắt đầu | Factory + OpenAI/Gemini Providers | Settings / AI Switcher |
| AI Project Generator | SOP-AI-001 | Critical | ⏳ Chưa bắt đầu | `ProjectGeneratorService` + Celery | `AIGeneratorModal`, `WBSPreview` |
| AI Impact Analysis | SOP-AI-002 | High | ⏳ Chưa bắt đầu | `ImpactAnalyzerService` + Celery | `ImpactReportModal`, `ImpactDiff` |
| AI Schedule Optimization | SOP-AI-003 | High | ⏳ Chưa bắt đầu | `ScheduleOptimizerService` + Celery | `ScheduleOptimizerModal`, `CompareView` |
| AI Resource Recommendation | SOP-AI-004 | High | ⏳ Chưa bắt đầu | `ResourceRecommenderService` + Celery | `ResourceSuggestionPanel` |
| AI Risk Analysis & Periodic Scan | SOP-AI-005 | Medium | ⏳ Chưa bắt đầu | `RiskAnalyzerService` + Celery Beat | `RiskDashboard`, `RiskHeatmap` |

---

## Chi tiết kế hoạch triển khai theo Phase

---

## GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Xây dựng tầng trừu tượng hoá AI (AI Provider Abstraction Layer) hỗ trợ chuyển đổi linh hoạt giữa OpenAI (GPT-4o) và Google Gemini (Gemini Pro) với JSON mode, retry, token estimation và rate-limit handling.

### Backend

**[NEW] `backend/app/services/ai/base.py`**
```python
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAIProvider(ABC):
    @abstractmethod
    async def generate_text(self, prompt: str, system_prompt: str = "", max_tokens: int = 4000, temperature: float = 0.7) -> str:
        """Sinh văn bản thuần từ prompt."""
        pass
    
    @abstractmethod
    async def generate_json(self, prompt: str, system_prompt: str = "", max_tokens: int = 4000, temperature: float = 0.3) -> Dict[str, Any]:
        """Sinh dữ liệu JSON có cấu trúc (Strict JSON mode)."""
        pass
    
    @abstractmethod
    async def count_tokens(self, text: str) -> int:
        """Ước tính số lượng token của văn bản."""
        pass
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass
```

**[NEW] `backend/app/services/ai/openai_provider.py`**
- Sử dụng `AsyncOpenAI` client.
- Hỗ trợ `response_format={"type": "json_object"}`.
- Xử lý `openai.RateLimitError` và `openai.APIError` với exponential backoff.

**[NEW] `backend/app/services/ai/gemini_provider.py`**
- Sử dụng `google.generativeai` async SDK.
- Xử lý trích xuất JSON sạch từ markdown code blocks (` ```json ... ``` `).
- Config temperature & max output tokens.

**[NEW] `backend/app/services/ai/provider_factory.py`**
- Factory pattern trả về Provider active dựa trên `settings.ACTIVE_AI_PROVIDER` (hoặc cấu hình dynamic từ bảng `ai_provider_configs`).

**[NEW] `backend/app/db/models/ai_provider_config.py`**
- Bảng `ai_provider_configs` lưu cấu hình per-tenant / dynamic API settings.

---

## GIAI ĐOẠN 3.2 – AI Project Generator (SOP-AI-001)

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Cho phép PM nhập mô tả dự án bằng ngôn ngữ tự nhiên hoặc chọn Template, hệ thống gọi AI sinh WBS hoàn chỉnh (Phases, Tasks, Duration, Dependencies), sau đó kích hoạt CPM Engine tính toán timeline và hiển thị preview để PM review/sửa trước khi lưu vào DB.

### 1. Luồng xử lý (Workflow)
```
PM Prompt -> POST /api/v1/ai/generate-project -> Celery Task (generate_project_task)
  -> AI Provider sinh WBS JSON
  -> CPM Engine tính toán ES, EF, LS, LF, Float, Is Critical
  -> Lưu AIRequest & AIOutput
  -> Client nhận kết quả qua Polling / WebSocket
  -> PM chỉnh sửa Preview -> POST /api/v1/ai/apply-wbs -> Lưu Phase, Task, Dependency vào DB
```

### 2. Backend Implementation

**[NEW] `backend/app/services/ai/project_generator.py`**
- Class `ProjectGeneratorService`:
  - `generate_wbs(prompt: str, template_type: str, portfolio_id: UUID)`
  - Prompt Templates cho các ngành: `Software Development` (Agile/Waterfall), `Marketing Campaign`, `Construction / Infrastructure`.
  - Validate JSON schema trả về từ AI (kiểm tra tính hợp lệ của Phase, Task, Duration, Dependencies).

**[NEW] `backend/app/tasks/ai_tasks.py`**
```python
@celery_app.task(bind=True, max_retries=3)
def generate_project_task(self, prompt: str, template_type: str, portfolio_id: str, user_id: str):
    # 1. Tạo record ai_requests (status=PENDING)
    # 2. Gọi ProjectGeneratorService.generate_wbs()
    # 3. Chạy CPM calculation nháp trên WBS sinh ra
    # 4. Lưu kết quả JSON vào ai_outputs
    # 5. Cập nhật ai_requests (status=COMPLETED)
```

**[NEW] `backend/app/api/v1/endpoints/ai_generator.py`**
- `POST /api/v1/ai/generate-project` — Tiếp nhận prompt, trả về `task_id` (HTTP 202 Accepted).
- `GET /api/v1/ai/tasks/{task_id}` — Kiểm tra tiến độ Celery task (`PENDING`, `PROCESSING`, `SUCCESS`, `FAILURE`).
- `GET /api/v1/ai/requests/{request_id}` — Lấy chi tiết output WBS.
- `POST /api/v1/ai/apply-wbs` — Xác nhận lưu WBS đã review vào Project DB chính thức.

### 3. Frontend Implementation

**[NEW] `frontend/src/features/ai/components/AIGeneratorModal.tsx`**
- Dialog nhập prompt dự án, chọn Template (Software, Marketing, Infra), chọn Portfolio & Ngày bắt đầu.
- Hiển thị thanh tiến trình AI Generating (Step 1: AI Prompt -> Step 2: Generating WBS -> Step 3: CPM Calculation -> Step 4: Done).

**[NEW] `frontend/src/features/ai/components/WBSPreviewEditor.tsx`**
- Giao diện dạng cây phân rã (Tree table) hiển thị Phases, Tasks, Thời lượng (giờ/ngày), Dependencies.
- Cho phép PM thêm/xóa/sửa task trực tiếp trên bản nháp trước khi ấn "Apply to Project".

**[NEW] `frontend/src/features/ai/hooks/useAIGenerator.ts`**
- TanStack Query hook quản lý polling status của task và submit apply WBS.

---

## GIAI ĐOẠN 3.3 – AI Impact Analysis (SOP-AI-002)

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Khi có Change Request (CR), AI tự động phân tích độ lệch tiến độ (Timeline Slippage), biến động ngân sách (Budget Delta), rủi ro nhân sự và ảnh hưởng Critical Path, hỗ trợ BA/PM/PO ra quyết định.

### 1. Luồng xử lý
- Trigger tự động khi CR được tạo hoặc gọi thủ công qua button "Analyze Impact".
- Hỗ trợ **Cumulative Impact Analysis** khi có nhiều CR cùng lúc.
- Kết quả lưu vào bảng `impact_reports`.

### 2. Backend Implementation

**[NEW] `backend/app/services/ai/impact_analyzer.py`**
- Class `ImpactAnalyzerService`:
  - `analyze_change_request(cr_id: UUID, db: AsyncSession)`: Thu thập dữ liệu CR + trạng thái WBS hiện tại + CPM snapshot -> Gửi prompt phân tích.
  - `analyze_cumulative_impact(cr_ids: list[UUID], project_id: UUID, db: AsyncSession)`: Tính toán tổng tác động gộp của nhiều CR đồng thời.
  - Trích xuất: `risk_score` (1-100), `timeline_impact_days`, `budget_impact_amount`, `resource_impact_summary`, `critical_path_affected` (bool), `mitigation_strategies` (list).

**[MODIFY] `backend/app/tasks/ai_tasks.py`**
- Thêm `analyze_impact_task(cr_id: str, user_id: str)`: Chạy async và ghi vào bảng `impact_reports`.

**[NEW] `backend/app/api/v1/endpoints/ai_impact.py`**
- `POST /api/v1/ai/analyze-impact` — Gửi yêu cầu phân tích CR đơn hoặc đa CR.
- `GET /api/v1/ai/impact-reports/{report_id}` — Lấy chi tiết báo cáo tác động.
- `GET /api/v1/projects/{project_id}/impact-summary` — Tổng hợp tác động các CR đang mở.

### 3. Frontend Implementation

**[NEW] `frontend/src/features/ai/components/ImpactReportModal.tsx`**
- Hiển thị trực quan: Risk Score Badge (Xanh / Vàng / Đỏ), Thống kê ngày trễ dự kiến, Ngân sách phát sinh.
- Biểu đồ so sánh Before vs After Critical Path.
- Danh sách gợi ý giảm thiểu tác động (Mitigation Suggestions) kèm action checklist.

**[NEW] `frontend/src/features/ai/hooks/useAIImpact.ts`**
- Hook quản lý phân tích tác động CR và fetch báo cáo `impact_reports`.

---

## GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Giải quyết xung đột tài nguyên (Resource Overload), tối ưu hóa đường găng (Fast-tracking / Crashing), loại trừ ngày nghỉ của nhân sự (`leaves`), cân đối giữa Thời gian - Chi phí - Chất lượng.

### 1. Backend Implementation

**[NEW] `backend/app/services/ai/schedule_optimizer.py`**
- Class `ScheduleOptimizerService`:
  - `optimize_schedule(project_id: UUID, objectives: list[str], max_budget_delta: float)`
  - Objectives: `minimize_duration`, `balance_workload`, `minimize_cost`.
  - Tích hợp bảng `leaves` để đảm bảo không phân công việc vào ngày nghỉ phép của thành viên.
  - Kết hợp thuật toán CPM để tính toán lại Early/Late dates sau tối ưu.

**[MODIFY] `backend/app/tasks/ai_tasks.py`**
- Thêm `optimize_schedule_task(project_id: str, objectives: list, user_id: str)`.

**[NEW] `backend/app/api/v1/endpoints/ai_optimizer.py`**
- `POST /api/v1/ai/optimize-schedule` — Khởi chạy task tối ưu hóa lịch trình.
- `GET /api/v1/ai/optimization-results/{result_id}` — Trả về so sánh Before/After metrics (Total duration, Overload count, Estimated cost).
- `POST /api/v1/ai/apply-optimized-schedule` — Áp dụng lịch tối ưu vào dự án (tự động tạo Version Snapshot trước khi apply).

### 2. Frontend Implementation

**[NEW] `frontend/src/features/ai/components/ScheduleOptimizerDialog.tsx`**
- Cho phép PM chọn trọng số tối ưu (Rút ngắn thời gian / Giảm tải nhân sự / Tiết kiệm ngân sách).
- Hiển thị bảng đối soát Before / After: Số ngày tiết kiệm được, số conflict được giải quyết.
- Nút "Apply Optimization" với cảnh báo tự động tạo snapshot version.

---

## GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004)

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Gợi ý nhân sự phù hợp nhất cho từng Task dựa trên Skill match score (`user_skills`), Workload hiện tại (`assignments`), mức lương theo giờ (`hourly_rate`) và lịch sử hoàn thành task.

### 1. Backend Implementation

**[NEW] `backend/app/services/ai/resource_recommender.py`**
- Class `ResourceRecommenderService`:
  - `recommend_assignees(task_id: UUID, project_id: UUID)`
  - Thuật toán tính điểm Match Score: $Match = 0.4 \times SkillScore + 0.3 \times AvailabilityScore + 0.2 \times PerformanceHistory + 0.1 \times CostEfficiency$.
  - Phát hiện cảnh báo Overload (> 40h/tuần).
  - Trả về danh sách ứng viên xếp theo thứ tự ưu tiên kèm lý do AI phân tích.

**[MODIFY] `backend/app/tasks/ai_tasks.py`**
- Thêm `recommend_resources_task(task_id: str, user_id: str)`.

**[NEW] `backend/app/api/v1/endpoints/ai_resources.py`**
- `POST /api/v1/ai/recommend-resources` — Đề xuất nhân sự cho task.
- `GET /api/v1/ai/resource-recommendations/{task_id}` — Xem kết quả gợi ý.

### 2. Frontend Implementation

**[NEW] `frontend/src/features/ai/components/AIResourceSuggestion.tsx`**
- Tích hợp trực tiếp vào Task Detail Drawer / Modal phân công nhân sự.
- Hiển thị avatar, tên, Match Score (ví dụ: 95% Match), danh sách kỹ năng khớp và cảnh báo công việc hiện tại.
- 1-Click "Assign Resource".

---

## GIAI ĐOẠN 3.6 – AI Risk Analysis (SOP-AI-005)

> **Trạng thái:** ⏳ Chưa bắt đầu | **Ngày hoàn thành:** --  
> **Mục tiêu:** Quét toàn diện dự án để phát hiện các rủi ro tiềm ẩn (chậm tiến độ, quá tải ngân sách, dependency bottle-neck, biến động nhân sự), phân loại theo ma trận 5x5 và cảnh báo sớm.

### 1. Backend Implementation

**[NEW] `backend/app/services/ai/risk_analyzer.py`**
- Class `RiskAnalyzerService`:
  - `analyze_project_risks(project_id: UUID)`: Thu thập Task metrics, Worklogs, Audit Logs pattern và CR history để đánh giá.
  - Phân loại rủi ro: `Schedule Risk`, `Budget Risk`, `Resource Risk`, `Technical/Scope Risk`.
  - Tính toán `Probability` (1-5), `Impact` (1-5), `Risk Severity = Probability x Impact`.
  - Lưu trữ vào bảng `risk_reports`.

**[MODIFY] `backend/app/tasks/ai_tasks.py`**
- Thêm `analyze_risk_task(project_id: str, user_id: str)`.
- Cấu hình **Celery Beat Periodic Task** quét định kỳ hàng tuần hoặc hàng ngày cho các dự án active.

**[NEW] `backend/app/api/v1/endpoints/ai_risk.py`**
- `POST /api/v1/ai/analyze-risk` — Chạy phân tích rủi ro thủ công.
- `GET /api/v1/ai/risk-reports/{project_id}` — Lấy danh sách báo cáo rủi ro mới nhất.
- `GET /api/v1/ai/risk-matrix/{project_id}` — Dữ liệu ma trận nhiệt rủi ro (Heatmap).

### 2. Frontend Implementation

**[NEW] `frontend/src/features/ai/components/RiskDashboardWidget.tsx`**
- Widget hiển thị chỉ số rủi ro tổng thể của dự án (Low / Medium / High / Critical).
- Ma trận Risk Heatmap 5x5 tương tác (click vào từng ô xem các rủi ro cụ thể).
- Danh sách khuyến nghị phòng ngừa rủi ro (Mitigation Action Items).

---

## Kế hoạch kiểm thử (Testing Strategy)

> **Trạng thái kiểm thử:** ⏳ Chưa thực hiện

1. **Unit Tests (`tests/unit/services/ai/`):**
   - Mock OpenAI/Gemini API responses để test logic phân tích JSON WBS, Impact, Optimization, Resource, Risk.
   - Test Error Handling: API Key missing, RateLimit retry, Malformed JSON, Token Limit Exceeded.
2. **Integration Tests (`tests/integration/test_ai_celery_tasks.py`):**
   - Test end-to-end Celery tasks -> Database updates (`ai_requests`, `ai_outputs`, `impact_reports`, `risk_reports`).
3. **PBT / Correctness Verification:**
   - Đảm bảo đồ thị phụ thuộc sinh ra bởi AI không có chu trình (Cycle-free Dependency Graph).
   - Đảm bảo workload tính toán không âm.

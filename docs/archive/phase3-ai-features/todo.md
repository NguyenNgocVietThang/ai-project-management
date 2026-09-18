# Todo: Phase 3 (AI Features) — 4 trụ cột còn lại

Xem `tasks/plan.md` cho bối cảnh đầy đủ và quyết định phạm vi (đặc biệt: vì sao Task 1 tồn
tại dù không nằm trong roadmap AI gốc).

## Task 1: Change Request CRUD tối giản

**Description:** `endpoints/change_requests.py` hiện là stub tĩnh không auth, bị comment
khỏi router. Impact Analysis (Task 2) cần một `ChangeRequest` thật để phân tích. Xây CRUD
tối giản: tạo, liệt kê theo project, xem chi tiết, chuyển trạng thái DRAFT→SUBMITTED. Không
làm workflow duyệt nhiều bước (bảng `approvals` giữ nguyên stub).

**Acceptance criteria:**
- [x] `POST /projects/{project_id}/change-requests` tạo CR thật (title, description, reason,
      impact_description), yêu cầu người tạo là PM/BA của project (hoặc Admin)
- [x] `GET /projects/{project_id}/change-requests` liệt kê CR theo project, chỉ thành viên project xem được
- [x] `GET /change-requests/{id}` xem chi tiết, cùng quyền như trên
- [x] `POST /change-requests/{id}/submit` chuyển DRAFT → SUBMITTED
- [x] Theo đúng pattern `phase2_common.get_project_context` + `add_audit` như các service khác

**Verification:**
- [x] Tests pass: `cd backend && python -m pytest tests/unit/test_change_request_service.py -q` — 6 passed
- [x] Build succeeds: `cd backend && python -m py_compile app/services/change_request_service.py app/api/v1/endpoints/change_requests.py app/schemas/change_request.py`
- [x] Manual check: router mounted trong Task 6, `python -c "import app.main"` load sạch (403 cho user ngoài project được cover bởi test `test_member_cannot_create_change_request`/`test_other_member_cannot_submit_someone_elses_change_request`) — không có Docker/Postgres trong môi trường này để test qua Swagger UI thật

**Dependencies:** None

**Files likely touched:**
- `backend/app/schemas/change_request.py` (mới)
- `backend/app/services/change_request_service.py` (mới)
- `backend/app/api/v1/endpoints/change_requests.py` (viết lại)
- `backend/tests/unit/test_change_request_service.py` (mới)

**Estimated scope:** Medium (4 files)

---

## Điểm kiểm tra: Sau Task 1
- [x] `pytest tests/unit/test_change_request_service.py` pass — 6 passed
- [x] Không sửa `router.py`, `endpoints/ai.py`, hay bất kỳ file dùng chung nào (việc mount router thuộc Task 6)

---

## Task 2: Phân tích tác động bằng AI (SOP-AI-002) — song song, sau Task 1

**Description:** Sinh phân tích tác động (Timeline/Budget/Resource/Critical Path) cho 1
Change Request bằng AI, ghi vào bảng `impact_reports`. Kèm UI: trang Change Requests
(list/create/detail) + nút "Run Impact Analysis" + hiển thị report.

**Acceptance criteria:**
- [x] `backend/app/services/ai/impact_analyzer.py`: system prompt + hàm
      `generate_impact_analysis(change_request, project, tasks, cpm_result) -> dict` trả về
      risk_level/risk_score/schedule_impact_days/cost_impact/affected_tasks/summary — dùng
      `AITaskType.IMPACT_ANALYSIS`, `wrap_user_input` cho phần mô tả CR do người dùng nhập
- [x] Hàm ghi kết quả vào `ImpactReport` (clamp risk_score về [0,10], validate risk_level
      thuộc enum `RiskLevel` trước khi ghi — theo mẫu `_persist_plan`)
- [x] `backend/app/schemas/impact_report.py`: `ImpactReportResponse`
- [x] Frontend: `frontend/src/types/change-request.types.ts`,
      `frontend/src/services/change-request.service.ts`,
      `frontend/src/features/change-requests/` (hooks + components): danh sách CR theo
      project, form tạo CR, trang chi tiết CR với nút chạy Impact Analysis (tái dùng mẫu
      poll job như `useAIGenerator.ts`/`AIGeneratorModal.tsx`) và hiển thị report khi xong
- [x] KHÔNG đụng: `ai_tasks.py`, `ai_service.py`, `endpoints/ai.py`, `schemas/ai.py`,
      `router.py`, `ai.service.ts`, `ai.types.ts`, `layout.tsx`, `messages/*.json` (Task 6 lo)

**Verification:**
- [x] Tests pass: `cd backend && python -m pytest tests/unit/test_impact_analyzer.py -q` — 5 passed
- [x] Build succeeds: `cd frontend && npx tsc --noEmit` — 0 lỗi trong file mới
- [x] Manual check: sau Task 6 wiring, `npm run build` sinh route `/projects/[id]/change-requests` sạch; không có Docker để test luồng qua browser thật trong môi trường này

**Dependencies:** Task 1

**Files likely touched:**
- `backend/app/services/ai/impact_analyzer.py` (mới)
- `backend/app/schemas/impact_report.py` (mới)
- `backend/tests/unit/test_impact_analyzer.py` (mới)
- `frontend/src/types/change-request.types.ts` (mới)
- `frontend/src/services/change-request.service.ts` (mới)
- `frontend/src/features/change-requests/**` (mới)
- `frontend/src/app/(dashboard)/projects/[id]/change-requests/page.tsx` (mới)

**Estimated scope:** Large (7-8 files) — chấp nhận vì đây là 1 lát cắt dọc trọn vẹn của 1 trụ cột AI, không tách nhỏ hơn được mà vẫn giữ tính năng dùng được

---

## Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1

**Description:** AI đề xuất nén tiến độ (fast-tracking/crashing) và cân bằng workload, loại
trừ ngày nghỉ (`leaves`), dựa trên kết quả CPM hiện tại. CHỈ đề xuất (read-only) — không tự
động ghi đè lịch trình thật.

**Acceptance criteria:**
- [x] `backend/app/services/ai/schedule_optimizer.py`: system prompt + hàm
      `generate_schedule_optimization(project, tasks, cpm_result, leaves, constraints) -> dict`
      trả về danh sách đề xuất (task_id, đề xuất, lý do, tiết kiệm bao nhiêu ngày ước tính)
      — dùng `AITaskType.SCHEDULE_OPTIMIZATION`
- [x] Không ghi đè `Task.early_start`/`late_start`/... — chỉ trả JSON đề xuất qua `AIOutput`
- [x] Frontend: `frontend/src/types/schedule-optimization.types.ts`,
      `.../services/schedule-optimization.service.ts`,
      `frontend/src/features/schedule-optimization/` (hooks + `SchedulePanel.tsx`): nút
      "Optimize schedule" + poll job + bảng đề xuất
- [x] KHÔNG đụng file dùng chung (như Task 2)

**Verification:**
- [x] Tests pass: `cd backend && python -m pytest tests/unit/test_schedule_optimizer.py -q` — 7 passed
- [x] Build succeeds: `cd frontend && npx tsc --noEmit` — 0 lỗi trong file mới
- [x] Manual check sau Task 6: `SchedulePanel` gắn vào `/projects/[id]/ai-insights`, build production sạch; chưa test qua browser thật (không có Docker)

**Dependencies:** None (độc lập với Task 1, chỉ cần project_id)

**Files likely touched:**
- `backend/app/services/ai/schedule_optimizer.py` (mới)
- `backend/tests/unit/test_schedule_optimizer.py` (mới)
- `frontend/src/types/schedule-optimization.types.ts` (mới)
- `frontend/src/services/schedule-optimization.service.ts` (mới)
- `frontend/src/features/schedule-optimization/**` (mới)

**Estimated scope:** Medium (5 files)

---

## Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1

**Description:** Đề xuất nhân sự phù hợp cho 1 task cụ thể, dựa trên `user_skills`,
`hourly_rate`, khối lượng công việc hiện tại (`Assignment`/`Worklog`), tránh người đang nghỉ
phép (`leaves`).

**Acceptance criteria:**
- [x] `backend/app/services/ai/resource_recommender.py`: hàm kết hợp chấm điểm định lượng
      (kỹ năng khớp, workload hiện tại qua logic tương tự `ResourceService.workload_warnings`,
      chi phí `hourly_rate`) + AI sinh phần giải thích ngôn ngữ tự nhiên
      (`AITaskType.RESOURCE_RECOMMENDATION`) — trả danh sách ứng viên xếp hạng kèm lý do
- [x] Không tự động tạo `Assignment` — chỉ đề xuất, PM tự bấm assign qua API sẵn có
- [x] Frontend: `frontend/src/types/resource-recommendation.types.ts`,
      `.../services/resource-recommendation.service.ts`,
      `frontend/src/features/resource-recommendation/` (hooks + component): chọn 1 task
      trong project → danh sách ứng viên xếp hạng
- [x] KHÔNG đụng file dùng chung

**Verification:**
- [x] Tests pass: `cd backend && python -m pytest tests/unit/test_resource_recommender.py -q` — 6 passed
- [x] Build succeeds: `cd frontend && npx tsc --noEmit` — 0 lỗi trong file mới
- [x] Manual check sau Task 6: panel chọn task + xem ứng viên gắn vào `/projects/[id]/ai-insights`, build production sạch; chưa test qua browser thật (không có Docker)

**Dependencies:** None

**Files likely touched:**
- `backend/app/services/ai/resource_recommender.py` (mới)
- `backend/tests/unit/test_resource_recommender.py` (mới)
- `frontend/src/types/resource-recommendation.types.ts` (mới)
- `frontend/src/services/resource-recommendation.service.ts` (mới)
- `frontend/src/features/resource-recommendation/**` (mới)

**Estimated scope:** Medium (5 files)

---

## Task 5: AI Phân tích rủi ro (SOP-AI-005) — song song, sau Task 1

**Description:** Phân tích rủi ro dự án (trễ hạn, quá tải, vượt ngân sách), phân loại ma
trận 5x5, gợi ý giảm thiểu. Ghi vào bảng `risk_reports`. Có thể trigger thủ công; quét định
kỳ do Task 6 nối vào Celery Beat.

**Acceptance criteria:**
- [x] `backend/app/services/ai/risk_analyzer.py`: system prompt + hàm
      `generate_risk_analysis(project, tasks, cpm_result, budget_vs_actual, overdue_count) -> dict`
      trả risk_score/risk_level/risk_factors/mitigation_suggestions/summary —
      `AITaskType.RISK_ANALYSIS`
- [x] Hàm ghi `RiskReport` (clamp/validate như Task 2, theo enum `RiskLevel` đã có)
- [x] `backend/app/schemas/risk_report.py`: `RiskReportResponse`
- [x] Frontend: `frontend/src/types/risk-report.types.ts`,
      `.../services/risk-report.service.ts`,
      `frontend/src/features/risk-analysis/` (hooks + `RiskWidget.tsx`): nút "Run risk scan"
      + hiển thị risk_score/risk_level (badge màu theo mức) + mitigation suggestions
- [x] KHÔNG đụng file dùng chung

**Verification:**
- [x] Tests pass: `cd backend && python -m pytest tests/unit/test_risk_analyzer.py -q` — 6 passed
- [x] Build succeeds: `cd frontend && npx tsc --noEmit` — 0 lỗi trong file mới
- [x] Manual check sau Task 6: `RiskWidget` gắn vào `/projects/[id]/ai-insights`, build production sạch; chưa test qua browser thật (không có Docker)

**Dependencies:** None

**Files likely touched:**
- `backend/app/services/ai/risk_analyzer.py` (mới)
- `backend/app/schemas/risk_report.py` (mới)
- `backend/tests/unit/test_risk_analyzer.py` (mới)
- `frontend/src/types/risk-report.types.ts` (mới)
- `frontend/src/services/risk-report.service.ts` (mới)
- `frontend/src/features/risk-analysis/**` (mới)

**Estimated scope:** Medium (6 files)

---

## Điểm kiểm tra: Sau Task 2–5 (chạy song song)
- [x] Cả 4 agent báo cáo hoàn thành, không ai đụng file dùng chung (3 agent chạy trong git
      worktree cô lập, 1 agent — Risk Analysis — chạy trực tiếp trên main tree do worktree
      thứ 4 bị lỗi tạo 2 lần liên tiếp, nhưng vẫn tuân thủ đúng ranh giới file)
- [x] `git status` xác nhận không có xung đột merge, chỉ toàn file mới + 4 file backend cô lập
      (đã copy thủ công từ 3 worktree vào main tree, bỏ qua các thay đổi phụ như
      `graphify-out/`, `package-lock.json` mà một agent lỡ tạo ra khi cài dependency để chạy `tsc`)

---

## Task 6: Wiring — nối 4 trụ cột vào hệ thống chung (tuần tự, tôi tự làm)

**Description:** Nối các module cô lập từ Task 2–5 vào kiến trúc chung: Celery task thật
thay stub, AIService method mới, endpoint mới, mount router Change Request, Celery Beat cho
Risk Analysis định kỳ, frontend service/types dùng chung, 2 tab nav mới, i18n.

**Acceptance criteria:**
- [x] `ai_tasks.py`: `impact_analysis_task`, `optimize_schedule_task`, `risk_analysis_task`
      thay thân `TODO` bằng gọi thật, cộng thêm `resource_recommendation_task` mới (stub gốc
      thiếu hẳn task này) — tất cả đổi chữ ký sang nhận `ai_request_id` (thay vì
      change_request_id/project_id trực tiếp) để khớp đúng kiến trúc AIRequest/polling đã có,
      dùng chung khung `_run_ai_job` (mirror `_generate_with_own_session`), ghi `AIOutput`
- [x] `ai_service.py`: `request_impact_analysis`, `request_schedule_optimization`,
      `request_resource_recommendation`, `request_risk_analysis` (cùng mẫu
      `request_project_generation`, dùng chung helper `_queue`) — mỗi hàm gọi
      `get_project_context` để xác nhận user thuộc project trước khi xếp hàng
- [x] `schemas/ai.py`: thêm `AIResourceRecommendationRequest` (task_id: int)
- [x] `endpoints/ai.py`: `POST /ai/impact-analysis`, `POST /ai/optimize-schedule`,
      `POST /ai/resource-recommendation`, `POST /ai/risk-analysis` (202 + `AIJobResponse`,
      yêu cầu user đã xác minh email qua `CurrentVerifiedUser`)
- [x] `router.py`: bỏ comment + mount `change_requests.router`
- [x] `celery_app.py`: thêm `beat_schedule` entry `sweep-risk-analysis-daily` (08:30) gọi task
      mới `ai.sweep_active_projects_for_risk` trong `ai_tasks.py` — enqueue riêng từng project
      ACTIVE, một project lỗi không chặn project khác
- [x] `ai.service.ts` + `ai.types.ts`: KHÔNG cần sửa — cả 4 pillar đã tự xây service file
      riêng gọi thẳng `@/services/api`, không phụ thuộc file chung này (khác dự kiến ban đầu
      trong plan, nhưng đơn giản hơn và không có rủi ro conflict)
- [x] `layout.tsx`: thêm 2 tab "Change Requests" và "AI Insights"
- [x] `messages/en.json` + `messages/vi.json`: thêm key `changeRequests`/`aiInsights`

**Verification:**
- [x] Tests pass: `cd backend && python -m pytest tests/unit -q` — 264 passed (tests/integration
      lỗi do cần Postgres thật, môi trường này không có Docker — lỗi này có từ trước, không
      liên quan tới thay đổi trong phiên này)
- [x] Build succeeds: `python -m py_compile` trên cả 6 file backend đã sửa — sạch
- [x] `python -c "import app.main"` — load sạch, router/dependency không vỡ
- [x] Build succeeds: `cd frontend && npm run build` — sạch, sinh đủ route
      `/projects/[id]/change-requests` và `/projects/[id]/ai-insights`
- [ ] Manual check qua browser thật: KHÔNG thực hiện được — Docker Desktop không chạy trong
      môi trường này (cần cho Postgres/Redis/Celery), xem Checkpoint cuối

**Dependencies:** Task 1, 2, 3, 4, 5

**Files likely touched:**
- `backend/app/workers/ai_tasks.py`
- `backend/app/services/ai_service.py`
- `backend/app/schemas/ai.py`
- `backend/app/api/v1/endpoints/ai.py`
- `backend/app/api/v1/router.py`
- `backend/app/workers/celery_app.py`
- `frontend/src/services/ai.service.ts`
- `frontend/src/types/ai.types.ts`
- `frontend/src/app/(dashboard)/projects/[id]/layout.tsx`
- `frontend/src/app/(dashboard)/projects/[id]/ai-insights/page.tsx` (mới)
- `frontend/messages/en.json`, `frontend/messages/vi.json`

**Estimated scope:** Large (11 files, nhưng mỗi thay đổi nhỏ/cơ học)

---

## Điểm kiểm tra: Hoàn chỉnh
- [x] `pytest` backend pass toàn bộ (264/264 unit test)
- [x] `npm run build` frontend pass
- [ ] 4 luồng AI chạy được qua browser thật (preview_start), có ảnh chụp/log xác minh —
      KHÔNG thực hiện được: Docker Desktop không có/không chạy được trong môi trường này, và
      backend cần Postgres + Redis + Celery worker thật để chạy job AI đầu-cuối. Đã bù bằng
      test đơn vị đầy đủ cho từng service (mock AI call) + `npm run build` + `import app.main`
      sạch. **Cần người dùng tự chạy `docker compose up -d --build` rồi kiểm tra qua browser.**
- [x] `graphify update .`
- [x] `ROADMAP_PHASE_3_AI_FEATURES_MODULE.md` cập nhật trạng thái 3.3–3.6 → Hoàn thành
- [ ] Review với người dùng trước khi coi là xong

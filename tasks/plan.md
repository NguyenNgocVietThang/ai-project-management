# Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại

## Overview

Roadmap Phase 3 (`ROADMAP_PHASE_3_AI_FEATURES_MODULE.md`) đã xong SOP-AI-001 (AI Project
Generator, chạy thật đầu-cuối). Bốn trụ cột còn lại vẫn là Celery task stub `TODO` không có
service, không có UI:

- SOP-AI-002 Impact Analysis
- SOP-AI-003 Schedule Optimization
- SOP-AI-004 Resource Recommendation
- SOP-AI-005 Risk Analysis

Kế hoạch này hiện thực cả 4 theo đúng kiến trúc đã có (AIRequest/AIOutput + Celery job +
poll `GET /ai/jobs/{id}`, provider xKiro qua `model_router.py`), tận dụng các model DB đã
migrate sẵn (`risk_reports`, `impact_reports`) và các schema request đã có sẵn trong
`schemas/ai.py`.

## Phát hiện quan trọng làm thay đổi phạm vi

`AIImpactAnalysisRequest` cần `change_request_id`, và `ImpactReport.change_request_id` là
FK bắt buộc — nhưng **Change Request hiện chưa hề được cài đặt thật**:
`endpoints/change_requests.py` và `endpoints/approvals.py` chỉ là stub trả JSON tĩnh, không
auth, và bị comment-out khỏi `router.py` (lý do ghi rõ trong comment: "stub TODO, không có
dependency auth"). Không có schema, không có service, không có frontend.

**Quyết định phạm vi:** xây Change Request CRUD tối giản thật (create/list/get + chuyển
trạng thái SUBMITTED) làm nền cho Impact Analysis — đủ để AI có dữ liệu thật để phân tích.
Quy trình duyệt nhiều bước (BA → PO → PM qua bảng `approvals`) KHÔNG nằm trong phạm vi này;
đó là một tính năng lớn riêng (workflow phê duyệt) thuộc về Phase 2 debt, không phải AI
Features. `approvals.py` giữ nguyên stub, chỉ ghi chú lại trong plan như open question.

## Kiến trúc tái sử dụng (đã có sẵn, không cần sửa)

- `AITaskType` + `model_router.resolve_model()` đã định tuyến đủ 4 loại việc còn thiếu.
- `XkiroProvider.generate_json()` + `parsing.wrap_user_input/parse_json_object` đã xử lý
  input không tin cậy và JSON không đáng tin từ model.
- `AIRequest`/`AIOutput` + `AIService` + pattern polling `GET /ai/jobs/{id}` — tái dùng y
  hệt cho cả 3 job còn lại (Resource Recommendation cũng đi qua job, không gọi đồng bộ, để
  nhất quán về observability/cost control).
- Mẫu Celery task tự mở `AsyncSessionLocal` riêng (`ai_tasks._generate_with_own_session`).
- `risk_reports`, `impact_reports` đã có model + đã migrate trong
  `13e3544bef02_initial_schema.py` — chỉ thiếu schema Pydantic + service ghi/đọc.

## Kiến trúc mới

- 4 module logic AI mới, mỗi module 1 file cô lập dưới `backend/app/services/ai/`:
  `impact_analyzer.py`, `schedule_optimizer.py`, `resource_recommender.py`,
  `risk_analyzer.py` — theo đúng mẫu `project_generator.py` (system prompt + hàm async gọi
  provider, trả dict thô chưa qua kiểm tra schema).
- Change Request: `schemas/change_request.py`, `services/change_request_service.py`,
  viết lại `endpoints/change_requests.py` thật.
- Risk Report: `schemas/risk_report.py`. Impact Report: `schemas/impact_report.py`.
- Frontend: 2 route mới trong `projects/[id]/`: `change-requests` (list/create/detail +
  trigger Impact Analysis) và `ai-insights` (Risk widget + Schedule Optimization panel +
  Resource Recommendation tool cho 1 task).
- Celery Beat: thêm 1 task quét định kỳ enqueue `risk_analysis_task` cho các project đang
  `ACTIVE` (SOP-AI-005 "quét định kỳ").

## Song song hoá (đa agent)

4 pillar là 4 lát cắt độc lập về mặt file (không đụng nhau) NẾU các agent chỉ đụng file mới
cô lập của riêng mình và không đụng các file dùng chung
(`ai_tasks.py`, `ai_service.py`, `endpoints/ai.py`, `schemas/ai.py`, `router.py`,
`celery_app.py`, `ai.service.ts`, `ai.types.ts`, `layout.tsx`, `messages/*.json`). Vì các
agent chạy cùng working directory (không dùng git worktree), việc sửa đồng thời cùng 1 file
dùng chung sẽ đụng độ (mất bản sửa của nhau).

**Cách chia:** 4 agent chạy song song, mỗi agent sở hữu trọn 1 trụ cột (backend engine +
test + frontend cô lập trong 1 feature folder mới), **không đụng file dùng chung**. Sau khi
cả 4 xong, tôi (agent điều phối) tự làm 1 lượt "nối dây" tuần tự — sửa các file dùng chung ở
trên (mỗi trụ cột chỉ thêm vài dòng độc lập, không chồng lấn) — rồi chạy test + build để xác
minh toàn bộ.

## Task List

### Nền tảng (tuần tự, làm trước, chặn Task 2)
- [ ] Task 1: Change Request CRUD tối giản (schema + service + endpoint thật + mount router)

### 4 trụ cột (song song, sau Task 1)
- [ ] Task 2: Impact Analysis — backend engine + Change Request frontend UI + trigger phân tích
- [ ] Task 3: Schedule Optimization — backend engine (CPM + leaves) + frontend panel
- [ ] Task 4: Resource Recommendation — backend engine (skills + workload + cost) + frontend tool
- [ ] Task 5: Risk Analysis — backend engine + persist RiskReport + frontend widget

### Checkpoint: 4 trụ cột backend/frontend cô lập xong
- [ ] Mỗi module mới có test unit pass độc lập
- [ ] Không agent nào đụng file dùng chung

### Nối dây (tuần tự, tôi tự làm)
- [ ] Task 6: Wiring — `ai_tasks.py` (thay 3 stub), `ai_service.py` (3 method mới),
      `schemas/ai.py` (thêm `AIResourceRecommendationRequest`), `endpoints/ai.py` (4 route
      mới), `router.py` (mount change_requests), `celery_app.py` (beat entry quét risk định
      kỳ), `ai.service.ts` + `ai.types.ts`, `layout.tsx` (2 tab mới), `messages/*.json`
      (i18n key mới)

### Checkpoint: Tích hợp hoàn chỉnh
- [ ] `pytest` backend pass (đơn vị + mới)
- [ ] `npm run build` / lint frontend pass
- [ ] Kiểm tra thủ công qua browser: tạo Change Request → chạy Impact Analysis → xem report;
      chạy Risk Analysis; chạy Schedule Optimization; chạy Resource Recommendation
- [ ] `graphify update .` (theo CLAUDE.md của project)
- [ ] Cập nhật `ROADMAP_PHASE_3_AI_FEATURES_MODULE.md` — đánh dấu GIAI ĐOẠN 3.3–3.6 hoàn
      thành, cập nhật bảng trạng thái

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Đụng độ file dùng chung giữa các agent song song | Cao — mất code | Agent chỉ tạo/sửa file cô lập của mình; wiring do 1 agent (tôi) làm tuần tự sau |
| Change Request là scope mở rộng ngoài "AI Features" thuần tuý | Trung bình | Giữ tối giản (không có workflow duyệt nhiều bước), ghi rõ quyết định phạm vi ở trên |
| AI trả JSON không đúng schema (risk_score ngoài 0-10, risk_level sai enum...) | Trung bình | Validate + clamp trước khi ghi DB, theo đúng mẫu `_persist_plan` đã làm cho SOP-AI-001 |
| Schedule Optimization đề xuất ngày không hợp lệ (đè lên CPM thật) | Trung bình | Chỉ hiển thị đề xuất (read-only), KHÔNG tự động ghi đè lịch trình — PM tự áp dụng thủ công qua các API sẵn có |
| Risk Analysis định kỳ chạy tràn nếu nhiều project ACTIVE | Thấp | Enqueue riêng từng project, Celery task đã có `task_acks_late` + retry tắt theo cấu hình hiện tại |

## Open Questions

- Workflow phê duyệt Change Request nhiều bước (Approval BA→PO→PM) — không nằm trong phạm
  vi này, cần một plan riêng nếu người dùng muốn làm tiếp.
- `leaves`/`skills` REST endpoint vẫn chưa mount (Phase 2 debt) — Resource Recommendation sẽ
  đọc `Skill`/`user_skills`/`Leave` trực tiếp qua ORM trong service layer, không cần mount 2
  router đó.

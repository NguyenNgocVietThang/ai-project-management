# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-16)

## Corpus Check
- 610 files · ~571,017 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5569 nodes · 17929 edges · 229 communities (191 shown, 11 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1599 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d96c27b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createFireworks
- Button.tsx
- test_approval_decisions.py
- RequirementBrief
- documents.py
- useTasks.ts
- useNotifications.ts
- AuthService
- unittest_mock
- test_requirement_clarifier_parse.py
- test_version_rollback.py
- list_briefs
- test_xlsx_renderer.py
- RiskWidget.tsx
- test_bpmn_schema.py
- PortfolioInvestorsCard.tsx
- test_requirement_brief_schema.py
- endpoints/ai.py
- test_ws_hardening.py
- require_permissions
- test_cloud_adapters.py
- swimlaneLayout.ts
- test_change_request_service.py
- AITaskType
- process_png.py
- ConnectionManager
- Lát 1: AI hỏi làm rõ rồi SRS/BRD
- compilerOptions
- dependencies
- Button
- env.py
- RequirementItems
- getApiErrorMessage
- test_login_lockout.py
- ResourceService
- ProjectService
- User
- list_projects
- fixture
- diff_snapshots
- test_auth_cookies.py
- chat_service.py
- cn
- main.py
- StorageService
- schedule_optimizer.py
- vitest
- get_db
- providers.tsx
- useCPM.test.tsx
- list_notifications
- versions/types.ts
- useRequirementBrief.ts
- pydantic
- Project
- ai_tasks.py
- document_writer.py
- NotificationService
- run_impact_analysis
- system.py
- NotFoundException
- Thiết kế kiến trúc hệ thống
- endpoints/auth.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- useDocuments.ts
- ChangeRequestDetail.tsx
- approvals.py
- tasks.py
- FastAPI
- api
- AdminUserService
- oauth_state_store.py
- useXlsxExport.ts
- test_process_png.py
- RequirementClarifier.tsx
- ProjectOverviewCharts.tsx
- security_state_service.py
- AGENTS.md
- fireworks.ts
- requirement_briefs.py
- test_resource_recommender.py
- projects/page.tsx
- @tanstack/react-query
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- ProjectRepository
- FakeSocket
- leaves.py
- test_reported_metrics_are_real.py
- list_jobs
- request_document
- BadRequestException
- Chi tiết các Giai đoạn
- test_xlsx_report_job.py
- resource-recommendation.service.ts
- get_redis
- test_cpm_scheduling.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- dashboard_service.py
- devDependencies
- next.config.js
- Đặc tả yêu cầu phần mềm (SRS)
- test_auth_email_verification.py
- Thiết kế: Investor Dashboard (Phase 5, giai đoạn 5.3)
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- project_versions.py
- list_portfolios
- AIResponseError
- middleware.ts
- Rà soát cuối: Render Free + Supabase Free
- Rà soát code và nâng cấp giao diện — 2026-09-15
- test_docx_renderer.py
- layout.ts
- playwright
- useWBS.ts
- package.json
- Redis Free và trạng thái bảo mật
- Kế hoạch: Render Free + Supabase Free
- test_portfolio_project_core.py
- test_security_state.py
- test_oauth_account_takeover.py
- Settings
- test_route_trailing_slash.py
- roles.py
- test_rate_limit.py
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- run_risk_analysis
- next-env.d.ts
- test_route_exposure.py
- sqlalchemy
- date_utils.py
- storage_service.py
- File Structure
- DashboardService
- Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)
- 11. Cài đặt và Chạy hệ thống
- NotificationType
- _compute_signals
- ChangeRequestService
- Durable jobs verification
- test_phase2_task_wbs.py
- get_dashboard_summary
- ProjectCreate
- skills.py
- process_models.py
- InvestorService
- typing
- Chi tiết các Giai đoạn đã hoàn thành
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- AuditLog
- ProcessModel
- Chi tiết các Giai đoạn đã hoàn thành
- portfolio_service.py
- notification_service.py
- Demo Render Free + Supabase Free
- test_dashboard_metrics.py
- Chi tiết kế hoạch triển khai
- test_ai_service.py
- AppBackground.tsx
- impact_analyzer.py
- docx_renderer.py
- as_user
- 20260813_portfolio_project_core.py
- ForbiddenException
- sweep_task_dates
- react
- test_postgres_final_pm_approval_creates_cr_snapshot
- Thiết kế các luồng Phase 4
- scripts
- test_resource_warnings.py
- UI Guidelines (design system noi bo)
- BaseAIProvider
- FakeStorage
- Tiến độ — tasks/plan.md
- schedule-optimization.types.ts
- Frontend durable jobs verification
- Lộ trình: Mô-đun quy trình và báo cáo (Phase 4)
- templates.py
- publish
- seed.py
- portfolio_investor.py
- get_dashboard_service
- wbs_service.py
- tailwind.config.ts
- Prompt điều phối subagent — Phase 4
- 3. Ngăn xếp công nghệ
- Nhật ký tiến độ Phase 4
- Job
- create_refresh_token
- get_current_active_superuser
- overrides
- alembic
- config.ts
- ref_next_intl_server
- types
- vitest.config.mts
- Backend local verification — 2026-10-09
- schemas/requirement_brief.py
- Email and private storage adapters
- celery_app.py
- PortfolioRepository
- Task

## God Nodes (most connected - your core abstractions)
1. `User` - 295 edges
2. `cn()` - 117 edges
3. `Project` - 108 edges
4. `Task` - 104 edges
5. `ForbiddenException` - 101 edges
6. `NotFoundException` - 100 edges
7. `Job` - 99 edges
8. `react` - 96 edges
9. `Base` - 89 edges
10. `ConflictException` - 86 edges

## Surprising Connections (you probably didn't know these)
- `test_so_cau_sql_khong_doi_theo_so_du_an()` --calls--> `Project`  [INFERRED]
  backend/tests/integration/test_investor_portal.py → backend/app/models/project.py
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `list_investor_portfolios()` --calls--> `PaginatedResponse`  [INFERRED]
  backend/app/api/v1/endpoints/investor.py → backend/app/schemas/common.py
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `generate_project_from_brief()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py

## Import Cycles
- None detected.

## Communities (229 total, 11 thin omitted)

### Community 0 - "createFireworks"
Cohesion: 0.19
Nodes (21): colorsFor(), createFireworks(), acquire(), baseSpeed(), burst(), crackleBurst(), destroy(), draw() (+13 more)

### Community 1 - "Button.tsx"
Cohesion: 0.04
Nodes (94): metadata, LoginPageProps, metadata, metadata, PortfoliosPage(), Alert(), AlertProps, VARIANT_CLASSES (+86 more)

### Community 2 - "test_approval_decisions.py"
Cohesion: 0.13
Nodes (27): ApprovalChainResponse, ApprovalService, get_approval_service(), on_change_request_approved(), AsyncSession, Depends, Id các thành viên hoạt động, không phải admin hệ thống, giữ `role` trong dự án.…, Điểm móc khi PM duyệt bước cuối, chạy trong CÙNG transaction với quyết định.… (+19 more)

### Community 3 - "RequirementBrief"
Cohesion: 0.08
Nodes (70): TooManyRequestsException, Hồ sơ yêu cầu: ý tưởng gốc được AI hỏi làm rõ từng mục trước khi sinh dự án.…, RequirementBrief, apply_clarify_result(), enqueue_clarify_turn(), _lock_brief(), _quota_exhausted(), C2: AI hỏi làm rõ hồ sơ yêu cầu, chạy như một job AI bền… (+62 more)

### Community 4 - "documents.py"
Cohesion: 0.15
Nodes (26): download_document(), generate_document(), get_document(), _in_project(), _job_statuses(), list_documents(), _one(), CurrentUser (+18 more)

### Community 5 - "useTasks.ts"
Cohesion: 0.16
Nodes (22): taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, taskService, UserSummary, Assignment, AssignmentCreate (+14 more)

### Community 6 - "useNotifications.ts"
Cohesion: 0.15
Nodes (22): NotificationsPage(), buttonClasses(), NotificationBell(), ACTION_BUTTON, NotificationItem(), Props, TONE_CLASSES, TYPE_META (+14 more)

### Community 7 - "AuthService"
Cohesion: 0.14
Nodes (9): AuthService, AsyncSession, datetime, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock. Trả về…, Đổi một refresh token lấy một cặp token mới, xoay vòng token cũ ra. Mỗi refresh…, Đăng xuất phía server theo kiểu best-effort. Thu hồi CẢ HAI token. Trước đây… (+1 more)

### Community 8 - "unittest_mock"
Cohesion: 0.11
Nodes (25): EmailDeliveryError, _mail_config(), RuntimeError, Safe to persist in job failures; excludes provider response bodies., _send(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email() (+17 more)

### Community 9 - "test_requirement_clarifier_parse.py"
Cohesion: 0.13
Nodes (16): build_clarify_prompt(), ClarifyItem, ClarifyResponse, _cut(), parse_clarify_response(), BaseModel, model_validator, Kiểm tra output của model; mọi sai lệch đều thành `AIResponseError`. (+8 more)

### Community 10 - "test_version_rollback.py"
Cohesion: 0.06
Nodes (67): Dependency, Phase, ProjectVersion, _apply_fields(), build_snapshot(), create_snapshot(), _enforce_cap(), _from_json() (+59 more)

### Community 11 - "list_briefs"
Cohesion: 0.14
Nodes (14): list_briefs(), ge, get, le, Query, Hồ sơ của tôi, mới nhất trước., ItemCounts, RequirementBriefSummary (+6 more)

### Community 12 - "test_xlsx_renderer.py"
Cohesion: 0.06
Nodes (62): Các renderer báo cáo thuần (không truy cập DB). Tầng job/endpoint (X2) chịu…, build_report_data(), date, Dựng ProjectReportData. Ném Forbidden/NotFound/Unprocessable như API tương ứng., burndown_header_row(), BurndownRow, ChangeRequestRow, _coerce_date() (+54 more)

### Community 13 - "RiskWidget.tsx"
Cohesion: 0.24
Nodes (12): isRiskLevel(), parseRiskResult(), RISK_TONE, RiskWidget(), STATUS_LABEL, useRequestRiskAnalysis(), asRiskFactorList(), asStringList() (+4 more)

### Community 14 - "test_bpmn_schema.py"
Cohesion: 0.14
Nodes (32): _error_text(), parametrize, Test schema quy trình BPMN (B1): validator đồ thị, trần kích thước, bảng bước., Quy trình duyệt đơn hợp lệ: 2 lane, một exclusive gateway có nhãn., test_blank_label_normalized_to_none(), test_blank_name_rejected(), test_closed_cycle_without_exit_rejected(), test_dead_end_node_rejected() (+24 more)

### Community 15 - "PortfolioInvestorsCard.tsx"
Cohesion: 0.10
Nodes (24): frontend_messages_vi, HealthDonut(), ORDER, totals, metrics(), row(), HEALTH_COLORS, PortfolioInvestorsCard() (+16 more)

### Community 16 - "test_requirement_brief_schema.py"
Cohesion: 0.13
Nodes (35): apply_item_updates(), empty_items(), Danh sách mục ban đầu: mọi mục `missing`, chưa có nguồn., Kiểm tra dữ liệu `items` đọc từ DB hoặc từ bên ngoài., Áp danh sách cập nhật lên các mục, trả về bản mới (không sửa đầu vào). Nguyên…, Cập nhật mục vi phạm quy tắc nghiệp vụ; không mục nào được áp., RequirementBriefUpdateError, validate_items() (+27 more)

### Community 17 - "endpoints/ai.py"
Cohesion: 0.14
Nodes (32): AIServiceDep, AIGenerateProjectFromBriefRequest, generate_project(), generate_project_from_brief(), get_ai_job(), list_ai_jobs(), BaseModel, CurrentUser (+24 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.07
Nodes (40): chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, authenticate_ws() (+32 more)

### Community 19 - "require_permissions"
Cohesion: 0.11
Nodes (35): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+27 more)

### Community 20 - "test_cloud_adapters.py"
Cohesion: 0.21
Nodes (23): client(), AsyncClient, HTTP client chưa xác thực, chạy trên app thật qua ASGI., email_settings(), asyncio, parametrize, storage_settings(), test_email_idempotency_conflict_is_classified() (+15 more)

### Community 21 - "swimlaneLayout.ts"
Cohesion: 0.08
Nodes (37): clip(), NodeShape(), ProcessDiagram(), model, wrap(), ZOOM_STEPS, processKeys, BACK_EDGE_DROP (+29 more)

### Community 22 - "test_change_request_service.py"
Cohesion: 0.09
Nodes (50): UnprocessableException, Approval, ApprovalStatus, str, ChangeRequest, CRStatus, str, ChangeRequestCreate (+42 more)

### Community 23 - "AITaskType"
Cohesion: 0.10
Nodes (30): AmbiguousJobError, get_ai_provider(), xKiro là provider AI duy nhất được hỗ trợ (gộp nhiều model miễn phí sau 1 API…, AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm…, Các loại tác vụ AI trong hệ thống, tương ứng các SOP trong roadmap AI. (+22 more)

### Community 24 - "process_png.py"
Cohesion: 0.10
Nodes (24): _arrow_head(), _Box, _draw_lines(), _font_path(), _has_vietnamese_glyphs(), _line_height(), _load_font(), _ranks() (+16 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 26 - "Lát 1: AI hỏi làm rõ rồi SRS/BRD"
Cohesion: 0.06
Nodes (31): A1: Tạo chuỗi duyệt khi submit CR, A2: Quyết định bước duyệt, A3: UI dòng thời gian duyệt, C1: Model và migration hồ sơ yêu cầu, C2: Job hỏi làm rõ (`ai.clarify`), C3: API hồ sơ yêu cầu, C4: Project Generator dùng hồ sơ đã chốt, C5: UI hỏi làm rõ (+23 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 29 - "Button"
Cohesion: 0.07
Nodes (49): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), Button, DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable() (+41 more)

### Community 30 - "env.py"
Cohesion: 0.38
Nodes (5): do_run_migrations(), run_async_migrations(), run_migrations_online(), Connection, sqlalchemy_engine

### Community 31 - "RequirementItems"
Cohesion: 0.38
Nodes (4): Any, Đúng bảy mục cố định; khóa lạ hoặc thiếu khóa đều bị từ chối., Dạng lưu vào cột JSON, giữ thứ tự khóa cố định., RequirementItems

### Community 32 - "getApiErrorMessage"
Cohesion: 0.05
Nodes (85): VerifyEmailContent(), verify(), DashboardPage(), InvestorPortfolioPage(), AIInsightsPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectGanttPage() (+77 more)

### Community 33 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (23): _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., record_failure(), seconds_until_unlocked() (+15 more)

### Community 34 - "ResourceService"
Cohesion: 0.13
Nodes (12): Assignment, set_current_project_id(), AssignmentResponse, get_resource_service(), AsyncSession, date, Depends, Cac assignment cua nguoi dung hien tai, moi nhat truoc. Co gioi han: danh sach… (+4 more)

### Community 35 - "ProjectService"
Cohesion: 0.15
Nodes (23): ProjectMethodology, ProjectStatus, str, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse (+15 more)

### Community 36 - "User"
Cohesion: 0.07
Nodes (24): AIJobResponse, AIResultResponse, EpicStatus, str, MilestoneStatus, str, PhaseStatus, str (+16 more)

### Community 37 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 38 - "fixture"
Cohesion: 0.25
Nodes (9): _disable_rate_limiting(), event_loop(), AsyncSession, fixture, Role, Tắt rate limit theo TỪNG test, rồi khôi phục. `test_auth_password_recovery.py`…, Các vai trò dự án cùng một permission tối thiểu để kiểm tra RBAC., seed_roles() (+1 more)

### Community 39 - "diff_snapshots"
Cohesion: 0.18
Nodes (22): _brief(), _cap(), diff_snapshots(), _field_changes(), _key(), _normalize_id_map(), Any, So sánh hai snapshot phiên bản dự án (V2). Hàm thuần, không truy cập DB. - Thực… (+14 more)

### Community 40 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 41 - "chat_service.py"
Cohesion: 0.10
Nodes (39): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+31 more)

### Community 42 - "cn"
Cohesion: 0.05
Nodes (92): InvestorHomePage(), Metric(), PortfolioDetailPage(), KanbanColumn(), TaskCard(), TaskTable(), MiniProgressBar(), MiniProgressBarProps (+84 more)

### Community 43 - "main.py"
Cohesion: 0.04
Nodes (59): configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:…, Cau hinh logging goc. `json_output` tat o development, noi mot dong doc duoc…, RequestIdFilter, set_request_id() (+51 more)

### Community 44 - "StorageService"
Cohesion: 0.20
Nodes (11): AsyncClient, Response, RuntimeError, Create a missing private bucket, or reject an existing public bucket., Sanitized storage failure suitable for application logs., Call only after authorization. URLs are bearer capabilities until expiry., Private Supabase REST storage, with the existing local MinIO adapter., StorageError (+3 more)

### Community 45 - "schedule_optimizer.py"
Cohesion: 0.16
Nodes (28): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, SOP-AI-003: Đề xuất tối ưu lịch trình bằng AI (fast-track / crash / cân bằng… (+20 more)

### Community 46 - "vitest"
Cohesion: 0.09
Nodes (14): frontend_messages_en, mocks, mocks, record, empty, jobState, mocks, mocks (+6 more)

### Community 47 - "get_db"
Cohesion: 0.07
Nodes (29): AsyncSession, Depends, Header, post, schedule_jobs(), list_permissions(), AsyncSession, Depends (+21 more)

### Community 48 - "providers.tsx"
Cohesion: 0.13
Nodes (17): frontend_src_app_globals, inter, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark() (+9 more)

### Community 49 - "useCPM.test.tsx"
Cohesion: 0.15
Nodes (17): mocks, CPM_JOB_KIND, cpmKeys, shouldRetry(), schedule, useCPM(), UseCPMResult, useReloadWhenCPMJobSucceeds() (+9 more)

### Community 50 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 51 - "versions/types.ts"
Cohesion: 0.09
Nodes (27): diff, emptyGroup, messages, mocks, setup(), version(), zero, RollbackDialogProps (+19 more)

### Community 52 - "useRequirementBrief.ts"
Cohesion: 0.13
Nodes (21): ItemRowProps, briefKeys, loadActiveBriefId(), loadGenerationJobId(), readStorage(), requirementBriefService, BriefItem, BriefItemKey (+13 more)

### Community 53 - "pydantic"
Cohesion: 0.19
Nodes (13): download_xlsx_report(), BaseModel, CurrentUser, CurrentVerifiedUser, DB, get, post, X2: xuất báo cáo XLSX của dự án (job bền `report.xlsx`) và tải qua proxy có… (+5 more)

### Community 54 - "Project"
Cohesion: 0.05
Nodes (94): AIOutput, AIRequest, AIRequestStatus, AIRequestType, str, ImpactReport, str, RiskLevel (+86 more)

### Community 55 - "ai_tasks.py"
Cohesion: 0.10
Nodes (29): ImpactReportResponse, BaseModel, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse, generate_project_task(), _generate_with_own_session(), impact_analysis_task() (+21 more)

### Community 56 - "document_writer.py"
Cohesion: 0.10
Nodes (36): alembic_migration, alembic_operations, build_assumption_items(), build_brief_context(), build_process_steps(), build_system_prompt(), build_user_prompt(), _cut() (+28 more)

### Community 57 - "NotificationService"
Cohesion: 0.15
Nodes (13): Notification, get_notification_service(), NotificationService, AsyncSession, Depends, Tạo, lưu và phát real-time một notification. Gọi flush ngay lập tức (cần thiết…, Cùng nội dung, nhiều người nhận — một lần INSERT, một lần publish. Gọi `push()`…, asyncio (+5 more)

### Community 58 - "run_impact_analysis"
Cohesion: 0.28
Nodes (17): AsyncSession, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis(), change_request(), FakeScalars, make_db(), patched_ai(), project() (+9 more)

### Community 59 - "system.py"
Cohesion: 0.14
Nodes (14): create_system(), delete_system(), get_system(), list_system(), delete, get, post, put (+6 more)

### Community 60 - "NotFoundException"
Cohesion: 0.12
Nodes (15): ConflictException, NotFoundException, get_document(), Đọc bản ghi sau khi kiểm tra quyền thành viên dự án (mọi vai trò được xem)., Đọc bytes DOCX để endpoint proxy tải về: (data, content_type, tên tệp gợi ý).…, read_document_file(), get_report_job(), Job báo cáo thuộc dự án, sau khi kiểm tra người gọi là thành viên đọc được task. (+7 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Change History, Cấu trúc thư mục phía máy chủ thực tế, Durable jobs và tác vụ theo lịch, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "endpoints/auth.py"
Cohesion: 0.07
Nodes (65): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+57 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.08
Nodes (26): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống (+18 more)

### Community 64 - "useDocuments.ts"
Cohesion: 0.22
Nodes (15): documentFilename(), documentService, saveBlob(), documentKeys, hasActiveDocument(), api, base, useDownloadDocument() (+7 more)

### Community 65 - "ChangeRequestDetail.tsx"
Cohesion: 0.11
Nodes (23): ChangeRequestDetailPage(), useBreadcrumbLabel(), parseMissingRoles(), readApiError(), ApprovalTimeline(), DOT_CLASS, STATUS_ICON, STATUS_TONE (+15 more)

### Community 66 - "approvals.py"
Cohesion: 0.18
Nodes (14): ApprovalServiceDep, approve_step(), list_approvals(), CurrentUser, CurrentVerifiedUser, get, post, Quyết định từng bước duyệt CR (A2), lồng dưới /change-… (+6 more)

### Community 67 - "tasks.py"
Cohesion: 0.16
Nodes (23): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+15 more)

### Community 68 - "FastAPI"
Cohesion: 0.04
Nodes (86): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+78 more)

### Community 69 - "api"
Cohesion: 0.13
Nodes (16): ApprovalChain, ApprovalRole, approvalService, ApprovalStep, ApprovalStepStatus, approvalKeys, Decision, changeRequestKeys (+8 more)

### Community 70 - "AdminUserService"
Cohesion: 0.13
Nodes (29): AdminUserCreate, AdminUserUpdate, field_validator, AdminUserService, AsyncSession, User, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài… (+21 more)

### Community 71 - "oauth_state_store.py"
Cohesion: 0.17
Nodes (18): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get, limit, OAuthServiceDep (+10 more)

### Community 72 - "useXlsxExport.ts"
Cohesion: 0.28
Nodes (12): reportErrorCode(), useXlsxExport(), XlsxExportState, readStoredJobId(), reportService, storageKey(), writeStoredJobId(), KNOWN_REPORT_ERRORS (+4 more)

### Community 73 - "test_process_png.py"
Cohesion: 0.22
Nodes (17): prepare_process_section(), Trả (PNG sơ đồ hoặc None, bảng bước dự phòng, cảnh báo). Không có quy trình:…, _render_and_store(), ProcessRenderError, RuntimeError, Vẽ quy trình thành PNG (bytes). Ném `ProcessRenderError` nếu không vẽ được., Không vẽ được sơ đồ quy trình; nơi gọi chuyển sang bảng các bước., render_process_png() (+9 more)

### Community 74 - "RequirementClarifier.tsx"
Cohesion: 0.10
Nodes (33): apiDetail(), DocumentsPage(), formatDateTime(), KNOWN_ERRORS, STATUS_TONE, apiDetail(), formatDateTime(), KNOWN_ERRORS (+25 more)

### Community 75 - "ProjectOverviewCharts.tsx"
Cohesion: 0.08
Nodes (49): ProjectOverviewCharts, BurndownChart(), BurndownChartLabels, BurndownChartProps, DEFAULT_LABELS, formatDate(), ANIMATION_DURATION, animationProps() (+41 more)

### Community 76 - "security_state_service.py"
Cohesion: 0.27
Nodes (21): claim(), clear(), _clock(), contains(), _hash(), increment(), _increment(), _insert() (+13 more)

### Community 78 - "fireworks.ts"
Cohesion: 0.11
Nodes (17): AMBER, easeOutCubic(), FireworksEngine, FireworksOptions, GOLD, Hue, INTERACTIVE_SELECTOR, LIME (+9 more)

### Community 79 - "requirement_briefs.py"
Cohesion: 0.18
Nodes (24): accept_assumption(), answer_question(), create_brief(), finalize(), get_brief(), patch_item(), CurrentVerifiedUser, DB (+16 more)

### Community 80 - "test_resource_recommender.py"
Cohesion: 0.23
Nodes (18): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), Any, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.…, xKiro la provider AI duy nhat duoc ho tro (gop nhieu model mien phi sau 1 API… (+10 more)

### Community 81 - "projects/page.tsx"
Cohesion: 0.11
Nodes (32): ProjectsPage(), Option, SegmentedControl(), InviteMemberDialog(), InitialProjectMember, ProjectWizard(), useAssignableRoles(), useUserSearch() (+24 more)

### Community 82 - "@tanstack/react-query"
Cohesion: 0.13
Nodes (25): GenerationStatus(), aiJobKeys, useAIJob(), useImpactAnalysisJob(), AIJobOutput(), JobsPanelContent(), isAccessError(), isTerminalJob() (+17 more)

### Community 83 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 84 - "ProjectRepository"
Cohesion: 0.08
Nodes (10): BaseRepository, Any, AsyncSession, datetime, ProjectRepository, AsyncSession, date, datetime (+2 more)

### Community 86 - "leaves.py"
Cohesion: 0.14
Nodes (14): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, post, put (+6 more)

### Community 87 - "test_reported_metrics_are_real.py"
Cohesion: 0.15
Nodes (19): _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong., Truoc day khong schema ghi nao nhan `progress`, nen no chi bang 0 hoac 100., `actual_cost` chi duoc doc o dashboard_service; khong noi nao ghi no. (+11 more)

### Community 88 - "list_jobs"
Cohesion: 0.31
Nodes (9): get_job(), list_jobs(), CurrentUser, DB, ge, get, le, Query (+1 more)

### Community 89 - "request_document"
Cohesion: 0.12
Nodes (30): plan_section_groups(), Chia các mục nhận nội dung AI thành nhóm theo thứ tự mẫu. Mỗi nhóm tối đa…, blocking_missing_items(), _lock_document(), _mark_failed(), GeneratedDocument, Yêu cầu sinh tài liệu trong transaction của bên gọi (không commit). Trả (bản…, Ghi trạng thái failed cho bản ghi (transaction riêng, chỉ khi job này còn quản… (+22 more)

### Community 90 - "BadRequestException"
Cohesion: 0.11
Nodes (9): BadRequestException, ServiceUnavailableException, get_user_service(), AsyncSession, Depends, UploadFile, UserService, HTTPException (+1 more)

### Community 91 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 92 - "test_xlsx_report_job.py"
Cohesion: 0.09
Nodes (31): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, compute_eva(), EVA theo giờ công; công thức ở docstring đầu module., Xếp job xuất XLSX; trả job đang chạy sẵn nếu cùng dự án + ngôn ngữ (chống…, request_xlsx_report() (+23 more)

### Community 93 - "resource-recommendation.service.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 94 - "get_redis"
Cohesion: 0.22
Nodes (12): get_redis(), health_check(), get, Tình trạng sẵn sàng, bao gồm cả các phụ thuộc. Kiểm tra thật sự chạm tới…, _pending_key(), task, Tính lại đường găng ngoài request, có gộp trùng. `recalculate_project` là thao…, Xếp hàng một lần tính lại cho `project_id` nếu chưa có lần nào đang chờ. Trả về… (+4 more)

### Community 95 - "test_cpm_scheduling.py"
Cohesion: 0.12
Nodes (41): run_cpm(), backward_pass(), build_graph(), compute_cpm(), compute_cpm_for_project(), CPMEdge, CPMNode, CPMResult (+33 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.18
Nodes (10): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 5. Trạng thái và phần chờ nghiệm thu (+2 more)

### Community 97 - "dashboard_service.py"
Cohesion: 0.16
Nodes (22): Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioProjectHealth, ProjectDashboardStats (+14 more)

### Community 98 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.13
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 101 - "test_auth_email_verification.py"
Cohesion: 0.29
Nodes (14): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_keeps_hash_but_aborts_on_outbox_failure() (+6 more)

### Community 102 - "Thiết kế: Investor Dashboard (Phase 5, giai đoạn 5.3)"
Cohesion: 0.12
Nodes (15): 10. Kiểm thử, 11. Tài liệu cập nhật khi xong, 1. Mục tiêu, 2. Hiện trạng, 3. Mô hình dữ liệu, 4. Quy tắc truy cập, 5. Chỉ số EVM và ROI, 6.1 Cổng investor (router mới `backend/app/api/v1/endpoints/investor.py`, prefix `/investor`) (+7 more)

### Community 103 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.22
Nodes (9): 4.0 Luồng nghiệp vụ tổng thể, 4.1 Quy trình làm rõ yêu cầu và khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quản lý phiên bản và khôi phục (SOP-PM-004), 4.5 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.6 Sinh tài liệu và báo cáo (SOP-RPT-001), 4.7 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005) (+1 more)

### Community 104 - "project_versions.py"
Cohesion: 0.16
Nodes (21): BaselineCreate, create_baseline(), diff_versions(), EntityDiff, FieldChange, get_version(), list_versions(), ProjectVersionResponse (+13 more)

### Community 105 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 106 - "AIResponseError"
Cohesion: 0.11
Nodes (31): parse_process_model(), Parse output của model thành `ProcessModel`, mọi lỗi quy về `AIResponseError`.…, AIResponseError, _extract_balanced_object(), parse_json_object(), Any, ValueError, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng… (+23 more)

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "test_docx_renderer.py"
Cohesion: 0.23
Nodes (23): _headings(), _open(), _png_bytes(), D1: mẫu SRS/BRD và bộ dựng DOCX thuần. Đọc lại DOCX bằng python-docx để kiểm…, Tạo ảnh PNG RGB nhỏ hợp lệ tại chỗ (không cần thư viện ảnh)., Tìm bảng đứng ngay sau tiêu đề có chứa ``heading_text`` trong thân tài liệu., _render(), _rows() (+15 more)

### Community 111 - "layout.ts"
Cohesion: 0.11
Nodes (30): formatterFor(), GanttChart(), GanttChartLabels, GanttChartProps, labels, large(), small, task() (+22 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 113 - "useWBS.ts"
Cohesion: 0.25
Nodes (14): wbsKeys, wbsService, Epic, EpicInput, Milestone, MilestoneInput, Phase, PhaseDeleteImpact (+6 more)

### Community 114 - "package.json"
Cohesion: 0.07
Nodes (27): description, name, private, version, autoprefixer, axios, clsx, @dnd-kit/core (+19 more)

### Community 115 - "Redis Free và trạng thái bảo mật"
Cohesion: 0.40
Nodes (4): Chuyển mode và nghiệm thu, Hiện trạng và đường tấn công, Interface phối hợp, Redis Free và trạng thái bảo mật

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 117 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 118 - "test_security_state.py"
Cohesion: 0.07
Nodes (54): clear(), Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu., issue(), _key(), Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), consume() (+46 more)

### Community 119 - "test_oauth_account_takeover.py"
Cohesion: 0.31
Nodes (10): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified() (+2 more)

### Community 120 - "Settings"
Cohesion: 0.14
Nodes (18): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), parametrize (+10 more)

### Community 121 - "test_route_trailing_slash.py"
Cohesion: 0.43
Nodes (6): _is_routed(), parametrize, Các endpoint danh sách phải nhận cả dạng có và không có dấu '/' cuối. Next.js…, Kiểm tra có route khớp hoàn toàn mà không cần redirect. FastAPI mới nạp router…, test_create_endpoint_accepts_both_slash_forms(), test_list_endpoint_accepts_both_slash_forms()

### Community 122 - "roles.py"
Cohesion: 0.13
Nodes (35): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+27 more)

### Community 123 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.17
Nodes (8): Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render, Công việc: Render Free + Supabase Free

### Community 126 - "run_risk_analysis"
Cohesion: 0.29
Nodes (16): Chạy một lượt phân tích rủi ro đầy đủ và trả về bản ghi `RiskReport` mới. Không…, run_risk_analysis(), fake_db(), project(), asyncio, SOP-AI-005: run_risk_analysis phải luôn tạo được một RiskReport hợp lệ, kể cả…, AIResponseError (JSON hong/rong) khong duoc lam sap ca luot quet ma phai roi ve…, DB giả với danh sách task rỗng — bỏ qua nhánh CPM/workload phức tạp để test tập… (+8 more)

### Community 128 - "test_route_exposure.py"
Cohesion: 0.16
Nodes (14): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+6 more)

### Community 129 - "sqlalchemy"
Cohesion: 0.06
Nodes (67): JobResponse, BaseModel, Job metadata only: payloads, delivery links and lease secrets stay server-side., Assignment, Các bảng liên kết cho quan hệ nhiều-nhiều., Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatMessage (+59 more)

### Community 137 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 138 - "storage_service.py"
Cohesion: 0.23
Nodes (10): get_storage_service(), asyncio, test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), base64, io, minio_error (+2 more)

### Community 139 - "File Structure"
Cohesion: 0.15
Nodes (12): Chỗ plan làm rõ thêm cho spec, File Structure, Global Constraints, Investor Dashboard Implementation Plan, Task 1: Hàm EVM thuần, Task 2: Mô hình dữ liệu, migration và trường `expected_benefit`, Task 3: Cấp và thu hồi quyền investor, Task 4: API đọc của cổng investor (+4 more)

### Community 145 - "DashboardService"
Cohesion: 0.14
Nodes (14): ActiveProjectSummary, PortfolioHealthResponse, Dữ liệu phản hồi cho GET /dashboards/portfolios/{portfolio_id}/health, DashboardService, _iso_week_bounds(), date, Trả về danh sách ID dự án mà người dùng này nhìn thấy được., Burndown 14 ngày đơn giản: còn lại = tổng - số task đã hoàn thành cộng dồn. (+6 more)

### Community 146 - "Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)"
Cohesion: 0.12
Nodes (16): Câu hỏi mở (không chặn lát 1), Duyệt CR và phiên bản, Gantt, XLSX, BPMN, Giao dịch và lịch sử, Hiện trạng đã xác minh, Hồ sơ yêu cầu và AI hỏi làm rõ, Khóa ngoại liên quan (đã đối chiếu model), Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở) (+8 more)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. (Không bắt buộc, kế thừa) Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "NotificationType"
Cohesion: 0.32
Nodes (14): NotificationType, str, TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, asyncio (+6 more)

### Community 149 - "_compute_signals"
Cohesion: 0.14
Nodes (15): _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days(), generate_risk_analysis(), _level_from_score(), _normalize_level(), Any (+7 more)

### Community 150 - "ChangeRequestService"
Cohesion: 0.23
Nodes (7): ChangeRequestResponse, ChangeRequestService, get_change_request_service(), AsyncSession, ChangeRequest, Depends, Các vai trò duyệt chưa có thành viên hợp lệ, theo thứ tự bước. Thành viên hợp…

### Community 151 - "Durable jobs verification"
Cohesion: 0.40
Nodes (4): Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 152 - "test_phase2_task_wbs.py"
Cohesion: 0.25
Nodes (12): DependencyCreate, TaskCreate, PhaseCreate, _persist_plan(), _persist_plan(), asyncio, test_cascade_phase_delete_records_snapshot_and_recalculates(), test_invalid_task_status_transition_is_rejected() (+4 more)

### Community 153 - "get_dashboard_summary"
Cohesion: 0.33
Nodes (9): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số…, Dữ liệu Dashboard dự án: - Phân bố trạng thái task (dữ liệu biểu đồ donut) -… (+1 more)

### Community 154 - "ProjectCreate"
Cohesion: 0.18
Nodes (5): ProjectCreate, field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, test_portfolio_and_project_schema_validation()

### Community 155 - "skills.py"
Cohesion: 0.14
Nodes (14): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, post, put (+6 more)

### Community 156 - "process_models.py"
Cohesion: 0.17
Nodes (16): generate_process_model(), get_process_model(), CurrentUser, CurrentVerifiedUser, DB, get, post, B2: API quy trình nghiệp vụ (BPMN rút gọn) do AI sinh từ hồ sơ yêu cầu. - POST… (+8 more)

### Community 157 - "InvestorService"
Cohesion: 0.07
Nodes (45): list_investor_portfolios(), Cổng nhà đầu tư: chỉ đọc, mọi route yêu cầu quyền portfolio:read., InvestorGrantCreate, InvestorGrantResponse, InvestorPortfolioItem, InvestorPortfolioOverview, InvestorProjectDetail, InvestorProjectRow (+37 more)

### Community 158 - "typing"
Cohesion: 0.07
Nodes (53): UnauthorizedException, code_challenge_for(), new_code_verifier(), Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved., Challenge S256 tương ứng với `verifier`., hash_password(), verify_password(), AdminUserResponse (+45 more)

### Community 159 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 160 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 161 - "AuditLog"
Cohesion: 0.18
Nodes (14): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, AuditLog, _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới. (+6 more)

### Community 162 - "ProcessModel"
Cohesion: 0.09
Nodes (32): _adjacency(), lint_process_model(), process_steps_table(), ProcessFlow, ProcessLane, ProcessModel, ProcessNode, Any (+24 more)

### Community 163 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 164 - "portfolio_service.py"
Cohesion: 0.12
Nodes (20): Portfolio, PortfolioStatus, str, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary (+12 more)

### Community 165 - "notification_service.py"
Cohesion: 0.35
Nodes (8): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, MarkReadResponse, NotificationListResponse, NotificationResponse, BaseModel, UnreadCountResponse, NotificationService – CRUD + helper để tạo notifications từ các service khác.…, MarkReadResponse

### Community 166 - "Demo Render Free + Supabase Free"
Cohesion: 0.33
Nodes (6): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume

### Community 167 - "test_dashboard_metrics.py"
Cohesion: 0.24
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 168 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 169 - "test_ai_service.py"
Cohesion: 0.38
Nodes (12): ai_request(), authorized_project_context(), db(), asyncio, fixture, SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều hướng…, test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output() (+4 more)

### Community 170 - "AppBackground.tsx"
Cohesion: 0.30
Nodes (9): AppBackground(), currentMode(), hasTextSelection(), FireworksMode, isInteractiveTarget(), FIREWORKS_STORAGE_KEY, FireworksPreference, readFireworksPreference() (+1 more)

### Community 171 - "impact_analyzer.py"
Cohesion: 0.27
Nodes (10): _build_prompt(), generate_impact_analysis(), Any, SOP-AI-002: Phân tích tác động (impact analysis) của một Change Request bằng…, Tính CPM hiện tại của dự án để làm bối cảnh lịch trình thật cho AI. Cùng cách…, Chuẩn hoá output AI trước khi lưu — không tin bất kỳ trường nào của nó. Cùng…, Gọi AI để phân tích tác động của một change request. Trả về dict thô, CHƯA được…, _summarize_cpm() (+2 more)

### Community 172 - "docx_renderer.py"
Cohesion: 0.06
Nodes (58): Document, _add_note(), _add_table(), _add_title_page(), _add_toc(), _cell_text(), _clean_text(), ContentValidation (+50 more)

### Community 173 - "as_user"
Cohesion: 0.07
Nodes (58): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+50 more)

### Community 175 - "ForbiddenException"
Cohesion: 0.09
Nodes (27): ForbiddenException, str, SubtaskStatus, str, TaskPriority, DependencyResponse, add_audit(), get_task_context() (+19 more)

### Community 176 - "sweep_task_dates"
Cohesion: 0.22
Nodes (10): AsyncSession, task, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session(), asyncio (+2 more)

### Community 177 - "react"
Cohesion: 0.03
Nodes (98): AuthLayout(), STEP_ICONS, OAuthCallbackContent(), VerificationState, AdminLayout(), TABS, AdminTile, TILES (+90 more)

### Community 178 - "test_postgres_final_pm_approval_creates_cr_snapshot"
Cohesion: 0.36
Nodes (9): _no_ws_publish(), pg_factory(), asyncio, fixture, _seed(), _snapshot(), test_postgres_concurrent_snapshots_get_distinct_numbers(), test_postgres_final_pm_approval_creates_cr_snapshot() (+1 more)

### Community 179 - "Thiết kế các luồng Phase 4"
Cohesion: 0.25
Nodes (8): Chuỗi job sinh tài liệu SRS/BRD, Duyệt Change Request, Gantt chỉ đọc, Hỏi làm rõ yêu cầu, Mô hình quy trình BPMN, Snapshot và rollback (quy tắc V0), Thiết kế các luồng Phase 4, Xuất XLSX

### Community 180 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 181 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 182 - "UI Guidelines (design system noi bo)"
Cohesion: 0.40
Nodes (4): Mau trang chuan, Primitive, Token, UI Guidelines (design system noi bo)

### Community 183 - "BaseAIProvider"
Cohesion: 0.33
Nodes (4): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider.

### Community 184 - "FakeStorage"
Cohesion: 0.33
Nodes (3): FakeStorage, fixture, storage()

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.25
Nodes (7): Cập nhật 2026-10-14, Cập nhật 2026-10-16 — Investor Dashboard (Phase 5, giai đoạn 5.3), Kiểm thử, Nghiệm thu cloud (2026-10-12), Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

### Community 186 - "schedule-optimization.types.ts"
Cohesion: 0.32
Nodes (6): ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult, ScheduleSuggestion

### Community 187 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 188 - "Lộ trình: Mô-đun quy trình và báo cáo (Phase 4)"
Cohesion: 0.33
Nodes (5): Hiện trạng theo tính năng, Hạn chế đã biết, Lộ trình: Mô-đun quy trình và báo cáo (Phase 4), Quyết định mặc định đang chờ người dùng duyệt, Tổng quan

### Community 189 - "templates.py"
Cohesion: 0.20
Nodes (10): _brief_item_usable(), Column, missing_brief_items(), Any, Mẫu tài liệu SRS và BRD có cấu trúc cố định. Mẫu là nguồn sự thật duy nhất về…, Mục hồ sơ có dữ liệu khi trạng thái là ``clear`` hoặc ``assumed``., Trả về các key hồ sơ còn thiếu mà các mục bắt buộc của mẫu cần. ``brief_items``…, Một cột của mục dạng bảng. (+2 more)

### Community 190 - "publish"
Cohesion: 0.40
Nodes (5): publish(), publish_many(), Any, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…

### Community 191 - "seed.py"
Cohesion: 0.50
Nodes (4): main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), sys

### Community 193 - "get_dashboard_service"
Cohesion: 0.50
Nodes (3): get_dashboard_service(), AsyncSession, Depends

### Community 194 - "wbs_service.py"
Cohesion: 0.05
Nodes (77): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+69 more)

### Community 196 - "Prompt điều phối subagent — Phase 4"
Cohesion: 0.15
Nodes (12): Checkpoint giữa các lát, Câu hỏi mở — giá trị mặc định đã áp dụng, Git, Kết thúc, Lịch thực hiện theo đợt, Prompt điều phối subagent — Phase 4, Quy tắc bắt buộc cho mọi subagent (chép nguyên vào prompt của từng subagent), Tệp chung (chỉ điều phối viên sửa, hoặc giao cho đúng một subagent tại một thời điểm) (+4 more)

### Community 197 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (5 dịch vụ mặc định + 2 dịch vụ Celery kế thừa trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 198 - "Nhật ký tiến độ Phase 4"
Cohesion: 0.50
Nodes (3): Môi trường kiểm thử, Nhật ký, Nhật ký tiến độ Phase 4

### Community 204 - "Job"
Cohesion: 0.05
Nodes (105): ApplyResult, async_sessionmaker, JobContext, JobError, JobResult, JobRunner, PermanentJobError, AsyncSession (+97 more)

### Community 208 - "create_refresh_token"
Cohesion: 0.14
Nodes (30): Phân giải và xác thực một bearer token thành một User đang tồn tại và active., _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), Any, datetime, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết… (+22 more)

### Community 209 - "get_current_active_superuser"
Cohesion: 0.67
Nodes (3): get_current_active_superuser(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC).

### Community 217 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 221 - "types"
Cohesion: 0.10
Nodes (25): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+17 more)

### Community 224 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 233 - "Backend local verification — 2026-10-09"
Cohesion: 0.40
Nodes (4): Backend local verification — 2026-10-09, Contracts exercised, Database and Supabase SQL checks, Remaining deployment evidence

### Community 236 - "schemas/requirement_brief.py"
Cohesion: 0.12
Nodes (25): _build_item(), _clean(), ItemUpdateResult, PendingTurn, BaseModel, model_validator, ValueError, QAEntry (+17 more)

### Community 249 - "Email and private storage adapters"
Cohesion: 0.33
Nodes (5): Email and private storage adapters, Email setup, Existing file flow and scope, Local verification, Supabase Storage setup

### Community 256 - "PortfolioRepository"
Cohesion: 0.20
Nodes (5): PortfolioRepository, AsyncSession, get_project_service(), AsyncSession, Depends

### Community 257 - "Task"
Cohesion: 0.10
Nodes (30): Task, Worklog, AsyncSession, TaskRepository, _candidate_stats(), AsyncSession, Diem vao chinh: nap Task, tinh chi so ung vien, goi AI, roi tra ve dict da xac…, Tinh cac chi so xac dinh (khong AI) cho tung thanh vien du an: ky nang,… (+22 more)

## Knowledge Gaps
- **632 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+627 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1819 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `sqlalchemy`, `Task`, `RequirementBrief`, `test_approval_decisions.py`, `documents.py`, `AuthService`, `test_version_rollback.py`, `test_xlsx_renderer.py`, `endpoints/ai.py`, `test_ws_hardening.py`, `require_permissions`, `DashboardService`, `test_change_request_service.py`, `ChangeRequestService`, `typing`, `ProcessModel`, `ProjectService`, `portfolio_service.py`, `list_projects`, `ResourceService`, `chat_service.py`, `as_user`, `get_db`, `ForbiddenException`, `test_postgres_final_pm_approval_creates_cr_snapshot`, `Project`, `ai_tasks.py`, `NotFoundException`, `seed.py`, `wbs_service.py`, `FastAPI`, `AdminUserService`, `Job`, `create_refresh_token`, `get_current_active_superuser`, `ProjectRepository`, `request_document`, `BadRequestException`, `test_xlsx_report_job.py`, `types`, `dashboard_service.py`, `test_auth_email_verification.py`, `list_portfolios`, `test_security_state.py`, `test_oauth_account_takeover.py`, `roles.py`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `Task` connect `Task` to `sqlalchemy`, `test_version_rollback.py`, `test_xlsx_renderer.py`, `DashboardService`, `_compute_signals`, `test_change_request_service.py`, `ResourceService`, `User`, `impact_analyzer.py`, `schedule_optimizer.py`, `as_user`, `ForbiddenException`, `sweep_task_dates`, `test_postgres_final_pm_approval_creates_cr_snapshot`, `Project`, `document_writer.py`, `run_impact_analysis`, `wbs_service.py`, `Job`, `test_resource_recommender.py`, `ProjectRepository`, `test_xlsx_report_job.py`, `test_cpm_scheduling.py`, `dashboard_service.py`, `run_risk_analysis`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `Project` connect `Project` to `PortfolioRepository`, `sqlalchemy`, `test_approval_decisions.py`, `Task`, `test_version_rollback.py`, `DashboardService`, `NotificationType`, `_compute_signals`, `test_change_request_service.py`, `ChangeRequestService`, `ResourceService`, `ProjectService`, `User`, `impact_analyzer.py`, `schedule_optimizer.py`, `as_user`, `sweep_task_dates`, `test_postgres_final_pm_approval_creates_cr_snapshot`, `ai_tasks.py`, `document_writer.py`, `run_impact_analysis`, `Job`, `ProjectRepository`, `list_jobs`, `test_xlsx_report_job.py`, `test_cpm_scheduling.py`, `dashboard_service.py`, `run_risk_analysis`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 98 inferred relationships involving `User` (e.g. with `generate_project()` and `generate_project_from_brief()`) actually correct?**
  _`User` has 98 INFERRED edges - model-reasoned connections that need verification._
- **Are the 49 inferred relationships involving `Project` (e.g. with `visible_jobs()` and `PortfolioRepository`) actually correct?**
  _`Project` has 49 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _632 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.03638344226579521 - nodes in this community are weakly interconnected._
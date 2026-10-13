# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-13)

## Corpus Check
- 584 files · ~357,160 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5173 nodes · 16381 edges · 189 communities (157 shown, 5 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1543 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `04176aaf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- document_service.py
- react
- sqlalchemy
- durable_jobs.py
- getApiErrorMessage
- versions/page.tsx
- Role
- security.py
- email.py
- pytest
- test_auth_cookies.py
- TaskService
- test_xlsx_renderer.py
- worklogs.py
- test_bpmn_schema.py
- test_document_generation_job.py
- test_requirement_brief_schema.py
- generate_project
- test_ws_hardening.py
- users.py
- test_cloud_adapters.py
- swimlaneLayout.ts
- get_project_context
- test_login_lockout.py
- process_png.py
- ws_manager.py
- Lát 1: AI hỏi làm rõ rồi SRS/BRD
- compilerOptions
- dependencies
- users/page.tsx
- test_audit_regressions.py
- RequirementBrief
- User
- documents/page.tsx
- as_user
- ProjectService
- Chi tiết các Giai đoạn
- list_projects
- typing
- diff_snapshots
- ForbiddenException
- tasks/page.tsx
- requirement_briefs.py
- scheduling_tasks.py
- StorageService
- projects/page.tsx
- admin.py
- test_cpm_scheduling.py
- ThemeProvider.tsx
- make_user
- next-intl
- DashboardService
- portfolios/page.tsx
- test_user_profile_settings.py
- Settings
- bpmn.py
- AIResponseError
- package.json
- ai_tasks.py
- system.py
- types
- Thiết kế kiến trúc hệ thống
- endpoints/auth.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- process_model_service.py
- test_process_png.py
- ChatPanel.tsx
- tasks.py
- schemas/process_model.py
- list_notifications
- RoleService
- test_requirement_clarifier_parse.py
- test_process_model_job.py
- sprints.py
- storage_service.py
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- AGENTS.md
- AdminUserService
- Chi tiết các Giai đoạn đã hoàn thành
- my_assignments
- Chi tiết kế hoạch triển khai
- @tanstack/react-query
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- ApprovalTimeline.tsx
- schemas/user.py
- leaves.py
- schemas/task.py
- test_project_from_brief_job.py
- document_writer.py
- create_epic
- security_state_service.py
- Thiết kế các luồng Phase 4
- env.py
- test_security_state.py
- 20260813_portfolio_project_core.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- PaginatedResponse
- seed.py
- next.config.js
- Lộ trình: Mô-đun quy trình và báo cáo (Phase 4)
- test_auth_email_verification.py
- schedule_jobs
- project_versions.py
- scripts
- middleware.ts
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- Rà soát code và nâng cấp giao diện — 2026-09-15
- layout.ts
- playwright
- main.py
- Kế hoạch: Render Free + Supabase Free
- oauth_state_store.py
- test_resource_warnings.py
- BadRequestException
- Đặc tả yêu cầu phần mềm (SRS)
- Email and private storage adapters
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- run_risk_analysis
- next-env.d.ts
- Rà soát cuối: Render Free + Supabase Free
- documents.py
- date_utils.py
- AuthService
- Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)
- 11. Cài đặt và Chạy hệ thống
- Backend local verification — 2026-10-09
- Durable jobs verification
- list_audit_logs
- Redis Free và trạng thái bảo mật
- BurndownChart.tsx
- pydantic
- skills.py
- AIGenerateProjectFromBriefRequest
- Nhật ký tiến độ Phase 4
- alembic
- RequirementClarifier.tsx
- Demo Render Free + Supabase Free
- test_ai_service.py
- unittest_mock
- docx_renderer.py
- change_requests.py
- get_critical_path
- approvals.py
- Frontend durable jobs verification
- test_portfolio_project_core.py
- Tiến độ — tasks/plan.md
- api.ts
- NotificationType
- ChatService
- create_dependency
- wbs_service.py
- Prompt điều phối subagent — Phase 4
- UserService
- Chi tiết các Giai đoạn đã hoàn thành
- Job
- list_jobs
- resource_leveling
- Project
- test_version_rollback.py
- 3. Ngăn xếp công nghệ
- test_xlsx_report_job.py

## God Nodes (most connected - your core abstractions)
1. `User` - 295 edges
2. `Project` - 104 edges
3. `Task` - 103 edges
4. `ForbiddenException` - 99 edges
5. `Job` - 99 edges
6. `NotFoundException` - 96 edges
7. `Base` - 89 edges
8. `ConflictException` - 86 edges
9. `react` - 75 edges
10. `BadRequestException` - 73 edges

## Surprising Connections (you probably didn't know these)
- `test_audit_log_is_indexed_for_the_activity_feed()` --uses--> `AuditLog`  [INFERRED]
  backend/tests/unit/test_dashboard_activity_scope.py → backend/app/models/audit_log.py
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `generate_project()` --uses--> `AIGenerateProjectRequest`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/schemas/ai.py
- `generate_project_from_brief()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py

## Import Cycles
- None detected.

## Communities (189 total, 5 thin omitted)

### Community 0 - "document_service.py"
Cohesion: 0.09
Nodes (41): TooManyRequestsException, JobError, JobResult, PermanentJobError, Exception, _quota_exhausted(), Đọc (không tăng) bộ đếm quota ngày; quota thật vẫn trừ ở lúc dispatch., C4: xếp hàng sinh dự án từ hồ sơ yêu cầu đã chốt (`ready`). Chạy trong… (+33 more)

### Community 1 - "react"
Cohesion: 0.04
Nodes (98): metadata, LoginPageProps, metadata, metadata, ProfilePageContent(), MiniProgressBar(), MiniProgressBarProps, Alert() (+90 more)

### Community 2 - "sqlalchemy"
Cohesion: 0.08
Nodes (43): Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —…, Comment, DependencyType (+35 more)

### Community 3 - "durable_jobs.py"
Cohesion: 0.08
Nodes (54): AIOutput, AIRequest, AIRequestStatus, AIRequestType, str, ImpactReport, str, RiskLevel (+46 more)

### Community 4 - "getApiErrorMessage"
Cohesion: 0.04
Nodes (99): VerificationState, VerifyEmailContent(), verify(), AdminAuditPage(), DashboardPage(), PortfolioDetailPage(), AIInsightsPage(), ChangeRequestDetailPage() (+91 more)

### Community 5 - "versions/page.tsx"
Cohesion: 0.08
Nodes (40): formatDateTime(), KNOWN_KINDS, diff, emptyGroup, messages, mocks, setup(), version() (+32 more)

### Community 6 - "Role"
Cohesion: 0.06
Nodes (13): Role, BaseRepository, Any, AsyncSession, PortfolioRepository, AsyncSession, datetime, ProjectRepository (+5 more)

### Community 7 - "security.py"
Cohesion: 0.10
Nodes (39): get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các…, _user_from_token(), UnauthorizedException (+31 more)

### Community 8 - "email.py"
Cohesion: 0.12
Nodes (23): EmailDeliveryError, _mail_config(), RuntimeError, Safe to persist in job failures; excludes provider response bodies., _send(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email() (+15 more)

### Community 9 - "pytest"
Cohesion: 0.08
Nodes (28): ABC, AmbiguousJobError, Bounded durable job execution, with short transactions around external work., RetryableJobError, Transactional outbox and durable leases for bounded application workers., Server-only, expiring auth state; Redis loss cannot restore revoked credentials., SecurityState, BaseAIProvider (+20 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 11 - "TaskService"
Cohesion: 0.14
Nodes (16): str, SubtaskStatus, str, TaskPriority, TaskDetailResponse, TaskResponse, Tính lại đường găng, tiến độ dự án và số liệu sprint. Đây là thao tác toàn dự…, recalculate_project() (+8 more)

### Community 12 - "test_xlsx_renderer.py"
Cohesion: 0.07
Nodes (54): Các renderer báo cáo thuần (không truy cập DB). Tầng job/endpoint (X2) chịu…, burndown_header_row(), BurndownRow, ChangeRequestRow, _coerce_date(), CriticalPathData, EVAData, _labels() (+46 more)

### Community 13 - "worklogs.py"
Cohesion: 0.19
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 14 - "test_bpmn_schema.py"
Cohesion: 0.11
Nodes (45): lint_process_model(), process_steps_table(), ProcessModel, Toàn bộ quy trình: làn, nút và luồng, đã kiểm tra tính toàn vẹn đồ thị., Các cảnh báo không chặn (mô hình vẫn hợp lệ và vẽ được). - Exclusive gateway có…, Bảng các bước tuần tự, dùng làm dự phòng trong DOCX khi vẽ sơ đồ lỗi. Duyệt BFS…, process_model_steps(), Bảng các bước từ quy trình (B1) theo định dạng `process_steps` của renderer… (+37 more)

### Community 15 - "test_document_generation_job.py"
Cohesion: 0.14
Nodes (36): plan_section_groups(), Chia các mục nhận nội dung AI thành nhóm theo thứ tự mẫu. Mỗi nhóm tối đa…, get_template(), Lấy mẫu theo loại tài liệu (``srs`` hoặc ``brd``); loại lạ gây ValueError., _add_process(), drain(), FakeProvider, FakeStorage (+28 more)

### Community 16 - "test_requirement_brief_schema.py"
Cohesion: 0.07
Nodes (56): apply_item_updates(), _build_item(), _clean(), empty_items(), ItemCounts, ItemUpdateResult, Any, BaseModel (+48 more)

### Community 17 - "generate_project"
Cohesion: 0.18
Nodes (22): AIServiceDep, generate_project(), generate_project_from_brief(), get_ai_job(), list_ai_jobs(), CurrentUser, CurrentVerifiedUser, Depends (+14 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.08
Nodes (36): chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, authenticate_ws() (+28 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (35): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+27 more)

### Community 20 - "test_cloud_adapters.py"
Cohesion: 0.21
Nodes (23): client(), AsyncClient, HTTP client chưa xác thực, chạy trên app thật qua ASGI., email_settings(), asyncio, parametrize, storage_settings(), test_email_idempotency_conflict_is_classified() (+15 more)

### Community 21 - "swimlaneLayout.ts"
Cohesion: 0.08
Nodes (37): clip(), NodeShape(), ProcessDiagram(), model, wrap(), ZOOM_STEPS, BACK_EDGE_DROP, COL_W (+29 more)

### Community 22 - "get_project_context"
Cohesion: 0.07
Nodes (12): AIJobResponse, AIResultResponse, AIJobResponse, ChangeRequestResponse, Các vai trò duyệt chưa có thành viên hợp lệ, theo thứ tự bước. Thành viên hợp…, get_project_context(), So sánh hai phiên bản; `target_id=None` nghĩa là so với hiện trạng (không lưu)., Khôi phục về phiên bản trong một commit duy nhất. Lỗi giữa chừng: không commit;… (+4 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "process_png.py"
Cohesion: 0.11
Nodes (22): _arrow_head(), _Box, _draw_lines(), _font_path(), _has_vietnamese_glyphs(), _line_height(), _load_font(), _ranks() (+14 more)

### Community 25 - "ws_manager.py"
Cohesion: 0.18
Nodes (14): ConnectionManager, WebSocket, Registry kết nối WebSocket dùng chung + cầu nối pub/sub Redis, được dùng bởi cả…, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio (+6 more)

### Community 26 - "Lát 1: AI hỏi làm rõ rồi SRS/BRD"
Cohesion: 0.06
Nodes (31): A1: Tạo chuỗi duyệt khi submit CR, A2: Quyết định bước duyệt, A3: UI dòng thời gian duyệt, C1: Model và migration hồ sơ yêu cầu, C2: Job hỏi làm rõ (`ai.clarify`), C3: API hồ sơ yêu cầu, C4: Project Generator dùng hồ sơ đã chốt, C5: UI hỏi làm rõ (+23 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "dependencies"
Cohesion: 0.05
Nodes (40): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+32 more)

### Community 29 - "users/page.tsx"
Cohesion: 0.07
Nodes (51): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+43 more)

### Community 30 - "test_audit_regressions.py"
Cohesion: 0.11
Nodes (26): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), Worklog, project_work(), asyncio (+18 more)

### Community 31 - "RequirementBrief"
Cohesion: 0.15
Nodes (30): Hồ sơ yêu cầu: ý tưởng gốc được AI hỏi làm rõ từng mục trước khi sinh dự án.…, RequirementBrief, PendingTurn, Người dùng sửa/xác nhận một mục (nguồn `user`); `key` chỉ dùng trong answer., RequirementBriefSummary, RequirementItemPatch, accept_assumption(), answer() (+22 more)

### Community 32 - "User"
Cohesion: 0.07
Nodes (24): Assignment, User, AsyncSession, UserRepository, ChangeRequest, add_audit(), get_task_context(), Any (+16 more)

### Community 33 - "documents/page.tsx"
Cohesion: 0.09
Nodes (35): apiDetail(), DocumentsPage(), formatDateTime(), KNOWN_ERRORS, STATUS_STYLE, mocks, documentFilename(), documentService (+27 more)

### Community 34 - "as_user"
Cohesion: 0.09
Nodes (36): as_user(), _disable_rate_limiting(), event_loop(), AsyncSession, fixture, Role, Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, Tắt rate limit theo TỪNG test, rồi khôi phục. `test_auth_password_recovery.py`… (+28 more)

### Community 35 - "ProjectService"
Cohesion: 0.09
Nodes (31): ProjectMethodology, ProjectStatus, str, date, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities (+23 more)

### Community 36 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 37 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 38 - "typing"
Cohesion: 0.06
Nodes (58): JobResponse, BaseModel, Job metadata only: payloads, delivery links and lease secrets stay server-side., list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người… (+50 more)

### Community 39 - "diff_snapshots"
Cohesion: 0.18
Nodes (22): _brief(), _cap(), diff_snapshots(), _field_changes(), _key(), _normalize_id_map(), Any, So sánh hai snapshot phiên bản dự án (V2). Hàm thuần, không truy cập DB. - Thực… (+14 more)

### Community 40 - "ForbiddenException"
Cohesion: 0.06
Nodes (89): get_current_active_superuser(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., ConflictException, ForbiddenException, NotFoundException, UnprocessableException, Approval (+81 more)

### Community 41 - "tasks/page.tsx"
Cohesion: 0.05
Nodes (63): KanbanColumn(), SprintView(), STATUSES, TaskCard(), TasksPage(), ViewMode, DeletePhaseDialog(), Editor (+55 more)

### Community 42 - "requirement_briefs.py"
Cohesion: 0.12
Nodes (34): accept_assumption(), answer_question(), create_brief(), finalize(), get_brief(), list_briefs(), patch_item(), CurrentVerifiedUser (+26 more)

### Community 43 - "scheduling_tasks.py"
Cohesion: 0.31
Nodes (8): _pending_key(), task, Tính lại đường găng ngoài request, có gộp trùng. `recalculate_project` là thao…, Xếp hàng một lần tính lại cho `project_id` nếu chưa có lần nào đang chờ. Trả về…, Điểm vào Celery đồng bộ — chạy việc tính lại đến khi hoàn tất., recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 44 - "StorageService"
Cohesion: 0.19
Nodes (10): Response, RuntimeError, Create a missing private bucket, or reject an existing public bucket., Sanitized storage failure suitable for application logs., Call only after authorization. URLs are bearer capabilities until expiry., Private Supabase REST storage, with the existing local MinIO adapter., StorageError, StorageNotFoundError (+2 more)

### Community 45 - "projects/page.tsx"
Cohesion: 0.18
Nodes (21): ProjectsPage(), InitialProjectMember, projectKeys, useCreateProject(), useProjects(), projectService, AuditEvent, MilestoneSummary (+13 more)

### Community 46 - "admin.py"
Cohesion: 0.12
Nodes (24): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+16 more)

### Community 47 - "test_cpm_scheduling.py"
Cohesion: 0.06
Nodes (74): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong… (+66 more)

### Community 48 - "ThemeProvider.tsx"
Cohesion: 0.13
Nodes (18): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+10 more)

### Community 49 - "make_user"
Cohesion: 0.16
Nodes (37): enqueue_clarify_turn(), Tạo một lượt hỏi làm rõ trong transaction của bên gọi (không commit). Ngoại lệ…, make_user(), Tạo một user đã lưu. `verified=False` để kiểm tra cổng email verification., _create(), _job_count(), asyncio, Integration test HTTP cho API hồ sơ yêu cầu (C3), provider AI giả. (+29 more)

### Community 50 - "next-intl"
Cohesion: 0.07
Nodes (42): AuthLayout(), AdminLayout(), TABS, DashboardLayout(), NotificationsPage(), FullPageSpinner(), Brand(), LanguageToggle() (+34 more)

### Community 51 - "DashboardService"
Cohesion: 0.05
Nodes (62): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+54 more)

### Community 52 - "portfolios/page.tsx"
Cohesion: 0.18
Nodes (20): PortfoliosPage(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps, PortfolioList(), portfolioKeys, useCreatePortfolio(), useDeletePortfolio() (+12 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.30
Nodes (19): ChangePasswordRequest, avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_upload_checks_size_and_replaces_previous_object() (+11 more)

### Community 54 - "Settings"
Cohesion: 0.14
Nodes (18): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), parametrize (+10 more)

### Community 55 - "bpmn.py"
Cohesion: 0.13
Nodes (16): _adjacency(), ProcessFlow, ProcessLane, ProcessNode, Any, BaseModel, field_validator, model_validator (+8 more)

### Community 56 - "AIResponseError"
Cohesion: 0.10
Nodes (35): parse_process_model(), Parse output của model thành `ProcessModel`, mọi lỗi quy về `AIResponseError`.…, build_user_prompt(), Dựng phần dữ liệu có giới hạn độ dài rồi rào lại như dữ liệu không tin cậy., AIResponseError, _extract_balanced_object(), parse_json_object(), Any (+27 more)

### Community 57 - "package.json"
Cohesion: 0.06
Nodes (33): description, name, overrides, postcss, private, version, config, autoprefixer (+25 more)

### Community 58 - "ai_tasks.py"
Cohesion: 0.06
Nodes (51): ImpactReportResponse, BaseModel, BaseModel, RiskReportResponse, AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm… (+43 more)

### Community 59 - "system.py"
Cohesion: 0.14
Nodes (14): create_system(), delete_system(), get_system(), list_system(), delete, get, post, put (+6 more)

### Community 60 - "types"
Cohesion: 0.06
Nodes (60): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), Any, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.…, xKiro la provider AI duy nhat duoc ho tro (gop nhieu model mien phi sau 1 API… (+52 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Change History, Cấu trúc thư mục phía máy chủ thực tế, Durable jobs và tác vụ theo lịch, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "endpoints/auth.py"
Cohesion: 0.10
Nodes (45): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+37 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.08
Nodes (26): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống (+18 more)

### Community 64 - "process_model_service.py"
Cohesion: 0.13
Nodes (20): ProcessModelRecord, insufficient_items(), Trả (mục missing, mục skipped) đang chặn việc vẽ quy trình. Quy tắc: -…, _authorize_roles(), find_project_brief(), get_latest_process(), get_latest_process_model(), _lock_project() (+12 more)

### Community 65 - "test_process_png.py"
Cohesion: 0.28
Nodes (14): ProcessRenderError, RuntimeError, Vẽ quy trình thành PNG (bytes). Ném `ProcessRenderError` nếu không vẽ được., Không vẽ được sơ đồ quy trình; nơi gọi chuyển sang bảng các bước., render_process_png(), build_model(), open_png(), Unit test B4: vẽ quy trình thành PNG phía server. (+6 more)

### Community 66 - "ChatPanel.tsx"
Cohesion: 0.10
Nodes (23): ProjectChatPage(), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory() (+15 more)

### Community 67 - "tasks.py"
Cohesion: 0.17
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 68 - "schemas/process_model.py"
Cohesion: 0.16
Nodes (15): generate_process_model(), get_process_model(), CurrentUser, CurrentVerifiedUser, DB, get, post, Quy trình mới nhất kèm cảnh báo lint và bảng các bước. (+7 more)

### Community 69 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 70 - "RoleService"
Cohesion: 0.26
Nodes (16): RoleCreate, RoleUpdate, AsyncSession, Role, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db() (+8 more)

### Community 71 - "test_requirement_clarifier_parse.py"
Cohesion: 0.13
Nodes (16): build_clarify_prompt(), ClarifyItem, ClarifyResponse, _cut(), parse_clarify_response(), BaseModel, model_validator, Kiểm tra output của model; mọi sai lệch đều thành `AIResponseError`. (+8 more)

### Community 72 - "test_process_model_job.py"
Cohesion: 0.26
Nodes (15): Yêu cầu sinh quy trình trong transaction của bên gọi (không commit). Ngoại lệ:…, request_process_model(), FakeProvider, asyncio, Integration test B2: job AI sinh quy trình BPMN từ hồ sơ yêu cầu với provider…, run_jobs(), test_generates_process_from_brief_and_get_latest(), test_http_contract() (+7 more)

### Community 73 - "sprints.py"
Cohesion: 0.24
Nodes (16): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+8 more)

### Community 74 - "storage_service.py"
Cohesion: 0.16
Nodes (12): AsyncClient, asyncio, test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), base64, io, Minio (+4 more)

### Community 75 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.22
Nodes (9): 4.0 Luồng nghiệp vụ tổng thể, 4.1 Quy trình làm rõ yêu cầu và khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quản lý phiên bản và khôi phục (SOP-PM-004), 4.5 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.6 Sinh tài liệu và báo cáo (SOP-RPT-001), 4.7 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005) (+1 more)

### Community 78 - "AdminUserService"
Cohesion: 0.17
Nodes (28): AdminUserCreate, AdminUserUpdate, AdminUserService, AsyncSession, User, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, is_admin() (+20 more)

### Community 79 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 80 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 81 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 82 - "@tanstack/react-query"
Cohesion: 0.04
Nodes (71): frontend_messages_en, OAuthCallbackContent(), mocks, mocks, mocks, record, aiJobKeys, useAIJob() (+63 more)

### Community 83 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 84 - "ApprovalTimeline.tsx"
Cohesion: 0.20
Nodes (14): ApprovalChain, ApprovalRole, approvalService, ApprovalStep, ApprovalStepStatus, readApiError(), ApprovalTimeline(), STATUS_CLASS (+6 more)

### Community 85 - "schemas/user.py"
Cohesion: 0.12
Nodes (11): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator, field_validator, OAuthConnectResponse, BaseModel, field_validator, UserBase (+3 more)

### Community 86 - "leaves.py"
Cohesion: 0.14
Nodes (14): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, post, put (+6 more)

### Community 87 - "schemas/task.py"
Cohesion: 0.08
Nodes (43): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask(), AssignmentCreate, AssignmentMutationResponse (+35 more)

### Community 88 - "test_project_from_brief_job.py"
Cohesion: 0.25
Nodes (14): FakeProvider, job_for(), make_brief(), make_runner(), asyncio, Integration test C4: sinh dự án từ hồ sơ yêu cầu đã chốt với provider giả., Provider giả theo giao thức checkpoint; ghi lại prompt đã nhận., test_brief_not_ready_or_foreign_is_rejected() (+6 more)

### Community 89 - "document_writer.py"
Cohesion: 0.08
Nodes (41): alembic_migration, alembic_operations, build_assumption_items(), build_brief_context(), build_process_steps(), build_project_context(), build_system_prompt(), _cut() (+33 more)

### Community 90 - "create_epic"
Cohesion: 0.23
Nodes (12): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+4 more)

### Community 91 - "security_state_service.py"
Cohesion: 0.27
Nodes (21): claim(), clear(), _clock(), contains(), _hash(), increment(), _increment(), _insert() (+13 more)

### Community 92 - "Thiết kế các luồng Phase 4"
Cohesion: 0.25
Nodes (8): Chuỗi job sinh tài liệu SRS/BRD, Duyệt Change Request, Gantt chỉ đọc, Hỏi làm rõ yêu cầu, Mô hình quy trình BPMN, Snapshot và rollback (quy tắc V0), Thiết kế các luồng Phase 4, Xuất XLSX

### Community 93 - "env.py"
Cohesion: 0.38
Nodes (5): do_run_migrations(), run_async_migrations(), run_migrations_online(), Connection, sqlalchemy_engine

### Community 94 - "test_security_state.py"
Cohesion: 0.07
Nodes (59): issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), consume(), issue() (+51 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.18
Nodes (10): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 5. Trạng thái và phần chờ nghiệm thu (+2 more)

### Community 97 - "PaginatedResponse"
Cohesion: 0.33
Nodes (5): AdminUserResponse, IDResponse, PaginatedResponse, BaseModel, PaginatedResponse

### Community 98 - "seed.py"
Cohesion: 0.50
Nodes (4): main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), sys

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "Lộ trình: Mô-đun quy trình và báo cáo (Phase 4)"
Cohesion: 0.33
Nodes (5): Hiện trạng theo tính năng, Hạn chế đã biết, Lộ trình: Mô-đun quy trình và báo cáo (Phase 4), Quyết định mặc định đang chờ người dùng duyệt, Tổng quan

### Community 101 - "test_auth_email_verification.py"
Cohesion: 0.29
Nodes (14): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_keeps_hash_but_aborts_on_outbox_failure() (+6 more)

### Community 103 - "schedule_jobs"
Cohesion: 0.40
Nodes (5): AsyncSession, Depends, Header, post, schedule_jobs()

### Community 104 - "project_versions.py"
Cohesion: 0.16
Nodes (21): BaselineCreate, create_baseline(), diff_versions(), EntityDiff, FieldChange, get_version(), list_versions(), ProjectVersionResponse (+13 more)

### Community 105 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 111 - "layout.ts"
Cohesion: 0.11
Nodes (32): formatterFor(), GanttChart(), GanttChartLabels, GanttChartProps, labels, large(), small, task() (+24 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 115 - "main.py"
Cohesion: 0.04
Nodes (64): configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:…, Cau hinh logging goc. `json_output` tat o development, noi mot dong doc duoc…, RequestIdFilter, set_request_id() (+56 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 118 - "oauth_state_store.py"
Cohesion: 0.14
Nodes (21): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get, limit, OAuthServiceDep (+13 more)

### Community 119 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 120 - "BadRequestException"
Cohesion: 0.12
Nodes (20): BadRequestException, Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, OAuthService, OAuthState, Any, AsyncSession, User (+12 more)

### Community 122 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.13
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 123 - "Email and private storage adapters"
Cohesion: 0.33
Nodes (5): Email and private storage adapters, Email setup, Existing file flow and scope, Local verification, Supabase Storage setup

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.17
Nodes (8): Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render, Công việc: Render Free + Supabase Free

### Community 126 - "run_risk_analysis"
Cohesion: 0.15
Nodes (27): str, RiskLevel, _as_list(), _clamp_score(), generate_risk_analysis(), _level_from_score(), _normalize_level(), Any (+19 more)

### Community 128 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 129 - "documents.py"
Cohesion: 0.14
Nodes (27): download_document(), generate_document(), get_document(), _in_project(), _job_statuses(), list_documents(), _one(), CurrentUser (+19 more)

### Community 137 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 139 - "AuthService"
Cohesion: 0.08
Nodes (32): hash_password(), verify_password(), ResetPasswordRequest, AuthService, get_auth_service(), AsyncSession, datetime, Depends (+24 more)

### Community 146 - "Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở)"
Cohesion: 0.12
Nodes (16): Câu hỏi mở (không chặn lát 1), Duyệt CR và phiên bản, Gantt, XLSX, BPMN, Giao dịch và lịch sử, Hiện trạng đã xác minh, Hồ sơ yêu cầu và AI hỏi làm rõ, Khóa ngoại liên quan (đã đối chiếu model), Kế hoạch: Phase 4 — Workflow & Reporting (phần còn dang dở) (+8 more)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. (Không bắt buộc, kế thừa) Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "Backend local verification — 2026-10-09"
Cohesion: 0.40
Nodes (4): Backend local verification — 2026-10-09, Contracts exercised, Database and Supabase SQL checks, Remaining deployment evidence

### Community 149 - "Durable jobs verification"
Cohesion: 0.40
Nodes (4): Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 150 - "list_audit_logs"
Cohesion: 0.25
Nodes (8): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query

### Community 151 - "Redis Free và trạng thái bảo mật"
Cohesion: 0.40
Nodes (4): Chuyển mode và nghiệm thu, Hiện trạng và đường tấn công, Interface phối hợp, Redis Free và trạng thái bảo mật

### Community 152 - "BurndownChart.tsx"
Cohesion: 0.18
Nodes (9): BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, BurndownPoint, TeamMemberUtilization (+1 more)

### Community 154 - "pydantic"
Cohesion: 0.31
Nodes (9): AIGenerateProjectRequest, AIImpactAnalysisRequest, AIResourceRecommendationRequest, AIResultResponse, AIRiskAnalysisRequest, AIScheduleOptimizeRequest, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI). (+1 more)

### Community 155 - "skills.py"
Cohesion: 0.14
Nodes (14): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, post, put (+6 more)

### Community 156 - "AIGenerateProjectFromBriefRequest"
Cohesion: 0.67
Nodes (3): AIGenerateProjectFromBriefRequest, BaseModel, Body sinh dự án từ hồ sơ yêu cầu đã chốt (C4).

### Community 158 - "Nhật ký tiến độ Phase 4"
Cohesion: 0.50
Nodes (3): Môi trường kiểm thử, Nhật ký, Nhật ký tiến độ Phase 4

### Community 163 - "RequirementClarifier.tsx"
Cohesion: 0.06
Nodes (53): apiDetail(), formatDateTime(), KNOWN_ERRORS, ProcessPage(), AIGeneratorModal(), empty, jobState, mocks (+45 more)

### Community 166 - "Demo Render Free + Supabase Free"
Cohesion: 0.33
Nodes (6): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume

### Community 169 - "test_ai_service.py"
Cohesion: 0.38
Nodes (12): ai_request(), authorized_project_context(), db(), asyncio, fixture, SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều hướng…, test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output() (+4 more)

### Community 170 - "unittest_mock"
Cohesion: 0.20
Nodes (10): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+2 more)

### Community 172 - "docx_renderer.py"
Cohesion: 0.05
Nodes (77): Document, _add_note(), _add_table(), _add_title_page(), _add_toc(), _cell_text(), _clean_text(), ContentValidation (+69 more)

### Community 180 - "change_requests.py"
Cohesion: 0.36
Nodes (9): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+1 more)

### Community 181 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 182 - "approvals.py"
Cohesion: 0.18
Nodes (14): ApprovalServiceDep, approve_step(), list_approvals(), CurrentUser, CurrentVerifiedUser, get, post, Quyết định từng bước duyệt CR (A2), lồng dưới /change-… (+6 more)

### Community 183 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 184 - "test_portfolio_project_core.py"
Cohesion: 0.07
Nodes (47): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+39 more)

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.33
Nodes (5): Kiểm thử, Nghiệm thu cloud (2026-10-12), Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

### Community 186 - "api.ts"
Cohesion: 0.06
Nodes (39): EmailVerificationBanner(), EmailVerificationBannerProps, bootstrapSession(), refreshAccessToken(), refreshClient, RetriableConfig, authService, ResourceRecommendationJobResponse (+31 more)

### Community 190 - "NotificationType"
Cohesion: 0.11
Nodes (28): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, publish(), publish_many(), Any, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, Notification, NotificationType (+20 more)

### Community 191 - "ChatService"
Cohesion: 0.10
Nodes (37): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+29 more)

### Community 192 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 194 - "wbs_service.py"
Cohesion: 0.06
Nodes (62): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+54 more)

### Community 196 - "Prompt điều phối subagent — Phase 4"
Cohesion: 0.15
Nodes (12): Checkpoint giữa các lát, Câu hỏi mở — giá trị mặc định đã áp dụng, Git, Kết thúc, Lịch thực hiện theo đợt, Prompt điều phối subagent — Phase 4, Quy tắc bắt buộc cho mọi subagent (chép nguyên vào prompt của từng subagent), Tệp chung (chỉ điều phối viên sửa, hoặc giao cho đúng một subagent tại một thời điểm) (+4 more)

### Community 199 - "UserService"
Cohesion: 0.09
Nodes (23): ServiceUnavailableException, Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, DeleteAccountRequest, get_user_service(), _mask_email(), AsyncSession, Depends (+15 more)

### Community 200 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 204 - "Job"
Cohesion: 0.08
Nodes (58): ApplyResult, async_sessionmaker, JobContext, JobRunner, AsyncSession, Recover and claim only free execution slots; useful for deterministic tests., Persist dispatch intent before sending; optional quota reservation is atomic., Save provider response before generating business rows; safe to resume. (+50 more)

### Community 215 - "list_jobs"
Cohesion: 0.31
Nodes (9): get_job(), list_jobs(), CurrentUser, DB, ge, get, le, Query (+1 more)

### Community 224 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 227 - "Project"
Cohesion: 0.06
Nodes (48): Project, Task, TaskStatus, AsyncSession, TaskRepository, _build_prompt(), generate_impact_analysis(), get_ai_provider() (+40 more)

### Community 231 - "test_version_rollback.py"
Cohesion: 0.06
Nodes (74): Dependency, ProjectVersion, _apply_fields(), build_snapshot(), create_snapshot(), _enforce_cap(), _from_json(), get_versioning_service() (+66 more)

### Community 235 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (5 dịch vụ mặc định + 2 dịch vụ Celery kế thừa trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 247 - "test_xlsx_report_job.py"
Cohesion: 0.06
Nodes (53): download_xlsx_report(), BaseModel, CurrentUser, CurrentVerifiedUser, DB, get, post, Xếp job xuất XLSX; nếu đã có job đang chạy cùng ngôn ngữ thì trả lại job đó. (+45 more)

## Knowledge Gaps
- **535 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+530 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1676 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `document_service.py`, `documents.py`, `sqlalchemy`, `durable_jobs.py`, `Role`, `security.py`, `AuthService`, `TaskService`, `test_bpmn_schema.py`, `test_document_generation_job.py`, `generate_project`, `test_ws_hardening.py`, `users.py`, `list_audit_logs`, `get_project_context`, `pydantic`, `RequirementBrief`, `as_user`, `ProjectService`, `list_projects`, `typing`, `ForbiddenException`, `make_user`, `DashboardService`, `test_portfolio_project_core.py`, `ai_tasks.py`, `ChatService`, `process_model_service.py`, `wbs_service.py`, `RoleService`, `UserService`, `test_process_model_job.py`, `Job`, `AdminUserService`, `test_security_state.py`, `seed.py`, `Project`, `test_auth_email_verification.py`, `test_version_rollback.py`, `test_xlsx_report_job.py`, `BadRequestException`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `Project` connect `Project` to `document_service.py`, `sqlalchemy`, `durable_jobs.py`, `Role`, `TaskService`, `test_document_generation_job.py`, `get_project_context`, `test_audit_regressions.py`, `User`, `as_user`, `ProjectService`, `typing`, `ForbiddenException`, `test_cpm_scheduling.py`, `DashboardService`, `ai_tasks.py`, `process_model_service.py`, `Job`, `list_jobs`, `schemas/task.py`, `document_writer.py`, `test_project_from_brief_job.py`, `test_version_rollback.py`, `test_xlsx_report_job.py`, `run_risk_analysis`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `Task` connect `Project` to `document_service.py`, `sqlalchemy`, `durable_jobs.py`, `Role`, `TaskService`, `test_document_generation_job.py`, `test_audit_regressions.py`, `User`, `as_user`, `typing`, `test_cpm_scheduling.py`, `DashboardService`, `ai_tasks.py`, `types`, `wbs_service.py`, `Job`, `document_writer.py`, `test_version_rollback.py`, `test_xlsx_report_job.py`, `run_risk_analysis`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 98 inferred relationships involving `User` (e.g. with `generate_project()` and `generate_project_from_brief()`) actually correct?**
  _`User` has 98 INFERRED edges - model-reasoned connections that need verification._
- **Are the 46 inferred relationships involving `Project` (e.g. with `visible_jobs()` and `PortfolioRepository`) actually correct?**
  _`Project` has 46 INFERRED edges - model-reasoned connections that need verification._
- **Are the 48 inferred relationships involving `Task` (e.g. with `ProjectRepository` and `TaskRepository`) actually correct?**
  _`Task` has 48 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _535 weakly-connected nodes found - possible documentation gaps or missing edges._
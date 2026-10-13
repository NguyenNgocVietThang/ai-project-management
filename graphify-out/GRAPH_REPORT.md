# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-13)

## Corpus Check
- 598 files · ~361,345 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5239 nodes · 16531 edges · 205 communities (171 shown, 6 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1543 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d9bba69f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- run_document_job
- react
- sqlalchemy
- ConflictException
- format.ts
- versions/page.tsx
- PortfolioRepository
- create_refresh_token
- durable_handlers.py
- PermanentJobError
- test_auth_cookies.py
- ForbiddenException
- test_xlsx_renderer.py
- cn
- test_bpmn_schema.py
- GeneratedDocument
- test_requirement_brief_schema.py
- endpoints/ai.py
- test_ws_hardening.py
- users.py
- test_cloud_adapters.py
- swimlaneLayout.ts
- Project
- test_login_lockout.py
- process_png.py
- ws_manager.py
- Lát 1: AI hỏi làm rõ rồi SRS/BRD
- compilerOptions
- dependencies
- users/page.tsx
- test_dashboard_activity_scope.py
- schemas/requirement_brief.py
- User
- documents/page.tsx
- as_user
- BadRequestException
- Chi tiết các Giai đoạn
- projects.py
- sqlalchemy_ext_asyncio
- diff_snapshots
- test_change_request_service.py
- tasks/page.tsx
- requirement_briefs.py
- scheduling_tasks.py
- StorageService
- useProjects.ts
- useCPM.test.tsx
- test_cpm_scheduling.py
- ThemeProvider.tsx
- useNotifications.ts
- next-intl
- dashboard_service.py
- getApiErrorMessage
- test_user_profile_settings.py
- Settings
- ProcessModel
- AIResponseError
- package.json
- project_generator.py
- system.py
- ai_tasks.py
- Thiết kế kiến trúc hệ thống
- endpoints/auth.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- NotFoundException
- test_process_png.py
- ChatPanel.tsx
- tasks.py
- process_models.py
- list_notifications
- Role
- test_requirement_clarifier_parse.py
- DocumentTemplate
- test_auth_password_recovery.py
- storage_service.py
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- AGENTS.md
- AdminUserService
- Chi tiết các Giai đoạn đã hoàn thành
- my_assignments
- Chi tiết kế hoạch triển khai
- @tanstack/react-query
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- ProjectRepository
- pydantic
- leaves.py
- ResourceService
- test_docx_renderer.py
- test_document_writer.py
- auth_service.py
- security_state_service.py
- Thiết kế các luồng Phase 4
- types
- get_redis
- 20260813_portfolio_project_core.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- DashboardService
- devDependencies
- next.config.js
- Lộ trình: Mô-đun quy trình và báo cáo (Phase 4)
- test_auth_email_verification.py
- test_security_state.py
- project_versions.py
- list_portfolios
- middleware.ts
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- Rà soát code và nâng cấp giao diện — 2026-09-15
- layout.ts
- playwright
- main.py
- Kế hoạch: Render Free + Supabase Free
- milestones.py
- oauth.py
- test_resource_warnings.py
- test_oauth_account_takeover.py
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
- PaginatedResponse
- Redis Free và trạng thái bảo mật
- BurndownChart.tsx
- ProjectCreate
- skills.py
- RequirementItem
- Nhật ký tiến độ Phase 4
- alembic
- RequirementClarifier.tsx
- test_notification_triggers.py
- test_dashboard_metrics.py
- Demo Render Free + Supabase Free
- test_portfolio_project_core.py
- RiskWidget.tsx
- test_ai_service.py
- unittest_mock
- get_dashboard_summary
- docx_renderer.py
- config.ts
- BaseAIProvider
- list_permissions
- list_briefs
- RequirementItems
- FakeStorage
- test_route_trailing_slash.py
- FastAPI
- .push_many
- FakeProvider
- Frontend durable jobs verification
- portfolio_service.py
- Tiến độ — tasks/plan.md
- api.ts
- get_dashboard_service
- get_wbs_service
- NotificationType
- chat_service.py
- DependencyCreate
- wbs_service.py
- ._team_utilization
- Prompt điều phối subagent — Phase 4
- user_service.py
- Chi tiết các Giai đoạn đã hoàn thành
- Job
- list_jobs
- Task
- test_version_rollback.py
- 3. Ngăn xếp công nghệ
- test_xlsx_report_job.py

## God Nodes (most connected - your core abstractions)
1. `User` - 295 edges
2. `Project` - 104 edges
3. `Task` - 103 edges
4. `Job` - 99 edges
5. `ForbiddenException` - 99 edges
6. `NotFoundException` - 96 edges
7. `Base` - 89 edges
8. `ConflictException` - 86 edges
9. `react` - 82 edges
10. `BadRequestException` - 73 edges

## Surprising Connections (you probably didn't know these)
- `test_labels_column_type_matches_the_database()` --uses--> `Task`  [INFERRED]
  backend/tests/unit/test_schema_and_query_shape.py → backend/app/models/task.py
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `test_audit_log_is_indexed_for_the_activity_feed()` --uses--> `AuditLog`  [INFERRED]
  backend/tests/unit/test_dashboard_activity_scope.py → backend/app/models/audit_log.py
- `SecurityLimiter` --uses--> `TooManyRequestsException`  [INFERRED]
  backend/app/core/rate_limit.py → backend/app/core/exceptions.py
- `AuthService` --uses--> `TooManyRequestsException`  [INFERRED]
  backend/app/services/auth_service.py → backend/app/core/exceptions.py

## Import Cycles
- None detected.

## Communities (205 total, 6 thin omitted)

### Community 0 - "run_document_job"
Cohesion: 0.50
Nodes (4): _mark_failed(), Ghi trạng thái failed cho bản ghi (transaction riêng, chỉ khi job này còn quản…, run_document_job(), run_document()

### Community 1 - "react"
Cohesion: 0.04
Nodes (80): metadata, LoginPageProps, metadata, metadata, ProfilePageContent(), Alert(), AlertProps, VARIANT_CLASSES (+72 more)

### Community 2 - "sqlalchemy"
Cohesion: 0.06
Nodes (58): Assignment, Các bảng liên kết cho quan hệ nhiều-nhiều., AuditLog, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Comment (+50 more)

### Community 3 - "ConflictException"
Cohesion: 0.04
Nodes (136): ConflictException, TooManyRequestsException, AIOutput, AIRequest, AIRequestStatus, AIRequestType, str, ImpactReport (+128 more)

### Community 4 - "format.ts"
Cohesion: 0.07
Nodes (34): DashboardPage(), ProjectOverviewCharts, ProjectOverviewPage(), MiniProgressBar(), MiniProgressBarProps, ActiveProjectsGrid(), ActiveProjectsGridProps, ProjectCard() (+26 more)

### Community 5 - "versions/page.tsx"
Cohesion: 0.07
Nodes (41): formatDateTime(), KNOWN_KINDS, diff, emptyGroup, messages, mocks, setup(), version() (+33 more)

### Community 6 - "PortfolioRepository"
Cohesion: 0.10
Nodes (11): BaseRepository, Any, AsyncSession, PortfolioRepository, AsyncSession, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., get_project_service() (+3 more)

### Community 7 - "create_refresh_token"
Cohesion: 0.10
Nodes (38): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+30 more)

### Community 8 - "durable_handlers.py"
Cohesion: 0.12
Nodes (25): Handlers for supported durable work. No Celery worker is required., run_email(), run_report(), EmailDeliveryError, _mail_config(), RuntimeError, Safe to persist in job failures; excludes provider response bodies., _send() (+17 more)

### Community 9 - "PermanentJobError"
Cohesion: 0.08
Nodes (34): AmbiguousJobError, JobError, PermanentJobError, Exception, RetryableJobError, get_ai_provider(), SOP-AI-002: Phân tích tác động (impact analysis) của một Change Request bằng…, Tính CPM hiện tại của dự án để làm bối cảnh lịch trình thật cho AI. Cùng cách… (+26 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 11 - "ForbiddenException"
Cohesion: 0.09
Nodes (27): get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ForbiddenException, str, SubtaskStatus (+19 more)

### Community 12 - "test_xlsx_renderer.py"
Cohesion: 0.07
Nodes (58): Các renderer báo cáo thuần (không truy cập DB). Tầng job/endpoint (X2) chịu…, build_report_data(), date, Dựng ProjectReportData. Ném Forbidden/NotFound/Unprocessable như API tương ứng., burndown_header_row(), BurndownRow, ChangeRequestRow, _coerce_date() (+50 more)

### Community 13 - "cn"
Cohesion: 0.05
Nodes (46): ProjectLayout(), ErrorState(), LoadingVariant, ADMIN_SEGMENTS, BreadcrumbContext, BreadcrumbProvider(), Breadcrumbs(), Crumb (+38 more)

### Community 14 - "test_bpmn_schema.py"
Cohesion: 0.14
Nodes (32): _error_text(), parametrize, Test schema quy trình BPMN (B1): validator đồ thị, trần kích thước, bảng bước., Quy trình duyệt đơn hợp lệ: 2 lane, một exclusive gateway có nhãn., test_blank_label_normalized_to_none(), test_blank_name_rejected(), test_closed_cycle_without_exit_rejected(), test_dead_end_node_rejected() (+24 more)

### Community 15 - "GeneratedDocument"
Cohesion: 0.15
Nodes (28): GeneratedDocument, plan_section_groups(), Chia các mục nhận nội dung AI thành nhóm theo thứ tự mẫu. Mỗi nhóm tối đa…, blocking_missing_items(), _enqueue_step(), _lock_document(), GeneratedDocument, Yêu cầu sinh tài liệu trong transaction của bên gọi (không commit). Trả (bản… (+20 more)

### Community 16 - "test_requirement_brief_schema.py"
Cohesion: 0.13
Nodes (36): apply_item_updates(), empty_items(), Danh sách mục ban đầu: mọi mục `missing`, chưa có nguồn., Kiểm tra dữ liệu `items` đọc từ DB hoặc từ bên ngoài., Áp danh sách cập nhật lên các mục, trả về bản mới (không sửa đầu vào). Nguyên…, Cập nhật mục vi phạm quy tắc nghiệp vụ; không mục nào được áp., RequirementBriefUpdateError, validate_items() (+28 more)

### Community 17 - "endpoints/ai.py"
Cohesion: 0.14
Nodes (32): AIServiceDep, AIGenerateProjectFromBriefRequest, generate_project(), generate_project_from_brief(), get_ai_job(), list_ai_jobs(), BaseModel, CurrentUser (+24 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.08
Nodes (33): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized(), enforce_connection_validity() (+25 more)

### Community 19 - "users.py"
Cohesion: 0.11
Nodes (37): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+29 more)

### Community 20 - "test_cloud_adapters.py"
Cohesion: 0.21
Nodes (23): client(), AsyncClient, HTTP client chưa xác thực, chạy trên app thật qua ASGI., email_settings(), asyncio, parametrize, storage_settings(), test_email_idempotency_conflict_is_classified() (+15 more)

### Community 21 - "swimlaneLayout.ts"
Cohesion: 0.08
Nodes (37): clip(), NodeShape(), ProcessDiagram(), model, wrap(), ZOOM_STEPS, BACK_EDGE_DROP, COL_W (+29 more)

### Community 22 - "Project"
Cohesion: 0.07
Nodes (59): ApprovalStatus, str, ChangeRequest, CRStatus, str, Project, build_project_context(), D2: AI viết nội dung tài liệu SRS/BRD theo từng nhóm mục của mẫu. Mỗi nhóm (2-4… (+51 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "process_png.py"
Cohesion: 0.12
Nodes (21): _arrow_head(), _Box, _draw_lines(), _font_path(), _has_vietnamese_glyphs(), _line_height(), _load_font(), _ranks() (+13 more)

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
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 29 - "users/page.tsx"
Cohesion: 0.05
Nodes (60): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), Avatar(), AvatarProps, DeleteRoleDialog(), RoleForm(), RoleFormProps (+52 more)

### Community 30 - "test_dashboard_activity_scope.py"
Cohesion: 0.22
Nodes (10): _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới., test_audit_log_is_indexed_for_the_activity_feed(), test_audit_log_records_the_project_it_belongs_to(), test_recent_activity_filters_by_visible_projects() (+2 more)

### Community 31 - "schemas/requirement_brief.py"
Cohesion: 0.15
Nodes (20): AssumptionAcceptRequest, ItemCounts, ItemUpdateResult, PendingTurn, BaseModel, QAEntry, Schema và hàm thuần cho hồ sơ yêu cầu (requirement brief). Cấu trúc cột `items`…, Một lượt hỏi đáp: câu hỏi của AI và câu trả lời của người dùng (nếu đã có). (+12 more)

### Community 32 - "User"
Cohesion: 0.06
Nodes (27): AIJobResponse, AIResultResponse, EpicStatus, str, MilestoneStatus, str, PhaseStatus, str (+19 more)

### Community 33 - "documents/page.tsx"
Cohesion: 0.17
Nodes (21): apiDetail(), DocumentsPage(), formatDateTime(), KNOWN_ERRORS, STATUS_STYLE, documentFilename(), documentService, saveBlob() (+13 more)

### Community 34 - "as_user"
Cohesion: 0.08
Nodes (56): as_user(), AsyncSession, Role, Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, Các vai trò dự án cùng một permission tối thiểu để kiểm tra RBAC., seed_roles(), project(), asyncio (+48 more)

### Community 35 - "BadRequestException"
Cohesion: 0.13
Nodes (22): BadRequestException, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberResponse (+14 more)

### Community 36 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 37 - "projects.py"
Cohesion: 0.16
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 38 - "sqlalchemy_ext_asyncio"
Cohesion: 0.05
Nodes (47): do_run_migrations(), run_async_migrations(), run_migrations_online(), AsyncSession, Depends, Header, post, schedule_jobs() (+39 more)

### Community 39 - "diff_snapshots"
Cohesion: 0.18
Nodes (22): _brief(), _cap(), diff_snapshots(), _field_changes(), _key(), _normalize_id_map(), Any, So sánh hai snapshot phiên bản dự án (V2). Hàm thuần, không truy cập DB. - Thực… (+14 more)

### Community 40 - "test_change_request_service.py"
Cohesion: 0.07
Nodes (51): ApprovalServiceDep, approve_step(), list_approvals(), CurrentUser, CurrentVerifiedUser, get, post, Quyết định từng bước duyệt CR (A2), lồng dưới /change-… (+43 more)

### Community 41 - "tasks/page.tsx"
Cohesion: 0.05
Nodes (73): KanbanColumn(), SprintView(), STATUSES, TaskCard(), TasksPage(), TaskTable(), ViewMode, DeletePhaseDialog() (+65 more)

### Community 42 - "requirement_briefs.py"
Cohesion: 0.17
Nodes (25): accept_assumption(), answer_question(), create_brief(), finalize(), get_brief(), patch_item(), CurrentVerifiedUser, DB (+17 more)

### Community 43 - "scheduling_tasks.py"
Cohesion: 0.31
Nodes (8): _pending_key(), task, Tính lại đường găng ngoài request, có gộp trùng. `recalculate_project` là thao…, Xếp hàng một lần tính lại cho `project_id` nếu chưa có lần nào đang chờ. Trả về…, Điểm vào Celery đồng bộ — chạy việc tính lại đến khi hoàn tất., recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 44 - "StorageService"
Cohesion: 0.25
Nodes (9): Response, RuntimeError, Create a missing private bucket, or reject an existing public bucket., Sanitized storage failure suitable for application logs., Call only after authorization. URLs are bearer capabilities until expiry., Private Supabase REST storage, with the existing local MinIO adapter., StorageError, StorageNotFoundError (+1 more)

### Community 45 - "useProjects.ts"
Cohesion: 0.13
Nodes (30): ProjectMembersPage(), ProjectSettingsPage(), ProjectsPage(), usePortfolios(), ProjectForm(), InitialProjectMember, useAddProjectMember(), useRemoveProjectMember() (+22 more)

### Community 46 - "useCPM.test.tsx"
Cohesion: 0.14
Nodes (18): ProjectGanttPage(), mocks, CPM_JOB_KIND, cpmKeys, shouldRetry(), schedule, useCPM(), UseCPMResult (+10 more)

### Community 47 - "test_cpm_scheduling.py"
Cohesion: 0.05
Nodes (86): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization() (+78 more)

### Community 48 - "ThemeProvider.tsx"
Cohesion: 0.12
Nodes (19): frontend_src_app_globals, inter, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark() (+11 more)

### Community 49 - "useNotifications.ts"
Cohesion: 0.15
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 50 - "next-intl"
Cohesion: 0.04
Nodes (67): frontend_messages_en, AuthLayout(), OAuthCallbackContent(), VerificationState, AdminLayout(), TABS, DashboardLayout(), mocks (+59 more)

### Community 51 - "dashboard_service.py"
Cohesion: 0.16
Nodes (23): Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth (+15 more)

### Community 52 - "getApiErrorMessage"
Cohesion: 0.06
Nodes (55): VerifyEmailContent(), verify(), PortfolioDetailPage(), PortfoliosPage(), AIInsightsPage(), ChangeRequestDetailPage(), ChangeRequestsPage(), ProjectChatPage() (+47 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.14
Nodes (26): OAuthService, OAuthState, Any, AsyncSession, User, Phân giải identity của provider thành một User. `email_provider_verified` là…, Đổi `state` lấy luồng mà nó đại diện, đúng một lần. Trả về `(OAuthState,…, avatar_bytes() (+18 more)

### Community 54 - "Settings"
Cohesion: 0.14
Nodes (18): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), parametrize (+10 more)

### Community 55 - "ProcessModel"
Cohesion: 0.10
Nodes (30): _adjacency(), lint_process_model(), process_steps_table(), ProcessFlow, ProcessLane, ProcessModel, ProcessNode, Any (+22 more)

### Community 56 - "AIResponseError"
Cohesion: 0.10
Nodes (32): parse_process_model(), Parse output của model thành `ProcessModel`, mọi lỗi quy về `AIResponseError`.…, build_user_prompt(), Dựng phần dữ liệu có giới hạn độ dài rồi rào lại như dữ liệu không tin cậy., AIResponseError, _extract_balanced_object(), parse_json_object(), Any (+24 more)

### Community 57 - "package.json"
Cohesion: 0.04
Nodes (41): description, name, overrides, postcss, private, scripts, build, dev (+33 more)

### Community 58 - "project_generator.py"
Cohesion: 0.14
Nodes (19): build_brief_generation_prompt(), build_brief_snapshot_for_generation(), _cut(), generate_project_from_brief(), generate_project_from_prompt(), get_ai_provider(), Any, SOP-AI-001: Bộ sinh dự án bằng AI (+11 more)

### Community 59 - "system.py"
Cohesion: 0.14
Nodes (14): create_system(), delete_system(), get_system(), list_system(), delete, get, post, put (+6 more)

### Community 60 - "ai_tasks.py"
Cohesion: 0.06
Nodes (67): ImpactReportResponse, BaseModel, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse, AsyncSession, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis() (+59 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Change History, Cấu trúc thư mục phía máy chủ thực tế, Durable jobs và tác vụ theo lịch, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "endpoints/auth.py"
Cohesion: 0.10
Nodes (46): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+38 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.08
Nodes (26): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống (+18 more)

### Community 64 - "NotFoundException"
Cohesion: 0.09
Nodes (20): _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, NotFoundException, User, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, get_document(), Đọc bản ghi sau khi kiểm tra quyền thành viên dự án (mọi vai trò được xem)., Đọc bytes DOCX để endpoint proxy tải về: (data, content_type, tên tệp gợi ý).… (+12 more)

### Community 65 - "test_process_png.py"
Cohesion: 0.20
Nodes (18): prepare_process_section(), Trả (PNG sơ đồ hoặc None, bảng bước dự phòng, cảnh báo). Không có quy trình:…, _render_and_store(), ProcessRenderError, RuntimeError, Vẽ quy trình thành PNG (bytes). Ném `ProcessRenderError` nếu không vẽ được., Không vẽ được sơ đồ quy trình; nơi gọi chuyển sang bảng các bước., render_process_png() (+10 more)

### Community 66 - "ChatPanel.tsx"
Cohesion: 0.11
Nodes (22): ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory(), useMarkChatRead() (+14 more)

### Community 67 - "tasks.py"
Cohesion: 0.17
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 68 - "process_models.py"
Cohesion: 0.17
Nodes (16): generate_process_model(), get_process_model(), CurrentUser, CurrentVerifiedUser, DB, get, post, B2: API quy trình nghiệp vụ (BPMN rút gọn) do AI sinh từ hồ sơ yêu cầu. - POST… (+8 more)

### Community 69 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 70 - "Role"
Cohesion: 0.09
Nodes (40): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+32 more)

### Community 71 - "test_requirement_clarifier_parse.py"
Cohesion: 0.13
Nodes (19): build_clarify_prompt(), ClarifyItem, ClarifyResponse, _cut(), parse_clarify_response(), Any, BaseModel, model_validator (+11 more)

### Community 72 - "DocumentTemplate"
Cohesion: 0.09
Nodes (17): build_system_prompt(), _section_spec(), _brief_item_usable(), Column, DocumentTemplate, missing_brief_items(), Any, Mẫu tài liệu SRS và BRD có cấu trúc cố định. Mẫu là nguồn sự thật duy nhất về… (+9 more)

### Community 73 - "test_auth_password_recovery.py"
Cohesion: 0.17
Nodes (22): hash_password(), datetime, _utcnow(), verify_password(), build_request(), build_service(), extract_token(), asyncio (+14 more)

### Community 74 - "storage_service.py"
Cohesion: 0.15
Nodes (12): AsyncClient, asyncio, test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), base64, Minio, minio_error (+4 more)

### Community 75 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.22
Nodes (9): 4.0 Luồng nghiệp vụ tổng thể, 4.1 Quy trình làm rõ yêu cầu và khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quản lý phiên bản và khôi phục (SOP-PM-004), 4.5 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.6 Sinh tài liệu và báo cáo (SOP-RPT-001), 4.7 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001, SOP-NOTI-001 & SOP-AI-005) (+1 more)

### Community 78 - "AdminUserService"
Cohesion: 0.17
Nodes (28): AdminUserCreate, AdminUserUpdate, field_validator, AdminUserService, get_admin_user_service(), AsyncSession, Depends, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài… (+20 more)

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
Nodes (88): aiJobKeys, useAIJob(), ApprovalChain, ApprovalRole, approvalService, ApprovalStep, ApprovalStepStatus, parseMissingRoles() (+80 more)

### Community 83 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 84 - "ProjectRepository"
Cohesion: 0.12
Nodes (7): ProjectMethodology, ProjectStatus, str, ProjectRepository, AsyncSession, date, datetime

### Community 85 - "pydantic"
Cohesion: 0.14
Nodes (16): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), AdminUserResponse, AuditActorSummary, PermissionResponse, BaseModel, Schema cho trang Admin: quản lý người dùng, quản lý role/permission, audit log., Chỉ đủ để đổ vào một bộ chọn vai trò dự án. Cố tình bỏ `permissions`:… (+8 more)

### Community 86 - "leaves.py"
Cohesion: 0.14
Nodes (14): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, post, put (+6 more)

### Community 87 - "ResourceService"
Cohesion: 0.05
Nodes (56): Assignment, delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask(), active_timer() (+48 more)

### Community 88 - "test_docx_renderer.py"
Cohesion: 0.25
Nodes (22): _headings(), _open(), _png_bytes(), D1: mẫu SRS/BRD và bộ dựng DOCX thuần. Đọc lại DOCX bằng python-docx để kiểm…, Tạo ảnh PNG RGB nhỏ hợp lệ tại chỗ (không cần thư viện ảnh)., Tìm bảng đứng ngay sau tiêu đề có chứa ``heading_text`` trong thân tài liệu., _render(), _rows() (+14 more)

### Community 89 - "test_document_writer.py"
Cohesion: 0.08
Nodes (35): alembic_migration, alembic_operations, build_assumption_items(), build_brief_context(), build_process_steps(), _cut(), parse_group_response(), Any (+27 more)

### Community 90 - "auth_service.py"
Cohesion: 0.17
Nodes (17): claim_revocation(), is_revoked(), _key(), Danh sách thu hồi token, dùng Redis hoặc Postgres theo chế độ triển khai.…, Số giây mà tombstone phải tồn tại lâu hơn, suy ra từ chính `exp` của token.…, Revoke idempotently; database failures raise 503, legacy Redis failures return…, Lookup revocation; database failures reject, legacy Redis failures return False., Atomically rotate a refresh token once; False means missing/already used.… (+9 more)

### Community 91 - "security_state_service.py"
Cohesion: 0.29
Nodes (22): SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment(), _increment() (+14 more)

### Community 92 - "Thiết kế các luồng Phase 4"
Cohesion: 0.25
Nodes (8): Chuỗi job sinh tài liệu SRS/BRD, Duyệt Change Request, Gantt chỉ đọc, Hỏi làm rõ yêu cầu, Mô hình quy trình BPMN, Snapshot và rollback (quy tắc V0), Thiết kế các luồng Phase 4, Xuất XLSX

### Community 93 - "types"
Cohesion: 0.14
Nodes (20): _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong., Truoc day khong schema ghi nao nhan `progress`, nen no chi bang 0 hoac 100., `actual_cost` chi duoc doc o dashboard_service; khong noi nao ghi no. (+12 more)

### Community 94 - "get_redis"
Cohesion: 0.08
Nodes (40): Xác thực và giám sát vòng đời cho các WebSocket endpoint. Handshake trình ra…, _redeem(), issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem() (+32 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.18
Nodes (10): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 5. Trạng thái và phần chờ nghiệm thu (+2 more)

### Community 97 - "DashboardService"
Cohesion: 0.15
Nodes (12): ActiveProjectSummary, DashboardService, _iso_week_bounds(), date, Trả về danh sách ID dự án mà người dùng này nhìn thấy được., Burndown 14 ngày đơn giản: còn lại = tổng - số task đã hoàn thành cộng dồn., Trả về (thứ hai, chủ nhật) của tuần ISO chứa *today*., BurndownPoint (+4 more)

### Community 98 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 99 - "next.config.js"
Cohesion: 0.25
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "Lộ trình: Mô-đun quy trình và báo cáo (Phase 4)"
Cohesion: 0.33
Nodes (5): Hiện trạng theo tính năng, Hạn chế đã biết, Lộ trình: Mô-đun quy trình và báo cáo (Phase 4), Quyết định mặc định đang chờ người dùng duyệt, Tổng quan

### Community 101 - "test_auth_email_verification.py"
Cohesion: 0.29
Nodes (14): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_keeps_hash_but_aborts_on_outbox_failure() (+6 more)

### Community 103 - "test_security_state.py"
Cohesion: 0.19
Nodes (18): client_key(), Use a stable IP; unverified Bearer strings must not create new budgets., durable_store(), asyncio, fixture, Durable auth state survives Redis loss and rejects requests on DB failure., _request(), test_arbitrary_bearer_headers_cannot_change_the_throttle_identity() (+10 more)

### Community 104 - "project_versions.py"
Cohesion: 0.16
Nodes (21): BaselineCreate, create_baseline(), diff_versions(), EntityDiff, FieldChange, get_version(), list_versions(), ProjectVersionResponse (+13 more)

### Community 105 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

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
Nodes (30): formatterFor(), GanttChart(), GanttChartLabels, GanttChartProps, labels, large(), small, task() (+22 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 115 - "main.py"
Cohesion: 0.05
Nodes (56): configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:…, Cau hinh logging goc. `json_output` tat o development, noi mot dong doc duoc…, RequestIdFilter, set_request_id() (+48 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 117 - "milestones.py"
Cohesion: 0.26
Nodes (13): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+5 more)

### Community 118 - "oauth.py"
Cohesion: 0.24
Nodes (15): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get, limit, OAuthServiceDep (+7 more)

### Community 119 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 120 - "test_oauth_account_takeover.py"
Cohesion: 0.31
Nodes (10): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified() (+2 more)

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
Cohesion: 0.21
Nodes (21): str, RiskLevel, _level_from_score(), _normalize_level(), Chạy một lượt phân tích rủi ro đầy đủ và trả về bản ghi `RiskReport` mới. Không…, run_risk_analysis(), fake_db(), project() (+13 more)

### Community 128 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 129 - "documents.py"
Cohesion: 0.19
Nodes (21): download_document(), generate_document(), get_document(), _in_project(), _job_statuses(), list_documents(), _one(), CurrentUser (+13 more)

### Community 137 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 139 - "AuthService"
Cohesion: 0.13
Nodes (11): ServiceUnavailableException, AuthService, get_auth_service(), AsyncSession, datetime, Depends, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái… (+3 more)

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

### Community 150 - "PaginatedResponse"
Cohesion: 0.13
Nodes (21): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+13 more)

### Community 151 - "Redis Free và trạng thái bảo mật"
Cohesion: 0.40
Nodes (4): Chuyển mode và nghiệm thu, Hiện trạng và đường tấn công, Interface phối hợp, Redis Free và trạng thái bảo mật

### Community 152 - "BurndownChart.tsx"
Cohesion: 0.18
Nodes (9): BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, BurndownPoint, TeamMemberUtilization (+1 more)

### Community 154 - "ProjectCreate"
Cohesion: 0.20
Nodes (6): ProjectCreate, ProjectUpdate, field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, test_portfolio_and_project_schema_validation()

### Community 155 - "skills.py"
Cohesion: 0.14
Nodes (14): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, post, put (+6 more)

### Community 156 - "RequirementItem"
Cohesion: 0.18
Nodes (11): _build_item(), _clean(), model_validator, ValueError, Mục người dùng đã chốt: nguồn AI không được ghi đè., RequirementBriefCreate, RequirementItem, RequirementItemUpdate (+3 more)

### Community 158 - "Nhật ký tiến độ Phase 4"
Cohesion: 0.50
Nodes (3): Môi trường kiểm thử, Nhật ký, Nhật ký tiến độ Phase 4

### Community 163 - "RequirementClarifier.tsx"
Cohesion: 0.10
Nodes (38): BriefView(), errorCode(), ErrorNotice(), GenerationStatus(), httpStatus(), IdeaForm(), ItemRow(), ItemRowProps (+30 more)

### Community 164 - "test_notification_triggers.py"
Cohesion: 0.32
Nodes (13): TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, asyncio, test_change_status_notifies_team_on_transition(), test_change_status_skips_notification_when_status_unchanged() (+5 more)

### Community 165 - "test_dashboard_metrics.py"
Cohesion: 0.24
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 166 - "Demo Render Free + Supabase Free"
Cohesion: 0.33
Nodes (6): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume

### Community 167 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 168 - "RiskWidget.tsx"
Cohesion: 0.28
Nodes (11): isRiskLevel(), parseRiskResult(), RiskWidget(), STATUS_LABEL, useRequestRiskAnalysis(), asRiskFactorList(), asStringList(), RISK_LEVEL_COLOR (+3 more)

### Community 169 - "test_ai_service.py"
Cohesion: 0.38
Nodes (12): ai_request(), authorized_project_context(), db(), asyncio, fixture, SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều hướng…, test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output() (+4 more)

### Community 170 - "unittest_mock"
Cohesion: 0.20
Nodes (10): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+2 more)

### Community 171 - "get_dashboard_summary"
Cohesion: 0.33
Nodes (9): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số…, Dữ liệu Dashboard dự án: - Phân bố trạng thái task (dữ liệu biểu đồ donut) -… (+1 more)

### Community 172 - "docx_renderer.py"
Cohesion: 0.09
Nodes (46): Document, _add_note(), _add_table(), _add_title_page(), _add_toc(), _cell_text(), _clean_text(), ContentValidation (+38 more)

### Community 173 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 174 - "BaseAIProvider"
Cohesion: 0.33
Nodes (4): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider.

### Community 175 - "list_permissions"
Cohesion: 0.29
Nodes (7): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles()

### Community 176 - "list_briefs"
Cohesion: 0.29
Nodes (7): list_briefs(), ge, get, le, Query, Hồ sơ của tôi, mới nhất trước., LIST_LIMIT_MAX

### Community 177 - "RequirementItems"
Cohesion: 0.38
Nodes (4): Any, Đúng bảy mục cố định; khóa lạ hoặc thiếu khóa đều bị từ chối., Dạng lưu vào cột JSON, giữ thứ tự khóa cố định., RequirementItems

### Community 178 - "FakeStorage"
Cohesion: 0.33
Nodes (3): FakeStorage, fixture, storage()

### Community 179 - "test_route_trailing_slash.py"
Cohesion: 0.53
Nodes (5): _paths_for(), parametrize, Các endpoint danh sách phải nhận cả dạng có và không có dấu '/' cuối. Next.js…, test_create_endpoint_accepts_both_slash_forms(), test_list_endpoint_accepts_both_slash_forms()

### Community 180 - "FastAPI"
Cohesion: 0.08
Nodes (33): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+25 more)

### Community 181 - ".push_many"
Cohesion: 0.40
Nodes (4): publish_many(), Any, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, Cùng nội dung, nhiều người nhận — một lần INSERT, một lần publish. Gọi `push()`…

### Community 182 - "FakeProvider"
Cohesion: 0.40
Nodes (3): FakeProvider, Provider giả theo giao thức checkpoint + quota; trả nội dung hợp lệ cho nhóm…, sample_value()

### Community 183 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 184 - "portfolio_service.py"
Cohesion: 0.12
Nodes (20): Portfolio, PortfolioStatus, str, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary (+12 more)

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.33
Nodes (5): Kiểm thử, Nghiệm thu cloud (2026-10-12), Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

### Community 186 - "api.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 187 - "get_dashboard_service"
Cohesion: 0.50
Nodes (3): get_dashboard_service(), AsyncSession, Depends

### Community 188 - "get_wbs_service"
Cohesion: 0.50
Nodes (3): get_wbs_service(), AsyncSession, Depends

### Community 190 - "NotificationType"
Cohesion: 0.14
Nodes (21): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, NotificationType, str, MarkReadResponse, NotificationListResponse, NotificationResponse, BaseModel, UnreadCountResponse (+13 more)

### Community 191 - "chat_service.py"
Cohesion: 0.08
Nodes (45): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+37 more)

### Community 192 - "DependencyCreate"
Cohesion: 0.25
Nodes (10): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+2 more)

### Community 194 - "wbs_service.py"
Cohesion: 0.06
Nodes (67): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+59 more)

### Community 196 - "Prompt điều phối subagent — Phase 4"
Cohesion: 0.15
Nodes (12): Checkpoint giữa các lát, Câu hỏi mở — giá trị mặc định đã áp dụng, Git, Kết thúc, Lịch thực hiện theo đợt, Prompt điều phối subagent — Phase 4, Quy tắc bắt buộc cho mọi subagent (chép nguyên vào prompt của từng subagent), Tệp chung (chỉ điều phối viên sửa, hoặc giao cho đúng một subagent tại một thời điểm) (+4 more)

### Community 199 - "user_service.py"
Cohesion: 0.09
Nodes (26): UnauthorizedException, Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, ChangePasswordRequest, DeleteAccountRequest, BaseModel, field_validator, UserUpdate (+18 more)

### Community 200 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 204 - "Job"
Cohesion: 0.06
Nodes (77): ApplyResult, async_sessionmaker, JobContext, JobResult, JobRunner, AsyncSession, Bounded durable job execution, with short transactions around external work., Recover and claim only free execution slots; useful for deterministic tests. (+69 more)

### Community 215 - "list_jobs"
Cohesion: 0.31
Nodes (9): get_job(), list_jobs(), CurrentUser, DB, ge, get, le, Query (+1 more)

### Community 227 - "Task"
Cohesion: 0.06
Nodes (47): Task, TaskStatus, Worklog, AsyncSession, TaskRepository, _compute_signals(), _count_overloaded_user_days(), AsyncSession (+39 more)

### Community 231 - "test_version_rollback.py"
Cohesion: 0.07
Nodes (64): Dependency, DependencyType, str, ProjectVersion, _apply_fields(), create_snapshot(), _enforce_cap(), _from_json() (+56 more)

### Community 235 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (5 dịch vụ mặc định + 2 dịch vụ Celery kế thừa trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 247 - "test_xlsx_report_job.py"
Cohesion: 0.26
Nodes (15): compute_eva(), EVA theo giờ công; công thức ở docstring đầu module., Xếp job xuất XLSX; trả job đang chạy sẵn nếu cùng dự án + ngôn ngữ (chống…, request_xlsx_report(), drain(), http_as(), make_project(), asyncio (+7 more)

## Knowledge Gaps
- **555 isolated node(s):** `inter`, `metadata`, `viewport`, `AlertProps`, `VARIANT_CLASSES` (+550 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1701 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `sqlalchemy`, `ConflictException`, `create_refresh_token`, `durable_handlers.py`, `ForbiddenException`, `AuthService`, `test_xlsx_renderer.py`, `GeneratedDocument`, `endpoints/ai.py`, `test_ws_hardening.py`, `users.py`, `PaginatedResponse`, `Project`, `as_user`, `BadRequestException`, `projects.py`, `sqlalchemy_ext_asyncio`, `test_change_request_service.py`, `list_permissions`, `test_cpm_scheduling.py`, `dashboard_service.py`, `FastAPI`, `test_user_profile_settings.py`, `ProcessModel`, `portfolio_service.py`, `ai_tasks.py`, `chat_service.py`, `NotFoundException`, `wbs_service.py`, `Role`, `user_service.py`, `Job`, `AdminUserService`, `ProjectRepository`, `ResourceService`, `auth_service.py`, `get_redis`, `DashboardService`, `Task`, `test_auth_email_verification.py`, `test_version_rollback.py`, `test_security_state.py`, `list_portfolios`, `test_xlsx_report_job.py`, `test_oauth_account_takeover.py`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `DashboardService` connect `DashboardService` to `NotFoundException`, `User`, `sqlalchemy`, `Task`, `._team_utilization`, `test_dashboard_metrics.py`, `ForbiddenException`, `Job`, `test_xlsx_renderer.py`, `dashboard_service.py`, `ProjectRepository`, `Project`, `test_xlsx_report_job.py`, `portfolio_service.py`, `get_dashboard_service`, `test_dashboard_activity_scope.py`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `Project` connect `Project` to `sqlalchemy`, `ConflictException`, `PortfolioRepository`, `durable_handlers.py`, `PermanentJobError`, `User`, `as_user`, `BadRequestException`, `test_notification_triggers.py`, `sqlalchemy_ext_asyncio`, `test_change_request_service.py`, `test_cpm_scheduling.py`, `dashboard_service.py`, `project_generator.py`, `ai_tasks.py`, `Job`, `ProjectRepository`, `list_jobs`, `ResourceService`, `DashboardService`, `Task`, `test_version_rollback.py`, `test_xlsx_report_job.py`, `run_risk_analysis`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 98 inferred relationships involving `User` (e.g. with `generate_project()` and `generate_project_from_brief()`) actually correct?**
  _`User` has 98 INFERRED edges - model-reasoned connections that need verification._
- **Are the 46 inferred relationships involving `Project` (e.g. with `visible_jobs()` and `PortfolioRepository`) actually correct?**
  _`Project` has 46 INFERRED edges - model-reasoned connections that need verification._
- **Are the 48 inferred relationships involving `Task` (e.g. with `ProjectRepository` and `TaskRepository`) actually correct?**
  _`Task` has 48 INFERRED edges - model-reasoned connections that need verification._
- **What connects `inter`, `metadata`, `viewport` to the rest of the system?**
  _555 weakly-connected nodes found - possible documentation gaps or missing edges._
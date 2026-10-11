# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-11)

## Corpus Check
- 482 files · ~262,574 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3875 nodes · 11865 edges · 161 communities (143 shown, 6 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1042 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a299a9bc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_schedule_optimizer.py
- Input.tsx
- db/base.py
- refresh_token
- formatDate
- (dashboard)/layout.tsx
- PortfolioService
- users/page.tsx
- StorageService
- get_resource_service
- test_auth_cookies.py
- Chi tiết các Giai đoạn đã hoàn thành
- react
- test_ai_service.py
- create_refresh_token
- test_ai_dispatch_budget.py
- projects/page.tsx
- tasks/page.tsx
- UserRepository
- users.py
- test_ai_parsing.py
- ai_tasks.py
- useNotifications.ts
- test_login_lockout.py
- test_resource_recommender.py
- ConnectionManager
- get_critical_path
- compilerOptions
- auth_service.py
- api.ts
- wbs_service.py
- profile/page.tsx
- User
- ThemeProvider.tsx
- as_user
- package.json
- TaskServiceDep
- UserService
- task_service.py
- test_auth_password_recovery.py
- getApiErrorMessage
- ProjectRepository
- oauth.py
- run_risk_analysis
- portfolios/[id]/page.tsx
- wbs/page.tsx
- Role
- test_oauth_account_takeover.py
- list_projects
- run_impact_analysis
- @tanstack/react-query
- DashboardService
- test_reported_metrics_are_real.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- timedelta
- endpoints/auth.py
- Task
- scheduling_tasks.py
- ProjectService
- Thiết kế kiến trúc hệ thống
- PortfolioRepository
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- WBSServiceDep
- list_portfolios
- ChatPanel.tsx
- ResourceServiceDep
- BurndownChart.tsx
- NotificationService
- WBSServiceDep
- schemas/user.py
- test_portfolio_project_core.py
- endpoints/ai.py
- sqlalchemy
- test_resource_warnings.py
- Chi tiết kế hoạch triển khai
- AGENTS.md
- chat_service.py
- project_service.py
- Settings
- Chi tiết các Giai đoạn
- test_security_state.py
- approvals.py
- test_change_request_service.py
- main.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- security_state_service.py
- system.py
- OAuthService
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- my_assignments
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- skills.py
- list_notifications
- next.config.js
- _compute_signals
- test_rate_limit.py
- schedule_jobs
- Chi tiết các Giai đoạn đã hoàn thành
- WBSServiceDep
- test_cpm_scheduling.py
- pytest
- middleware.ts
- .start_flow
- Rà soát code và nâng cấp giao diện — 2026-09-15
- conftest.py
- Chi tiết các Giai đoạn
- playwright
- alembic
- scripts
- Redis Free và trạng thái bảo mật
- Kế hoạch: Render Free + Supabase Free
- LanguageToggle.tsx
- vitest.config.mts
- create_dependency
- .__init__
- get_me
- schemas/gantt.py
- update_subtask
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- test_route_trailing_slash.py
- next-env.d.ts
- Frontend durable jobs verification
- list_permissions
- get_ai_service
- report_tasks.py
- Durable jobs verification
- 11. Cài đặt và Chạy hệ thống
- validate_password_policy
- 3. Ngăn xếp công nghệ
- tailwind.config.ts
- 1. Tổng quan dự án
- resource-recommendation.service.ts
- schedule-optimization.types.ts
- durable_jobs.py
- resource_leveling
- Đặc tả yêu cầu phần mềm (SRS)
- README.md
- Rà soát cuối: Render Free + Supabase Free
- Backend local verification — 2026-10-09
- Tiến độ — tasks/plan.md
- 12. Cấu hình & Biến môi trường
- Email and private storage adapters

## God Nodes (most connected - your core abstractions)
1. `User` - 230 edges
2. `ForbiddenException` - 82 edges
3. `Task` - 78 edges
4. `Base` - 75 edges
5. `WBSService` - 72 edges
6. `NotFoundException` - 70 edges
7. `TaskService` - 70 edges
8. `Project` - 68 edges
9. `BadRequestException` - 66 edges
10. `react` - 62 edges

## Surprising Connections (you probably didn't know these)
- `test_audit_log_is_indexed_for_the_activity_feed()` --uses--> `AuditLog`  [INFERRED]
  backend/tests/unit/test_dashboard_activity_scope.py → backend/app/models/audit_log.py
- `test_labels_column_type_matches_the_database()` --uses--> `Task`  [INFERRED]
  backend/tests/unit/test_schema_and_query_shape.py → backend/app/models/task.py
- `test_user_search_result_never_carries_a_usable_address()` --uses--> `UserSearchResult`  [INFERRED]
  backend/tests/unit/test_route_exposure.py → backend/app/schemas/project.py
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `create_assignment()` --uses--> `AssignmentCreate`  [INFERRED]
  backend/app/api/v1/endpoints/assignments.py → backend/app/schemas/task.py

## Import Cycles
- None detected.

## Communities (161 total, 6 thin omitted)

### Community 0 - "test_schedule_optimizer.py"
Cohesion: 0.16
Nodes (27): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong… (+19 more)

### Community 1 - "Input.tsx"
Cohesion: 0.06
Nodes (41): metadata, LoginPageProps, metadata, metadata, Input, InputProps, AuditLogFilters(), getPasswordStrength() (+33 more)

### Community 2 - "db/base.py"
Cohesion: 0.09
Nodes (27): Approval, ApprovalStatus, str, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, ChatReadState (+19 more)

### Community 3 - "refresh_token"
Cohesion: 0.14
Nodes (30): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), login(), logout(), Depends, limit (+22 more)

### Community 4 - "formatDate"
Cohesion: 0.04
Nodes (66): DashboardPage(), ProjectOverviewCharts, ProjectOverviewPage(), TaskCard(), TaskTable(), MiniProgressBar(), MiniProgressBarProps, TeamBarChartProps (+58 more)

### Community 5 - "(dashboard)/layout.tsx"
Cohesion: 0.10
Nodes (23): frontend_messages_en, AuthLayout(), OAuthCallbackContent(), VerifyEmailContent(), verify(), AdminLayout(), TABS, DashboardLayout() (+15 more)

### Community 6 - "PortfolioService"
Cohesion: 0.16
Nodes (14): PortfolioStatus, str, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse (+6 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (51): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+43 more)

### Community 8 - "StorageService"
Cohesion: 0.05
Nodes (71): Handlers for supported durable work. No Celery worker is required., run_email(), get_storage_service(), AsyncClient, Response, RuntimeError, Create a missing private bucket, or reject an existing public bucket., Sanitized storage failure suitable for application logs. (+63 more)

### Community 9 - "get_resource_service"
Cohesion: 0.50
Nodes (3): get_resource_service(), AsyncSession, Depends

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "react"
Cohesion: 0.08
Nodes (40): Alert(), AlertProps, VARIANT_CLASSES, Avatar(), AvatarProps, Button, ButtonProps, VARIANT_CLASSES (+32 more)

### Community 13 - "test_ai_service.py"
Cohesion: 0.38
Nodes (12): ai_request(), authorized_project_context(), db(), asyncio, fixture, SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều hướng…, test_admin_can_view_another_users_job(), test_completed_job_returns_project_id_and_output() (+4 more)

### Community 14 - "create_refresh_token"
Cohesion: 0.10
Nodes (38): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+30 more)

### Community 15 - "test_ai_dispatch_budget.py"
Cohesion: 0.08
Nodes (35): ABC, AmbiguousJobError, JobError, PermanentJobError, Exception, RetryableJobError, BaseAIProvider, Any (+27 more)

### Community 16 - "projects/page.tsx"
Cohesion: 0.10
Nodes (41): ProjectMembersPage(), ProjectSettingsPage(), TasksPage(), ProjectsPage(), InviteMemberDialog(), ProjectFields(), ProjectForm(), InitialProjectMember (+33 more)

### Community 17 - "tasks/page.tsx"
Cohesion: 0.10
Nodes (33): KanbanColumn(), SprintView(), STATUSES, ViewMode, ConfirmDialog(), localDate(), TaskDrawer(), taskKeys (+25 more)

### Community 18 - "UserRepository"
Cohesion: 0.05
Nodes (43): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized(), enforce_connection_validity() (+35 more)

### Community 19 - "users.py"
Cohesion: 0.06
Nodes (70): AdminUserServiceDep, AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le (+62 more)

### Community 20 - "test_ai_parsing.py"
Cohesion: 0.19
Nodes (13): _extract_balanced_object(), parse_json_object(), Any, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và…, Parse một response của model mà lẽ ra phải là một JSON object duy nhất. Chấp…, parametrize, Phân tích phòng thủ đầu ra của AI model (Phase D6). Các test này cố định hai…, Nếu không, văn bản sau marker được chèn vào sẽ bị hiểu là chỉ thị. (+5 more)

### Community 21 - "ai_tasks.py"
Cohesion: 0.09
Nodes (29): ImpactReportResponse, BaseModel, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse, generate_project_task(), _generate_with_own_session(), impact_analysis_task() (+21 more)

### Community 22 - "useNotifications.ts"
Cohesion: 0.15
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (22): _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., record_failure(), seconds_until_unlocked() (+14 more)

### Community 24 - "test_resource_recommender.py"
Cohesion: 0.20
Nodes (21): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), Any, AsyncSession, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.… (+13 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 26 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "auth_service.py"
Cohesion: 0.13
Nodes (13): TooManyRequestsException, hash_password(), AuthService, get_auth_service(), AsyncSession, datetime, Depends, User (+5 more)

### Community 29 - "api.ts"
Cohesion: 0.09
Nodes (25): changeRequestKeys, aiService, api, bootstrapSession(), refreshAccessToken(), refreshClient, RetriableConfig, ChangeRequestCreateInput (+17 more)

### Community 30 - "wbs_service.py"
Cohesion: 0.06
Nodes (56): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+48 more)

### Community 31 - "profile/page.tsx"
Cohesion: 0.10
Nodes (25): VerificationState, ProfilePageContent(), EmailVerificationBanner(), EmailVerificationBannerProps, AvatarSectionProps, LinkedAccountsSection(), LinkedAccountsSectionProps, providers (+17 more)

### Community 32 - "User"
Cohesion: 0.06
Nodes (48): AIJobResponse, AIResultResponse, Assignment, _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, get_current_active_superuser(), get_current_verified_user(), CurrentUser (+40 more)

### Community 33 - "ThemeProvider.tsx"
Cohesion: 0.13
Nodes (18): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+10 more)

### Community 34 - "as_user"
Cohesion: 0.12
Nodes (29): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+21 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (28): description, name, overrides, postcss, private, version, autoprefixer, clsx (+20 more)

### Community 36 - "TaskServiceDep"
Cohesion: 0.14
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 37 - "UserService"
Cohesion: 0.14
Nodes (14): ServiceUnavailableException, UnauthorizedException, DeleteAccountRequest, get_user_service(), AsyncSession, Depends, UploadFile, UserService (+6 more)

### Community 38 - "task_service.py"
Cohesion: 0.07
Nodes (63): BadRequestException, str, SubtaskStatus, str, TaskPriority, TaskStatus, AssignmentCreate, AssignmentMutationResponse (+55 more)

### Community 39 - "test_auth_password_recovery.py"
Cohesion: 0.22
Nodes (19): verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request (+11 more)

### Community 40 - "getApiErrorMessage"
Cohesion: 0.10
Nodes (32): AdminAuditPage(), AIInsightsPage(), ChangeRequestsPage(), ProjectLayout(), TimesheetPage(), Label, EmptyState(), ErrorState() (+24 more)

### Community 41 - "ProjectRepository"
Cohesion: 0.09
Nodes (9): BaseRepository, Any, AsyncSession, ProjectRepository, AsyncSession, date, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`. (+1 more)

### Community 42 - "oauth.py"
Cohesion: 0.24
Nodes (15): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get, limit, OAuthServiceDep (+7 more)

### Community 43 - "run_risk_analysis"
Cohesion: 0.21
Nodes (21): str, RiskLevel, _level_from_score(), _normalize_level(), Chạy một lượt phân tích rủi ro đầy đủ và trả về bản ghi `RiskReport` mới. Không…, run_risk_analysis(), fake_db(), project() (+13 more)

### Community 44 - "portfolios/[id]/page.tsx"
Cohesion: 0.15
Nodes (25): PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioForm(), PortfolioFormProps, PortfolioList(), portfolioKeys (+17 more)

### Community 45 - "wbs/page.tsx"
Cohesion: 0.14
Nodes (22): DeletePhaseDialog(), Editor, EntityEditor(), statusOptions(), WBSPage(), usePhaseImpact(), useWBS(), useWBSActions() (+14 more)

### Community 46 - "Role"
Cohesion: 0.06
Nodes (50): do_run_migrations(), run_async_migrations(), run_migrations_online(), create_role(), delete_role(), get_role(), list_roles(), AsyncSession (+42 more)

### Community 47 - "test_oauth_account_takeover.py"
Cohesion: 0.31
Nodes (10): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified() (+2 more)

### Community 48 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "run_impact_analysis"
Cohesion: 0.22
Nodes (21): str, RiskLevel, AsyncSession, Chuẩn hoá output AI trước khi lưu — không tin bất kỳ trường nào của nó. Cùng…, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis(), _validate_ai_output(), change_request() (+13 more)

### Community 50 - "@tanstack/react-query"
Cohesion: 0.12
Nodes (28): aiJobKeys, useAIJob(), useImpactAnalysisJob(), AIJobOutput(), FAILURE_LABEL, featureLink(), JobRow(), JobsPanelContent() (+20 more)

### Community 51 - "DashboardService"
Cohesion: 0.05
Nodes (58): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+50 more)

### Community 52 - "test_reported_metrics_are_real.py"
Cohesion: 0.15
Nodes (19): _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong., Truoc day khong schema ghi nao nhan `progress`, nen no chi bang 0 hoac 100., `actual_cost` chi duoc doc o dashboard_service; khong noi nao ghi no. (+11 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.32
Nodes (18): avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_upload_checks_size_and_replaces_previous_object(), test_avatar_upload_rejects_mime_and_reports_storage_outage() (+10 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "timedelta"
Cohesion: 0.05
Nodes (90): ApplyResult, async_sessionmaker, get_job(), list_jobs(), CurrentUser, ge, get, le (+82 more)

### Community 57 - "endpoints/auth.py"
Cohesion: 0.22
Nodes (15): AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, BaseModel, Những gì trình duyệt thực sự nhận được. Refresh token cố tình vắng mặt: nó đi…, Credential dùng một lần cho WebSocket handshake — xem app/core/ws_tickets.py. (+7 more)

### Community 58 - "Task"
Cohesion: 0.08
Nodes (36): set_current_project_id(), Dependency, DependencyType, str, Task, Worklog, AsyncSession, TaskRepository (+28 more)

### Community 59 - "scheduling_tasks.py"
Cohesion: 0.31
Nodes (8): _pending_key(), task, Tính lại đường găng ngoài request, có gộp trùng. `recalculate_project` là thao…, Xếp hàng một lần tính lại cho `project_id` nếu chưa có lần nào đang chờ. Trả về…, Điểm vào Celery đồng bộ — chạy việc tính lại đến khi hoàn tất., recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 60 - "ProjectService"
Cohesion: 0.20
Nodes (5): ProjectService, date, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…, ProjectCapabilities

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "PortfolioRepository"
Cohesion: 0.12
Nodes (9): PortfolioRepository, AsyncSession, datetime, get_portfolio_service(), AsyncSession, Depends, get_project_service(), AsyncSession (+1 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.09
Nodes (23): 10. Đặc tả API và các điểm cuối WebSocket, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+15 more)

### Community 64 - "WBSServiceDep"
Cohesion: 0.22
Nodes (14): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+6 more)

### Community 65 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 66 - "ChatPanel.tsx"
Cohesion: 0.11
Nodes (22): ProjectChatPage(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory(), useMarkChatRead() (+14 more)

### Community 67 - "ResourceServiceDep"
Cohesion: 0.16
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "BurndownChart.tsx"
Cohesion: 0.24
Nodes (7): BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, BurndownPoint, recharts

### Community 69 - "NotificationService"
Cohesion: 0.10
Nodes (28): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, publish(), publish_many(), Any, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, Notification, NotificationType (+20 more)

### Community 70 - "WBSServiceDep"
Cohesion: 0.23
Nodes (14): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+6 more)

### Community 71 - "schemas/user.py"
Cohesion: 0.27
Nodes (8): ChangePasswordRequest, OAuthConnectResponse, BaseModel, field_validator, UserBase, UserCreate, UserResponse, UserUpdate

### Community 72 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 73 - "endpoints/ai.py"
Cohesion: 0.17
Nodes (27): AIServiceDep, generate_project(), get_ai_job(), list_ai_jobs(), CurrentUser, CurrentVerifiedUser, Depends, get (+19 more)

### Community 74 - "sqlalchemy"
Cohesion: 0.05
Nodes (82): asyncio, JobResponse, BaseModel, Job metadata only: payloads, delivery links and lease secrets stay server-side., Gom tất cả các WebSocket router (chat, notifications, ...) được mount tại gốc…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles(), datetime (+74 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 78 - "chat_service.py"
Cohesion: 0.09
Nodes (41): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+33 more)

### Community 79 - "project_service.py"
Cohesion: 0.16
Nodes (23): ProjectMethodology, ProjectStatus, str, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectCreate (+15 more)

### Community 80 - "Settings"
Cohesion: 0.14
Nodes (18): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), parametrize (+10 more)

### Community 81 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 82 - "test_security_state.py"
Cohesion: 0.07
Nodes (60): alembic_migration, alembic_operations, clear(), Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu., issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối… (+52 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.12
Nodes (31): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+23 more)

### Community 85 - "main.py"
Cohesion: 0.04
Nodes (59): configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:…, Cau hinh logging goc. `json_output` tat o development, noi mot dong doc duoc…, RequestIdFilter, set_request_id() (+51 more)

### Community 86 - "documents.py"
Cohesion: 0.14
Nodes (14): create_documents(), delete_documents(), get_documents(), list_documents(), delete, get, post, put (+6 more)

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.14
Nodes (14): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), delete, get, post, put (+6 more)

### Community 88 - "leaves.py"
Cohesion: 0.14
Nodes (14): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, post, put (+6 more)

### Community 89 - "project_versions.py"
Cohesion: 0.14
Nodes (14): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions(), delete, get, post, put (+6 more)

### Community 90 - "reports.py"
Cohesion: 0.14
Nodes (14): create_reports(), delete_reports(), get_reports(), list_reports(), delete, get, post, put (+6 more)

### Community 91 - "security_state_service.py"
Cohesion: 0.25
Nodes (24): SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment(), _increment() (+16 more)

### Community 92 - "system.py"
Cohesion: 0.14
Nodes (14): create_system(), delete_system(), get_system(), list_system(), delete, get, post, put (+6 more)

### Community 93 - "OAuthService"
Cohesion: 0.18
Nodes (9): Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, OAuthService, OAuthState, Any, AsyncSession, User, Phân giải identity của provider thành một User. `email_provider_verified` là… (+1 more)

### Community 94 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 95 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 96 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.12
Nodes (15): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001) (+7 more)

### Community 97 - "skills.py"
Cohesion: 0.14
Nodes (14): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, post, put (+6 more)

### Community 98 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "_compute_signals"
Cohesion: 0.22
Nodes (10): _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days(), Any, AsyncSession, date, Đếm số cặp (người dùng, ngày) quá tải trong `WORKLOAD_LOOKAHEAD_DAYS` ngày tới.… (+2 more)

### Community 101 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 102 - "schedule_jobs"
Cohesion: 0.40
Nodes (5): AsyncSession, Depends, Header, post, schedule_jobs()

### Community 103 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 104 - "WBSServiceDep"
Cohesion: 0.23
Nodes (13): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+5 more)

### Community 105 - "test_cpm_scheduling.py"
Cohesion: 0.06
Nodes (57): field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate., model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, model_validator, model_validator, run_cpm() (+49 more)

### Community 106 - "pytest"
Cohesion: 0.07
Nodes (37): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, AsyncSession, task, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.… (+29 more)

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - ".start_flow"
Cohesion: 0.33
Nodes (5): code_challenge_for(), new_code_verifier(), Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved., Challenge S256 tương ứng với `verifier`., Bắt đầu một luồng OAuth. Trả về `(state, browser_secret, code_challenge)`.…

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "conftest.py"
Cohesion: 0.24
Nodes (11): _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture, Role, Fixture dùng chung cho toàn bộ bộ test. Trước file này, `tests/integration/`…, Tắt rate limit theo TỪNG test, rồi khôi phục. `test_auth_password_recovery.py`… (+3 more)

### Community 111 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 115 - "Redis Free và trạng thái bảo mật"
Cohesion: 0.40
Nodes (4): Chuyển mode và nghiệm thu, Hiện trạng và đường tấn công, Interface phối hợp, Redis Free và trạng thái bảo mật

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 117 - "LanguageToggle.tsx"
Cohesion: 0.33
Nodes (8): LanguageToggle(), setLocale(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 119 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 121 - "get_me"
Cohesion: 0.50
Nodes (4): get_me(), CurrentUser, get, Lấy thông tin hồ sơ của người dùng hiện đang đăng nhập.

### Community 122 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 123 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.25
Nodes (7): Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 126 - "test_route_trailing_slash.py"
Cohesion: 0.53
Nodes (5): _paths_for(), parametrize, Các endpoint danh sách phải nhận cả dạng có và không có dấu '/' cuối. Next.js…, test_create_endpoint_accepts_both_slash_forms(), test_list_endpoint_accepts_both_slash_forms()

### Community 128 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 129 - "list_permissions"
Cohesion: 0.40
Nodes (5): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…

### Community 137 - "get_ai_service"
Cohesion: 0.50
Nodes (3): get_ai_service(), AsyncSession, Depends

### Community 138 - "report_tasks.py"
Cohesion: 0.29
Nodes (7): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 146 - "Durable jobs verification"
Cohesion: 0.40
Nodes (4): Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 149 - "validate_password_policy"
Cohesion: 0.40
Nodes (3): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator

### Community 150 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 153 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-10-02)

### Community 156 - "resource-recommendation.service.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 158 - "schedule-optimization.types.ts"
Cohesion: 0.28
Nodes (7): scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult, ScheduleSuggestion

### Community 161 - "durable_jobs.py"
Cohesion: 0.15
Nodes (26): AIOutput, AIRequest, AIRequestStatus, AIRequestType, str, ImpactReport, RiskReport, authorize_request() (+18 more)

### Community 163 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 166 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.13
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 170 - "README.md"
Cohesion: 0.20
Nodes (7): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume, Công việc: Render Free + Supabase Free

### Community 172 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 184 - "Backend local verification — 2026-10-09"
Cohesion: 0.40
Nodes (4): Backend local verification — 2026-10-09, Contracts exercised, Database and Supabase SQL checks, Remaining deployment evidence

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.40
Nodes (4): Kiểm thử, Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

### Community 186 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Môi trường phía giao diện (`frontend/.env.local`), Môi trường phía máy chủ (`backend/.env`)

### Community 187 - "Email and private storage adapters"
Cohesion: 0.33
Nodes (5): Email and private storage adapters, Email setup, Existing file flow and scope, Local verification, Supabase Storage setup

## Knowledge Gaps
- **397 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+392 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1266 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `list_permissions`, `db/base.py`, `PortfolioService`, `StorageService`, `create_refresh_token`, `UserRepository`, `users.py`, `ai_tasks.py`, `auth_service.py`, `wbs_service.py`, `durable_jobs.py`, `as_user`, `UserService`, `task_service.py`, `ProjectRepository`, `Role`, `test_oauth_account_takeover.py`, `list_projects`, `DashboardService`, `timedelta`, `endpoints/auth.py`, `Task`, `ProjectService`, `list_portfolios`, `endpoints/ai.py`, `sqlalchemy`, `chat_service.py`, `project_service.py`, `test_security_state.py`, `test_change_request_service.py`, `OAuthService`, `conftest.py`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `Task` connect `Task` to `test_schedule_optimizer.py`, `durable_jobs.py`, `db/base.py`, `User`, `_compute_signals`, `as_user`, `task_service.py`, `StorageService`, `ProjectRepository`, `sqlalchemy`, `run_risk_analysis`, `test_cpm_scheduling.py`, `pytest`, `run_impact_analysis`, `DashboardService`, `test_resource_recommender.py`, `timedelta`, `wbs_service.py`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `AuthService` connect `auth_service.py` to `User`, `UserService`, `task_service.py`, `test_auth_password_recovery.py`, `sqlalchemy`, `create_refresh_token`, `UserRepository`, `test_security_state.py`, `test_user_profile_settings.py`, `test_login_lockout.py`, `timedelta`, `endpoints/auth.py`, `OAuthService`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 56 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 56 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _397 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Input.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05683563748079877 - nodes in this community are weakly interconnected._
# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-12)

## Corpus Check
- 482 files · ~271,905 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3891 nodes · 12309 edges · 198 communities (158 shown, 18 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1128 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `07fe9167`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.py
- Button
- db/base.py
- endpoints/auth.py
- lucide-react
- (dashboard)/layout.tsx
- portfolio_service.py
- users/page.tsx
- email.py
- ConflictException
- test_auth_cookies.py
- ForbiddenException
- cn
- AIService
- AuthService
- AITaskType
- getApiErrorMessage
- useTasks.ts
- test_ws_hardening.py
- users.py
- test_cloud_adapters.py
- PortfolioRepository
- notifications/page.tsx
- unittest_mock
- run_risk_analysis
- ConnectionManager
- get_critical_path
- compilerOptions
- test_auth_password_recovery.py
- useChangeRequests.ts
- wbs_service.py
- profile/page.tsx
- WBSService
- ThemeProvider.tsx
- test_authz_matrix.py
- package.json
- TaskServiceDep
- user_service.py
- update_subtask
- Job
- ErrorState
- ProjectRepository
- oauth.py
- AdminUserService
- portfolios/[id]/page.tsx
- api.ts
- list_roles
- asyncio
- list_projects
- test_impact_analyzer.py
- @tanstack/react-query
- dashboard.py
- TaskStatus
- test_user_profile_settings.py
- dependencies
- DashboardService
- JobRunner
- change_requests.py
- scheduling_service.py
- ProjectCreate
- StorageService
- Thiết kế kiến trúc hệ thống
- test_durable_jobs_postgres.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- test_deleted_supabase_avatar_maps_to_404
- RoleService
- useAuthStore
- post
- BurndownChart.tsx
- NotificationService
- Task
- admin.py
- NotificationType
- endpoints/ai.py
- typing
- test_resource_warnings.py
- project_service.py
- AGENTS.md
- ChatService
- ProjectService
- Settings
- Chi tiết các Giai đoạn
- test_security_state.py
- approvals.py
- get_project_context
- rate_limit.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- security_state_service.py
- system.py
- oauth_service.py
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- my_assignments
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- skills.py
- list_notifications
- next.config.js
- risk_analyzer.py
- test_auth_email_verification.py
- config.py
- Chi tiết các Giai đoạn đã hoàn thành
- list_audit_logs
- test_cpm_scheduling.py
- AuditLog
- middleware.ts
- job_runner.py
- Rà soát code và nâng cấp giao diện — 2026-09-15
- fixture
- sprints.py
- playwright
- 20260813_portfolio_project_core.py
- test_oauth_account_takeover.py
- audit/page.tsx
- Kế hoạch: Render Free + Supabase Free
- ref_next_headers
- vitest
- create_dependency
- .__init__
- WBSServiceDep
- AuditService
- test_project_scoping.py
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- pytest
- next-env.d.ts
- JobsPanel.tsx
- list_jobs
- date_utils.py
- celery_app.py
- sweep_task_dates
- ai_tasks.py
- Durable jobs verification
- 11. Cài đặt và Chạy hệ thống
- test_route_exposure.py
- 3. Ngăn xếp công nghệ
- test_dashboard_metrics.py
- User
- Rà soát 2026-09-06
- test_portfolio_project_core.py
- resource-recommendation.service.ts
- test_token_revocation.py
- schedule-optimization.types.ts
- dashboards.py
- alembic
- durable_jobs.py
- ref_date_fns_locale
- resource_leveling
- ref_hookform_resolvers_zod
- ref_next_dynamic
- Đặc tả yêu cầu phần mềm (SRS)
- ref_next_image
- ref_next_intl_server
- ref_next_link
- README.md
- ref_next_navigation
- Rà soát cuối: Render Free + Supabase Free
- ref_next_server
- ref_testing_library_jest_dom_vitest
- ref_vitest_config
- .push
- security.py
- list_permissions
- Chi tiết các Giai đoạn đã hoàn thành
- validate_password_policy
- model_validator
- Chi tiết kế hoạch triển khai
- Backend local verification — 2026-10-09
- Tiến độ — tasks/plan.md
- schemas/gantt.py
- test_recent_activity_filters_by_visible_projects
- asyncio
- 10. Đặc tả API và các điểm cuối WebSocket
- 1. Tổng quan dự án

## God Nodes (most connected - your core abstractions)
1. `User` - 231 edges
2. `Button` - 95 edges
3. `ForbiddenException` - 84 edges
4. `Task` - 78 edges
5. `Base` - 75 edges
6. `WBSService` - 75 edges
7. `TaskService` - 73 edges
8. `NotFoundException` - 70 edges
9. `Project` - 68 edges
10. `BadRequestException` - 66 edges

## Surprising Connections (you probably didn't know these)
- `GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine` --references--> `TaskService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/task_service.py
- `GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)` --references--> `Leave`  [INFERRED]
  docs/roadmap/PHASE_3_AI_FEATURES_MODULE.md → backend/app/models/leave.py
- `Chuyển mode và nghiệm thu` --references--> `AuthService`  [INFERRED]
  docs/security-state-audit.md → backend/app/services/auth_service.py
- `GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003)` --references--> `WBSService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/wbs_service.py
- `Implemented contract` --references--> `JobRunner`  [INFERRED]
  docs/job-core-verification.md → backend/app/core/job_runner.py

## Import Cycles
- None detected.

## Communities (198 total, 18 thin omitted)

### Community 0 - "main.py"
Cohesion: 0.06
Nodes (42): configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:…, Cau hinh logging goc. `json_output` tat o development, noi mot dong doc duoc…, RequestIdFilter, set_request_id() (+34 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (76): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, OAuthCallbackContent() (+68 more)

### Community 2 - "db/base.py"
Cohesion: 0.09
Nodes (35): Approval, ApprovalStatus, str, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, ChatReadState (+27 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.10
Nodes (44): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+36 more)

### Community 4 - "lucide-react"
Cohesion: 0.06
Nodes (57): Danh mục tính năng đã triển khai, DashboardPage(), ProjectLayout(), ProjectOverviewCharts, ProjectOverviewPage(), Stat(), ChangeRequestDetail(), isImpactReport() (+49 more)

### Community 5 - "(dashboard)/layout.tsx"
Cohesion: 0.16
Nodes (17): AuthLayout(), DashboardLayout(), Brand(), LanguageToggle(), LINKS, MainNav(), MobileNav(), NotificationBell() (+9 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.09
Nodes (33): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+25 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.11
Nodes (35): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+27 more)

### Community 8 - "email.py"
Cohesion: 0.09
Nodes (27): EmailDeliveryError, _mail_config(), RuntimeError, Safe to persist in job failures; excludes provider response bodies., _send(), send_email_verification_email(), send_password_reset_email(), task (+19 more)

### Community 9 - "ConflictException"
Cohesion: 0.16
Nodes (8): ConflictException, AsyncSession, date, Cac assignment cua nguoi dung hien tai, moi nhat truoc. Co gioi han: danh sach…, Worklog cua mot task, moi nhat truoc. Co gioi han: mot task chay dai tich luy…, Worklog ma nguoi goi duoc phep sua. Chu so huu, PM cua du an, hoac Admin. Truoc…, ResourceService, recalculate_task_hours()

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 11 - "ForbiddenException"
Cohesion: 0.09
Nodes (27): _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, BadRequestException, ForbiddenException, NotFoundException, DependencyType, str, str (+19 more)

### Community 12 - "cn"
Cohesion: 0.10
Nodes (30): AdminLayout(), TABS, AdminIndexPage(), MiniProgressBar(), MiniProgressBarProps, FullPageSpinner(), Spinner(), JobConnectionNotice() (+22 more)

### Community 13 - "AIService"
Cohesion: 0.18
Nodes (16): AIJobResponse, AIService, AsyncSession, ai_request(), authorized_project_context(), db(), asyncio, fixture (+8 more)

### Community 14 - "AuthService"
Cohesion: 0.07
Nodes (41): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+33 more)

### Community 15 - "AITaskType"
Cohesion: 0.09
Nodes (27): ABC, AmbiguousJobError, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., AITaskType, model_routing_table(), str (+19 more)

### Community 16 - "getApiErrorMessage"
Cohesion: 0.06
Nodes (77): DashboardLoading(), ProjectMembersPage(), ProjectSettingsPage(), Field(), KanbanColumn(), Select(), SprintView(), STATUSES (+69 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.10
Nodes (36): taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, wbsKeys, taskService, wbsService, UserSummary (+28 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.08
Nodes (35): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized(), enforce_connection_validity() (+27 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (35): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+27 more)

### Community 20 - "test_cloud_adapters.py"
Cohesion: 0.15
Nodes (23): client(), AsyncClient, HTTP client chưa xác thực, chạy trên app thật qua ASGI., email_settings(), asyncio, parametrize, storage_settings(), test_email_idempotency_conflict_is_classified() (+15 more)

### Community 21 - "PortfolioRepository"
Cohesion: 0.12
Nodes (8): BaseRepository, Any, AsyncSession, PortfolioRepository, AsyncSession, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., ModelType

### Community 22 - "notifications/page.tsx"
Cohesion: 0.31
Nodes (12): NotificationsPage(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, useDeleteNotification(), useMarkAllRead() (+4 more)

### Community 23 - "unittest_mock"
Cohesion: 0.12
Nodes (16): FakeRedis, asyncio, Khoá tài khoản khi có quá nhiều lần đăng nhập sai. Rate limit của slowapi khoá…, Nếu chỉ đếm khi tài khoản tồn tại, chênh lệch thời gian phản hồi tự nó trở…, Vừa đủ Redis cho login_throttle, có TTL đơn giản hoá., Cache gián đoạn không được biến thành sự cố khoá toàn bộ người dùng., Trong lúc bị khoá, mỗi lần thử vẫn tốn một lần bcrypt sẽ biến cơ chế bảo vệ…, test_a_wrong_password_is_counted_against_the_account() (+8 more)

### Community 24 - "run_risk_analysis"
Cohesion: 0.07
Nodes (57): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+49 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.18
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 26 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "test_auth_password_recovery.py"
Cohesion: 0.23
Nodes (18): ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request, ASGI scope tối thiểu — decorator rate-limit trên endpoint cần một Request thật… (+10 more)

### Community 29 - "useChangeRequests.ts"
Cohesion: 0.12
Nodes (17): changeRequestKeys, permissionService, api, ChangeRequestCreateInput, changeRequestService, RiskAnalysisJobResponse, RiskAnalysisJobStatus, RiskAnalysisResultResponse (+9 more)

### Community 30 - "wbs_service.py"
Cohesion: 0.07
Nodes (54): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+46 more)

### Community 31 - "profile/page.tsx"
Cohesion: 0.11
Nodes (31): VerificationState, VerifyEmailContent(), verify(), VerifyEmailPage(), ProfilePage(), ProfilePageContent(), EmailVerificationBannerProps, AvatarSection() (+23 more)

### Community 32 - "WBSService"
Cohesion: 0.15
Nodes (10): add_audit(), json_value(), Any, AsyncSession, require_project_roles(), serialize_model(), AsyncSession, WBSService (+2 more)

### Community 33 - "ThemeProvider.tsx"
Cohesion: 0.15
Nodes (20): frontend_src_app_globals, metadata, RootLayout(), viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark() (+12 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (17): project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai., Customer nhin thay du an nhung khong thay phan ra cong viec ben trong., Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin. (+9 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (34): description, name, overrides, postcss, private, scripts, build, dev (+26 more)

### Community 36 - "TaskServiceDep"
Cohesion: 0.14
Nodes (21): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+13 more)

### Community 37 - "user_service.py"
Cohesion: 0.13
Nodes (18): ServiceUnavailableException, UnauthorizedException, hash_password(), ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, BaseModel, field_validator (+10 more)

### Community 38 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

### Community 39 - "Job"
Cohesion: 0.16
Nodes (24): JobResult, Job, run_daily_batch(), apply(), AsyncSession, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), enqueue() (+16 more)

### Community 40 - "ErrorState"
Cohesion: 0.17
Nodes (20): AIInsightsPage(), ChangeRequestsPage(), Metric(), TimesheetPage(), Avatar(), AvatarProps, EmptyState(), ErrorState() (+12 more)

### Community 41 - "ProjectRepository"
Cohesion: 0.14
Nodes (6): ProjectMethodology, ProjectStatus, str, ProjectRepository, AsyncSession, date

### Community 42 - "oauth.py"
Cohesion: 0.24
Nodes (15): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get, limit, OAuthServiceDep (+7 more)

### Community 43 - "AdminUserService"
Cohesion: 0.27
Nodes (24): AdminUserUpdate, AdminUserService, AsyncSession, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user(), asyncio, Một chủ thể có "user:update" PATCH tài khoản của chính mình thành… (+16 more)

### Community 44 - "portfolios/[id]/page.tsx"
Cohesion: 0.13
Nodes (29): Metric(), PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps (+21 more)

### Community 45 - "api.ts"
Cohesion: 0.14
Nodes (16): SocialLoginButtonsProps, NOTIFICATION_KEYS, notificationService, MarkReadResponse, NotificationListResponse, UnreadCountResponse, API_BASE_URL, bootstrapSession() (+8 more)

### Community 46 - "list_roles"
Cohesion: 0.17
Nodes (15): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+7 more)

### Community 47 - "asyncio"
Cohesion: 0.11
Nodes (19): asyncio, do_run_migrations(), run_async_migrations(), run_migrations_online(), main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), _pending_key() (+11 more)

### Community 48 - "list_projects"
Cohesion: 0.15
Nodes (23): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+15 more)

### Community 49 - "test_impact_analyzer.py"
Cohesion: 0.38
Nodes (13): change_request(), FakeScalars, make_db(), patched_ai(), project(), asyncio, SOP-AI-002: run_impact_analysis phải kẹp/loại bỏ output AI không hợp lệ trước…, task() (+5 more)

### Community 50 - "@tanstack/react-query"
Cohesion: 0.16
Nodes (23): aiJobKeys, useAIJob(), useImpactAnalysisJob(), isAccessError(), isTerminalJob(), jobPollingInterval(), pageActive(), PollState (+15 more)

### Community 51 - "dashboard.py"
Cohesion: 0.20
Nodes (15): BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, ProjectDashboardStats, ProjectStats, BaseModel, Dữ liệu phản hồi cho GET /dashboards/projects/{project_id}/stats (+7 more)

### Community 52 - "TaskStatus"
Cohesion: 0.18
Nodes (20): str, TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, test_status_graph_supports_normal_block_and_reopen_flows(), parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'. (+12 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.21
Nodes (20): verify_password(), avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data() (+12 more)

### Community 54 - "dependencies"
Cohesion: 0.05
Nodes (40): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+32 more)

### Community 55 - "DashboardService"
Cohesion: 0.18
Nodes (11): ActiveProjectSummary, PortfolioHealthResponse, PortfolioProjectHealth, Thẻ dự án gọn nhẹ cho lưới dashboard trang chủ., Dữ liệu phản hồi cho GET /dashboards/portfolios/{portfolio_id}/health, DashboardService, _iso_week_bounds(), AsyncSession (+3 more)

### Community 56 - "JobRunner"
Cohesion: 0.09
Nodes (17): async_sessionmaker, JobContext, JobRunner, AsyncSession, Recover and claim only free execution slots; useful for deterministic tests., Save provider response before generating business rows; safe to resume., test_staged_provider_response_resumes_after_restart(), asyncio (+9 more)

### Community 57 - "change_requests.py"
Cohesion: 0.39
Nodes (8): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, submit_change_request(), ChangeRequestServiceDep

### Community 58 - "scheduling_service.py"
Cohesion: 0.10
Nodes (29): Dependency, Phase, Worklog, CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service() (+21 more)

### Community 59 - "ProjectCreate"
Cohesion: 0.16
Nodes (9): ProjectCreate, ProjectUpdate, field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, DependencyCreate, _persist_plan(), _persist_plan() (+1 more)

### Community 60 - "StorageService"
Cohesion: 0.13
Nodes (19): get_storage_service(), AsyncClient, Response, RuntimeError, Create a missing private bucket, or reject an existing public bucket., Sanitized storage failure suitable for application logs., Call only after authorization. URLs are bearer capabilities until expiry., Private Supabase REST storage, with the existing local MinIO adapter. (+11 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.15
Nodes (13): Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ, Lược đồ cơ sở dữ liệu (SQLAlchemy — 8 Domains, 34 Tables) (+5 more)

### Community 62 - "test_durable_jobs_postgres.py"
Cohesion: 0.12
Nodes (28): alembic_migration, alembic_operations, ApplyResult, Persist dispatch intent before sending; optional quota reservation is atomic., aware(), JobService, LeaseLostError, AsyncSession (+20 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.09
Nodes (23): 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+15 more)

### Community 64 - "test_deleted_supabase_avatar_maps_to_404"
Cohesion: 0.38
Nodes (6): provider(), asyncio, test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), handle()

### Community 65 - "RoleService"
Cohesion: 0.25
Nodes (15): RoleCreate, RoleUpdate, AsyncSession, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db(), build_role() (+7 more)

### Community 66 - "useAuthStore"
Cohesion: 0.14
Nodes (23): GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), ProjectChatPage(), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys (+15 more)

### Community 67 - "post"
Cohesion: 0.16
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "BurndownChart.tsx"
Cohesion: 0.16
Nodes (10): Danh mục tính năng triển khai theo Phase, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, BurndownPoint (+2 more)

### Community 69 - "NotificationService"
Cohesion: 0.20
Nodes (11): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, MarkReadResponse, NotificationListResponse, NotificationResponse, BaseModel, UnreadCountResponse, get_notification_service(), NotificationService (+3 more)

### Community 70 - "Task"
Cohesion: 0.07
Nodes (34): ChangeRequest, str, RiskLevel, Portfolio, Project, Task, datetime, AsyncSession (+26 more)

### Community 71 - "admin.py"
Cohesion: 0.15
Nodes (10): AdminUserCreate, AdminUserResponse, AuditActorSummary, PermissionResponse, BaseModel, field_validator, Schema cho trang Admin: quản lý người dùng, quản lý role/permission, audit log., Chỉ đủ để đổ vào một bộ chọn vai trò dự án. Cố tình bỏ `permissions`:… (+2 more)

### Community 72 - "NotificationType"
Cohesion: 0.28
Nodes (15): NotificationType, str, TaskStatusUpdate, TaskUpdate, ProjectContext, asyncio, test_change_status_notifies_team_on_transition(), test_change_status_skips_notification_when_status_unchanged() (+7 more)

### Community 73 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (26): AIServiceDep, generate_project(), get_ai_job(), list_ai_jobs(), CurrentUser, CurrentVerifiedUser, Depends, get (+18 more)

### Community 74 - "typing"
Cohesion: 0.08
Nodes (48): JobResponse, BaseModel, Job metadata only: payloads, delivery links and lease secrets stay server-side., visible_jobs(), get_db(), AsyncSession, FastAPI dependency: trả về (yield) một async DB session., Các bảng liên kết cho quan hệ nhiều-nhiều. (+40 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "project_service.py"
Cohesion: 0.34
Nodes (14): AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberResponse, ProjectMemberRoleUpdate (+6 more)

### Community 78 - "ChatService"
Cohesion: 0.09
Nodes (35): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+27 more)

### Community 79 - "ProjectService"
Cohesion: 0.18
Nodes (6): get_project_service(), ProjectService, AsyncSession, date, Depends, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…

### Community 80 - "Settings"
Cohesion: 0.18
Nodes (16): Settings, parametrize, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì. (+8 more)

### Community 81 - "Chi tiết các Giai đoạn"
Cohesion: 0.20
Nodes (9): 5 Trụ cột chính:, Chi tiết các Giai đoạn, GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness, Hiện trạng & Hạ tầng sẵn có, Lộ trình: Mô-đun AI tài liệu và hoàn thiện (Phase 5) (+1 more)

### Community 82 - "test_security_state.py"
Cohesion: 0.06
Nodes (70): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+62 more)

### Community 83 - "approvals.py"
Cohesion: 0.15
Nodes (13): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, put, # TODO: Cài đặt hàm lấy theo id (+5 more)

### Community 84 - "get_project_context"
Cohesion: 0.14
Nodes (24): CRStatus, str, ChangeRequestCreate, ChangeRequestResponse, BaseModel, model_validator, ChangeRequestService, get_change_request_service() (+16 more)

### Community 85 - "rate_limit.py"
Cohesion: 0.07
Nodes (29): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố…, Use a stable IP; unverified Bearer strings must not create new budgets. (+21 more)

### Community 86 - "documents.py"
Cohesion: 0.15
Nodes (13): create_documents(), delete_documents(), get_documents(), list_documents(), delete, get, put, # TODO: Cài đặt hàm lấy theo id (+5 more)

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.15
Nodes (13): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), delete, get, put, # TODO: Cài đặt hàm lấy theo id (+5 more)

### Community 88 - "leaves.py"
Cohesion: 0.15
Nodes (13): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, put, # TODO: Cài đặt hàm lấy theo id (+5 more)

### Community 89 - "project_versions.py"
Cohesion: 0.15
Nodes (13): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions(), delete, get, put, # TODO: Cài đặt hàm get theo id (+5 more)

### Community 90 - "reports.py"
Cohesion: 0.15
Nodes (13): create_reports(), delete_reports(), get_reports(), list_reports(), delete, get, put, # TODO: Cài đặt hàm get theo id (+5 more)

### Community 91 - "security_state_service.py"
Cohesion: 0.25
Nodes (24): SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment(), _increment() (+16 more)

### Community 92 - "system.py"
Cohesion: 0.15
Nodes (13): create_system(), delete_system(), get_system(), list_system(), delete, get, put, # TODO: Cài đặt hàm get theo id (+5 more)

### Community 93 - "oauth_service.py"
Cohesion: 0.12
Nodes (16): code_challenge_for(), new_code_verifier(), Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved., Challenge S256 tương ứng với `verifier`., Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, get_oauth_service(), OAuthService (+8 more)

### Community 94 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 95 - "my_assignments"
Cohesion: 0.20
Nodes (11): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+3 more)

### Community 96 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.12
Nodes (15): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001) (+7 more)

### Community 97 - "skills.py"
Cohesion: 0.15
Nodes (13): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, put, # TODO: Cài đặt hàm get theo id (+5 more)

### Community 98 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 99 - "next.config.js"
Cohesion: 0.25
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "risk_analyzer.py"
Cohesion: 0.11
Nodes (26): Assignment, Leave, LeaveStatus, LeaveType, str, str, RiskLevel, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm… (+18 more)

### Community 101 - "test_auth_email_verification.py"
Cohesion: 0.24
Nodes (15): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_keeps_hash_but_aborts_on_outbox_failure() (+7 more)

### Community 102 - "config.py"
Cohesion: 0.19
Nodes (11): AsyncSession, Depends, Header, schedule_jobs(), enqueue_due_schedules(), Daily schedules use Vietnam dates; catch up only today's bounded window., asyncio, test_cron_auth_and_duplicate_requests() (+3 more)

### Community 103 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.13
Nodes (13): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 104 - "list_audit_logs"
Cohesion: 0.25
Nodes (8): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query

### Community 105 - "test_cpm_scheduling.py"
Cohesion: 0.06
Nodes (75): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong… (+67 more)

### Community 106 - "AuditLog"
Cohesion: 0.11
Nodes (23): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu. (+15 more)

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "job_runner.py"
Cohesion: 0.14
Nodes (20): JobError, PermanentJobError, Exception, Bounded durable job execution, with short transactions around external work., RetryableJobError, Durable checkpoint around exactly one provider call per AI job., reserve_ai_call(), Handlers for supported durable work. No Celery worker is required. (+12 more)

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "fixture"
Cohesion: 0.18
Nodes (13): as_user(), factory(), override_db(), _disable_rate_limiting(), event_loop(), make_user(), factory(), AsyncSession (+5 more)

### Community 111 - "sprints.py"
Cohesion: 0.24
Nodes (15): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+7 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "test_oauth_account_takeover.py"
Cohesion: 0.18
Nodes (9): asyncio, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified(), test_unverified_provider_email_cannot_take_over_a_local_account() (+1 more)

### Community 115 - "audit/page.tsx"
Cohesion: 0.24
Nodes (11): AdminAuditPage(), AuditLogFilters(), ACTION_CLASSES, actionBadgeClass(), AuditLogTable(), formatTimestamp(), auditLogKeys, useAuditLogs() (+3 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 118 - "vitest"
Cohesion: 0.12
Nodes (12): frontend_messages_en, mocks, Form(), mocks, FakeSocket, flush(), ref_node_url, @testing-library/jest-dom (+4 more)

### Community 119 - "create_dependency"
Cohesion: 0.29
Nodes (8): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, TaskServiceDep

### Community 121 - "WBSServiceDep"
Cohesion: 0.21
Nodes (15): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+7 more)

### Community 122 - "AuditService"
Cohesion: 0.12
Nodes (18): AuditLogResponse, AuditService, AsyncSession, datetime, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm., build_db(), asyncio, test_list_maps_rows_with_actor() (+10 more)

### Community 123 - "test_project_scoping.py"
Cohesion: 0.36
Nodes (8): asyncio, Tai nguyen cua du an nay khong duoc ro ri sang du an khac., test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown(), test_a_soft_deleted_project_reads_as_missing()

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.22
Nodes (8): unavailable(), Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 126 - "pytest"
Cohesion: 0.15
Nodes (15): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+7 more)

### Community 128 - "JobsPanel.tsx"
Cohesion: 0.11
Nodes (17): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification, AIJobOutput(), FAILURE_LABEL, featureLink() (+9 more)

### Community 129 - "list_jobs"
Cohesion: 0.32
Nodes (8): get_job(), list_jobs(), CurrentUser, ge, get, le, Query, DB

### Community 137 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 138 - "celery_app.py"
Cohesion: 0.20
Nodes (9): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx, celery (+1 more)

### Community 139 - "sweep_task_dates"
Cohesion: 0.20
Nodes (10): AsyncSession, task, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session(), asyncio (+2 more)

### Community 145 - "ai_tasks.py"
Cohesion: 0.10
Nodes (35): generate_project_task(), _generate_with_own_session(), impact_analysis_task(), _impact_analysis_with_own_session(), runner(), to_output_json(), optimize_schedule_task(), _optimize_schedule_with_own_session() (+27 more)

### Community 146 - "Durable jobs verification"
Cohesion: 0.40
Nodes (4): Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "test_route_exposure.py"
Cohesion: 0.17
Nodes (13): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+5 more)

### Community 150 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 151 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 153 - "User"
Cohesion: 0.11
Nodes (10): get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, User, AsyncSession, UserRepository (+2 more)

### Community 154 - "Rà soát 2026-09-06"
Cohesion: 0.14
Nodes (11): Burndown 14 ngày đơn giản: còn lại = tổng - số task đã hoàn thành cộng dồn., 7 Trụ cột chính:, Bảo mật, Còn nợ, Giao diện, Hiệu năng, Lỗi chặn đã sửa, Lộ trình: Portfolio & Project Core Module (Phase 2) (+3 more)

### Community 155 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 156 - "resource-recommendation.service.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 157 - "test_token_revocation.py"
Cohesion: 0.35
Nodes (12): build_db(), build_service(), build_user(), asyncio, Xoay vòng refresh token, phát hiện tái sử dụng, và thu hồi khi logout (Phase…, Hai bên cùng giữ một token nghĩa là nó đã bị lộ — hủy tất cả session, không chỉ…, Một access token gửi tới /logout không được coi là refresh token., test_logout_ignores_a_token_of_the_wrong_type() (+4 more)

### Community 158 - "schedule-optimization.types.ts"
Cohesion: 0.28
Nodes (7): scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult, ScheduleSuggestion

### Community 159 - "dashboards.py"
Cohesion: 0.29
Nodes (10): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số… (+2 more)

### Community 161 - "durable_jobs.py"
Cohesion: 0.11
Nodes (32): AIOutput, AIRequest, AIRequestStatus, AIRequestType, str, ImpactReport, RiskReport, ImpactReportResponse (+24 more)

### Community 163 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 166 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (13): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+5 more)

### Community 170 - "README.md"
Cohesion: 0.20
Nodes (7): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume, Công việc: Render Free + Supabase Free

### Community 172 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 176 - ".push"
Cohesion: 0.27
Nodes (7): Tạo, lưu và phát real-time một notification. Gọi flush ngay lập tức (cần thiết…, asyncio, push() không bọc publish() trong try/except của riêng nó — sự bảo đảm rằng một…, test_push_does_not_shield_callers_from_a_broadcast_exception(), test_push_persists_and_broadcasts_over_websocket(), fake_flush(), GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001)

### Community 177 - "security.py"
Cohesion: 0.25
Nodes (7): datetime, _utcnow(), io, jwt, passlib_context, pil, uuid

### Community 178 - "list_permissions"
Cohesion: 0.25
Nodes (8): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles(), role_checker()

### Community 179 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.29
Nodes (7): Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking, GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications

### Community 181 - "validate_password_policy"
Cohesion: 0.50
Nodes (3): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator

### Community 183 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.40
Nodes (5): Chi tiết kế hoạch triển khai, GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004), GIAI ĐOẠN 3.6 – AI Phân tích rủi ro (SOP-AI-005)

### Community 184 - "Backend local verification — 2026-10-09"
Cohesion: 0.40
Nodes (4): Backend local verification — 2026-10-09, Contracts exercised, Database and Supabase SQL checks, Remaining deployment evidence

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.40
Nodes (4): Kiểm thử, Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

### Community 186 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 187 - "test_recent_activity_filters_by_visible_projects"
Cohesion: 0.50
Nodes (4): _captured_where_text(), asyncio, test_recent_activity_filters_by_visible_projects(), test_recent_activity_returns_nothing_without_visible_projects()

### Community 195 - "asyncio"
Cohesion: 0.67
Nodes (3): asyncio, test_cascade_phase_delete_records_snapshot_and_recalculates(), test_stop_timer_calculates_hours_and_updates_task_total()

### Community 196 - "10. Đặc tả API và các điểm cuối WebSocket"
Cohesion: 0.67
Nodes (3): 10. Đặc tả API và các điểm cuối WebSocket, Danh mục REST API Routers (`/api/v1/...`), Danh mục WebSocket Endpoints (`/ws/...`)

### Community 197 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-10-02)

## Knowledge Gaps
- **353 isolated node(s):** `Mục lục`, `Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):`, `Trạng thái triển khai thực tế (cập nhật 2026-10-02)`, `Hạ tầng Real-time & WebSocket Architecture`, `Phía máy chủ (Python)` (+348 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1183 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `lucide-react` to `WBSService`, `Button`, `useAuthStore`, `NotificationService`, `portfolio_service.py`, `(dashboard)/layout.tsx`, `ErrorState`, `ConflictException`, `ForbiddenException`, `portfolios/[id]/page.tsx`, `ChatService`, `ProjectService`, `getApiErrorMessage`, `DashboardService`, `Rà soát 2026-09-06`?**
  _High betweenness centrality (0.209) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `db/base.py`, `portfolio_service.py`, `ConflictException`, `ForbiddenException`, `AIService`, `AuthService`, `ai_tasks.py`, `test_ws_hardening.py`, `users.py`, `wbs_service.py`, `WBSService`, `durable_jobs.py`, `user_service.py`, `Job`, `ProjectRepository`, `AdminUserService`, `asyncio`, `list_projects`, `list_permissions`, `dashboard.py`, `DashboardService`, `JobRunner`, `scheduling_service.py`, `RoleService`, `Task`, `endpoints/ai.py`, `typing`, `project_service.py`, `ChatService`, `ProjectService`, `test_security_state.py`, `get_project_context`, `oauth_service.py`, `risk_analyzer.py`, `test_auth_email_verification.py`, `config.py`, `list_audit_logs`, `job_runner.py`, `fixture`, `test_oauth_account_takeover.py`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `Button` to `RoleService`, `user_service.py`, `users/page.tsx`, `Chi tiết các Giai đoạn đã hoàn thành`, `AuthService`, `AuditService`, `oauth_service.py`, `profile/page.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 56 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 56 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Mục lục`, `Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):`, `Trạng thái triển khai thực tế (cập nhật 2026-10-02)` to the rest of the system?**
  _353 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06290471785383904 - nodes in this community are weakly interconnected._
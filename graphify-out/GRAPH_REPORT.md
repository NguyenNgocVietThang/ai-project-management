# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-09)

## Corpus Check
- 481 files · ~262,379 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3909 nodes · 11455 edges · 190 communities (147 shown, 24 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1013 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3dc9e1a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_schedule_optimizer.py
- Alert
- sqlalchemy
- endpoints/auth.py
- lucide-react
- Job
- portfolio_service.py
- users/page.tsx
- durable_handlers.py
- tasks/page.tsx
- test_auth_cookies.py
- Chi tiết các Giai đoạn đã hoàn thành
- Button.tsx
- AIService
- test_token_revocation.py
- NotificationService
- useProjects.ts
- useTasks.ts
- test_ws_hardening.py
- users.py
- wrap_user_input
- ai_tasks.py
- useNotifications.ts
- patch
- test_resource_recommender.py
- ConnectionManager
- get_critical_path
- compilerOptions
- AuthService
- api.ts
- wbs_service.py
- Button
- User
- ThemeProvider.tsx
- test_authz_matrix.py
- package.json
- TaskServiceDep
- UserService
- task_service.py
- test_auth_password_recovery.py
- getApiErrorMessage
- ProjectRepository
- oauth.py
- run_risk_analysis
- date_utils.py
- rate_limit.py
- security.py
- test_oauth_account_takeover.py
- ProjectServiceDep
- user_service.py
- react
- DashboardService
- test_route_exposure.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- JobRunner
- .__init__
- test_audit_regressions.py
- get_redis
- ProjectService
- Thiết kế kiến trúc hệ thống
- WBSServiceDep
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- test_dashboard_activity_scope.py
- ref_next_intl_server
- ChatPanel.tsx
- ResourceServiceDep
- dashboard.types.ts
- TaskStatus
- AdminUserService
- WBSServiceDep
- .__init__
- endpoints/ai.py
- typing
- test_resource_warnings.py
- AIRequest
- AGENTS.md
- ChatService
- projects.py
- Settings
- Chi tiết các Giai đoạn
- test_security_state.py
- approvals.py
- test_change_request_service.py
- db/base.py
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
- unittest_mock
- pytest
- @tanstack/react-query
- WBSServiceDep
- test_phase2_task_wbs.py
- create_epic
- middleware.ts
- list_projects
- Rà soát code và nâng cấp giao diện — 2026-09-15
- _user_from_token
- change_requests.py
- playwright
- 20260813_portfolio_project_core.py
- schemas/ai.py
- Redis Free và trạng thái bảo mật
- Kế hoạch: Render Free + Supabase Free
- LanguageToggle.tsx
- ref_vitest_config
- create_dependency
- model_validator
- schemas/gantt.py
- update_subtask
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- BaseAIProvider
- next-env.d.ts
- Frontend durable jobs verification
- list_jobs
- config.py
- report_tasks.py
- test_cloud_adapters.py
- types
- Durable jobs verification
- 11. Cài đặt và Chạy hệ thống
- ProjectCreate
- test_oauth_link_state_binds_provider_mode_user_and_browser
- 3. Ngăn xếp công nghệ
- get_dashboard_summary
- test_project_scoping.py
- 1. Tổng quan dự án
- get_dashboard_service
- resource-recommendation.service.ts
- require_permissions
- schedule-optimization.types.ts
- CurrentVerifiedUser
- test_impact_analyzer.py
- resource_leveling
- test_cpm_scheduling.py
- BaseModel
- Đặc tả yêu cầu phần mềm (SRS)
- StorageService
- delete
- limit
- README.md
- OAuthServiceDep
- Rà soát cuối: Render Free + Supabase Free
- patch
- ref_testing_library_jest_dom_vitest
- ref_date_fns_locale
- ref_hookform_resolvers_zod
- ref_next_dynamic
- ref_next_headers
- AsyncClient
- (dashboard)/layout.tsx
- ref_next_server
- Backend local verification — 2026-10-09
- Tiến độ — tasks/plan.md
- 12. Cấu hình & Biến môi trường
- Email and private storage adapters
- 20261008_durable_jobs.py

## God Nodes (most connected - your core abstractions)
1. `User` - 160 edges
2. `Button` - 91 edges
3. `ForbiddenException` - 76 edges
4. `WBSService` - 73 edges
5. `TaskService` - 71 edges
6. `Base` - 67 edges
7. `react` - 62 edges
8. `NotFoundException` - 60 edges
9. `getApiErrorMessage()` - 60 edges
10. `Alert()` - 59 edges

## Surprising Connections (you probably didn't know these)
- `GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002)` --references--> `ProjectService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/project_service.py
- `GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)` --references--> `Leave`  [INFERRED]
  docs/roadmap/PHASE_3_AI_FEATURES_MODULE.md → backend/app/models/leave.py
- `GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003)` --references--> `WBSService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/wbs_service.py
- `GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine` --references--> `TaskService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/task_service.py
- `GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001)` --references--> `PortfolioService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/portfolio_service.py

## Import Cycles
- None detected.

## Communities (190 total, 24 thin omitted)

### Community 0 - "test_schedule_optimizer.py"
Cohesion: 0.14
Nodes (29): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, SOP-AI-003: Đề xuất tối ưu lịch trình bằng AI (fast-track / crash / cân bằng… (+21 more)

### Community 1 - "Alert"
Cohesion: 0.07
Nodes (63): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, metadata (+55 more)

### Community 2 - "sqlalchemy"
Cohesion: 0.06
Nodes (46): Approval, ApprovalStatus, str, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, Comment, Document, DocumentType (+38 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.10
Nodes (49): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+41 more)

### Community 4 - "lucide-react"
Cohesion: 0.07
Nodes (45): Danh mục tính năng đã triển khai, DashboardPage(), DashboardError(), ProjectsPage(), GlobalError(), ChangeRequestDetail(), isImpactReport(), RISK_CLASSES (+37 more)

### Community 5 - "Job"
Cohesion: 0.13
Nodes (44): async_sessionmaker, JobResult, Job, Base, run_daily_batch(), aware(), enqueue(), JobService (+36 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.05
Nodes (41): delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends, ge (+33 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.09
Nodes (43): AdminRolesPage(), AdminUsersPage(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys, useAdminRoles() (+35 more)

### Community 8 - "durable_handlers.py"
Cohesion: 0.12
Nodes (26): Handlers for supported durable work. No Celery worker is required., run_email(), EmailDeliveryError, _mail_config(), RuntimeError, Safe to persist in job failures; excludes provider response bodies., _send(), send_email_verification_email() (+18 more)

### Community 9 - "tasks/page.tsx"
Cohesion: 0.15
Nodes (24): Field(), KanbanColumn(), Select(), SprintView(), STATUSES, TaskCard(), TaskCreateModal(), TasksPage() (+16 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.12
Nodes (16): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine (+8 more)

### Community 12 - "Button.tsx"
Cohesion: 0.09
Nodes (34): MiniProgressBar(), MiniProgressBarProps, Avatar(), AvatarProps, ButtonProps, VARIANT_CLASSES, Spinner(), LINKS (+26 more)

### Community 13 - "AIService"
Cohesion: 0.13
Nodes (26): AIJobResponse, AIRequestType, AIResultResponse, AIService, get_ai_service(), AsyncSession, Depends, User (+18 more)

### Community 14 - "test_token_revocation.py"
Cohesion: 0.16
Nodes (24): create_access_token(), create_refresh_token(), asyncio, Đăng xuất phải chấm dứt phiên ngay, không phải sau khi access token hết hạn.…, Client cũ không gửi header Authorization vẫn phải đăng xuất sạch phần làm được., Chỉ token đúng loại mới được xử lý — nếu không, nhầm loại sẽ bị bỏ qua âm thầm., test_a_refresh_token_passed_as_an_access_token_is_not_revoked_as_one(), test_a_token_that_was_never_revoked_still_works() (+16 more)

### Community 15 - "NotificationService"
Cohesion: 0.12
Nodes (20): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, publish_many(), Any, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, Notification, MarkReadResponse, NotificationListResponse, NotificationResponse (+12 more)

### Community 16 - "useProjects.ts"
Cohesion: 0.14
Nodes (24): ProjectMembersPage(), AIGeneratorModal(), STATUS_LABEL, useGenerateProject(), portfolioKeys, ProjectMembersTable(), useAddProjectMember(), useProjectMembers() (+16 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.10
Nodes (36): taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, wbsKeys, taskService, wbsService, UserSummary (+28 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.07
Nodes (43): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., authenticate_ws(), _close_unauthorized(), enforce_connection_validity() (+35 more)

### Community 19 - "users.py"
Cohesion: 0.10
Nodes (42): AdminUserCreate, AdminUserServiceDep, AdminUserUpdate, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user() (+34 more)

### Community 20 - "wrap_user_input"
Cohesion: 0.12
Nodes (26): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+18 more)

### Community 21 - "ai_tasks.py"
Cohesion: 0.08
Nodes (46): AIRequestStatus, AIRequestType, str, ImpactReportResponse, BaseModel, BaseModel, RiskReportResponse, AITaskType (+38 more)

### Community 22 - "useNotifications.ts"
Cohesion: 0.16
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 23 - "patch"
Cohesion: 0.10
Nodes (31): authorized_project_context(), fixture, build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified() (+23 more)

### Community 24 - "test_resource_recommender.py"
Cohesion: 0.16
Nodes (26): _candidate_payload(), _candidate_stats(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), Any, AsyncSession, Task (+18 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.18
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 26 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "AuthService"
Cohesion: 0.12
Nodes (14): AuthService, get_auth_service(), AsyncSession, datetime, Depends, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock. Trả về… (+6 more)

### Community 29 - "api.ts"
Cohesion: 0.09
Nodes (26): changeRequestKeys, aiService, api, bootstrapSession(), refreshAccessToken(), refreshClient, RetriableConfig, WS_BASE_URL (+18 more)

### Community 30 - "wbs_service.py"
Cohesion: 0.14
Nodes (26): str, SprintStatus, DateRangeMixin, EpicCreate, EpicResponse, EpicUpdate, MilestoneCreate, MilestoneResponse (+18 more)

### Community 31 - "Button"
Cohesion: 0.10
Nodes (43): Metric(), PortfolioDetailPage(), PortfoliosPage(), Badge(), DeletePhaseDialog(), Editor, Empty(), EntityEditor() (+35 more)

### Community 32 - "User"
Cohesion: 0.05
Nodes (50): get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, BadRequestException, ConflictException, ForbiddenException (+42 more)

### Community 33 - "ThemeProvider.tsx"
Cohesion: 0.15
Nodes (20): frontend_src_app_globals, metadata, RootLayout(), viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark() (+12 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (17): project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai., Customer nhin thay du an nhung khong thay phan ra cong viec ben trong., Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin. (+9 more)

### Community 35 - "package.json"
Cohesion: 0.05
Nodes (39): description, name, overrides, postcss, private, scripts, build, dev (+31 more)

### Community 36 - "TaskServiceDep"
Cohesion: 0.14
Nodes (21): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+13 more)

### Community 37 - "UserService"
Cohesion: 0.16
Nodes (12): ServiceUnavailableException, get_user_service(), AsyncSession, ChangePasswordRequest, DeleteAccountRequest, Depends, UploadFile, User (+4 more)

### Community 38 - "task_service.py"
Cohesion: 0.07
Nodes (44): Assignment, Dependency, DependencyType, str, str, SubtaskStatus, str, TaskPriority (+36 more)

### Community 39 - "test_auth_password_recovery.py"
Cohesion: 0.22
Nodes (16): build_request(), build_service(), extract_token(), asyncio, parametrize, Request, ASGI scope tối thiểu — decorator rate-limit trên endpoint cần một Request thật…, test_expired_token_uses_same_error_as_unknown_token() (+8 more)

### Community 40 - "getApiErrorMessage"
Cohesion: 0.10
Nodes (44): VerificationState, VerifyEmailContent(), verify(), VerifyEmailPage(), AdminAuditPage(), DashboardLoading(), AIInsightsPage(), ChangeRequestsPage() (+36 more)

### Community 41 - "ProjectRepository"
Cohesion: 0.13
Nodes (7): ProjectMethodology, ProjectStatus, str, ProjectRepository, AsyncSession, date, datetime

### Community 42 - "oauth.py"
Cohesion: 0.10
Nodes (29): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get, limit, OAuthServiceDep (+21 more)

### Community 43 - "run_risk_analysis"
Cohesion: 0.16
Nodes (26): str, RiskLevel, _as_list(), _clamp_score(), _level_from_score(), _normalize_level(), Any, Model đôi khi trả một chuỗi thay vì list (vd mitigation_suggestions là một đoạn… (+18 more)

### Community 44 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 45 - "rate_limit.py"
Cohesion: 0.12
Nodes (17): Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố…, Preserve Slowapi decorators, with an async durable path in database mode.…, _retry_after_seconds() (+9 more)

### Community 46 - "security.py"
Cohesion: 0.13
Nodes (15): datetime, Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., _utcnow(), validate_password_policy(), field_validator, DeleteAccountRequest, OAuthConnectResponse, BaseModel (+7 more)

### Community 47 - "test_oauth_account_takeover.py"
Cohesion: 0.20
Nodes (9): asyncio, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., _service_with_existing(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified(), test_new_account_from_unverified_email_is_not_marked_verified(), test_unverified_provider_email_cannot_take_over_a_local_account() (+1 more)

### Community 48 - "ProjectServiceDep"
Cohesion: 0.29
Nodes (11): add_project_member(), change_project_member_role(), delete_project(), CurrentVerifiedUser, delete, patch, put, Doi vai tro cua mot thanh vien du an ma khong lam mat lich su tham gia. (+3 more)

### Community 49 - "user_service.py"
Cohesion: 0.22
Nodes (11): get_storage_service(), asyncio, test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), base64, io, minio_error (+3 more)

### Community 50 - "react"
Cohesion: 0.07
Nodes (45): OAuthCallbackContent(), OAuthCallbackPage(), AdminLayout(), TABS, AdminIndexPage(), ProfilePage(), ProfilePageContent(), FullPageSpinner() (+37 more)

### Community 51 - "DashboardService"
Cohesion: 0.12
Nodes (28): Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth (+20 more)

### Community 52 - "test_route_exposure.py"
Cohesion: 0.15
Nodes (14): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+6 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.26
Nodes (19): hash_password(), verify_password(), ChangePasswordRequest, avatar_bytes(), build_db(), build_service(), build_user(), asyncio (+11 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "JobRunner"
Cohesion: 0.10
Nodes (19): ApplyResult, JobContext, JobRunner, AsyncSession, Recover and claim only free execution slots; useful for deterministic tests., Persist dispatch intent before sending; optional quota reservation is atomic., Save provider response before generating business rows; safe to resume., close_redis() (+11 more)

### Community 58 - "test_audit_regressions.py"
Cohesion: 0.20
Nodes (16): Cong don Project.actual_cost tu worklog x don gia gio cua tung nguoi.…, recalculate_project_cost(), project_work(), asyncio, fixture, Regression checks for populated Phase 2 flows found during the project audit., test_ai_broker_outage_still_enqueues_transactional_durable_job(), test_deleted_project_timer_can_be_recovered_when_starting_elsewhere() (+8 more)

### Community 59 - "get_redis"
Cohesion: 0.10
Nodes (34): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+26 more)

### Community 60 - "ProjectService"
Cohesion: 0.10
Nodes (33): AuditEventResponse, get_project_service(), ProjectService, AsyncSession, date, Depends, Project, User (+25 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "WBSServiceDep"
Cohesion: 0.23
Nodes (13): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+5 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.09
Nodes (23): 10. Đặc tả API và các điểm cuối WebSocket, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+15 more)

### Community 64 - "test_dashboard_activity_scope.py"
Cohesion: 0.18
Nodes (13): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới., test_audit_log_is_indexed_for_the_activity_feed() (+5 more)

### Community 66 - "ChatPanel.tsx"
Cohesion: 0.11
Nodes (23): GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), ProjectChatPage(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory() (+15 more)

### Community 67 - "ResourceServiceDep"
Cohesion: 0.16
Nodes (18): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+10 more)

### Community 68 - "dashboard.types.ts"
Cohesion: 0.06
Nodes (37): AuditService, get_audit_service(), AsyncSession, datetime, Depends, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm., build_db(), asyncio (+29 more)

### Community 69 - "TaskStatus"
Cohesion: 0.08
Nodes (50): NotificationType, str, Project, TaskStatus, TaskStatusUpdate, Cùng nội dung, nhiều người nhận — một lần INSERT, một lần publish. Gọi `push()`…, notify_project_team(), ProjectContext (+42 more)

### Community 70 - "AdminUserService"
Cohesion: 0.06
Nodes (75): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+67 more)

### Community 71 - "WBSServiceDep"
Cohesion: 0.21
Nodes (15): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+7 more)

### Community 73 - "endpoints/ai.py"
Cohesion: 0.13
Nodes (27): AIGenerateProjectRequest, AIImpactAnalysisRequest, AIResourceRecommendationRequest, AIRiskAnalysisRequest, AIScheduleOptimizeRequest, AIServiceDep, generate_project(), get_ai_job() (+19 more)

### Community 74 - "typing"
Cohesion: 0.05
Nodes (45): JobResponse, Job metadata only: payloads, delivery links and lease secrets stay server-side., list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, _is_still_a_member() (+37 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "AIRequest"
Cohesion: 0.18
Nodes (10): AIOutput, AIRequest, SOP-AI-005: quét định kỳ (Celery Beat) — enqueue risk_analysis cho từng project…, sweep_active_projects_for_risk(), Chi tiết kế hoạch triển khai, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003) (+2 more)

### Community 78 - "ChatService"
Cohesion: 0.07
Nodes (45): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+37 more)

### Community 79 - "projects.py"
Cohesion: 0.30
Nodes (13): AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberResponse, ProjectMemberRoleUpdate (+5 more)

### Community 80 - "Settings"
Cohesion: 0.10
Nodes (23): Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, test_configuration_errors_do_not_echo_credentials(), test_free_profile_accepts_complete_https_configuration(), test_free_profile_refuses_disabled_features_or_insecure_configuration(), parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong… (+15 more)

### Community 81 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 82 - "test_security_state.py"
Cohesion: 0.08
Nodes (41): alembic_migration, alembic_operations, client_key(), Use a stable IP; unverified Bearer strings must not create new budgets., decode_token(), Any, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết…, claim_revocation() (+33 more)

### Community 83 - "approvals.py"
Cohesion: 0.15
Nodes (13): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, put, # TODO: Cài đặt hàm lấy theo id (+5 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.19
Nodes (22): ChangeRequest, CRStatus, str, ChangeRequestCreate, BaseModel, model_validator, ChangeRequestService, get_change_request_service() (+14 more)

### Community 85 - "db/base.py"
Cohesion: 0.06
Nodes (38): asyncio, do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day… (+30 more)

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
Nodes (24): Base, SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment() (+16 more)

### Community 92 - "system.py"
Cohesion: 0.15
Nodes (13): create_system(), delete_system(), get_system(), list_system(), delete, get, put, # TODO: Cài đặt hàm get theo id (+5 more)

### Community 93 - "OAuthService"
Cohesion: 0.17
Nodes (10): Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, get_oauth_service(), OAuthService, OAuthState, Any, AsyncSession, Depends (+2 more)

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
Cohesion: 0.22
Nodes (6): apiOrigin, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "_compute_signals"
Cohesion: 0.22
Nodes (11): _compute_signals(), _count_overloaded_user_days(), generate_risk_analysis(), AsyncSession, date, Dependency, Project, Task (+3 more)

### Community 101 - "unittest_mock"
Cohesion: 0.20
Nodes (10): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+2 more)

### Community 102 - "pytest"
Cohesion: 0.10
Nodes (21): AsyncSession, Depends, Header, post, schedule_jobs(), Transactional outbox and durable leases for bounded application workers., catchup_loop(), enqueue_due_schedules() (+13 more)

### Community 103 - "@tanstack/react-query"
Cohesion: 0.12
Nodes (29): aiJobKeys, useAIJob(), useImpactAnalysisJob(), AIJobOutput(), FAILURE_LABEL, featureLink(), JobRow(), JobsPanelContent() (+21 more)

### Community 104 - "WBSServiceDep"
Cohesion: 0.24
Nodes (12): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+4 more)

### Community 105 - "test_phase2_task_wbs.py"
Cohesion: 0.08
Nodes (39): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., User, backward_pass(), build_graph() (+31 more)

### Community 106 - "create_epic"
Cohesion: 0.25
Nodes (11): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+3 more)

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "list_projects"
Cohesion: 0.33
Nodes (10): get_project(), get_project_activity(), list_project_members(), list_projects(), CurrentUser, date, ge, get (+2 more)

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "_user_from_token"
Cohesion: 0.27
Nodes (10): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+2 more)

### Community 111 - "change_requests.py"
Cohesion: 0.39
Nodes (8): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, submit_change_request(), ChangeRequestServiceDep

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "schemas/ai.py"
Cohesion: 0.39
Nodes (8): AIGenerateProjectRequest, AIImpactAnalysisRequest, AIJobResponse, AIResourceRecommendationRequest, AIResultResponse, AIRiskAnalysisRequest, AIScheduleOptimizeRequest, BaseModel

### Community 115 - "Redis Free và trạng thái bảo mật"
Cohesion: 0.40
Nodes (4): Chuyển mode và nghiệm thu, Hiện trạng và đường tấn công, Interface phối hợp, Redis Free và trạng thái bảo mật

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 117 - "LanguageToggle.tsx"
Cohesion: 0.40
Nodes (6): setLocale(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

### Community 119 - "create_dependency"
Cohesion: 0.29
Nodes (8): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, TaskServiceDep

### Community 122 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 123 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.25
Nodes (7): Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 126 - "BaseAIProvider"
Cohesion: 0.29
Nodes (5): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure

### Community 128 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 129 - "list_jobs"
Cohesion: 0.31
Nodes (9): get_job(), list_jobs(), CurrentUser, ge, get, le, Query, visible_jobs() (+1 more)

### Community 137 - "config.py"
Cohesion: 0.13
Nodes (24): AITaskType, AmbiguousJobError, JobError, PermanentJobError, Exception, Bounded durable job execution, with short transactions around external work., RetryableJobError, Server-only, expiring auth state; Redis loss cannot restore revoked credentials. (+16 more)

### Community 138 - "report_tasks.py"
Cohesion: 0.29
Nodes (7): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 139 - "test_cloud_adapters.py"
Cohesion: 0.20
Nodes (24): factory(), client(), override_db(), AsyncClient, HTTP client chưa xác thực, chạy trên app thật qua ASGI., email_settings(), asyncio, parametrize (+16 more)

### Community 145 - "types"
Cohesion: 0.20
Nodes (14): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+6 more)

### Community 146 - "Durable jobs verification"
Cohesion: 0.40
Nodes (4): Durable jobs verification, Evidence, Implemented contract, Operational limits

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "ProjectCreate"
Cohesion: 0.22
Nodes (5): ProjectCreate, ProjectUpdate, field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…

### Community 150 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 151 - "get_dashboard_summary"
Cohesion: 0.33
Nodes (9): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số…, Dữ liệu Dashboard dự án: - Phân bố trạng thái task (dữ liệu biểu đồ donut) -… (+1 more)

### Community 152 - "test_project_scoping.py"
Cohesion: 0.36
Nodes (8): asyncio, Tai nguyen cua du an nay khong duoc ro ri sang du an khac., test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown(), test_a_soft_deleted_project_reads_as_missing()

### Community 153 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-10-02)

### Community 154 - "get_dashboard_service"
Cohesion: 0.50
Nodes (3): get_dashboard_service(), AsyncSession, Depends

### Community 156 - "resource-recommendation.service.ts"
Cohesion: 0.24
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 157 - "require_permissions"
Cohesion: 0.14
Nodes (14): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+6 more)

### Community 158 - "schedule-optimization.types.ts"
Cohesion: 0.28
Nodes (7): scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult, ScheduleSuggestion

### Community 161 - "test_impact_analyzer.py"
Cohesion: 0.12
Nodes (35): str, RiskLevel, _build_prompt(), generate_impact_analysis(), get_ai_provider(), Any, AsyncSession, Dependency (+27 more)

### Community 163 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 164 - "test_cpm_scheduling.py"
Cohesion: 0.09
Nodes (40): run_cpm(), as_user(), _disable_rate_limiting(), event_loop(), make_user(), factory(), AsyncSession, fixture (+32 more)

### Community 166 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.13
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 167 - "StorageService"
Cohesion: 0.21
Nodes (11): AsyncClient, Response, RuntimeError, Create a missing private bucket, or reject an existing public bucket., Sanitized storage failure suitable for application logs., Call only after authorization. URLs are bearer capabilities until expiry., Private Supabase REST storage, with the existing local MinIO adapter., StorageError (+3 more)

### Community 170 - "README.md"
Cohesion: 0.20
Nodes (7): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume, Công việc: Render Free + Supabase Free

### Community 172 - "Rà soát cuối: Render Free + Supabase Free"
Cohesion: 0.33
Nodes (5): Các luồng đã đối chiếu, Giới hạn cần nghiệm thu khi có tài khoản, Kết luận, Phát hiện đã sửa trong lần rà soát, Rà soát cuối: Render Free + Supabase Free

### Community 182 - "(dashboard)/layout.tsx"
Cohesion: 0.14
Nodes (19): frontend_messages_en, AuthLayout(), DashboardLayout(), mocks, Form(), Brand(), LanguageToggle(), mocks (+11 more)

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
- **373 isolated node(s):** `Mục lục`, `Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):`, `Trạng thái triển khai thực tế (cập nhật 2026-10-02)`, `Hạ tầng Real-time & WebSocket Architecture`, `Phía máy chủ (Python)` (+368 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1225 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `lucide-react` to `User`, `Alert`, `ChatPanel.tsx`, `TaskStatus`, `portfolio_service.py`, `task_service.py`, `tasks/page.tsx`, `Chi tiết các Giai đoạn đã hoàn thành`, `Button.tsx`, `ChatService`, `NotificationService`, `useProjects.ts`, `DashboardService`, `useNotifications.ts`, `(dashboard)/layout.tsx`, `ProjectService`, `Button`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `sqlalchemy`, `portfolio_service.py`, `ai_tasks.py`, `require_permissions`, `wbs_service.py`, `test_cpm_scheduling.py`, `task_service.py`, `ProjectRepository`, `test_oauth_account_takeover.py`, `DashboardService`, `TaskStatus`, `AdminUserService`, `typing`, `ChatService`, `projects.py`, `test_change_request_service.py`, `db/base.py`, `OAuthService`, `_user_from_token`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `Alert` to `dashboard.types.ts`, `UserService`, `AdminUserService`, `users/page.tsx`, `getApiErrorMessage`, `Settings`, `react`, `AuthService`, `OAuthService`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 34 inferred relationships involving `User` (e.g. with `list_audit_logs()` and `list_permissions()`) actually correct?**
  _`User` has 34 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Mục lục`, `Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):`, `Trạng thái triển khai thực tế (cập nhật 2026-10-02)` to the rest of the system?**
  _373 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `test_schedule_optimizer.py` be split into smaller, more focused modules?**
  _Cohesion score 0.14112903225806453 - nodes in this community are weakly interconnected._
- **Should `Alert` be split into smaller, more focused modules?**
  _Cohesion score 0.07058823529411765 - nodes in this community are weakly interconnected._
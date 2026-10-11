# Graph Report - AI Project Planning & Portfolio Management system  (2026-10-10)

## Corpus Check
- 482 files · ~279,018 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3898 nodes · 12268 edges · 186 communities (139 shown, 23 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 1141 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0e11469e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types
- Button
- db/base.py
- admin.py
- tasks/page.tsx
- enqueue
- portfolio_service.py
- users/page.tsx
- unittest_mock
- get_redis
- test_auth_cookies.py
- ai_tasks.py
- react
- test_schedule_optimizer.py
- test_access_token_revocation.py
- NotificationService
- useProjects.ts
- useTasks.ts
- test_ws_hardening.py
- login
- resource_recommender.py
- Project
- useNotifications.ts
- test_login_lockout.py
- tasks.py
- ConnectionManager
- test_audit_regressions.py
- compilerOptions
- test_auth_password_recovery.py
- devDependencies
- post
- Modal
- ForbiddenException
- ThemeProvider.tsx
- test_authz_matrix.py
- package.json
- task_service.py
- notification_tasks.py
- TaskService
- _handle_callback
- lucide-react
- BaseRepository
- model_validator
- risk_analyzer.py
- date_utils.py
- main.py
- users.py
- endpoints/auth.py
- list_projects
- storage_service.py
- env.py
- dashboard_service.py
- test_rate_limit.py
- test_user_profile_settings.py
- dependencies
- auth.types.ts
- audit/page.tsx
- User
- Task
- test_security_state.py
- ProjectService
- Thiết kế kiến trúc hệ thống
- ProjectCreate
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- AuditLog
- ref_next_intl_server
- test_project_scoping.py
- worklogs.py
- AuditService
- TaskStatus
- AdminUserService
- resource-recommendation.service.ts
- ProjectRepository
- endpoints/ai.py
- typing
- scheduling_tasks.py
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- AGENTS.md
- chat_service.py
- ChatPanel.tsx
- Role
- .push
- .start_flow
- approvals.py
- test_change_request_service.py
- Cloud deployment — 2026-10-10
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- security_state_service.py
- get_critical_path
- BadRequestException
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- assignments.py
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- skills.py
- list_notifications
- next.config.js
- json_value
- PortfolioBase
- pytest
- @tanstack/react-query
- Depends
- test_cpm_scheduling.py
- wbs_service.py
- Exception
- RuntimeError
- Rà soát code và nâng cấp giao diện — 2026-09-15
- Backend local verification — 2026-10-09
- playwright
- 20260813_portfolio_project_core.py
- list_portfolios
- impact_analyzer.py
- Kế hoạch: Render Free + Supabase Free
- LanguageToggle.tsx
- ref_vitest_config
- recalculate_project_cost
- asyncio
- test_portfolio_project_core.py
- schemas/gantt.py
- change-request.types.ts
- .eslintrc.json
- Audit compute miễn phí: Render + Supabase
- middleware.ts
- next-env.d.ts
- Frontend durable jobs verification
- list_jobs
- test_durable_jobs_postgres.py
- report_tasks.py
- asyncio
- Email and private storage adapters
- .__init__
- 11. Cài đặt và Chạy hệ thống
- 3. Ngăn xếp công nghệ
- get_current_active_superuser
- api.ts
- list_audit_logs
- Chi tiết các Giai đoạn
- test_impact_analyzer.py
- update_subtask
- resource_leveling
- fixture
- scripts
- Đặc tả yêu cầu phần mềm (SRS)
- StorageService
- Chi tiết các Giai đoạn đã hoàn thành
- README.md
- ref_testing_library_jest_dom_vitest
- ref_date_fns_locale
- ref_hookform_resolvers_zod
- ref_next_dynamic
- ref_next_headers
- (dashboard)/layout.tsx
- ref_next_server
- AuthService
- Tiến độ — tasks/plan.md
- alembic
- ref_next_image
- ref_next_link
- ref_next_navigation

## God Nodes (most connected - your core abstractions)
1. `User` - 225 edges
2. `Button` - 95 edges
3. `ForbiddenException` - 82 edges
4. `Task` - 78 edges
5. `Base` - 75 edges
6. `WBSService` - 75 edges
7. `TaskService` - 73 edges
8. `NotFoundException` - 70 edges
9. `Project` - 68 edges
10. `BadRequestException` - 64 edges

## Surprising Connections (you probably didn't know these)
- `Existing file flow and scope` --references--> `StorageService`  [INFERRED]
  docs/adapter-verification.md → backend/app/services/storage_service.py
- `GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003)` --references--> `Leave`  [INFERRED]
  docs/roadmap/PHASE_3_AI_FEATURES_MODULE.md → backend/app/models/leave.py
- `GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002)` --references--> `ProjectService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/project_service.py
- `GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine` --references--> `TaskService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/task_service.py
- `GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003)` --references--> `WBSService`  [INFERRED]
  docs/roadmap/PHASE_2_PORTFOLIO_PROJECT_MODULE.md → backend/app/services/wbs_service.py

## Import Cycles
- None detected.

## Communities (186 total, 23 thin omitted)

### Community 0 - "types"
Cohesion: 0.08
Nodes (48): _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, ai_request(), authorized_project_context(), db(), asyncio, fixture, SOP-AI-001: AIService.get_job phải trả project_id để frontend biết điều hướng… (+40 more)

### Community 1 - "Button"
Cohesion: 0.06
Nodes (73): Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), ForgotPasswordPage(), metadata, LoginPage(), LoginPageProps, metadata, OAuthCallbackContent() (+65 more)

### Community 2 - "db/base.py"
Cohesion: 0.10
Nodes (31): Approval, ApprovalStatus, str, Các bảng liên kết cho quan hệ nhiều-nhiều., Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —… (+23 more)

### Community 3 - "admin.py"
Cohesion: 0.09
Nodes (28): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+20 more)

### Community 4 - "tasks/page.tsx"
Cohesion: 0.07
Nodes (65): DashboardLoading(), ChangeRequestsPage(), ProjectLayout(), ProjectMembersPage(), ProjectSettingsPage(), Field(), KanbanColumn(), Select() (+57 more)

### Community 5 - "enqueue"
Cohesion: 0.06
Nodes (56): ApplyResult, async_sessionmaker, JobContext, JobResult, JobRunner, AsyncSession, Recover and claim only free execution slots; useful for deterministic tests., Persist dispatch intent before sending; optional quota reservation is atomic. (+48 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.16
Nodes (16): create_portfolio(), Portfolio, PortfolioStatus, str, PortfolioRepository, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse (+8 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.08
Nodes (47): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+39 more)

### Community 8 - "unittest_mock"
Cohesion: 0.12
Nodes (25): EmailDeliveryError, _mail_config(), Safe to persist in job failures; excludes provider response bodies., _send(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task (+17 more)

### Community 9 - "get_redis"
Cohesion: 0.07
Nodes (51): issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), consume(), issue() (+43 more)

### Community 10 - "test_auth_cookies.py"
Cohesion: 0.15
Nodes (18): Request, Refresh token của người gọi: ưu tiên cookie, sau đó tới body. Body vẫn được…, read_refresh_token(), _cookies(), Response, Credential phiên phải nằm ngoài tầm với của JavaScript. Trước đây frontend giữ…, Middleware Edge cần biết CÓ phiên hay không, không cần chính credential., Script và ứng dụng di động không có kho cookie. (+10 more)

### Community 11 - "ai_tasks.py"
Cohesion: 0.07
Nodes (45): ImpactReportResponse, BaseModel, _candidate_stats(), AsyncSession, Diem vao chinh: nap Task, tinh chi so ung vien, goi AI, roi tra ve dict da xac…, Tinh cac chi so xac dinh (khong AI) cho tung thanh vien du an: ky nang,…, run_resource_recommendation(), Nạp Project/Task/Dependency, tính CPM, nạp Assignment + Leave đã duyệt, gọi AI.… (+37 more)

### Community 12 - "react"
Cohesion: 0.08
Nodes (45): VerificationState, VerifyEmailContent(), verify(), VerifyEmailPage(), AdminLayout(), TABS, AdminIndexPage(), AIInsightsPage() (+37 more)

### Community 13 - "test_schedule_optimizer.py"
Cohesion: 0.17
Nodes (23): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong…, Gọi AI để sinh đề xuất tối ưu lịch trình, đã kiểm tra/lọc kết quả.… (+15 more)

### Community 14 - "test_access_token_revocation.py"
Cohesion: 0.09
Nodes (44): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+36 more)

### Community 15 - "NotificationService"
Cohesion: 0.22
Nodes (11): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, MarkReadResponse, NotificationListResponse, NotificationResponse, BaseModel, UnreadCountResponse, get_notification_service(), NotificationService (+3 more)

### Community 16 - "useProjects.ts"
Cohesion: 0.12
Nodes (27): Avatar(), AvatarProps, UserTable(), portfolioKeys, InviteMemberDialog(), InitialProjectMember, useAssignableRoles(), useUserSearch() (+19 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.10
Nodes (36): taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, wbsKeys, taskService, wbsService, UserSummary (+28 more)

### Community 18 - "test_ws_hardening.py"
Cohesion: 0.07
Nodes (40): chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, authenticate_ws() (+32 more)

### Community 19 - "login"
Cohesion: 0.15
Nodes (22): AuthServiceDep, create_websocket_ticket(), get_me(), login(), CurrentUser, Depends, get, limit (+14 more)

### Community 20 - "resource_recommender.py"
Cohesion: 0.11
Nodes (29): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+21 more)

### Community 21 - "Project"
Cohesion: 0.10
Nodes (37): AIOutput, AIRequest, AIRequestStatus, AIRequestType, str, ImpactReport, Project, RiskReport (+29 more)

### Community 22 - "useNotifications.ts"
Cohesion: 0.16
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.11
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "tasks.py"
Cohesion: 0.17
Nodes (21): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+13 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.18
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 26 - "test_audit_regressions.py"
Cohesion: 0.18
Nodes (16): Phase, Worklog, project_work(), asyncio, fixture, Regression checks for populated Phase 2 flows found during the project audit., test_ai_broker_outage_still_enqueues_transactional_durable_job(), test_deleted_project_timer_can_be_recovered_when_starting_elsewhere() (+8 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "test_auth_password_recovery.py"
Cohesion: 0.16
Nodes (24): forgot_password(), Đưa email đặt lại mật khẩu vào hàng đợi đồng thời ngăn chặn kỹ thuật dò quét…, verify_password(), ForgotPasswordRequest, field_validator, RegisterRequest, ResetPasswordRequest, build_request() (+16 more)

### Community 29 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 30 - "post"
Cohesion: 0.19
Nodes (14): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+6 more)

### Community 31 - "Modal"
Cohesion: 0.14
Nodes (28): Metric(), PortfolioDetailPage(), PortfoliosPage(), Modal(), ModalProps, usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCardProps (+20 more)

### Community 32 - "ForbiddenException"
Cohesion: 0.10
Nodes (23): get_current_verified_user(), Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, role_checker(), ConflictException, ForbiddenException, NotFoundException, set_current_project_id(), AssignmentMutationResponse (+15 more)

### Community 33 - "ThemeProvider.tsx"
Cohesion: 0.16
Nodes (18): frontend_src_app_globals, metadata, RootLayout(), viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark() (+10 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (17): project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai., Customer nhin thay du an nhung khong thay phan ra cong viec ben trong., Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin. (+9 more)

### Community 35 - "package.json"
Cohesion: 0.05
Nodes (35): description, name, overrides, postcss, private, version, Form(), mocks (+27 more)

### Community 36 - "task_service.py"
Cohesion: 0.08
Nodes (46): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, TaskServiceDep (+38 more)

### Community 37 - "notification_tasks.py"
Cohesion: 0.16
Nodes (13): AsyncSession, task, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên…, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session() (+5 more)

### Community 38 - "TaskService"
Cohesion: 0.10
Nodes (20): Assignment, DependencyType, str, str, SubtaskStatus, TaskPriority, TaskDetailResponse, TaskResponse (+12 more)

### Community 39 - "_handle_callback"
Cohesion: 0.24
Nodes (13): _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get, limit, OAuthServiceDep (+5 more)

### Community 40 - "lucide-react"
Cohesion: 0.06
Nodes (58): Danh mục tính năng đã triển khai, DashboardPage(), ProjectOverviewCharts, ProjectOverviewPage(), Stat(), ProjectsPage(), MiniProgressBar(), ChangeRequestDetail() (+50 more)

### Community 41 - "BaseRepository"
Cohesion: 0.17
Nodes (6): BaseRepository, Any, AsyncSession, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., ModelType

### Community 43 - "risk_analyzer.py"
Cohesion: 0.13
Nodes (33): LeaveStatus, LeaveType, str, str, RiskLevel, _as_list(), _clamp_score(), _compute_signals() (+25 more)

### Community 44 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 45 - "main.py"
Cohesion: 0.06
Nodes (43): set_request_id(), client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+35 more)

### Community 46 - "users.py"
Cohesion: 0.08
Nodes (45): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+37 more)

### Community 47 - "endpoints/auth.py"
Cohesion: 0.13
Nodes (27): exchange_oauth_code(), logout(), Response, Đổi mã one-time code từ OAuth redirect lấy cặp token thực tế. Dùng một lần: lần…, Thu hồi cả refresh token lẫn access token của người gọi. Access token được lấy…, Làm mới access token. Trình duyệt không gửi gì cả — refresh token tới từ cookie…, refresh_token(), _base() (+19 more)

### Community 48 - "list_projects"
Cohesion: 0.15
Nodes (23): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+15 more)

### Community 49 - "storage_service.py"
Cohesion: 0.17
Nodes (14): get_storage_service(), provider(), asyncio, test_anonymous_avatar_access_is_denied_before_storage(), test_deleted_supabase_avatar_maps_to_404(), test_supabase_avatar_roundtrip_keeps_ownership_and_size_limits(), handle(), base64 (+6 more)

### Community 50 - "env.py"
Cohesion: 0.14
Nodes (15): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+7 more)

### Community 51 - "dashboard_service.py"
Cohesion: 0.05
Nodes (63): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số… (+55 more)

### Community 52 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.06
Nodes (51): Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, OAuthService, OAuthState, Any, AsyncSession, Phân giải identity của provider thành một User. `email_provider_verified` là…, Đổi `state` lấy luồng mà nó đại diện, đúng một lần. Trả về `(OAuthState,… (+43 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "auth.types.ts"
Cohesion: 0.17
Nodes (17): EmailVerificationBannerProps, AvatarSectionProps, LinkedAccountsSectionProps, authService, userService, AuthMessageResponse, ChangePasswordRequest, DeleteAccountRequest (+9 more)

### Community 56 - "audit/page.tsx"
Cohesion: 0.25
Nodes (10): AdminAuditPage(), ACTION_CLASSES, actionBadgeClass(), AuditLogTable(), formatTimestamp(), auditLogKeys, useAuditLogs(), auditService (+2 more)

### Community 57 - "User"
Cohesion: 0.07
Nodes (19): EpicStatus, str, MilestoneStatus, str, PhaseStatus, str, User, AsyncSession (+11 more)

### Community 58 - "Task"
Cohesion: 0.06
Nodes (37): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Epic, Milestone, Sprint, Subtask, Task, AsyncSession (+29 more)

### Community 59 - "test_security_state.py"
Cohesion: 0.10
Nodes (22): alembic_migration, alembic_operations, TooManyRequestsException, Preserve Slowapi decorators, with an async durable path in database mode.…, SecurityLimiter, decorator(), wrapper(), asyncio (+14 more)

### Community 60 - "ProjectService"
Cohesion: 0.15
Nodes (23): ProjectMethodology, ProjectStatus, str, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse (+15 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.15
Nodes (13): Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services Dev / 8 Services Prod), Kiến trúc phía giao diện, Kiến trúc phía máy chủ, Lược đồ cơ sở dữ liệu (SQLAlchemy — 8 Domains, 34 Tables) (+5 more)

### Community 62 - "ProjectCreate"
Cohesion: 0.18
Nodes (5): ProjectCreate, field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, test_portfolio_and_project_schema_validation()

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.08
Nodes (24): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 1. Tổng quan dự án, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+16 more)

### Community 64 - "AuditLog"
Cohesion: 0.18
Nodes (14): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, AuditLog, _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới. (+6 more)

### Community 66 - "test_project_scoping.py"
Cohesion: 0.27
Nodes (10): asyncio, fixture, Tai nguyen cua du an nay khong duoc ro ri sang du an khac., test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown() (+2 more)

### Community 67 - "worklogs.py"
Cohesion: 0.19
Nodes (18): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+10 more)

### Community 68 - "AuditService"
Cohesion: 0.27
Nodes (8): AuditService, AsyncSession, datetime, Truy cập chỉ đọc vào bảng audit_logs chỉ-ghi-thêm., build_db(), asyncio, test_list_maps_rows_with_actor(), test_list_returns_empty_page()

### Community 69 - "TaskStatus"
Cohesion: 0.15
Nodes (22): str, TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, test_status_graph_supports_normal_block_and_reopen_flows(), parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'. (+14 more)

### Community 70 - "AdminUserService"
Cohesion: 0.20
Nodes (27): AdminUserCreate, AdminUserUpdate, AdminUserService, AsyncSession, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, is_admin(), build_db() (+19 more)

### Community 71 - "resource-recommendation.service.ts"
Cohesion: 0.31
Nodes (8): ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem, ResourceRecommendationJobStatus, ResourceRecommendationResult

### Community 72 - "ProjectRepository"
Cohesion: 0.15
Nodes (6): ProjectRepository, AsyncSession, date, get_project_service(), AsyncSession, Depends

### Community 73 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (26): AIServiceDep, generate_project(), get_ai_job(), list_ai_jobs(), CurrentUser, CurrentVerifiedUser, Depends, get (+18 more)

### Community 74 - "typing"
Cohesion: 0.08
Nodes (41): AsyncSession, Depends, Header, schedule_jobs(), JobResponse, BaseModel, Job metadata only: payloads, delivery links and lease secrets stay server-side., list_permissions() (+33 more)

### Community 75 - "scheduling_tasks.py"
Cohesion: 0.31
Nodes (8): _pending_key(), task, Tính lại đường găng ngoài request, có gộp trùng. `recalculate_project` là thao…, Xếp hàng một lần tính lại cho `project_id` nếu chưa có lần nào đang chờ. Trả về…, Điểm vào Celery đồng bộ — chạy việc tính lại đến khi hoàn tất., recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 76 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 78 - "chat_service.py"
Cohesion: 0.11
Nodes (32): publish(), publish_many(), Any, Registry kết nối WebSocket dùng chung + cầu nối pub/sub Redis, được dùng bởi cả…, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, ChatHistoryResponse, ChatMessageCreate (+24 more)

### Community 79 - "ChatPanel.tsx"
Cohesion: 0.11
Nodes (25): GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), ProjectChatPage(), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys (+17 more)

### Community 80 - "Role"
Cohesion: 0.06
Nodes (47): Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Role, AsyncSession, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là… (+39 more)

### Community 81 - ".push"
Cohesion: 0.10
Nodes (19): Tạo, lưu và phát real-time một notification. Gọi flush ngay lập tức (cần thiết…, parse_document_task(), SOP-DOC-001: Phân tích tài liệu BRD/SRS bằng AI., asyncio, push() không bọc publish() trong try/except của riêng nó — sự bảo đảm rằng một…, test_push_does_not_shield_callers_from_a_broadcast_exception(), test_push_persists_and_broadcasts_over_websocket(), fake_flush() (+11 more)

### Community 82 - ".start_flow"
Cohesion: 0.33
Nodes (5): code_challenge_for(), new_code_verifier(), Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved., Challenge S256 tương ứng với `verifier`., Bắt đầu một luồng OAuth. Trả về `(state, browser_secret, code_challenge)`.…

### Community 83 - "approvals.py"
Cohesion: 0.07
Nodes (26): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, put, # TODO: Cài đặt hàm lấy theo id (+18 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.15
Nodes (28): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, submit_change_request(), CRStatus (+20 more)

### Community 85 - "Cloud deployment — 2026-10-10"
Cohesion: 0.29
Nodes (6): Cloud deployment — 2026-10-10, Cloud findings, Created and verified, Pending, Private local configuration, Rollback

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
Cohesion: 0.27
Nodes (23): SecurityState, claim(), clear(), _clock(), contains(), _hash(), increment(), _increment() (+15 more)

### Community 92 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 93 - "BadRequestException"
Cohesion: 0.13
Nodes (11): BadRequestException, ServiceUnavailableException, UnauthorizedException, UnprocessableException, get_user_service(), AsyncSession, Depends, UploadFile (+3 more)

### Community 94 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 95 - "assignments.py"
Cohesion: 0.21
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

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

### Community 101 - "PortfolioBase"
Cohesion: 0.20
Nodes (4): PortfolioBase, field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate.

### Community 102 - "pytest"
Cohesion: 0.13
Nodes (20): Job, catchup_loop(), enqueue_due_schedules(), Daily schedules use Vietnam dates; catch up only today's bounded window., run_daily_batch(), apply(), AsyncSession, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.… (+12 more)

### Community 103 - "@tanstack/react-query"
Cohesion: 0.12
Nodes (31): aiJobKeys, useAIJob(), changeRequestKeys, useImpactAnalysisJob(), AIJobOutput(), FAILURE_LABEL, featureLink(), JobRow() (+23 more)

### Community 105 - "test_cpm_scheduling.py"
Cohesion: 0.12
Nodes (39): run_cpm(), backward_pass(), build_graph(), compute_cpm(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor() (+31 more)

### Community 106 - "wbs_service.py"
Cohesion: 0.06
Nodes (74): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+66 more)

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 111 - "Backend local verification — 2026-10-09"
Cohesion: 0.40
Nodes (4): Backend local verification — 2026-10-09, Contracts exercised, Database and Supabase SQL checks, Remaining deployment evidence

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "list_portfolios"
Cohesion: 0.17
Nodes (15): delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends, ge (+7 more)

### Community 115 - "impact_analyzer.py"
Cohesion: 0.15
Nodes (20): ChangeRequest, Dependency, _build_prompt(), generate_impact_analysis(), get_ai_provider(), Any, AsyncSession, SOP-AI-002: Phân tích tác động (impact analysis) của một Change Request bằng… (+12 more)

### Community 116 - "Kế hoạch: Render Free + Supabase Free"
Cohesion: 0.20
Nodes (9): Cần xác định khi thực hiện, Hiện trạng đã xác minh, Kiến trúc đề xuất, Kế hoạch: Render Free + Supabase Free, Mục tiêu, Nguồn chính thức đã kiểm tra, Thứ tự triển khai, Điểm kiểm tra và giới hạn (+1 more)

### Community 117 - "LanguageToggle.tsx"
Cohesion: 0.40
Nodes (6): setLocale(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

### Community 119 - "recalculate_project_cost"
Cohesion: 0.20
Nodes (11): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), AsyncSession, Depends, Cong don Project.actual_cost tu worklog x don gia gio cua tung nguoi.… (+3 more)

### Community 121 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_enqueues_transactional_invitation(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 122 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 123 - "change-request.types.ts"
Cohesion: 0.20
Nodes (9): ChangeRequestCreateInput, changeRequestService, ChangeRequest, ChangeRequestStatus, ImpactAnalysisJobResponse, ImpactAnalysisJobResult, ImpactAnalysisJobStatus, ImpactReport (+1 more)

### Community 125 - "Audit compute miễn phí: Render + Supabase"
Cohesion: 0.22
Nodes (8): unavailable(), Audit compute miễn phí: Render + Supabase, Bộ nhớ và request production, Cách đo và phạm vi dữ liệu, Production build và static export, Quyết định, Việc cần xác minh ở bước deploy, Áp dụng giới hạn Render

### Community 126 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 128 - "Frontend durable jobs verification"
Cohesion: 0.33
Nodes (5): Behavior, Browser verification, Frontend durable jobs verification, Limits, Local verification

### Community 129 - "list_jobs"
Cohesion: 0.31
Nodes (9): get_job(), list_jobs(), CurrentUser, ge, get, le, Query, visible_jobs() (+1 more)

### Community 137 - "test_durable_jobs_postgres.py"
Cohesion: 0.05
Nodes (55): ABC, AmbiguousJobError, JobError, PermanentJobError, Exception, Bounded durable job execution, with short transactions around external work., RetryableJobError, BaseAIProvider (+47 more)

### Community 138 - "report_tasks.py"
Cohesion: 0.29
Nodes (7): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 139 - "asyncio"
Cohesion: 0.21
Nodes (24): asyncio, client(), AsyncClient, HTTP client chưa xác thực, chạy trên app thật qua ASGI., email_settings(), parametrize, storage_settings(), test_disabled_email_cannot_create_an_outbox_job() (+16 more)

### Community 145 - "Email and private storage adapters"
Cohesion: 0.50
Nodes (3): Email and private storage adapters, Existing file flow and scope, Local verification

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 150 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 151 - "get_current_active_superuser"
Cohesion: 0.67
Nodes (3): get_current_active_superuser(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC).

### Community 156 - "api.ts"
Cohesion: 0.09
Nodes (20): bootstrapSession(), refreshAccessToken(), refreshClient, RetriableConfig, RiskAnalysisJobResponse, RiskAnalysisJobStatus, RiskAnalysisResultResponse, riskReportService (+12 more)

### Community 157 - "list_audit_logs"
Cohesion: 0.25
Nodes (8): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query

### Community 159 - "Chi tiết các Giai đoạn"
Cohesion: 0.09
Nodes (19): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001), Hiện trạng & Hạ tầng sẵn có (+11 more)

### Community 161 - "test_impact_analyzer.py"
Cohesion: 0.32
Nodes (15): str, RiskLevel, change_request(), FakeScalars, make_db(), patched_ai(), project(), asyncio (+7 more)

### Community 162 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

### Community 163 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 164 - "fixture"
Cohesion: 0.16
Nodes (15): as_user(), factory(), override_db(), _disable_rate_limiting(), event_loop(), make_user(), factory(), AsyncSession (+7 more)

### Community 165 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 166 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (13): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+5 more)

### Community 167 - "StorageService"
Cohesion: 0.18
Nodes (13): AsyncClient, Response, RuntimeError, Create a missing private bucket, or reject an existing public bucket., Sanitized storage failure suitable for application logs., Call only after authorization. URLs are bearer capabilities until expiry., Private Supabase REST storage, with the existing local MinIO adapter., StorageError (+5 more)

### Community 168 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.29
Nodes (7): Chi tiết các Giai đoạn đã hoàn thành, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003), GIAI ĐOẠN 2.4 – Task Management, Phụ thuộc & CPM Engine, GIAI ĐOẠN 2.5 – Assignments, WorkLogs & Resource Tracking, GIAI ĐOẠN 2.6 – Portfolio & Project Dashboard, In-App Notifications

### Community 170 - "README.md"
Cohesion: 0.20
Nodes (7): Các mục còn cần nghiệm thu trên cloud, Demo Render Free + Supabase Free, Kiến trúc và quota, Quota, backup và theo dõi, Thiết lập lần đầu, Tác vụ, lỗi và resume, Công việc: Render Free + Supabase Free

### Community 182 - "(dashboard)/layout.tsx"
Cohesion: 0.19
Nodes (19): frontend_messages_en, AuthLayout(), DashboardLayout(), mocks, Brand(), LanguageToggle(), LINKS, MainNav() (+11 more)

### Community 184 - "AuthService"
Cohesion: 0.10
Nodes (17): AuthService, get_auth_service(), AsyncSession, datetime, Ghi lại một sự kiện xác thực. ip_address được điền tự động từ ngữ cảnh request…, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock. Trả về…, Đăng xuất phía server theo kiểu best-effort. Thu hồi CẢ HAI token. Trước đây… (+9 more)

### Community 185 - "Tiến độ — tasks/plan.md"
Cohesion: 0.40
Nodes (4): Kiểm thử, Quan hệ phụ thuộc rà soát, Quyết định và bằng chứng, Tiến độ — tasks/plan.md

## Knowledge Gaps
- **356 isolated node(s):** `Kiến trúc và quota`, `Thiết lập lần đầu`, `Tác vụ, lỗi và resume`, `Quota, backup và theo dõi`, `Các mục còn cần nghiệm thu trên cloud` (+351 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1186 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Danh mục tính năng đã triển khai` connect `lucide-react` to `ForbiddenException`, `Button`, `task_service.py`, `tasks/page.tsx`, `portfolio_service.py`, `TaskService`, `chat_service.py`, `NotificationService`, `ChatPanel.tsx`, `dashboard_service.py`, `useNotifications.ts`, `(dashboard)/layout.tsx`, `User`, `ProjectService`, `Modal`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Why does `User` connect `User` to `db/base.py`, `portfolio_service.py`, `test_durable_jobs_postgres.py`, `ai_tasks.py`, `test_access_token_revocation.py`, `test_ws_hardening.py`, `resource_recommender.py`, `Project`, `get_current_active_superuser`, `list_audit_logs`, `ForbiddenException`, `task_service.py`, `fixture`, `TaskService`, `users.py`, `list_projects`, `dashboard_service.py`, `test_user_profile_settings.py`, `test_security_state.py`, `ProjectService`, `AdminUserService`, `ProjectRepository`, `endpoints/ai.py`, `typing`, `chat_service.py`, `Role`, `test_change_request_service.py`, `BadRequestException`, `pytest`, `wbs_service.py`, `list_portfolios`, `recalculate_project_cost`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `Danh mục tính năng đã triển khai` connect `Button` to `AuditService`, `users/page.tsx`, `react`, `Role`, `test_user_profile_settings.py`, `AuthService`, `BadRequestException`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Are the 55 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 55 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Kiến trúc và quota`, `Thiết lập lần đầu`, `Tác vụ, lỗi và resume` to the rest of the system?**
  _356 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types` be split into smaller, more focused modules?**
  _Cohesion score 0.07764876632801161 - nodes in this community are weakly interconnected._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.06441374159820762 - nodes in this community are weakly interconnected._
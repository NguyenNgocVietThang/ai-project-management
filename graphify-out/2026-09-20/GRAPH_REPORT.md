# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-18)

## Corpus Check
- 434 files · ~237,983 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3519 nodes · 10055 edges · 170 communities (148 shown, 7 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 738 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `33f4b6c9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_auth_cookies.py
- react
- db/base.py
- post
- getApiErrorMessage
- resource_recommender.py
- test_portfolio_project_core.py
- users/page.tsx
- pytest
- projects/page.tsx
- oauth.py
- Chi tiết các Giai đoạn đã hoàn thành
- my_assignments
- AITaskType
- portfolios/[id]/page.tsx
- WBSService
- wbs.py
- tasks/page.tsx
- RiskWidget.tsx
- users.py
- endpoints/notifications.py
- lucide-react
- test_auth_password_recovery.py
- auth_service.py
- tasks.py
- NotificationService
- ai_tasks.py
- compilerOptions
- AuthService
- test_impact_analyzer.py
- security.py
- FastAPI
- ForbiddenException
- useNotifications.ts
- test_authz_matrix.py
- package.json
- dashboard.py
- schemas/task.py
- as_user
- roles.py
- NotFoundException
- project_service.py
- oauth_service.py
- Project
- test_auth_email_verification.py
- get_redis
- BadRequestException
- AdminUserService
- projects.py
- test_schedule_optimizer.py
- api.ts
- endpoints/ai.py
- Task
- test_user_profile_settings.py
- dependencies
- devDependencies
- ws/chat.py
- asyncio
- ConnectionManager
- rate_limit.py
- Role
- Thiết kế kiến trúc hệ thống
- sweep_task_dates
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- ThemeProvider.tsx
- milestones.py
- logging_config.py
- worklogs.py
- Chi tiết các Giai đoạn
- TaskStatus
- Chi tiết các Giai đoạn đã hoàn thành
- test_notification_triggers.py
- Đặc tả yêu cầu phần mềm (SRS)
- ResourceService
- AuditLog
- test_resource_warnings.py
- dashboard.types.ts
- AGENTS.md
- ChatService
- config.py
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- User
- get_db
- approvals.py
- test_change_request_service.py
- env.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- skills.py
- system.py
- get_chat_history
- ProjectRepository
- user_service.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- test_oauth_account_takeover.py
- test_rate_limit.py
- next.config.js
- main.py
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- config.ts
- test_project_scoping.py
- scripts
- Chi tiết kế hoạch triển khai
- .create_assignment
- middleware.ts
- test_phase2_task_wbs.py
- Rà soát code và nâng cấp giao diện — 2026-09-15
- list_portfolios
- DashboardService
- playwright
- typing
- date_utils.py
- epics.py
- test_dashboard_metrics.py
- PortfolioBase
- vitest.config.mts
- test_chat_service.py
- app/layout.tsx
- Chi tiết các Giai đoạn
- .get_project_stats
- Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- .eslintrc.json
- get_dashboard_summary
- PortfolioRepository
- next-env.d.ts
- Kết quả rà soát
- task_service.py
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- update_subtask
- 11. Cài đặt và Chạy hệ thống
- oauth_state_store.py
- resource_leveling
- 1. Tổng quan dự án
- risk_analyzer.py
- tailwind.config.ts
- oauth_exchange.py
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- get_resource_service
- useScheduleOptimization.ts
- sanitize.py
- celery_app.py
- get_critical_path
- CLAUDE.md
- validate_password_policy
- utils/cpm.py
- 3. Ngăn xếp công nghệ
- asyncio
- test_ws_hardening.py
- _put
- fixture

## God Nodes (most connected - your core abstractions)
1. `User` - 200 edges
2. `ForbiddenException` - 78 edges
3. `WBSService` - 69 edges
4. `Base` - 68 edges
5. `TaskService` - 67 edges
6. `NotFoundException` - 62 edges
7. `getApiErrorMessage()` - 60 edges
8. `BadRequestException` - 59 edges
9. `react` - 58 edges
10. `lucide-react` - 56 edges

## Surprising Connections (you probably didn't know these)
- `test_user_search_result_never_carries_a_usable_address()` --uses--> `UserSearchResult`  [INFERRED]
  backend/tests/unit/test_route_exposure.py → backend/app/schemas/project.py
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `test_recent_activity_filters_by_visible_projects()` --uses--> `DashboardService`  [INFERRED]
  backend/tests/unit/test_dashboard_activity_scope.py → backend/app/services/dashboard_service.py
- `test_recent_activity_returns_nothing_without_visible_projects()` --uses--> `DashboardService`  [INFERRED]
  backend/tests/unit/test_dashboard_activity_scope.py → backend/app/services/dashboard_service.py
- `test_team_utilisation_is_empty_without_members()` --uses--> `DashboardService`  [INFERRED]
  backend/tests/unit/test_dashboard_metrics.py → backend/app/services/dashboard_service.py

## Import Cycles
- None detected.

## Communities (170 total, 7 thin omitted)

### Community 0 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 1 - "react"
Cohesion: 0.05
Nodes (64): metadata, LoginPageProps, metadata, metadata, DeletePhaseDialog(), Editor, EntityEditor(), statusOptions() (+56 more)

### Community 2 - "db/base.py"
Cohesion: 0.09
Nodes (34): Approval, ApprovalStatus, str, Assignment, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —… (+26 more)

### Community 3 - "post"
Cohesion: 0.10
Nodes (47): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+39 more)

### Community 4 - "getApiErrorMessage"
Cohesion: 0.09
Nodes (34): VerifyEmailContent(), verify(), ProfilePageContent(), AIInsightsPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout(), ProjectSettingsPage() (+26 more)

### Community 5 - "resource_recommender.py"
Cohesion: 0.13
Nodes (29): Leave, LeaveStatus, LeaveType, str, _candidate_payload(), _candidate_stats(), _clamp_fit_score(), generate_resource_recommendation() (+21 more)

### Community 6 - "test_portfolio_project_core.py"
Cohesion: 0.18
Nodes (24): PortfolioStatus, str, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse, PortfolioUpdate (+16 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (52): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+44 more)

### Community 8 - "pytest"
Cohesion: 0.15
Nodes (19): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+11 more)

### Community 9 - "projects/page.tsx"
Cohesion: 0.08
Nodes (42): ProjectMembersPage(), ProjectsPage(), AIGeneratorModal(), STATUS_LABEL, mocks, aiJobKeys, IN_PROGRESS, useAIJob() (+34 more)

### Community 10 - "oauth.py"
Cohesion: 0.23
Nodes (19): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+11 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "my_assignments"
Cohesion: 0.20
Nodes (11): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+3 more)

### Community 13 - "AITaskType"
Cohesion: 0.06
Nodes (49): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm… (+41 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.15
Nodes (25): PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCard(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps (+17 more)

### Community 15 - "WBSService"
Cohesion: 0.11
Nodes (18): EpicStatus, str, PhaseStatus, str, EpicCreate, EpicUpdate, add_audit(), json_value() (+10 more)

### Community 16 - "wbs.py"
Cohesion: 0.08
Nodes (47): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+39 more)

### Community 17 - "tasks/page.tsx"
Cohesion: 0.07
Nodes (48): KanbanColumn(), SprintView(), STATUSES, TaskCard(), TaskTable(), ViewMode, localDate(), TaskDrawer() (+40 more)

### Community 18 - "RiskWidget.tsx"
Cohesion: 0.16
Nodes (18): isRiskLevel(), parseRiskResult(), RiskWidget(), STATUS_LABEL, IN_PROGRESS, riskAnalysisJobKeys, useRequestRiskAnalysis(), useRiskAnalysisJob() (+10 more)

### Community 19 - "users.py"
Cohesion: 0.11
Nodes (36): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+28 more)

### Community 20 - "endpoints/notifications.py"
Cohesion: 0.13
Nodes (24): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+16 more)

### Community 21 - "lucide-react"
Cohesion: 0.05
Nodes (66): AdminAuditPage(), DashboardPage(), ProjectOverviewPage(), MiniProgressBar(), MiniProgressBarProps, Avatar(), AvatarProps, EmptyState() (+58 more)

### Community 22 - "test_auth_password_recovery.py"
Cohesion: 0.22
Nodes (19): verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request (+11 more)

### Community 23 - "auth_service.py"
Cohesion: 0.07
Nodes (37): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+29 more)

### Community 24 - "tasks.py"
Cohesion: 0.16
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 25 - "NotificationService"
Cohesion: 0.11
Nodes (18): get_notification_service(), NotificationService, AsyncSession, Depends, get_db, Tạo, lưu và phát real-time một notification. Gọi flush ngay lập tức (cần thiết…, Cùng nội dung, nhiều người nhận — một lần INSERT, một lần publish. Gọi `push()`…, asyncio (+10 more)

### Community 26 - "ai_tasks.py"
Cohesion: 0.08
Nodes (36): AIOutput, AIRequest, ImpactReportResponse, BaseModel, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse, SOP-AI-001: Điều phối vòng đời AIRequest cho tính năng sinh dự án bằng AI.… (+28 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "AuthService"
Cohesion: 0.14
Nodes (10): TooManyRequestsException, AuthService, get_auth_service(), AsyncSession, datetime, Depends, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái…, Đưa một token mới vào hàng đợi, áp dụng cooldown dưới một row lock. Trả về… (+2 more)

### Community 29 - "test_impact_analyzer.py"
Cohesion: 0.32
Nodes (15): str, RiskLevel, change_request(), FakeScalars, make_db(), patched_ai(), project(), asyncio (+7 more)

### Community 30 - "security.py"
Cohesion: 0.09
Nodes (42): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+34 more)

### Community 31 - "FastAPI"
Cohesion: 0.09
Nodes (26): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+18 more)

### Community 32 - "ForbiddenException"
Cohesion: 0.09
Nodes (29): ForbiddenException, DependencyType, str, str, SubtaskStatus, TaskPriority, DependencyResponse, TaskDetailResponse (+21 more)

### Community 33 - "useNotifications.ts"
Cohesion: 0.09
Nodes (25): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+17 more)

### Community 34 - "test_authz_matrix.py"
Cohesion: 0.16
Nodes (17): project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai., Customer nhin thay du an nhung khong thay phan ra cong viec ben trong., Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin. (+9 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (26): description, name, overrides, postcss, private, version, autoprefixer, clsx (+18 more)

### Community 36 - "dashboard.py"
Cohesion: 0.15
Nodes (21): Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth (+13 more)

### Community 37 - "schemas/task.py"
Cohesion: 0.16
Nodes (17): AssignmentCreate, AssignmentMutationResponse, AssignmentResponse, DependencyCreate, BaseModel, model_validator, ResourceWarning, SubtaskResponse (+9 more)

### Community 38 - "as_user"
Cohesion: 0.15
Nodes (16): AsyncClient, as_user(), factory(), client(), override_db(), _disable_rate_limiting(), event_loop(), factory() (+8 more)

### Community 39 - "roles.py"
Cohesion: 0.12
Nodes (25): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+17 more)

### Community 40 - "NotFoundException"
Cohesion: 0.18
Nodes (21): NotFoundException, AIRequestStatus, AIRequestType, str, AIJobResponse, AIService, get_ai_service(), AsyncSession (+13 more)

### Community 41 - "project_service.py"
Cohesion: 0.13
Nodes (21): ProjectMethodology, ProjectStatus, str, date, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities (+13 more)

### Community 42 - "oauth_service.py"
Cohesion: 0.19
Nodes (10): Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, get_oauth_service(), OAuthService, OAuthState, Any, AsyncSession, Depends (+2 more)

### Community 43 - "Project"
Cohesion: 0.14
Nodes (20): ChangeRequest, Project, datetime, _build_prompt(), generate_impact_analysis(), get_ai_provider(), Any, AsyncSession (+12 more)

### Community 44 - "test_auth_email_verification.py"
Cohesion: 0.22
Nodes (16): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_stores_hashed_token_and_survives_queue_failure() (+8 more)

### Community 45 - "get_redis"
Cohesion: 0.14
Nodes (18): get_redis(), publish(), publish_many(), Any, Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, health_check(), get (+10 more)

### Community 46 - "BadRequestException"
Cohesion: 0.18
Nodes (9): BadRequestException, ProjectDetailResponse, ProjectMemberResponse, ProjectResponse, ProjectSummaryResponse, ProjectService, date, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec… (+1 more)

### Community 47 - "AdminUserService"
Cohesion: 0.31
Nodes (24): AdminUserCreate, AdminUserUpdate, AdminUserService, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user(), asyncio, Một chủ thể có "user:update" PATCH tài khoản của chính mình thành… (+16 more)

### Community 48 - "projects.py"
Cohesion: 0.18
Nodes (22): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+14 more)

### Community 49 - "test_schedule_optimizer.py"
Cohesion: 0.17
Nodes (25): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong…, Gọi AI để sinh đề xuất tối ưu lịch trình, đã kiểm tra/lọc kết quả.… (+17 more)

### Community 50 - "api.ts"
Cohesion: 0.04
Nodes (80): AuthLayout(), OAuthCallbackContent(), VerificationState, AdminLayout(), TABS, DashboardLayout(), FullPageSpinner(), Brand() (+72 more)

### Community 51 - "endpoints/ai.py"
Cohesion: 0.16
Nodes (23): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get, SOP-AI-001: Xếp hàng sinh một dự án (Phases + Tasks + Dependencies) từ prompt.… (+15 more)

### Community 52 - "Task"
Cohesion: 0.10
Nodes (22): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Milestone, Sprint, Subtask, Task, AsyncSession, TaskRepository (+14 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.21
Nodes (20): ChangePasswordRequest, avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data() (+12 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "ws/chat.py"
Cohesion: 0.13
Nodes (18): chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, authenticate_ws() (+10 more)

### Community 57 - "asyncio"
Cohesion: 0.20
Nodes (16): asyncio, make_user(), Tạo một user đã lưu. `verified=False` để kiểm tra cổng email verification., project_work(), Regression checks for populated Phase 2 flows found during the project audit., test_ai_broker_failure_does_not_leave_pending_job(), test_deleted_project_timer_can_be_recovered_when_starting_elsewhere(), test_owner_can_stop_timer_after_project_access_removed() (+8 more)

### Community 58 - "ConnectionManager"
Cohesion: 0.18
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 59 - "rate_limit.py"
Cohesion: 0.16
Nodes (15): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+7 more)

### Community 60 - "Role"
Cohesion: 0.19
Nodes (16): Role, get_role_service(), AsyncSession, Depends, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db() (+8 more)

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "sweep_task_dates"
Cohesion: 0.20
Nodes (10): AsyncSession, task, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session(), asyncio (+2 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.10
Nodes (20): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS) (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.21
Nodes (11): ThemedToaster(), apply(), systemPrefersDark(), Status(), ThemeContext, ThemeContextValue, themeInitScript, ThemePreference (+3 more)

### Community 65 - "milestones.py"
Cohesion: 0.26
Nodes (14): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+6 more)

### Community 66 - "logging_config.py"
Cohesion: 0.21
Nodes (10): configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:…, Cau hinh logging goc. `json_output` tat o development, noi mot dong doc duoc…, RequestIdFilter, contextvars (+2 more)

### Community 67 - "worklogs.py"
Cohesion: 0.18
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 69 - "TaskStatus"
Cohesion: 0.16
Nodes (21): str, TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong. (+13 more)

### Community 70 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 71 - "test_notification_triggers.py"
Cohesion: 0.32
Nodes (14): NotificationType, str, TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, asyncio (+6 more)

### Community 72 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 73 - "ResourceService"
Cohesion: 0.23
Nodes (9): User, Cac assignment cua nguoi dung hien tai, moi nhat truoc. Co gioi han: danh sach…, Worklog cua mot task, moi nhat truoc. Co gioi han: mot task chay dai tich luy…, Worklog ma nguoi goi duoc phep sua. Chu so huu, PM cua du an, hoac Admin. Truoc…, ResourceService, recalculate_task_hours(), Worklog, WorklogCreate (+1 more)

### Community 74 - "AuditLog"
Cohesion: 0.15
Nodes (17): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, _captured_where_text(), asyncio (+9 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "dashboard.types.ts"
Cohesion: 0.07
Nodes (28): ProjectOverviewCharts, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, ActiveProjectsGridProps (+20 more)

### Community 78 - "ChatService"
Cohesion: 0.24
Nodes (10): ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse, BaseModel, Schema cho tính năng chat nhóm theo phạm vi dự án., ChatService, get_chat_service() (+2 more)

### Community 79 - "config.py"
Cohesion: 0.17
Nodes (13): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts() (+5 more)

### Community 80 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 81 - "User"
Cohesion: 0.08
Nodes (11): get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ConflictException, User, AsyncSession (+3 more)

### Community 82 - "get_db"
Cohesion: 0.11
Nodes (22): get_db(), AsyncSession, FastAPI dependency: trả về (yield) một async DB session., AdminUserResponse, AuditLogResponse, IDResponse, PaginatedResponse, BaseModel (+14 more)

### Community 83 - "approvals.py"
Cohesion: 0.17
Nodes (12): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+4 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.12
Nodes (31): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, submit_change_request(), CRStatus (+23 more)

### Community 85 - "env.py"
Cohesion: 0.19
Nodes (10): do_run_migrations(), run_async_migrations(), run_migrations_online(), main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Connection, os (+2 more)

### Community 86 - "documents.py"
Cohesion: 0.17
Nodes (12): create_documents(), delete_documents(), get_documents(), list_documents(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+4 more)

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.18
Nodes (11): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+3 more)

### Community 88 - "leaves.py"
Cohesion: 0.18
Nodes (11): create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, # TODO: Cài đặt hàm lấy theo id, # TODO: Cài đặt hàm tạo mới (+3 more)

### Community 89 - "project_versions.py"
Cohesion: 0.17
Nodes (12): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+4 more)

### Community 90 - "reports.py"
Cohesion: 0.17
Nodes (12): create_reports(), delete_reports(), get_reports(), list_reports(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+4 more)

### Community 91 - "skills.py"
Cohesion: 0.18
Nodes (11): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+3 more)

### Community 92 - "system.py"
Cohesion: 0.17
Nodes (12): create_system(), delete_system(), get_system(), list_system(), delete, get, # TODO: Cài đặt hàm get theo id, # TODO: Cài đặt hàm create (+4 more)

### Community 93 - "get_chat_history"
Cohesion: 0.19
Nodes (13): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+5 more)

### Community 94 - "ProjectRepository"
Cohesion: 0.18
Nodes (3): ProjectRepository, AsyncSession, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`.

### Community 95 - "user_service.py"
Cohesion: 0.07
Nodes (25): ServiceUnavailableException, UnauthorizedException, UnprocessableException, DeleteAccountRequest, OAuthConnectResponse, BaseModel, field_validator, UserUpdate (+17 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "test_oauth_account_takeover.py"
Cohesion: 0.18
Nodes (11): asyncio, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through(), test_identity_without_email_is_never_treated_as_verified() (+3 more)

### Community 98 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "main.py"
Cohesion: 0.11
Nodes (24): set_request_id(), close_redis(), Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ…, Request, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip(), set_client_ip(), Registry kết nối WebSocket dùng chung + cầu nối pub/sub Redis, được dùng bởi cả… (+16 more)

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Task 1: Change Request CRUD tối giản, Task 2: Phân tích tác động bằng AI (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Phân tích rủi ro (SOP-AI-005) — song song, sau Task 1, Task 6: Wiring — nối 4 trụ cột vào hệ thống chung (tuần tự, tôi tự làm), Todo: Phase 3 (AI Features) — 4 trụ cột còn lại, Điểm kiểm tra: Hoàn chỉnh (+2 more)

### Community 102 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 103 - "test_project_scoping.py"
Cohesion: 0.27
Nodes (10): asyncio, fixture, Tai nguyen cua du an nay khong duoc ro ri sang du an khac., test_a_pm_cannot_open_a_task_from_another_project(), test_a_pm_cannot_read_another_projects_chat(), test_a_pm_cannot_read_another_projects_critical_path(), test_a_pm_cannot_read_another_projects_tasks(), test_a_pm_cannot_read_another_projects_work_breakdown() (+2 more)

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 106 - ".create_assignment"
Cohesion: 0.27
Nodes (5): Assignment, AssignmentCreate, date, ResourceWarning, Task

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - "test_phase2_task_wbs.py"
Cohesion: 0.24
Nodes (9): GanttResponse, GanttTask, BaseModel, asyncio, test_cascade_phase_delete_records_snapshot_and_recalculates(), test_invalid_task_status_transition_is_rejected(), test_status_graph_supports_normal_block_and_reopen_flows(), test_stop_timer_calculates_hours_and_updates_task_total() (+1 more)

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "list_portfolios"
Cohesion: 0.19
Nodes (15): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+7 more)

### Community 111 - "DashboardService"
Cohesion: 0.12
Nodes (16): ActiveProjectSummary, DashboardService, get_dashboard_service(), _iso_week_bounds(), AsyncSession, date, Depends, get_db (+8 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 113 - "typing"
Cohesion: 0.04
Nodes (16): alembic, Các bảng liên kết cho quan hệ nhiều-nhiều., BaseRepository, Any, AsyncSession, datetime, NotificationService – CRUD + helper để tạo notifications từ các service khác.…, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên… (+8 more)

### Community 114 - "date_utils.py"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 115 - "epics.py"
Cohesion: 0.29
Nodes (11): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+3 more)

### Community 116 - "test_dashboard_metrics.py"
Cohesion: 0.22
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 117 - "PortfolioBase"
Cohesion: 0.20
Nodes (4): PortfolioBase, field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate.

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 119 - "test_chat_service.py"
Cohesion: 0.39
Nodes (10): build_actor(), build_message(), asyncio, test_create_message_persists_and_publishes(), test_history_no_more_pages_when_under_limit(), test_history_rejects_non_member(), test_history_returns_items_in_chronological_order_and_flags_more(), test_mark_read_creates_state_when_absent() (+2 more)

### Community 120 - "app/layout.tsx"
Cohesion: 0.23
Nodes (7): frontend_src_app_globals, metadata, viewport, Providers(), notifyError(), ref_next_intl_server, sonner

### Community 121 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 122 - ".get_project_stats"
Cohesion: 0.29
Nodes (4): Burndown 14 ngày đơn giản: còn lại = tổng - số task đã hoàn thành cộng dồn., BurndownPoint, ProjectDashboardStats, TeamMemberUtilization

### Community 123 - "Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.13
Nodes (14): 4 trụ cột (song song, sau Task 1), Câu hỏi còn mở, Danh sách công việc, Kiến trúc mới, Kiến trúc tái sử dụng (đã có sẵn, không cần sửa), Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm) (+6 more)

### Community 125 - "get_dashboard_summary"
Cohesion: 0.33
Nodes (9): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số…, Dữ liệu Dashboard dự án: - Phân bố trạng thái task (dữ liệu biểu đồ donut) -… (+1 more)

### Community 126 - "PortfolioRepository"
Cohesion: 0.15
Nodes (8): PortfolioRepository, AsyncSession, get_portfolio_service(), AsyncSession, Depends, get_project_service(), AsyncSession, Depends

### Community 128 - "Kết quả rà soát"
Cohesion: 0.29
Nodes (6): Chat dự án và thông báo WebSocket thời gian thực (hoàn thành 100%), Các model chính, Kiến trúc phía giao diện và chất lượng, Kiến trúc phía máy chủ (đã xác minh và kiểm thử), Kết quả rà soát, Tính năng quản trị và RBAC (hoàn thành 100%)

### Community 129 - "task_service.py"
Cohesion: 0.16
Nodes (14): Dependency, Epic, CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), AsyncSession (+6 more)

### Community 145 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 146 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "oauth_state_store.py"
Cohesion: 0.16
Nodes (14): code_challenge_for(), consume(), issue(), _key(), new_code_verifier(), Any, Store phía server cho tham số `state` của OAuth, kèm ràng buộc theo trình duyệt…, Key Redis cho một luồng, dẫn xuất từ CẢ state lẫn bí mật trong cookie. Ràng… (+6 more)

### Community 149 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 150 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-18)

### Community 151 - "risk_analyzer.py"
Cohesion: 0.13
Nodes (32): str, RiskLevel, RiskReport, _as_list(), _clamp_score(), _compute_signals(), _count_overloaded_user_days(), _level_from_score() (+24 more)

### Community 153 - "oauth_exchange.py"
Cohesion: 0.40
Nodes (5): _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), secrets

### Community 154 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 157 - "get_resource_service"
Cohesion: 0.40
Nodes (4): get_resource_service(), AsyncSession, Depends, get_db

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 159 - "sanitize.py"
Cohesion: 0.40
Nodes (4): Làm sạch nội dung do người dùng nhập trước khi lưu. Tin nhắn chat trước đây…, Chuẩn hoá một tin nhắn chat do người dùng gửi. Cố tình KHÔNG escape HTML: nội…, sanitize_message(), re

### Community 160 - "celery_app.py"
Cohesion: 0.20
Nodes (9): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx, celery (+1 more)

### Community 161 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 163 - "validate_password_policy"
Cohesion: 0.33
Nodes (3): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator

### Community 164 - "utils/cpm.py"
Cohesion: 0.09
Nodes (46): backward_pass(), build_graph(), compute_cpm(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor(), _edges_by_successor() (+38 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

### Community 167 - "test_ws_hardening.py"
Cohesion: 0.11
Nodes (26): _close_unauthorized(), enforce_connection_validity(), Xác thực và giám sát vòng đời cho các WebSocket endpoint. Handshake trình ra…, Watchdog: đóng `websocket` khi nó không còn được phép mở. Chạy song song với…, _redeem(), issue(), _key(), Any (+18 more)

### Community 168 - "_put"
Cohesion: 0.15
Nodes (8): update_gantt(), update_leaves(), update_skills(), get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, _put(), Minio

## Knowledge Gaps
- **376 isolated node(s):** `graphify`, `graphify`, `Mục lục`, `Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):`, `Trạng thái triển khai thực tế (cập nhật 2026-09-18)` (+371 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1169 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `task_service.py`, `db/base.py`, `resource_recommender.py`, `test_portfolio_project_core.py`, `WBSService`, `wbs.py`, `users.py`, `auth_service.py`, `ai_tasks.py`, `AuthService`, `security.py`, `FastAPI`, `ForbiddenException`, `as_user`, `roles.py`, `test_ws_hardening.py`, `NotFoundException`, `oauth_service.py`, `project_service.py`, `test_auth_email_verification.py`, `BadRequestException`, `AdminUserService`, `projects.py`, `endpoints/ai.py`, `ws/chat.py`, `asyncio`, `Role`, `ChatService`, `get_db`, `test_change_request_service.py`, `env.py`, `ProjectRepository`, `user_service.py`, `test_oauth_account_takeover.py`, `list_portfolios`, `typing`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `ForbiddenException` connect `ForbiddenException` to `task_service.py`, `test_portfolio_project_core.py`, `WBSService`, `users.py`, `auth_service.py`, `NotificationService`, `ai_tasks.py`, `AuthService`, `security.py`, `FastAPI`, `roles.py`, `NotFoundException`, `project_service.py`, `BadRequestException`, `AdminUserService`, `ws/chat.py`, `Role`, `ResourceService`, `User`, `get_db`, `test_change_request_service.py`, `user_service.py`, `.create_assignment`, `DashboardService`, `typing`, `test_chat_service.py`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `BadRequestException` connect `BadRequestException` to `ForbiddenException`, `task_service.py`, `db/base.py`, `test_portfolio_project_core.py`, `project_service.py`, `oauth.py`, `oauth_service.py`, `.create_assignment`, `ResourceService`, `AdminUserService`, `WBSService`, `User`, `get_db`, `oauth_state_store.py`, `auth_service.py`, `ai_tasks.py`, `AuthService`, `user_service.py`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Are the 48 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 48 INFERRED edges - model-reasoned connections that need verification._
- **Are the 26 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 26 INFERRED edges - model-reasoned connections that need verification._
- **What connects `graphify`, `graphify`, `Mục lục` to the rest of the system?**
  _376 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `test_auth_cookies.py` be split into smaller, more focused modules?**
  _Cohesion score 0.12807881773399016 - nodes in this community are weakly interconnected._
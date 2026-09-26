# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-25)

## Corpus Check
- 434 files · ~236,841 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3539 nodes · 10283 edges · 158 communities (134 shown, 9 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 788 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c25d01a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ChatPanel.tsx
- react
- db/base.py
- endpoints/auth.py
- wbs/page.tsx
- RoleService
- PortfolioService
- users/page.tsx
- unittest_mock
- projects/page.tsx
- Any
- Chi tiết các Giai đoạn đã hoàn thành
- Button.tsx
- ai_tasks.py
- portfolios/[id]/page.tsx
- TaskService
- test_schedule_optimizer.py
- useTasks.ts
- RiskWidget.tsx
- users.py
- NotificationService
- dashboard.types.ts
- useNotifications.ts
- test_login_lockout.py
- test_resource_recommender.py
- ConnectionManager
- schemas/gantt.py
- compilerOptions
- auth_service.py
- run_impact_analysis
- wbs.py
- AuthService
- User
- getApiErrorMessage
- as_user
- package.json
- tasks.py
- schemas/task.py
- ResourceService
- AdminUserService
- AIService
- ForbiddenException
- BadRequestException
- run_risk_analysis
- timedelta
- main.py
- project_service.py
- test_route_exposure.py
- list_projects
- get_redis
- api.ts
- dashboard.py
- Task
- test_user_profile_settings.py
- dependencies
- devDependencies
- oauth.py
- wrap_user_input
- rate_limit.py
- test_auth_cookies.py
- ProjectService
- Thiết kế kiến trúc hệ thống
- test_phase2_task_wbs.py
- Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI
- ThemeProvider.tsx
- Epic
- PortfolioRepository
- worklogs.py
- Chi tiết các Giai đoạn
- TaskStatus
- Chi tiết các Giai đoạn đã hoàn thành
- test_portfolio_project_core.py
- Đặc tả yêu cầu phần mềm (SRS)
- generate_project
- test_dashboard_activity_scope.py
- test_resource_warnings.py
- list_portfolios
- AGENTS.md
- ChatService
- test_ws_hardening.py
- 3. Yêu cầu chức năng (Yêu cầu chức năng)
- scheduling_service.py
- test_dashboard_metrics.py
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
- user_service.py
- ProjectRepository
- dashboards.py
- Tài liệu yêu cầu nghiệp vụ (BRD)
- test_oauth_account_takeover.py
- endpoints/ai.py
- next.config.js
- list_permissions
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- config.ts
- useAIGenerator.ts
- scripts
- Chi tiết kế hoạch triển khai
- celery_app.py
- middleware.ts
- Kế hoạch deploy môi trường thử nghiệm lên Oracle Cloud Always Free
- Rà soát code và nâng cấp giao diện — 2026-09-15
- list_audit_logs
- DashboardService
- playwright
- alembic
- pytest
- login/page.tsx
- types
- get_critical_path
- vitest.config.mts
- resource_leveling
- endpoints/dependencies.py
- Chi tiết các Giai đoạn
- model_validator
- Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- .eslintrc.json
- BaseAIProvider
- chat_ws
- next-env.d.ts
- Kết quả rà soát
- ._burndown
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- tailwind.config.ts
- 11. Cài đặt và Chạy hệ thống
- WebSocket
- 1. Tổng quan dự án
- 7. Hệ thống phân quyền (RBAC) & Quản trị Admin
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- useScheduleOptimization.ts
- risk_analyzer.py
- test_auth_password_recovery.py
- ValueError
- 3. Ngăn xếp công nghệ

## God Nodes (most connected - your core abstractions)
1. `User` - 220 edges
2. `ForbiddenException` - 82 edges
3. `WBSService` - 70 edges
4. `Base` - 68 edges
5. `NotFoundException` - 68 edges
6. `TaskService` - 68 edges
7. `Task` - 64 edges
8. `BadRequestException` - 61 edges
9. `getApiErrorMessage()` - 60 edges
10. `react` - 58 edges

## Surprising Connections (you probably didn't know these)
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `test_audit_log_is_indexed_for_the_activity_feed()` --uses--> `AuditLog`  [INFERRED]
  backend/tests/unit/test_dashboard_activity_scope.py → backend/app/models/audit_log.py
- `AdminUserService` --uses--> `AdminUserResponse`  [INFERRED]
  backend/app/services/admin_service.py → backend/app/schemas/admin.py
- `test_project_role_options_do_not_carry_the_permission_matrix()` --uses--> `RoleOptionResponse`  [INFERRED]
  backend/tests/unit/test_route_exposure.py → backend/app/schemas/admin.py
- `list_portfolios()` --uses--> `PaginatedResponse`  [INFERRED]
  backend/app/api/v1/endpoints/portfolios.py → backend/app/schemas/common.py

## Import Cycles
- None detected.

## Communities (158 total, 9 thin omitted)

### Community 0 - "ChatPanel.tsx"
Cohesion: 0.09
Nodes (24): ProjectChatPage(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory(), useMarkChatRead() (+16 more)

### Community 1 - "react"
Cohesion: 0.06
Nodes (59): AIInsightsPage(), ProjectMembersPage(), STATUSES, TasksPage(), ViewMode, TimesheetPage(), Input, InputProps (+51 more)

### Community 2 - "db/base.py"
Cohesion: 0.10
Nodes (30): AIOutput, Approval, ApprovalStatus, str, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —… (+22 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.09
Nodes (50): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+42 more)

### Community 4 - "wbs/page.tsx"
Cohesion: 0.04
Nodes (68): ChangeRequestsPage(), ProjectOverviewPage(), KanbanColumn(), SprintView(), TaskCard(), TaskTable(), DeletePhaseDialog(), Editor (+60 more)

### Community 5 - "RoleService"
Cohesion: 0.10
Nodes (39): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+31 more)

### Community 6 - "PortfolioService"
Cohesion: 0.13
Nodes (16): PortfolioStatus, str, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse (+8 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.06
Nodes (58): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, adminRoleKeys, permissionKeys (+50 more)

### Community 8 - "unittest_mock"
Cohesion: 0.16
Nodes (18): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+10 more)

### Community 9 - "projects/page.tsx"
Cohesion: 0.13
Nodes (27): ProjectsPage(), AIGeneratorModal(), STATUS_LABEL, mocks, useAIJob(), useGenerateProject(), portfolioKeys, InitialProjectMember (+19 more)

### Community 11 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 12 - "Button.tsx"
Cohesion: 0.08
Nodes (35): ProjectSettingsPage(), MiniProgressBar(), MiniProgressBarProps, Alert(), AlertProps, VARIANT_CLASSES, Avatar(), AvatarProps (+27 more)

### Community 13 - "ai_tasks.py"
Cohesion: 0.11
Nodes (28): ImpactReportResponse, BaseModel, BaseModel, RiskReportResponse, DependencyCreate, TaskCreate, PhaseCreate, impact_analysis_task() (+20 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.14
Nodes (25): PortfolioDetailPage(), PortfoliosPage(), DASHBOARD_KEYS, usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps (+17 more)

### Community 15 - "TaskService"
Cohesion: 0.14
Nodes (14): TaskPriority, DependencyResponse, TaskBulkUpdate, TaskCapabilities, TaskDetailResponse, TaskResponse, AsyncSession, date (+6 more)

### Community 16 - "test_schedule_optimizer.py"
Cohesion: 0.16
Nodes (27): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, Kiểm tra/lọc JSON thô từ AI — coi nó là dữ liệu không tin cậy. Mirror phong… (+19 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (35): taskKeys, useInvalidate(), useTaskActions(), wbsKeys, taskService, wbsService, UserSummary, Assignment (+27 more)

### Community 18 - "RiskWidget.tsx"
Cohesion: 0.16
Nodes (18): isRiskLevel(), parseRiskResult(), RiskWidget(), STATUS_LABEL, IN_PROGRESS, riskAnalysisJobKeys, useRequestRiskAnalysis(), useRiskAnalysisJob() (+10 more)

### Community 19 - "users.py"
Cohesion: 0.09
Nodes (45): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+37 more)

### Community 20 - "NotificationService"
Cohesion: 0.05
Nodes (56): Any, delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete (+48 more)

### Community 21 - "dashboard.types.ts"
Cohesion: 0.07
Nodes (26): ProjectOverviewCharts, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, ActiveProjectsGridProps (+18 more)

### Community 22 - "useNotifications.ts"
Cohesion: 0.17
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.10
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "test_resource_recommender.py"
Cohesion: 0.20
Nodes (21): _candidate_payload(), _clamp_fit_score(), generate_resource_recommendation(), get_ai_provider(), Any, AsyncSession, Du lieu ung vien gui cho AI - khong wrap_user_input vi day la du lieu tin cay…, Goi AI de xep hang cac ung vien, roi loc/chuan hoa response truoc khi tra ve.… (+13 more)

### Community 25 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:…, test_broadcast_local_drops_connection_that_fails_to_send() (+5 more)

### Community 26 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "auth_service.py"
Cohesion: 0.09
Nodes (42): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+34 more)

### Community 29 - "run_impact_analysis"
Cohesion: 0.22
Nodes (21): str, RiskLevel, AsyncSession, Chuẩn hoá output AI trước khi lưu — không tin bất kỳ trường nào của nó. Cùng…, Chạy toàn bộ SOP-AI-002 cho một change request và trả về ImpactReport. KHÔNG…, run_impact_analysis(), _validate_ai_output(), change_request() (+13 more)

### Community 30 - "wbs.py"
Cohesion: 0.06
Nodes (61): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+53 more)

### Community 31 - "AuthService"
Cohesion: 0.10
Nodes (15): is_revoked(), _key(), Đánh dấu `jti` không dùng được nữa. Trả về False nếu không kết nối được tới…, `jti` đã bị thu hồi hay chưa. False khi không kết nối được tới store — xem ghi…, revoke(), AuthService, get_auth_service(), AsyncSession (+7 more)

### Community 32 - "User"
Cohesion: 0.06
Nodes (37): AIJobResponse, DependencyType, str, EpicStatus, str, MilestoneStatus, str, PhaseStatus (+29 more)

### Community 33 - "getApiErrorMessage"
Cohesion: 0.07
Nodes (40): AuthLayout(), OAuthCallbackContent(), VerificationState, VerifyEmailContent(), verify(), AdminLayout(), TABS, DashboardPage() (+32 more)

### Community 34 - "as_user"
Cohesion: 0.08
Nodes (39): AsyncClient, as_user(), client(), _disable_rate_limiting(), event_loop(), AsyncSession, fixture, Role (+31 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (29): description, name, overrides, postcss, private, version, autoprefixer, axios (+21 more)

### Community 36 - "tasks.py"
Cohesion: 0.16
Nodes (23): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+15 more)

### Community 37 - "schemas/task.py"
Cohesion: 0.11
Nodes (28): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+20 more)

### Community 38 - "ResourceService"
Cohesion: 0.07
Nodes (39): Assignment, set_current_project_id(), AIRequest, Project, Worklog, get_resource_service(), AsyncSession, date (+31 more)

### Community 39 - "AdminUserService"
Cohesion: 0.17
Nodes (27): AdminUserCreate, AdminUserUpdate, AdminUserService, AsyncSession, User, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db() (+19 more)

### Community 40 - "AIService"
Cohesion: 0.26
Nodes (17): AIRequestStatus, AIRequestType, str, AIService, AsyncSession, Khung chung cho 4 job AI ở dưới (impact/schedule/resource/risk) — cùng vòng đời…, _run_ai_job(), ai_request() (+9 more)

### Community 41 - "ForbiddenException"
Cohesion: 0.05
Nodes (66): _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,… (+58 more)

### Community 42 - "BadRequestException"
Cohesion: 0.07
Nodes (26): BadRequestException, ServiceUnavailableException, TooManyRequestsException, UnauthorizedException, code_challenge_for(), new_code_verifier(), Code verifier cho PKCE (RFC 7636) — 43..128 ký tự unreserved., Challenge S256 tương ứng với `verifier`. (+18 more)

### Community 43 - "run_risk_analysis"
Cohesion: 0.21
Nodes (21): str, RiskLevel, _level_from_score(), _normalize_level(), Chạy một lượt phân tích rủi ro đầy đủ và trả về bản ghi `RiskReport` mới. Không…, run_risk_analysis(), fake_db(), project() (+13 more)

### Community 44 - "timedelta"
Cohesion: 0.17
Nodes (22): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+14 more)

### Community 45 - "main.py"
Cohesion: 0.09
Nodes (30): set_request_id(), close_redis(), get_redis_pubsub(), Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ…, Client riêng cho `pubsub.listen()` trong ws_manager.py. Không được dùng chung…, get_client_ip(), Request, Context theo từng request mà code ở tầng service cần nhưng không được truyền… (+22 more)

### Community 46 - "project_service.py"
Cohesion: 0.17
Nodes (21): ProjectMethodology, ProjectStatus, str, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectCreate (+13 more)

### Community 47 - "test_route_exposure.py"
Cohesion: 0.16
Nodes (14): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+6 more)

### Community 48 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "get_redis"
Cohesion: 0.14
Nodes (19): issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), get_redis(), health_check() (+11 more)

### Community 50 - "api.ts"
Cohesion: 0.09
Nodes (33): EmailVerificationBannerProps, AvatarSection(), AvatarSectionProps, resolveAvatarUrl(), LinkedAccountsSection(), LinkedAccountsSectionProps, providers, fields (+25 more)

### Community 51 - "dashboard.py"
Cohesion: 0.17
Nodes (17): ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, ProjectDashboardStats, ProjectStats, BaseModel (+9 more)

### Community 52 - "Task"
Cohesion: 0.11
Nodes (20): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Subtask, Task, AsyncSession, TaskRepository, _index_names(), Hình dạng schema và truy vấn — những thứ hỏng âm thầm, không gây lỗi. Không lỗi… (+12 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.29
Nodes (19): avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object() (+11 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "oauth.py"
Cohesion: 0.15
Nodes (26): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+18 more)

### Community 57 - "wrap_user_input"
Cohesion: 0.18
Nodes (18): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và…, Parse một response của model mà lẽ ra phải là một JSON object duy nhất. Chấp… (+10 more)

### Community 58 - "rate_limit.py"
Cohesion: 0.11
Nodes (19): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+11 more)

### Community 59 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 60 - "ProjectService"
Cohesion: 0.18
Nodes (8): ProjectMemberResponse, get_project_service(), ProjectService, AsyncSession, Depends, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…, ProjectCapabilities

### Community 61 - "Thiết kế kiến trúc hệ thống"
Cohesion: 0.13
Nodes (15): Celery Beat và tác vụ theo lịch, Change History, Cấu trúc thư mục phía máy chủ thực tế, ERD tổng quan, Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI, Infrastructure Layer (Docker Compose — 7 Services), Kiến trúc phía giao diện, Kiến trúc phía máy chủ (+7 more)

### Community 62 - "test_phase2_task_wbs.py"
Cohesion: 0.22
Nodes (17): TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, asyncio, test_change_status_notifies_team_on_transition(), test_change_status_skips_notification_when_status_unchanged() (+9 more)

### Community 63 - "Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI"
Cohesion: 0.10
Nodes (20): 10. Đặc tả API và các điểm cuối WebSocket, 12. Cấu hình & Biến môi trường, 13. Quy tắc phát triển, 14. Lộ trình phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. Giấy phép và người đóng góp, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS) (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.12
Nodes (18): frontend_src_app_globals, metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status() (+10 more)

### Community 65 - "Epic"
Cohesion: 0.21
Nodes (15): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+7 more)

### Community 66 - "PortfolioRepository"
Cohesion: 0.10
Nodes (9): BaseRepository, Any, AsyncSession, PortfolioRepository, AsyncSession, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., AsyncSession (+1 more)

### Community 67 - "worklogs.py"
Cohesion: 0.17
Nodes (21): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+13 more)

### Community 68 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 69 - "TaskStatus"
Cohesion: 0.16
Nodes (21): str, TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong. (+13 more)

### Community 70 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Xác minh & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 71 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 72 - "Đặc tả yêu cầu phần mềm (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Ngăn xếp công nghệ), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (Kiến trúc hệ thống), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 73 - "generate_project"
Cohesion: 0.17
Nodes (17): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends, get, post (+9 more)

### Community 74 - "test_dashboard_activity_scope.py"
Cohesion: 0.18
Nodes (13): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới., test_audit_log_is_indexed_for_the_activity_feed() (+5 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "list_portfolios"
Cohesion: 0.16
Nodes (17): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+9 more)

### Community 78 - "ChatService"
Cohesion: 0.09
Nodes (36): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+28 more)

### Community 79 - "test_ws_hardening.py"
Cohesion: 0.08
Nodes (38): authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), Xác thực và giám sát vòng đời cho các WebSocket endpoint. Handshake trình ra…, Ném ra khi một kết nối WebSocket không qua được kiểm tra hợp lệ. Bên gọi nên…, Phân giải một vé handshake thành một User đang active. Dùng session DB riêng,…, Watchdog: đóng `websocket` khi nó không còn được phép mở. Chạy song song với…, _redeem() (+30 more)

### Community 80 - "3. Yêu cầu chức năng (Yêu cầu chức năng)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Tài liệu và báo cáo (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 81 - "scheduling_service.py"
Cohesion: 0.22
Nodes (11): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), Depends, Truy vấn chỉ đọc trên lịch trình đã được tính ra. Bản thân việc tính toán chạy…, SchedulingService (+3 more)

### Community 82 - "test_dashboard_metrics.py"
Cohesion: 0.24
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.14
Nodes (30): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+22 more)

### Community 85 - "env.py"
Cohesion: 0.11
Nodes (19): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+11 more)

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

### Community 91 - "skills.py"
Cohesion: 0.14
Nodes (14): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, post, put (+6 more)

### Community 92 - "system.py"
Cohesion: 0.14
Nodes (14): create_system(), delete_system(), get_system(), list_system(), delete, get, post, put (+6 more)

### Community 93 - "user_service.py"
Cohesion: 0.08
Nodes (15): AsyncSession, UserRepository, get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, get_user_service(), AsyncSession, Depends (+7 more)

### Community 94 - "ProjectRepository"
Cohesion: 0.13
Nodes (4): ProjectRepository, AsyncSession, date, datetime

### Community 95 - "dashboards.py"
Cohesion: 0.23
Nodes (12): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số… (+4 more)

### Community 96 - "Tài liệu yêu cầu nghiệp vụ (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Mục tiêu kinh doanh), 1. Tổng quan dự án (Tổng quan dự án), 2.1 Các tính năng trong phạm vi (Trong phạm vi), 2.2 Ngoài phạm vi (Ngoài phạm vi), 2. Phạm vi dự án (Phạm vi dự án), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), Hệ thống Lập kế hoạch Dự án và Quản lý Danh mục bằng AI (+1 more)

### Community 97 - "test_oauth_account_takeover.py"
Cohesion: 0.28
Nodes (12): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through() (+4 more)

### Community 98 - "endpoints/ai.py"
Cohesion: 0.38
Nodes (8): AIResultResponse, AIGenerateProjectRequest, AIImpactAnalysisRequest, AIResourceRecommendationRequest, AIResultResponse, AIRiskAnalysisRequest, AIScheduleOptimizeRequest, BaseModel

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "list_permissions"
Cohesion: 0.40
Nodes (5): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…

### Community 101 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Task 1: Change Request CRUD tối giản, Task 2: Phân tích tác động bằng AI (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Phân tích rủi ro (SOP-AI-005) — song song, sau Task 1, Task 6: Wiring — nối 4 trụ cột vào hệ thống chung (tuần tự, tôi tự làm), Todo: Phase 3 (AI Features) — 4 trụ cột còn lại, Điểm kiểm tra: Hoàn chỉnh (+2 more)

### Community 102 - "config.ts"
Cohesion: 0.39
Nodes (6): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES, ref_next_headers

### Community 103 - "useAIGenerator.ts"
Cohesion: 0.36
Nodes (6): aiJobKeys, IN_PROGRESS, aiService, AIJobResponse, AIJobStatus, AIResultResponse

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI điểm cuối sinh dự án bằng AI và giao diện (SOP-AI-001), GIAI ĐOẠN 3.3 – Phân tích tác động bằng AI (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 106 - "celery_app.py"
Cohesion: 0.20
Nodes (9): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx, celery (+1 more)

### Community 107 - "middleware.ts"
Cohesion: 0.33
Nodes (4): AUTH_ROUTES, config, PROTECTED_PREFIXES, ref_next_server

### Community 108 - "Kế hoạch deploy môi trường thử nghiệm lên Oracle Cloud Always Free"
Cohesion: 0.18
Nodes (10): Bối cảnh và lý do chọn phương án này, Giai đoạn 1: Tạo VM trên Oracle Cloud, Giai đoạn 2: Cài đặt môi trường trên VM, Giai đoạn 3: Đưa mã nguồn lên VM, Giai đoạn 4: Build và chạy stack, Giai đoạn 5: Kiểm tra vận hành, Kế hoạch deploy môi trường thử nghiệm lên Oracle Cloud Always Free, Rủi ro và giới hạn đã biết (+2 more)

### Community 109 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 110 - "list_audit_logs"
Cohesion: 0.25
Nodes (8): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query

### Community 111 - "DashboardService"
Cohesion: 0.14
Nodes (14): ActiveProjectSummary, PortfolioHealthResponse, PortfolioProjectHealth, Dữ liệu phản hồi cho GET /dashboards/portfolios/{portfolio_id}/health, DashboardService, _iso_week_bounds(), AsyncSession, date (+6 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 114 - "pytest"
Cohesion: 0.20
Nodes (10): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+2 more)

### Community 115 - "login/page.tsx"
Cohesion: 0.17
Nodes (6): metadata, LoginPageProps, metadata, metadata, next, ref_next_intl_server

### Community 116 - "types"
Cohesion: 0.53
Nodes (5): build_db(), asyncio, test_list_maps_rows_with_actor(), test_list_returns_empty_page(), types

### Community 117 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 118 - "vitest.config.mts"
Cohesion: 0.50
Nodes (3): ref_node_url, @vitejs/plugin-react, ref_vitest_config

### Community 119 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 120 - "endpoints/dependencies.py"
Cohesion: 0.27
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 121 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 123 - "Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.13
Nodes (14): 4 trụ cột (song song, sau Task 1), Câu hỏi còn mở, Danh sách công việc, Kiến trúc mới, Kiến trúc tái sử dụng (đã có sẵn, không cần sửa), Kế hoạch triển khai: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm) (+6 more)

### Community 125 - "BaseAIProvider"
Cohesion: 0.33
Nodes (4): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider.

### Community 126 - "chat_ws"
Cohesion: 0.29
Nodes (5): chat_ws(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket.

### Community 128 - "Kết quả rà soát"
Cohesion: 0.29
Nodes (6): Chat dự án và thông báo WebSocket thời gian thực (hoàn thành 100%), Các model chính, Kiến trúc phía giao diện và chất lượng, Kiến trúc phía máy chủ (đã xác minh và kiểm thử), Kết quả rà soát, Tính năng quản trị và RBAC (hoàn thành 100%)

### Community 145 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Phía máy chủ (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Phía giao diện (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 150 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Lộ trình](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-18)

### Community 154 - "7. Hệ thống phân quyền (RBAC) & Quản trị Admin"
Cohesion: 0.67
Nodes (3): 7. Hệ thống phân quyền (RBAC) & Quản trị Admin, 7 Roles hệ thống, Quản trị Admin Panel (Phía giao diện `/admin`)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 161 - "risk_analyzer.py"
Cohesion: 0.05
Nodes (56): Assignment, ChangeRequest, Dependency, Leave, LeaveStatus, LeaveType, str, _build_prompt() (+48 more)

### Community 163 - "test_auth_password_recovery.py"
Cohesion: 0.24
Nodes (17): verify_password(), build_request(), build_service(), extract_token(), asyncio, parametrize, Request, ASGI scope tối thiểu — decorator rate-limit trên endpoint cần một Request thật… (+9 more)

### Community 164 - "ValueError"
Cohesion: 0.05
Nodes (64): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, field_validator, model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, model_validator, backward_pass() (+56 more)

### Community 165 - "3. Ngăn xếp công nghệ"
Cohesion: 0.50
Nodes (4): 3. Ngăn xếp công nghệ, Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`), Phía giao diện (Next.js / React / TypeScript), Phía máy chủ (Python)

## Knowledge Gaps
- **384 isolated node(s):** `Bối cảnh và lý do chọn phương án này`, `Điều kiện tiên quyết`, `Giai đoạn 1: Tạo VM trên Oracle Cloud`, `Giai đoạn 2: Cài đặt môi trường trên VM`, `Giai đoạn 3: Đưa mã nguồn lên VM` (+379 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1199 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `RoleService`, `PortfolioService`, `ai_tasks.py`, `TaskService`, `users.py`, `auth_service.py`, `wbs.py`, `AuthService`, `risk_analyzer.py`, `as_user`, `ResourceService`, `AdminUserService`, `AIService`, `ForbiddenException`, `BadRequestException`, `timedelta`, `project_service.py`, `list_projects`, `dashboard.py`, `ProjectService`, `generate_project`, `list_portfolios`, `ChatService`, `test_ws_hardening.py`, `scheduling_service.py`, `test_change_request_service.py`, `env.py`, `user_service.py`, `ProjectRepository`, `test_oauth_account_takeover.py`, `endpoints/ai.py`, `list_permissions`, `list_audit_logs`, `DashboardService`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `Task` connect `Task` to `User`, `risk_analyzer.py`, `db/base.py`, `as_user`, `ResourceService`, `AIService`, `ForbiddenException`, `run_risk_analysis`, `DashboardService`, `test_schedule_optimizer.py`, `scheduling_service.py`, `TaskService`, `NotificationService`, `test_resource_recommender.py`, `run_impact_analysis`, `ProjectRepository`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `AuthService` connect `AuthService` to `User`, `endpoints/auth.py`, `test_auth_password_recovery.py`, `ForbiddenException`, `BadRequestException`, `timedelta`, `test_user_profile_settings.py`, `test_login_lockout.py`, `auth_service.py`, `user_service.py`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Bối cảnh và lý do chọn phương án này`, `Điều kiện tiên quyết`, `Giai đoạn 1: Tạo VM trên Oracle Cloud` to the rest of the system?**
  _384 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ChatPanel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08771929824561403 - nodes in this community are weakly interconnected._
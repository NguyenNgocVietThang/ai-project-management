# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2886 nodes · 8264 edges · 145 communities (112 shown, 4 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 654 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1e21fcba`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- tasks/page.tsx
- Button.tsx
- db/base.py
- endpoints/auth.py
- profile/page.tsx
- FastAPI
- portfolio_service.py
- users/page.tsx
- TaskStatus
- test_cpm_scheduling.py
- task_service.py
- get_redis
- ForbiddenException
- projects/page.tsx
- User
- WBSService
- wbs_service.py
- useTasks.ts
- react
- users.py
- NotificationService
- getApiErrorMessage
- Task
- hash_password
- dashboard.types.ts
- PaginatedResponse
- ai_tasks.py
- compilerOptions
- config.py
- ValueError
- auth_service.py
- user_service.py
- TaskService
- test_ws_hardening.py
- as_user
- package.json
- dashboard_service.py
- AdminUserService
- Project
- admin.py
- AuthService
- list_projects
- BadRequestException
- ProjectService
- timedelta
- ProjectRepository
- endpoints/chat.py
- TaskServiceDep
- test_auth_password_recovery.py
- parse_json_object
- ChatPanel.tsx
- oauth_service.py
- email_tasks.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- .get_user_summary
- get_critical_path
- ConnectionManager
- RoleService
- ChatService
- scheduling_service.py
- list_notifications
- ws_tickets.py
- ThemeProvider.tsx
- endpoints/ai.py
- logging_config.py
- ResourceServiceDep
- oauth.py
- WBSServiceDep
- test_route_exposure.py
- ErrorState
- project_service.py
- sprints.py
- test_dashboard_activity_scope.py
- test_resource_warnings.py
- test_dashboard_metrics.py
- test_portfolio_project_core.py
- test_oauth_account_takeover.py
- test_token_revocation.py
- vitest
- my_assignments
- create_epic
- approvals.py
- change_requests.py
- dashboards.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- skills.py
- system.py
- Settings
- token_revocation.py
- LanguageToggle.tsx
- ProjectCreate
- StorageService
- test_rate_limit.py
- next.config.js
- chat_ws
- .__init__
- rate_limit_exceeded_handler
- celery_app.py
- scripts
- list_permissions
- forgot-password/page.tsx
- middleware.ts
- schemas/gantt.py
- get_dashboard_service
- get_wbs_service
- sanitize_message
- playwright
- .eslintrc.json
- tailwind.config.ts
- next-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `User` - 207 edges
2. `ForbiddenException` - 73 edges
3. `WBSService` - 68 edges
4. `Base` - 68 edges
5. `TaskService` - 66 edges
6. `BadRequestException` - 61 edges
7. `NotFoundException` - 54 edges
8. `ProjectService` - 53 edges
9. `react` - 48 edges
10. `ConflictException` - 47 edges

## Surprising Connections (you probably didn't know these)
- `test_audit_log_is_indexed_for_the_activity_feed()` --uses--> `AuditLog`  [INFERRED]
  backend/tests/unit/test_dashboard_activity_scope.py → backend/app/models/audit_log.py
- `create_assignment()` --uses--> `AssignmentCreate`  [INFERRED]
  backend/app/api/v1/endpoints/assignments.py → backend/app/schemas/task.py
- `ResourceService` --uses--> `AssignmentCreate`  [INFERRED]
  backend/app/services/resource_service.py → backend/app/schemas/task.py
- `ResourceService` --uses--> `AssignmentMutationResponse`  [INFERRED]
  backend/app/services/resource_service.py → backend/app/schemas/task.py
- `ResourceService` --uses--> `AssignmentResponse`  [INFERRED]
  backend/app/services/resource_service.py → backend/app/schemas/task.py

## Import Cycles
- None detected.

## Communities (145 total, 4 thin omitted)

### Community 0 - "tasks/page.tsx"
Cohesion: 0.04
Nodes (70): DashboardPage(), greeting(), ProjectChatPage(), ProjectLayout(), ProjectOverviewCharts, ProjectOverviewPage(), KanbanColumn(), SprintView() (+62 more)

### Community 1 - "Button.tsx"
Cohesion: 0.05
Nodes (63): LoginPageProps, metadata, OAuthCallbackContent(), ProjectSettingsPage(), MiniProgressBar(), MiniProgressBarProps, Alert(), AlertProps (+55 more)

### Community 2 - "db/base.py"
Cohesion: 0.06
Nodes (37): AIOutput, Approval, ApprovalStatus, str, AuditLog, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChangeRequest (+29 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.06
Nodes (70): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+62 more)

### Community 4 - "profile/page.tsx"
Cohesion: 0.06
Nodes (51): AuthLayout(), VerificationState, AdminLayout(), TABS, DashboardLayout(), ProfilePageContent(), FullPageSpinner(), EmailVerificationBanner() (+43 more)

### Community 5 - "FastAPI"
Cohesion: 0.07
Nodes (42): AsyncClient, Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), get_db(), AsyncSession, FastAPI dependency: trả về (yield) một async DB session. (+34 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.07
Nodes (36): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+28 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.08
Nodes (42): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, adminRoleKeys, permissionKeys, useAdminRoles() (+34 more)

### Community 8 - "TaskStatus"
Cohesion: 0.09
Nodes (44): NotificationType, str, str, TaskStatus, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, _apply_status_side_effects() (+36 more)

### Community 9 - "test_cpm_scheduling.py"
Cohesion: 0.09
Nodes (47): backward_pass(), build_graph(), compute_cpm(), compute_cpm_for_project(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor() (+39 more)

### Community 10 - "task_service.py"
Cohesion: 0.12
Nodes (36): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask(), patch, update_worklog() (+28 more)

### Community 11 - "get_redis"
Cohesion: 0.07
Nodes (42): set_request_id(), issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), close_redis() (+34 more)

### Community 12 - "ForbiddenException"
Cohesion: 0.10
Nodes (15): Assignment, ConflictException, ForbiddenException, NotFoundException, get_task_context(), AsyncSession, date, Cac assignment cua nguoi dung hien tai, moi nhat truoc. Co gioi han: danh sach… (+7 more)

### Community 13 - "projects/page.tsx"
Cohesion: 0.11
Nodes (37): ProjectMembersPage(), ProjectsPage(), portfolioKeys, usePortfolios(), InviteMemberDialog(), ProjectMembersTable(), InitialProjectMember, ProjectWizard() (+29 more)

### Community 14 - "User"
Cohesion: 0.07
Nodes (17): get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, MilestoneStatus, str, User (+9 more)

### Community 15 - "WBSService"
Cohesion: 0.11
Nodes (17): EpicStatus, str, PhaseStatus, str, str, SprintStatus, add_audit(), get_project_context() (+9 more)

### Community 16 - "wbs_service.py"
Cohesion: 0.12
Nodes (36): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+28 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (34): taskKeys, useInvalidate(), wbsKeys, taskService, wbsService, UserSummary, Assignment, AssignmentCreate (+26 more)

### Community 18 - "react"
Cohesion: 0.11
Nodes (28): NotificationsPage(), LINKS, MainNav(), MobileNav(), useVisibleLinks(), useTheme(), OPTIONS, ThemeToggle() (+20 more)

### Community 19 - "users.py"
Cohesion: 0.12
Nodes (36): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+28 more)

### Community 20 - "NotificationService"
Cohesion: 0.12
Nodes (23): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, publish(), Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, Notification, MarkReadResponse, NotificationListResponse, NotificationResponse, BaseModel (+15 more)

### Community 21 - "getApiErrorMessage"
Cohesion: 0.14
Nodes (27): VerifyEmailContent(), verify(), PortfolioDetailPage(), PortfoliosPage(), usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCardProps, PortfolioForm() (+19 more)

### Community 22 - "Task"
Cohesion: 0.09
Nodes (22): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Epic, Subtask, Task, AsyncSession, TaskRepository, Người dùng có được giao task này không. Ưu tiên collection `assignments` đã nạp… (+14 more)

### Community 23 - "hash_password"
Cohesion: 0.10
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "dashboard.types.ts"
Cohesion: 0.08
Nodes (24): BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, ActiveProjectsGridProps, RecentActivityFeedProps (+16 more)

### Community 25 - "PaginatedResponse"
Cohesion: 0.10
Nodes (25): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+17 more)

### Community 26 - "ai_tasks.py"
Cohesion: 0.08
Nodes (29): AITaskType, model_routing_table(), str, Các loại tác vụ AI trong hệ thống, tương ứng các SOP trong roadmap AI., Trả về tên model xKiro (dạng "vendor/model") được cấu hình cho một loại tác vụ., Trả về toàn bộ bảng định tuyến task -> model hiện hành, dùng để log/kiểm tra., resolve_model(), generate_project_from_prompt() (+21 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "config.py"
Cohesion: 0.11
Nodes (14): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., GeminiProvider, Any, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm…, OpenAIProvider (+6 more)

### Community 29 - "ValueError"
Cohesion: 0.09
Nodes (13): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator, field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate. (+5 more)

### Community 30 - "auth_service.py"
Cohesion: 0.13
Nodes (26): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+18 more)

### Community 31 - "user_service.py"
Cohesion: 0.14
Nodes (17): ServiceUnavailableException, UnauthorizedException, ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, BaseModel, field_validator, UserBase (+9 more)

### Community 32 - "TaskService"
Cohesion: 0.12
Nodes (17): Assignment, DependencyType, str, str, SubtaskStatus, TaskPriority, Tính lại đường găng, tiến độ dự án và số liệu sprint. Đây là thao tác toàn dự…, recalculate_project() (+9 more)

### Community 33 - "test_ws_hardening.py"
Cohesion: 0.13
Nodes (22): authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), Xác thực và giám sát vòng đời cho các WebSocket endpoint. Handshake trình ra…, Ném ra khi một kết nối WebSocket không qua được kiểm tra hợp lệ. Bên gọi nên…, Phân giải một vé handshake thành một User đang active. Dùng session DB riêng,…, Watchdog: đóng `websocket` khi nó không còn được phép mở. Chạy song song với…, WSAuthError (+14 more)

### Community 34 - "as_user"
Cohesion: 0.13
Nodes (27): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+19 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (27): description, name, overrides, postcss, private, version, autoprefixer, clsx (+19 more)

### Community 36 - "dashboard_service.py"
Cohesion: 0.18
Nodes (24): ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth, ProjectDashboardStats (+16 more)

### Community 37 - "AdminUserService"
Cohesion: 0.27
Nodes (25): AdminUserCreate, AdminUserUpdate, AdminUserService, AsyncSession, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user(), asyncio (+17 more)

### Community 38 - "Project"
Cohesion: 0.10
Nodes (11): Portfolio, Project, BaseRepository, Any, AsyncSession, datetime, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`. (+3 more)

### Community 39 - "admin.py"
Cohesion: 0.12
Nodes (24): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+16 more)

### Community 40 - "AuthService"
Cohesion: 0.13
Nodes (11): TooManyRequestsException, AuthService, get_auth_service(), AsyncSession, datetime, Depends, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái… (+3 more)

### Community 41 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 42 - "BadRequestException"
Cohesion: 0.18
Nodes (10): BadRequestException, Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, OAuthService, OAuthState, Any, User, Phân giải identity của provider thành một User. `email_provider_verified` là… (+2 more)

### Community 43 - "ProjectService"
Cohesion: 0.18
Nodes (8): ProjectMemberResponse, get_project_service(), ProjectService, AsyncSession, Depends, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…, ProjectCapabilities

### Community 44 - "timedelta"
Cohesion: 0.17
Nodes (22): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+14 more)

### Community 45 - "ProjectRepository"
Cohesion: 0.13
Nodes (7): ProjectMethodology, ProjectStatus, str, ProjectRepository, AsyncSession, date, date

### Community 46 - "endpoints/chat.py"
Cohesion: 0.16
Nodes (20): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+12 more)

### Community 47 - "TaskServiceDep"
Cohesion: 0.14
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 48 - "test_auth_password_recovery.py"
Cohesion: 0.21
Nodes (20): verify_password(), RegisterRequest, ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize (+12 more)

### Community 49 - "parse_json_object"
Cohesion: 0.17
Nodes (19): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+11 more)

### Community 50 - "ChatPanel.tsx"
Cohesion: 0.20
Nodes (16): ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory(), useMarkChatRead() (+8 more)

### Community 51 - "oauth_service.py"
Cohesion: 0.14
Nodes (17): code_challenge_for(), consume(), issue(), _key(), new_code_verifier(), Any, Store phía server cho tham số `state` của OAuth, kèm ràng buộc theo trình duyệt…, Thuộc tính cho cookie ràng buộc luồng OAuth với trình duyệt. `lax` chứ không… (+9 more)

### Community 52 - "email_tasks.py"
Cohesion: 0.19
Nodes (14): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task(), send_password_reset_email_task() (+6 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.29
Nodes (19): avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object() (+11 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - ".get_user_summary"
Cohesion: 0.12
Nodes (11): ActiveProjectSummary, _iso_week_bounds(), date, Trả về danh sách ID dự án mà người dùng này nhìn thấy được., Trả về (thứ hai, chủ nhật) của tuần ISO chứa *today*., Burndown 14 ngày đơn giản: còn lại = tổng - số task đã hoàn thành cộng dồn., BurndownPoint, MyTaskItem (+3 more)

### Community 57 - "get_critical_path"
Cohesion: 0.10
Nodes (19): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, create_dependency(), delete_dependency(), list_dependencies(), CurrentUser (+11 more)

### Community 58 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 59 - "RoleService"
Cohesion: 0.29
Nodes (14): RoleUpdate, AsyncSession, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db(), build_role(), asyncio (+6 more)

### Community 60 - "ChatService"
Cohesion: 0.25
Nodes (14): ChatService, AsyncSession, build_actor(), build_message(), asyncio, test_create_message_persists_and_publishes(), test_history_no_more_pages_when_under_limit(), test_history_rejects_non_member() (+6 more)

### Community 61 - "scheduling_service.py"
Cohesion: 0.20
Nodes (13): Worklog, CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), AsyncSession, Depends (+5 more)

### Community 62 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

### Community 63 - "ws_tickets.py"
Cohesion: 0.15
Nodes (14): _redeem(), issue(), _key(), Any, Vé dùng một lần cho WebSocket handshake. Trình duyệt không đặt được header tuỳ…, Cấp một vé cho `user_id`. Ném lỗi nếu không kết nối được tới store., Trả về payload của vé rồi vô hiệu hoá nó, hoặc None nếu không dùng được. Đọc-…, redeem() (+6 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.17
Nodes (12): metadata, viewport, Providers(), apply(), systemPrefersDark(), ThemeContext, ThemeContextValue, themeInitScript (+4 more)

### Community 65 - "endpoints/ai.py"
Cohesion: 0.19
Nodes (15): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, Depends, get, post, SOP-AI-001: Xếp hàng sinh một dự án (Phases + Tasks + Dependencies) từ prompt.… (+7 more)

### Community 66 - "logging_config.py"
Cohesion: 0.16
Nodes (12): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+4 more)

### Community 67 - "ResourceServiceDep"
Cohesion: 0.18
Nodes (17): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+9 more)

### Community 68 - "oauth.py"
Cohesion: 0.32
Nodes (15): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+7 more)

### Community 69 - "WBSServiceDep"
Cohesion: 0.19
Nodes (16): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+8 more)

### Community 70 - "test_route_exposure.py"
Cohesion: 0.16
Nodes (14): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+6 more)

### Community 71 - "ErrorState"
Cohesion: 0.20
Nodes (12): AdminAuditPage(), ErrorState(), AuditLogFilters(), ACTION_CLASSES, actionBadgeClass(), AuditLogTable(), formatTimestamp(), auditLogKeys (+4 more)

### Community 72 - "project_service.py"
Cohesion: 0.39
Nodes (12): AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberRoleUpdate, ProjectResponse (+4 more)

### Community 73 - "sprints.py"
Cohesion: 0.27
Nodes (14): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+6 more)

### Community 74 - "test_dashboard_activity_scope.py"
Cohesion: 0.17
Nodes (14): get_current_project_id(), Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy…, Không có cột này thì không thể lọc audit theo dự án ở bất cứ đâu., Bảo vệ trước lỗi gõ nhầm tên cột trong mệnh đề lọc mới. (+6 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "test_dashboard_metrics.py"
Cohesion: 0.24
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 77 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

### Community 78 - "test_oauth_account_takeover.py"
Cohesion: 0.28
Nodes (12): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through() (+4 more)

### Community 79 - "test_token_revocation.py"
Cohesion: 0.35
Nodes (12): build_db(), build_service(), build_user(), asyncio, Xoay vòng refresh token, phát hiện tái sử dụng, và thu hồi khi logout (Phase…, Hai bên cùng giữ một token nghĩa là nó đã bị lộ — hủy tất cả session, không chỉ…, Một access token gửi tới /logout không được coi là refresh token., test_logout_ignores_a_token_of_the_wrong_type() (+4 more)

### Community 80 - "vitest"
Cohesion: 0.17
Nodes (3): FakeSocket, @testing-library/react, vitest

### Community 81 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 82 - "create_epic"
Cohesion: 0.23
Nodes (12): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+4 more)

### Community 83 - "approvals.py"
Cohesion: 0.20
Nodes (10): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+2 more)

### Community 84 - "change_requests.py"
Cohesion: 0.20
Nodes (10): create_change_requests(), delete_change_requests(), get_change_requests(), list_change_requests(), delete, get, post, put (+2 more)

### Community 85 - "dashboards.py"
Cohesion: 0.29
Nodes (10): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số… (+2 more)

### Community 86 - "documents.py"
Cohesion: 0.20
Nodes (10): create_documents(), delete_documents(), get_documents(), list_documents(), delete, get, post, put (+2 more)

### Community 87 - "endpoints/gantt.py"
Cohesion: 0.20
Nodes (10): create_gantt(), delete_gantt(), get_gantt(), list_gantt(), delete, get, post, put (+2 more)

### Community 88 - "leaves.py"
Cohesion: 0.20
Nodes (10): # TODO: Cài đặt hàm xóa, create_leaves(), delete_leaves(), get_leaves(), list_leaves(), delete, get, post (+2 more)

### Community 89 - "project_versions.py"
Cohesion: 0.20
Nodes (10): create_project_versions(), delete_project_versions(), get_project_versions(), list_project_versions(), delete, get, post, put (+2 more)

### Community 90 - "reports.py"
Cohesion: 0.20
Nodes (10): create_reports(), delete_reports(), get_reports(), list_reports(), delete, get, post, put (+2 more)

### Community 91 - "skills.py"
Cohesion: 0.20
Nodes (10): create_skills(), delete_skills(), get_skills(), list_skills(), delete, get, post, put (+2 more)

### Community 92 - "system.py"
Cohesion: 0.20
Nodes (10): # TODO: Cài đặt hàm get theo id, create_system(), delete_system(), get_system(), list_system(), delete, get, post (+2 more)

### Community 93 - "Settings"
Cohesion: 0.25
Nodes (10): Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once() (+2 more)

### Community 94 - "token_revocation.py"
Cohesion: 0.25
Nodes (9): is_revoked(), _key(), Danh sách thu hồi refresh-token, được hỗ trợ bởi Redis. JWT là tự chứa: một khi…, Số giây mà tombstone phải tồn tại lâu hơn, suy ra từ chính `exp` của token.…, Đánh dấu `jti` không dùng được nữa. Trả về False nếu không kết nối được tới…, `jti` đã bị thu hồi hay chưa. False khi không kết nối được tới store — xem ghi…, revoke(), _ttl_seconds() (+1 more)

### Community 95 - "LanguageToggle.tsx"
Cohesion: 0.36
Nodes (7): LanguageToggle(), setLocale(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

### Community 96 - "ProjectCreate"
Cohesion: 0.29
Nodes (4): ProjectCreate, ProjectUpdate, field_validator, test_portfolio_and_project_schema_validation()

### Community 97 - "StorageService"
Cohesion: 0.24
Nodes (4): get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, Minio

### Community 98 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 99 - "next.config.js"
Cohesion: 0.20
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "chat_ws"
Cohesion: 0.22
Nodes (7): chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…

### Community 102 - "rate_limit_exceeded_handler"
Cohesion: 0.28
Nodes (9): client_key(), Request, Response, rate_limit_exceeded_handler(), Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố…, _retry_after_seconds() (+1 more)

### Community 103 - "celery_app.py"
Cohesion: 0.25
Nodes (6): generate_docx_task(), generate_xlsx_task(), Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "list_permissions"
Cohesion: 0.29
Nodes (7): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles()

### Community 106 - "forgot-password/page.tsx"
Cohesion: 0.29
Nodes (3): metadata, metadata, next

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 109 - "get_dashboard_service"
Cohesion: 0.50
Nodes (3): get_dashboard_service(), AsyncSession, Depends

### Community 110 - "get_wbs_service"
Cohesion: 0.50
Nodes (3): get_wbs_service(), AsyncSession, Depends

### Community 111 - "sanitize_message"
Cohesion: 0.50
Nodes (3): Làm sạch nội dung do người dùng nhập trước khi lưu. Tin nhắn chat trước đây…, Chuẩn hoá một tin nhắn chat do người dùng gửi. Cố tình KHÔNG escape HTML: nội…, sanitize_message()

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

## Knowledge Gaps
- **190 isolated node(s):** `ViewMode`, `Editor`, `ApiErrorBody`, `ApiFieldError`, `LoginPageProps` (+185 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 874 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `FastAPI`, `portfolio_service.py`, `task_service.py`, `ForbiddenException`, `WBSService`, `wbs_service.py`, `users.py`, `PaginatedResponse`, `ai_tasks.py`, `auth_service.py`, `user_service.py`, `TaskService`, `test_ws_hardening.py`, `as_user`, `dashboard_service.py`, `AdminUserService`, `Project`, `AuthService`, `list_projects`, `BadRequestException`, `ProjectService`, `timedelta`, `ProjectRepository`, `oauth_service.py`, `.get_user_summary`, `RoleService`, `ChatService`, `scheduling_service.py`, `endpoints/ai.py`, `project_service.py`, `test_oauth_account_takeover.py`, `list_permissions`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `DashboardService` connect `dashboard_service.py` to `TaskService`, `db/base.py`, `Project`, `TaskStatus`, `test_dashboard_activity_scope.py`, `ForbiddenException`, `ProjectRepository`, `User`, `get_dashboard_service`, `test_dashboard_metrics.py`, `Task`, `.get_user_summary`, `scheduling_service.py`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `as_user()` connect `as_user` to `FastAPI`, `User`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 48 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 48 INFERRED edges - model-reasoned connections that need verification._
- **Are the 14 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 37 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 37 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ViewMode`, `Editor`, `ApiErrorBody` to the rest of the system?**
  _190 weakly-connected nodes found - possible documentation gaps or missing edges._
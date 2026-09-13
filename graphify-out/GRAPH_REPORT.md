# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-13)

## Corpus Check
- 386 files · ~133,533 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3093 nodes · 8409 edges · 163 communities (121 shown, 13 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 654 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1e21fcba`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- formatDate
- Button.tsx
- db/base.py
- refresh_token
- profile/page.tsx
- models/user.py
- portfolio_service.py
- users/page.tsx
- TaskStatus
- test_phase2_task_wbs.py
- task_service.py
- FastAPI
- ForbiddenException
- projects/page.tsx
- UserRepository
- User
- wbs_service.py
- tasks/page.tsx
- react
- require_permissions
- NotificationService
- getApiErrorMessage
- _index_names
- auth_service.py
- dashboard.types.ts
- PaginatedResponse
- AITaskType
- compilerOptions
- BaseAIProvider
- RoleService
- create_refresh_token
- users.py
- TaskService
- test_ws_hardening.py
- as_user
- package.json
- dashboard_service.py
- AdminUserService
- Task
- admin.py
- AuthService
- ProjectService
- BadRequestException
- test_auth_cookies.py
- timedelta
- Project
- get_chat_history
- wbs/page.tsx
- test_auth_password_recovery.py
- parse_json_object
- ChatPanel.tsx
- oauth_service.py
- email_tasks.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- DashboardService
- get_critical_path
- ConnectionManager
- cn
- test_chat_service.py
- scheduling_service.py
- Chi tiết các Giai đoạn đã hoàn thành
- AI Project Planning & Portfolio Management System
- ThemeProvider.tsx
- ai_service.py
- logging_config.py
- worklogs.py
- oauth.py
- ai_tasks.py
- test_route_exposure.py
- notification_tasks.py
- System Architecture Design
- endpoints/auth.py
- AuditLog
- test_resource_warnings.py
- test_dashboard_metrics.py
- milestones.py
- test_oauth_account_takeover.py
- test_token_revocation.py
- FakeSocket
- my_assignments
- Software Requirements Specification (SRS)
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
- Chi tiết các Giai đoạn đã hoàn thành
- fixture
- LanguageToggle.tsx
- Business Requirements Document (BRD)
- StorageService
- test_rate_limit.py
- next.config.js
- _MessageBudget
- 3. Yêu cầu chức năng (Functional Requirements)
- rate_limit_exceeded_handler
- celery_app.py
- scripts
- Chi tiết kế hoạch triển khai
- forgot-password/page.tsx
- middleware.ts
- schemas/gantt.py
- Chi tiết các Giai đoạn
- Chi tiết các Giai đoạn
- chat_service.py
- playwright
- .eslintrc.json
- tailwind.config.ts
- next-env.d.ts
- scheduling_tasks.py
- Findings
- 11. Cài đặt và Chạy hệ thống
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- resource_leveling
- 3. Technology Stack
- get_current_active_superuser
- .password_meets_policy
- 12. Cấu hình & Biến môi trường
- 1. Tổng quan dự án
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- ApprovalStatus
- CRStatus
- DocumentType
- EmailStatus
- RiskLevel
- RiskLevel
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `User` - 207 edges
2. `ForbiddenException` - 73 edges
3. `Base` - 68 edges
4. `WBSService` - 68 edges
5. `TaskService` - 66 edges
6. `BadRequestException` - 61 edges
7. `NotFoundException` - 54 edges
8. `ProjectService` - 53 edges
9. `react` - 48 edges
10. `ConflictException` - 47 edges

## Surprising Connections (you probably didn't know these)
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `create_assignment()` --uses--> `AssignmentCreate`  [INFERRED]
  backend/app/api/v1/endpoints/assignments.py → backend/app/schemas/task.py
- `list_audit_logs()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/audit_timeline.py → backend/app/models/user.py
- `register()` --uses--> `RegisterRequest`  [INFERRED]
  backend/app/api/v1/endpoints/auth.py → backend/app/schemas/auth.py

## Import Cycles
- None detected.

## Communities (163 total, 13 thin omitted)

### Community 0 - "formatDate"
Cohesion: 0.10
Nodes (30): DashboardPage(), greeting(), TaskTable(), Avatar(), AvatarProps, EmptyState(), UserTable(), ACTION_CLASSES (+22 more)

### Community 1 - "Button.tsx"
Cohesion: 0.07
Nodes (49): LoginPageProps, metadata, Alert(), AlertProps, VARIANT_CLASSES, Button, ButtonProps, VARIANT_CLASSES (+41 more)

### Community 2 - "db/base.py"
Cohesion: 0.09
Nodes (25): Approval, Assignment, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChangeRequest, ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, Comment (+17 more)

### Community 3 - "refresh_token"
Cohesion: 0.13
Nodes (32): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+24 more)

### Community 4 - "profile/page.tsx"
Cohesion: 0.05
Nodes (59): AuthLayout(), OAuthCallbackContent(), VerificationState, VerifyEmailContent(), verify(), AdminLayout(), TABS, DashboardLayout() (+51 more)

### Community 5 - "models/user.py"
Cohesion: 0.08
Nodes (36): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, get_current_user(), get_current_user_media(), AsyncSession (+28 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.07
Nodes (36): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+28 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (47): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys, permissionKeys (+39 more)

### Community 8 - "TaskStatus"
Cohesion: 0.16
Nodes (21): str, TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong. (+13 more)

### Community 9 - "test_phase2_task_wbs.py"
Cohesion: 0.08
Nodes (51): backward_pass(), build_graph(), compute_cpm(), compute_cpm_for_project(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor() (+43 more)

### Community 10 - "task_service.py"
Cohesion: 0.07
Nodes (62): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+54 more)

### Community 11 - "FastAPI"
Cohesion: 0.09
Nodes (25): Gom tất cả các WebSocket router (chat, notifications, ...) được mount tại gốc…, set_request_id(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, close_redis(), Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ…, Request, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip() (+17 more)

### Community 12 - "ForbiddenException"
Cohesion: 0.08
Nodes (24): Assignment, _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, get_current_verified_user(), Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ConflictException, ForbiddenException, NotFoundException (+16 more)

### Community 13 - "projects/page.tsx"
Cohesion: 0.11
Nodes (34): ProjectMembersPage(), ProjectsPage(), portfolioKeys, InviteMemberDialog(), InitialProjectMember, ProjectWizard(), useAddProjectMember(), useAssignableRoles() (+26 more)

### Community 14 - "UserRepository"
Cohesion: 0.10
Nodes (9): AsyncSession, UserRepository, get_oauth_service(), AsyncSession, Depends, get_user_service(), AsyncSession, Depends (+1 more)

### Community 15 - "User"
Cohesion: 0.09
Nodes (18): EpicStatus, str, MilestoneStatus, str, PhaseStatus, str, User, get_project_context() (+10 more)

### Community 16 - "wbs_service.py"
Cohesion: 0.07
Nodes (65): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+57 more)

### Community 17 - "tasks/page.tsx"
Cohesion: 0.10
Nodes (34): KanbanColumn(), SprintView(), STATUSES, TaskCard(), TasksPage(), ViewMode, localDate(), TaskDrawer() (+26 more)

### Community 18 - "react"
Cohesion: 0.12
Nodes (21): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, useDeleteNotification() (+13 more)

### Community 19 - "require_permissions"
Cohesion: 0.15
Nodes (23): AdminUserServiceDep, create_user(), deactivate_user(), get_user(), list_users(), Depends, ge, get (+15 more)

### Community 20 - "NotificationService"
Cohesion: 0.09
Nodes (32): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+24 more)

### Community 21 - "getApiErrorMessage"
Cohesion: 0.08
Nodes (45): AdminAuditPage(), PortfolioDetailPage(), PortfoliosPage(), ProjectLayout(), ProjectOverviewPage(), ProjectSettingsPage(), TimesheetPage(), WBSPage() (+37 more)

### Community 22 - "_index_names"
Cohesion: 0.25
Nodes (8): _index_names(), Nó tồn tại trong migration 20260814 nhưng chưa từng được khai báo ở model, nên…, Celery Beat quét bảng tasks toàn hệ thống mỗi sáng 08:00., history() lọc theo project_id + id < before_id và ORDER BY id DESC; một index…, test_audit_rows_can_be_filtered_by_project(), test_chat_history_index_matches_the_order_it_is_read_in(), test_the_daily_sweep_query_is_indexed(), test_the_gin_index_on_labels_is_declared_on_the_model()

### Community 23 - "auth_service.py"
Cohesion: 0.08
Nodes (37): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+29 more)

### Community 24 - "dashboard.types.ts"
Cohesion: 0.06
Nodes (33): ProjectOverviewCharts, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, ActiveProjectsGridProps (+25 more)

### Community 25 - "PaginatedResponse"
Cohesion: 0.11
Nodes (24): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+16 more)

### Community 26 - "AITaskType"
Cohesion: 0.15
Nodes (17): AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm…, Các loại tác vụ AI trong hệ thống, tương ứng các SOP trong roadmap AI., Trả về tên model xKiro (dạng "vendor/model") được cấu hình cho một loại tác vụ., Trả về toàn bộ bảng định tuyến task -> model hiện hành, dùng để log/kiểm tra., resolve_model() (+9 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "BaseAIProvider"
Cohesion: 0.33
Nodes (4): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider.

### Community 29 - "RoleService"
Cohesion: 0.07
Nodes (35): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, field_validator, RoleCreate, RoleUpdate, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate. (+27 more)

### Community 30 - "create_refresh_token"
Cohesion: 0.13
Nodes (21): Phân giải và xác thực một bearer token thành một User đang tồn tại và active., _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), Any, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết…, Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem… (+13 more)

### Community 31 - "users.py"
Cohesion: 0.12
Nodes (27): change_password(), connect_social_account(), deactivate_account(), disconnect_social_account(), get_avatar(), CurrentUser, delete, OAuthServiceDep (+19 more)

### Community 32 - "TaskService"
Cohesion: 0.08
Nodes (35): NotificationType, str, str, SubtaskStatus, TaskPriority, TaskStatusUpdate, Tạo, lưu và phát real-time một notification. Gọi flush ngay lập tức (cần thiết…, Cùng nội dung, nhiều người nhận — một lần INSERT, một lần publish. Gọi `push()`… (+27 more)

### Community 33 - "test_ws_hardening.py"
Cohesion: 0.09
Nodes (38): chat_ws(), Query, websocket, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), Xác thực và giám sát vòng đời cho các WebSocket endpoint. Handshake trình ra…, Ném ra khi một kết nối WebSocket không qua được kiểm tra hợp lệ. Bên gọi nên… (+30 more)

### Community 34 - "as_user"
Cohesion: 0.15
Nodes (24): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, asyncio, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Customer nhin thay du an nhung khong thay phan ra cong viec ben trong., Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin., CurrentVerifiedUser chi duoc dung o 2/40+ route truoc day, nen luong xac minh… (+16 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (29): description, name, overrides, postcss, private, version, autoprefixer, clsx (+21 more)

### Community 36 - "dashboard_service.py"
Cohesion: 0.14
Nodes (22): ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioHealthResponse, PortfolioProjectHealth, ProjectDashboardStats (+14 more)

### Community 37 - "AdminUserService"
Cohesion: 0.27
Nodes (25): AdminUserCreate, AdminUserUpdate, AdminUserService, AsyncSession, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user(), asyncio (+17 more)

### Community 38 - "Task"
Cohesion: 0.11
Nodes (11): Task, BaseRepository, Any, AsyncSession, datetime, AsyncSession, TaskRepository, Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc… (+3 more)

### Community 39 - "admin.py"
Cohesion: 0.12
Nodes (23): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+15 more)

### Community 40 - "AuthService"
Cohesion: 0.18
Nodes (9): TooManyRequestsException, AuthService, get_auth_service(), AsyncSession, datetime, Depends, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái… (+1 more)

### Community 41 - "ProjectService"
Cohesion: 0.06
Nodes (66): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+58 more)

### Community 42 - "BadRequestException"
Cohesion: 0.11
Nodes (12): BadRequestException, ServiceUnavailableException, UnauthorizedException, UnprocessableException, OAuthService, Any, User, Phân giải identity của provider thành một User. `email_provider_verified` là… (+4 more)

### Community 43 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 44 - "timedelta"
Cohesion: 0.17
Nodes (22): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+14 more)

### Community 45 - "Project"
Cohesion: 0.09
Nodes (12): Project, ProjectRepository, AsyncSession, datetime, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., make_user(), Tạo một user đã lưu. `verified=False` để kiểm tra cổng email verification., project() (+4 more)

### Community 46 - "get_chat_history"
Cohesion: 0.19
Nodes (14): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+6 more)

### Community 47 - "wbs/page.tsx"
Cohesion: 0.13
Nodes (22): DeletePhaseDialog(), Editor, EntityEditor(), statusOptions(), projectKeys, taskKeys, usePhaseImpact(), useWBSActions() (+14 more)

### Community 48 - "test_auth_password_recovery.py"
Cohesion: 0.20
Nodes (20): hash_password(), verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize (+12 more)

### Community 49 - "parse_json_object"
Cohesion: 0.17
Nodes (19): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+11 more)

### Community 50 - "ChatPanel.tsx"
Cohesion: 0.18
Nodes (16): ProjectChatPage(), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory() (+8 more)

### Community 51 - "oauth_service.py"
Cohesion: 0.17
Nodes (15): code_challenge_for(), consume(), issue(), _key(), new_code_verifier(), Any, Store phía server cho tham số `state` của OAuth, kèm ràng buộc theo trình duyệt…, Thuộc tính cho cookie ràng buộc luồng OAuth với trình duyệt. `lax` chứ không… (+7 more)

### Community 52 - "email_tasks.py"
Cohesion: 0.19
Nodes (14): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task(), send_password_reset_email_task() (+6 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.28
Nodes (20): OAuthState, avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data() (+12 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "DashboardService"
Cohesion: 0.13
Nodes (16): ActiveProjectSummary, RecentActivityItem, TeamMemberUtilization, UserDashboardStats, DashboardService, get_dashboard_service(), _iso_week_bounds(), AsyncSession (+8 more)

### Community 57 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 58 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 59 - "cn"
Cohesion: 0.15
Nodes (15): MiniProgressBar(), MiniProgressBarProps, ConfirmDialog(), ConfirmDialogProps, Modal(), ModalProps, Spinner(), LINKS (+7 more)

### Community 60 - "test_chat_service.py"
Cohesion: 0.45
Nodes (10): build_actor(), build_message(), asyncio, test_create_message_persists_and_publishes(), test_history_no_more_pages_when_under_limit(), test_history_rejects_non_member(), test_history_returns_items_in_chronological_order_and_flags_more(), test_mark_read_creates_state_when_absent() (+2 more)

### Community 61 - "scheduling_service.py"
Cohesion: 0.18
Nodes (14): Dependency, Worklog, CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), AsyncSession (+6 more)

### Community 62 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 63 - "AI Project Planning & Portfolio Management System"
Cohesion: 0.10
Nodes (20): 10. API Specification & WebSocket Endpoints, 13. Quy tắc phát triển, 14. Roadmap phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. License & Contributors, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.17
Nodes (12): metadata, viewport, Providers(), apply(), systemPrefersDark(), ThemeContext, ThemeContextValue, themeInitScript (+4 more)

### Community 65 - "ai_service.py"
Cohesion: 0.11
Nodes (25): AIServiceDep, generate_project(), get_ai_job(), CurrentUser, Depends, get, post, SOP-AI-001: Xếp hàng sinh một dự án (Phases + Tasks + Dependencies) từ prompt.… (+17 more)

### Community 66 - "logging_config.py"
Cohesion: 0.16
Nodes (12): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+4 more)

### Community 67 - "worklogs.py"
Cohesion: 0.19
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "oauth.py"
Cohesion: 0.19
Nodes (21): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+13 more)

### Community 69 - "ai_tasks.py"
Cohesion: 0.12
Nodes (18): generate_project_task(), _generate_with_own_session(), impact_analysis_task(), optimize_schedule_task(), parse_document_task(), Các tác vụ AI chạy nền qua Celery — xem app/workers/scheduling_tasks.py cho…, SOP-AI-001: Tạo kế hoạch dự án (Project + Phase + Task + Dependency) từ prompt…, SOP-AI-002: Phân tích tác động của một change request. (+10 more)

### Community 70 - "test_route_exposure.py"
Cohesion: 0.14
Nodes (16): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+8 more)

### Community 71 - "notification_tasks.py"
Cohesion: 0.18
Nodes (11): Notification, AsyncSession, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên…, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), sweep_task_dates_task(), _sweep_with_own_session() (+3 more)

### Community 72 - "System Architecture Design"
Cohesion: 0.13
Nodes (15): AI Project Planning & Portfolio Management System, Backend Architecture, Backend Layer, Celery Beat & Scheduled Tasks, Change History, Cấu trúc thư mục Backend thực tế, Database Schema (SQLAlchemy — 8 Domains, 34 Tables), ERD tổng quan (+7 more)

### Community 73 - "endpoints/auth.py"
Cohesion: 0.31
Nodes (12): AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, BaseModel, Những gì trình duyệt thực sự nhận được. Refresh token cố tình vắng mặt: nó đi…, Credential dùng một lần cho WebSocket handshake — xem app/core/ws_tickets.py. (+4 more)

### Community 74 - "AuditLog"
Cohesion: 0.16
Nodes (17): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, _captured_where_text(), asyncio (+9 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "test_dashboard_metrics.py"
Cohesion: 0.24
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 77 - "milestones.py"
Cohesion: 0.26
Nodes (13): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+5 more)

### Community 78 - "test_oauth_account_takeover.py"
Cohesion: 0.28
Nodes (12): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through() (+4 more)

### Community 79 - "test_token_revocation.py"
Cohesion: 0.35
Nodes (12): build_db(), build_service(), build_user(), asyncio, Xoay vòng refresh token, phát hiện tái sử dụng, và thu hồi khi logout (Phase…, Hai bên cùng giữ một token nghĩa là nó đã bị lộ — hủy tất cả session, không chỉ…, Một access token gửi tới /logout không được coi là refresh token., test_logout_ignores_a_token_of_the_wrong_type() (+4 more)

### Community 81 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 82 - "Software Requirements Specification (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Technology Stack), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (System Architecture), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "change_requests.py"
Cohesion: 0.14
Nodes (14): create_change_requests(), delete_change_requests(), get_change_requests(), list_change_requests(), delete, get, post, put (+6 more)

### Community 85 - "dashboards.py"
Cohesion: 0.29
Nodes (10): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số… (+2 more)

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

### Community 93 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.14
Nodes (13): 6 Trụ cột chính:, Chi tiết các Giai đoạn đã hoàn thành, Danh mục tính năng đã triển khai, GIAI ĐOẠN 1.1 – Core Registration & Route Protection (SOP-AUTH-001), GIAI ĐOẠN 1.2 – Social Login OAuth 2.0 (SOP-AUTH-002), GIAI ĐOẠN 1.3 – Password Recovery Flow (SOP-AUTH-003), GIAI ĐOẠN 1.4 – Email Verification & Security Guard (SOP-AUTH-004), GIAI ĐOẠN 1.5 – User Profile & Account Settings (SOP-AUTH-005) (+5 more)

### Community 94 - "fixture"
Cohesion: 0.18
Nodes (13): AsyncClient, client(), _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture, Role (+5 more)

### Community 95 - "LanguageToggle.tsx"
Cohesion: 0.36
Nodes (7): LanguageToggle(), setLocale(), DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

### Community 96 - "Business Requirements Document (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Business Objectives), 1. Tổng quan dự án (Project Overview), 2.1 Các tính năng trong phạm vi (In-Scope), 2.2 Ngoài phạm vi (Out-of-Scope), 2. Phạm vi dự án (Project Scope), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), AI Project Planning & Portfolio Management System (+1 more)

### Community 97 - "StorageService"
Cohesion: 0.24
Nodes (4): get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, Minio

### Community 98 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 99 - "next.config.js"
Cohesion: 0.20
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 101 - "3. Yêu cầu chức năng (Functional Requirements)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Document & Reporting (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 102 - "rate_limit_exceeded_handler"
Cohesion: 0.28
Nodes (9): client_key(), Request, Response, rate_limit_exceeded_handler(), Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố…, _retry_after_seconds() (+1 more)

### Community 103 - "celery_app.py"
Cohesion: 0.25
Nodes (6): generate_docx_task(), generate_xlsx_task(), Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001), GIAI ĐOẠN 3.3 – AI Impact Analysis (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 106 - "forgot-password/page.tsx"
Cohesion: 0.29
Nodes (3): metadata, metadata, next

### Community 107 - "middleware.ts"
Cohesion: 0.40
Nodes (3): AUTH_ROUTES, config, PROTECTED_PREFIXES

### Community 108 - "schemas/gantt.py"
Cohesion: 0.67
Nodes (3): GanttResponse, GanttTask, BaseModel

### Community 109 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 4.1 – Audit Timeline & Activity Stream (SOP-AUD-001), GIAI ĐOẠN 4.2 – Real-Time WebSocket Infrastructure & Project Chat (SOP-CHAT-001), GIAI ĐOẠN 4.3 – Change Request & Multi-Level Approval Workflow (SOP-CR), GIAI ĐOẠN 4.4 – Project Versioning & Rollback System (SOP-PM-004), GIAI ĐOẠN 4.5 – Report Generation & Export (DOCX & XLSX) (SOP-RPT-001) (+3 more)

### Community 110 - "Chi tiết các Giai đoạn"
Cohesion: 0.17
Nodes (11): 5 Trụ cột chính:, Chi tiết các Giai đoạn, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 5.1 – Real-time Notification Push & Celery Beat Daily Sweep (SOP-NOTI-001), GIAI ĐOẠN 5.2 – BRD/SRS Document Upload & AI Document Parser (SOP-DOC-001), GIAI ĐOẠN 5.3 – Investor Dashboard Portal (Executive Read-Only View), GIAI ĐOẠN 5.4 – Profile Settings & Avatar Management Polish, GIAI ĐOẠN 5.5 – Performance Optimization & Mobile Responsiveness (+3 more)

### Community 111 - "chat_service.py"
Cohesion: 0.13
Nodes (20): publish(), Broadcast xuyên tiến trình: publish tới Redis; việc phân phối tới các kết nối…, ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —…, ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse (+12 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 145 - "scheduling_tasks.py"
Cohesion: 0.36
Nodes (7): _pending_key(), Tính lại đường găng ngoài request, có gộp trùng. `recalculate_project` là thao…, Xếp hàng một lần tính lại cho `project_id` nếu chưa có lần nào đang chờ. Trả về…, Điểm vào Celery đồng bộ — chạy việc tính lại đến khi hoàn tất., recalculate_project_task(), _recalculate_with_own_session(), schedule_recalculation()

### Community 146 - "Findings"
Cohesion: 0.29
Nodes (6): Admin / RBAC Feature (100% Complete), Backend Architecture (Verified & Tested), Findings, Frontend Architecture & Quality, Key Models, Real-Time Project Chat & WebSocket Notification (100% Complete)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Backend (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Frontend (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 149 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 150 - "3. Technology Stack"
Cohesion: 0.50
Nodes (4): 3. Technology Stack, Backend (Python), Frontend (Next.js / React / TypeScript), Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`)

### Community 151 - "get_current_active_superuser"
Cohesion: 0.67
Nodes (3): get_current_active_superuser(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC).

### Community 153 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Backend Environment (`backend/.env`), Frontend Environment (`frontend/.env.local`)

### Community 154 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-03)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

## Knowledge Gaps
- **320 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+315 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1052 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `models/user.py`, `portfolio_service.py`, `task_service.py`, `ForbiddenException`, `UserRepository`, `wbs_service.py`, `require_permissions`, `auth_service.py`, `get_current_active_superuser`, `PaginatedResponse`, `RoleService`, `create_refresh_token`, `users.py`, `TaskService`, `test_ws_hardening.py`, `as_user`, `dashboard_service.py`, `AdminUserService`, `Task`, `AuthService`, `ProjectService`, `BadRequestException`, `timedelta`, `Project`, `oauth_service.py`, `DashboardService`, `scheduling_service.py`, `ai_service.py`, `ai_tasks.py`, `test_oauth_account_takeover.py`, `chat_service.py`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `ProjectRepository` connect `Project` to `db/base.py`, `models/user.py`, `Task`, `TaskStatus`, `ProjectService`, `AuditLog`, `User`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `as_user()` connect `as_user` to `models/user.py`, `fixture`, `User`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 48 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 48 INFERRED edges - model-reasoned connections that need verification._
- **Are the 14 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 37 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 37 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _320 weakly-connected nodes found - possible documentation gaps or missing edges._
# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-13)

## Corpus Check
- 391 files · ~134,642 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3120 nodes · 8492 edges · 153 communities (115 shown, 9 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 653 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `25b19ae6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- wbs/page.tsx
- react
- db/base.py
- endpoints/auth.py
- profile/page.tsx
- FastAPI
- portfolio_service.py
- users/page.tsx
- TaskStatus
- test_cpm_scheduling.py
- update_subtask
- main.py
- ForbiddenException
- ValueError
- portfolios/[id]/page.tsx
- User
- wbs_service.py
- useTasks.ts
- useNotifications.ts
- users.py
- NotificationService
- tasks/page.tsx
- Task
- test_login_lockout.py
- formatDate
- UserService
- AITaskType
- compilerOptions
- milestones.py
- AdminUserService
- auth_service.py
- schemas/user.py
- task_service.py
- test_ws_hardening.py
- as_user
- package.json
- dashboard_service.py
- tasks.py
- Settings
- roles.py
- AuthService
- ProjectService
- OAuthService
- test_auth_cookies.py
- timedelta
- ProjectRepository
- Permission
- useAIGenerator.ts
- test_auth_password_recovery.py
- parse_json_object
- ChatPanel.tsx
- _MessageBudget
- email_tasks.py
- test_user_profile_settings.py
- dependencies
- devDependencies
- get_wbs_service
- get_critical_path
- ConnectionManager
- RoleService
- create_dependency
- scheduling_service.py
- Chi tiết các Giai đoạn đã hoàn thành
- AI Project Planning & Portfolio Management System
- ThemeProvider.tsx
- AIService
- logging_config.py
- worklogs.py
- oauth_service.py
- ai_tasks.py
- user_service.py
- models/user.py
- System Architecture Design
- .__init__
- AuditLog
- test_resource_warnings.py
- dashboard.types.ts
- .__init__
- .list_users
- FakeSocket
- my_assignments
- Software Requirements Specification (SRS)
- approvals.py
- change_requests.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- skills.py
- system.py
- Chi tiết các Giai đoạn đã hoàn thành
- make_user
- LanguageToggle.tsx
- Business Requirements Document (BRD)
- StorageService
- test_rate_limit.py
- next.config.js
- 3. Yêu cầu chức năng (Functional Requirements)
- rate_limit_exceeded_handler
- report_tasks.py
- scripts
- Chi tiết kế hoạch triển khai
- middleware.ts
- schemas/gantt.py
- Chi tiết các Giai đoạn
- Chi tiết các Giai đoạn
- chat_service.py
- playwright
- .eslintrc.json
- tailwind.config.ts
- next-env.d.ts
- get_redis
- Findings
- 11. Cài đặt và Chạy hệ thống
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- resource_leveling
- 3. Technology Stack
- get_current_active_superuser
- 12. Cấu hình & Biến môi trường
- 1. Tổng quan dự án
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- document.py
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `User` - 207 edges
2. `ForbiddenException` - 75 edges
3. `Base` - 68 edges
4. `WBSService` - 68 edges
5. `TaskService` - 66 edges
6. `BadRequestException` - 61 edges
7. `NotFoundException` - 56 edges
8. `ProjectService` - 53 edges
9. `react` - 49 edges
10. `lucide-react` - 48 edges

## Surprising Connections (you probably didn't know these)
- `test_status_graph_supports_normal_block_and_reopen_flows()` --uses--> `TaskStatus`  [INFERRED]
  backend/tests/unit/test_phase2_task_wbs.py → backend/app/models/task.py
- `generate_project()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/ai.py → backend/app/models/user.py
- `create_assignment()` --uses--> `AssignmentCreate`  [INFERRED]
  backend/app/api/v1/endpoints/assignments.py → backend/app/schemas/task.py
- `list_audit_logs()` --uses--> `User`  [INFERRED]
  backend/app/api/v1/endpoints/audit_timeline.py → backend/app/models/user.py
- `refresh_token()` --uses--> `UnauthorizedException`  [INFERRED]
  backend/app/api/v1/endpoints/auth.py → backend/app/core/exceptions.py

## Import Cycles
- None detected.

## Communities (153 total, 9 thin omitted)

### Community 0 - "wbs/page.tsx"
Cohesion: 0.13
Nodes (11): DeletePhaseDialog(), Editor, EntityEditor(), statusOptions(), ConfirmDialog(), ConfirmDialogProps, Modal(), ModalProps (+3 more)

### Community 1 - "react"
Cohesion: 0.05
Nodes (60): metadata, LoginPageProps, metadata, metadata, Alert(), AlertProps, VARIANT_CLASSES, Button (+52 more)

### Community 2 - "db/base.py"
Cohesion: 0.05
Nodes (35): AIOutput, AIRequest, Approval, ApprovalStatus, str, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChangeRequest (+27 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.11
Nodes (43): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+35 more)

### Community 4 - "profile/page.tsx"
Cohesion: 0.06
Nodes (49): AuthLayout(), OAuthCallbackContent(), VerificationState, VerifyEmailContent(), verify(), AdminLayout(), TABS, DashboardLayout() (+41 more)

### Community 5 - "FastAPI"
Cohesion: 0.06
Nodes (41): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query (+33 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.07
Nodes (38): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+30 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.06
Nodes (57): AdminAuditPage(), AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, RoleTable(), adminRoleKeys (+49 more)

### Community 8 - "TaskStatus"
Cohesion: 0.16
Nodes (21): str, TaskStatus, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, parametrize, Bon truong tung duoc hien thi nhung khong noi nao ghi. Chung khong gay loi -…, Neu khong, actual_start chi la 'lan cuoi ai do chuyen ve IN_PROGRESS'., Burndown loc theo actual_end; task da mo lai thi khong con la da xong. (+13 more)

### Community 9 - "test_cpm_scheduling.py"
Cohesion: 0.09
Nodes (47): backward_pass(), build_graph(), compute_cpm(), compute_cpm_for_project(), CPMEdge, CPMNode, CPMResult, _edges_by_predecessor() (+39 more)

### Community 10 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

### Community 11 - "main.py"
Cohesion: 0.14
Nodes (19): set_request_id(), close_redis(), Redis client async, khởi tạo lazy, dùng chung toàn tiến trình — được chia sẻ…, Request, Địa chỉ của caller, chỉ tôn trọng X-Forwarded-For khi chạy sau một proxy đáng…, resolve_client_ip(), set_client_ip(), Registry kết nối WebSocket dùng chung + cầu nối pub/sub Redis, được dùng bởi cả… (+11 more)

### Community 12 - "ForbiddenException"
Cohesion: 0.08
Nodes (33): AIResultResponse, Assignment, _is_still_a_member(), Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, get_current_verified_user(), Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, require_roles() (+25 more)

### Community 13 - "ValueError"
Cohesion: 0.15
Nodes (7): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator, field_validator, model_validator, model_validator, ValueError

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.13
Nodes (26): PortfolioDetailPage(), PortfoliosPage(), DASHBOARD_KEYS, usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCard(), PortfolioCardProps, PortfolioForm() (+18 more)

### Community 15 - "User"
Cohesion: 0.07
Nodes (24): EpicStatus, str, MilestoneStatus, str, PhaseStatus, str, str, SprintStatus (+16 more)

### Community 16 - "wbs_service.py"
Cohesion: 0.07
Nodes (61): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+53 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (34): taskKeys, useInvalidate(), wbsKeys, taskService, wbsService, UserSummary, Assignment, AssignmentCreate (+26 more)

### Community 18 - "useNotifications.ts"
Cohesion: 0.12
Nodes (25): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+17 more)

### Community 19 - "users.py"
Cohesion: 0.11
Nodes (39): AdminUserServiceDep, change_password(), connect_social_account(), create_user(), deactivate_account(), deactivate_user(), disconnect_social_account(), get_avatar() (+31 more)

### Community 20 - "NotificationService"
Cohesion: 0.07
Nodes (46): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+38 more)

### Community 21 - "tasks/page.tsx"
Cohesion: 0.06
Nodes (64): ProjectLayout(), ProjectMembersPage(), ProjectOverviewPage(), ProjectSettingsPage(), STATUSES, TasksPage(), ViewMode, TimesheetPage() (+56 more)

### Community 22 - "Task"
Cohesion: 0.11
Nodes (19): Milestone, Sprint, Task, AsyncSession, TaskRepository, _index_names(), Hình dạng schema và truy vấn — những thứ hỏng âm thầm, không gây lỗi. Không lỗi…, Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc… (+11 more)

### Community 23 - "test_login_lockout.py"
Cohesion: 0.10
Nodes (24): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+16 more)

### Community 24 - "formatDate"
Cohesion: 0.07
Nodes (41): DashboardPage(), greeting(), ProjectOverviewCharts, KanbanColumn(), SprintView(), TaskCard(), TaskTable(), MiniProgressBar() (+33 more)

### Community 25 - "UserService"
Cohesion: 0.18
Nodes (9): ServiceUnavailableException, DeleteAccountRequest, get_user_service(), AsyncSession, Depends, UploadFile, UserService, test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data() (+1 more)

### Community 26 - "AITaskType"
Cohesion: 0.11
Nodes (21): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm… (+13 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "milestones.py"
Cohesion: 0.24
Nodes (15): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+7 more)

### Community 29 - "AdminUserService"
Cohesion: 0.31
Nodes (24): AdminUserCreate, AdminUserUpdate, AdminUserService, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user(), asyncio, Một chủ thể có "user:update" PATCH tài khoản của chính mình thành… (+16 more)

### Community 30 - "auth_service.py"
Cohesion: 0.14
Nodes (30): Phân giải và xác thực một bearer token thành một User đang tồn tại và active., _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), Any, datetime, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết… (+22 more)

### Community 31 - "schemas/user.py"
Cohesion: 0.24
Nodes (9): AdminUserResponse, ChangePasswordRequest, OAuthConnectResponse, BaseModel, field_validator, UserBase, UserCreate, UserResponse (+1 more)

### Community 32 - "task_service.py"
Cohesion: 0.07
Nodes (54): Assignment, DependencyType, str, str, SubtaskStatus, TaskPriority, AssignmentCreate, AssignmentMutationResponse (+46 more)

### Community 33 - "test_ws_hardening.py"
Cohesion: 0.08
Nodes (39): chat_ws(), Query, websocket, authenticate_ws(), _close_unauthorized(), enforce_connection_validity(), Xác thực và giám sát vòng đời cho các WebSocket endpoint. Handshake trình ra…, Ném ra khi một kết nối WebSocket không qua được kiểm tra hợp lệ. Bên gọi nên… (+31 more)

### Community 34 - "as_user"
Cohesion: 0.14
Nodes (25): Các bảng liên kết cho quan hệ nhiều-nhiều., as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, asyncio, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Customer nhin thay du an nhung khong thay phan ra cong viec ben trong., Do thi phu thuoc mang theo ten task - la mot duong khac toi cung thong tin. (+17 more)

### Community 35 - "package.json"
Cohesion: 0.07
Nodes (28): description, name, overrides, postcss, private, version, autoprefixer, clsx (+20 more)

### Community 36 - "dashboard_service.py"
Cohesion: 0.06
Nodes (61): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+53 more)

### Community 37 - "tasks.py"
Cohesion: 0.17
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 38 - "Settings"
Cohesion: 0.19
Nodes (12): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts() (+4 more)

### Community 39 - "roles.py"
Cohesion: 0.12
Nodes (28): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+20 more)

### Community 40 - "AuthService"
Cohesion: 0.08
Nodes (22): TooManyRequestsException, is_revoked(), _key(), Danh sách thu hồi refresh-token, được hỗ trợ bởi Redis. JWT là tự chứa: một khi…, Số giây mà tombstone phải tồn tại lâu hơn, suy ra từ chính `exp` của token.…, Đánh dấu `jti` không dùng được nữa. Trả về False nếu không kết nối được tới…, `jti` đã bị thu hồi hay chưa. False khi không kết nối được tới store — xem ghi…, revoke() (+14 more)

### Community 41 - "ProjectService"
Cohesion: 0.06
Nodes (64): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+56 more)

### Community 42 - "OAuthService"
Cohesion: 0.11
Nodes (22): UnauthorizedException, get_oauth_service(), OAuthService, OAuthState, Any, AsyncSession, Depends, User (+14 more)

### Community 43 - "test_auth_cookies.py"
Cohesion: 0.13
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 44 - "timedelta"
Cohesion: 0.17
Nodes (22): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+14 more)

### Community 45 - "ProjectRepository"
Cohesion: 0.09
Nodes (9): Role, BaseRepository, Any, AsyncSession, ProjectRepository, AsyncSession, date, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`. (+1 more)

### Community 46 - "Permission"
Cohesion: 0.28
Nodes (5): main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Permission, Role

### Community 47 - "useAIGenerator.ts"
Cohesion: 0.26
Nodes (9): AIGeneratorModal(), aiJobKeys, IN_PROGRESS, useAIJob(), useGenerateProject(), aiService, AIJobResponse, AIJobStatus (+1 more)

### Community 48 - "test_auth_password_recovery.py"
Cohesion: 0.23
Nodes (18): ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request, ASGI scope tối thiểu — decorator rate-limit trên endpoint cần một Request thật… (+10 more)

### Community 49 - "parse_json_object"
Cohesion: 0.17
Nodes (19): AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng…, Model trả về thứ mà ta sẽ không hành động theo., Rào văn bản người dùng không tin cậy và gán nhãn nó là dữ liệu. Dấu rào được…, Trả về `{...}` hoàn chỉnh đầu tiên trong `text`, có theo dõi lồng nhau và… (+11 more)

### Community 50 - "ChatPanel.tsx"
Cohesion: 0.18
Nodes (17): ProjectChatPage(), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory() (+9 more)

### Community 52 - "email_tasks.py"
Cohesion: 0.19
Nodes (14): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task(), send_password_reset_email_task() (+6 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.28
Nodes (20): hash_password(), verify_password(), avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó. (+12 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "get_wbs_service"
Cohesion: 0.50
Nodes (3): get_wbs_service(), AsyncSession, Depends

### Community 57 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 58 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 59 - "RoleService"
Cohesion: 0.33
Nodes (13): AsyncSession, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db(), build_role(), asyncio, test_create_role_rejects_duplicate_name() (+5 more)

### Community 60 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 61 - "scheduling_service.py"
Cohesion: 0.18
Nodes (10): Dependency, Epic, CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), Depends (+2 more)

### Community 62 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 63 - "AI Project Planning & Portfolio Management System"
Cohesion: 0.10
Nodes (20): 10. API Specification & WebSocket Endpoints, 13. Quy tắc phát triển, 14. Roadmap phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. License & Contributors, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.17
Nodes (12): metadata, viewport, Providers(), apply(), systemPrefersDark(), ThemeContext, ThemeContextValue, themeInitScript (+4 more)

### Community 65 - "AIService"
Cohesion: 0.11
Nodes (33): AIJobResponse, AIServiceDep, generate_project(), get_ai_job(), CurrentUser, Depends, get, post (+25 more)

### Community 66 - "logging_config.py"
Cohesion: 0.16
Nodes (12): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+4 more)

### Community 67 - "worklogs.py"
Cohesion: 0.19
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "oauth_service.py"
Cohesion: 0.12
Nodes (29): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+21 more)

### Community 69 - "ai_tasks.py"
Cohesion: 0.12
Nodes (18): generate_project_task(), _generate_with_own_session(), impact_analysis_task(), optimize_schedule_task(), parse_document_task(), Các tác vụ AI chạy nền qua Celery — xem app/workers/scheduling_tasks.py cho…, SOP-AI-001: Tạo kế hoạch dự án (Project + Phase + Task + Dependency) từ prompt…, SOP-AI-002: Phân tích tác động của một change request. (+10 more)

### Community 70 - "user_service.py"
Cohesion: 0.14
Nodes (16): Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->… (+8 more)

### Community 71 - "models/user.py"
Cohesion: 0.13
Nodes (20): Portfolio, Project, ProjectMethodology, ProjectStatus, str, datetime, datetime, json_value() (+12 more)

### Community 72 - "System Architecture Design"
Cohesion: 0.13
Nodes (15): AI Project Planning & Portfolio Management System, Backend Architecture, Backend Layer, Celery Beat & Scheduled Tasks, Change History, Cấu trúc thư mục Backend thực tế, Database Schema (SQLAlchemy — 8 Domains, 34 Tables), ERD tổng quan (+7 more)

### Community 74 - "AuditLog"
Cohesion: 0.16
Nodes (17): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, _captured_where_text(), asyncio (+9 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "dashboard.types.ts"
Cohesion: 0.08
Nodes (26): BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, ActiveProjectsGridProps, MyTasksListProps (+18 more)

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

### Community 94 - "make_user"
Cohesion: 0.12
Nodes (20): AsyncClient, client(), _disable_rate_limiting(), engine(), event_loop(), make_user(), AsyncSession, fixture (+12 more)

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

### Community 103 - "report_tasks.py"
Cohesion: 0.29
Nodes (6): generate_docx_task(), generate_xlsx_task(), Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001), GIAI ĐOẠN 3.3 – AI Impact Analysis (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

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
Cohesion: 0.09
Nodes (39): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+31 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 145 - "get_redis"
Cohesion: 0.15
Nodes (18): issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), get_redis(), health_check() (+10 more)

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

### Community 156 - "document.py"
Cohesion: 0.40
Nodes (3): Document, DocumentType, str

## Knowledge Gaps
- **323 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+318 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1058 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `FastAPI`, `portfolio_service.py`, `ForbiddenException`, `wbs_service.py`, `users.py`, `get_current_active_superuser`, `UserService`, `AdminUserService`, `auth_service.py`, `task_service.py`, `test_ws_hardening.py`, `as_user`, `dashboard_service.py`, `roles.py`, `AuthService`, `ProjectService`, `OAuthService`, `timedelta`, `ProjectRepository`, `Permission`, `RoleService`, `scheduling_service.py`, `AIService`, `oauth_service.py`, `ai_tasks.py`, `user_service.py`, `models/user.py`, `make_user`, `chat_service.py`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `ProjectRepository` connect `ProjectRepository` to `models/user.py`, `TaskStatus`, `ProjectService`, `AuditLog`, `User`, `Task`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `ForbiddenException` connect `ForbiddenException` to `db/base.py`, `FastAPI`, `portfolio_service.py`, `User`, `users.py`, `NotificationService`, `get_current_active_superuser`, `AdminUserService`, `auth_service.py`, `task_service.py`, `test_ws_hardening.py`, `dashboard_service.py`, `roles.py`, `AuthService`, `ProjectService`, `RoleService`, `AIService`, `user_service.py`, `models/user.py`, `.__init__`, `chat_service.py`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 48 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 48 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 37 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 37 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npx`, `@executeautomation/playwright-mcp-server`, `extends` to the rest of the system?**
  _323 weakly-connected nodes found - possible documentation gaps or missing edges._
# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-16)

## Corpus Check
- 399 files · ~139,676 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3148 nodes · 8641 edges · 158 communities (119 shown, 10 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 688 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2deb9f15`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_auth_cookies.py
- Button.tsx
- db/base.py
- refresh_token
- profile/page.tsx
- StorageService
- portfolio_service.py
- users/page.tsx
- email_tasks.py
- test_cpm_scheduling.py
- oauth_service.py
- FastAPI
- task_service.py
- ws/chat.py
- portfolios/[id]/page.tsx
- User
- wbs.py
- useTasks.ts
- lucide-react
- users.py
- NotificationService
- tasks/page.tsx
- test_auth_password_recovery.py
- auth_service.py
- formatStatus
- ConflictException
- AITaskType
- compilerOptions
- milestones.py
- AdminUserService
- core/dependencies.py
- ChatService
- .update
- test_ws_hardening.py
- as_user
- package.json
- dashboard_service.py
- TaskServiceDep
- Settings
- roles.py
- AuthService
- project_service.py
- BadRequestException
- admin_service.py
- timedelta
- conftest.py
- ProjectService
- projects/page.tsx
- list_projects
- NotificationType
- ChatPanel.tsx
- endpoints/auth.py
- Task
- test_user_profile_settings.py
- dependencies
- devDependencies
- test_route_exposure.py
- PortfolioRepository
- ConnectionManager
- RoleService
- create_dependency
- resource_service.py
- Chi tiết các Giai đoạn đã hoàn thành
- AI Project Planning & Portfolio Management System
- ThemeProvider.tsx
- useAIGenerator.ts
- logging_config.py
- worklogs.py
- list_audit_logs
- TaskStatus
- Rà soát code và nâng cấp giao diện — 2026-09-15
- add_working_days
- System Architecture Design
- ForbiddenException
- AuditLog
- test_resource_warnings.py
- TeamBarChart.tsx
- AGENTS.md
- get_chat_history
- config.ts
- update_subtask
- my_assignments
- Software Requirements Specification (SRS)
- approvals.py
- change_requests.py
- test_portfolio_project_core.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- skills.py
- system.py
- Chi tiết các Giai đoạn đã hoàn thành
- models/user.py
- BurndownChart.tsx
- Business Requirements Document (BRD)
- test_oauth_account_takeover.py
- test_rate_limit.py
- next.config.js
- get_admin_user_service
- 3. Yêu cầu chức năng (Functional Requirements)
- ApprovalStatus
- CRStatus
- scripts
- Chi tiết kế hoạch triển khai
- DocumentType
- middleware.ts
- schemas/gantt.py
- Chi tiết các Giai đoạn
- Chi tiết các Giai đoạn
- chat_service.py
- playwright
- .eslintrc.json
- tailwind.config.ts
- next-env.d.ts
- recalculate_project
- Findings
- 11. Cài đặt và Chạy hệ thống
- 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)
- RiskLevel
- 3. Technology Stack
- RiskLevel
- 12. Cấu hình & Biến môi trường
- 1. Tổng quan dự án
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- CLAUDE.md
- ValueError
- ai_service.py

## God Nodes (most connected - your core abstractions)
1. `User` - 207 edges
2. `ForbiddenException` - 75 edges
3. `WBSService` - 70 edges
4. `Base` - 68 edges
5. `TaskService` - 68 edges
6. `BadRequestException` - 61 edges
7. `NotFoundException` - 57 edges
8. `ProjectService` - 53 edges
9. `ResourceService` - 52 edges
10. `lucide-react` - 51 edges

## Surprising Connections (you probably didn't know these)
- `test_user_search_result_never_carries_a_usable_address()` --uses--> `UserSearchResult`  [INFERRED]
  backend/tests/unit/test_route_exposure.py → backend/app/schemas/project.py
- `ChatService` --uses--> `ChatHistoryResponse`  [INFERRED]
  backend/app/services/chat_service.py → backend/app/schemas/chat.py
- `chat_ws()` --uses--> `ChatMessageCreate`  [INFERRED]
  backend/app/api/ws/chat.py → backend/app/schemas/chat.py
- `ChatService` --uses--> `ChatMessageCreate`  [INFERRED]
  backend/app/services/chat_service.py → backend/app/schemas/chat.py
- `test_create_message_persists_and_publishes()` --uses--> `ChatMessageCreate`  [INFERRED]
  backend/tests/unit/test_chat_service.py → backend/app/schemas/chat.py

## Import Cycles
- None detected.

## Communities (158 total, 10 thin omitted)

### Community 0 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (26): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth., Refresh token của người gọi: ưu tiên cookie, sau đó tới body. Body vẫn được… (+18 more)

### Community 1 - "Button.tsx"
Cohesion: 0.06
Nodes (57): metadata, LoginPageProps, metadata, metadata, MiniProgressBar(), MiniProgressBarProps, Alert(), AlertProps (+49 more)

### Community 2 - "db/base.py"
Cohesion: 0.08
Nodes (35): Approval, Assignment, Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, ChangeRequest, ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, ChatReadState (+27 more)

### Community 3 - "refresh_token"
Cohesion: 0.13
Nodes (32): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+24 more)

### Community 4 - "profile/page.tsx"
Cohesion: 0.06
Nodes (48): OAuthCallbackContent(), VerificationState, DashboardLayout(), ProfilePageContent(), EmailVerificationBanner(), EmailVerificationBannerProps, useNotificationSocket(), AvatarSection() (+40 more)

### Community 5 - "StorageService"
Cohesion: 0.24
Nodes (4): get_storage_service(), Lớp bọc async nhỏ quanh client MinIO đồng bộ., StorageService, Minio

### Community 6 - "portfolio_service.py"
Cohesion: 0.16
Nodes (16): PortfolioStatus, str, PortfolioBase, PortfolioCapabilities, PortfolioCreate, PortfolioDetailResponse, PortfolioProjectSummary, PortfolioResponse (+8 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (51): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, adminRoleKeys, permissionKeys, useAdminRoles() (+43 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.19
Nodes (14): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task(), send_password_reset_email_task() (+6 more)

### Community 9 - "test_cpm_scheduling.py"
Cohesion: 0.08
Nodes (53): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, Truy vấn chỉ đọc trên lịch trình đã được tính ra. Bản thân việc tính toán chạy…, SchedulingService, backward_pass(), build_graph() (+45 more)

### Community 10 - "oauth_service.py"
Cohesion: 0.12
Nodes (29): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+21 more)

### Community 11 - "FastAPI"
Cohesion: 0.05
Nodes (48): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, CurrentUser, date, get, ResourceServiceDep (+40 more)

### Community 12 - "task_service.py"
Cohesion: 0.16
Nodes (29): DependencyType, str, AssignmentCreate, AssignmentMutationResponse, AssignmentResponse, DependencyCreate, DependencyResponse, BaseModel (+21 more)

### Community 13 - "ws/chat.py"
Cohesion: 0.13
Nodes (21): chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, authenticate_ws() (+13 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.12
Nodes (29): PortfolioDetailPage(), PortfoliosPage(), ConfirmDialogProps, Modal(), ModalProps, usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCard() (+21 more)

### Community 15 - "User"
Cohesion: 0.06
Nodes (27): AIResultResponse, NotFoundException, EpicStatus, str, PhaseStatus, str, str, SprintStatus (+19 more)

### Community 16 - "wbs.py"
Cohesion: 0.06
Nodes (61): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+53 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.11
Nodes (34): taskKeys, useInvalidate(), wbsKeys, taskService, wbsService, UserSummary, Assignment, AssignmentCreate (+26 more)

### Community 18 - "lucide-react"
Cohesion: 0.09
Nodes (33): AuthLayout(), AdminLayout(), TABS, NotificationsPage(), FullPageSpinner(), Brand(), LanguageToggle(), LINKS (+25 more)

### Community 19 - "users.py"
Cohesion: 0.05
Nodes (68): AdminUserServiceDep, AIServiceDep, generate_project(), get_ai_job(), CurrentUser, Depends, get, post (+60 more)

### Community 20 - "NotificationService"
Cohesion: 0.09
Nodes (32): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+24 more)

### Community 21 - "tasks/page.tsx"
Cohesion: 0.05
Nodes (64): VerifyEmailContent(), verify(), AdminAuditPage(), ProjectChatPage(), ProjectLayout(), ProjectMembersPage(), ProjectSettingsPage(), KanbanColumn() (+56 more)

### Community 22 - "test_auth_password_recovery.py"
Cohesion: 0.24
Nodes (17): verify_password(), build_request(), build_service(), extract_token(), asyncio, parametrize, Request, ASGI scope tối thiểu — decorator rate-limit trên endpoint cần một Request thật… (+9 more)

### Community 23 - "auth_service.py"
Cohesion: 0.07
Nodes (43): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+35 more)

### Community 24 - "formatStatus"
Cohesion: 0.07
Nodes (40): DashboardPage(), ProjectOverviewCharts, ProjectOverviewPage(), ActiveProjectsGrid(), ActiveProjectsGridProps, ProjectCard(), STATUS_BADGE, MyTasksList() (+32 more)

### Community 25 - "ConflictException"
Cohesion: 0.10
Nodes (20): ConflictException, ServiceUnavailableException, UnauthorizedException, UnprocessableException, ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, BaseModel (+12 more)

### Community 26 - "AITaskType"
Cohesion: 0.07
Nodes (42): ABC, BaseAIProvider, Any, Lớp cơ sở trừu tượng cho các AI provider., AITaskType, model_routing_table(), str, Định tuyến model xKiro theo từng loại tác vụ AI. xKiro cho phép gọi hàng trăm… (+34 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "milestones.py"
Cohesion: 0.24
Nodes (15): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+7 more)

### Community 29 - "AdminUserService"
Cohesion: 0.31
Nodes (24): AdminUserCreate, AdminUserUpdate, AdminUserService, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, build_db(), build_user(), asyncio, Một chủ thể có "user:update" PATCH tài khoản của chính mình thành… (+16 more)

### Community 30 - "core/dependencies.py"
Cohesion: 0.10
Nodes (38): get_current_user(), get_current_user_media(), AsyncSession, Depends, Request, Phân giải và xác thực một bearer token thành một User đang tồn tại và active., Dependency: Lấy user đã xác thực hiện tại từ Authorization header., Xác thực cho các route mà trình duyệt tự fetch (<img src>, <a href>). Các… (+30 more)

### Community 31 - "ChatService"
Cohesion: 0.25
Nodes (15): ChatService, get_chat_service(), AsyncSession, Depends, build_actor(), build_message(), asyncio, test_create_message_persists_and_publishes() (+7 more)

### Community 32 - ".update"
Cohesion: 0.12
Nodes (10): str, SubtaskStatus, str, TaskPriority, date, Task, TaskUpdate, Người dùng có được giao task này không. Ưu tiên collection `assignments` đã nạp… (+2 more)

### Community 33 - "test_ws_hardening.py"
Cohesion: 0.11
Nodes (22): _redeem(), issue(), _key(), Any, Vé dùng một lần cho WebSocket handshake. Trình duyệt không đặt được header tuỳ…, Cấp một vé cho `user_id`. Ném lỗi nếu không kết nối được tới store., Trả về payload của vé rồi vô hiệu hoá nó, hoặc None nếu không dùng được. Đọc-…, redeem() (+14 more)

### Community 34 - "as_user"
Cohesion: 0.13
Nodes (27): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+19 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (30): description, name, overrides, postcss, private, version, autoprefixer, axios (+22 more)

### Community 36 - "dashboard_service.py"
Cohesion: 0.06
Nodes (61): ActiveProjectSummary, get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu… (+53 more)

### Community 37 - "TaskServiceDep"
Cohesion: 0.14
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 38 - "Settings"
Cohesion: 0.19
Nodes (12): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts() (+4 more)

### Community 39 - "roles.py"
Cohesion: 0.14
Nodes (25): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+17 more)

### Community 40 - "AuthService"
Cohesion: 0.13
Nodes (11): TooManyRequestsException, AuthService, get_auth_service(), AsyncSession, datetime, Depends, User, Tạo token dùng một lần và đưa email vào hàng đợi mà không tiết lộ trạng thái… (+3 more)

### Community 41 - "project_service.py"
Cohesion: 0.16
Nodes (22): ProjectMethodology, ProjectStatus, str, date, AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities (+14 more)

### Community 42 - "BadRequestException"
Cohesion: 0.14
Nodes (13): BadRequestException, Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, get_oauth_service(), OAuthService, OAuthState, Any, AsyncSession (+5 more)

### Community 43 - "admin_service.py"
Cohesion: 0.15
Nodes (17): AdminUserResponse, AuditLogResponse, IDResponse, PaginatedResponse, BaseModel, PaginatedResponse, AuditService, get_audit_service() (+9 more)

### Community 44 - "timedelta"
Cohesion: 0.30
Nodes (15): build_service(), extract_token(), asyncio, parametrize, test_missing_expired_and_unknown_tokens_share_one_error(), test_oauth_account_is_marked_verified(), test_oauth_merges_into_local_account_when_provider_verified_the_email(), test_registration_stores_hashed_token_and_survives_queue_failure() (+7 more)

### Community 45 - "conftest.py"
Cohesion: 0.08
Nodes (31): AsyncClient, list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, Dependency factory: Yêu cầu user có một trong các role được chỉ định. Superuser…, require_roles() (+23 more)

### Community 46 - "ProjectService"
Cohesion: 0.16
Nodes (9): ProjectMemberResponse, get_project_service(), ProjectService, AsyncSession, date, Depends, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec… (+1 more)

### Community 47 - "projects/page.tsx"
Cohesion: 0.11
Nodes (29): ProjectsPage(), AIGeneratorModal(), STATUS_LABEL, mocks, useAIJob(), useGenerateProject(), portfolioKeys, InitialProjectMember (+21 more)

### Community 48 - "list_projects"
Cohesion: 0.14
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "NotificationType"
Cohesion: 0.19
Nodes (18): NotificationType, str, Tạo, lưu và phát real-time một notification. Gọi flush ngay lập tức (cần thiết…, Cùng nội dung, nhiều người nhận — một lần INSERT, một lần publish. Gọi `push()`…, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, asyncio (+10 more)

### Community 50 - "ChatPanel.tsx"
Cohesion: 0.22
Nodes (15): ChatMessageItem(), Props, ChatPanel(), handleSend(), Props, chatKeys, useChatHistory(), useMarkChatRead() (+7 more)

### Community 51 - "endpoints/auth.py"
Cohesion: 0.22
Nodes (15): AccessTokenResponse, ForgotPasswordRequest, LoginRequest, LogoutRequest, OAuthExchangeRequest, BaseModel, field_validator, Những gì trình duyệt thực sự nhận được. Refresh token cố tình vắng mặt: nó đi… (+7 more)

### Community 52 - "Task"
Cohesion: 0.16
Nodes (10): Task, AsyncSession, TaskRepository, Với JSON generic, `.contains()` rơi về so khớp chuỗi LIKE — nên bộ lọc…, Nó tồn tại trong migration 20260814 nhưng chưa từng được khai báo ở model, nên…, Celery Beat quét bảng tasks toàn hệ thống mỗi sáng 08:00., test_label_filter_uses_jsonb_containment_not_string_matching(), test_labels_column_type_matches_the_database() (+2 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.29
Nodes (19): avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object() (+11 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "test_route_exposure.py"
Cohesion: 0.16
Nodes (12): _mask_email(), nguyen.van.a@company.com" -> "ng***@company.com". Giữ đủ để chủ tài khoản nhận…, asyncio, parametrize, Các route rò rỉ thông tin cho bất kỳ tài khoản đã đăng nhập nào., Bộ chọn vai trò mở cho mọi PM; RoleDetailResponse mang toàn bộ ma trận role ->…, test_masked_addresses_keep_the_domain_but_drop_the_mailbox(), test_masking_a_malformed_address_reveals_nothing() (+4 more)

### Community 57 - "PortfolioRepository"
Cohesion: 0.24
Nodes (3): PortfolioRepository, AsyncSession, AsyncSession

### Community 58 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 59 - "RoleService"
Cohesion: 0.30
Nodes (13): AsyncSession, Quản lý role và role-permission chỉ dành cho Admin. Bản thân các permission là…, RoleService, build_actor(), build_db(), build_role(), asyncio, test_create_role_rejects_duplicate_name() (+5 more)

### Community 60 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 61 - "resource_service.py"
Cohesion: 0.10
Nodes (31): get_db(), AsyncSession, FastAPI dependency: trả về (yield) một async DB session., Leave, LeaveStatus, LeaveType, str, Worklog (+23 more)

### Community 62 - "Chi tiết các Giai đoạn đã hoàn thành"
Cohesion: 0.10
Nodes (20): 7 Trụ cột chính:, Bảo mật, Chi tiết các Giai đoạn đã hoàn thành, Còn nợ, Danh mục tính năng đã triển khai, GIAI ĐOẠN 2.1 – Portfolio Management (SOP-PM-001), GIAI ĐOẠN 2.2 – Project Management & Member RBAC (SOP-PM-002), GIAI ĐOẠN 2.3 – WBS, Phases, Sprints & Milestones (SOP-PM-003) (+12 more)

### Community 63 - "AI Project Planning & Portfolio Management System"
Cohesion: 0.10
Nodes (20): 10. API Specification & WebSocket Endpoints, 13. Quy tắc phát triển, 14. Roadmap phát triển, 15. Tài liệu tham khảo & Thuật ngữ, 16. License & Contributors, 2. Kiến trúc hệ thống, 4. Phân cấp cấu trúc dự án (WBS), 5. Cấu trúc thư mục dự án (+12 more)

### Community 64 - "ThemeProvider.tsx"
Cohesion: 0.14
Nodes (17): metadata, viewport, Providers(), ThemedToaster(), apply(), systemPrefersDark(), Status(), ThemeContext (+9 more)

### Community 65 - "useAIGenerator.ts"
Cohesion: 0.36
Nodes (6): aiJobKeys, IN_PROGRESS, aiService, AIJobResponse, AIJobStatus, AIResultResponse

### Community 66 - "logging_config.py"
Cohesion: 0.16
Nodes (12): do_run_migrations(), run_async_migrations(), run_migrations_online(), configure_logging(), get_request_id(), JsonFormatter, Logging co cau truc, kem request id de noi cac dong log lai voi nhau. Truoc day…, Mot dong JSON cho moi ban ghi. Log co cau truc chu khong phai chuoi tu do:… (+4 more)

### Community 67 - "worklogs.py"
Cohesion: 0.18
Nodes (20): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+12 more)

### Community 68 - "list_audit_logs"
Cohesion: 0.25
Nodes (8): AuditServiceDep, list_audit_logs(), datetime, Depends, ge, get, le, Query

### Community 69 - "TaskStatus"
Cohesion: 0.07
Nodes (42): TaskStatus, PhaseCreate, _apply_status_side_effects(), Ghi lai thoi diem cong viec that su bat dau va ket thuc. `actual_start` va…, impact_analysis_task(), optimize_schedule_task(), parse_document_task(), _persist_plan() (+34 more)

### Community 70 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 71 - "add_working_days"
Cohesion: 0.32
Nodes (7): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between()

### Community 72 - "System Architecture Design"
Cohesion: 0.13
Nodes (15): AI Project Planning & Portfolio Management System, Backend Architecture, Backend Layer, Celery Beat & Scheduled Tasks, Change History, Cấu trúc thư mục Backend thực tế, Database Schema (SQLAlchemy — 8 Domains, 34 Tables), ERD tổng quan (+7 more)

### Community 73 - "ForbiddenException"
Cohesion: 0.10
Nodes (22): Assignment, get_current_active_superuser(), get_current_verified_user(), CurrentUser, Dependency: Yêu cầu user hiện tại phải là superuser (bỏ qua mọi kiểm tra RBAC)., Yêu cầu địa chỉ email đã được xác nhận. Việc đăng ký gửi một link xác minh,…, ForbiddenException, ResourceWarning (+14 more)

### Community 74 - "AuditLog"
Cohesion: 0.16
Nodes (17): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, set_current_project_id(), AuditLog, _captured_where_text(), asyncio (+9 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "TeamBarChart.tsx"
Cohesion: 0.25
Nodes (5): DonutChartProps, DonutSlice, TeamBarChartProps, TeamMemberUtilization, recharts

### Community 78 - "get_chat_history"
Cohesion: 0.33
Nodes (7): get_chat_history(), get_chat_unread_count(), CurrentUser, ge, get, le, Query

### Community 79 - "config.ts"
Cohesion: 0.43
Nodes (5): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

### Community 80 - "update_subtask"
Cohesion: 0.40
Nodes (6): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask()

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

### Community 85 - "test_portfolio_project_core.py"
Cohesion: 0.46
Nodes (13): db(), portfolio(), project(), asyncio, test_add_member_rejects_duplicate_and_non_project_role(), test_add_member_validates_role_and_survives_email_enqueue_failure(), test_non_member_project_access_is_forbidden(), test_portfolio_scope_and_soft_delete_cascade() (+5 more)

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

### Community 94 - "models/user.py"
Cohesion: 0.07
Nodes (14): Các bảng liên kết cho quan hệ nhiều-nhiều., Notification, Portfolio, Project, Role, BaseRepository, Any, AsyncSession (+6 more)

### Community 95 - "BurndownChart.tsx"
Cohesion: 0.60
Nodes (4): BurndownChart(), BurndownChartProps, formatDate(), BurndownPoint

### Community 96 - "Business Requirements Document (BRD)"
Cohesion: 0.15
Nodes (9): 1.1 Mục đích (Purpose), 1.2 Mục tiêu kinh doanh (Business Objectives), 1. Tổng quan dự án (Project Overview), 2.1 Các tính năng trong phạm vi (In-Scope), 2.2 Ngoài phạm vi (Out-of-Scope), 2. Phạm vi dự án (Project Scope), 3. Các bên liên quan và Vai trò (Stakeholders & Roles), AI Project Planning & Portfolio Management System (+1 more)

### Community 97 - "test_oauth_account_takeover.py"
Cohesion: 0.28
Nodes (12): asyncio, User, Gộp tài khoản qua OAuth phải dựa vào khẳng định của provider, không phải chuỗi…, Cờ này bị bỏ qua trước đây; kiểm tra nó thực sự được đọc từ userinfo., Graph API không công bố trạng thái xác minh, nên luồng Facebook không bao giờ…, _service_with_existing(), test_facebook_never_asserts_verification_so_it_cannot_merge(), test_google_profile_carries_the_verified_flag_through() (+4 more)

### Community 98 - "test_rate_limit.py"
Cohesion: 0.22
Nodes (9): asyncio, fixture, _rate_limiting_on(), Rate limit phai thuc su kich hoat. `test_auth_password_recovery.py` truoc day…, Bat lai limiter cho rieng bai test nay, dem trong bo nho. Limiter that duoc…, Bao ve chinh co che bao ve: neu fixture khong khoi phuc, moi test sau day deu…, test_rate_limiting_is_restored_after_each_test(), test_repeated_sign_in_attempts_are_throttled() (+1 more)

### Community 99 - "next.config.js"
Cohesion: 0.22
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "get_admin_user_service"
Cohesion: 0.50
Nodes (3): get_admin_user_service(), AsyncSession, Depends

### Community 101 - "3. Yêu cầu chức năng (Functional Requirements)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Document & Reporting (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

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
Cohesion: 0.15
Nodes (18): mark_chat_read(), post_chat_message(), CurrentVerifiedUser, limit, post, Request, ChatHistoryResponse, ChatMessageCreate (+10 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 145 - "recalculate_project"
Cohesion: 0.13
Nodes (19): Tính lại đường găng, tiến độ dự án và số liệu sprint. Đây là thao tác toàn dự…, recalculate_project(), AsyncSession, Celery Beat task: quét các task có start_date/due_date vượt qua một ngưỡng liên…, Diem vao Celery dong bo - chay sweep bat dong bo den khi hoan tat. Co retry:…, Bắn thông báo cho đội về 'task bắt đầu hôm nay' và 'task sắp đến hạn'.…, sweep_task_dates(), sweep_task_dates_task() (+11 more)

### Community 146 - "Findings"
Cohesion: 0.29
Nodes (6): Admin / RBAC Feature (100% Complete), Backend Architecture (Verified & Tested), Findings, Frontend Architecture & Quality, Key Models, Real-Time Project Chat & WebSocket Notification (100% Complete)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Backend (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Frontend (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 150 - "3. Technology Stack"
Cohesion: 0.50
Nodes (4): 3. Technology Stack, Backend (Python), Frontend (Next.js / React / TypeScript), Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`)

### Community 153 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Backend Environment (`backend/.env`), Frontend Environment (`frontend/.env.local`)

### Community 154 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-16)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 164 - "ValueError"
Cohesion: 0.13
Nodes (9): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate., model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, model_validator (+1 more)

### Community 166 - "ai_service.py"
Cohesion: 0.15
Nodes (25): AIJobResponse, AIOutput, AIRequest, AIRequestStatus, AIRequestType, str, AIService, get_ai_service() (+17 more)

## Knowledge Gaps
- **330 isolated node(s):** `AI Project Planning & Portfolio Management System`, `Overview`, `Backend Layer`, `Frontend Layer`, `Infrastructure Layer (Docker Compose — 7 Services)` (+325 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1068 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `portfolio_service.py`, `test_cpm_scheduling.py`, `oauth_service.py`, `task_service.py`, `ws/chat.py`, `wbs.py`, `users.py`, `auth_service.py`, `ConflictException`, `AdminUserService`, `core/dependencies.py`, `ChatService`, `.update`, `as_user`, `dashboard_service.py`, `ai_service.py`, `roles.py`, `AuthService`, `project_service.py`, `BadRequestException`, `admin_service.py`, `timedelta`, `conftest.py`, `ProjectService`, `list_projects`, `RoleService`, `resource_service.py`, `list_audit_logs`, `TaskStatus`, `ForbiddenException`, `models/user.py`, `test_oauth_account_takeover.py`, `chat_service.py`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `DashboardService` connect `dashboard_service.py` to `db/base.py`, `TaskStatus`, `ForbiddenException`, `AuditLog`, `project_service.py`, `User`, `Task`, `resource_service.py`, `models/user.py`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `BadRequestException` connect `BadRequestException` to `.update`, `db/base.py`, `TaskStatus`, `portfolio_service.py`, `AuthService`, `project_service.py`, `oauth_service.py`, `admin_service.py`, `ForbiddenException`, `task_service.py`, `ProjectService`, `User`, `resource_service.py`, `auth_service.py`, `ConflictException`, `AdminUserService`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 48 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 48 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 38 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 38 INFERRED edges - model-reasoned connections that need verification._
- **What connects `AI Project Planning & Portfolio Management System`, `Overview`, `Backend Layer` to the rest of the system?**
  _330 weakly-connected nodes found - possible documentation gaps or missing edges._
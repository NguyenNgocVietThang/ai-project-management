# Graph Report - AI Project Planning & Portfolio Management system  (2026-09-17)

## Corpus Check
- 434 files · ~156,817 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3456 nodes · 9664 edges · 177 communities (142 shown, 6 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 788 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7040783`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- test_auth_cookies.py
- react
- db/base.py
- endpoints/auth.py
- api.ts
- resource_recommender.py
- portfolio_service.py
- users/page.tsx
- email_tasks.py
- test_cpm_scheduling.py
- oauth.py
- get_redis
- task_service.py
- ws/chat.py
- portfolios/[id]/page.tsx
- WBSService
- wbs_service.py
- useTasks.ts
- lucide-react
- users.py
- NotificationService
- getApiErrorMessage
- test_auth_password_recovery.py
- auth_service.py
- dashboard.types.ts
- user_service.py
- ai_tasks.py
- compilerOptions
- milestones.py
- AdminUserService
- security.py
- ChatService
- ForbiddenException
- test_ws_hardening.py
- as_user
- package.json
- dashboard_service.py
- tasks.py
- config.py
- admin.py
- AuthService
- project_service.py
- BadRequestException
- PaginatedResponse
- timedelta
- conftest.py
- User
- vitest
- projects.py
- schedule_optimizer.py
- ChatPanel.tsx
- validate_password_policy
- Task
- test_user_profile_settings.py
- dependencies
- devDependencies
- ChangeRequestDetail.tsx
- PortfolioRepository
- ConnectionManager
- Role
- create_dependency
- FastAPI
- Chi tiết các Giai đoạn đã hoàn thành
- AI Project Planning & Portfolio Management System
- ThemeProvider.tsx
- useAIGenerator.ts
- logging_config.py
- worklogs.py
- useNotifications.ts
- phase2_common.py
- Rà soát code và nâng cấp giao diện — 2026-09-15
- DashboardService
- System Architecture Design
- ResourceService
- AuditLog
- test_resource_warnings.py
- utils/cpm.py
- AGENTS.md
- get_chat_history
- config.ts
- useRiskAnalysis.ts
- my_assignments
- Software Requirements Specification (SRS)
- approvals.py
- test_change_request_service.py
- test_portfolio_project_core.py
- documents.py
- endpoints/gantt.py
- leaves.py
- project_versions.py
- reports.py
- skills.py
- system.py
- Chi tiết các Giai đoạn đã hoàn thành
- ProjectRepository
- list_notifications
- Business Requirements Document (BRD)
- test_oauth_account_takeover.py
- test_rate_limit.py
- next.config.js
- WBSServiceDep
- 3. Yêu cầu chức năng (Functional Requirements)
- oauth_service.py
- Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại
- scripts
- Chi tiết kế hoạch triển khai
- WBSServiceDep
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
- impact_analyzer.py
- 3. Technology Stack
- risk_analyzer.py
- test_dashboard_metrics.py
- 12. Cấu hình & Biến môi trường
- 1. Tổng quan dự án
- 9. Thuật toán cốt lõi & Hạ tầng Real-time
- useResourceRecommendation.ts
- create_epic
- useScheduleOptimization.ts
- rate_limit.py
- Todo: Phase 3 (AI Features) — 4 trụ cột còn lại
- SchedulingService
- CLAUDE.md
- ProjectCreate
- ValueError
- get_dashboard_summary
- AIService
- .__init__
- test_large_projects_recalculate_in_the_background
- forgot-password/page.tsx
- ChatReadState
- get_critical_path
- resource_leveling
- get_dashboard_service
- get_project_service
- get_task_service
- get_wbs_service

## God Nodes (most connected - your core abstractions)
1. `User` - 220 edges
2. `ForbiddenException` - 82 edges
3. `WBSService` - 70 edges
4. `NotFoundException` - 68 edges
5. `Base` - 68 edges
6. `TaskService` - 68 edges
7. `Task` - 64 edges
8. `BadRequestException` - 61 edges
9. `getApiErrorMessage()` - 60 edges
10. `react` - 58 edges

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

## Communities (177 total, 6 thin omitted)

### Community 0 - "test_auth_cookies.py"
Cohesion: 0.12
Nodes (27): _base(), clear_session_cookies(), _media_path(), Any, Request, Response, Cookie phiên đăng nhập do server đặt. Trước đây frontend giữ CẢ access token…, Đặt cookie phiên sau khi đăng nhập, refresh, hoặc đổi mã OAuth. (+19 more)

### Community 1 - "react"
Cohesion: 0.06
Nodes (67): LoginPageProps, metadata, MiniProgressBar(), MiniProgressBarProps, Alert(), AlertProps, VARIANT_CLASSES, Button (+59 more)

### Community 2 - "db/base.py"
Cohesion: 0.08
Nodes (26): Approval, ApprovalStatus, str, Các bảng liên kết cho quan hệ nhiều-nhiều., Base, Base class cho tất cả SQLAlchemy models. Tự động thêm: id (PK), created_at,…, Comment, Document (+18 more)

### Community 3 - "endpoints/auth.py"
Cohesion: 0.11
Nodes (44): AuthServiceDep, create_websocket_ticket(), exchange_oauth_code(), forgot_password(), get_me(), login(), logout(), CurrentUser (+36 more)

### Community 4 - "api.ts"
Cohesion: 0.07
Nodes (42): VerificationState, EmailVerificationBanner(), EmailVerificationBannerProps, SocialLoginButtonsProps, AvatarSection(), AvatarSectionProps, resolveAvatarUrl(), DangerZoneSection() (+34 more)

### Community 5 - "resource_recommender.py"
Cohesion: 0.13
Nodes (28): Assignment, LeaveStatus, LeaveType, str, _candidate_payload(), _candidate_stats(), _clamp_fit_score(), generate_resource_recommendation() (+20 more)

### Community 6 - "portfolio_service.py"
Cohesion: 0.09
Nodes (34): create_portfolio(), delete_portfolio(), get_portfolio(), list_portfolios(), CurrentUser, CurrentVerifiedUser, delete, Depends (+26 more)

### Community 7 - "users/page.tsx"
Cohesion: 0.07
Nodes (49): AdminRolesPage(), AdminUsersPage(), DeleteRoleDialog(), RoleForm(), RoleFormProps, adminRoleKeys, permissionKeys, useAdminRoles() (+41 more)

### Community 8 - "email_tasks.py"
Cohesion: 0.19
Nodes (15): _mail_config(), send_email_verification_email(), send_password_reset_email(), send_project_invitation_email(), task, Gửi email đặt lại mật khẩu với số lần retry exponential có giới hạn., Gửi thông điệp xác minh email với số lần retry exponential có giới hạn., send_email_verification_task() (+7 more)

### Community 9 - "test_cpm_scheduling.py"
Cohesion: 0.23
Nodes (21): compute_cpm(), CPMEdge, CPMNode, Thuật toán Kahn cho topological sort. Ném ValueError nếu có chu trình. Dùng…, Chạy toàn bộ phân tích CPM (topological sort + forward pass + backward pass)…, Điểm vào tương thích ngược: chạy CPM chỉ dùng các quan hệ FS (Finish-to-Start,…, run_cpm(), topological_sort() (+13 more)

### Community 10 - "oauth.py"
Cohesion: 0.32
Nodes (15): facebook_callback(), facebook_login(), _finish(), get_oauth_providers(), google_callback(), google_login(), _handle_callback(), get (+7 more)

### Community 11 - "get_redis"
Cohesion: 0.09
Nodes (33): set_request_id(), issue(), _key(), Mã hand-off dùng một lần cho redirect của OAuth. Callback của provider phải đưa…, Lưu một cặp token và trả về mã dùng để đổi lấy nó. Ném lỗi nếu không kết nối…, Trả về (access_token, refresh_token) cho `code`, hoặc None nếu mã không xác…, redeem(), close_redis() (+25 more)

### Community 12 - "task_service.py"
Cohesion: 0.14
Nodes (30): delete_subtask(), CurrentVerifiedUser, delete, patch, TaskServiceDep, update_subtask(), AssignmentCreate, AssignmentMutationResponse (+22 more)

### Community 13 - "ws/chat.py"
Cohesion: 0.13
Nodes (21): chat_ws(), _is_still_a_member(), _MessageBudget, Query, websocket, Bộ đếm cửa sổ trượt cho một socket., Người dùng còn quyền truy cập dự án này không. Được watchdog gọi định kỳ. Nếu…, authenticate_ws() (+13 more)

### Community 14 - "portfolios/[id]/page.tsx"
Cohesion: 0.14
Nodes (26): PortfolioDetailPage(), PortfoliosPage(), DASHBOARD_KEYS, usePortfolioHealth(), DeletePortfolioDialog(), PortfolioCardProps, PortfolioForm(), PortfolioFormProps (+18 more)

### Community 15 - "WBSService"
Cohesion: 0.11
Nodes (13): EpicStatus, str, MilestoneStatus, str, PhaseStatus, str, str, SprintStatus (+5 more)

### Community 16 - "wbs_service.py"
Cohesion: 0.23
Nodes (19): DateRangeMixin, EpicCreate, EpicResponse, EpicUpdate, MilestoneResponse, PhaseCreate, PhaseDeleteImpact, PhaseNode (+11 more)

### Community 17 - "useTasks.ts"
Cohesion: 0.10
Nodes (38): DeletePhaseDialog(), taskKeys, useInvalidate(), useTaskActions(), timesheetKeys, usePhaseImpact(), wbsKeys, taskService (+30 more)

### Community 18 - "lucide-react"
Cohesion: 0.08
Nodes (30): AuthLayout(), OAuthCallbackContent(), AdminLayout(), TABS, DashboardPage(), DashboardLayout(), ProfilePageContent(), FullPageSpinner() (+22 more)

### Community 19 - "users.py"
Cohesion: 0.06
Nodes (68): AdminUserServiceDep, AIServiceDep, AuditServiceDep, generate_project(), get_ai_job(), CurrentUser, CurrentVerifiedUser, Depends (+60 more)

### Community 20 - "NotificationService"
Cohesion: 0.12
Nodes (25): Endpoint thông báo – Phase 3.3 GET /notifications/ → Liệt kê thông báo (phân…, publish_many(), Publish nhiều message trong một vòng round-trip Redis. `publish()` một lần cho…, Notification, NotificationType, str, MarkReadResponse, NotificationListResponse (+17 more)

### Community 21 - "getApiErrorMessage"
Cohesion: 0.04
Nodes (93): VerifyEmailContent(), verify(), AdminAuditPage(), AIInsightsPage(), ChangeRequestsPage(), ProjectChatPage(), ProjectLayout(), ProjectMembersPage() (+85 more)

### Community 22 - "test_auth_password_recovery.py"
Cohesion: 0.22
Nodes (19): verify_password(), ResetPasswordRequest, build_request(), build_service(), extract_token(), asyncio, parametrize, Request (+11 more)

### Community 23 - "auth_service.py"
Cohesion: 0.11
Nodes (25): clear(), _identity_key(), _lock_seconds(), Bộ đếm đăng nhập thất bại theo TỪNG TÀI KHOẢN, tách khỏi rate limit theo IP.…, Băm email: một bản dump key Redis không nên trở thành danh sách người dùng., Số giây còn phải chờ, hoặc None nếu tài khoản không bị khoá., Đếm một lần đăng nhập sai và khoá tài khoản khi vượt ngưỡng., Xoá lịch sử thất bại sau khi đăng nhập thành công hoặc đặt lại mật khẩu. (+17 more)

### Community 24 - "dashboard.types.ts"
Cohesion: 0.08
Nodes (25): ProjectOverviewCharts, BurndownChart(), BurndownChartProps, formatDate(), DonutChartProps, DonutSlice, TeamBarChartProps, ActiveProjectsGridProps (+17 more)

### Community 25 - "user_service.py"
Cohesion: 0.07
Nodes (35): ServiceUnavailableException, UnauthorizedException, Kết quả tìm kiếm cho bộ chọn thành viên. `email` được che bớt. Địa chỉ đầy đủ…, UserSearchResult, ChangePasswordRequest, DeleteAccountRequest, OAuthConnectResponse, BaseModel (+27 more)

### Community 26 - "ai_tasks.py"
Cohesion: 0.05
Nodes (54): ABC, AIOutput, AIRequest, ImpactReportResponse, BaseModel, BaseModel, Schema response cho SOP-AI-005 (Phân tích rủi ro bằng AI)., RiskReportResponse (+46 more)

### Community 27 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 28 - "milestones.py"
Cohesion: 0.24
Nodes (15): complete_milestone(), create_milestone(), delete_milestone(), get_milestone(), list_milestones(), CurrentUser, CurrentVerifiedUser, delete (+7 more)

### Community 29 - "AdminUserService"
Cohesion: 0.19
Nodes (27): AdminUserCreate, AdminUserUpdate, AdminUserService, User, Kiểm soát hai trường trên payload này vốn là các vector leo thang quyền. Bản…, Quản lý người dùng chỉ dành cho Admin: list/create/update/deactivate bất kỳ tài…, is_admin(), build_db() (+19 more)

### Community 30 - "security.py"
Cohesion: 0.14
Nodes (30): Phân giải và xác thực một bearer token thành một User đang tồn tại và active., _user_from_token(), create_access_token(), create_refresh_token(), decode_token(), Any, datetime, Decode và xác thực một JWT. Trả về None với bất kỳ token nào không hợp lệ/hết… (+22 more)

### Community 31 - "ChatService"
Cohesion: 0.32
Nodes (14): ChatService, get_chat_service(), AsyncSession, Depends, build_actor(), build_message(), asyncio, test_create_message_persists_and_publishes() (+6 more)

### Community 32 - "ForbiddenException"
Cohesion: 0.10
Nodes (31): AIResultResponse, ConflictException, ForbiddenException, NotFoundException, DependencyType, str, str, SubtaskStatus (+23 more)

### Community 33 - "test_ws_hardening.py"
Cohesion: 0.12
Nodes (22): issue(), _key(), Any, Vé dùng một lần cho WebSocket handshake. Trình duyệt không đặt được header tuỳ…, Cấp một vé cho `user_id`. Ném lỗi nếu không kết nối được tới store., Trả về payload của vé rồi vô hiệu hoá nó, hoặc None nếu không dùng được. Đọc-…, redeem(), FakeRedis (+14 more)

### Community 34 - "as_user"
Cohesion: 0.13
Nodes (26): as_user(), Trả về một client đã xác thực với tư cách `user` đã cho. Ghi đè chính…, project(), asyncio, fixture, Kiem tra phan quyen o tang HTTP that. Toan bo bo test truoc day mock o tang…, Chan luon ca doc se khien nguoi dung khong the tim thay nut gui lai email., Mot du an co PM, mot Member, mot Customer va mot nguoi ngoai. (+18 more)

### Community 35 - "package.json"
Cohesion: 0.06
Nodes (29): description, name, overrides, postcss, private, version, autoprefixer, clsx (+21 more)

### Community 36 - "dashboard_service.py"
Cohesion: 0.16
Nodes (22): Các endpoint Dashboard – Phase 3.1 & 3.2 GET /dashboard/summary → Dashboard…, ActiveProjectSummary, BudgetSummary, BurndownPoint, DashboardResponse, MyTaskItem, PortfolioProjectHealth, ProjectDashboardStats (+14 more)

### Community 37 - "tasks.py"
Cohesion: 0.17
Nodes (22): bulk_update_tasks(), change_task_status(), create_subtask(), create_task(), delete_task(), get_task(), list_subtasks(), list_tasks() (+14 more)

### Community 38 - "config.py"
Cohesion: 0.24
Nodes (10): Settings, parametrize, Cấu hình không an toàn phải chặn khởi động, không phải chỉ được ghi chú trong…, Một bản clone mới phải chạy được ngay mà không cần cấu hình gì., Sửa từng lỗi một qua nhiều lần khởi động lại là một cách rất chậm để triển khai., test_a_fully_configured_production_environment_starts(), test_development_is_never_blocked(), test_every_problem_is_reported_at_once() (+2 more)

### Community 39 - "admin.py"
Cohesion: 0.12
Nodes (23): create_role(), delete_role(), get_role(), list_roles(), AsyncSession, CurrentUser, delete, Depends (+15 more)

### Community 40 - "AuthService"
Cohesion: 0.09
Nodes (20): TooManyRequestsException, is_revoked(), _key(), Danh sách thu hồi refresh-token, được hỗ trợ bởi Redis. JWT là tự chứa: một khi…, Số giây mà tombstone phải tồn tại lâu hơn, suy ra từ chính `exp` của token.…, Đánh dấu `jti` không dùng được nữa. Trả về False nếu không kết nối được tới…, `jti` đã bị thu hồi hay chưa. False khi không kết nối được tới store — xem ghi…, revoke() (+12 more)

### Community 41 - "project_service.py"
Cohesion: 0.36
Nodes (12): AuditEventResponse, MilestoneSummary, PhaseSummary, ProjectCapabilities, ProjectDetailResponse, ProjectMemberCreate, ProjectMemberRoleUpdate, ProjectResponse (+4 more)

### Community 42 - "BadRequestException"
Cohesion: 0.14
Nodes (13): BadRequestException, Cặp token nội bộ. KHÔNG dùng làm response model cho route trình duyệt — xem…, TokenResponse, get_oauth_service(), OAuthService, OAuthState, Any, AsyncSession (+5 more)

### Community 43 - "PaginatedResponse"
Cohesion: 0.15
Nodes (17): AdminUserResponse, AuditLogResponse, IDResponse, PaginatedResponse, BaseModel, PaginatedResponse, AuditService, get_audit_service() (+9 more)

### Community 44 - "timedelta"
Cohesion: 0.17
Nodes (22): add_working_days(), date_range(), date, Đếm số ngày làm việc giữa hai ngày., Tạo danh sách các ngày từ start đến end (bao gồm cả hai đầu)., Cộng thêm N ngày làm việc (bỏ qua cuối tuần) vào một ngày., working_days_between(), build_service() (+14 more)

### Community 45 - "conftest.py"
Cohesion: 0.20
Nodes (14): AsyncClient, client(), _disable_rate_limiting(), engine(), event_loop(), AsyncSession, fixture, Role (+6 more)

### Community 46 - "User"
Cohesion: 0.11
Nodes (9): User, AsyncSession, UserRepository, ProjectMemberResponse, ProjectService, Project, Doi vai tro cua mot thanh vien tai cho. Truoc day khong co duong nao lam viec…, Cac assignment cua nguoi dung hien tai, moi nhat truoc. Co gioi han: danh sach… (+1 more)

### Community 47 - "vitest"
Cohesion: 0.21
Nodes (7): AIGeneratorModal(), mocks, useAIJob(), useGenerateProject(), @testing-library/react, @testing-library/user-event, vitest

### Community 48 - "projects.py"
Cohesion: 0.16
Nodes (24): add_project_member(), change_project_member_role(), create_project(), delete_project(), get_project(), get_project_activity(), list_project_members(), list_projects() (+16 more)

### Community 49 - "schedule_optimizer.py"
Cohesion: 0.16
Nodes (28): _build_prompt(), _format_leaves_for_prompt(), _format_tasks_for_prompt(), generate_schedule_optimization(), get_ai_provider(), Any, date, SOP-AI-003: Đề xuất tối ưu lịch trình bằng AI (fast-track / crash / cân bằng… (+20 more)

### Community 50 - "ChatPanel.tsx"
Cohesion: 0.10
Nodes (25): Avatar(), AvatarProps, UserTable(), ChatMessageItem(), Props, ChatPanel(), handleSend(), Props (+17 more)

### Community 51 - "validate_password_policy"
Cohesion: 0.40
Nodes (3): Kiểm tra chính sách mật khẩu dùng chung giữa đăng ký và đặt lại mật khẩu., validate_password_policy(), field_validator

### Community 52 - "Task"
Cohesion: 0.10
Nodes (21): Subtask, Task, AsyncSession, TaskRepository, fixture, Tai nguyen cua du an nay khong duoc ro ri sang du an khac., two_projects(), _index_names() (+13 more)

### Community 53 - "test_user_profile_settings.py"
Cohesion: 0.29
Nodes (19): avatar_bytes(), build_db(), build_service(), build_user(), asyncio, State phải dùng được đúng một lần, và chỉ từ trình duyệt đã tạo ra nó., test_avatar_normalization_outputs_square_webp_and_rejects_corrupt_data(), test_avatar_upload_checks_size_and_replaces_previous_object() (+11 more)

### Community 54 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, axios, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @hookform/resolvers, js-cookie (+12 more)

### Community 55 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, eslint-config-next, jsdom, postcss, tailwindcss, @testing-library/dom (+12 more)

### Community 56 - "ChangeRequestDetail.tsx"
Cohesion: 0.12
Nodes (24): ChangeRequestDetail(), isImpactReport(), RISK_CLASSES, ChangeRequestForm(), ChangeRequestList(), STATUS_CLASSES, StatusBadge(), changeRequestKeys (+16 more)

### Community 57 - "PortfolioRepository"
Cohesion: 0.13
Nodes (7): BaseRepository, Any, AsyncSession, PortfolioRepository, AsyncSession, datetime, ModelType

### Community 58 - "ConnectionManager"
Cohesion: 0.20
Nodes (13): ConnectionManager, WebSocket, Registry theo từng tiến trình của các kết nối WebSocket đang hoạt động, nhóm…, Gửi `payload` tới mọi kết nối trên `channel` CHỈ trong tiến trình NÀY., fake_ws(), FakeWebSocket, asyncio, Vật thay thế cho một Starlette WebSocket. Cố ý KHÔNG dùng SimpleNamespace:… (+5 more)

### Community 59 - "Role"
Cohesion: 0.16
Nodes (21): main(), Script seed cơ sở dữ liệu. Khởi tạo dữ liệu mặc định: 7 Roles, Permissions, và…, seed(), Permission, Role, RoleCreate, RoleUpdate, AsyncSession (+13 more)

### Community 60 - "create_dependency"
Cohesion: 0.25
Nodes (9): create_dependency(), delete_dependency(), list_dependencies(), CurrentUser, CurrentVerifiedUser, delete, get, post (+1 more)

### Community 61 - "FastAPI"
Cohesion: 0.08
Nodes (32): list_permissions(), AsyncSession, Depends, get, Liệt kê chỉ đọc danh mục quyền cố định đã được seed (resource:action). Người…, get_current_active_superuser(), get_current_user(), get_current_user_media() (+24 more)

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
Cohesion: 0.19
Nodes (19): active_timer(), create_worklog(), delete_worklog(), list_task_worklogs(), project_worklogs(), CurrentUser, CurrentVerifiedUser, date (+11 more)

### Community 68 - "useNotifications.ts"
Cohesion: 0.17
Nodes (19): NotificationsPage(), NotificationBell(), NotificationItem(), Props, TYPE_META, NotificationPanel(), Props, NOTIFICATION_KEYS (+11 more)

### Community 69 - "phase2_common.py"
Cohesion: 0.08
Nodes (45): str, TaskStatus, TaskStatusUpdate, TaskUpdate, notify_project_team(), ProjectContext, Tạo một dòng Notification cho mỗi dòng `project_members` của `project_id`, bỏ…, _apply_status_side_effects() (+37 more)

### Community 70 - "Rà soát code và nâng cấp giao diện — 2026-09-15"
Cohesion: 0.25
Nodes (7): Giao diện, Giới hạn môi trường và việc còn lại, Lỗi đã sửa, Phạm vi, Rà soát code và nâng cấp giao diện — 2026-09-15, Tài liệu kỹ thuật đối chiếu, Xác minh

### Community 71 - "DashboardService"
Cohesion: 0.14
Nodes (14): ActiveProjectSummary, PortfolioHealthResponse, Dữ liệu phản hồi cho GET /dashboards/portfolios/{portfolio_id}/health, DashboardService, _iso_week_bounds(), date, Trả về danh sách ID dự án mà người dùng này nhìn thấy được., Trả về (thứ hai, chủ nhật) của tuần ISO chứa *today*. (+6 more)

### Community 72 - "System Architecture Design"
Cohesion: 0.13
Nodes (15): AI Project Planning & Portfolio Management System, Backend Architecture, Backend Layer, Celery Beat & Scheduled Tasks, Change History, Cấu trúc thư mục Backend thực tế, Database Schema (SQLAlchemy — 8 Domains, 34 Tables), ERD tổng quan (+7 more)

### Community 73 - "ResourceService"
Cohesion: 0.09
Nodes (32): Assignment, set_current_project_id(), Worklog, get_resource_service(), AsyncSession, date, Depends, Worklog cua mot task, moi nhat truoc. Co gioi han: mot task chay dai tich luy… (+24 more)

### Community 74 - "AuditLog"
Cohesion: 0.16
Nodes (16): get_client_ip(), get_current_project_id(), Context theo từng request mà code ở tầng service cần nhưng không được truyền…, Dự án của request hiện tại, hoặc None với thao tác không thuộc dự án nào (quản…, AuditLog, _captured_where_text(), asyncio, Feed hoạt động trên dashboard phải bị giới hạn trong các dự án người xem thấy… (+8 more)

### Community 75 - "test_resource_warnings.py"
Cohesion: 0.32
Nodes (14): _assignment(), asyncio, Canh bao qua tai nhan su - 388 dong truoc day chi co dung mot bai test., 40 gio trai deu tren 10 ngay la 4 gio moi ngay, khong phai qua tai., Moi assignment rieng le deu on; van de nam o cho chung chong len nhau., Mot ngay chi sinh mot canh bao; 'dang nghi phep' la ly do co ich hon., _service(), test_a_reasonable_workload_raises_nothing() (+6 more)

### Community 76 - "utils/cpm.py"
Cohesion: 0.15
Nodes (19): backward_pass(), build_graph(), compute_cpm_for_project(), CPMResult, _edges_by_predecessor(), _edges_by_successor(), forward_pass(), _normalize_type() (+11 more)

### Community 78 - "get_chat_history"
Cohesion: 0.19
Nodes (14): get_chat_history(), get_chat_unread_count(), mark_chat_read(), post_chat_message(), CurrentUser, CurrentVerifiedUser, ge, get (+6 more)

### Community 79 - "config.ts"
Cohesion: 0.43
Nodes (5): DEFAULT_LOCALE, isLocale(), Locale, LOCALE_COOKIE, LOCALES

### Community 80 - "useRiskAnalysis.ts"
Cohesion: 0.13
Nodes (17): isRiskLevel(), parseRiskResult(), RiskWidget(), IN_PROGRESS, riskAnalysisJobKeys, useRequestRiskAnalysis(), useRiskAnalysisJob(), RiskAnalysisJobResponse (+9 more)

### Community 81 - "my_assignments"
Cohesion: 0.18
Nodes (12): create_assignment(), delete_assignment(), my_assignments(), CurrentUser, CurrentVerifiedUser, delete, ge, get (+4 more)

### Community 82 - "Software Requirements Specification (SRS)"
Cohesion: 0.14
Nodes (14): 1.1 Mục đích, 1.2 Phạm vi, 1.3 Tài liệu tham chiếu, 1. Giới thiệu (Introduction), 2.1 Công nghệ (Technology Stack), 2.2 Mô hình kết nối (Integration Model), 2. Kiến trúc Hệ thống (System Architecture), 2 WebSocket Endpoints (`/ws/...`) (+6 more)

### Community 83 - "approvals.py"
Cohesion: 0.14
Nodes (14): create_approvals(), delete_approvals(), get_approvals(), list_approvals(), delete, get, post, put (+6 more)

### Community 84 - "test_change_request_service.py"
Cohesion: 0.11
Nodes (34): create_change_request(), get_change_request(), list_change_requests(), CurrentUser, CurrentVerifiedUser, get, post, submit_change_request() (+26 more)

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

### Community 94 - "ProjectRepository"
Cohesion: 0.11
Nodes (8): ProjectMethodology, ProjectStatus, str, ProjectRepository, AsyncSession, date, Doi vai tro ma giu nguyen dong thanh vien - va giu nguyen `joined_at`., date

### Community 95 - "list_notifications"
Cohesion: 0.15
Nodes (18): delete_notification(), get_unread_count(), list_notifications(), mark_all_notifications_read(), mark_notification_read(), CurrentUser, delete, ge (+10 more)

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
Cohesion: 0.20
Nodes (7): apiOrigin, avatarOrigins, csp, nextConfig, securityHeaders, withNextIntl, wsOrigin

### Community 100 - "WBSServiceDep"
Cohesion: 0.19
Nodes (16): create_phase(), delete_phase(), get_phase(), get_wbs(), list_phases(), phase_delete_impact(), CurrentUser, CurrentVerifiedUser (+8 more)

### Community 101 - "3. Yêu cầu chức năng (Functional Requirements)"
Cohesion: 0.15
Nodes (13): 3.10 Change Request & Multi-Level Approvals (SRS-CR), 3.11 Project Versioning & Rollback (SRS-VER), 3.12 Document & Reporting (SRS-RPT), 3.1 Authentication & Authorization (SRS-AUTH), 3.2 Quản trị Admin & Audit Timeline (SRS-ADMIN), 3.3 Quản lý Phân cấp Dự án & Thành viên (SRS-PM), 3.4 Task Dependency & Scheduling (SRS-DEP), 3.5 Thuật toán Đường găng — Critical Path Method (SRS-CPM) (+5 more)

### Community 102 - "oauth_service.py"
Cohesion: 0.19
Nodes (14): code_challenge_for(), consume(), issue(), _key(), new_code_verifier(), Any, Store phía server cho tham số `state` của OAuth, kèm ràng buộc theo trình duyệt…, Thuộc tính cho cookie ràng buộc luồng OAuth với trình duyệt. `lax` chứ không… (+6 more)

### Community 103 - "Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại"
Cohesion: 0.13
Nodes (14): 4 trụ cột (song song, sau Task 1), Checkpoint: 4 trụ cột backend/frontend cô lập xong, Checkpoint: Tích hợp hoàn chỉnh, Implementation Plan: Phase 3 (AI Features) — 4 trụ cột AI còn lại, Kiến trúc mới, Kiến trúc tái sử dụng (đã có sẵn, không cần sửa), Nền tảng (tuần tự, làm trước, chặn Task 2), Nối dây (tuần tự, tôi tự làm) (+6 more)

### Community 104 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:watch, type-check

### Community 105 - "Chi tiết kế hoạch triển khai"
Cohesion: 0.15
Nodes (12): 5 Trụ cột AI chính:, Chi tiết kế hoạch triển khai, Danh mục tính năng triển khai theo Phase, GIAI ĐOẠN 3.1 – AI Provider Abstraction Layer & Base Infrastructure, GIAI ĐOẠN 3.2 – AI Project Generator Endpoint & Frontend UI (SOP-AI-001), GIAI ĐOẠN 3.3 – AI Impact Analysis (SOP-AI-002), GIAI ĐOẠN 3.4 – AI Schedule Optimization (SOP-AI-003), GIAI ĐOẠN 3.5 – AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) (+4 more)

### Community 106 - "WBSServiceDep"
Cohesion: 0.23
Nodes (14): complete_sprint(), create_sprint(), delete_sprint(), get_sprint(), list_sprints(), CurrentUser, CurrentVerifiedUser, delete (+6 more)

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
Cohesion: 0.18
Nodes (13): ChatMessage, Một tin nhắn trong kênh chat nhóm theo phạm vi project. Mỗi Project có một…, ChatHistoryResponse, ChatMessageCreate, ChatMessageResponse, ChatUnreadResponse, BaseModel, Schema cho tính năng chat nhóm theo phạm vi dự án. (+5 more)

### Community 112 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @executeautomation/playwright-mcp-server

### Community 145 - "scheduling_tasks.py"
Cohesion: 0.14
Nodes (15): generate_docx_task(), generate_xlsx_task(), task, Tạo báo cáo XLSX cho một dự án., # TODO: Cài đặt phần tạo XLSX bằng openpyxl, Tạo báo cáo DOCX cho một dự án., # TODO: Cài đặt phần tạo DOCX bằng python-docx, _pending_key() (+7 more)

### Community 146 - "Findings"
Cohesion: 0.29
Nodes (6): Admin / RBAC Feature (100% Complete), Backend Architecture (Verified & Tested), Findings, Frontend Architecture & Quality, Key Models, Real-Time Project Chat & WebSocket Notification (100% Complete)

### Community 147 - "11. Cài đặt và Chạy hệ thống"
Cohesion: 0.29
Nodes (7): 11. Cài đặt và Chạy hệ thống, 1. Khởi động Backend (FastAPI), 2. Khởi động Celery Worker & Celery Beat, 3. Khởi động Frontend (Next.js 15), Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker Compose, Cách 2: Cài đặt và chạy thủ công (Local Development), Điều kiện tiên quyết

### Community 148 - "4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)"
Cohesion: 0.33
Nodes (6): 4.1 Quy trình khởi tạo dự án bằng AI (SOP-AI-001), 4.2 Quy trình phân bổ nhân sự (SOP-RM-001), 4.3 Quản lý yêu cầu thay đổi (Change Request Workflow - SOP-CR-001), 4.4 Quy trình Tracking và Tính toán CPM (SOP-PM-002 & SOP-PM-003), 4.5 Giao tiếp Real-time & Giám sát Lịch trình (SOP-CHAT-001 & SOP-NOTI-001), 4. Các Quy trình nghiệp vụ chính (Business Process - SOPs)

### Community 149 - "impact_analyzer.py"
Cohesion: 0.13
Nodes (32): Dependency, str, RiskLevel, _build_prompt(), generate_impact_analysis(), get_ai_provider(), Any, AsyncSession (+24 more)

### Community 150 - "3. Technology Stack"
Cohesion: 0.50
Nodes (4): 3. Technology Stack, Backend (Python), Frontend (Next.js / React / TypeScript), Hạ tầng Docker (7 Dịch vụ trong `docker-compose.yml`)

### Community 151 - "risk_analyzer.py"
Cohesion: 0.07
Nodes (54): str, RiskLevel, RiskReport, AIResponseError, _extract_balanced_object(), parse_json_object(), Any, Xử lý phòng vệ, dùng chung cho output của model và các prompt do người dùng… (+46 more)

### Community 152 - "test_dashboard_metrics.py"
Cohesion: 0.24
Nodes (13): asyncio, So hoc cua dashboard_service - 544 dong truoc day khong co test nao. Day cung…, DashboardService voi mot execute() tra ve `rows` da dinh san., Neu khong, mot du an gan xong lai hien ra nhu chua bat dau., Duong thoat som phai chay truoc cac truy van gop, khong phai sau., Ba truy van cho mot thanh vien la 3N round-trip; du an 30 nguoi truoc day ton…, _service_with_rows(), test_burndown_accumulates_completions_across_the_window() (+5 more)

### Community 153 - "12. Cấu hình & Biến môi trường"
Cohesion: 0.67
Nodes (3): 12. Cấu hình & Biến môi trường, Backend Environment (`backend/.env`), Frontend Environment (`frontend/.env.local`)

### Community 154 - "1. Tổng quan dự án"
Cohesion: 0.67
Nodes (3): 1. Tổng quan dự án, Mục tiêu cốt lõi (tầm nhìn sản phẩm — không phải toàn bộ đã hoàn thành, xem [§14 Roadmap](#14-roadmap-phát-triển)):, Trạng thái triển khai thực tế (cập nhật 2026-09-16)

### Community 155 - "9. Thuật toán cốt lõi & Hạ tầng Real-time"
Cohesion: 0.67
Nodes (3): 9. Thuật toán cốt lõi & Hạ tầng Real-time, Thuật toán Critical Path Method (Pure Python in `app/utils/cpm.py`), WebSocket ConnectionManager & Redis Pub/Sub Bus (`app/core/ws_manager.py`)

### Community 156 - "useResourceRecommendation.ts"
Cohesion: 0.26
Nodes (10): IN_PROGRESS, resourceRecommendationJobKeys, ResourceRecommendationJobResponse, ResourceRecommendationResultResponse, resourceRecommendationService, ResourceCandidate, ResourceRecommendationDisplayItem, ResourceRecommendationItem (+2 more)

### Community 157 - "create_epic"
Cohesion: 0.23
Nodes (12): create_epic(), delete_epic(), get_epic(), list_epics(), CurrentUser, CurrentVerifiedUser, delete, get (+4 more)

### Community 158 - "useScheduleOptimization.ts"
Cohesion: 0.24
Nodes (9): IN_PROGRESS, scheduleOptimizationJobKeys, scheduleOptimizationService, ScheduleOptimizationAction, ScheduleOptimizationJobResponse, ScheduleOptimizationJobResult, ScheduleOptimizationJobStatus, ScheduleOptimizationResult (+1 more)

### Community 159 - "rate_limit.py"
Cohesion: 0.25
Nodes (10): client_key(), Request, Response, rate_limit_exceeded_handler(), Rate limiter dùng chung cho các endpoint dễ bị lạm dụng (auth, search, upload).…, Key cho rate-limit: là user đã xác thực khi có thể xác định rẻ, nếu không thì…, Số giây cho tới khi cửa sổ của caller được reset. Ưu tiên số liệu cửa sổ trực…, 429 theo cùng hình dạng `{"detail": ...}` như mọi lỗi khác trong API này. Cố… (+2 more)

### Community 160 - "Todo: Phase 3 (AI Features) — 4 trụ cột còn lại"
Cohesion: 0.18
Nodes (10): Checkpoint: Hoàn chỉnh, Checkpoint: Sau Task 1, Checkpoint: Sau Task 2–5 (chạy song song), Task 1: Change Request CRUD tối giản, Task 2: AI Impact Analysis (SOP-AI-002) — song song, sau Task 1, Task 3: AI Schedule Optimization (SOP-AI-003) — song song, sau Task 1, Task 4: AI Resource Recommendation (SOP-RM-001 / SOP-AI-004) — song song, sau Task 1, Task 5: AI Risk Analysis (SOP-AI-005) — song song, sau Task 1 (+2 more)

### Community 161 - "SchedulingService"
Cohesion: 0.24
Nodes (8): CPMResponse, CPMTask, BaseModel, Schema cho phân tích đường găng. Engine CPM (app/utils/cpm.py) đã hoàn chỉnh từ…, get_scheduling_service(), Depends, Truy vấn chỉ đọc trên lịch trình đã được tính ra. Bản thân việc tính toán chạy…, SchedulingService

### Community 163 - "ProjectCreate"
Cohesion: 0.29
Nodes (4): ProjectCreate, ProjectUpdate, field_validator, test_portfolio_and_project_schema_validation()

### Community 164 - "ValueError"
Cohesion: 0.11
Nodes (10): model_validator, Từ chối khởi động ngoài môi trường development nếu vẫn dùng các secret…, field_validator, model_validator, Cung rang buoc nhu khi tao - xem ghi chu o ProjectUpdate., model_validator, Cung rang buoc nhu khi tao. Chi Create co kiem tra nay, nen mot lan PATCH van…, model_validator (+2 more)

### Community 165 - "get_dashboard_summary"
Cohesion: 0.33
Nodes (9): get_dashboard_summary(), get_portfolio_health(), get_project_stats(), CurrentUser, get, Tổng quan Dashboard trang chủ cho người dùng đã xác thực. Trả về: - Số liệu…, Các chỉ số sức khỏe của portfolio: tiến độ tổng thể, trạng thái từng dự án, số…, Dữ liệu Dashboard dự án: - Phân bố trạng thái task (dữ liệu biểu đồ donut) -… (+1 more)

### Community 166 - "AIService"
Cohesion: 0.20
Nodes (18): AIJobResponse, AIRequestStatus, AIRequestType, str, AIJobResponse, AIService, AsyncSession, Tao AIRequest + xep hang Celery task — dung chung cho ca 4 loai phan tich AI o… (+10 more)

### Community 168 - "test_large_projects_recalculate_in_the_background"
Cohesion: 0.29
Nodes (7): asyncio, Một lần kéo thả trên dự án vài nghìn task không nên kéo theo hàng nghìn lệnh…, force_sync là đường mà worker dùng; thiếu nó thì nó tự đẩy việc cho chính mình…, Engine da hoan chinh tu Phase 2 nhung chua tung duoc expose: client khong co…, test_large_projects_recalculate_in_the_background(), test_the_cpm_endpoint_reports_float_and_the_critical_chain(), test_the_worker_itself_never_re_enqueues()

### Community 169 - "forgot-password/page.tsx"
Cohesion: 0.29
Nodes (3): metadata, metadata, next

### Community 170 - "ChatReadState"
Cohesion: 0.33
Nodes (3): ChatReadState, Theo dõi, theo từng (project, user), tin nhắn chat cuối cùng mà user đã đọc —…, ChatUnreadResponse

### Community 171 - "get_critical_path"
Cohesion: 0.40
Nodes (5): get_critical_path(), CurrentUser, get, Phân tích đường găng của một dự án. Chỉ đọc: nó báo cáo lịch trình đã được tính…, SchedulingServiceDep

### Community 172 - "resource_leveling"
Cohesion: 0.40
Nodes (5): CurrentUser, date, get, ResourceServiceDep, resource_leveling()

### Community 173 - "get_dashboard_service"
Cohesion: 0.50
Nodes (3): get_dashboard_service(), AsyncSession, Depends

### Community 174 - "get_project_service"
Cohesion: 0.50
Nodes (3): get_project_service(), AsyncSession, Depends

### Community 175 - "get_task_service"
Cohesion: 0.50
Nodes (3): get_task_service(), AsyncSession, Depends

### Community 176 - "get_wbs_service"
Cohesion: 0.50
Nodes (3): get_wbs_service(), AsyncSession, Depends

## Knowledge Gaps
- **376 isolated node(s):** `npx`, `@executeautomation/playwright-mcp-server`, `extends`, `next/core-web-vitals`, `apiOrigin` (+371 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1162 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `db/base.py`, `resource_recommender.py`, `portfolio_service.py`, `task_service.py`, `ws/chat.py`, `WBSService`, `wbs_service.py`, `users.py`, `auth_service.py`, `user_service.py`, `ai_tasks.py`, `AdminUserService`, `security.py`, `ChatService`, `ForbiddenException`, `SchedulingService`, `as_user`, `dashboard_service.py`, `AIService`, `AuthService`, `project_service.py`, `ChatReadState`, `PaginatedResponse`, `BadRequestException`, `conftest.py`, `timedelta`, `projects.py`, `Role`, `FastAPI`, `phase2_common.py`, `DashboardService`, `ResourceService`, `utils/cpm.py`, `test_change_request_service.py`, `ProjectRepository`, `test_oauth_account_takeover.py`, `oauth_service.py`, `chat_service.py`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `BadRequestException` connect `BadRequestException` to `ForbiddenException`, `oauth_service.py`, `.__init__`, `AuthService`, `portfolio_service.py`, `oauth.py`, `project_service.py`, `task_service.py`, `ResourceService`, `User`, `WBSService`, `wbs_service.py`, `FastAPI`, `auth_service.py`, `user_service.py`, `ai_tasks.py`, `AdminUserService`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `ForbiddenException` connect `ForbiddenException` to `portfolio_service.py`, `task_service.py`, `ws/chat.py`, `WBSService`, `users.py`, `NotificationService`, `auth_service.py`, `user_service.py`, `AdminUserService`, `security.py`, `ChatService`, `dashboard_service.py`, `AIService`, `admin.py`, `.__init__`, `AuthService`, `project_service.py`, `User`, `Role`, `FastAPI`, `phase2_common.py`, `DashboardService`, `ResourceService`, `test_change_request_service.py`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 50 inferred relationships involving `User` (e.g. with `generate_project()` and `list_audit_logs()`) actually correct?**
  _`User` has 50 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ForbiddenException` (e.g. with `list_roles()` and `_is_still_a_member()`) actually correct?**
  _`ForbiddenException` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 38 inferred relationships involving `WBSService` (e.g. with `BadRequestException` and `ConflictException`) actually correct?**
  _`WBSService` has 38 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `NotFoundException` (e.g. with `_is_still_a_member()` and `AdminUserService`) actually correct?**
  _`NotFoundException` has 16 INFERRED edges - model-reasoned connections that need verification._